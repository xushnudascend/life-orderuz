import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHero } from "@/components/page-hero";
import { Panel, PanelHeader } from "@/components/panel";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { pricing } from "@/lib/limits";

export const Route = createFileRoute("/_authenticated/settings/subscription")({
  head: () => ({
    meta: [{ title: `Obunani boshqarish — Life Order` }, { name: "robots", content: "noindex" }],
  }),
  component: SubscriptionSettings,
});

function SubscriptionSettings() {
  const { userId } = Route.useRouteContext();
  const [tier, setTier] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", userId)
        .maybeSingle();
      setTier((data as { subscription_tier?: string } | null)?.subscription_tier ?? "free");
      setLoading(false);
    })();
  }, [userId]);

  async function handleCancel() {
    setCanceling(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ subscription_tier: "free" })
        .eq("id", userId);
      
      if (error) throw error;
      
      setTier("free");
      setConfirmCancel(false);
      toast.success("Obuna bekur qilindi. Keyingi to'lovlar olinmaydi.");
    } catch (e) {
      toast.error("Xato yuz berdi. Iltimos qayta urinib ko'ring.");
    } finally {
      setCanceling(false);
    }
  }

  if (loading) {
    return (
      <AppShell title="Obuna">
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  const isPro = tier === "pro";

  return (
    <AppShell title="Obuna boshqaruvi">
      <PageHero
        eyebrow="Sozlamalar"
        title="Obuna va Billing"
        subtitle="Obuna holatingizni ko'ring va xavfsiz boshqaring."
      />

      <div className="mt-8 space-y-6 max-w-2xl">
        <Panel>
          <PanelHeader 
            eyebrow="Joriy reja"
            title={
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl font-bold">{isPro ? "Life Order Pro" : "Life Order Free"}</h3>
                {isPro && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 font-ui text-[10px] font-bold uppercase tracking-wider text-primary">
                    Aktiv
                  </span>
                )}
              </div>
            }
          />
          
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-background/40 p-4">
                <p className="font-ui text-[10px] uppercase tracking-widest text-muted-foreground">Narx</p>
                <p className="mt-1 font-serif text-xl">{isPro ? pricing.monthly.label : "0 so'm"}</p>
              </div>
              <div className="rounded-xl border border-border bg-background/40 p-4">
                <p className="font-ui text-[10px] uppercase tracking-widest text-muted-foreground">Holat</p>
                <p className="mt-1 font-ui text-sm flex items-center gap-1.5">
                  {isPro ? (
                    <><CheckCircle2 className="h-4 w-4 text-primary" /> To'lov shaffof</>
                  ) : (
                    "Cheklangan imkoniyatlar"
                  )}
                </p>
              </div>
            </div>

            {isPro ? (
              <div className="pt-4 border-t border-border/60">
                {!confirmCancel ? (
                  <Button 
                    variant="ghost" 
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 text-xs font-ui uppercase tracking-widest"
                    onClick={() => setConfirmCancel(true)}
                  >
                    Obunani bekor qilish
                  </Button>
                ) : (
                  <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <p className="font-ui text-sm font-semibold text-foreground">Haqiqatan ham bekor qilmoqchimisiz?</p>
                        <p className="mt-1 font-ui text-xs text-muted-foreground leading-relaxed">
                          Bekor qilsangiz, keyingi oydan Pro imkoniyatlar (Nadir Pro, Haftalik AI hisobot, Cheksiz odatlar) yopiladi.
                        </p>
                        <div className="mt-4 flex gap-3">
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="font-ui text-xs h-8"
                            disabled={canceling}
                            onClick={handleCancel}
                          >
                            {canceling ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
                            Tasdiqlash va bekor qilish
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="font-ui text-xs h-8"
                            onClick={() => setConfirmCancel(false)}
                          >
                            Qolish
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="pt-4">
                <Button asChild className="w-full sm:w-auto rounded-full font-ui font-bold">
                  <a href="/pricing">Pro ga o'tish <Shield className="ml-2 h-4 w-4" /></a>
                </Button>
              </div>
            )}
          </div>
        </Panel>

        <Panel className="border-primary/20">
          <PanelHeader eyebrow="Billing Shaffofligi" />
          <div className="mt-4 space-y-3 font-ui text-[13px] text-muted-foreground leading-relaxed">
            <p>
              Life Order "Halol Billing" siyosatiga amal qiladi:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Hech qanday yashirin to'lovlar yoki kutilmagan komissiyalar yo'q.</li>
              <li>Obuna bo'lganda to'lov sanasi va miqdori har doim aniq ko'rsatiladi.</li>
              <li>Bekor qilish har doim bir necha bosishda amalga oshiriladi, qo'shimcha to'siqlar yo'q.</li>
              <li>To'lovlar O'zbekistonning rasmiy Payme va Click tizimlari orqali xavfsiz o'tadi.</li>
            </ul>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
