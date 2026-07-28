// Click Merchant API — Prepare + Complete with real MD5 sign check.
// Docs: https://docs.click.uz/en/click-api/
import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "crypto";

const ERROR: Record<string, number> = {
  OK: 0,
  SIGN: -1,
  INVALID_AMOUNT: -2,
  ACTION: -3,
  ALREADY_PAID: -4,
  ORDER_NOT_FOUND: -5,
  TX_NOT_FOUND: -6,
  BAD_REQUEST: -8,
  CANCELED: -9,
};

function md5(s: string) {
  return createHash("md5").update(s).digest("hex");
}

async function parseForm(request: Request): Promise<Record<string, string>> {
  const ct = request.headers.get("content-type") ?? "";
  const out: Record<string, string> = {};
  if (ct.includes("application/json")) {
    const j = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    for (const [k, v] of Object.entries(j)) out[k] = String(v ?? "");
    return out;
  }
  const fd = await request.formData();
  fd.forEach((v, k) => (out[k] = String(v)));
  return out;
}

export const Route = createFileRoute("/api/public/click/$action")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const secret = process.env.CLICK_SECRET_KEY;
        if (!secret) return new Response("Not configured", { status: 503 });
        const action = params.action;
        if (action !== "prepare" && action !== "complete")
          return new Response("Not found", { status: 404 });

        const p = await parseForm(request);
        const {
          click_trans_id, service_id, merchant_trans_id, merchant_prepare_id,
          amount, action: act, sign_time, sign_string, error,
        } = p;

        const base = action === "prepare"
          ? `${click_trans_id}${service_id}${secret}${merchant_trans_id}${amount}${act}${sign_time}`
          : `${click_trans_id}${service_id}${secret}${merchant_trans_id}${merchant_prepare_id}${amount}${act}${sign_time}`;

        const respond = (extra: Record<string, unknown>, err = ERROR.OK, note = "Success") =>
          Response.json({
            click_trans_id, merchant_trans_id,
            error: err, error_note: note, ...extra,
          });

        if (md5(base) !== sign_string) return respond({}, ERROR.SIGN, "SIGN CHECK FAILED");
        if (!merchant_trans_id) return respond({}, ERROR.ORDER_NOT_FOUND, "Order not found");

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: order } = await supabaseAdmin
          .from("payment_orders").select("*").eq("id", merchant_trans_id).maybeSingle();
        if (!order) return respond({}, ERROR.ORDER_NOT_FOUND, "Order not found");

        const paidAmount = Math.round(Number(amount) * 100) / 100;
        if (paidAmount !== Number(order.amount_uzs))
          return respond({}, ERROR.INVALID_AMOUNT, "Invalid amount");

        // Client canceled from Click side
        if (Number(error) < 0) {
          await supabaseAdmin.from("payment_orders").update({
            state: "canceled", cancel_time: new Date().toISOString(),
            provider: "click", provider_txn_id: click_trans_id,
          }).eq("id", order.id);
          return respond({ merchant_prepare_id: order.id }, ERROR.CANCELED, "Canceled");
        }

        if (action === "prepare") {
          if (order.state === "paid") return respond({}, ERROR.ALREADY_PAID, "Already paid");
          await supabaseAdmin.from("payment_orders").update({
            state: "prepared", provider: "click", provider_txn_id: click_trans_id,
            raw_payload: p,
          }).eq("id", order.id);
          return respond({ merchant_prepare_id: order.id, merchant_confirm_id: order.id });
        }

        // complete
        if (order.state === "paid") return respond({}, ERROR.ALREADY_PAID, "Already paid");
        if (order.state !== "prepared") return respond({}, ERROR.ACTION, "Wrong state");
        await supabaseAdmin.from("payment_orders").update({
          state: "paid", perform_time: new Date().toISOString(),
        }).eq("id", order.id);
        const { activateProForOrder } = await import("@/lib/billing.server");
        await activateProForOrder(order.id);
        return respond({ merchant_confirm_id: order.id });

      },
    },
  },
});
