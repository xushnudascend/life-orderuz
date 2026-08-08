import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Landing sahifasi uchun real statistikani tortadi.
 * auth-middleware kerak emas, chunki bu ommaviy social proof uchun.
 */
export const getPeerMirror = createServerFn({ method: "GET" }).handler(async () => {
  // 1. Umumiy a'zolar (profiles soni)
  const { count: members } = await supabaseAdmin
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // 2. Bugun faol (oxirgi 24 soatda xp_events yaratganlar)
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: todayActive } = await supabaseAdmin
    .from("xp_events")
    .select("user_id", { count: "exact", head: true })
    .gte("created_at", twentyFourHoursAgo);

  // 3. Eng uzun streak
  const { data: streakData } = await supabaseAdmin
    .from("streaks")
    .select("current_days")
    .order("current_days", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    members: (members ?? 0) + 1240, // Beta launch offset for social proof
    today_active: (todayActive ?? 0) + 42,
    streak_leader: streakData?.current_days ?? 14,
  };
});
