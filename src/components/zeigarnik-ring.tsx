import { ProgressRing } from "@/components/progress-ring";

/**
 * Zeigarnik effect (Zeigarnik 1927) + Locke goal-setting.
 * Tugallanmagan halqa miya uchun "yopilishi kerak bo'lgan ochiq halqa" —
 * xotira uni saqlab turadi. Til: dushmanona emas — taklif.
 */
export function ZeigarnikRing({
  done,
  total,
  nextTitle,
}: {
  done: number;
  total: number;
  nextTitle?: string | null;
}) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const remaining = Math.max(0, total - done);
  const closed = remaining === 0 && total > 0;

  return (
    <div className="flex items-center gap-4">
      <ProgressRing value={pct} />
      <div className="min-w-0">
        <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
          {closed ? "Halqa yopildi" : "Ochiq halqa"}
        </p>
        <p className="mt-1 font-serif text-lg leading-snug text-foreground">
          {closed
            ? "Bugun tugadi. Dam ol."
            : remaining === 1
              ? "Yana 1 ta — va bugun yopiladi."
              : `Yana ${remaining} ta — halqa yopiladi.`}
        </p>
        {nextTitle && !closed && (
          <p className="mt-1 truncate font-ui text-xs text-muted-foreground">
            Keyingi: <span className="text-foreground">{nextTitle}</span>
          </p>
        )}
      </div>
    </div>
  );
}
