-- 1. user_achievements: badges only granted server-side (check_achievements)
DROP POLICY IF EXISTS "insert own achievements" ON public.user_achievements;
REVOKE INSERT, UPDATE, DELETE ON public.user_achievements FROM authenticated, anon;
GRANT SELECT ON public.user_achievements TO authenticated;
GRANT ALL ON public.user_achievements TO service_role;

-- 2. daily_quests: quests generated and completed only via SECURITY DEFINER routines
DROP POLICY IF EXISTS "insert own quests" ON public.daily_quests;
DROP POLICY IF EXISTS "update own quests" ON public.daily_quests;
DROP POLICY IF EXISTS "delete own quests" ON public.daily_quests;
REVOKE INSERT, UPDATE, DELETE ON public.daily_quests FROM authenticated, anon;
GRANT SELECT ON public.daily_quests TO authenticated;
GRANT ALL ON public.daily_quests TO service_role;
