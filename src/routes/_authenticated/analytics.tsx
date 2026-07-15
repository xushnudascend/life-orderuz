import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Loader2 } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { uz } from "@/i18n";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({
    meta: [
      { title: `Statistika — ${uz.brand.name}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Analytics,
});

type Point = { day: string; xp: number; habits: number };

function last14Days(): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(now.getUTCDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

function Analytics() {
  const { userId } = Route.useRouteContext();
  const [data, setData] = useState<Point[]>([]);
  const [totals, setTotals] = useState({ xp: 0, habits: 0, journal: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const days = last14Days();
      const since = days[0];
      const [xpEvents, habitLogs, journals] = await Promise.all([
        supabase
          .from("xp_events")
          .select("amount, created_at")
          .eq("user_id", userId)
          .gte("created_at", since),
        supabase
          .from("habit_logs")
          .select("logged_date")
          .eq("user_id", userId)
          .gte("logged_date", since),
        supabase
          .from("journal_entries")
          .select("id", { count: "exact", head: false })
          .eq("user_id", userId),
      ]);

      const xpByDay: Record<string, number> = {};
      const habByDay: Record<string, number> = {};
      for (const d of days) {
        xpByDay[d] = 0;
        habByDay[d] = 0;
      }
      for (const e of (xpEvents.data as { amount: number; created_at: string }[] | null) ?? []) {
        const d = e.created_at.slice(0, 10);
        if (d in xpByDay) xpByDay[d] += e.amount;
      }
      for (const h of (habitLogs.data as { logged_date: string }[] | null) ?? []) {
        if (h.logged_date in habByDay) habByDay[h.logged_date] += 1;
      }

      const pts: Point[] = days.map((d) => ({
        day: d.slice(5),
        xp: xpByDay[d],
        habits: habByDay[d],
      }));
      setData(pts);
      setTotals({
        xp: pts.reduce((s, p) => s + p.xp, 0),
        habits: pts.reduce((s, p) => s + p.habits, 0),
        journal: journals.data?.length ?? 0,
      });
      setLoading(false);
    })();
  }, [userId]);

  return (
    <AppShell title="Statistika">
      <p className="font-ui text-xs uppercase tracking-[0.28em] text-primary">
        Oxirgi 14 kun
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
        Sening yo'ling.
      </h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat label="XP (14 kun)" value={totals.xp} />
            <Stat label="Bajarilgan odat" value={totals.habits} />
            <Stat label="Jami kundalik" value={totals.journal} />
          </div>

          <section className="mt-10 rounded-[var(--radius)] border border-border p-5">
            <h2 className="mb-4 font-serif text-xl">XP kunlar bo'yicha</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="xp" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="mt-6 rounded-[var(--radius)] border border-border p-5">
            <h2 className="mb-4 font-serif text-xl">Odatlar</h2>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="habits" fill="hsl(var(--foreground))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      )}
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[var(--radius)] border border-border p-5">
      <p className="font-ui text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl">{value}</p>
    </div>
  );
}
