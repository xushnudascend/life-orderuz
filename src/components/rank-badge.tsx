import { tierFromScore, type Tier } from "@/lib/nervous";

export function RankBadge({
  score,
  compact = false,
}: {
  score: number | null | undefined;
  compact?: boolean;
}) {
  const t: Tier = tierFromScore(score);
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-ui text-[11px] uppercase tracking-[0.18em] " +
        t.badgeClass
      }
      title={`Discipline: ${score ?? 0}/100 — ${t.uz}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {compact ? t.uz : `Sen — ${t.uz}`}
    </span>
  );
}
