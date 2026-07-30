CREATE OR REPLACE FUNCTION public.public_profile_usernames()
RETURNS TABLE(username text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.username
  FROM public.profiles p
  WHERE p.is_public = true AND p.username IS NOT NULL
  ORDER BY p.username
  LIMIT 5000;
$$;

REVOKE ALL ON FUNCTION public.public_profile_usernames() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_profile_usernames() TO anon, authenticated, service_role;