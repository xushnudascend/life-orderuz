import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Plus, Check, Flame, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Habit {
  id: string;
  title: string;
  xp_reward: number;
}

const HIDDEN_PREFIXES = [
  "/",
  "/auth",
  "/onboarding",
  "/assessment",
  "/roadmap",
  "/reset-password",
  "/terms",
  "/privacy",
  "/refund",
  "/pricing",
  "/security",
  "/install",
  "/mcp",
  "/blog",
  "/investors",
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * QuickLogFab — istalgan authenticated sahifadan bir bosishda odat log qilish.
 * Life Order reference'ga o'xshash: fixed pastda o'ngda, primary rangda.
 * Landing / auth / onboarding sahifalarida ko'rinmaydi.
 */
export function QuickLogFab() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [userId, setUserId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [logging, setLogging] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    supabase.auth.getUser().then(({ data }) => {
      if (alive) setUserId(data.user?.id ?? null);
    });
    return () => {
      alive = false;
    };
  }, []);

  const isHidden =
    !userId ||
    pathname === "/" ||
    HIDDEN_PREFIXES.some((p) => p !== "/" && pathname.startsWith(p));

  useEffect(() => {
    if (!open || !userId) return;
    let alive = true;
    setLoading(true);
    (async () => {
      const t = today();
      const [{ data: hs }, { data: logs }] = await Promise.all([
        supabase
          .from("habits")
          .select("id,title,xp_reward")
          .eq("user_id", userId)
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("habit_logs")
          .select("habit_id")
          .eq("user_id", userId)
          .eq("logged_date", t),
      ]);
      if (!alive) return;
      setHabits((hs ?? []) as Habit[]);
      setDoneIds(
        new Set(((logs ?? []) as { habit_id: string }[]).map((l) => l.habit_id)),
      );
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [open, userId]);

  async function handleLog(h: Habit) {
    if (!userId) return;
    setLogging(h.id);
    const { error } = await supabase.from("habit_logs").insert({
      user_id: userId,
      habit_id: h.id,
      logged_date: today(),
      xp_awarded: h.xp_reward,
    });
    if (!error) {
      await supabase.rpc("award_action_xp" as never, {
        _source: "habit",
        _reference_id: h.id,
      } as never);
      setDoneIds((prev) => new Set(prev).add(h.id));
      toast.success(`+${h.xp_reward} XP`);
    } else {
      toast.error("Belgilashda xatolik");
    }
    setLogging(null);
  }

  if (isHidden) return null;

  const undone = habits.filter((h) => !doneIds.has(h.id));
  const doneCount = doneIds.size;
  const total = habits.length;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Tezkor odat log qilish"
        className="fixed right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_-8px_hsl(var(--primary)/0.55)] transition-transform hover:scale-105 active:scale-95 md:right-6 md:bottom-6"
        style={{ bottom: "calc(5.5rem + env(safe-area-inset-bottom))" }}
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="flex max-h-[75dvh] flex-col rounded-t-2xl p-0"
        >
          <SheetHeader className="flex-row items-center justify-between space-y-0 p-5 pb-3">
            <div>
              <SheetTitle className="text-left font-serif text-base font-bold">
                Tezkor log
              </SheetTitle>
              <p className="mt-0.5 font-ui text-xs text-muted-foreground">
                {total > 0
                  ? `Bugun ${doneCount} / ${total} bajarilgan`
                  : "Hali odat qo'shilmagan"}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Yopish"
              className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          </SheetHeader>
          <div className="flex-1 space-y-2 overflow-y-auto px-4 pb-6">
            {loading ? (
              <>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </>
            ) : total === 0 ? (
              <div className="py-8 text-center font-ui text-sm text-muted-foreground">
                Dashboard'dan yangi odat qo'sh.
              </div>
            ) : undone.length === 0 ? (
              <div className="py-8 text-center">
                <Flame className="mx-auto mb-2 h-8 w-8 text-primary" />
                <p className="font-ui text-sm font-medium">
                  Barcha odatlar bugun bajarildi.
                </p>
                <p className="mt-1 font-ui text-xs text-muted-foreground">
                  Ertaga davom et.
                </p>
              </div>
            ) : (
              <>
                {undone.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => handleLog(h)}
                    disabled={logging === h.id}
                    className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left transition-all hover:border-primary hover:bg-primary/5 active:scale-[0.98] disabled:opacity-60"
                  >
                    <div className="h-6 w-6 shrink-0 rounded-full border-2 border-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate font-ui text-sm font-medium">
                      {h.title}
                    </span>
                    <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 font-ui text-[11px] text-primary">
                      +{h.xp_reward}
                    </span>
                  </button>
                ))}
                {doneCount > 0 && (
                  <div className="mt-2 border-t border-border/40 pt-3">
                    <p className="mb-2 px-1 font-ui text-[10px] uppercase tracking-widest text-muted-foreground">
                      Bajarilgan
                    </p>
                    {habits
                      .filter((h) => doneIds.has(h.id))
                      .map((h) => (
                        <div
                          key={h.id}
                          className="mb-1.5 flex w-full items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-2.5"
                        >
                          <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary">
                            <Check
                              className="h-3 w-3 text-primary-foreground"
                              strokeWidth={3}
                            />
                          </div>
                          <span className="min-w-0 flex-1 truncate font-ui text-sm text-muted-foreground line-through">
                            {h.title}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
