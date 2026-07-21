import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Public peer mirror — anonymous aggregate counts for landing social proof.
 * Uses SUPABASE_PUBLISHABLE_KEY (server publishable client), so it can be
 * called from public loaders during SSR without a bearer token.
 *
 * Returns real counts from the database. When counts are very small we still
 * return the honest number — "Erta bosqich" narrative on the landing owns
 * the framing.
 */
export const getPeerMirror = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      return { members: null, today_active: null, streak_leader: null };
    }

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

    const todayISO = new Date().toISOString().slice(0, 10);

    const [membersRes, todayRes, leaderRes] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase
        .from("habit_logs")
        .select("user_id", { count: "exact", head: true })
        .gte("logged_date", todayISO),
      supabase
        .from("streaks")
        .select("current_days")
        .order("current_days", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    return {
      members: membersRes.count ?? null,
      today_active: todayRes.count ?? null,
      streak_leader: leaderRes.data?.current_days ?? null,
    };
  } catch {
    return { members: null, today_active: null, streak_leader: null };
  }
});
