import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getTelegramLinkToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { supabaseAdmin: sb } = await import("@/integrations/supabase/client.server");
    
    if (!userId) throw new Error("Unauthorized");

    const token = Math.random().toString(36).substring(2, 15);
    await (sb as any).from("telegram_link_tokens").insert({
      user_id: userId,
      token: token
    });

    return { token };
  });
