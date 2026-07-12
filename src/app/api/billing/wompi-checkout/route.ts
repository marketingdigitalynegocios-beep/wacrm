import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const PLAN_PRICES: Record<string, number> = {
  emprendedor: 4990000, // $49.900 COP en centavos
  profesional: 9990000, // $99.900 COP en centavos
};

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('account_id, account_role')
      .eq('user_id', user.id)
      .single();

    if (!profile || !profile.account_id) {
      return NextResponse.json({ error: 'No account found' }, { status: 400 });
    }

    // Only owner and admin can manage billing
    if (profile.account_role !== 'owner' && profile.account_role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { plan } = body;

    if (!plan || !PLAN_PRICES[plan]) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    const amountInCents = PLAN_PRICES[plan];
    const currency = 'COP';
    const uuid = crypto.randomUUID();
    
    // Prefix allows a central Webhook Router (like watienda) to forward the event to this project.
    // Uses WOMPI_PROJECT_PREFIX env var, defaults to 'CHATFLOW'
    const projectPrefix = process.env.WOMPI_PROJECT_PREFIX || 'CHATFLOW';
    
    // Format: PREFIX_accountId_planKey_uuid 
    // This allows the webhook router to route it, and our webhook to extract the account and plan
    const reference = `${projectPrefix}_${profile.account_id}_${plan}_${uuid}`;

    const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

    if (!publicKey) {
      console.error('[Wompi Checkout] NEXT_PUBLIC_WOMPI_PUBLIC_KEY is not defined.');
      return NextResponse.json({ error: 'Payment gateway configuration error' }, { status: 500 });
    }

    let signature = '';
    if (integritySecret) {
      // Signature formula: sha256(reference + amountInCents + currency + secret)
      const stringToHash = `${reference}${amountInCents}${currency}${integritySecret}`;
      signature = crypto.createHash('sha256').update(stringToHash).digest('hex');
    }

    // Determine the base URL for the redirect
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const redirectUrl = `${origin}/settings?tab=billing`;

    // Construct the Wompi Web Checkout URL
    const params = new URLSearchParams({
      'public-key': publicKey,
      'currency': currency,
      'amount-in-cents': amountInCents.toString(),
      'reference': reference,
      'redirect-url': redirectUrl,
    });

    if (signature) {
      params.append('signature:integrity', signature);
    }

    const checkoutUrl = `https://checkout.wompi.co/p/?${params.toString()}`;

    return NextResponse.json({ checkoutUrl });

  } catch (error: any) {
    console.error('[Wompi Checkout Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
