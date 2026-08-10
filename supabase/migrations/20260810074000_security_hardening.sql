-- LIFE ORDER SECURITY HARDENING
-- 1. Security Definer Functions Check (Ensure they only execute with search_path set)
-- (Existing functions are already using security definer with search_path public)

-- 2. Audit Trail for Security Events
CREATE TABLE IF NOT EXISTS public.security_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type text NOT NULL,
    severity text NOT NULL,
    details jsonb,
    ip_address inet,
    created_at timestamp with time zone DEFAULT now()
);

GRANT INSERT ON public.security_events TO authenticated, anon;
GRANT SELECT ON public.security_events TO authenticated;
GRANT ALL ON public.security_events TO service_role;

ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Allow logging but restrict reading to admins
CREATE POLICY "Anyone can log security events" ON public.security_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view security events" ON public.security_events
    FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 3. Payment Orders Hardening
-- Ensure payment orders are only viewable by the owner or admins
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own orders" ON public.payment_orders;
CREATE POLICY "Users can view own orders" ON public.payment_orders
    FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 4. Rate Limiting Tripwire Table (for persistent blocks)
CREATE TABLE IF NOT EXISTS public.blocked_clients (
    identifier text PRIMARY KEY,
    reason text,
    blocked_until timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

GRANT SELECT ON public.blocked_clients TO anon, authenticated;
GRANT ALL ON public.blocked_clients TO service_role;

ALTER TABLE public.blocked_clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can check blocks" ON public.blocked_clients FOR SELECT USING (true);

