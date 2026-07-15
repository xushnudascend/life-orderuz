import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Flame, Target, Award } from "lucide-react";
import { uz } from "@/i18n";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: `Bugun — ${uz.brand.name}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

type Profile = {
  display_name: string | null;
  plan_length_days: number | null;
};
type Habit = { id: string; title: string; xp_reward: number };
type Stats = { total_xp: number; level: number } | null;
type Streak = { current_days: number } | null;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function Dashboard() {
  const { userId } = Route.useRouteContext();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState<Stats>(null);
  const [streak, setStreak] = useState<Streak>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const [p, hs, logs, s, st] = await Promise.all([
      supabase
        .from("profiles")
        .select("display_name, plan_length_days")
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("habits")
        .select("id,title,xp_reward")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("habit_logs")
        .select("habit_id")
        .eq("user_id", userId)
        .eq("logged_date", today()),
      supabase
        .from("user_stats")
        .select("total_xp, level")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("streaks")
        .select("current_days")
        .eq("user_id", userId)
        .maybeSingle(),
    ]);
    setProfile((p.data as Profile | null) ?? null);
    setHabits((hs.data as Habit[] | null) ?? []);
    setDone(
      new Set(
        ((logs.data as { habit_id: string }[] | null) ?? []).map(
          (l) => l.habit_id,
        ),
      ),
    );
    setStats((s.data as Stats) ?? null);
    setStreak((st.data as Streak) ?? null);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function toggle(h: Habit) {
    if (done.has(h.id)) {
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

  const doneCount = habits.filter((h) => done.has(h.id)).length;
  const percent = habits.length ? Math.round((doneCount / habits.length) * 100) : 0;

  return (
    <AppShell title="Bugun">
      <p className="font-ui text-xs uppercase tracking-[0.28em] text-primary">
        Bugungi kun
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
        Salom, {profile?.display_name ?? "do'st"}.
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        {profile?.plan_length_days ?? 7} kunlik yo'lda birinchi qadamni bugun
        qo'yasan. Halol bo'l — faqat sen o'zingga hisob berasan.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card label="Daraja" value={stats?.level ?? 1} />
        <Card label="XP" value={stats?.total_xp ?? 0} />
        <Card
          label="Streak"
          value={`${streak?.current_days ?? 0} kun`}
          icon={<Flame className="h-4 w-4 text-primary" />}
        />
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl">Bugungi odatlar</h2>
            <p className="font-ui text-sm text-muted-foreground">
              {doneCount} / {habits.length} — {percent}%
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/habits">
              Boshqarish <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : habits.length === 0 ? (
          <div className="rounded-[var(--radius)] border border-dashed border-border p-8 text-center">
            <p className="text-muted-foreground">
              Hali odat qo'shmagansan. Kichikdan boshla.
            </p>
            <Button asChild className="mt-4">
              <Link to="/habits">Birinchi odatni qo'shish</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {habits.map((h) => {
              const isDone = done.has(h.id);
              return (
                <button
                  key={h.id}
                  onClick={() => toggle(h)}
                  className={
                    "flex w-full items-center justify-between rounded-[var(--radius)] border p-4 text-left transition-colors " +
                    (isDone
                      ? "border-primary/40 bg-primary/5"
                      : "border-border bg-card hover:border-foreground/20")
                  }
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={
                        "flex h-9 w-9 items-center justify-center rounded-full border transition-colors " +
                        (isDone
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground")
                      }
                    >
                      <Flame className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-serif text-lg">{h.title}</p>
                      <p className="font-ui text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                        +{h.xp_reward} XP
                      </p>
                    </div>
                  </div>
                  <span className="font-ui text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {isDone ? "Bajarildi" : "Belgilash"}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[var(--radius)] border border-border p-6">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <h3 className="font-serif text-xl">Vazifalar</h3>
          </div>
          <p className="mt-2 font-ui text-sm text-muted-foreground">
            Bugun uchun uchta kichik topshiriq seni kutmoqda.
          </p>
          <Button asChild className="mt-4" variant="outline">
            <Link to="/quests">
              Ochish <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="rounded-[var(--radius)] border border-border p-6">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <h3 className="font-serif text-xl">Yutuqlar</h3>
          </div>
          <p className="mt-2 font-ui text-sm text-muted-foreground">
            Yo'lda ochilgan medallaringni ko'r.
          </p>
          <Button asChild className="mt-4" variant="outline">
            <Link to="/achievements">
              Ko'rish <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="rounded-[var(--radius)] border border-border p-6 sm:col-span-2">
          <h3 className="font-serif text-xl">Kundalik yozuv</h3>
          <p className="mt-2 font-ui text-sm text-muted-foreground">
            Bugun nimadan qochding? Nimani boshqara olding?
          </p>
          <Button asChild className="mt-4" variant="outline">
            <Link to="/journal">
              Yozishni ochish <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </AppShell>
  );
}

function Card({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius)] border border-border p-5">
      <div className="flex items-center justify-between">
        <p className="font-ui text-xs uppercase tracking-[0.22em] text-muted-foreground">
          {label}
        </p>
        {icon}
      </div>
      <p className="mt-2 font-serif text-3xl">{value}</p>
    </div>
  );
}
