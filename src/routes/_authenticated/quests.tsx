import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Loader2, Check, Target } from "lucide-react";
import { uz } from "@/i18n";

export const Route = createFileRoute("/_authenticated/quests")({
  head: () => ({
    meta: [
      { title: `Vazifalar — ${uz.brand.name}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Quests,
});

type Quest = {
  id: string;
  title: string;
  description: string | null;
  difficulty: number;
  xp_reward: number;
  status: string;
};

function Quests() {
  const { userId } = Route.useRouteContext();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    // ensure today's quests exist
    await supabase.rpc("ensure_daily_quests" as never);
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from("daily_quests")
      .select("id,title,description,difficulty,xp_reward,status")
      .eq("user_id", userId)
      .eq("quest_date", today)
      .order("difficulty", { ascending: true });
    setQuests((data as Quest[] | null) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function complete(q: Quest) {
    if (q.status === "completed") return;
    setBusy(q.id);
    await supabase
      .from("daily_quests")
      .update({ status: "completed" })
      .eq("id", q.id);
    await supabase.rpc("check_achievements" as never, { _user_id: userId } as never);
    setBusy(null);
    refresh();
  }

  const done = quests.filter((q) => q.status === "completed").length;

  return (
    <AppShell title="Vazifalar">
      <p className="font-ui text-xs uppercase tracking-[0.28em] text-primary">
        Bugungi vazifalar
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
        Kichik qadamlar.
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Har kuni uchta kichik vazifa. Bajargan sari XP orttirasan.
      </p>

      <p className="mt-6 font-ui text-sm text-muted-foreground">
        {done} / {quests.length} bajarildi
      </p>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {quests.map((q) => {
            const isDone = q.status === "completed";
            return (
              <div
                key={q.id}
                className={
                  "flex items-start justify-between gap-4 rounded-[var(--radius)] border p-5 transition-colors " +
                  (isDone
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-card")
                }
              >
                <div className="flex items-start gap-4">
                  <span
                    className={
                      "mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border " +
                      (isDone
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground")
                    }
                  >
                    {isDone ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Target className="h-4 w-4" />
                    )}
                  </span>
                  <div>
                    <p className="font-serif text-lg">{q.title}</p>
                    {q.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {q.description}
                      </p>
                    )}
                    <p className="mt-2 font-ui text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                      +{q.xp_reward} XP · qiyinlik {q.difficulty}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={isDone ? "ghost" : "default"}
                  disabled={isDone || busy === q.id}
                  onClick={() => complete(q)}
                >
                  {isDone ? "Bajarildi" : busy === q.id ? "..." : "Bajardim"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
