import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Utensils, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { uz } from "@/i18n";

export const Route = createFileRoute("/_authenticated/diet")({
  head: () => ({
    meta: [
      { title: `Ovqatlanish — ${uz.brand.name}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Diet,
});

type Row = { id: string; kind: string; description: string; calories: number | null; logged_date: string };
const KINDS = ["Nonushta", "Tushlik", "Kechki ovqat", "Yengil ovqat"];

function Diet() {
  const { userId } = Route.useRouteContext();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState(KINDS[0]);
  const [desc, setDesc] = useState("");
  const [cal, setCal] = useState<string>("");

  async function refresh() {
    const { data } = await supabase
      .from("meals")
      .select("id,kind,description,calories,logged_date")
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
    if (!desc.trim()) return;
    const { error } = await supabase.from("meals").insert({
      user_id: userId,
      kind,
      description: desc.trim(),
      calories: cal ? Number(cal) : null,
    });
    if (error) return toast.error("Saqlab bo'lmadi");
    setDesc("");
    setCal("");
    toast.success("Yozuv qo'shildi");
    refresh();
  }

  async function del(id: string) {
    await supabase.from("meals").delete().eq("id", id);
    refresh();
  }

  const today = new Date().toISOString().slice(0, 10);
  const todayCal = rows
    .filter((r) => r.logged_date === today)
    .reduce((s, r) => s + (r.calories ?? 0), 0);

  return (
    <AppShell title="Ovqatlanish">
      <p className="font-ui text-xs uppercase tracking-[0.28em] text-primary">
        Bugungi ovqat
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
        Ovqatlanish kundaligi.
      </h1>
      <p className="mt-3 text-muted-foreground">
        Bugun jami: <span className="text-foreground">{todayCal} kkal</span>
      </p>

      <div className="mt-8 grid gap-3 rounded-[var(--radius)] border border-border p-5 sm:grid-cols-[160px_1fr_120px_auto]">
        <div>
          <Label htmlFor="mkind">Vaqti</Label>
          <select
            id="mkind"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {KINDS.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="desc">Nima yeding?</Label>
          <Input id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="cal">Kkal</Label>
          <Input id="cal" type="number" min={0} value={cal} onChange={(e) => setCal(e.target.value)} />
        </div>
        <div className="flex items-end">
          <Button onClick={add} className="w-full">Qo'shish</Button>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 font-serif text-2xl">Tarix</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Hali yozuv yo'q.</p>
        ) : (
          <div className="space-y-2">
            {rows.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-[var(--radius)] border border-border bg-card p-4"
              >
                <div className="flex items-center gap-3">
                  <Utensils className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-serif text-lg">{r.description}</p>
                    <p className="font-ui text-xs uppercase tracking-[0.18em] text-muted-foreground/80">
                      {r.kind} · {new Date(r.logged_date).toLocaleDateString("uz-UZ")}
                      {r.calories ? ` · ${r.calories} kkal` : ""}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => del(r.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
