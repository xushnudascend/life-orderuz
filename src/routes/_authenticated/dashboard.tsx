import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Dumbbell, Flame, Salad, Sparkles, Target, Sprout } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

import { uz } from "@/i18n";
import { applyArchetypeTheme } from "@/lib/archetype-theme";
import { DailyTimetable } from "@/components/daily-timetable";
import { ProfileCompletionCard } from "@/components/profile-completion-card";
import { NadirNudgeBanner } from "@/components/nadir-nudge-banner";
import { StreakAtRisk } from "@/components/streak-at-risk";
import { ZeigarnikRing } from "@/components/zeigarnik-ring";
import { PeakEndReflect } from "@/components/peak-end-reflect";
import { EasyModeRibbon } from "@/components/easy-mode-ribbon";
import { AIInsightCard } from "@/components/ai-insight-card";
import { RetentionPanels } from "@/components/retention-panels";
import { HumanPotentialPanel } from "@/components/human-potential-panel";
import { HundredDayTimeline } from "@/components/hundred-day-timeline";
import { PeakEndCurve } from "@/components/peak-end-curve";
import { Panel, PanelHeader } from "@/components/panel";
import { StatsHeroBento } from "@/components/stats-hero-bento";
import { ErrorBoundary } from "@/components/error-boundary";

import { StreakMilestone } from "@/components/streak-milestone";
import { celebrate, floatXp } from "@/lib/celebrate";
import { track } from "@/lib/analytics";
import {
  circadian,
  progressMessage,
  ARCHETYPES,
  type Archetype,
  estimateDisciplineScore,
} from "@/lib/nervous";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{ title: `Bugun — ${uz.brand.name}` }, { name: "robots", content: "noindex" }],
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
  const [milestone, setMilestone] = useState<number | null>(null);

  async function refresh() {
    const { data } = await supabase.rpc("dashboard_snapshot" as never);
    const snap = (data ?? {}) as {
      profile?: Profile | null;
      habits?: Habit[] | null;
      done_today?: string[] | null;
      stats?: Stats;
      streak?: Streak;
      shields_used_week?: number | null;
    };
    setProfile(snap.profile ?? null);
    setHabits(snap.habits ?? []);
    setDone(new Set(snap.done_today ?? []));
    setStats(snap.stats ?? null);
    setStreak(snap.streak ?? null);
    setShieldsUsed(snap.shields_used_week ?? 0);
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
  }, [userId]);

  async function toggle(h: Habit, ev?: React.MouseEvent) {
    const wasDone = done.has(h.id);
    if (wasDone) {
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
      // Micro-reward feedback
      if (ev) {
        const rect = (ev.currentTarget as HTMLElement).getBoundingClientRect();
        floatXp(rect.right - 24, rect.top + rect.height / 2, h.xp_reward);
      }
    }
    const prevStreak = streak?.current_days ?? 0;
    await refresh();
    // Trigger streak milestone celebration when crossing 3 / 7 / 21 / 30 / 60 / 100 / 365
    const MARKS = [3, 7, 21, 30, 60, 100, 365];
    // Read latest streak after refresh
    const { data: st } = await supabase
      .from("streaks")
      .select("current_days")
      .eq("user_id", userId)
      .maybeSingle();
    const now = (st as { current_days: number } | null)?.current_days ?? 0;
    if (!wasDone) {
      track("habit_logged", { habit_id: h.id, xp: h.xp_reward });
    }
    if (!wasDone && now > prevStreak && MARKS.includes(now)) {
      setMilestone(now);
      celebrate(now >= 30 ? "big" : "small");
      track("streak_milestone", { days: now });
    } else if (!wasDone) {
      // small perimeter confetti when finishing all of today
      const doneNow = habits.filter((x) => done.has(x.id) || x.id === h.id).length;
      if (doneNow === habits.length && habits.length > 0) {
        celebrate("big");
        track("habit_completed_all_today", { count: habits.length });
      }
    }
  }

  const doneCount = habits.filter((h) => done.has(h.id)).length;
  const percent = habits.length ? Math.round((doneCount / habits.length) * 100) : 0;
  const c = circadian();
  const archetype: Archetype | null =
    profile?.archetype && profile.archetype in ARCHETYPES
      ? ARCHETYPES[profile.archetype as Archetype["id"]]
      : null;
  useEffect(() => {
    applyArchetypeTheme(profile?.archetype ?? null);
  }, [profile?.archetype]);

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
      {/* 1-QATLAM — Zarur signal */}
      <ProfileCompletionCard missing={missing} />
      <NadirNudgeBanner userId={userId} />
      <StreakAtRisk streakDays={streak?.current_days ?? 0} percent={percent} />

      {/* Unified Hero — Ascend-style dense bento */}
      {!loaded ? (
        <div
          className="mb-5 rounded-[var(--radius)] border border-border/70 bg-card p-4 sm:mb-6 sm:p-6"
          aria-busy="true"
        >
          <div className="skeleton h-4 w-32" />
          <div className="skeleton mt-3 h-8 w-64" />
          <div className="mt-5 grid gap-4 sm:grid-cols-[auto_1fr]">
            <div className="skeleton h-24 w-24 rounded-full" />
            <div className="space-y-3">
              <div className="skeleton h-3 w-full" />
              <div className="grid grid-cols-2 gap-2.5">
                <div className="skeleton h-14 w-full" />
                <div className="skeleton h-14 w-full" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <StatsHeroBento
          greeting={`${c.greeting} · ${c.label}`}
          displayName={profile?.display_name ?? null}
          archetype={archetype}
          doneCount={doneCount}
          totalHabits={habits.length}
          percent={percent}
          streakDays={streak?.current_days ?? 0}
          level={stats?.level ?? 1}
          totalXp={stats?.total_xp ?? 0}
          xpProgress={xpProgress}
          xpForNext={xpForNext}
          disciplineScore={stats?.discipline_score ?? 0}
          shieldsUsed={shieldsUsed}
          score={score}
        />
      )}

      {/* 2-QATLAM — Kunlik halqa */}
      {loaded && habits.length > 0 && (
        <div className="mt-4 rounded-[var(--radius)] border border-border/70 bg-card p-4 sm:p-5">
          <ZeigarnikRing
            done={doneCount}
            total={habits.length}
            nextTitle={habits.find((h) => !done.has(h.id))?.title ?? null}
          />
        </div>
      )}

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
            <div className="mt-3 space-y-1.5" role="status" aria-live="polite" aria-busy="true">
              <span className="sr-only">Yuklanmoqda…</span>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-12 w-full" aria-hidden />
              ))}
            </div>
          ) : habits.length === 0 ? (
            <EmptyState
              className="mt-4"
              icon={<Sprout className="h-5 w-5" />}
              title="Bugundan boshlab bitta kichik odat"
              description="2 daqiqalik odatdan boshlang — Nadir siz uchun shaxsiy reja tuzib beradi."
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
                      onClick={(ev) => toggle(h, ev)}
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

        {/* Kunlik jadval */}
        <div className="lg:col-span-12">
          <ErrorBoundary boundary="dashboard_daily_timetable">
            <DailyTimetable
              profile={{
                age: profile?.age,
                sex: profile?.sex,
                height_cm: profile?.height_cm,
                weight_kg: profile?.weight_kg,
                archetype: profile?.archetype,
              }}
            />
          </ErrorBoundary>
        </div>

      </div>

      {/* 3-QATLAM — Ixtiyoriy chuqurroq ko'rinish */}
      <details className="group mt-6 rounded-[var(--radius)] border border-border/60 bg-card/40">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-ui text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground">
          <span className="flex items-center gap-2">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary/60" />
            Chuqurroq · Nadir, retentsiya, 100 kun
          </span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-open:rotate-90" />
        </summary>
        <div className="space-y-4 border-t border-border/60 p-4 sm:p-5">
          <EasyModeRibbon streakDays={streak?.current_days ?? 0} />
          <PeakEndReflect />
          <AIInsightCard
            context={`Foydalanuvchi: ${profile?.display_name ?? "do'st"}. Bugun ${doneCount}/${habits.length} odat (${percent}%). Streak: ${streak?.current_days ?? 0} kun. Daraja ${stats?.level ?? 1}, XP ${stats?.total_xp ?? 0}. Arxetip: ${archetype?.name ?? "-"}. Vaqt: ${c.label}.`}
          />
          <HundredDayTimeline streakDays={streak?.current_days ?? 0} />
          <div className="grid gap-4 lg:grid-cols-2">
            <PeakEndCurve userId={userId} />
            <HumanPotentialPanel />
          </div>
          <RetentionPanels />
        </div>
      </details>

      {milestone !== null && (
        <StreakMilestone days={milestone} onDismiss={() => setMilestone(null)} />
      )}
    </AppShell>
  );
}
