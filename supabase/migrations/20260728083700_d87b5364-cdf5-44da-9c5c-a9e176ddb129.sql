
-- 1. PUBLIC PROFILE EXPOSURE -------------------------------------------------
DROP POLICY IF EXISTS "Public profiles are viewable" ON public.profiles;

CREATE OR REPLACE VIEW public.public_profiles
WITH (security_barrier = true) AS
  SELECT id, username, display_name, avatar_url
  FROM public.profiles
  WHERE is_public = true;

REVOKE ALL ON public.public_profiles FROM anon, authenticated;
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- 2. XP / STREAK SELF-INFLATION ----------------------------------------------
CREATE OR REPLACE FUNCTION public.award_action_xp(_source xp_source, _reference_id uuid DEFAULT NULL)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  uid uuid := auth.uid();
  today date := (now() AT TIME ZONE 'UTC')::date;
  amount int := 0;
  dup int;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  IF _source = 'habit' THEN
    SELECT LEAST(25, GREATEST(0, h.xp_reward)) INTO amount
      FROM public.habit_logs l
      JOIN public.habits h ON h.id = l.habit_id
     WHERE l.user_id = uid AND l.habit_id = _reference_id AND l.logged_date = today;
    IF amount IS NULL THEN RETURN 0; END IF;
    SELECT count(*) INTO dup FROM public.xp_events
     WHERE user_id = uid AND source = 'habit' AND reference_id = _reference_id
       AND (created_at AT TIME ZONE 'UTC')::date = today;
    IF dup > 0 THEN RETURN 0; END IF;

  ELSIF _source = 'journal' THEN
    IF NOT EXISTS (SELECT 1 FROM public.journal_entries
                    WHERE user_id = uid AND (created_at AT TIME ZONE 'UTC')::date = today)
    THEN RETURN 0; END IF;
    SELECT count(*) INTO dup FROM public.xp_events
     WHERE user_id = uid AND source = 'journal'
       AND (created_at AT TIME ZONE 'UTC')::date = today;
    IF dup > 0 THEN RETURN 0; END IF;
    amount := 5;

  ELSIF _source = 'workout' THEN
    SELECT LEAST(30, GREATEST(0, ROUND(w.duration_min / 2.0)))::int INTO amount
      FROM public.workouts w
     WHERE w.id = _reference_id AND w.user_id = uid;
    IF amount IS NULL THEN RETURN 0; END IF;
    SELECT count(*) INTO dup FROM public.xp_events
     WHERE user_id = uid AND source = 'workout' AND reference_id = _reference_id;
    IF dup > 0 THEN RETURN 0; END IF;

  ELSIF _source = 'achievement' THEN
    SELECT LEAST(50, GREATEST(0, c.xp_reward)) INTO amount
      FROM public.weekly_challenges c
     WHERE c.id = _reference_id AND c.user_id = uid AND c.status = 'completed';
    IF amount IS NULL THEN RETURN 0; END IF;
    SELECT count(*) INTO dup FROM public.xp_events
     WHERE user_id = uid AND source = 'achievement' AND reference_id = _reference_id;
    IF dup > 0 THEN RETURN 0; END IF;

  ELSE
    RAISE EXCEPTION 'unsupported_xp_source';
  END IF;

  IF amount <= 0 THEN RETURN 0; END IF;

  INSERT INTO public.xp_events (user_id, source, amount, reference_id)
  VALUES (uid, _source, amount, _reference_id);

  RETURN amount;
END;
$$;

REVOKE ALL ON FUNCTION public.award_action_xp(xp_source, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.award_action_xp(xp_source, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.award_action_xp(xp_source, uuid) TO service_role;

-- clients may no longer write XP / streaks / stats directly
DROP POLICY IF EXISTS "insert own xp" ON public.xp_events;
REVOKE INSERT, UPDATE, DELETE ON public.xp_events FROM authenticated, anon;

DROP POLICY IF EXISTS "update own streak" ON public.streaks;
DROP POLICY IF EXISTS "insert own streak" ON public.streaks;
REVOKE INSERT, UPDATE, DELETE ON public.streaks FROM authenticated, anon;

DROP POLICY IF EXISTS "update own stats" ON public.user_stats;
DROP POLICY IF EXISTS "insert own stats" ON public.user_stats;
REVOKE INSERT, UPDATE, DELETE ON public.user_stats FROM authenticated, anon;

-- 3. SEASON LEADERBOARD -------------------------------------------------------
DROP POLICY IF EXISTS "season participants update self" ON public.season_participants;
DROP POLICY IF EXISTS "season participants insert self" ON public.season_participants;
DROP POLICY IF EXISTS "season participants read own or season" ON public.season_participants;
REVOKE INSERT, UPDATE, DELETE ON public.season_participants FROM authenticated, anon;

CREATE POLICY "season participants read same season"
ON public.season_participants FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.season_participants me
     WHERE me.season_id = public.season_participants.season_id
       AND me.user_id = auth.uid()
  )
);

GRANT ALL ON public.season_participants TO service_role;
GRANT ALL ON public.xp_events TO service_role;
GRANT ALL ON public.streaks TO service_role;
GRANT ALL ON public.user_stats TO service_role;
