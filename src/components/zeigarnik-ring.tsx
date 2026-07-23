import { ProgressRing } from "@/components/progress-ring";

/**
 * Zeigarnik (1927) + Locke goal-setting + Fogg BMAP.
 * Ochiq halqa xotirada saqlanadi. Til: taklif, dushmanona emas.
 * Zich: 1 blokda holat, keyingi qadam, foiz va vaqt taxmini.
 */
export function ZeigarnikRing({
  done,
  total,
  nextTitle,
  avgMinutes = 2,
}: {
  done: number;
  total: number;
  nextTitle?: string | null;
  avgMinutes?: number;
}) {
  const remaining = Math.max(0, total - done);
  const closed = remaining === 0 && total > 0;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const eta = remaining * avgMinutes;

  return (
    <div className="flex items-center gap-4">
      <ProgressRing value={done} total={total} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-ui text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
            {closed ? "Halqa yopildi" : "Ochiq halqa"}
          </span>
          <span aria-hidden className="h-px flex-1 bg-border/60" />
          <span className="font-ui text-[10px] tabular-nums uppercase tracking-[0.18em] text-muted-foreground">
            {pct}%
          </span>
        </div>
        <p className="mt-1 font-serif text-[17px] leading-snug text-foreground">
          {closed
            ? "Bugun tugadi. Dam ol."
            : remaining === 1
              ? "Yana 1 ta — bugun yopiladi."
              : `Yana ${remaining} ta — halqa yopiladi.`}
        </p>
        {!closed && (nextTitle || eta > 0) && (
          <p className="mt-1 flex items-center gap-2 font-ui text-xs text-muted-foreground">
            {nextTitle && (
              <span className="truncate">
                Keyingi: <span className="text-foreground">{nextTitle}</span>
              </span>
            )}
            {eta > 0 && (
              <span className="ml-auto shrink-0 tabular-nums text-muted-foreground/80">
                ~{eta} daq
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
