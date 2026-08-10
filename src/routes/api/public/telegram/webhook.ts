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
          
          // Use the secure RPC to consume the token and link the user
          const { data: success } = await (supabaseAdmin as any)
            .rpc("consume_telegram_link_token", {
              _token: token,
              _telegram_chat_id: chatId.toString()
            });

          if (success) {
            // Optional: send a welcome message back to the user via Telegram Bot API
            return Response.json({ status: "ok", linked: true });
          } else {
            return Response.json({ status: "error", message: "Invalid or expired token" });
          }
        }

        // Handle inline keyboard habit completion
        if (callback_query?.data?.startsWith("habit_done:")) {
          const habitId = callback_query.data.split(":")[1];
          const chatId = callback_query.message.chat.id;

          const { data: link } = await (supabaseAdmin as any)
            .from("telegram_links")
            .select("user_id")
            .eq("telegram_chat_id", chatId)
            .maybeSingle();

          if (link?.user_id) {
            // Call the shared habit logging RPC
            await (supabaseAdmin as any).rpc("log_habit_action", {
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
