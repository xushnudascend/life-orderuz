import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2 } from "lucide-react";

/**
 * Cialdini — ochiq va'da (public commitment) + ijobiy social proof.
 * Bugun guruhda nechta a'zo hech bo'lmasa 1 odatini bajarganini ko'rsatamiz.
 * Zich: mikro-progress bar + foiz.
 */
export function PartyCommitment({ memberIds }: { memberIds: string[] }) {
  const [activeToday, setActiveToday] = useState<number | null>(null);

  useEffect(() => {
    if (memberIds.length === 0) {
      setActiveToday(0);
      return;
    }
    let cancelled = false;
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await supabase
        .from("habit_logs")
        .select("user_id")
        .in("user_id", memberIds)
        .eq("logged_date", today);
      if (cancelled) return;
      const unique = new Set(((data as { user_id: string }[] | null) ?? []).map((r) => r.user_id));
      setActiveToday(unique.size);
    })();
    return () => {
      cancelled = true;
    };
  }, [memberIds.join(",")]);

  if (activeToday === null) return null;
  const total = memberIds.length;
  const pct = total > 0 ? Math.round((activeToday / total) * 100) : 0;

  return (
    <div className="mt-3 flex items-center gap-3 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5">
      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
      <span className="font-ui text-[11px] uppercase tracking-[0.2em] text-primary tabular-nums">
        {activeToday}/{total} va'da
      </span>
      <span className="relative h-1 flex-1 min-w-[60px] max-w-[140px] overflow-hidden rounded-full bg-primary/15">
        <span
          className="absolute inset-y-0 left-0 bg-primary transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </span>
      <span className="font-ui text-[10px] tabular-nums text-primary/80">{pct}%</span>
    </div>
  );
}
