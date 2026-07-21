import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Public peer mirror — anonymous aggregate counts for landing social proof.
 * Reads via SECURITY DEFINER RPC `public.get_peer_mirror` (aggregates only,
 * no PII). Safe to call from public loaders during SSR.
 */
export const getPeerMirror = createServerFn({ method: "GET" }).handler(async () => {
  const fallback = { members: null, today_active: null, streak_leader: null };
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return fallback;

    const supabase = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { data, error } = await supabase.rpc("get_peer_mirror");
    if (error || !data || (Array.isArray(data) && data.length === 0)) return fallback;

    const row = Array.isArray(data) ? data[0] : data;
    return {
      members: typeof row.members === "number" ? row.members : Number(row.members ?? 0),
      today_active:
        typeof row.today_active === "number" ? row.today_active : Number(row.today_active ?? 0),
      streak_leader:
        typeof row.streak_leader === "number"
          ? row.streak_leader
          : Number(row.streak_leader ?? 0),
    };
  } catch {
    return fallback;
  }
});
