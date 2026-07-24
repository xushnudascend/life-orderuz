import { Sparkles } from "lucide-react";

/**
 * IfThenHint — Gollwitzer implementation intentions (A1).
 * Foydalanuvchi ekran ustida bir jumlali "Agar X bo'lsa → Y qilaman" mikro-rejaga duch keladi.
 * Bosim yo'q; motivatsion langar (A2), kognitiv yukni (A3) kamaytiradi.
 */
export function IfThenHint({ trigger, action }: { trigger: string; action: string }) {
  return (
    <div className="mt-4 flex items-start gap-2 rounded-[var(--radius)] border border-primary/25 bg-primary/[0.04] px-3 py-2 font-ui text-[12px] leading-relaxed text-foreground/80">
      <Sparkles aria-hidden className="mt-[2px] h-3.5 w-3.5 shrink-0 text-primary" />
      <p className="min-w-0">
        <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Mikro-reja
        </span>
        <br />
        <span className="text-muted-foreground">Agar </span>
        <span className="text-foreground">{trigger}</span>
        <span className="text-muted-foreground"> bo'lsa — </span>
        <span className="text-foreground">{action}</span>
        <span className="text-muted-foreground">.</span>
      </p>
    </div>
  );
}
