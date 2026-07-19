import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/lib/use-subscription";
import { useEffect } from "react";
import { uz } from "@/i18n";

export const Route = createFileRoute("/checkout/success")({
  head: () => ({
    meta: [
      { title: `To'lov tasdiqlandi — ${uz.brand.name}` },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CheckoutSuccessPage,
});

function CheckoutSuccessPage() {
  const { isPro, loading } = useSubscription();

  useEffect(() => {
    (async () => {
      try {
        const [{ celebrate }, { isReducedMotion }] = await Promise.all([
          import("@/lib/celebrate"),
          import("@/lib/motion-pref"),
        ]);
        if (!isReducedMotion()) celebrate();
      } catch {
        /* noop */
      }
    })();
  }, []);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg rounded-[var(--radius)] border border-border bg-card p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <p className="mt-4 font-ui text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          To'lov tasdiqlandi
        </p>
        <h1 className="mt-2 font-serif text-3xl leading-tight tracking-tight">
          {isPro ? (
            <span className="inline-flex items-center gap-2">
              <Crown className="h-6 w-6 text-primary" /> Pro faol
            </span>
          ) : loading ? (
            "Faollashtirilmoqda..."
          ) : (
            "Rahmat!"
          )}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {isPro
            ? "Barcha premium funksiyalar ochildi. Endi limitsiz foydalaning."
            : loading
              ? "Obunangiz bir necha soniyada faollashadi."
              : "To'lovingiz yozib olindi. Agar obuna hali faol bo'lmasa, biroz kutib turing yoki qo'llab-quvvatlashga murojaat qiling."}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link to="/dashboard">
              Boshqaruvga <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/pricing">Reja tafsilotlari</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
