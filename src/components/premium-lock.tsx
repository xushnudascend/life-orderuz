import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";

/**
 * "Premium a'zolar uchun" markeri — sahifada Premium bilan cheklangan blokni
 * halol belgilash uchun (MEGA-PROMPT 6.2 va 5).
 */
export function PremiumLock({
  title = "Bu funksiya Premium a'zolar uchun.",
  className = "",
}: {
  title?: string;
  className?: string;
}) {
  return (
    <div
      className={
        "flex flex-col items-start gap-3 rounded-[var(--radius)] border border-dashed border-primary/40 bg-primary/5 p-5 " +
        className
      }
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-background px-2.5 py-1 font-ui text-[10px] uppercase tracking-[0.22em] text-primary">
        <Lock className="h-3 w-3" /> Premium
      </span>
      <p className="font-serif text-lg">{title}</p>
      <Link
        to="/pricing"
        className="font-ui text-xs uppercase tracking-[0.22em] text-primary hover:underline"
      >
        Premium olish →
      </Link>
    </div>
  );
}
