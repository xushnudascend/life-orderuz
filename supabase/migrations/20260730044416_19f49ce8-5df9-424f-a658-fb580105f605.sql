REVOKE EXECUTE ON FUNCTION public.public_profile_usernames() FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_profile_usernames() TO service_role;