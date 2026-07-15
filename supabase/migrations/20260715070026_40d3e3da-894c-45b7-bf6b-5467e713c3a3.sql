
-- Revoke direct EXECUTE from PUBLIC and authenticated on internal SECURITY DEFINER functions.
-- These are invoked by triggers or explicit server-side code, never by client RPC.
REVOKE ALL ON FUNCTION public.handle_new_user()          FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_profile()       FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.apply_xp_event()           FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.apply_quest_completion()   FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.apply_habit_log()          FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.check_achievements(uuid)   FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at()           FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.xp_to_level(integer)       FROM PUBLIC, anon, authenticated;

-- Keep user-callable RPCs executable (already scope work to auth.uid() internally).
GRANT EXECUTE ON FUNCTION public.use_shield(text)        TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_daily_quests()   TO authenticated;

-- xp_to_level is IMMUTABLE and safe; re-grant read-only helper usage.
GRANT EXECUTE ON FUNCTION public.xp_to_level(integer)    TO authenticated;
