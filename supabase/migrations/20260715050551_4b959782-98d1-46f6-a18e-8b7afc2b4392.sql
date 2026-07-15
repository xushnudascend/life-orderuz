
-- 1) XP: update user_stats after each xp_event
CREATE OR REPLACE FUNCTION public.apply_xp_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_total integer;
BEGIN
  INSERT INTO public.user_stats (user_id, total_xp, level, last_action_at)
  VALUES (NEW.user_id, GREATEST(NEW.amount, 0), 1, now())
  ON CONFLICT (user_id) DO UPDATE
    SET total_xp = public.user_stats.total_xp + NEW.amount,
        last_action_at = now();

  SELECT total_xp INTO new_total FROM public.user_stats WHERE user_id = NEW.user_id;
  UPDATE public.user_stats
     SET level = public.xp_to_level(new_total),
         updated_at = now()
   WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS xp_events_apply ON public.xp_events;
CREATE TRIGGER xp_events_apply
AFTER INSERT ON public.xp_events
FOR EACH ROW EXECUTE FUNCTION public.apply_xp_event();

-- 2) Streak update on habit_log insert
CREATE OR REPLACE FUNCTION public.apply_habit_log()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  s public.streaks%ROWTYPE;
  gap integer;
  new_current integer;
BEGIN
  -- Ensure row exists
  INSERT INTO public.streaks (user_id) VALUES (NEW.user_id)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT * INTO s FROM public.streaks WHERE user_id = NEW.user_id FOR UPDATE;

  IF s.last_check_in IS NULL THEN
    new_current := 1;
  ELSE
    gap := NEW.logged_date - s.last_check_in;
    IF gap <= 0 THEN
      RETURN NEW; -- already counted today (or backdated)
    ELSIF gap = 1 THEN
      new_current := s.current_days + 1;
    ELSIF s.freeze_active_until IS NOT NULL AND s.freeze_active_until >= NEW.logged_date - 1 THEN
      -- shield bridged the gap
      new_current := s.current_days + 1;
    ELSE
      new_current := 1;
    END IF;
  END IF;

  UPDATE public.streaks
     SET current_days = new_current,
         longest_days = GREATEST(COALESCE(longest_days, 0), new_current),
         last_check_in = NEW.logged_date,
         updated_at = now()
   WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS habit_logs_apply ON public.habit_logs;
CREATE TRIGGER habit_logs_apply
AFTER INSERT ON public.habit_logs
FOR EACH ROW EXECUTE FUNCTION public.apply_habit_log();

-- 3) Use shield (one per rolling 7 days) — extends freeze_active_until to today
CREATE OR REPLACE FUNCTION public.use_shield(_note text DEFAULT NULL)
RETURNS public.shields
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  today date := (now() AT TIME ZONE 'UTC')::date;
  recent_count integer;
  new_shield public.shields;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT count(*) INTO recent_count
    FROM public.shields
   WHERE user_id = uid AND used_on > today - 7;

  IF recent_count >= 1 THEN
    RAISE EXCEPTION 'shield_limit_reached';
  END IF;

  INSERT INTO public.shields (user_id, used_on, reason, note)
  VALUES (uid, today, 'freeze', _note)
  RETURNING * INTO new_shield;

  INSERT INTO public.streaks (user_id, freeze_active_until)
  VALUES (uid, today)
  ON CONFLICT (user_id) DO UPDATE
    SET freeze_active_until = GREATEST(COALESCE(public.streaks.freeze_active_until, today), today),
        updated_at = now();

  RETURN new_shield;
END;
$$;

REVOKE ALL ON FUNCTION public.use_shield(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.use_shield(text) TO authenticated;
