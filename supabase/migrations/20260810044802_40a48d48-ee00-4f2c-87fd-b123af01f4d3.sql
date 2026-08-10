-- has_role: revoke from PUBLIC/anon/auth, keep for authenticated (application needs it for RLS) and service_role
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- rate_limit_hit: internal logic, restrict to service_role
REVOKE ALL ON FUNCTION public.rate_limit_hit(text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rate_limit_hit(text, integer, integer) TO service_role;

-- build_weekly_reports: internal cron, restrict to service_role
REVOKE ALL ON FUNCTION public.build_weekly_reports(date) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.build_weekly_reports(date) TO service_role;

COMMENT ON FUNCTION public.has_role IS 'Internal role check. Available to authenticated for RLS usage.';
COMMENT ON FUNCTION public.rate_limit_hit IS 'Internal rate limiting. Restricted to service_role.';
COMMENT ON FUNCTION public.build_weekly_reports IS 'Internal cron task for weekly reports. Restricted to service_role.';
