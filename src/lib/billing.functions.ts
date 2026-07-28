// Billing — real order creation + provider checkout URLs (Payme, Click).
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { pricing, type PlanId } from "@/lib/limits";

export type CheckoutInput = { plan: PlanId; provider: "payme" | "click" };

export type CheckoutResult = {
  orderId: string;
  url: string;
  amountUzs: number;
};

export const createCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: CheckoutInput) => {
    if (input?.plan !== "monthly" && input?.plan !== "yearly")
      throw new Error("invalid_plan");
    if (input?.provider !== "payme" && input?.provider !== "click")
      throw new Error("invalid_provider");
    return input;
  })
  .handler(async ({ data, context }): Promise<CheckoutResult> => {
    const plan = pricing[data.plan];
    const siteUrl = process.env.SITE_URL || "https://life-orderuz.lovable.app";
    const returnUrl = `${siteUrl}/checkout/success`;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin
      .from("payment_orders")
      .insert({
        user_id: context.userId,
        amount_uzs: plan.amount,
        currency: "UZS",
        plan: data.plan,
        provider: data.provider,
        state: "created",
      })
      .select("id")
      .single();
    if (error || !order) throw new Error("order_create_failed");

    if (data.provider === "payme") {
      const merchant = process.env.PAYME_MERCHANT_ID;
      if (!merchant) throw new Error("payme_not_configured");
      const raw = `m=${merchant};ac.order_id=${order.id};a=${plan.amount * 100};c=${returnUrl}`;
      const url = `https://checkout.paycom.uz/${Buffer.from(raw, "utf8").toString("base64")}`;
      return { orderId: order.id, url, amountUzs: plan.amount };
    }

    const serviceId = process.env.CLICK_SERVICE_ID;
    const merchantId = process.env.CLICK_MERCHANT_ID;
    if (!serviceId || !merchantId) throw new Error("click_not_configured");
    const url =
      `https://my.click.uz/services/pay?service_id=${encodeURIComponent(serviceId)}` +
      `&merchant_id=${encodeURIComponent(merchantId)}` +
      `&amount=${plan.amount}` +
      `&transaction_param=${encodeURIComponent(order.id)}` +
      `&return_url=${encodeURIComponent(returnUrl)}`;
    return { orderId: order.id, url, amountUzs: plan.amount };
  });

export const getBillingStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("profiles")
      .select("subscription_tier, subscription_until")
      .eq("id", context.userId)
      .maybeSingle();
    const row = data as { subscription_tier?: string; subscription_until?: string } | null;
    const until = row?.subscription_until ?? null;
    const active =
      row?.subscription_tier === "pro" && (!until || new Date(until) > new Date());
    return { tier: active ? ("pro" as const) : ("free" as const), until };
  });
