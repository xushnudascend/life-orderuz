import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type NadirMessageRow = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
};

/** Ensure the caller has exactly one active primary Nadir thread; return its id. */
export const ensurePrimaryThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: existing } = await supabase
      .from("nadir_threads")
      .select("id")
      .eq("user_id", userId)
      .eq("is_primary", true)
      .is("archived_at", null)
      .maybeSingle();

    if (existing?.id) return { threadId: existing.id as string };

    const { data, error } = await supabase
      .from("nadir_threads")
      .insert({ user_id: userId, title: "Nadir bilan", is_primary: true })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { threadId: (data as { id: string }).id };
  });

const LoadInput = z.object({ threadId: z.string().uuid(), limit: z.number().int().min(1).max(200).optional() });

/** Load messages of a thread (owned by caller). */
export const loadThreadMessages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => LoadInput.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: rows, error } = await supabase
      .from("nadir_messages")
      .select("id, role, content, created_at")
      .eq("user_id", userId)
      .eq("thread_id", data.threadId)
      .order("created_at", { ascending: true })
      .limit(data.limit ?? 100);
    if (error) throw new Error(error.message);
    return { messages: (rows ?? []) as NadirMessageRow[] };
  });

/** Clear the primary thread (soft: archive + create a fresh one). */
export const resetPrimaryThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await supabase
      .from("nadir_threads")
      .update({ archived_at: new Date().toISOString(), is_primary: false })
      .eq("user_id", userId)
      .eq("is_primary", true);
    const { data, error } = await supabase
      .from("nadir_threads")
      .insert({ user_id: userId, title: "Nadir bilan", is_primary: true })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { threadId: (data as { id: string }).id };
  });
