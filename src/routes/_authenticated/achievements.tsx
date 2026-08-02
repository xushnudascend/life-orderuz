import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { PageHero } from "@/components/page-hero";
import { Loader2, Award, Lock } from "lucide-react";
import { Panel } from "@/components/panel";
import { uz } from "@/i18n";

export const Route = createFileRoute("/_authenticated/achievements")({
  head: () => ({
    meta: [{ title: `Yutuqlar — ${uz.brand.name}` }, { name: "robots", content: "noindex" }],
  }),
  component: Achievements,
});

type Ach = {
  id: string;
  key: string;
  title: string;
  description: string | null;
  tier: string;
  xp_reward: number;
};

function tierColor(tier: string) {
  if (tier === "gold") return "text-yellow-500";
  if (tier === "silver") return "text-slate-400";
  return "text-amber-700";
}

function Achievements() {
  const { userId } = Route.useRouteContext();
  const [all, setAll] = useState<Ach[]>([]);
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await supabase.rpc("check_my_achievements" as never);
      const [a, ua] = await Promise.all([
        supabase.from("achievements").select("id,key,title,description,tier,xp_reward"),
        supabase.from("user_achievements").select("achievement_id").eq("user_id", userId),
      ]);
      setAll((a.data as Ach[] | null) ?? []);
      setUnlocked(
        new Set(
          ((ua.data as { achievement_id: string }[] | null) ?? []).map((r) => r.achievement_id),
        ),
      );
      setLoading(false);
    })();
  }, [userId]);

  return (
    <AppShell title="Yutuqlar">
      <PageHero
        eyebrow="Sening yo'ling"
        title="Yutuqlar."
        subtitle="Har bir kichik g'alaba muhim. Ular ortidagi kunlar — asosiy narsa."
      />

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {all.map((a) => {
            const got = unlocked.has(a.id);
            return (
              <Panel
                key={a.id}
                className={
                  "flex items-start gap-4 " +
                  (got ? "" : "border-dashed border-border/60 bg-transparent opacity-70")
                }
              >
                <span
                  className={
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border " +
                    (got ? tierColor(a.tier) : "text-muted-foreground")
                  }
                >
                  {got ? <Award className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                </span>
                <div>
                  <p className="font-serif text-lg">{a.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                  <p className="mt-2 font-ui text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                    {a.tier} · +{a.xp_reward} XP
                  </p>
                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
