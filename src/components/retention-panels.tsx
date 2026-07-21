import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  getWeeklyChallenge,
  bumpWeeklyChallenge,
  getSeasonSummary,
} from "@/lib/retention.functions";
import { Panel, PanelHeader, PanelValue } from "@/components/panel";
import { Button } from "@/components/ui/button";
import { Target, Trophy, Check } from "lucide-react";
import { toast } from "sonner";

function daysBetween(a: string, b: string) {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export function RetentionPanels() {
  const fetchChallenge = useServerFn(getWeeklyChallenge);
  const fetchSeason = useServerFn(getSeasonSummary);
  const bump = useServerFn(bumpWeeklyChallenge);
  const qc = useQueryClient();

  const { data: challenge } = useQuery({
    queryKey: ["weekly-challenge"],
    queryFn: () => fetchChallenge({ data: undefined as never }),
  });
  const { data: season } = useQuery({
    queryKey: ["season-summary"],
    queryFn: () => fetchSeason({ data: undefined as never }),
  });

  const bumpMutation = useMutation({
    mutationFn: () => bump({ data: undefined as never }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["weekly-challenge"] });
      qc.invalidateQueries({ queryKey: ["season-summary"] });
      if (res.status === "completed") {
        toast.success("Haftalik maqsad bajarildi", {
          description: `+${res.xp_reward} XP mavsum hisobiga qo'shildi.`,
        });
      }
    },
  });

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {/* Weekly challenge */}
      <Panel>
        <PanelHeader
          eyebrow="Bu hafta"
          title={
            <p className="font-ui text-[14px] font-semibold flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-primary" /> Haftalik maqsad
            </p>
          }
        />
        {challenge ? (
          <div className="mt-3 space-y-3">
            <p className="font-serif text-[18px] leading-tight">{challenge.title}</p>
            {challenge.description && (
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                {challenge.description}
              </p>
            )}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (challenge.progress / challenge.target) * 100)}%`,
                  }}
                />
              </div>
              <span className="font-ui text-[12px] tabular-nums text-muted-foreground">
                {challenge.progress}/{challenge.target}
              </span>
            </div>
            {challenge.status === "completed" ? (
              <div className="flex items-center gap-2 text-[13px] text-primary">
                <Check className="h-4 w-4" />
                Bajarildi · +{challenge.xp_reward} XP
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => bumpMutation.mutate()}
                disabled={bumpMutation.isPending}
                className="w-full"
              >
                Bugun bajardim (+1)
              </Button>
            )}
          </div>
        ) : (
          <p className="mt-3 text-[13px] text-muted-foreground">Yuklanmoqda…</p>
        )}
      </Panel>

      {/* Season */}
      <Panel>
        <PanelHeader
          icon={<Trophy className="h-3.5 w-3.5" />}
          title={season?.season?.name ?? "Mavsum"}
          subtitle={season?.season?.theme ?? undefined}
        />
        {season?.season ? (
          <div className="mt-3 space-y-3">
            <div className="flex items-baseline gap-2">
              <PanelValue>{season.myXp}</PanelValue>
              <span className="font-ui text-[11px] uppercase tracking-widest text-muted-foreground">
                mavsum XP
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[12px]">
              <div className="rounded-md border border-border/50 bg-background/40 px-3 py-2">
                <p className="text-muted-foreground">Reyting</p>
                <p className="font-ui font-semibold tabular-nums">
                  {season.rank ? `#${season.rank}` : "—"}
                </p>
              </div>
              <div className="rounded-md border border-border/50 bg-background/40 px-3 py-2">
                <p className="text-muted-foreground">Ishtirokchi</p>
                <p className="font-ui font-semibold tabular-nums">{season.topPlayers}</p>
              </div>
            </div>
            <p className="font-ui text-[11px] text-muted-foreground">
              Tugash: {daysBetween(new Date().toISOString(), season.season.ends_at)} kun qoldi
            </p>
          </div>
        ) : (
          <p className="mt-3 text-[13px] text-muted-foreground">
            Hozircha faol mavsum yo'q.
          </p>
        )}
      </Panel>
    </div>
  );
}
