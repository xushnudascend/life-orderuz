-- SEASONS
CREATE TABLE public.seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  theme text,
  starts_at date NOT NULL,
  ends_at date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.seasons TO authenticated;
GRANT ALL ON public.seasons TO service_role;
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "seasons readable to auth" ON public.seasons
  FOR SELECT TO authenticated USING (true);

-- SEASON PARTICIPANTS
CREATE TABLE public.season_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id uuid NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  season_xp integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (season_id, user_id)
);

CREATE INDEX season_participants_leaderboard_idx
  ON public.season_participants (season_id, season_xp DESC);

GRANT SELECT, INSERT, UPDATE ON public.season_participants TO authenticated;
GRANT ALL ON public.season_participants TO service_role;
ALTER TABLE public.season_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "season participants read own or season" ON public.season_participants
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "season participants insert self" ON public.season_participants
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "season participants update self" ON public.season_participants
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER trg_season_participants_updated
  BEFORE UPDATE ON public.season_participants
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- WEEKLY CHALLENGES
CREATE TABLE public.weekly_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  title text NOT NULL,
  description text,
  target integer NOT NULL DEFAULT 5,
  progress integer NOT NULL DEFAULT 0,
  xp_reward integer NOT NULL DEFAULT 50,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','failed')),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, week_start)
);

CREATE INDEX weekly_challenges_user_idx ON public.weekly_challenges (user_id, week_start DESC);

GRANT SELECT, INSERT, UPDATE ON public.weekly_challenges TO authenticated;
GRANT ALL ON public.weekly_challenges TO service_role;
ALTER TABLE public.weekly_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "weekly own select" ON public.weekly_challenges
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "weekly own insert" ON public.weekly_challenges
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "weekly own update" ON public.weekly_challenges
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER trg_weekly_challenges_updated
  BEFORE UPDATE ON public.weekly_challenges
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Ensure current-week challenge for the calling user
CREATE OR REPLACE FUNCTION public.ensure_weekly_challenge()
RETURNS public.weekly_challenges
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
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
$$;

REVOKE ALL ON FUNCTION public.ensure_weekly_challenge() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ensure_weekly_challenge() TO authenticated;

-- Auto-accumulate season XP whenever xp_events fires
CREATE OR REPLACE FUNCTION public.apply_season_xp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  s public.seasons;
BEGIN
  SELECT * INTO s FROM public.seasons
   WHERE (now() AT TIME ZONE 'UTC')::date BETWEEN starts_at AND ends_at
   ORDER BY starts_at DESC LIMIT 1;
  IF NOT FOUND THEN RETURN NEW; END IF;

  INSERT INTO public.season_participants (season_id, user_id, season_xp)
  VALUES (s.id, NEW.user_id, GREATEST(NEW.amount, 0))
  ON CONFLICT (season_id, user_id) DO UPDATE
    SET season_xp = public.season_participants.season_xp + GREATEST(NEW.amount, 0),
        updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_xp_events_season_xp
  AFTER INSERT ON public.xp_events
  FOR EACH ROW EXECUTE FUNCTION public.apply_season_xp();

-- Seed the current season (12 weeks starting today)
INSERT INTO public.seasons (name, theme, starts_at, ends_at)
VALUES (
  'S1 · Poydevor',
  'Yangi odatlar poydevorini quyish davri. Katta g''alaba emas — barqarorlik.',
  (now() AT TIME ZONE 'UTC')::date,
  ((now() AT TIME ZONE 'UTC')::date + INTERVAL '84 days')::date
);