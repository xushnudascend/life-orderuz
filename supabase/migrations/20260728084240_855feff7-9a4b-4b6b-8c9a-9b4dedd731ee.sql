-- 1. community_posts: prevent ownership reassignment on update
DROP POLICY IF EXISTS "Users can update their own posts" ON public.community_posts;
CREATE POLICY "Users can update their own posts"
  ON public.community_posts FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. daily_login_bonus: server-computed only
DROP POLICY IF EXISTS own_insert_daily_login_bonus ON public.daily_login_bonus;
REVOKE INSERT, UPDATE, DELETE ON public.daily_login_bonus FROM authenticated, anon;

CREATE OR REPLACE FUNCTION public.claim_daily_login_bonus()
RETURNS TABLE(awarded boolean, xp integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  uid uuid := auth.uid();
  today date := (now() AT TIME ZONE 'UTC')::date;
  amount int := 5;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF EXISTS (SELECT 1 FROM public.daily_login_bonus WHERE user_id = uid AND claimed_on = today) THEN
    RETURN QUERY SELECT false, 0;
    RETURN;
  END IF;
  INSERT INTO public.daily_login_bonus(user_id, claimed_on, xp_awarded) VALUES (uid, today, amount);
  INSERT INTO public.xp_events (user_id, amount, source, note)
  VALUES (uid, amount, 'streak_bonus', 'daily_login');
  RETURN QUERY SELECT true, amount;
END;
$function$;

-- 3. user_stats: keep read-only for clients
REVOKE INSERT, UPDATE, DELETE ON public.user_stats FROM authenticated, anon;

-- 4. weekly_challenges: server-controlled progress
DROP POLICY IF EXISTS "weekly own insert" ON public.weekly_challenges;
DROP POLICY IF EXISTS "weekly own update" ON public.weekly_challenges;
REVOKE INSERT, UPDATE, DELETE ON public.weekly_challenges FROM authenticated, anon;

CREATE OR REPLACE FUNCTION public.ensure_weekly_challenge()
RETURNS weekly_challenges
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  uid uuid := auth.uid();
  wk_start date := date_trunc('week', (now() AT TIME ZONE 'UTC'))::date;
  existing public.weekly_challenges;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT * INTO existing FROM public.weekly_challenges
   WHERE user_id = uid AND week_start = wk_start;
  IF FOUND THEN RETURN existing; END IF;
  INSERT INTO public.weekly_challenges (user_id, week_start, title, description, target, xp_reward)
  VALUES (uid, wk_start,
          'Bu haftaning maqsadi',
          '5 kun ketma-ket kamida bitta odatni bajar',
          5, 50)
  RETURNING * INTO existing;
  RETURN existing;
END;
$function$;

-- Recomputes progress from real habit logs; awards XP once on completion.
CREATE OR REPLACE FUNCTION public.sync_weekly_challenge()
RETURNS weekly_challenges
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  uid uuid := auth.uid();
  wk_start date := date_trunc('week', (now() AT TIME ZONE 'UTC'))::date;
  ch public.weekly_challenges;
  active_days int;
  done boolean;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  ch := public.ensure_weekly_challenge();

  SELECT count(DISTINCT logged_date) INTO active_days
    FROM public.habit_logs
   WHERE user_id = uid
     AND logged_date >= wk_start
     AND logged_date < wk_start + 7;

  active_days := LEAST(active_days, ch.target);
  done := active_days >= ch.target;

  IF ch.status = 'completed' THEN
    RETURN ch;
  END IF;

  UPDATE public.weekly_challenges
     SET progress = active_days,
         status = CASE WHEN done THEN 'completed' ELSE status END,
         completed_at = CASE WHEN done THEN now() ELSE completed_at END,
         updated_at = now()
   WHERE id = ch.id
  RETURNING * INTO ch;

  IF done THEN
    INSERT INTO public.xp_events (user_id, amount, source, reference_id, note)
    VALUES (uid, LEAST(ch.xp_reward, 50), 'achievement', ch.id, 'weekly_challenge_completed');
  END IF;

  RETURN ch;
END;
$function$;

REVOKE ALL ON FUNCTION public.sync_weekly_challenge() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.sync_weekly_challenge() TO authenticated;
REVOKE ALL ON FUNCTION public.ensure_weekly_challenge() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.ensure_weekly_challenge() TO authenticated;
REVOKE ALL ON FUNCTION public.claim_daily_login_bonus() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_daily_login_bonus() TO authenticated;