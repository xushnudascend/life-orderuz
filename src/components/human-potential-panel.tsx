// Human Potential Score panel — reads latest assessment_scores row and
// surfaces the 4 composite scores every day on the dashboard.
// Behavioral rationale: the goal-gradient effect requires a *visible*
// distance-to-goal. Locking scores behind the assessment page means the
// user forgets them within 24h. Showing them daily maintains identity
// anchoring (Clear, 2018) and reward anticipation (Schultz, 1998).
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Panel } from "@/components/panel";
import { Flame, ShieldCheck, Sparkles, Target } from "lucide-react";

type Scores = {
  potential: number;
  discipline: number;
  focus: number;
  addiction_risk: number;
  computed_at: string;
};

function bandFor(v: number): { label: string; tone: string } {
  if (v >= 80) return { label: "Yuqori", tone: "text-emerald-400" };
  if (v >= 60) return { label: "O'rta-yuqori", tone: "text-primary" };
  if (v >= 40) return { label: "O'rta", tone: "text-foreground" };
  if (v >= 20) return { label: "Past", tone: "text-amber-500" };
  return { label: "Juda past", tone: "text-destructive" };
}

export function HumanPotentialPanel() {
  const [scores, setScores] = useState<Scores | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        if (alive) setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("assessment_scores")
        .select("potential,discipline,focus,addiction_risk,computed_at")
        .eq("user_id", u.user.id)
        .order("computed_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!alive) return;
      if (data) setScores(data as Scores);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <Panel className="animate-pulse">
        <div className="h-20 rounded bg-muted/30" />
      </Panel>
    );
  }

  if (!scores) {
    return (
      <Panel>
        <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Human Potential
        </p>
        <p className="mt-2 font-serif text-lg">Skoringiz hali hisoblanmagan.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          9 shkalali psixologik test — 3 daqiqa. Discipline, Focus va Addiction Risk balingizni ko'ring.
        </p>
        <Link
          to="/assessment"
          className="mt-3 inline-flex items-center rounded-full border border-primary bg-primary px-3 py-1.5 font-ui text-xs uppercase tracking-[0.2em] text-primary-foreground transition hover:opacity-90"
        >
          Testni boshlash
        </Link>
      </Panel>
    );
  }

  const potentialBand = bandFor(scores.potential);
  const items: Array<{ label: string; value: number; icon: React.ReactNode; inverse?: boolean }> = [
    { label: "Discipline", value: scores.discipline, icon: <ShieldCheck className="h-3.5 w-3.5" /> },
    { label: "Focus", value: scores.focus, icon: <Target className="h-3.5 w-3.5" /> },
    { label: "Addiction Risk", value: scores.addiction_risk, icon: <Flame className="h-3.5 w-3.5" />, inverse: true },
  ];

  return (
    <Panel>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            <Sparkles className="mr-1 inline h-3 w-3" /> Human Potential
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-5xl tabular-nums text-foreground">
              {scores.potential}
            </span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
          <p className={`mt-1 font-ui text-[11px] uppercase tracking-[0.2em] ${potentialBand.tone}`}>
            {potentialBand.label}
          </p>
        </div>
        <Link
          to="/assessment"
          className="rounded-full border border-border px-3 py-1 font-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
        >
          Qayta o'lchash
        </Link>
      </div>

      <div className="mt-4 space-y-2.5">
        {items.map((it) => {
          const pct = it.inverse ? 100 - it.value : it.value;
          return (
            <div key={it.label} className="flex items-center gap-3">
              <span className="flex w-32 shrink-0 items-center gap-1.5 font-ui text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                {it.icon}
                {it.label}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/40">
                <div
                  className="h-full bg-primary transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-9 text-right text-xs tabular-nums text-foreground">
                {it.value}
              </span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
