
-- Trigger-only funksiyalar: foydalanuvchi to'g'ridan-to'g'ri chaqira olmaydi
REVOKE EXECUTE ON FUNCTION public.apply_xp_event()         FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.apply_quest_completion() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.apply_habit_log()        FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user()        FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_profile()     FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at()         FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_achievements(uuid) FROM PUBLIC, anon, authenticated;

-- User-callable funksiyalar: faqat authenticated
REVOKE EXECUTE ON FUNCTION public.use_shield(text)         FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.ensure_daily_quests()    FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.use_shield(text)         TO authenticated;
GRANT  EXECUTE ON FUNCTION public.ensure_daily_quests()    TO authenticated;

-- Read helpers: has_role va xp_to_level authenticated uchun ochiq qoladi (RLS'da ishlatiladi)
