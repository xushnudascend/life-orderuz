-- 1. Fix RLS Enabled No Policy issues
-- user_roles: allow users to see their own roles
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Users can view own roles') THEN
        CREATE POLICY "Users can view own roles" ON public.user_roles
            FOR SELECT TO authenticated USING (auth.uid() = user_id);
    END IF;
END $$;

-- rate_limits: service_role only (no public access policies needed as it's an internal table, 
-- but RLS is enabled so we add a service_role policy to be explicit and satisfy linter if it expects at least one)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rate_limits' AND policyname = 'Service role can manage rate limits') THEN
        CREATE POLICY "Service role can manage rate limits" ON public.rate_limits
            FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
END $$;

-- 2. Revoke EXECUTE from public roles for the remaining SECURITY DEFINER functions found in scan
-- These are internal functions that should not be directly callable by users
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rate_limit_hit(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.build_weekly_reports(date) FROM PUBLIC, anon, authenticated;

-- Grant access back to service_role and authenticated for has_role (needed for RLS checks)
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;
-- rate_limit_hit is called by server functions (which use authenticated/service_role context)
GRANT EXECUTE ON FUNCTION public.rate_limit_hit(text, integer, integer) TO authenticated, service_role;
-- build_weekly_reports is strictly system-level (cron)
GRANT EXECUTE ON FUNCTION public.build_weekly_reports(date) TO service_role;
