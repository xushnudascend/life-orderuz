-- Revoke all execute permissions from public roles for our internal security definer functions
REVOKE ALL ON FUNCTION public.consume_telegram_link_token(text, text) FROM PUBLIC, anon, authenticated;

-- Ensure only service_role can execute it
GRANT EXECUTE ON FUNCTION public.consume_telegram_link_token(text, text) TO service_role;

-- Hardening previously found security definer functions (from history)
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.rate_limit_hit(text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rate_limit_hit(text, integer, integer) TO service_role;

REVOKE ALL ON FUNCTION public.build_weekly_reports(date) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.build_weekly_reports(date) TO service_role;
