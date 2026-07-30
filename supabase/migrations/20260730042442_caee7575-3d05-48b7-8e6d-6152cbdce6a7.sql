REVOKE ALL ON FUNCTION public.check_achievements(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_achievements(uuid) TO service_role;

-- keep intentional public/self-scoped RPCs explicit
REVOKE ALL ON FUNCTION public.public_profile_by_username(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_profile_by_username(text) TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION public.public_profile_ids_by_region(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.public_profile_ids_by_region(text) TO authenticated, service_role;