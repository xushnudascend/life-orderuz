import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "log_habit",
  title: "Log habit completion",
  description:
    "Mark one of the signed-in user's habits as completed for today (or a specific date). Awards XP and advances the streak.",
  inputSchema: {
    habit_id: z.string().uuid().describe("UUID of the habit to log; get from list_habits."),
    logged_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .describe("Optional ISO date YYYY-MM-DD. Defaults to today (UTC)."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
  handler: async ({ habit_id, logged_date }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data: habit, error: hErr } = await supabase
      .from("habits")
      .select("id,xp_reward")
      .eq("id", habit_id)
      .maybeSingle();
    if (hErr || !habit) {
      return { content: [{ type: "text", text: "Habit not found" }], isError: true };
    }
    const date = logged_date ?? new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from("habit_logs")
      .insert({
        user_id: ctx.getUserId()!,
        habit_id: habit.id,
        logged_date: date,
        xp_awarded: habit.xp_reward,
      })
      .select()
      .maybeSingle();
    if (error) {
      // Unique violation = already logged today; treat as idempotent success.
      if (error.code === "23505") {
        return {
          content: [{ type: "text", text: `Already logged for ${date}` }],
          structuredContent: { already_logged: true, logged_date: date },
        };
      }
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    await supabase.rpc("award_action_xp" as never, {
      _source: "habit",
      _reference_id: habit.id,
    } as never);
    return {
      content: [{ type: "text", text: `Logged habit ${habit.id} for ${date} (+${habit.xp_reward} XP).` }],
      structuredContent: { log: data },
    };
  },
});
