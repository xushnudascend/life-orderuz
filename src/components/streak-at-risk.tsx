import { Sparkles } from "lucide-react";

/**
 * Loss aversion — xotirjam ohang (Kahneman & Tversky, 1979).
 * Streak endangered — but we frame it as an INVITATION, not an ALARM.
 * Threshold: after 18:00 local time AND streak >= 3 AND completion < 100%.
 * Wording rule (A3): never "streak xavf ostida" — that's fear-mongering.
 * Say what's true and offer the smallest next step.
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

  const remaining = Math.max(0, 100 - percent);
  return (
    <div
      role="status"
      className="mb-4 flex items-start gap-3 rounded-[var(--radius)] border border-primary/30 bg-primary/5 p-3.5"
    >
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="font-ui text-[13px] font-semibold text-foreground">
          {streakDays} kunlik naqsh davom etyapti
        </p>
        <p className="mt-0.5 font-ui text-xs text-muted-foreground">
          Bugundan {remaining}% qoldi. Eng kichigidan boshla — 2 daqiqalik odat kifoya.
        </p>
      </div>
    </div>
  );
}
