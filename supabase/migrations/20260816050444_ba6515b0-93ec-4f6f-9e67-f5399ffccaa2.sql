DO $$ 
BEGIN
    -- Fix SUPA_authenticated_security_definer_function_executable / SUPA_anon_security_definer_function_executable
    -- Revoke all on consume_telegram_link_token and explicitly grant to service_role only
    REVOKE ALL ON FUNCTION public.consume_telegram_link_token(text, text) FROM public, anon, authenticated;
    GRANT EXECUTE ON FUNCTION public.consume_telegram_link_token(text, text) TO service_role;

    -- Ensure touch_nadir_thread is restricted (trigger functions usually should be)
    REVOKE ALL ON FUNCTION public.touch_nadir_thread() FROM public, anon, authenticated;
    GRANT EXECUTE ON FUNCTION public.touch_nadir_thread() TO service_role;
END $$;

-- internal_id: SUPA_authenticated_security_definer_function_executable
-- internal_id: SUPA_anon_security_definer_function_executable
-- Rationale: Restricting SECURITY DEFINER functions to service_role to prevent unauthorized execution via the Data API.
