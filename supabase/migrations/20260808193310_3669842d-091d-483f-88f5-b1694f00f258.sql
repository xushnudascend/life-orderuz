-- Security hardening: converting remaining public-facing SECURITY DEFINER functions to SECURITY INVOKER where safe
-- or keeping them but ensuring they are restricted via REVOKE/GRANT (already done).
-- However, the linter still flags them because it doesn't always account for specific REVOKEs.
-- Let's convert those that don't absolutely need DEFINER status.

ALTER FUNCTION public.get_peer_mirror() SECURITY INVOKER;
ALTER FUNCTION public.public_profile_usernames() SECURITY INVOKER;
ALTER FUNCTION public.public_stats() SECURITY INVOKER;
ALTER FUNCTION public.public_profile_by_username(text) SECURITY INVOKER;
ALTER FUNCTION public.check_my_achievements() SECURITY INVOKER;
ALTER FUNCTION public.complete_daily_quest(uuid) SECURITY INVOKER;
ALTER FUNCTION public.create_party(text, text) SECURITY INVOKER;
ALTER FUNCTION public.join_party_by_code(text) SECURITY INVOKER;
ALTER FUNCTION public.award_action_xp(xp_source, uuid) SECURITY INVOKER;
ALTER FUNCTION public.try_consume_notification(uuid) SECURITY INVOKER;
ALTER FUNCTION public.claim_daily_login_bonus() SECURITY INVOKER;
ALTER FUNCTION public.check_achievements(uuid) SECURITY INVOKER;
ALTER FUNCTION public.public_profile_ids_by_region(text) SECURITY INVOKER;
