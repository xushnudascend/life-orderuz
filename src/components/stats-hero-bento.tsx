import { Link } from "@tanstack/react-router";
import { Flame, Shield } from "lucide-react";
import { ProgressRing } from "@/components/progress-ring";
import { RankBadge } from "@/components/rank-badge";
import { ShieldIndicator } from "@/components/shield-indicator";
import { CornerOrnament } from "@/components/corner-ornament";
import { CountUpNumber } from "@/components/count-up-number";
import { ArchetypeRow } from "@/components/archetype-row";
import { Tilt } from "@/components/tilt";
import { progressMessage, type Archetype } from "@/lib/nervous";
import { useT } from "@/i18n/use-t";
import { tierFromScore } from "@/lib/nervous";

/**
 * StatsHeroBento — Ascend/Life Order dan port qilingan dense unified hero.
 * Salomlashuv + rank/shield + progress ring + level bar + streak/discipline
 * mini kartlar bitta cohesive vizual blokda.
 */
export function StatsHeroBento({
  greeting,
  displayName,
  archetype,
  doneCount,
  totalHabits,
  percent,
  streakDays,
  level,
  totalXp,
  xpProgress,
  xpForNext,
  disciplineScore,
  shieldsUsed,
  score,
}: {
  greeting: string;
  displayName: string | null | undefined;
  archetype: Archetype | null;
  doneCount: number;
  totalHabits: number;
  percent: number;
  streakDays: number;
  level: number;
  totalXp: number;
  xpProgress: number;
  xpForNext: number;
  disciplineScore: number;
  shieldsUsed: number;
  score: number;
}) {
  const { t } = useT();
  return (
    <Tilt max={3} className="mb-5 sm:mb-6">
      <section
        aria-label="Bugungi holat"
        className="relative overflow-hidden rounded-[var(--radius)] border border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-4 shadow-[0_1px_0_hsl(var(--foreground)/0.04)_inset,0_20px_40px_-24px_hsl(var(--primary)/0.25)] sm:p-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.03),transparent_50%)] pointer-events-none" />
        <CornerOrnament position="top-right" size={220} className="opacity-40" />

        {/* Left Side Content */}
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                {greeting}
              </p>
              <div className="mt-2 text-[10px] leading-relaxed text-muted-foreground/80">
                {archetype ? tierFromScore(score).uz : "Tizim tayyorlanmoqda..."}
              </div>
              <h1 className="mt-1.5 truncate font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                {displayName?.trim() ? `${displayName}, ` : "Bugungi "}
                <span className="text-muted-foreground">{t("dashboard.hero.plan")}</span>
              </h1>
              <ArchetypeRow archetype={archetype} />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="flex items-center gap-4">
              <ProgressRing value={doneCount} total={totalHabits || 0} size={110} strokeWidth={8} />
              <div className="sm:hidden">
                <p className="font-ui text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  {progressMessage(percent)}
                </p>
                <p className="mt-1 font-serif text-xl">{percent}%</p>
              </div>
            </div>

            <div className="min-w-0 space-y-4">
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-ui text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    Level {level}
                  </p>
                  <p className="font-ui text-[10px] tabular-nums text-muted-foreground">
                    {totalXp} / {xpForNext} XP
                  </p>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border/50">
                  <div
                    className="h-full bg-gradient-to-r from-primary/70 to-primary transition-[width] duration-700 ease-out shadow-[0_0_10px_hsl(var(--primary)/0.3)]"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
              
              <p className="hidden font-ui text-xs text-muted-foreground sm:block italic opacity-80">
                "{progressMessage(percent)}"
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Stats Grid */}
        <div className="relative z-10 mt-6 grid grid-cols-1 gap-3 lg:mt-0">
          <div className="flex justify-end gap-2 mb-2 lg:mb-4">
            <ShieldIndicator usedThisWeek={shieldsUsed} max={3} />
            <Link to="/settings/subscription">
              <RankBadge score={score} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <Link
              to="/habits"
              className="group relative overflow-hidden rounded-xl border border-border/60 bg-background/40 p-3.5 transition-all hover:border-primary/50 hover:bg-background/60 active:scale-[0.98]"
            >
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Flame className="h-8 w-8 text-primary" />
              </div>
              <p className="flex items-center gap-1.5 font-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <Flame className="h-3 w-3 text-primary" /> {t("dashboard.hero.streak")}
              </p>
              <p className="mt-1 font-serif text-2xl tabular-nums">
                <CountUpNumber value={streakDays} once="hero-streak" />
                <span className="ml-1 text-[12px] text-muted-foreground">{t("dashboard.hero.kun")}</span>
              </p>
            </Link>

            <Link
              to="/profile"
              className="group relative overflow-hidden rounded-xl border border-border/60 bg-background/40 p-3.5 transition-all hover:border-primary/50 hover:bg-background/60 active:scale-[0.98]"
            >
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <p className="flex items-center gap-1.5 font-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <Shield className="h-3 w-3 text-primary" /> {t("dashboard.hero.discipline")}
              </p>
              <p className="mt-1 font-serif text-2xl tabular-nums">
                <CountUpNumber value={disciplineScore} once="hero-disc" />
                <span className="ml-1 text-[12px] text-muted-foreground">/100</span>
              </p>
            </Link>
          </div>
        </div>

        {/* Footer message (mobile only) */}
        <p className="relative mt-4 block font-ui text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 sm:hidden">
          {progressMessage(percent)}
        </p>
      </section>
    </Tilt>
  );
}
