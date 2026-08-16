-- 1) log_habit_action HARDENING
-- Rename existing to internal version, restrict to service_role, create secure wrapper for authenticated users.

-- First, ensure the internal version exists and is correct
CREATE OR REPLACE FUNCTION public.log_habit_action(_user_id uuid, _habit_id uuid, _date date)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.habit_logs (user_id, habit_id, logged_date)
  VALUES (_user_id, _habit_id, _date)
  ON CONFLICT (user_id, habit_id, logged_date) DO NOTHING;
END;
$$;

-- Revoke from all, then grant only to service_role
REVOKE EXECUTE ON FUNCTION public.log_habit_action(uuid, uuid, date) FROM public, authenticated, anon;
GRANT EXECUTE ON FUNCTION public.log_habit_action(uuid, uuid, date) TO service_role;

-- Create secure wrapper for authenticated users
CREATE OR REPLACE FUNCTION public.log_habit_action_self(_habit_id uuid, _date date)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Force user_id to be the current authenticated user
  PERFORM public.log_habit_action(auth.uid(), _habit_id, _date);
END;
$$;

GRANT EXECUTE ON FUNCTION public.log_habit_action_self(uuid, date) TO authenticated;

COMMENT ON FUNCTION public.log_habit_action IS 'Internal habit logging. Restricted to service_role (Telegram webhook).';
COMMENT ON FUNCTION public.log_habit_action_self IS 'Secure habit logging for authenticated users. Forces auth.uid().';