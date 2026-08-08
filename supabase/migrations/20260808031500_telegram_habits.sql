-- 1. Tokens for secure Telegram linking
CREATE TABLE IF NOT EXISTS public.telegram_link_tokens (
    token text PRIMARY KEY DEFAULT encode(gen_random_bytes(16), 'hex'),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

GRANT SELECT, INSERT ON public.telegram_link_tokens TO authenticated;
GRANT ALL ON public.telegram_link_tokens TO service_role;

ALTER TABLE public.telegram_link_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their tokens" ON public.telegram_link_tokens
    FOR ALL TO authenticated USING (auth.uid() = user_id);

-- 2. Centralized Habit Logging RPC
CREATE OR REPLACE FUNCTION public.log_habit_action(_user_id uuid, _habit_id uuid, _date date)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Rate limiting could be added here
  INSERT INTO public.habit_logs (user_id, habit_id, logged_date)
  VALUES (_user_id, _habit_id, _date)
  ON CONFLICT (user_id, habit_id, logged_date) DO NOTHING;
END;
$$;

GRANT EXECUTE ON FUNCTION public.log_habit_action TO authenticated, service_role;

-- 3. Explain public insert on failures
COMMENT ON TABLE public.payment_webhook_failures IS 'Public insertion allowed to capture failed webhook attempts for audit purposes.';
