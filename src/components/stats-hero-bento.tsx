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
        className="relative overflow-hidden rounded-[var(--radius)] border border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-4 shadow-[0_1px_0_hsl(var(--foreground)/0.04)_inset,0_20px_40px_-24px_hsl(var(--primary)/0.25)] sm:p-6"
      >
        <CornerOrnament position="top-right" size={220} className="opacity-60" />

        {/* Header — salom + rank + shield */}
        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
              {greeting}
            </p>
            <h1 className="mt-1.5 truncate font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              {displayName?.trim() ? `${displayName}, ` : "Bugungi "}
              <span className="text-muted-foreground">{t("dashboard.hero.plan")}</span>
            </h1>
            <ArchetypeRow archetype={archetype} />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ShieldIndicator usedThisWeek={shieldsUsed} max={3} />
            <RankBadge score={score} />
          </div>
        </div>

        {/* Body — ring + xp bar + mini stats */}
        <div className="relative mt-5 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="flex items-center gap-4">
            <ProgressRing value={doneCount} total={totalHabits || 0} size={96} strokeWidth={7} />
            <div className="sm:hidden">
              <p className="font-ui text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {progressMessage(percent)}
              </p>
              <p className="mt-1 font-serif text-xl">{percent}%</p>
            </div>
          </div>

          <div className="min-w-0 space-y-3">
            {/* XP / Level */}
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-ui text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    {t("dashboard.hero.level")} {level}
                  </p>
                  <p className="mt-0.5 font-serif text-xl tabular-nums">
                    <CountUpNumber value={totalXp} once="hero-xp" />
                    <span className="ml-1 text-sm text-muted-foreground">{t("dashboard.hero.xp")}</span>
                  </p>
                </div>
                <p className="font-ui text-[10px] tabular-nums text-muted-foreground">
                  {xpProgress}% → {xpForNext}
                </p>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full bg-gradient-to-r from-primary/70 to-primary transition-[width] duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>

            {/* Streak + discipline mini row */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-md border border-border/60 bg-background/30 px-3 py-2.5">
                <p className="flex items-center gap-1.5 font-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <Flame className="h-3 w-3 text-primary" /> {t("dashboard.hero.streak")}
                </p>
                <p className="mt-1 font-serif text-lg tabular-nums">
                  <CountUpNumber value={streakDays} once="hero-streak" />
                  <span className="ml-1 text-[11px] text-muted-foreground">{t("dashboard.hero.kun")}</span>
                </p>
              </div>
              <Link
                to="/profile"
                className="group rounded-md border border-border/60 bg-background/30 px-3 py-2.5 transition-colors hover:border-primary/50 hover:bg-background/60"
              >
                <p className="flex items-center gap-1.5 font-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <Shield className="h-3 w-3 text-primary" /> {t("dashboard.hero.discipline")}
                </p>
                <p className="mt-1 font-serif text-lg tabular-nums">
                  <CountUpNumber value={disciplineScore} once="hero-disc" />
                  <span className="ml-1 text-[11px] text-muted-foreground">/100</span>
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer message (desktop) */}
        <p className="relative mt-4 hidden font-ui text-xs text-muted-foreground sm:block">
          {progressMessage(percent)}
        </p>
      </section>
    </Tilt>
  );
}
