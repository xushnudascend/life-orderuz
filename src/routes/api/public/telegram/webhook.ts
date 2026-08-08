import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/telegram/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json();
        const { message, callback_query } = body;

        // Handle deep-link /start <token>
        if (message?.text?.startsWith("/start ")) {
          const token = message.text.split(" ")[1];
          const chatId = message.chat.id;
          
          // Verify token and link user
          const { data: linkReq } = await supabaseAdmin
            .from("telegram_link_tokens")
            .select("user_id")
            .eq("token", token)
            .maybeSingle();

          if (linkReq) {
            await supabaseAdmin.from("telegram_links").upsert({
              user_id: linkReq.user_id,
              telegram_chat_id: chatId
            });
            return Response.json({ status: "ok" });
          }
        }

        // Handle inline keyboard habit completion
        if (callback_query?.data?.startsWith("habit_done:")) {
          const habitId = callback_query.data.split(":")[1];
          const chatId = callback_query.message.chat.id;

          const { data: link } = await supabaseAdmin
            .from("telegram_links")
            .select("user_id")
            .eq("telegram_chat_id", chatId)
            .maybeSingle();

          if (link) {
            // Call the shared habit logging RPC
            await supabaseAdmin.rpc("log_habit_action", {
              _user_id: link.user_id,
              _habit_id: habitId,
              _date: new Date().toISOString().split("T")[0]
            });
            return Response.json({ status: "ok" });
          }
        }

        return Response.json({ status: "ignored" });
      },
    },
  },
});
