import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "get_progress",
  title: "Get progress summary",
  description:
    "Return the signed-in user's current streak, longest streak, total XP, level, and discipline score.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const [stats, streak] = await Promise.all([
      supabase.from("user_stats").select("total_xp, level, discipline_score").maybeSingle(),
      supabase.from("streaks").select("current_days, longest_days, last_check_in").maybeSingle(),
    ]);
    const summary = {
      total_xp: stats.data?.total_xp ?? 0,
      level: stats.data?.level ?? 1,
      discipline_score: stats.data?.discipline_score ?? 0,
      current_streak: streak.data?.current_days ?? 0,
      longest_streak: streak.data?.longest_days ?? 0,
      last_check_in: streak.data?.last_check_in ?? null,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(summary) }],
      structuredContent: summary,
    };
  },
});
