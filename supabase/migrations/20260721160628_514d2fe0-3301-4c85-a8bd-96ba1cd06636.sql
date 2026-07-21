CREATE TABLE IF NOT EXISTS public.payment_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_uzs bigint NOT NULL CHECK (amount_uzs > 0),
  currency text NOT NULL DEFAULT 'UZS',
  plan text NOT NULL,
  provider text NOT NULL CHECK (provider IN ('payme','click','uzum')),
  provider_txn_id text,
  state text NOT NULL DEFAULT 'created'
    CHECK (state IN ('created','prepared','paid','canceled','refunded','failed')),
  perform_time timestamptz,
  cancel_time timestamptz,
  cancel_reason int,
  raw_payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_payment_orders_user ON public.payment_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_provider_txn ON public.payment_orders(provider, provider_txn_id);

GRANT SELECT ON public.payment_orders TO authenticated;
GRANT ALL ON public.payment_orders TO service_role;

ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own orders readable"
  ON public.payment_orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE TRIGGER trg_payment_orders_updated_at
  BEFORE UPDATE ON public.payment_orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();