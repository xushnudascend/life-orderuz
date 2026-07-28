// Payme Merchant API (JSON-RPC 2.0) — real Basic-auth signature check.
// Docs: https://developer.help.paycom.uz/ru/protokol_merchant_api
import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual } from "crypto";

type RpcReq = {
  id: number | string;
  method: string;
  params: Record<string, unknown>;
};

const ERR = {
  auth: { code: -32504, message: { ru: "Ошибка авторизации", uz: "Avtorizatsiya xatosi", en: "Auth error" } },
  method: { code: -32601, message: { ru: "Метод не найден", uz: "Metod topilmadi", en: "Method not found" } },
  order: { code: -31050, message: { ru: "Заказ не найден", uz: "Buyurtma topilmadi", en: "Order not found" } },
  amount: { code: -31001, message: { ru: "Неверная сумма", uz: "Summa noto'g'ri", en: "Wrong amount" } },
  state: { code: -31008, message: { ru: "Невозможно выполнить операцию", uz: "Operatsiya bajarilmaydi", en: "Cannot perform" } },
} as const;

function rpcError(id: RpcReq["id"], err: { code: number; message: unknown }, data?: unknown) {
  return Response.json({ jsonrpc: "2.0", id, error: { ...err, data } });
}

function rpcResult(id: RpcReq["id"], result: unknown) {
  return Response.json({ jsonrpc: "2.0", id, result });
}

function checkAuth(header: string | null, key: string): boolean {
  if (!header?.startsWith("Basic ")) return false;
  const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  const [user, ...rest] = decoded.split(":");
  const pass = rest.join(":");
  if (user !== "Paycom") return false;
  const a = Buffer.from(pass);
  const b = Buffer.from(key);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export const Route = createFileRoute("/api/public/payme")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.PAYME_KEY;
        if (!key) return new Response("Not configured", { status: 503 });

        const body = (await request.json().catch(() => null)) as RpcReq | null;
        if (!body || typeof body !== "object")
          return rpcError(0, ERR.method);

        if (!checkAuth(request.headers.get("authorization"), key))
          return rpcError(body.id, ERR.auth);

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const p = body.params ?? {};

        switch (body.method) {
          case "CheckPerformTransaction": {
            const account = (p as { account?: { order_id?: string } }).account;
            const amount = Number((p as { amount?: number }).amount ?? 0);
            const orderId = account?.order_id;
            if (!orderId) return rpcError(body.id, ERR.order);
            const { data: order } = await supabaseAdmin
              .from("payment_orders").select("*").eq("id", orderId).maybeSingle();
            if (!order) return rpcError(body.id, ERR.order);
            if (order.amount_uzs * 100 !== amount) return rpcError(body.id, ERR.amount);
            if (order.state !== "created") return rpcError(body.id, ERR.state);
            return rpcResult(body.id, { allow: true });
          }
          case "CreateTransaction": {
            const id = String((p as { id?: string }).id);
            const time = Number((p as { time?: number }).time);
            const amount = Number((p as { amount?: number }).amount ?? 0);
            const orderId = (p as { account?: { order_id?: string } }).account?.order_id;
            if (!orderId) return rpcError(body.id, ERR.order);
            const { data: order } = await supabaseAdmin
              .from("payment_orders").select("*").eq("id", orderId).maybeSingle();
            if (!order) return rpcError(body.id, ERR.order);
            if (order.amount_uzs * 100 !== amount) return rpcError(body.id, ERR.amount);
            // idempotency
            if (order.provider_txn_id && order.provider_txn_id !== id)
              return rpcError(body.id, ERR.state);
            await supabaseAdmin.from("payment_orders").update({
              provider: "payme",
              provider_txn_id: id,
              state: "prepared",
              raw_payload: JSON.parse(JSON.stringify(p)),
            }).eq("id", orderId);
            return rpcResult(body.id, { create_time: time, transaction: orderId, state: 1 });
          }
          case "PerformTransaction": {
            const id = String((p as { id?: string }).id);
            const { data: order } = await supabaseAdmin
              .from("payment_orders").select("*").eq("provider_txn_id", id).maybeSingle();
            if (!order) return rpcError(body.id, ERR.order);
            const perform = new Date();
            await supabaseAdmin.from("payment_orders").update({
              state: "paid", perform_time: perform.toISOString(),
            }).eq("id", order.id);
            const { activateProForOrder } = await import("@/lib/billing.server");
            await activateProForOrder(order.id);

            return rpcResult(body.id, {
              transaction: order.id,
              perform_time: perform.getTime(),
              state: 2,
            });
          }
          case "CancelTransaction": {
            const id = String((p as { id?: string }).id);
            const reason = Number((p as { reason?: number }).reason ?? 0);
            const { data: order } = await supabaseAdmin
              .from("payment_orders").select("*").eq("provider_txn_id", id).maybeSingle();
            if (!order) return rpcError(body.id, ERR.order);
            const cancel = new Date();
            const state = order.state === "paid" ? -2 : -1;
            await supabaseAdmin.from("payment_orders").update({
              state: "canceled", cancel_time: cancel.toISOString(), cancel_reason: reason,
            }).eq("id", order.id);
            return rpcResult(body.id, {
              transaction: order.id, cancel_time: cancel.getTime(), state,
            });
          }
          case "CheckTransaction": {
            const id = String((p as { id?: string }).id);
            const { data: order } = await supabaseAdmin
              .from("payment_orders").select("*").eq("provider_txn_id", id).maybeSingle();
            if (!order) return rpcError(body.id, ERR.order);
            const state = order.state === "paid" ? 2 :
              order.state === "canceled" ? (order.perform_time ? -2 : -1) : 1;
            return rpcResult(body.id, {
              transaction: order.id,
              create_time: new Date(order.created_at).getTime(),
              perform_time: order.perform_time ? new Date(order.perform_time).getTime() : 0,
              cancel_time: order.cancel_time ? new Date(order.cancel_time).getTime() : 0,
              state,
              reason: order.cancel_reason,
            });
          }
          case "GetStatement":
            return rpcResult(body.id, { transactions: [] });
          default:
            return rpcError(body.id, ERR.method);
        }
      },
    },
  },
});
