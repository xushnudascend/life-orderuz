import { AlertTriangle } from "lucide-react";

/**
 * Loss aversion visualization (Kahneman & Tversky, 1979).
 * Streak endangered — surfaces at end-of-day if today is incomplete.
 * Threshold: after 18:00 local time AND streak >= 3 AND completion < 100%.
 */
export function StreakAtRisk({
  streakDays,
  percent,
}: {
  streakDays: number;
  percent: number;
}) {
  const hour = new Date().getHours();
  const show = streakDays >= 3 && percent < 100 && hour >= 18;
  if (!show) return null;

  const remaining = 100 - percent;
  return (
    <div
      role="alert"
      className="mb-4 flex items-start gap-3 rounded-[var(--radius)] border border-amber-500/40 bg-amber-500/5 p-3.5"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
      <div className="min-w-0 flex-1">
        <p className="font-ui text-[13px] font-semibold text-amber-100">
          {streakDays} kunlik streak xavf ostida
        </p>
        <p className="mt-0.5 font-ui text-xs text-amber-100/70">
          Bugungi rejadan {remaining}% qoldi. Bitta kichik odatni yakunlash — streak'ni saqlab qoladi.
        </p>
      </div>
    </div>
  );
}
