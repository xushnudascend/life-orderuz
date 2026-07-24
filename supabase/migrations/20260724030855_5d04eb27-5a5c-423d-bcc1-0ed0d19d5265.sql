-- 1. Analytics events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  event text NOT NULL,
  props jsonb NOT NULL DEFAULT '{}'::jsonb,
  session_id text,
  path text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS analytics_events_user_created_idx ON public.analytics_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_event_created_idx ON public.analytics_events(event, created_at DESC);

GRANT SELECT, INSERT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own analytics insert"
  ON public.analytics_events FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own analytics select"
  ON public.analytics_events FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 2. Consolidated dashboard snapshot RPC (single round-trip)
CREATE OR REPLACE FUNCTION public.dashboard_snapshot()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  today date := (now() AT TIME ZONE 'UTC')::date;
  seven_ago date := today - 7;
  result jsonb;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT jsonb_build_object(
    'profile', (
      SELECT to_jsonb(p) FROM (
        SELECT display_name, plan_length_days, archetype, age, height_cm, weight_kg, sex, onboarding_completed_at
        FROM public.profiles WHERE id = uid
      ) p
    ),
    'habits', COALESCE((
      SELECT jsonb_agg(row_to_json(h) ORDER BY h.sort_order, h.created_at) FROM (
        SELECT id, title, xp_reward, category, sort_order, created_at
        FROM public.habits
        WHERE user_id = uid AND is_active = true
      ) h
    ), '[]'::jsonb),
    'done_today', COALESCE((
      SELECT jsonb_agg(habit_id) FROM public.habit_logs
      WHERE user_id = uid AND logged_date = today
    ), '[]'::jsonb),
    'stats', (
      SELECT to_jsonb(s) FROM (
        SELECT total_xp, level, discipline_score FROM public.user_stats WHERE user_id = uid
      ) s
    ),
    'streak', (
      SELECT to_jsonb(st) FROM (
        SELECT current_days FROM public.streaks WHERE user_id = uid
      ) st
    ),
    'shields_used_week', (
      SELECT count(*) FROM public.shields
      WHERE user_id = uid AND used_on > seven_ago
    )
  ) INTO result;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.dashboard_snapshot() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.dashboard_snapshot() FROM anon, public;