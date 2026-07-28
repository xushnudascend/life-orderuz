import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { PageHero } from "@/components/page-hero";
import { HabitHeatmap } from "@/components/habit-heatmap";
import { Button } from "@/components/ui/button";
import { Panel, PanelHeader, PanelValue } from "@/components/panel";
import { Loader2, Download, FileText } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { toast } from "sonner";
import { uz } from "@/i18n";
import { useSubscription } from "@/lib/use-subscription";
import { PremiumLock } from "@/components/premium-lock";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({
    meta: [
      { title: `Analitika hisoboti — ${uz.brand.name}` },
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
  const [strongestDay, setStrongestDay] = useState<string>("—");
  const [weakestDay, setWeakestDay] = useState<string>("—");
  const [thisWeek, setThisWeek] = useState(0);
  const [lastWeek, setLastWeek] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isPro, loading: subLoading } = useSubscription();

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
      const strong = pts.slice(-7).reduce((a, b) => (b.xp > a.xp ? b : a), pts[0] ?? { day: "—", xp: 0, habits: 0 });
      const weak  = pts.slice(-7).reduce((a, b) => (b.xp < a.xp ? b : a), pts[0] ?? { day: "—", xp: 0, habits: 0 });
      setStrongestDay(strong.day);
      setWeakestDay(weak.day);
      setThisWeek(pts.slice(-7).reduce((s, p) => s + p.xp, 0));
      setLastWeek(pts.slice(0, 7).reduce((s, p) => s + p.xp, 0));
      setLoading(false);
    })();
  }, [userId]);

  function exportCsv() {
    const rows = ["day,xp,habits", ...data.map((p) => `${p.day},${p.xp},${p.habits}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `life-order-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV eksport tayyor.");
  }

  function exportPdf() {
    // Minimal PDF via window.print — foydalanuvchi "Save as PDF" tanlaydi
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Life Order — Analitika</title>
<style>
  body{font-family:system-ui,-apple-system,sans-serif;padding:32px;color:#111}
  h1{font-size:28px;margin:0 0 8px}
  .sub{color:#666;margin-bottom:24px;font-size:13px}
  table{width:100%;border-collapse:collapse;margin-top:12px}
  td,th{border-bottom:1px solid #ddd;padding:8px 6px;text-align:left;font-size:13px}
  th{color:#666;font-weight:600}
  .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:16px 0 24px}
  .card{border:1px solid #ddd;border-radius:8px;padding:12px}
  .label{color:#666;font-size:11px;text-transform:uppercase;letter-spacing:.12em}
  .val{font-size:22px;margin-top:4px}
</style></head><body>
<h1>Analitika hisoboti</h1>
<p class="sub">Life Order · ${new Date().toLocaleDateString("uz-UZ")}</p>
<div class="stats">
  <div class="card"><div class="label">XP (14 kun)</div><div class="val">${totals.xp}</div></div>
  <div class="card"><div class="label">Bajarilgan odat</div><div class="val">${totals.habits}</div></div>
  <div class="card"><div class="label">Jami kundalik</div><div class="val">${totals.journal}</div></div>
</div>
<p><strong>Kuchli kun:</strong> ${strongestDay} · <strong>Eng zaif kun:</strong> ${weakestDay}</p>
<p><strong>Bu hafta:</strong> ${thisWeek} XP · <strong>O'tgan hafta:</strong> ${lastWeek} XP</p>
<h3>Kunlar bo'yicha</h3>
<table><thead><tr><th>Sana</th><th>XP</th><th>Odat</th></tr></thead>
<tbody>${data.map((p) => `<tr><td>${p.day}</td><td>${p.xp}</td><td>${p.habits}</td></tr>`).join("")}</tbody></table>
</body></html>`;
    const w = window.open("", "_blank");
    if (!w) return toast.error("Popup bloklandi.");
    w.document.write(html);
    w.document.close();
    setTimeout(() => {
      w.print();
      toast.success("PDF tayyor.");
    }, 300);
  }

  if (!subLoading && !isPro) {
    return (
      <AppShell title="Analitika hisoboti">
        <PageHero
          eyebrow="Pro"
          title="Chuqur analitika."
          subtitle="14 kunlik dinamika, heatmap, kuchli va zaif kunlar tahlili — Pro rejada."
        />
        <PremiumLock
          className="mt-8"
          title="Analitika va heatmap Pro a'zolar uchun ochiq."
        />
      </AppShell>
    );
  }

  return (
    <AppShell title="Analitika hisoboti">
      <PageHero
        eyebrow="Oxirgi 14 kun"
        title="Analitika hisoboti."
        subtitle="O'zingdagi tendensiyalarni ko'rish — o'zgarishning birinchi qadami."
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat label="Jami XP" value={totals.xp} />
            <Stat label="Aktiv kunlar" value={data.filter((p) => p.xp > 0).length} />
            <Stat label="Bu hafta" value={thisWeek} hint={`O'tgan: ${lastWeek}`} />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Stat label="Kuchli kun" value={strongestDay} />
            <Stat label="Eng zaif kun" value={weakestDay} />
            <Stat label="Jami kundalik" value={totals.journal} />
          </div>

          <div className="mt-6 flex gap-2">
            <Button onClick={exportCsv} variant="outline" size="sm">
              <Download className="mr-1 h-4 w-4" /> CSV eksport
            </Button>
            <Button onClick={exportPdf} variant="outline" size="sm">
              <FileText className="mr-1 h-4 w-4" /> PDF eksport
            </Button>
          </div>

          <Panel as="section" className="mt-8">
            <PanelHeader
              eyebrow="Kunlar bo'yicha"
              title={<p className="font-serif text-lg font-semibold">XP dinamikasi</p>}
            />
            <div className="mt-4 h-64 w-full">
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
          </Panel>

          <Panel as="section" className="mt-4">
            <PanelHeader
              eyebrow="Odatlar"
              title={<p className="font-serif text-lg font-semibold">Bajarilgan odatlar</p>}
            />
            <div className="mt-4 h-56 w-full">
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
          </Panel>

          <div className="mt-4">
            <HabitHeatmap userId={userId} />
          </div>
        </>
      )}
    </AppShell>
  );
}

function Stat({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <Panel>
      <PanelHeader eyebrow={label} />
      <PanelValue value={value} caption={hint} />
    </Panel>
  );
}
