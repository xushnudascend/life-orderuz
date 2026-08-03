import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Panel, PanelHeader } from "@/components/panel";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * Chuqur analitika: 12 haftalik ushlanish (retention) va hafta kunlari kesimi.
 *
 * Nega muhim: bitta kunlik ko'rsatkich emas, davomiylik naqshi xulqni bashorat
 * qiladi (Lally et al. — odat shakllanishi uzluksizlikka bog'liq).
 */

type WeekPoint = { week: string; days: number };
type DowPoint = { dow: string; logs: number };

const DOW = ["Yak", "Du", "Se", "Cho", "Pay", "Ju", "Sha"];

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function DeepAnalytics({ userId }: { userId: string }) {
  const [weeks, setWeeks] = useState<WeekPoint[]>([]);
  const [dows, setDows] = useState<DowPoint[]>([]);
  const [retention, setRetention] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const since = new Date();
      since.setDate(since.getDate() - 83);
      const { data } = await supabase
        .from("habit_logs")
        .select("logged_date")
        .eq("user_id", userId)
        .gte("logged_date", isoDay(since));
      if (!alive) return;

      const rows = (data as { logged_date: string }[] | null) ?? [];
      const dates = new Set(rows.map((r) => r.logged_date));

      // 12 hafta: har haftada nechta faol kun
      const wk: WeekPoint[] = [];
      for (let i = 11; i >= 0; i--) {
        const start = new Date();
        start.setDate(start.getDate() - i * 7 - 6);
        let days = 0;
        for (let d = 0; d < 7; d++) {
          const cur = new Date(start);
          cur.setDate(start.getDate() + d);
          if (dates.has(isoDay(cur))) days++;
        }
        wk.push({ week: `H${12 - i}`, days });
      }
      setWeeks(wk);

      // Hafta kunlari kesimi
      const counts = new Array(7).fill(0) as number[];
      for (const r of rows) {
        const idx = new Date(r.logged_date + "T00:00:00").getDay();
        counts[idx] = (counts[idx] ?? 0) + 1;
      }
      setDows(DOW.map((d, i) => ({ dow: d, logs: counts[i] ?? 0 })));

      // Ushlanish: oxirgi 4 haftada faol bo'lgan haftalar ulushi
      const last4 = wk.slice(-4);
      const activeWeeks = last4.filter((w) => w.days > 0).length;
      setRetention(Math.round((activeWeeks / 4) * 100));
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [userId]);

  if (loading) return null;

  const best = dows.reduce((a, b) => (b.logs > a.logs ? b : a), dows[0] ?? { dow: "—", logs: 0 });
  const worst = dows.reduce((a, b) => (b.logs < a.logs ? b : a), dows[0] ?? { dow: "—", logs: 0 });

  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <Panel as="section">
        <PanelHeader
          eyebrow="12 hafta"
          title={<p className="font-serif text-lg font-semibold">Davomiylik trendi</p>}
        />
        <p className="mt-1 text-sm text-muted-foreground">
          Oxirgi 4 haftada ushlanish: <span className="text-foreground">{retention}%</span>
        </p>
        <div className="mt-4 h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeks}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis domain={[0, 7]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
              <Line
                type="monotone"
                dataKey="days"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel as="section">
        <PanelHeader
          eyebrow="Hafta kunlari"
          title={<p className="font-serif text-lg font-semibold">Kuchli va zaif kunlar</p>}
        />
        <p className="mt-1 text-sm text-muted-foreground">
          Eng kuchli: <span className="text-foreground">{best.dow}</span> · eng zaif:{" "}
          <span className="text-foreground">{worst.dow}</span>
        </p>
        <div className="mt-4 h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dows}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="dow" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="logs" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}
