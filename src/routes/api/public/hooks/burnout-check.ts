import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * ProactiveNadir kunlik burnout tekshiruvi.
 * pg_cron chaqiradi (apikey header bilan). Bu marshrut anon key'ni tekshiradi,
 * so'ng service role bilan xavfli signal ko'rsatgan userlar uchun `nadir_nudges` yozadi.
 */
export const Route = createFileRoute("/api/public/hooks/burnout-check")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Authenticate via dedicated CRON_SECRET (NOT the public Supabase anon key).
        // The pg_cron job supplies this in an `x-cron-secret` header.
        const provided = request.headers.get("x-cron-secret") ?? "";
        const expected = process.env.CRON_SECRET ?? "";
        if (!expected || provided.length !== expected.length) {
          return new Response("Unauthorized", { status: 401 });
        }
        // Constant-time compare
        let diff = 0;
        for (let i = 0; i < expected.length; i++) {
          diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
        }
        if (diff !== 0) {
          return new Response("Unauthorized", { status: 401 });
        }

        const url = process.env.SUPABASE_URL!;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const admin = createClient<Database>(url, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        // Signal: oxirgi 3 kunda 0 habit_log VA discipline_score < 40
        const threeDaysAgo = new Date(Date.now() - 3 * 86400_000).toISOString().slice(0, 10);

        const { data: stats, error } = await admin
          .from("user_stats")
          .select("user_id, last_action_at, level")
          .lt("last_action_at", threeDaysAgo);

        if (error) return new Response(error.message, { status: 500 });

        let flagged = 0;
        for (const row of stats ?? []) {
          const { data: recent } = await admin
            .from("habit_logs")
            .select("id", { count: "exact", head: true })
            .eq("user_id", row.user_id)
            .gte("logged_date", threeDaysAgo);
          const recentCount = (recent as { count?: number } | null)?.count ?? 0;
          if (recentCount > 0) continue;

          // Nudge yozamiz (jadval bo'lmasa — sof no-op)
          try {
            const { error: insErr } = await admin
              .from("nadir_nudges" as never)
              .insert({
                user_id: row.user_id,
                kind: "burnout",
                message:
                  "3 kun sokinlik ko'rindi. Bugun bitta kichik qadamdan boshla — nima eng ko'p to'sqinlik qildi?",
              } as never);
            if (!insErr) flagged++;
          } catch {
            /* jadval yo'q bo'lsa jim */
          }
        }

        return Response.json({ ok: true, flagged, checked: stats?.length ?? 0 });
      },
    },
  },
});
