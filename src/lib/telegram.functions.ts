import { createServerFn } from "@tanstack/react-start";

export const getTelegramLinkToken = createServerFn({ method: "POST" })
  .handler(async ({ request }) => {
    const { supabaseAdmin: sb } = await import("@/integrations/supabase/client.server");
    const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
    
    const { data: { user } } = await sb.auth.getUser(authHeader?.split(" ")[1] ?? "");
    if (!user) throw new Error("Unauthorized");

    const token = Math.random().toString(36).substring(2, 15);
    await (sb as any).from("telegram_link_tokens").insert({
      user_id: user.id,
      token: token
    });

    return { token };
  });
