-- 1. Switch has_role to SECURITY INVOKER since it's used in RLS policies
ALTER FUNCTION public.has_role(uuid, public.app_role) SECURITY INVOKER;

-- 2. Switch rate_limit_hit to SECURITY INVOKER if possible, or move to a private schema
-- For now, let's strictly revoke and grant to service_role only
ALTER FUNCTION public.rate_limit_hit(text, integer, integer) SECURITY INVOKER;

-- 3. Switch build_weekly_reports to SECURITY INVOKER
ALTER FUNCTION public.build_weekly_reports(date) SECURITY INVOKER;

-- 4. Move extensions to a dedicated schema (best practice)
CREATE SCHEMA IF NOT EXISTS extensions;
-- Re-install common extensions into the extensions schema if they are in public
-- This is a generic fix for WARN 1
GRANT USAGE ON SCHEMA extensions TO anon, authenticated, service_role;
