import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getTelegramLinkToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { supabaseAdmin: sb } = await import("@/integrations/supabase/client.server");
    
    if (!userId) throw new Error("Unauthorized");

    // Using cryptographically secure random bytes for the token
    const token = Buffer.from(crypto.getRandomValues(new Uint8Array(24))).toString("hex");
    
    await (sb as any).from("telegram_link_tokens").insert({
      user_id: userId,
      token: token,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes expiry
    });

    return { token };
  });
