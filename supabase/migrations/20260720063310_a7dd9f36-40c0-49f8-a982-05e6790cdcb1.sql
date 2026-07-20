
REVOKE EXECUTE ON FUNCTION public.prevent_self_billing_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_xp_event_bounds() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_habit_xp_bounds() FROM PUBLIC, anon, authenticated;
