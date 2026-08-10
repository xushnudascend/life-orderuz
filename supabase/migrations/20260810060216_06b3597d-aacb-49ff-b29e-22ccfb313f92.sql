-- 1. Create a dedicated schema for extensions to resolve the "Extension in Public" warning
CREATE SCHEMA IF NOT EXISTS extensions;

-- 2. Move pg_net to the extensions schema
-- Note: pg_net doesn't support ALTER EXTENSION ... SET SCHEMA, so we drop and recreate it
DROP EXTENSION IF EXISTS pg_net;
CREATE EXTENSION pg_net SCHEMA extensions;

-- 3. Update the search path for functions that might rely on pg_net (if any are known)
-- This is a preventive measure.
ALTER ROLE postgres SET search_path TO public, extensions;
ALTER ROLE authenticated SET search_path TO public, extensions;
ALTER ROLE anon SET search_path TO public, extensions;
ALTER ROLE service_role SET search_path TO public, extensions;
