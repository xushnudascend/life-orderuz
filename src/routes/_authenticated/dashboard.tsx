import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  Dumbbell,
  Flame,
  Salad,
  Sparkles,
  Target,
  Sprout,
} from "lucide-react";
import { EmptyState } from "@/components/empty-state";

import { uz } from "@/i18n";
import { ProgressRing } from "@/components/progress-ring";
import { RankBadge } from "@/components/rank-badge";
import { ShieldIndicator } from "@/components/shield-indicator";
import { ArchetypeRow } from "@/components/archetype-row";
import { DailyTimetable } from "@/components/daily-timetable";
import { ProfileCompletionCard } from "@/components/profile-completion-card";
import { NadirNudgeBanner } from "@/components/nadir-nudge-banner";
import { Panel, PanelHeader, PanelValue } from "@/components/panel";
import { ErrorBoundary } from "@/components/error-boundary";
import { CountUpNumber } from "@/components/count-up-number";
import { StreakMilestone } from "@/components/streak-milestone";
import { celebrate, floatXp } from "@/lib/celebrate";
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
    // Daily login bonus — silent auto-claim once per day
    supabase.rpc("claim_daily_login_bonus" as never).then(({ data }) => {
      const row = Array.isArray(data) ? data[0] : data;
      const awarded = (row as { awarded?: boolean } | null)?.awarded;
      const xp = (row as { xp?: number } | null)?.xp ?? 0;
      if (awarded && xp > 0) {
        import("sonner").then(({ toast }) => {
          toast.success(`+${xp} XP kunlik bonus`);
        });
      }
    });
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
    <AppShell title="Bosh sahifa">
      <ProfileCompletionCard missing={missing} />
      <NadirNudgeBanner userId={userId} />

      {/* Salom + kontekst */}
      <div className="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
            {c.greeting} · {c.label}
          </p>
          <h1 className="mt-1.5 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            {profile?.display_name?.trim()
              ? `${profile.display_name}, `
              : "Bugungi "}
            <span className="text-muted-foreground">reja</span>
          </h1>
          <ArchetypeRow archetype={archetype} />
        </div>
        <p className="font-ui text-xs text-muted-foreground sm:text-right">
          {progressMessage(percent)}
        </p>
      </div>

      {/* KPI qatori */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <Panel>
          <PanelHeader eyebrow="Bugun" />
          <PanelValue
            value={`${doneCount}/${habits.length || 0}`}
            caption={`${percent}% bajarildi`}
            trend={percent >= 70 ? "up" : "flat"}
          />
        </Panel>
        <Panel>
          <PanelHeader eyebrow="Streak" />
          <PanelValue
            value={
              <span className="inline-flex items-center gap-1.5">
                <Flame className="h-5 w-5 text-primary" />
                {streak?.current_days ?? 0}
              </span>
            }
            caption="ketma-ket kun"
          />
        </Panel>
        <Panel>
          <PanelHeader eyebrow={`Daraja ${stats?.level ?? 1}`} />
          <PanelValue
            value={`${stats?.total_xp ?? 0} XP`}
            caption={`${xpProgress}% keyingi darajaga`}
          />
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </Panel>
        <Panel>
          <PanelHeader
            eyebrow="Himoya"
            action={
              <Link
                to="/profile"
                className="font-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
              >
                Rank
              </Link>
            }
          />
          <div className="mt-2 flex items-center justify-between gap-2">
            <ShieldIndicator usedThisWeek={shieldsUsed} max={3} />
            <RankBadge score={score} />
          </div>
        </Panel>
      </div>

      {/* Asosiy grid */}
      <div className="mt-4 grid gap-3 sm:gap-4 lg:grid-cols-12">
        {/* Habits */}
        <Panel className="lg:col-span-7">
          <PanelHeader
            eyebrow="Bugungi odatlar"
            title={
              <p className="font-serif text-lg font-semibold">
                {doneCount} / {habits.length} — {percent}%
              </p>
            }
            action={
              <Button asChild variant="ghost" size="sm" className="h-8">
                <Link to="/habits">
                  Boshqarish <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            }
          />

          {!loaded ? (
            <div
              className="mt-3 space-y-1.5"
              role="status"
              aria-live="polite"
              aria-busy="true"
            >
              <span className="sr-only">Bugungi odatlar yuklanmoqda…</span>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-12 w-full" aria-hidden />
              ))}
            </div>
          ) : habits.length === 0 ? (
            <EmptyState
              className="mt-4"
              icon={<Sprout className="h-5 w-5" />}
              title="Bugundan boshlab bitta kichik odat"
              description="Miya katta o'zgarishlarga qarshilik qiladi. 2 daqiqalik odatdan boshlang — Nadir siz uchun shaxsiy reja tuzib beradi."
              action={
                <Button asChild size="sm">
                  <Link to="/onboarding">Shaxsiy reja tuzish</Link>
                </Button>
              }
            />

          ) : (
            <ul className="mt-3 space-y-1">
              {habits.map((h) => {
                const isDone = done.has(h.id);
                return (
                  <li key={h.id}>
                    <button
                      onClick={() => toggle(h)}
                      aria-pressed={isDone}
                      className={
                        "tap group flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left transition-all active:scale-[0.995] " +
                        (isDone
                          ? "border-primary/40 bg-primary/[0.06]"
                          : "border-border bg-background/30 hover:border-primary/40 hover:bg-background/60")
                      }
                    >
                      <span
                        className={
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors " +
                          (isDone
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground group-hover:border-primary/60 group-hover:text-primary")
                        }
                      >
                        {isDone ? (
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        ) : (
                          <Flame className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <span
                        className={
                          "min-w-0 flex-1 truncate font-ui text-sm " +
                          (isDone ? "text-muted-foreground line-through" : "text-foreground")
                        }
                      >
                        {h.title}
                      </span>
                      <span className="shrink-0 font-ui text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                        +{h.xp_reward}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        {/* Progress ring + XP */}
        <Panel className="lg:col-span-5">
          <PanelHeader eyebrow="Kun progressi" />
          <div className="mt-3 grid grid-cols-[auto_1fr] items-center gap-4">
            <ProgressRing value={doneCount} total={Math.max(1, habits.length)} />
            <div className="min-w-0">
              <p className="font-ui text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Daraja {stats?.level ?? 1}
              </p>
              <p className="mt-1 font-serif text-xl font-semibold tabular-nums">
                {stats?.total_xp ?? 0}{" "}
                <span className="text-sm text-muted-foreground">/ {xpForNext} XP</span>
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <Link
                to="/analytics"
                className="mt-3 inline-flex items-center gap-1 font-ui text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
              >
                Batafsil tahlil <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </Panel>

        {/* Timetable */}
        <div className="lg:col-span-7">
          <ErrorBoundary boundary="dashboard_daily_timetable">
            <DailyTimetable />
          </ErrorBoundary>
        </div>

        {/* Quick access */}
        <Panel className="lg:col-span-5">
          <PanelHeader eyebrow="Tezkor kirish" />
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { to: "/workout", label: "Mashg'ulot", icon: Dumbbell },
              { to: "/diet", label: "Ovqatlanish", icon: Salad },
              { to: "/quests", label: "Vazifalar", icon: Target },
              { to: "/mentor", label: "Nadir", icon: Sparkles },
            ].map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="tap group flex items-center gap-2.5 rounded-md border border-border bg-background/30 px-3 py-2.5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-background/60"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-primary group-hover:text-primary">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="font-ui text-sm font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
