import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { PageHero } from "@/components/page-hero";
import { Panel } from "@/components/panel";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Loader2, Flame, CheckCircle2, Circle, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { uz } from "@/i18n";

export const Route = createFileRoute("/_authenticated/temir-intizom")({
  head: () => ({
    meta: [
      { title: `Temir Intizom — ${uz.brand.name}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TemirIntizom,
});

const TOTAL_DAYS = 21;
const MILESTONES = [
  { day: 3, label: "Uyg'onish", body: "Uch kun to'xtamading — bu kam emas." },
  { day: 7, label: "Bir hafta", body: "Odat naqshi tanani sezmoqda." },
  { day: 14, label: "Ikki hafta", body: "Yarim yo'l — endi tanaffus qimmatga tushadi." },
  { day: 21, label: "Temir Intizom", body: "Yakunlandi. Endi bu sen." },
];

type Row = { logged_date: string };

function TemirIntizom() {
  const { userId } = Route.useRouteContext();
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]); // logged_date list

  async function refresh() {
    setLoading(true);
    const { data: prof } = await supabase
      .from("profiles")
      .select("intizom_start_date, intizom_completed")
      .eq("id", userId)
      .maybeSingle();
    const p = prof as { intizom_start_date: string | null; intizom_completed: boolean | null } | null;
    setStartDate(p?.intizom_start_date ?? null);
    setCompleted(!!p?.intizom_completed);

    if (p?.intizom_start_date) {
      const { data } = await supabase
        .from("habit_logs")
        .select("logged_date")
        .eq("user_id", userId)
        .gte("logged_date", p.intizom_start_date);
      const rows = (data as Row[] | null) ?? [];
      setLogs(Array.from(new Set(rows.map((r) => r.logged_date))));
    }
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function start() {
    const today = new Date().toISOString().slice(0, 10);
    await supabase
      .from("profiles")
      .update({ intizom_start_date: today, intizom_completed: false })
      .eq("id", userId);
    toast.success("21 kunlik yo'l boshlandi.");
    refresh();
  }

  async function reset() {
    if (!confirm("Yo'lni qayta boshlamoqchimisan? Ilgarigi kunlar hisobga olinmaydi.")) return;
    await supabase
      .from("profiles")
      .update({ intizom_start_date: null, intizom_completed: false })
      .eq("id", userId);
    toast.success("Qayta boshlashga tayyor.");
    refresh();
  }

  const days = useMemo(() => {
    if (!startDate) return [] as { idx: number; date: string; done: boolean; isFuture: boolean }[];
    const start = new Date(startDate + "T00:00:00Z");
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return Array.from({ length: TOTAL_DAYS }, (_, i) => {
      const d = new Date(start);
      d.setUTCDate(start.getUTCDate() + i);
      const ds = d.toISOString().slice(0, 10);
      return {
        idx: i + 1,
        date: ds,
        done: logs.includes(ds),
        isFuture: d > today,
      };
    });
  }, [startDate, logs]);

  const doneCount = days.filter((d) => d.done).length;
  const percent = Math.round((doneCount / TOTAL_DAYS) * 100);

  // Auto-mark completed when 21 days achieved
  useEffect(() => {
    if (startDate && !completed && doneCount >= TOTAL_DAYS) {
      supabase.from("profiles").update({ intizom_completed: true }).eq("id", userId).then(() => {
        setCompleted(true);
        toast.success("Temir Intizom yakunlandi. Endi bu sen.");
      });
    }
  }, [doneCount, startDate, completed, userId]);

  return (
    <AppShell title="Temir Intizom">
      <PageHero
        eyebrow="21 kunlik yo'l"
        title="Temir Intizom."
        subtitle="Har kuni kamida bitta odat bajarasan. 21 kun to'xtamasa — u sening bir qismingga aylanadi."
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : !startDate ? (
        <div className="mt-10">
          <EmptyState
            icon={<Flame className="h-5 w-5" />}
            title="Yo'l hali boshlanmagan"
            description="21 kunlik yo'l — miyaning yangi naqshni qabul qilishi uchun kerak bo'lgan minimal davr. Bugundan boshla."
            action={
              <Button onClick={start}>
                <Flame className="mr-1 h-4 w-4" /> Bugundan boshlash
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <Panel className="mt-8 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Yo'l boshlangan
                </p>
                <p className="mt-1 font-serif text-2xl tabular-nums">
                  {new Date(startDate).toLocaleDateString("uz-UZ")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-serif text-4xl tabular-nums">
                  {doneCount}<span className="text-muted-foreground">/{TOTAL_DAYS}</span>
                </p>
                <p className="font-ui text-[11px] uppercase tracking-[0.2em] text-primary">
                  {percent}%
                </p>
              </div>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full bg-primary transition-all" style={{ width: `${percent}%` }} />
            </div>
            {completed && (
              <p className="mt-4 font-ui text-xs uppercase tracking-[0.2em] text-primary">
                Yakunlandi · Endi bu sen
              </p>
            )}
          </Panel>

          {/* 21 day grid */}
          <Panel as="section" className="mt-6 p-5">
            <div className="grid grid-cols-7 gap-2">
              {days.map((d) => {
                const cls = d.done
                  ? "border-primary bg-primary/10 text-primary"
                  : d.isFuture
                    ? "border-border bg-background text-muted-foreground/60"
                    : "border-destructive/40 bg-destructive/5 text-destructive";
                return (
                  <div
                    key={d.idx}
                    className={"flex flex-col items-center justify-center rounded-md border p-2 text-center " + cls}
                    title={d.date}
                  >
                    <span className="font-ui text-[10px] uppercase tracking-[0.16em]">Kun</span>
                    <span className="font-serif text-lg tabular-nums">{d.idx}</span>
                    {d.done ? (
                      <CheckCircle2 className="mt-1 h-3.5 w-3.5" />
                    ) : (
                      <Circle className="mt-1 h-3.5 w-3.5" />
                    )}
                  </div>
                );
              })}
            </div>
          </Panel>

          {/* Milestones */}
          <section className="mt-6 space-y-2">
            {MILESTONES.map((m) => {
              const reached = doneCount >= m.day;
              return (
                <Panel
                  key={m.day}
                  as="article"
                  className={"p-4 " + (reached ? "border-primary/40 bg-primary/5" : "")}
                >
                  <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    Kun {m.day} · {reached ? "erishildi" : "kutilmoqda"}
                  </p>
                  <p className="mt-1 font-serif text-lg">{m.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{m.body}</p>
                </Panel>
              );
            })}
          </section>

          <div className="mt-6 flex justify-end">
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw className="mr-1 h-4 w-4" /> Qayta boshlash
            </Button>
          </div>
        </>
      )}
    </AppShell>
  );
}
