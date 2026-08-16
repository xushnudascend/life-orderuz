-- Refined hardening for RPCs based on actual signatures

-- 1) log_habit_action (Internal)
REVOKE ALL ON FUNCTION public.log_habit_action(uuid, uuid, date) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.log_habit_action(uuid, uuid, date) TO service_role;

-- 2) log_habit_action_self (Client)
REVOKE ALL ON FUNCTION public.log_habit_action_self(uuid, date) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.log_habit_action_self(uuid, date) TO authenticated;

-- 3) consume_telegram_link_token (Internal)
REVOKE ALL ON FUNCTION public.consume_telegram_link_token(text, text) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_telegram_link_token(text, text) TO service_role;

-- 4) touch_nadir_thread (Internal - verified it takes no args from pg_proc)
REVOKE ALL ON FUNCTION public.touch_nadir_thread() FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.touch_nadir_thread() TO service_role;

-- 5) rate_limit_hit (Internal)
REVOKE ALL ON FUNCTION public.rate_limit_hit(text, integer, integer) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rate_limit_hit(text, integer, integer) TO service_role;
