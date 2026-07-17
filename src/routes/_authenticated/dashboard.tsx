import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Flame,
} from "lucide-react";

import { uz } from "@/i18n";
import { ProgressRing } from "@/components/progress-ring";
import { RankBadge } from "@/components/rank-badge";
import { ShieldIndicator } from "@/components/shield-indicator";
import { ArchetypeRow } from "@/components/archetype-row";
import { DailyTimetable } from "@/components/daily-timetable";
import { ProfileCompletionCard } from "@/components/profile-completion-card";
import {
  circadian,
  progressMessage,
  ARCHETYPES,
  type Archetype,
  estimateDisciplineScore,
} from "@/lib/nervous";

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
  archetype: string | null;
  age: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  sex: string | null;
  onboarding_completed_at: string | null;
};
type Habit = { id: string; title: string; xp_reward: number; category: string | null };
type Stats = { total_xp: number; level: number; discipline_score: number } | null;
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
  const [shieldsUsed, setShieldsUsed] = useState(0);
  const [loaded, setLoaded] = useState(false);


  async function refresh() {
    const sevenAgo = new Date();
    sevenAgo.setUTCDate(sevenAgo.getUTCDate() - 7);
    const [p, hs, logs, s, st, sh] = await Promise.all([
      supabase
        .from("profiles")
        .select("display_name, plan_length_days, archetype, age, height_cm, weight_kg, sex, onboarding_completed_at")
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("habits")
        .select("id,title,xp_reward,category")
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
        .select("total_xp, level, discipline_score")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("streaks")
        .select("current_days")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("shields")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gt("used_on", sevenAgo.toISOString().slice(0, 10)),
    ]);
    setProfile((p.data as Profile | null) ?? null);
    setHabits((hs.data as Habit[] | null) ?? []);
    setDone(
      new Set(
        ((logs.data as { habit_id: string }[] | null) ?? []).map((l) => l.habit_id),
      ),
    );
    setStats((s.data as Stats) ?? null);
    setStreak((st.data as Streak) ?? null);
    setShieldsUsed(sh.count ?? 0);
    setLoaded(true);
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
  const c = circadian();
  const archetype: Archetype | null =
    profile?.archetype && profile.archetype in ARCHETYPES
      ? ARCHETYPES[profile.archetype as Archetype["id"]]
      : null;
  const score =
    stats?.discipline_score ??
    estimateDisciplineScore({
      currentStreak: streak?.current_days ?? 0,
      totalXp: stats?.total_xp ?? 0,
      level: stats?.level ?? 1,
    });

  const xpForNext = 100 * ((stats?.level ?? 1) + 1) ** 2;
  const xpProgress = stats ? Math.min(100, Math.round((stats.total_xp / xpForNext) * 100)) : 0;

  // Profile completion detection (fast-track / missing onboarding fields)
  const missing: string[] = [];
  if (profile) {
    if (!profile.age) missing.push("yosh");
    if (!profile.height_cm) missing.push("bo'y");
    if (!profile.weight_kg) missing.push("vazn");
    if (!profile.sex) missing.push("jins");
    if (!profile.archetype) missing.push("arxetip");
  }

  return (
    <AppShell title="Bugun">
      <ProfileCompletionCard missing={missing} />

      {/* HERO-BENTO */}
      <section className="rounded-[var(--radius)] border border-border bg-gradient-to-br from-background via-background to-primary/5 p-5 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-primary">
              {c.greeting} · {c.label}
            </p>
            <h1 className="mt-3 break-words font-serif text-2xl leading-tight tracking-tight sm:text-4xl">
              {profile?.display_name?.trim()
                ? `${profile.display_name}, `
                : "Bugungi "}
              <span className="text-muted-foreground">reja</span>
            </h1>
            <ArchetypeRow archetype={archetype} />
          </div>
          <div className="flex flex-row items-center gap-2 sm:flex-col sm:items-end">
            <ShieldIndicator usedThisWeek={shieldsUsed} max={3} />
            <Link to="/profile">
              <RankBadge score={score} />
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <ProgressRing value={doneCount} total={Math.max(1, habits.length)} />
          <div className="min-w-0">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-ui text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Daraja {stats?.level ?? 1}
              </p>
              <p className="font-ui text-[11px] text-muted-foreground">
                {stats?.total_xp ?? 0} / {xpForNext} XP
              </p>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="mt-4 font-ui text-sm text-foreground/80">
              {progressMessage(percent)}
            </p>
            <div className="mt-3 flex items-center gap-2 font-ui text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <Flame className="h-3.5 w-3.5 text-primary" />
              Streak: <span className="text-foreground">{streak?.current_days ?? 0}</span> kun
            </div>
          </div>
        </div>
      </section>

      {/* Habits & mini analytics */}
      <div className="mt-8 grid gap-6 md:grid-cols-6">
        <section className="md:col-span-4">
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

          {!loaded ? (
            <div className="space-y-2" aria-hidden>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-[68px] w-full animate-pulse rounded-[var(--radius)] border border-border bg-card"
                />
              ))}
            </div>
          ) : habits.length === 0 ? (
            <div className="rounded-[var(--radius)] border border-dashed border-border p-8 text-center">
              <p className="text-muted-foreground">
                Hozircha odat yo'q. Sun'iy intellekt shaxsiy reja tuzib bersinmi?
              </p>
              <Button asChild className="mt-4">
                <Link to="/onboarding">Shaxsiy reja tuzish</Link>
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
                      <div className={isDone ? "opacity-70" : ""}>
                        <p className={"font-serif text-lg " + (isDone ? "line-through" : "")}>
                          {h.title}
                        </p>
                        <p className="font-ui text-xs uppercase tracking-[0.2em] text-primary">
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

        <aside className="md:col-span-2">
          <div className="rounded-[var(--radius)] border border-border p-5">
            <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Hafta XP
            </p>
            <p className="mt-2 font-serif text-3xl">{stats?.total_xp ?? 0}</p>
            <Button asChild variant="ghost" size="sm" className="mt-3 -ml-2">
              <Link to="/analytics">
                Batafsil <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-4">
            <DailyTimetable />
          </div>
        </aside>
      </div>

      {/* Quick access */}
      <section className="mt-8 grid gap-3 grid-cols-2 sm:grid-cols-4">
        <Button asChild variant="outline" size="sm">
          <Link to="/workout">Mashg'ulot</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/diet">Ovqatlanish</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/quests">Vazifalar</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/mentor">Nadir</Link>
        </Button>
      </section>
    </AppShell>
  );
}
