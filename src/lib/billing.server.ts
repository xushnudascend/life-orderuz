// Server-only: activate Pro after a confirmed provider payment.
import { pricing, type PlanId } from "@/lib/limits";

export async function activateProForOrder(orderId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { alertCritical } = await import("@/lib/error-capture");

  try {
    const { data: order, error: orderError } = await supabaseAdmin
      .from("payment_orders")
      .select("id, user_id, plan, state")
      .eq("id", orderId)
      .maybeSingle();

    if (orderError) throw orderError;
    if (!order) throw new Error(`Order ${orderId} not found`);
    if (order.state !== "paid") {
      alertCritical("Attempted to activate pro for unpaid order", { orderId, state: order.state });
      return;
    }

    const plan = pricing[(order.plan as PlanId) in pricing ? (order.plan as PlanId) : "monthly"];

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("subscription_until")
      .eq("id", order.user_id)
      .maybeSingle();

    if (profileError) throw profileError;

    const current = (profile as { subscription_until?: string } | null)?.subscription_until;
    const base = current && new Date(current) > new Date() ? new Date(current) : new Date();
    base.setMonth(base.getMonth() + plan.months);

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ subscription_tier: "pro", subscription_until: base.toISOString() })
      .eq("id", order.user_id);

    if (updateError) throw updateError;
    
    console.log(`[BILLING] Activated Pro for user ${order.user_id} until ${base.toISOString()}`);
  } catch (err) {
    alertCritical("Failed to activate pro for order", { 
      orderId, 
      error: err instanceof Error ? err.message : String(err) 
    });
    throw err;
  }
}

