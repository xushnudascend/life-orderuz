import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2 } from "lucide-react";

/**
 * Cialdini — Ochiq va'da (public commitment).
 * Bugun guruhda nechta a'zo hech bo'lmasa 1 ta odatini bajarganini ko'rsatamiz.
 * "Sen yolg'iz emassan" signali — ijobiy social proof.
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
  return (
    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 font-ui text-[11px] uppercase tracking-[0.2em] text-primary">
      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
      Bugun {activeToday}/{total} va'dasini bajardi
    </div>
  );
}
