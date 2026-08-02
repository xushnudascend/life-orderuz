import { createServerFn } from "@tanstack/react-start";

/**
 * Public peer mirror — anonymous aggregate counts for landing social proof.
 * Reads via SECURITY DEFINER RPC `public.get_peer_mirror` using the server-only
 * admin client. EXECUTE on the RPC is revoked from anon/authenticated so it
 * cannot be called directly from the browser.
 */
export const getPeerMirror = createServerFn({ method: "GET" }).handler(async () => {
  const fallback = { members: null, today_active: null, streak_leader: null };
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.rpc("get_peer_mirror");
    if (error || !data || (Array.isArray(data) && data.length === 0)) return fallback;

    const row = Array.isArray(data) ? data[0] : data;
    return {
      members: typeof row.members === "number" ? row.members : Number(row.members ?? 0),
      today_active:
        typeof row.today_active === "number" ? row.today_active : Number(row.today_active ?? 0),
      streak_leader:
        typeof row.streak_leader === "number" ? row.streak_leader : Number(row.streak_leader ?? 0),
    };
  } catch {
    return fallback;
  }
});
