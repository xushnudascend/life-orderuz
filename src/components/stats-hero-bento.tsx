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
    <section
        aria-label="Bugungi holat"
        className="relative h-full overflow-hidden rounded-[32px] border border-border/40 bg-background-secondary p-6 sm:p-8 backdrop-blur-4xl shadow-premium"
      >

        {/* Left Side Content */}
        <div className="relative z-10 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold leading-[0.9] tracking-tight sm:text-4xl">
            {displayName?.trim() ? `${displayName}, ` : t("dashboard.hero.greetingPrefix") + " "}
            <span className="text-muted-foreground/60">{t("dashboard.hero.plan")}</span>
          </h1>
          <div className="flex items-center gap-2">
            <ShieldIndicator usedThisWeek={shieldsUsed} max={3} />
          </div>
        </div>

        <div className="relative z-10 mt-6 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex items-center gap-4">
             <ProgressRing value={doneCount} total={totalHabits || 0} size={80} strokeWidth={6} />
             <div className="sm:hidden flex-1">
               <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/50">
                 <div
                   className="h-full bg-primary transition-all duration-700"
                   style={{ width: `${xpProgress}%` }}
                 />
               </div>
               <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">LVL {level} · {totalXp} XP</p>
             </div>
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="hidden sm:flex items-baseline justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>Daraja {level}</span>
              <span>{totalXp} XP</span>
            </div>
            <div className="hidden sm:block h-1.5 w-full overflow-hidden rounded-full bg-border/50">
              <div
                className="h-full bg-primary transition-all duration-700"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-[11px] font-medium text-foreground">
              {progressMessage(percent)}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="relative z-10 mt-10 grid grid-cols-2 gap-4">
          <Link
            to="/habits"
            className="group relative overflow-hidden rounded-[20px] border border-border/60 bg-background-tertiary p-5 transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)]"
          >
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
            className="group relative overflow-hidden rounded-[20px] border border-border/60 bg-background-tertiary p-5 transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)]"
          >
            <p className="flex items-center gap-1.5 font-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <Shield className="h-3 w-3 text-primary" /> {t("dashboard.hero.discipline")}
            </p>
            <p className="mt-1 font-serif text-2xl tabular-nums">
              <CountUpNumber value={disciplineScore} once="hero-disc" />
              <span className="ml-1 text-[12px] text-muted-foreground">/100</span>
            </p>
          </Link>
        </div>

      </section>
  );
}
