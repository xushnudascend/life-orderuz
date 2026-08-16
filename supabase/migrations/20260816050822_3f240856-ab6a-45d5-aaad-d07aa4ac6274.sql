-- 3) security_events Jadvali — Forgeable INSERT Fix
-- This table was defined in a previous migration but might not have been applied or exists under a different name.
-- Let's create it if it doesn't exist and harden it.

CREATE TABLE IF NOT EXISTS public.security_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type text NOT NULL,
    severity text NOT NULL,
    details jsonb,
    ip_address inet,
    created_at timestamp with time zone DEFAULT now()
);

-- Revoke all then grant properly
REVOKE ALL ON public.security_events FROM public, anon, authenticated;
GRANT ALL ON public.security_events TO service_role;
GRANT SELECT ON public.security_events TO authenticated; -- Required for the policy to work if checking roles

ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can log security events" ON public.security_events;
DROP POLICY IF EXISTS "Admins can view security events" ON public.security_events;
DROP POLICY IF EXISTS "System can log security events" ON public.security_events;

-- Policy for service_role is handled by its bypass of RLS, but we can be explicit
CREATE POLICY "System can log security events" ON public.security_events
    FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Admins can view security events" ON public.security_events
    FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));


-- 4) blocked_clients Jadvali — Ommaviy o'qish Fix
CREATE TABLE IF NOT EXISTS public.blocked_clients (
    identifier text PRIMARY KEY,
    reason text,
    blocked_until timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Revoke SELECT from client roles
REVOKE ALL ON public.blocked_clients FROM public, anon, authenticated;
GRANT ALL ON public.blocked_clients TO service_role;
GRANT SELECT ON public.blocked_clients TO authenticated; -- For admin check

ALTER TABLE public.blocked_clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can check blocks" ON public.blocked_clients;
DROP POLICY IF EXISTS "Admins can view blocks" ON public.blocked_clients;
DROP POLICY IF EXISTS "System can check blocks" ON public.blocked_clients;

CREATE POLICY "System can check blocks" ON public.blocked_clients
    FOR SELECT TO service_role USING (true);

CREATE POLICY "Admins can view blocks" ON public.blocked_clients
    FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Documentation
COMMENT ON TABLE public.security_events IS 'Audit log. Write access restricted to system service_role.';
COMMENT ON TABLE public.blocked_clients IS 'Rate-limit blocks. Read access restricted to system and admins.';