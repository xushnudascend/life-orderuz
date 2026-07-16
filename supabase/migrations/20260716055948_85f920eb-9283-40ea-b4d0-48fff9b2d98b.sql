-- Revoke rate_limit_hit from anon/authenticated; server uses service_role
REVOKE EXECUTE ON FUNCTION public.rate_limit_hit(text, integer, integer) FROM PUBLIC, anon, authenticated;

-- Convert user-callable RPCs to SECURITY INVOKER (RLS enforces ownership via auth.uid())
CREATE OR REPLACE FUNCTION public.ensure_daily_quests()
 RETURNS SETOF public.daily_quests
 LANGUAGE plpgsql
 SECURITY INVOKER
 SET search_path TO 'public'
AS $function$
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
END $function$;

CREATE OR REPLACE FUNCTION public.use_shield(_note text DEFAULT NULL)
 RETURNS public.shields
 LANGUAGE plpgsql
 SECURITY INVOKER
 SET search_path TO 'public'
AS $function$
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
$function$;

GRANT EXECUTE ON FUNCTION public.ensure_daily_quests() TO authenticated;
GRANT EXECUTE ON FUNCTION public.use_shield(text) TO authenticated;
