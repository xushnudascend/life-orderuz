import { Shield } from "lucide-react";

/**
 * Himoya (Shield) — Kahneman loss aversion, xotirjam ohang.
 * Copy rule (A3): never "himoyang tugayapti!!" — that's alarm.
 * Say the truth calmly: X ta himoyang bor, xavfsizsan.
 */
export function ShieldIndicator({
  usedThisWeek,
  max = 3,
}: {
  usedThisWeek: number;
  max?: number;
}) {
  const remaining = Math.max(0, max - usedThisWeek);
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-ui text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
      title={`${remaining} ta himoyang bor — streak buzilsa avto ishlaydi`}
    >
      <Shield className="h-3.5 w-3.5 text-primary" aria-hidden />
      Himoya: <span className="text-foreground">{remaining}</span>/{max}
    </span>
  );
}
