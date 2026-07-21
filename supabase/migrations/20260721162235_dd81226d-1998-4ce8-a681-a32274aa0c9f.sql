
-- Public peer mirror aggregate function
CREATE OR REPLACE FUNCTION public.get_peer_mirror()
RETURNS TABLE(members bigint, today_active bigint, streak_leader integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT count(*) FROM public.profiles),
    (SELECT count(DISTINCT user_id) FROM public.habit_logs WHERE logged_date = (now() AT TIME ZONE 'UTC')::date),
    (SELECT COALESCE(max(current_days), 0) FROM public.streaks);
$$;

-- Allow anonymous (landing page) and authenticated callers
GRANT EXECUTE ON FUNCTION public.get_peer_mirror() TO anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_peer_mirror() FROM public;
