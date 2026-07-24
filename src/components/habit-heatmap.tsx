import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Panel, PanelHeader } from "@/components/panel";

/**
 * HabitHeatmap — soat × hafta kuni bo'yicha odat bajarilish zichligi.
 * Tosser–Baumeister (2017): xatti-harakat tahlili — ko'zga ko'rinadigan
 * zichlik xaritasi. Foydalanuvchi o'zining "eng samarali" oynasini ko'radi.
 */
export function HabitHeatmap({ userId }: { userId: string }) {
  const [grid, setGrid] = useState<number[][] | null>(null);

  useEffect(() => {
    let ok = true;
    (async () => {
      const from = new Date();
      from.setUTCDate(from.getUTCDate() - 60);
      const { data } = await supabase
        .from("habit_logs")
        .select("created_at")
        .eq("user_id", userId)
        .gte("created_at", from.toISOString());
      if (!ok) return;
      const g: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
      ((data ?? []) as Array<{ created_at: string | null }>).forEach((r) => {
        if (!r.created_at) return;
        const d = new Date(r.created_at);
        g[d.getDay()][d.getHours()] += 1;
      });
      setGrid(g);
    })();
    return () => {
      ok = false;
    };
  }, [userId]);

  const max = useMemo(
    () => (grid ? Math.max(1, ...grid.flat()) : 1),
    [grid],
  );
  const days = ["Yak", "Du", "Se", "Ch", "Pa", "Ju", "Sh"];

  return (
    <Panel className="p-5">
      <PanelHeader title="Sen qachon eng samarali" eyebrow="So'nggi 60 kun" />
      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[560px]">
          <div className="grid grid-cols-[32px_repeat(24,1fr)] gap-[2px] font-ui text-[9px] text-muted-foreground">
            <div />
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="text-center tabular-nums">
                {h % 3 === 0 ? h : ""}
              </div>
            ))}
            {grid?.map((row, d) => (
              <>
                <div key={`d-${d}`} className="pr-1 text-right leading-[14px]">
                  {days[d]}
                </div>
                {row.map((v, h) => {
                  const op = v === 0 ? 0.06 : 0.15 + (v / max) * 0.85;
                  return (
                    <div
                      key={`${d}-${h}`}
                      className="h-3.5 rounded-[2px]"
                      style={{ background: `hsl(var(--primary) / ${op})` }}
                      aria-label={`${days[d]} ${h}:00 — ${v} log`}
                      title={`${days[d]} ${h}:00 · ${v}`}
                    />
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 font-ui text-[11px] text-muted-foreground">
        Yorug'roq kataklar — sen aksariyat marta odatlaringni bajargan
        soatlar. Yangi odatni shu oynaga bogʻlash — habit stacking (Clear, 2018).
      </p>
    </Panel>
  );
}
