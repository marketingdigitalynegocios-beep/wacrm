-- ============================================================
-- 031_add_billing_to_accounts.sql — Campos de facturación SaaS
--
-- Añade campos a la tabla accounts para gestionar el estado de 
-- la suscripción mediante Wompi (u otro proveedor SaaS).
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_tier_enum') THEN
    CREATE TYPE plan_tier_enum AS ENUM ('free', 'emprendedor', 'profesional');
  END IF;
END $$;

ALTER TABLE accounts
  ADD COLUMN IF NOT EXISTS plan_tier plan_tier_enum NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'inactive',
  ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS wompi_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS last_payment_status TEXT;

-- Índice útil para buscar cuentas cuya suscripción está por expirar
CREATE INDEX IF NOT EXISTS idx_accounts_subscription_expires
  ON accounts(subscription_expires_at)
  WHERE subscription_expires_at IS NOT NULL;
