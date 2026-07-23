import { Sprout } from "lucide-react";

/**
 * Fogg BMAP — birinchi 5 kun: pastroq kutish, kichikroq odat.
 * Streak >= 5 bo'lganda yashiriladi. Zich, kalta, aniq.
 */
export function EasyModeRibbon({ streakDays }: { streakDays: number }) {
  if (streakDays >= 5) return null;
  const remaining = Math.max(1, 5 - streakDays);
  const dots = Array.from({ length: 5 }, (_, i) => i < streakDays);
  return (
    <div
      role="note"
      className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 font-ui text-[11px] uppercase tracking-[0.18em] text-primary"
    >
      <Sprout className="h-3.5 w-3.5" aria-hidden />
      <span>Yengil rejim · 2 daq · 1 odat</span>
      <span aria-hidden className="mx-1 h-3 w-px bg-primary/30" />
      <span className="flex items-center gap-1" aria-label={`${streakDays}/5 kun`}>
        {dots.map((on, i) => (
          <span
            key={i}
            className={
              "h-1.5 w-1.5 rounded-full " + (on ? "bg-primary" : "bg-primary/25")
            }
          />
        ))}
      </span>
      <span className="tabular-nums text-primary/80">{remaining} qoldi</span>
    </div>
  );
}
