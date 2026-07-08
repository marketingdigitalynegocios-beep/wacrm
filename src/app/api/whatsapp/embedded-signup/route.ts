import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { encrypt } from '@/lib/whatsapp/encryption'

async function resolveAccountId(supabase: any, userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('account_id')
    .eq('user_id', userId)
    .maybeSingle()
  if (error || !data?.account_id) return null
  return data.account_id as string
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accountId = await resolveAccountId(supabase, user.id)
    if (!accountId) {
      return NextResponse.json({ error: 'Your profile is not linked to an account.' }, { status: 403 })
    }

    const body = await request.json()
    const { accessToken: rawAccessToken, code } = body

    if (!rawAccessToken && !code) {
      return NextResponse.json({ error: 'accessToken or code is required' }, { status: 400 })
    }

    const appId = process.env.NEXT_PUBLIC_META_APP_ID
    const appSecret = process.env.META_APP_SECRET
    const systemToken = process.env.META_SYSTEM_USER_TOKEN
    const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN

    if (!appId || !appSecret || !systemToken) {
      return NextResponse.json({ error: 'Server is missing Meta App credentials' }, { status: 500 })
    }

    let accessToken = rawAccessToken;

    // If we received a code (new Oauth flow), exchange it for an access token
    if (code) {
      const tokenRes = await fetch(`https://graph.facebook.com/v20.0/oauth/access_token?client_id=${appId}&redirect_uri=&client_secret=${appSecret}&code=${code}`)
      const tokenData = await tokenRes.json()
      
      if (tokenData.access_token) {
        accessToken = tokenData.access_token
      } else {
        console.error('Code exchange failed:', tokenData)
        return NextResponse.json({ error: 'Failed to exchange OAuth code for access token' }, { status: 400 })
      }
    }

    // 1. Debug the token to find the shared WABA ID
    const debugUrl = `https://graph.facebook.com/v20.0/debug_token?input_token=${accessToken}&access_token=${appId}|${appSecret}`
    const debugRes = await fetch(debugUrl)
    const debugData = await debugRes.json()

    if (debugData.error || !debugData.data?.is_valid) {
      return NextResponse.json({ error: 'Invalid access token from Meta' }, { status: 400 })
    }

    const granularScopes = debugData.data.granular_scopes || []
    const waScope = granularScopes.find((s: any) => s.scope === 'whatsapp_business_management')
    
    if (!waScope || !waScope.target_ids || waScope.target_ids.length === 0) {
      return NextResponse.json({ error: 'No WhatsApp Business Account was shared.' }, { status: 400 })
    }

    const wabaId = waScope.target_ids[0]

    // 2. Fetch the phone numbers for this WABA using our System User Token
    const phonesUrl = `https://graph.facebook.com/v20.0/${wabaId}/phone_numbers?access_token=${systemToken}`
    const phonesRes = await fetch(phonesUrl)
    const phonesData = await phonesRes.json()

    if (phonesData.error) {
      return NextResponse.json({ error: `Failed to fetch phone numbers: ${phonesData.error.message}` }, { status: 400 })
    }

    if (!phonesData.data || phonesData.data.length === 0) {
      return NextResponse.json({ error: 'No phone numbers found in the shared WhatsApp Business Account.' }, { status: 400 })
    }

    // For simplicity, we auto-select the first phone number
    const phoneNumberId = phonesData.data[0].id

    // 3. Encrypt our system token to store it seamlessly
    let encryptedAccessToken: string
    let encryptedVerifyToken: string | null = null
    try {
      encryptedAccessToken = encrypt(systemToken)
      if (verifyToken) {
        encryptedVerifyToken = encrypt(verifyToken)
      }
    } catch (err) {
      return NextResponse.json({ error: 'Failed to encrypt tokens' }, { status: 500 })
    }

    const baseRow = {
      phone_number_id: phoneNumberId,
      waba_id: wabaId,
      access_token: encryptedAccessToken,
      verify_token: encryptedVerifyToken,
      status: 'connected',
      connected_at: new Date().toISOString(),
      registered_at: new Date().toISOString(), // Since it's Embedded Signup, it's typically pre-registered or we can skip manual registration
      updated_at: new Date().toISOString(),
    }

    const { data: existing } = await supabase
      .from('whatsapp_config')
      .select('id')
      .eq('account_id', accountId)
      .maybeSingle()

    if (existing) {
      const { error: updateError } = await supabase
        .from('whatsapp_config')
        .update(baseRow)
        .eq('account_id', accountId)
      if (updateError) throw updateError
    } else {
      const { error: insertError } = await supabase
        .from('whatsapp_config')
        .insert({
          account_id: accountId,
          user_id: user.id,
          ...baseRow,
        })
      if (insertError) throw insertError
    }

    return NextResponse.json({
      success: true,
      phone_number_id: phoneNumberId,
      waba_id: wabaId
    })
  } catch (error) {
    console.error('Error in Embedded Signup POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
