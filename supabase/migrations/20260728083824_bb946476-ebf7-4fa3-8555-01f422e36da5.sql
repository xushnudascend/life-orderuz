
DROP VIEW IF EXISTS public.public_profiles;

CREATE OR REPLACE FUNCTION public.public_profile_by_username(_username text)
RETURNS TABLE(id uuid, username text, display_name text, avatar_url text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT p.id, p.username, p.display_name, p.avatar_url
  FROM public.profiles p
  WHERE p.is_public = true AND p.username = _username
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.public_profile_ids_by_region(_viloyat text)
RETURNS TABLE(id uuid)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT p.id FROM public.profiles p
  WHERE p.is_public = true AND p.viloyat = _viloyat;
$$;

REVOKE ALL ON FUNCTION public.public_profile_by_username(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_profile_by_username(text) TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION public.public_profile_ids_by_region(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.public_profile_ids_by_region(text) TO authenticated, service_role;
