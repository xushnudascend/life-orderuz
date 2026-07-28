import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type WeeklyChallenge = {
  id: string;
  week_start: string;
  title: string;
  description: string | null;
  target: number;
  progress: number;
  xp_reward: number;
  status: "active" | "completed" | "failed";
};

export const getWeeklyChallenge = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .rpc("ensure_weekly_challenge")
      .single();
    if (error) throw error;
    return data as WeeklyChallenge;
  });

export const bumpWeeklyChallenge = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    // Progress is recomputed server-side from real habit logs; the reward is
    // granted by the same SECURITY DEFINER routine.
    const { data, error } = await context.supabase
      .rpc("sync_weekly_challenge" as never)
      .single();
    if (error) throw error;
    return data as WeeklyChallenge;
  });

export type SeasonSummary = {
  season: {
    id: string;
    name: string;
    theme: string | null;
    starts_at: string;
    ends_at: string;
  } | null;
  myXp: number;
  rank: number | null;
  topPlayers: number;
};

export const getSeasonSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SeasonSummary> => {
    const today = new Date().toISOString().slice(0, 10);
    const { data: season } = await context.supabase
      .from("seasons")
      .select("*")
      .lte("starts_at", today)
      .gte("ends_at", today)
      .order("starts_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!season) return { season: null, myXp: 0, rank: null, topPlayers: 0 };

    const { data: mine } = await context.supabase
      .from("season_participants")
      .select("season_xp")
      .eq("season_id", season.id)
      .eq("user_id", context.userId)
      .maybeSingle();
    const myXp = mine?.season_xp ?? 0;

    const { count: topPlayers } = await context.supabase
      .from("season_participants")
      .select("*", { count: "exact", head: true })
      .eq("season_id", season.id);

    let rank: number | null = null;
    if (myXp > 0) {
      const { count: ahead } = await context.supabase
        .from("season_participants")
        .select("*", { count: "exact", head: true })
        .eq("season_id", season.id)
        .gt("season_xp", myXp);
      rank = (ahead ?? 0) + 1;
    }
    return {
      season: {
        id: season.id,
        name: season.name,
        theme: season.theme,
        starts_at: season.starts_at,
        ends_at: season.ends_at,
      },
      myXp,
      rank,
      topPlayers: topPlayers ?? 0,
    };
  });
