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
  name: "create_journal_entry",
  title: "Create journal entry",
  description: "Write a new journal entry for the signed-in user with optional mood (1-5).",
  inputSchema: {
    content: z.string().trim().min(1).describe("The journal entry text."),
    mood: z.number().int().min(1).max(5).optional().describe("Mood rating 1 (low) to 5 (great)."),
    entry_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .describe("Optional ISO date YYYY-MM-DD. Defaults to today (UTC)."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  handler: async ({ content, mood, entry_date }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("journal_entries")
      .insert({
        user_id: ctx.getUserId()!,
        content,
        mood: mood ?? null,
        entry_date: entry_date ?? new Date().toISOString().slice(0, 10),
      })
      .select()
      .single();
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: `Journal entry saved (id: ${data.id}).` }],
      structuredContent: { entry: data },
    };
  },
});
