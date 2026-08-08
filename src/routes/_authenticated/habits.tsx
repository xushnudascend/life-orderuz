import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { PageHero } from "@/components/page-hero";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2, Flame, ArrowRight, Info, Target, Zap, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { uz } from "@/i18n";
import { Panel, PanelHeader } from "@/components/panel";
import { xpFromDifficulty } from "@/lib/nervous";

export const Route = createFileRoute("/_authenticated/habits")({
  head: () => ({
    meta: [{ title: `Odatlar — ${uz.brand.name}` }, { name: "robots", content: "noindex" }],
  }),
  component: HabitsPage,
});

type Habit = {
  id: string;
  title: string;
  description: string | null;
  xp_reward: number;
  is_active: boolean;
  sort_order: number;
  category: string | null;
  scheduled_for: string | null;
};
type Log = { habit_id: string };

const CATEGORIES = [
  { id: "body", label: "Tana" },
  { id: "habit", label: "Odat" },
  { id: "learn", label: "O'rganish" },
  { id: "other", label: "Boshqa" },
] as const;

const QUICK_PICKS = [
  "20 daqiqa o'qish",
  "10 000 qadam",
  "8 stakan suv",
  "10 daqiqa meditatsiya",
  "Ertalab mashq",
];

const CUE_PICKS = [
  "Ertalab tishimni yuvgandan keyin",
  "Nonushtadan keyin",
  "Ishga borishdan oldin",
  "Kechqurun yotishdan oldin",
  "Tushlik tanaffusida",
];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}
function tomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function HabitsPage() {
  const { userId } = Route.useRouteContext();
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayLogs, setTodayLogs] = useState<Set<string>>(new Set());
  const [newTitle, setNewTitle] = useState("");
  const [cue, setCue] = useState("");
  const [stackAnchor, setStackAnchor] = useState<string>("");
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [category, setCategory] = useState<string>("habit");
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const [{ data: hs }, { data: logs }] = await Promise.all([
      supabase
        .from("habits")
        .select("id,title,description,xp_reward,is_active,sort_order,category,scheduled_for")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("habit_logs")
        .select("habit_id")
        .eq("user_id", userId)
        .eq("logged_date", today()),
    ]);
    setHabits((hs as Habit[] | null) ?? []);
    setTodayLogs(new Set(((logs as Log[] | null) ?? []).map((l) => l.habit_id)));
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function addHabit(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSaving(true);
    // Simple title for now
    const composed = newTitle.trim();
    
    // Check Freemium limit (3 habits)
    const { data: profile } = await supabase.from("profiles").select("subscription_tier").eq("id", userId).single();
    if (profile?.subscription_tier !== 'pro' && habits.length >= 3) {
      toast.error("Free rejada 3 ta odat limiti. Ko'proq uchun Pro'ga o'ting.");
      setSaving(false);
      return;
    }

    await supabase.from("habits").insert({
      user_id: userId,
      title: composed,
      xp_reward: xpFromDifficulty(difficulty),
      sort_order: habits.length,
      category,
      if_trigger: (cue.trim() || composedCue.trim()) || null,
      then_action: newTitle.trim() || null,
      context_trigger: (cue.trim() || composedCue.trim()) || null,
    } as any);
    setNewTitle("");
    setCue("");
    setStackAnchor("");
    setDifficulty(2);
    setSaving(false);
    refresh();
  }

  async function toggleToday(h: Habit) {
    // Faqat bugunga rejalashtirilgan bo'lsa ish beradi (scheduled_for null => today)
    if (h.scheduled_for && h.scheduled_for !== today()) {
      toast.info("Bu odat boshqa kunga ko'chirilgan.");
      return;
    }
    const doneNow = todayLogs.has(h.id);
    if (doneNow) {
      await supabase.from("habit_logs").delete().eq("habit_id", h.id).eq("logged_date", today());
    } else {
      await supabase.from("habit_logs").insert({
        user_id: userId,
        habit_id: h.id,
        logged_date: today(),
        xp_awarded: h.xp_reward,
      });
      await supabase.rpc(
        "award_action_xp" as never,
        {
          _source: "habit",
          _reference_id: h.id,
        } as never,
      );
      const rem = habits.length - todayLogs.size - 1;
      if (rem === 1) toast.success("Bir qadam qoldi. Iroda kuchi — bu mushak.");
      else if (rem === 0) toast.success("G'alaba! Bugungi protokol 100% yopildi.");
      else toast.success(`+${h.xp_reward} XP. Kichik qadam, katta natija.`);
    }
    refresh();
  }

  async function moveToTomorrow(h: Habit) {
    await supabase.from("habits").update({ scheduled_for: tomorrow() }).eq("id", h.id);
    toast.success("Ertangi kunga ko'chirildi.");
    refresh();
  }

  async function removeHabit(h: Habit) {
    await supabase.from("habits").update({ is_active: false }).eq("id", h.id);
    refresh();
  }

  const doneCount = useMemo(
    () => habits.filter((h) => todayLogs.has(h.id)).length,
    [habits, todayLogs],
  );

  const grouped = useMemo(() => {
    const g: Record<string, Habit[]> = { body: [], habit: [], learn: [], other: [] };
    for (const h of habits) {
      const k =
        h.category && ["body", "habit", "learn", "other"].includes(h.category)
          ? h.category
          : "other";
      g[k].push(h);
    }
    return g;
  }, [habits]);

  const todayCount = habits.filter((h) => !h.scheduled_for || h.scheduled_for === today()).length;
  return (
    <AppShell title="Odatlar">
      <PageHero
        eyebrow="Kunlik ritm"
        title="Odatlar"
        subtitle={
          <>
            Bugun: <span className="text-foreground">{doneCount}</span> / {todayCount} bajarildi.
            Kichik takror — katta o'zgarish.
            <div className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground opacity-50">
              Forgiving Streak Active
            </div>
          </>
        }
      />

      <Panel as="section" className="mt-8">
        <PanelHeader
          eyebrow="Yangi odat"
          title={
            <p className="font-serif text-lg font-semibold">
              Kichik boshla
            </p>
          }
        />
        <form onSubmit={addHabit} className="mt-4 space-y-4">
          <div className="rounded-[var(--radius)] border border-border/60 bg-background/40 p-4 transition-all hover:border-primary/30">
            <Input
              placeholder="Nima qilasiz? (masalan: 2 daqiqa kitob o'qish)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="font-ui text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-ui text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Qiyinlik
            </span>
            {[1, 2, 3, 4, 5].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d as 1 | 2 | 3 | 4 | 5)}
                className={
                  "h-8 w-8 rounded-full border font-ui text-sm transition-colors " +
                  (difficulty === d
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground")
                }
              >
                {d}
              </button>
            ))}
            <span className="font-ui text-[11px] text-muted-foreground">
              +{xpFromDifficulty(difficulty)} XP
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-ui text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Kategoriya
            </span>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={
                  "rounded-full border px-3 py-1 font-ui text-xs transition-colors " +
                  (category === c.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground")
                }
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-ui text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Tez tanlash
            </span>
            {QUICK_PICKS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setNewTitle(q)}
                className="rounded-full border border-border px-3 py-1 font-ui text-xs text-muted-foreground hover:text-foreground"
              >
                {q}
              </button>
            ))}
          </div>
          <div className="pt-1">
            <Button type="submit" disabled={saving || !newTitle.trim()}>
              <Plus className="mr-1 h-4 w-4" /> Qo'shish
            </Button>
          </div>
        </form>
      </Panel>

      <div className="mt-8 space-y-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : habits.length === 0 ? (
          <EmptyState
            icon={<Flame className="h-5 w-5" />}
            title="Hali odat qo'shilmagan"
            description="Kichkina va aniq bir odatdan boshla — masalan '2 daqiqa nafas mashqi'. Kichik boshlanish uzoq davom etadi."
          />
        ) : (
          CATEGORIES.map((cat) =>
            grouped[cat.id].length ? (
              <section key={cat.id}>
                <h2 className="mb-3 font-ui text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {cat.label}
                </h2>
                <div className="space-y-2">
                  {grouped[cat.id].map((h) => {
                    const doneRow = todayLogs.has(h.id);
                    const movedAway = h.scheduled_for && h.scheduled_for !== today();
                    return (
                      <div
                        key={h.id}
                        className={
                          "flex items-center justify-between rounded-[var(--radius)] border p-4 transition-colors " +
                          (doneRow
                            ? "border-primary/40 bg-primary/5"
                            : movedAway
                              ? "border-dashed border-border bg-card opacity-70"
                              : "border-border bg-card")
                        }
                      >
                        <button
                          type="button"
                          onClick={() => toggleToday(h)}
                          className="group/habit flex flex-1 items-center gap-4 text-left"
                        >
                          <div className="relative">
                            <span
                              className={
                                "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 " +
                                (doneRow
                                  ? "border-primary bg-primary text-primary-foreground scale-110 shadow-[0_0_15px_rgba(45,212,191,0.4)]"
                                  : "border-border bg-background text-muted-foreground group-hover/habit:border-primary/50 group-hover/habit:text-primary")
                              }
                            >
                              {doneRow ? <Check className="h-5 w-5" /> : <Flame className="h-5 w-5" />}
                            </span>
                            {!doneRow && (
                              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground animate-pulse">
                                XP
                              </span>
                            )}
                          </div>
                          <div className={doneRow ? "opacity-50" : ""}>
                            <p className={"font-serif text-[17px] leading-tight " + (doneRow ? "line-through text-muted-foreground" : "text-foreground")}>
                              {h.title}
                            </p>
                            <p className="mt-1 font-ui text-xs uppercase tracking-[0.2em] text-primary">
                              +{h.xp_reward} XP
                              {movedAway && (
                                <span className="ml-2 text-muted-foreground">· Ertaga</span>
                              )}
                            </p>
                          </div>
                        </button>
                        {!doneRow && !movedAway && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveToTomorrow(h)}
                            title="Ertangi kunga ko'chirish"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeHabit(h)}
                          aria-label="O'chirish"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null,
          )
        )}
      </div>
    </AppShell>
  );
}
