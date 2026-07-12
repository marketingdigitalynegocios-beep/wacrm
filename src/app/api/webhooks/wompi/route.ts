import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Initialize a Supabase client with the Service Role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event, data, timestamp } = body;

    console.log('[Wompi Webhook] Evento recibido:', event);

    if (event !== 'transaction.updated') {
      return NextResponse.json({ received: true });
    }

    const transaction = data.transaction;
    const { id, status, amount_in_cents, reference, signature } = transaction;

    const eventsSecret = process.env.WOMPI_INTEGRITY_SECRET || "";

    // Validar integridad de la firma (Checksum)
    // Fórmula: sha256(id + status + amount_in_cents + timestamp + secret)
    const stringToHash = `${id}${status}${amount_in_cents}${timestamp}${eventsSecret}`;
    const calculatedChecksum = crypto.createHash('sha256').update(stringToHash).digest('hex');

    if (signature.checksum !== calculatedChecksum) {
      console.error('[Wompi Webhook] Firma INVÁLIDA. Posible intento de fraude o secreto mal configurado.');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log('[Wompi Webhook] Firma validada exitosamente.');

    // Reference expected format for subscriptions: accountId_planKey
    // Example: "123e4567-e89b-12d3-a456-426614174000_profesional"
    if (!reference || !reference.includes('_')) {
      console.error('[Wompi Webhook] Referencia inválida o no corresponde a una suscripción SaaS:', reference);
      return NextResponse.json({ error: 'Invalid reference format' }, { status: 400 });
    }

    const [accountId, planKey] = reference.split('_');
    const validPlans = ['emprendedor', 'profesional', 'free'];
    const planName = validPlans.includes(planKey) ? planKey : 'free';

    if (status === 'APPROVED') {
      console.log(`[Wompi Webhook] Pago aprobado para referencia: ${reference}`);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days subscription

      const { error } = await supabase
        .from('accounts')
        .update({
          plan_tier: planName,
          subscription_status: 'active',
          subscription_expires_at: expiresAt.toISOString(),
          last_payment_status: 'APPROVED',
          wompi_subscription_id: id // Using transaction ID as a proxy for subscription tracking if Wompi tokens aren't used for recurring
        })
        .eq('id', accountId);

      if (error) {
        console.error('[Wompi Webhook] Error actualizando cuenta:', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      console.log(`[Wompi Webhook] Cuenta ${accountId} actualizada exitosamente al plan ${planName}`);
    } else {
      console.log(`[Wompi Webhook] Transacción ${id} con estado: ${status}`);
      
      // Update last_payment_status
      await supabase
        .from('accounts')
        .update({ last_payment_status: status })
        .eq('id', accountId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Wompi Webhook] Error crítico:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
