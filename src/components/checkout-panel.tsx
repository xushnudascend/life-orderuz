import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { createCheckout } from "@/lib/billing.functions";
import { pricing, type PlanId } from "@/lib/limits";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";

const PROVIDERS = [
  { id: "payme" as const, name: "Payme", note: "Uzcard / Humo / Visa" },
  { id: "click" as const, name: "Click", note: "Click Up va bank kartalari" },
];

/** Real checkout — buyurtma yaratadi va to'lov tizimiga yo'naltiradi. */
export function CheckoutPanel() {
  const checkout = useServerFn(createCheckout);
  const [plan, setPlan] = useState<PlanId>("monthly");
  const [busy, setBusy] = useState<string | null>(null);

  async function pay(provider: "payme" | "click") {
    setBusy(provider);
    try {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        window.location.href = "/auth?next=/pricing";
        return;
      }
      const res = await checkout({ data: { plan, provider } });
      window.location.href = res.url;
    } catch {
      toast.error("To'lovni boshlab bo'lmadi. Birozdan so'ng qayta urinib ko'ring.");
      setBusy(null);
    }
  }

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-3xl px-5 py-16">
        <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-primary">To'lov</p>
        <h2 className="mt-3 font-serif text-2xl leading-tight tracking-tight md:text-3xl">
          Pro ni hoziroq yoqish
        </h2>

        <div className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius)] border border-border bg-border sm:grid-cols-2">
          {(["monthly", "yearly"] as PlanId[]).map((id) => {
            const p = pricing[id];
            const active = plan === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setPlan(id)}
                aria-pressed={active}
                className={
                  "bg-background p-5 text-left transition-colors " +
                  (active ? "ring-1 ring-inset ring-primary" : "hover:bg-card/40")
                }
              >
                <p className="font-ui text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  {id === "monthly" ? "Oylik" : "Yillik · 2 oy tekin"}
                </p>
                <p
                  className={
                    "mt-2 font-serif text-2xl tracking-tight tabular-nums " +
                    (active ? "text-primary" : "")
                  }
                >
                  {p.short}
                </p>
                <p className="mt-1 font-ui text-xs text-muted-foreground">
                  so'm / {id === "monthly" ? "oy" : "yil"}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {PROVIDERS.map((pr) => (
            <Button
              key={pr.id}
              size="lg"
              variant={pr.id === "payme" ? "default" : "outline"}
              disabled={busy !== null}
              onClick={() => pay(pr.id)}
              className="h-auto w-full flex-col items-start gap-0.5 rounded-[var(--radius)] px-5 py-4 font-ui"
            >
              <span className="flex w-full items-center justify-between font-semibold">
                {pr.name}
                {busy === pr.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </span>
              <span className="text-[11px] font-normal opacity-70">{pr.note}</span>
            </Button>
          ))}
        </div>

        <p className="mt-5 font-ui text-xs text-muted-foreground">
          To'lov Payme yoki Click sahifasida amalga oshiriladi. Tasdiqlangach Pro darhol ochiladi.
          14 kun ichida pulni qaytarish kafolati —{" "}
          <Link to="/refund" className="underline hover:text-foreground">
            shartlar
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
