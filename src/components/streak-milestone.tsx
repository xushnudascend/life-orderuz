import { useEffect, useState } from "react";
import { isReducedMotion } from "@/lib/motion-pref";

/**
 * Full-screen celebration for streak / level / badge milestones.
 * SVG-only (no three.js) — light, accessible, reduced-motion safe.
 */
export type MilestoneKind = "streak" | "level" | "badge";

interface MilestoneCelebrationProps {
  kind: MilestoneKind;
  value: number | string;
  onDismiss: () => void;
  autoDismissMs?: number;
}

const DEFAULT_MS: Record<MilestoneKind, number> = {
  streak: 3200,
  level: 1800,
  badge: 2200,
};

function labelFor(kind: MilestoneKind, value: number | string) {
  if (kind === "streak") return { eyebrow: "Tartib o'rnatildi", main: `${value} kun` };
  if (kind === "level") return { eyebrow: "Yangi daraja", main: `Lvl ${value}` };
  return { eyebrow: "Yangi nishon", main: String(value) };
}

export function MilestoneCelebration({
  kind,
  value,
  onDismiss,
  autoDismissMs,
}: MilestoneCelebrationProps) {
  const [visible, setVisible] = useState(true);
  const dismissMs = autoDismissMs ?? DEFAULT_MS[kind];
  const reduced = isReducedMotion();

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), dismissMs);
    return () => clearTimeout(t);
  }, [dismissMs]);

  useEffect(() => {
    if (!visible) {
      const t = setTimeout(onDismiss, 250);
      return () => clearTimeout(t);
    }
  }, [visible, onDismiss]);

  const { eyebrow, main } = labelFor(kind, value);
  const ariaLabel =
    kind === "streak"
      ? `${value} kunlik marra nishonlanmoqda`
      : kind === "level"
        ? `Yangi daraja ${value} nishonlanmoqda`
        : `Yangi nishon ${value} nishonlanmoqda`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={() => setVisible(false)}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background/95 backdrop-blur-sm transition-opacity duration-300 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className={`h-56 w-56 sm:h-72 sm:w-72 ${reduced ? "" : "animate-in zoom-in-50 duration-500"}`}
      >
        <MilestoneGlyph />
      </div>
      <div className="px-6 text-center">
        <p className="mb-1 font-ui text-xs uppercase tracking-[0.28em] text-muted-foreground">
          {eyebrow}
        </p>
        <p className="font-serif text-3xl font-semibold tracking-tight text-foreground">{main}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setVisible(false);
        }}
        className="font-ui text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        Davom etish
      </button>
    </div>
  );
}

export function StreakMilestone({
  days,
  onDismiss,
  autoDismissMs,
}: {
  days: number;
  onDismiss: () => void;
  autoDismissMs?: number;
}) {
  return (
    <MilestoneCelebration
      kind="streak"
      value={days}
      onDismiss={onDismiss}
      autoDismissMs={autoDismissMs}
    />
  );
}

function MilestoneGlyph() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-hidden="true">
      <polygon
        points="100,15 170,60 170,140 100,185 30,140 30,60"
        fill="hsl(var(--primary) / 0.18)"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
      />
      <polygon
        points="100,15 170,60 100,100 30,60"
        fill="hsl(var(--primary) / 0.32)"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
      />
      <polygon
        points="30,60 100,100 100,185 30,140"
        fill="hsl(var(--primary) / 0.24)"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
      />
      <polygon
        points="170,60 170,140 100,185 100,100"
        fill="hsl(var(--primary) / 0.12)"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default StreakMilestone;
