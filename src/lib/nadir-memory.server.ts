import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type Memory = { content: string; importance: number; kind: string };

function adminClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function fetchNadirMemories(userId: string, limit = 8): Promise<Memory[]> {
  const supa = adminClient();
  const { data } = await supa
    .from("nadir_memories")
    .select("content, importance, kind")
    .eq("user_id", userId)
    .order("importance", { ascending: false })
    .order("last_used_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as Memory[];
}

export async function insertNadirMemories(userId: string, items: Memory[]): Promise<void> {
  if (!items.length) return;
  const supa = adminClient();
  const rows = items
    .filter((m) => m.content && m.content.trim().length > 3 && m.content.length < 240)
    .slice(0, 5)
    .map((m) => ({
      user_id: userId,
      content: m.content.trim(),
      importance: Math.max(1, Math.min(5, m.importance | 0 || 3)),
      kind: ["fact", "goal", "pattern", "preference", "trigger"].includes(m.kind) ? m.kind : "fact",
    }));
  if (!rows.length) return;
  await supa.from("nadir_memories").insert(rows);
}

export function formatMemoriesForPrompt(memories: Memory[]): string {
  if (!memories.length) return "";
  const lines = memories.map((m) => `- [${m.kind}] ${m.content}`);
  return `\n\nSen bu foydalanuvchi haqida eslab qolgan faktlar (RAG-lite xotira — javobingda tabiiy foydalan, ro'yxatlab takrorlama):\n${lines.join("\n")}`;
}
