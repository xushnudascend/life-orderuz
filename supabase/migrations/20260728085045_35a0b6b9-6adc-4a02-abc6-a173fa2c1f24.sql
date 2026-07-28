ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_until TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION public.prevent_self_billing_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_privileged boolean := (current_setting('role', true) = 'service_role')
                        OR (auth.role() = 'service_role');
BEGIN
  IF is_privileged THEN
    RETURN NEW;
  END IF;
  IF NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier
     OR NEW.subscription_until IS DISTINCT FROM OLD.subscription_until THEN
    RAISE EXCEPTION 'subscription fields can only be changed by server-side billing code';
  END IF;
  RETURN NEW;
END;
$$;

CREATE INDEX IF NOT EXISTS payment_orders_user_state_idx
  ON public.payment_orders (user_id, state);
