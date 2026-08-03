import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Circle, PlayCircle, ArrowRight } from "lucide-react";
import { Panel } from "@/components/panel";
import { AppShell } from "@/components/app-shell";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { loadAssessment, completeStage } from "@/lib/assessment.functions";
import { SCALES, type ScaleKey } from "@/lib/assessment-scales";

export const Route = createFileRoute("/_authenticated/roadmap")({
  head: () => ({
    meta: [
      { title: "Yo'l xaritangiz — Life Order" },
      {
        name: "description",
        content: "Reclaim → Rebuild → Rise. Sizga xos 3-bosqichli o'sish yo'li.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RoadmapPage,
});

function scaleLabel(key: string): string {
  return SCALES.find((s) => s.key === (key as ScaleKey))?.title ?? key;
}

function RoadmapPage() {
  const load = useServerFn(loadAssessment);
  const complete = useServerFn(completeStage);
  const qc = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ["assessment", "load"],
    queryFn: () => load(),
  });

  async function markDone(index: number) {
    try {
      await complete({ data: { stage_index: index } });
      toast.success("Bosqich yakunlandi");
      qc.invalidateQueries({ queryKey: ["assessment"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Xato");
    }
  }

  return (
    <AppShell title="Yo'l xaritasi">
      <PageHero
        eyebrow="Yo'l xaritangiz"
        title="Reclaim → Rebuild → Rise"
        subtitle="Uchta bosqich. Har biri sizning eng zaif shkalangizga qaratilgan."
      />

      {isPending && (
        <Panel className="mt-6">
          <p className="text-sm text-muted-foreground">Yuklanmoqda…</p>
        </Panel>
      )}

      {!isPending && (!data?.roadmap || data.roadmap.length === 0) && (
        <Panel className="mt-6">
          <p className="text-sm text-muted-foreground">
            Hali yo'l xaritangiz yo'q. 3 daqiqalik baholashni o'ting.
          </p>
          <Button asChild className="mt-4">
            <Link to="/assessment">
              Baholashni boshlash <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Panel>
      )}

      {data?.score && (
        <Panel className="mt-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MiniScore label="Potential" value={data.score.potential} />
            <MiniScore label="Discipline" value={data.score.discipline} />
            <MiniScore label="Focus" value={data.score.focus} />
            <MiniScore label="Addiction Risk" value={data.score.addiction_risk} inverse />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Yangilangan: {new Date(data.score.computed_at as string).toLocaleDateString("uz-UZ")}
            </span>
            <Link to="/assessment" className="text-primary underline underline-offset-2">
              Qayta o'tish
            </Link>
          </div>
        </Panel>
      )}

      {data?.roadmap && data.roadmap.length > 0 && (
        <div className="mt-4 space-y-3">
          {data.roadmap.map((stage) => {
            const done = stage.status === "done";
            const active = stage.status === "active";
            return (
              <Panel
                key={stage.stage_index}
                className={
                  active ? "border-primary/40 bg-primary/[0.05]" : done ? "opacity-70" : ""
                }
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {done ? (
                      <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success,142_60%_45%))]" aria-hidden />
                    ) : active ? (
                      <PlayCircle className="h-5 w-5 text-primary" aria-hidden />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" aria-hidden />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Bosqich {stage.stage_index + 1} · {scaleLabel(stage.focus_area)}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">{stage.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{stage.description}</p>
                    {stage.target_date && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Maqsad sana: {new Date(stage.target_date).toLocaleDateString("uz-UZ")}
                      </p>
                    )}
                    {active && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="mt-3"
                        onClick={() => markDone(stage.stage_index)}
                      >
                        Bajarildi
                      </Button>
                    )}
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}

function MiniScore({ label, value, inverse }: { label: string; value: number; inverse?: boolean }) {
  return (
    <div className="rounded-md border border-border/60 bg-card/40 p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">
        {value}
        <span className="text-xs text-muted-foreground">/100</span>
      </div>
      {inverse && <div className="text-[10px] text-muted-foreground">past — yaxshi</div>}
    </div>
  );
}
