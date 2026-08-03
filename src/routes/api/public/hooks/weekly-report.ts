import { createFileRoute } from "@tanstack/react-router";

/**
 * Haftalik hisobotlarni avtomatik tayyorlash (pg_cron chaqiradi).
 * Har dushanba 06:00 (UTC) ishga tushadi va o'tgan hafta uchun
 * har bir faol foydalanuvchiga weekly_reports yozuvini yaratadi.
 */
export const Route = createFileRoute("/api/public/hooks/weekly-report")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey = request.headers.get("apikey");
        const expected = process.env["SUPABASE_PUBLISHABLE_KEY"];
        if (!expected || apikey !== expected) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.rpc("build_weekly_reports" as never, {} as never);

        if (error) {
          console.error("weekly-report failed:", error.message);
          return Response.json({ success: false, error: error.message }, { status: 500 });
        }

        return Response.json({ success: true, reports: data ?? 0 });
      },
    },
  },
});
