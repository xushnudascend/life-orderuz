import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Panel, PanelHeader } from "@/components/panel";

/**
 * PeakEndCurve — Kahneman & Redelmeier (1993).
 * Haftalik jurnal kayfiyatining egri chizig'i, `peak` (eng yuqori)
 * va `end` (oxirgi) lahzalar aniq belgilanadi.
 * Miya haftaning umumiy sifatini shu ikki nuqta bilan eslaydi.
 */
type Row = { created_at: string; mood: number | null };

export function PeakEndCurve({ userId }: { userId: string }) {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    let ok = true;
    (async () => {
      const from = new Date();
      from.setUTCDate(from.getUTCDate() - 7);
      const { data } = await supabase
        .from("journal_entries")
        .select("created_at, mood")
        .eq("user_id", userId)
        .gte("created_at", from.toISOString())
        .order("created_at", { ascending: true });
      if (ok) setRows((data as Row[] | null) ?? []);
    })();
    return () => {
      ok = false;
    };
  }, [userId]);

  if (!rows) return null;
  const points = rows
    .filter((r) => r.mood != null)
    .map((r, i) => ({ i, mood: r.mood ?? 3, when: new Date(r.created_at) }));

  if (points.length < 2) {
    return (
      <Panel className="p-5">
        <PanelHeader title="Haftaning egri chizig'i" eyebrow="Peak-End · Kahneman" />
        <p className="mt-3 font-ui text-sm text-muted-foreground">
          Peak-end egri chizig'i uchun kamida 2 ta mood log kerak. Kunni
          yopish kartochkasidan foydalan.
        </p>
      </Panel>
    );
  }

  const w = 320,
    h = 96,
    pad = 8;
  const xs = (i: number) => pad + (i * (w - 2 * pad)) / Math.max(1, points.length - 1);
  const ys = (m: number) => h - pad - ((m - 1) / 4) * (h - 2 * pad);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${xs(i)} ${ys(p.mood)}`).join(" ");
  const peakIdx = points.reduce((m, p, i) => (p.mood > points[m].mood ? i : m), 0);
  const endIdx = points.length - 1;
  const peak = points[peakIdx];
  const end = points[endIdx];

  return (
    <Panel className="p-5">
      <PanelHeader title="Haftaning egri chizig'i" eyebrow="Peak-End · Kahneman" />
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full" role="img" aria-label="Haftalik kayfiyat egri chizig'i">
        <defs>
          <linearGradient id="peGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${path} L ${xs(endIdx)} ${h - pad} L ${xs(0)} ${h - pad} Z`} fill="url(#peGrad)" />
        <path d={path} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" />
        {points.map((p, i) => (
          <circle key={i} cx={xs(i)} cy={ys(p.mood)} r={i === peakIdx || i === endIdx ? 3.5 : 1.5}
            fill={i === peakIdx ? "hsl(var(--primary))" : i === endIdx ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))"} />
        ))}
        <text x={xs(peakIdx)} y={Math.max(10, ys(peak.mood) - 6)} fontSize="9" fill="hsl(var(--primary))" textAnchor="middle">Peak</text>
        <text x={xs(endIdx)} y={Math.max(10, ys(end.mood) - 6)} fontSize="9" fill="hsl(var(--foreground))" textAnchor="end">Oxir</text>
      </svg>
      <p className="mt-3 font-ui text-[11px] leading-relaxed text-muted-foreground">
        Miya haftani <strong>eng yuqori</strong> va <strong>oxirgi</strong> lahza
        bilan eslaydi. Oxirni yaxshi yopsang — butun hafta yaxshi tuyuladi.
      </p>
    </Panel>
  );
}
