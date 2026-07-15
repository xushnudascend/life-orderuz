
CREATE TABLE IF NOT EXISTS public.workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  duration_min integer NOT NULL DEFAULT 0,
  notes text,
  logged_date date NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')::date,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workouts TO authenticated;
GRANT ALL ON public.workouts TO service_role;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own workouts" ON public.workouts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON public.workouts(user_id, logged_date DESC);

CREATE TABLE IF NOT EXISTS public.meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  description text NOT NULL,
  calories integer,
  logged_date date NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')::date,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meals TO authenticated;
GRANT ALL ON public.meals TO service_role;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own meals" ON public.meals FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_meals_user_date ON public.meals(user_id, logged_date DESC);

-- Public leaderboard view (safe columns only)
CREATE OR REPLACE VIEW public.leaderboard_public
WITH (security_invoker = true)
AS
SELECT
  p.id AS user_id,
  COALESCE(p.display_name, 'Anonim') AS display_name,
  s.level,
  s.total_xp
FROM public.user_stats s
JOIN public.profiles p ON p.id = s.user_id
ORDER BY s.total_xp DESC
LIMIT 50;

GRANT SELECT ON public.leaderboard_public TO authenticated, anon;
