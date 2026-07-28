import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { PageHero } from "@/components/page-hero";
import { IfThenHint } from "@/components/if-then-hint";
import { Panel, PanelHeader } from "@/components/panel";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Dumbbell, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { uz } from "@/i18n";

export const Route = createFileRoute("/_authenticated/workout")({
  head: () => ({
    meta: [
      { title: `Mashg'ulot — ${uz.brand.name}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Workout,
});

type Row = { id: string; kind: string; duration_min: number; notes: string | null; logged_date: string };

function Workout() {
  const { userId } = Route.useRouteContext();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState("Yugurish");
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState("");

  async function refresh() {
    const { data } = await supabase
      .from("workouts")
      .select("id,kind,duration_min,notes,logged_date")
      .eq("user_id", userId)
      .order("logged_date", { ascending: false })
      .limit(30);
    setRows((data as Row[] | null) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function add() {
    if (!kind.trim() || duration <= 0) return;
    const { data: created, error } = await supabase
      .from("workouts")
      .insert({
        user_id: userId,
        kind: kind.trim(),
        duration_min: duration,
        notes: notes.trim() || null,
      })
      .select("id")
      .single();
    if (error) return toast.error("Saqlab bo'lmadi");
    await supabase.rpc("award_action_xp" as never, {
      _source: "workout",
      _reference_id: (created as { id: string }).id,
    } as never);
    setNotes("");
    toast.success("Mashg'ulot qo'shildi");
    refresh();
  }

  async function del(id: string) {
    await supabase.from("workouts").delete().eq("id", id);
    refresh();
  }

  return (
    <AppShell title="Mashg'ulot">
      <PageHero
        eyebrow="Jismoniy tayyorgarlik"
        title="Bugungi mashg'ulot."
        subtitle="Kichik jismoniy harakat — ruhiy holatingni ham tiklaydi."
      />
      <IfThenHint trigger="ertalab tishimni yuvsam" action="10 ta sakrash qilaman" />



      <Panel className="mt-8 p-5">

        <PanelHeader
          eyebrow="Yangi mashg'ulot"
          title={<h2 className="font-serif text-xl">Bugun qanday harakat qilding?</h2>}
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_120px_auto]">
          <div>
            <Label htmlFor="kind">Turi</Label>
            <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="dur">Daqiqa</Label>
            <Input
              id="dur"
              type="number"
              min={1}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={add} className="w-full">Qo'shish</Button>
          </div>
          <div className="sm:col-span-3">
            <Label htmlFor="notes">Izoh (ixtiyoriy)</Label>
            <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
      </Panel>

      <section className="mt-8">
        <h2 className="mb-3 font-serif text-2xl">Tarix</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<Dumbbell className="h-5 w-5" />}
            title="Hali yozuv yo'q"
            description="10 daqiqa yurish ham hisoblanadi. Kichik harakat — miyada dofamin va aniqlik ochiladi."
          />
        ) : (
          <div className="space-y-2">
            {rows.map((r) => (
              <Panel key={r.id} as="article" className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Dumbbell className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-serif text-lg">{r.kind}</p>
                    <p className="font-ui text-xs uppercase tracking-[0.18em] text-muted-foreground/80">
                      {r.duration_min} daq · {new Date(r.logged_date).toLocaleDateString("uz-UZ")}
                    </p>
                    {r.notes && <p className="mt-1 text-sm text-muted-foreground">{r.notes}</p>}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => del(r.id)} aria-label="O'chirish">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Panel>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
