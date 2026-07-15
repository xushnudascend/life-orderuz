import { Shield } from "lucide-react";

/**
 * Himoya: N/3 · Streak buzilsa avto ishlaydi
 * Backend: haftada 1 dona ishlatilgani hisoblanadi.
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
      title="Himoya (Shield) — Streak buzilsa avto ishlaydi"
    >
      <Shield className="h-3.5 w-3.5 text-primary" />
      Himoya: <span className="text-foreground">{remaining}</span>/{max}
    </span>
  );
}
