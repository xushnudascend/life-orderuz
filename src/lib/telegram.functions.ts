import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const getTelegramLinkToken = createServerFn({ method: "POST" })
  .handler(async ({ request }) => {
    // In TanStack Start, we extract auth context usually via a middleware or directly if context is shaped
    // For this implementation, we will use the standard Supabase user check within the handler
    const { supabaseAdmin: sb } = await import("@/integrations/supabase/client.server");
    
    // We need to verify the user from the session
    // This is a simplified version; in production, you'd use a middleware to populate context.userId
    const { data: { user } } = await sb.auth.getUser(request.headers.get("Authorization")?.split(" ")[1] ?? "");
    if (!user) throw new Error("Unauthorized");

    const token = Math.random().toString(36).substring(2, 15);
    await (sb as any).from("telegram_link_tokens").insert({
      user_id: user.id,
      token: token
    });

    return { token };
  });
