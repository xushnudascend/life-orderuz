
-- ============ ENUMS ============
CREATE TYPE public.xp_source AS ENUM (
  'habit', 'quest', 'journal', 'achievement', 'streak_bonus', 'penalty', 'shield_use', 'workout', 'diet'
);

CREATE TYPE public.quest_status AS ENUM ('pending','completed','skipped','failed');

CREATE TYPE public.shield_reason AS ENUM ('missed_day','manual_freeze','sick','travel');

CREATE TYPE public.achievement_tier AS ENUM ('bronze','silver','gold','platinum');

-- ============ XP EVENTS ============
CREATE TABLE public.xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source public.xp_source NOT NULL,
  amount INTEGER NOT NULL, -- + or -
  reference_id UUID,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.xp_events TO authenticated;
GRANT ALL ON public.xp_events TO service_role;
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own xp" ON public.xp_events FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own xp" ON public.xp_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE INDEX xp_events_user_time_idx ON public.xp_events(user_id, created_at DESC);

-- ============ USER STATS ============
CREATE TABLE public.user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  discipline_score INTEGER NOT NULL DEFAULT 50 CHECK (discipline_score BETWEEN 0 AND 100),
  last_action_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.user_stats TO authenticated;
GRANT ALL ON public.user_stats TO service_role;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own stats" ON public.user_stats FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own stats" ON public.user_stats FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own stats" ON public.user_stats FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER user_stats_touch BEFORE UPDATE ON public.user_stats FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ STREAKS ============
CREATE TABLE public.streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_days INTEGER NOT NULL DEFAULT 0,
  longest_days INTEGER NOT NULL DEFAULT 0,
  last_check_in DATE,
  freeze_active_until DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.streaks TO authenticated;
GRANT ALL ON public.streaks TO service_role;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own streak" ON public.streaks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own streak" ON public.streaks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own streak" ON public.streaks FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER streaks_touch BEFORE UPDATE ON public.streaks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ SHIELDS (log) ============
CREATE TABLE public.shields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  used_on DATE NOT NULL DEFAULT CURRENT_DATE,
  reason public.shield_reason NOT NULL DEFAULT 'missed_day',
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.shields TO authenticated;
GRANT ALL ON public.shields TO service_role;
ALTER TABLE public.shields ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own shields" ON public.shields FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own shields" ON public.shields FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE INDEX shields_user_idx ON public.shields(user_id, used_on DESC);

-- ============ ACHIEVEMENTS ============
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tier public.achievement_tier NOT NULL DEFAULT 'bronze',
  xp_reward INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.achievements TO authenticated, anon;
GRANT ALL ON public.achievements TO service_role;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
-- achievements are public for all users to see rewards
CREATE POLICY "achievements are public" ON public.achievements FOR SELECT TO authenticated, anon USING (true);

-- ============ USER ACHIEVEMENTS ============
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, achievement_id)
);
GRANT SELECT, INSERT ON public.user_achievements TO authenticated;
GRANT ALL ON public.user_achievements TO service_role;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own achievements" ON public.user_achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own achievements" ON public.user_achievements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE INDEX user_achievements_user_idx ON public.user_achievements(user_id);

-- ============ DAILY QUESTS ============
CREATE TABLE public.daily_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT NOT NULL,
  description TEXT,
  difficulty INTEGER NOT NULL DEFAULT 3 CHECK (difficulty BETWEEN 1 AND 5),
  xp_reward INTEGER NOT NULL DEFAULT 10,
  status public.quest_status NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_quests TO authenticated;
GRANT ALL ON public.daily_quests TO service_role;
ALTER TABLE public.daily_quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own quests" ON public.daily_quests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own quests" ON public.daily_quests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own quests" ON public.daily_quests FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete own quests" ON public.daily_quests FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX daily_quests_user_date_idx ON public.daily_quests(user_id, quest_date DESC);
CREATE TRIGGER daily_quests_touch BEFORE UPDATE ON public.daily_quests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ Bootstrap user_stats + streaks when profile is created ============
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_stats (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  INSERT INTO public.streaks (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.handle_new_profile() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER on_profile_created
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile();

-- Backfill existing profiles
INSERT INTO public.user_stats (user_id) SELECT id FROM public.profiles ON CONFLICT DO NOTHING;
INSERT INTO public.streaks (user_id) SELECT id FROM public.profiles ON CONFLICT DO NOTHING;

-- ============ Helper: recompute level from XP ============
-- level = 1 + floor(sqrt(total_xp / 50)) — SECURITY INVOKER (no linter warning)
CREATE OR REPLACE FUNCTION public.xp_to_level(_xp INTEGER)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT GREATEST(1, 1 + FLOOR(SQRT(GREATEST(_xp,0)::numeric / 50.0)))::INTEGER;
$$;

-- ============ Seed achievements ============
INSERT INTO public.achievements (key, title, description, tier, xp_reward, icon) VALUES
  ('first_day', 'Birinchi qadam', 'Life Order''ga qadam qo''ydingiz. Ehtiyot bo''ling — bu boshlanishi.', 'bronze', 20, 'sparkles'),
  ('streak_7', 'Bir haftalik iroda', '7 kun uzluksiz — endi bu tasodif emas.', 'silver', 100, 'flame'),
  ('streak_30', 'Odat qotdi', '30 kun uzluksiz — tanaga singdi.', 'gold', 500, 'trophy'),
  ('first_perfect_day', 'To''liq kun', 'Bir kunda barcha vazifalarni bajardingiz.', 'silver', 50, 'check-circle'),
  ('first_shield', 'Birinchi qalqon', 'Shield ishlatdingiz — bu zaiflik emas, aql.', 'bronze', 0, 'shield'),
  ('level_up_first', 'Ilk daraja', '2-darajaga chiqdingiz.', 'bronze', 25, 'chevrons-up')
ON CONFLICT (key) DO NOTHING;
