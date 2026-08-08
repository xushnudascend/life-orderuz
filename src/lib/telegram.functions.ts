import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const getTelegramLinkToken = createServerFn({ method: "POST" })
  .middleware(async ({ next, request }) => {
    // Basic auth check logic usually goes here via common middleware
    return next();
  })
  .handler(async ({ context }) => {
    const { userId } = (context as any); // Assuming userId is available in context from auth-attacher
    if (!userId) throw new Error("Unauthorized");

    const token = Math.random().toString(36).substring(2, 15);
    await (supabaseAdmin as any).from("telegram_link_tokens").insert({
      user_id: userId,
      token: token
    });

    return { token };
  });
