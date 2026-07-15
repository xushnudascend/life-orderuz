
-- Seed achievements catalog
INSERT INTO public.achievements (key, title, description, tier, xp_reward, icon) VALUES
  ('first_step', 'Birinchi qadam', 'Birinchi odatingizni yaratdingiz', 'bronze', 20, 'sparkles'),
  ('streak_3', '3 kunlik yo''l', '3 kun ketma-ket odatlarni bajardingiz', 'bronze', 30, 'flame'),
  ('streak_7', 'Bir hafta sabot', '7 kun ketma-ket', 'silver', 75, 'flame'),
  ('streak_30', 'Oy bo''yi', '30 kun ketma-ket', 'gold', 250, 'flame'),
  ('journal_5', 'Ichki ovoz', '5 ta kundalik yozuv', 'bronze', 40, 'book'),
  ('mentor_10', 'Nadir bilan suhbat', 'Nadir bilan 10 marta gaplashdingiz', 'silver', 60, 'message-circle'),
  ('level_5', 'Beshinchi daraja', '5-darajaga yetdingiz', 'silver', 100, 'star'),
  ('level_10', 'O''ninchi daraja', '10-darajaga yetdingiz', 'gold', 300, 'crown')
ON CONFLICT (key) DO NOTHING;

-- XP on quest completion + achievement check
CREATE OR REPLACE FUNCTION public.apply_quest_completion()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') THEN
    NEW.completed_at := now();
    INSERT INTO public.xp_events (user_id, amount, reason, ref_type, ref_id)
    VALUES (NEW.user_id, NEW.xp_reward, 'quest_completed', 'daily_quest', NEW.id);
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_apply_quest_completion ON public.daily_quests;
CREATE TRIGGER trg_apply_quest_completion
BEFORE UPDATE ON public.daily_quests
FOR EACH ROW EXECUTE FUNCTION public.apply_quest_completion();

-- Attach existing streak/xp triggers if not already attached
DROP TRIGGER IF EXISTS trg_apply_xp_event ON public.xp_events;
CREATE TRIGGER trg_apply_xp_event
AFTER INSERT ON public.xp_events
FOR EACH ROW EXECUTE FUNCTION public.apply_xp_event();

DROP TRIGGER IF EXISTS trg_apply_habit_log ON public.habit_logs;
CREATE TRIGGER trg_apply_habit_log
AFTER INSERT ON public.habit_logs
FOR EACH ROW EXECUTE FUNCTION public.apply_habit_log();

-- Achievement checker
CREATE OR REPLACE FUNCTION public.check_achievements(_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  s public.streaks%ROWTYPE;
  st public.user_stats%ROWTYPE;
  habit_count int;
  journal_count int;
  mentor_count int;
  ach RECORD;
BEGIN
  SELECT * INTO s FROM public.streaks WHERE user_id = _user_id;
  SELECT * INTO st FROM public.user_stats WHERE user_id = _user_id;
  SELECT count(*) INTO habit_count FROM public.habits WHERE user_id = _user_id;
  SELECT count(*) INTO journal_count FROM public.journal_entries WHERE user_id = _user_id;
  SELECT count(*) INTO mentor_count FROM public.chat_messages WHERE user_id = _user_id AND role = 'user';

  FOR ach IN SELECT * FROM public.achievements LOOP
    IF EXISTS (SELECT 1 FROM public.user_achievements WHERE user_id = _user_id AND achievement_id = ach.id) THEN
      CONTINUE;
    END IF;
    IF (ach.key = 'first_step' AND habit_count >= 1)
       OR (ach.key = 'streak_3' AND COALESCE(s.current_days,0) >= 3)
       OR (ach.key = 'streak_7' AND COALESCE(s.current_days,0) >= 7)
       OR (ach.key = 'streak_30' AND COALESCE(s.current_days,0) >= 30)
       OR (ach.key = 'journal_5' AND journal_count >= 5)
       OR (ach.key = 'mentor_10' AND mentor_count >= 10)
       OR (ach.key = 'level_5' AND COALESCE(st.level,1) >= 5)
       OR (ach.key = 'level_10' AND COALESCE(st.level,1) >= 10)
    THEN
      INSERT INTO public.user_achievements (user_id, achievement_id) VALUES (_user_id, ach.id);
      INSERT INTO public.xp_events (user_id, amount, reason, ref_type, ref_id)
      VALUES (_user_id, ach.xp_reward, 'achievement_unlocked', 'achievement', ach.id);
    END IF;
  END LOOP;
END $$;

GRANT EXECUTE ON FUNCTION public.check_achievements(uuid) TO authenticated;

-- Ensure daily quests exist for today (idempotent)
CREATE OR REPLACE FUNCTION public.ensure_daily_quests()
RETURNS SETOF public.daily_quests LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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

GRANT EXECUTE ON FUNCTION public.ensure_daily_quests() TO authenticated;
