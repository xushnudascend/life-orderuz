// Server-only: activate Pro after a confirmed provider payment.
import { pricing, type PlanId } from "@/lib/limits";

export async function activateProForOrder(orderId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: order } = await supabaseAdmin
    .from("payment_orders")
    .select("id, user_id, plan, state")
    .eq("id", orderId)
    .maybeSingle();
  if (!order || order.state !== "paid") return;

  const plan = pricing[(order.plan as PlanId) in pricing ? (order.plan as PlanId) : "monthly"];

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("subscription_until")
    .eq("id", order.user_id)
    .maybeSingle();

  const current = (profile as { subscription_until?: string } | null)?.subscription_until;
  const base =
    current && new Date(current) > new Date() ? new Date(current) : new Date();
  base.setMonth(base.getMonth() + plan.months);

  await supabaseAdmin
    .from("profiles")
    .update({ subscription_tier: "pro", subscription_until: base.toISOString() })
    .eq("id", order.user_id);
}
