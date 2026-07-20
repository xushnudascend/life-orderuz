
-- 1) Block self-upgrade on profiles.subscription_tier (and related billing fields)
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
  IF NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier THEN
    RAISE EXCEPTION 'subscription_tier can only be changed by server-side billing code';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_prevent_self_billing_change ON public.profiles;
CREATE TRIGGER profiles_prevent_self_billing_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_self_billing_change();

-- 2) Cap client-written XP on xp_events
CREATE OR REPLACE FUNCTION public.enforce_xp_event_bounds()
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
  -- Per-event cap for client-originated XP writes.
  IF NEW.amount IS NULL OR NEW.amount < 0 OR NEW.amount > 50 THEN
    RAISE EXCEPTION 'xp_events.amount out of allowed client range (0..50)';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS xp_events_enforce_bounds ON public.xp_events;
CREATE TRIGGER xp_events_enforce_bounds
BEFORE INSERT OR UPDATE ON public.xp_events
FOR EACH ROW EXECUTE FUNCTION public.enforce_xp_event_bounds();

-- 3) Cap client-written xp_reward on habits
CREATE OR REPLACE FUNCTION public.enforce_habit_xp_bounds()
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
  IF NEW.xp_reward IS NULL OR NEW.xp_reward < 0 OR NEW.xp_reward > 25 THEN
    RAISE EXCEPTION 'habits.xp_reward out of allowed client range (0..25)';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS habits_enforce_xp_bounds ON public.habits;
CREATE TRIGGER habits_enforce_xp_bounds
BEFORE INSERT OR UPDATE ON public.habits
FOR EACH ROW EXECUTE FUNCTION public.enforce_habit_xp_bounds();
