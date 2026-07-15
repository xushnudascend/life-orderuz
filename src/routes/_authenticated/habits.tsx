import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, Flame } from "lucide-react";
import { uz } from "@/i18n";

export const Route = createFileRoute("/_authenticated/habits")({
  head: () => ({
    meta: [
      { title: `Odatlar — ${uz.brand.name}` },
      { name: "robots", content: "noindex" },
    ],
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
};
type Log = { habit_id: string };

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function HabitsPage() {
  const { userId } = Route.useRouteContext();
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayLogs, setTodayLogs] = useState<Set<string>>(new Set());
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const [{ data: hs }, { data: logs }] = await Promise.all([
      supabase
        .from("habits")
        .select("id,title,description,xp_reward,is_active,sort_order")
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
    await supabase.from("habits").insert({
      user_id: userId,
      title: newTitle.trim(),
      description: newDesc.trim() || null,
      xp_reward: 10,
      sort_order: habits.length,
    });
    setNewTitle("");
    setNewDesc("");
    setSaving(false);
    refresh();
  }

  async function toggleToday(h: Habit) {
    const done = todayLogs.has(h.id);
    if (done) {
      await supabase
        .from("habit_logs")
        .delete()
        .eq("habit_id", h.id)
        .eq("logged_date", today());
    } else {
      await supabase.from("habit_logs").insert({
        user_id: userId,
        habit_id: h.id,
        logged_date: today(),
        xp_awarded: h.xp_reward,
      });
      await supabase.from("xp_events").insert({
        user_id: userId,
        source: "habit",
        amount: h.xp_reward,
        reference_id: h.id,
      });
    }
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

  return (
    <AppShell title="Odatlar">
      <p className="font-ui text-xs uppercase tracking-[0.28em] text-primary">
        Kunlik ritm
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
        Odatlar
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Bugun: <span className="text-foreground">{doneCount}</span> /{" "}
        {habits.length} bajarildi.
      </p>

      <form
        onSubmit={addHabit}
        className="mt-8 grid gap-3 rounded-[var(--radius)] border border-border p-5 md:grid-cols-[1fr_1fr_auto]"
      >
        <Input
          placeholder="Yangi odat (masalan: 10 daqiqa o'qish)"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="font-ui"
        />
        <Input
          placeholder="Izoh (ixtiyoriy)"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          className="font-ui"
        />
        <Button type="submit" disabled={saving || !newTitle.trim()}>
          <Plus className="mr-1 h-4 w-4" /> Qo'shish
        </Button>
      </form>

      <div className="mt-8 space-y-3">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : habits.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">
            Hali odat yo'q. Birinchisini yuqorida qo'shing.
          </p>
        ) : (
          habits.map((h) => {
            const done = todayLogs.has(h.id);
            return (
              <div
                key={h.id}
                className={
                  "flex items-center justify-between rounded-[var(--radius)] border p-4 transition-colors " +
                  (done
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-card")
                }
              >
                <button
                  type="button"
                  onClick={() => toggleToday(h)}
                  className="flex flex-1 items-center gap-4 text-left"
                >
                  <span
                    className={
                      "flex h-9 w-9 items-center justify-center rounded-full border transition-colors " +
                      (done
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground")
                    }
                  >
                    <Flame className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-serif text-lg">{h.title}</p>
                    {h.description && (
                      <p className="font-ui text-sm text-muted-foreground">
                        {h.description}
                      </p>
                    )}
                    <p className="mt-1 font-ui text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                      +{h.xp_reward} XP
                    </p>
                  </div>
                </button>
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
          })
        )}
      </div>
    </AppShell>
  );
}

// keep Textarea import used to allow future notes field
export const _unused = Textarea;
