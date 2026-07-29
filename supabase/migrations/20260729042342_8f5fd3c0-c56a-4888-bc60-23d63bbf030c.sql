
-- 1) DAILY QUESTS: no client writes; completion via checked routine, capped XP
DROP POLICY IF EXISTS "Users can insert their own quests" ON public.daily_quests;
DROP POLICY IF EXISTS "Users can update their own quests" ON public.daily_quests;
DROP POLICY IF EXISTS "Users can delete their own quests" ON public.daily_quests;
DROP POLICY IF EXISTS "users insert own quests" ON public.daily_quests;
DROP POLICY IF EXISTS "users update own quests" ON public.daily_quests;
DROP POLICY IF EXISTS "users delete own quests" ON public.daily_quests;
REVOKE INSERT, UPDATE, DELETE ON public.daily_quests FROM authenticated, anon;
GRANT SELECT ON public.daily_quests TO authenticated;
GRANT ALL ON public.daily_quests TO service_role;

CREATE OR REPLACE FUNCTION public.apply_quest_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') THEN
    NEW.completed_at := now();
    INSERT INTO public.xp_events (user_id, amount, source, reference_id, note)
    VALUES (NEW.user_id, LEAST(GREATEST(COALESCE(NEW.xp_reward,0),0), 25), 'quest', NEW.id, 'quest_completed');
  END IF;
  RETURN NEW;
END $$;

CREATE OR REPLACE FUNCTION public.ensure_daily_quests()
RETURNS SETOF public.daily_quests
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  uid uuid := auth.uid();
  today date := (now() AT TIME ZONE 'UTC')::date;
  existing int;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT count(*) INTO existing FROM public.daily_quests WHERE user_id = uid AND quest_date = today;
  IF existing = 0 THEN
    INSERT INTO public.daily_quests (user_id, quest_date, title, description, difficulty, xp_reward, status) VALUES
      (uid, today, 'Ertalabki niyat', 'Bugun bir yaxshi niyat qilib, uni yozib qo''ying', 1, 15, 'pending'),
      (uid, today, 'Kichik g''alaba', 'Bugun bitta odatingizni to''liq bajaring', 2, 25, 'pending'),
      (uid, today, 'Sokinlik daqiqasi', '5 daqiqa telefonsiz o''tiring va nafas oling', 1, 20, 'pending');
  END IF;
  RETURN QUERY SELECT * FROM public.daily_quests WHERE user_id = uid AND quest_date = today ORDER BY difficulty;
END $$;

CREATE OR REPLACE FUNCTION public.complete_daily_quest(_quest_id uuid)
RETURNS public.daily_quests
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  uid uuid := auth.uid();
  q public.daily_quests;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT * INTO q FROM public.daily_quests
   WHERE id = _quest_id AND user_id = uid
     AND quest_date = (now() AT TIME ZONE 'UTC')::date
   FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'quest_not_found'; END IF;
  IF q.status = 'completed' THEN RETURN q; END IF;
  UPDATE public.daily_quests SET status = 'completed', updated_at = now()
   WHERE id = q.id RETURNING * INTO q;
  RETURN q;
END $$;

REVOKE ALL ON FUNCTION public.ensure_daily_quests() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.complete_daily_quest(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.ensure_daily_quests() TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_daily_quest(uuid) TO authenticated;

-- 2) ACHIEVEMENTS: only the verified server routine may grant badges
DROP POLICY IF EXISTS "Users can insert their own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "users insert own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can unlock their own achievements" ON public.user_achievements;
REVOKE INSERT, UPDATE, DELETE ON public.user_achievements FROM authenticated, anon;
GRANT SELECT ON public.user_achievements TO authenticated;
GRANT ALL ON public.user_achievements TO service_role;
REVOKE ALL ON FUNCTION public.check_achievements(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_achievements(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.check_my_achievements()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  PERFORM public.check_achievements(auth.uid());
END $$;
REVOKE ALL ON FUNCTION public.check_my_achievements() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_my_achievements() TO authenticated;

-- 3) PARTY: invite code enforced server-side
DROP POLICY IF EXISTS "user joins self" ON public.party_members;
DROP POLICY IF EXISTS "Users can join parties" ON public.party_members;
DROP POLICY IF EXISTS "members insert self" ON public.party_members;
REVOKE INSERT, UPDATE ON public.party_members FROM authenticated, anon;
GRANT SELECT, DELETE ON public.party_members TO authenticated;
GRANT ALL ON public.party_members TO service_role;

DROP POLICY IF EXISTS "Users can create parties" ON public.party_challenges;
DROP POLICY IF EXISTS "owner inserts party" ON public.party_challenges;
REVOKE INSERT, UPDATE, DELETE ON public.party_challenges FROM authenticated, anon;
GRANT SELECT ON public.party_challenges TO authenticated;
GRANT ALL ON public.party_challenges TO service_role;

CREATE OR REPLACE FUNCTION public.create_party(_name text, _goal text DEFAULT NULL)
RETURNS public.party_challenges
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  uid uuid := auth.uid();
  p public.party_challenges;
  code text;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _name IS NULL OR length(btrim(_name)) = 0 THEN RAISE EXCEPTION 'name_required'; END IF;
  code := lower(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  INSERT INTO public.party_challenges (owner_id, name, goal, invite_code)
  VALUES (uid, left(btrim(_name), 80), NULLIF(left(btrim(COALESCE(_goal, '')), 200), ''), code)
  RETURNING * INTO p;
  INSERT INTO public.party_members (party_id, user_id) VALUES (p.id, uid)
  ON CONFLICT DO NOTHING;
  RETURN p;
END $$;

CREATE OR REPLACE FUNCTION public.join_party_by_code(_invite_code text)
RETURNS public.party_challenges
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  uid uuid := auth.uid();
  p public.party_challenges;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT * INTO p FROM public.party_challenges
   WHERE lower(invite_code) = lower(btrim(COALESCE(_invite_code, '')));
  IF NOT FOUND THEN RAISE EXCEPTION 'invalid_invite_code'; END IF;
  INSERT INTO public.party_members (party_id, user_id) VALUES (p.id, uid)
  ON CONFLICT DO NOTHING;
  RETURN p;
END $$;

REVOKE ALL ON FUNCTION public.create_party(text, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.join_party_by_code(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_party(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.join_party_by_code(text) TO authenticated;
