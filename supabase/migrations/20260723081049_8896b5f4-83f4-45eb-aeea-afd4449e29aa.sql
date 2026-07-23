
CREATE OR REPLACE FUNCTION public.enforce_free_tier_habits()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tier text;
  active_count int;
BEGIN
  IF (current_setting('role', true) = 'service_role') OR (auth.role() = 'service_role') THEN
    RETURN NEW;
  END IF;
  SELECT subscription_tier INTO tier FROM public.profiles WHERE id = NEW.user_id;
  IF tier IS NULL OR tier = 'free' THEN
    SELECT count(*) INTO active_count
      FROM public.habits
     WHERE user_id = NEW.user_id
       AND COALESCE(is_active, true) = true;
    IF active_count >= 3 THEN
      RAISE EXCEPTION 'free_tier_habit_limit_reached: upgrade to Pro to add more habits'
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_free_tier_habits ON public.habits;
CREATE TRIGGER trg_enforce_free_tier_habits
BEFORE INSERT ON public.habits
FOR EACH ROW EXECUTE FUNCTION public.enforce_free_tier_habits();

CREATE OR REPLACE FUNCTION public.enforce_free_tier_journal()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tier text;
  today_count int;
BEGIN
  IF (current_setting('role', true) = 'service_role') OR (auth.role() = 'service_role') THEN
    RETURN NEW;
  END IF;
  SELECT subscription_tier INTO tier FROM public.profiles WHERE id = NEW.user_id;
  IF tier IS NULL OR tier = 'free' THEN
    SELECT count(*) INTO today_count
      FROM public.journal_entries
     WHERE user_id = NEW.user_id
       AND (created_at AT TIME ZONE 'UTC')::date = (now() AT TIME ZONE 'UTC')::date;
    IF today_count >= 1 THEN
      RAISE EXCEPTION 'free_tier_journal_limit_reached: upgrade to Pro for unlimited journaling'
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_free_tier_journal ON public.journal_entries;
CREATE TRIGGER trg_enforce_free_tier_journal
BEFORE INSERT ON public.journal_entries
FOR EACH ROW EXECUTE FUNCTION public.enforce_free_tier_journal();
