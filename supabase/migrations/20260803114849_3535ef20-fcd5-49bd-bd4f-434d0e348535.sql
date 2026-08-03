CREATE OR REPLACE FUNCTION public.public_stats()
RETURNS TABLE (
  users_count int,
  habit_logs_count int,
  journal_count int,
  longest_streak int
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT count(*) FROM public.profiles)::int,
    (SELECT count(*) FROM public.habit_logs)::int,
    (SELECT count(*) FROM public.journal_entries)::int,
    COALESCE((SELECT max(longest_days) FROM public.streaks), 0)::int;
$$;

REVOKE ALL ON FUNCTION public.public_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_stats() TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.build_weekly_reports(_week_start date DEFAULT (date_trunc('week', now() - interval '7 days'))::date)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _n int := 0;
BEGIN
  WITH range AS (
    SELECT _week_start AS s, (_week_start + 7) AS e
  ),
  active AS (
    SELECT DISTINCT hl.user_id
    FROM public.habit_logs hl, range r
    WHERE hl.created_at >= r.s AND hl.created_at < r.e
  ),
  agg AS (
    SELECT
      a.user_id,
      COALESCE((SELECT count(DISTINCT date_trunc('day', hl.created_at))
        FROM public.habit_logs hl, range r
        WHERE hl.user_id = a.user_id AND hl.created_at >= r.s AND hl.created_at < r.e), 0)::int AS active_days,
      COALESCE((SELECT count(*) FROM public.habit_logs hl, range r
        WHERE hl.user_id = a.user_id AND hl.created_at >= r.s AND hl.created_at < r.e), 0)::int AS logs,
      COALESCE((SELECT count(*) FROM public.journal_entries je, range r
        WHERE je.user_id = a.user_id AND je.created_at >= r.s AND je.created_at < r.e), 0)::int AS journals,
      COALESCE((SELECT sum(xe.amount) FROM public.xp_events xe, range r
        WHERE xe.user_id = a.user_id AND xe.created_at >= r.s AND xe.created_at < r.e), 0)::int AS xp,
      COALESCE((SELECT max(st.current_days) FROM public.streaks st WHERE st.user_id = a.user_id), 0)::int AS streak,
      GREATEST((SELECT count(*) FROM public.habits h WHERE h.user_id = a.user_id), 1)::int AS habit_count
    FROM active a
  )
  INSERT INTO public.weekly_reports (user_id, week_start, active_days, habit_completion_pct, streak, xp_gained, journal_entries, summary)
  SELECT
    agg.user_id,
    _week_start,
    agg.active_days,
    LEAST(100, round((agg.logs::numeric / (agg.habit_count * 7)) * 100, 1)),
    agg.streak,
    agg.xp,
    agg.journals,
    format('Bu hafta %s kun faol bo''lding, %s ta odat belgisi, %s ta yozuv va %s XP. Streak: %s kun.',
           agg.active_days, agg.logs, agg.journals, agg.xp, agg.streak)
  FROM agg
  ON CONFLICT (user_id, week_start) DO UPDATE SET
    active_days = EXCLUDED.active_days,
    habit_completion_pct = EXCLUDED.habit_completion_pct,
    streak = EXCLUDED.streak,
    xp_gained = EXCLUDED.xp_gained,
    journal_entries = EXCLUDED.journal_entries,
    summary = EXCLUDED.summary;

  GET DIAGNOSTICS _n = ROW_COUNT;
  RETURN _n;
END;
$$;

REVOKE ALL ON FUNCTION public.build_weekly_reports(date) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.build_weekly_reports(date) TO service_role;