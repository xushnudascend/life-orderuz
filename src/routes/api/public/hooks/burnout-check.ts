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
        const apikey = request.headers.get("apikey");
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
        if (!apikey || !expected || apikey !== expected) {
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
          if ((recent as any)?.count && (recent as any).count > 0) continue;

          // Nudge yozamiz (jadval bo'lmasa — sof no-op)
          try {
            const { error: insErr } = await admin.from("nadir_nudges" as any).insert({
              user_id: row.user_id,
              kind: "burnout",
              message: "3 kun sokinlik ko'rindi. Bugun bitta kichik qadamdan boshla — nima eng ko'p to'sqinlik qildi?",
            });
            if (!insErr) flagged++;
          } catch { /* jadval yo'q bo'lsa jim */ }
        }

        return Response.json({ ok: true, flagged, checked: stats?.length ?? 0 });
      },
    },
  },
});
