-- 1. Tighten RLS on tables where user_id might be bypassed
ALTER TABLE public.nadir_memories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own memories" ON public.nadir_memories;
CREATE POLICY "Users can manage their own memories" ON public.nadir_memories
    FOR ALL TO authenticated USING (auth.uid() = user_id);

ALTER TABLE public.nadir_threads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own threads" ON public.nadir_threads;
CREATE POLICY "Users can manage their own threads" ON public.nadir_threads
    FOR ALL TO authenticated USING (auth.uid() = user_id);

ALTER TABLE public.nadir_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own messages" ON public.nadir_messages;
CREATE POLICY "Users can manage their own messages" ON public.nadir_messages
    FOR ALL TO authenticated USING (auth.uid() = user_id);

-- 2. Prevent profile updates to sensitive fields by non-admins
-- (subscription_tier should only be changed via server functions or admins)
CREATE OR REPLACE FUNCTION public.check_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.subscription_tier <> NEW.subscription_tier OR OLD.subscription_until <> NEW.subscription_until) THEN
    IF NOT (public.has_role(auth.uid(), 'admin')) AND (current_setting('role') <> 'service_role') THEN
      RAISE EXCEPTION 'Sensitive fields can only be updated by admins or system.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS tr_check_profile_update ON public.profiles;
CREATE TRIGGER tr_check_profile_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.check_profile_update();

-- 3. Revoke direct access to system internal tables from authenticated/anon roles
REVOKE ALL ON public.rate_limits FROM authenticated, anon;
GRANT SELECT ON public.rate_limits TO authenticated; -- Allow read if needed for stats, but write only via RPC/Service Role

