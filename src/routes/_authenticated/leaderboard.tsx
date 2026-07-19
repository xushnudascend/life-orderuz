import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Loader2, Trophy, MapPin } from "lucide-react";
import { toast } from "sonner";
import { uz } from "@/i18n";
import { VILOYATLAR } from "@/lib/nervous";

export const Route = createFileRoute("/_authenticated/leaderboard")({
  head: () => ({
    meta: [
      { title: `Reyting — ${uz.brand.name}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Leaderboard,
});

type Row = { user_id: string; display_name: string; level: number; total_xp: number };
type Filter = "all" | "week";

function Leaderboard() {
  const { userId } = Route.useRouteContext();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [viloyat, setViloyat] = useState<string>("all");
  const [filter, setFilter] = useState<Filter>("all");
  const [regionalIds, setRegionalIds] = useState<Set<string> | null>(null);
  const [myViloyat, setMyViloyat] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("leaderboard_public" as never)
        .select("user_id, display_name, level, total_xp")
        .order("total_xp", { ascending: false })
        .limit(200);
      setRows((data as Row[] | null) ?? []);
      const { data: prof } = await supabase
        .from("profiles")
        .select("viloyat")
        .eq("id", userId)
        .maybeSingle();
      setMyViloyat((prof as { viloyat: string | null } | null)?.viloyat ?? null);
      setLoading(false);
    })();
  }, [userId]);

  // Load regional user IDs when viloyat changes
  useEffect(() => {
    if (viloyat === "all") {
      setRegionalIds(null);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("viloyat", viloyat)
        .eq("is_public", true);
      setRegionalIds(new Set(((data as { id: string }[] | null) ?? []).map((p) => p.id)));
    })();
  }, [viloyat]);

  async function saveMyViloyat(v: string) {
    setViloyat(v);
    if (v === "all") return;
    await supabase.from("profiles").update({ viloyat: v }).eq("id", userId);
    setMyViloyat(v);
    toast.success("Viloyat saqlandi.");
  }

  const filtered = useMemo(() => {
    let r = rows;
    if (regionalIds) r = r.filter((x) => regionalIds.has(x.user_id));
    return r.slice(0, 50);
  }, [rows, regionalIds]);

  return (
    <AppShell title="Reyting">
      <p className="font-ui text-xs uppercase tracking-[0.28em] text-primary">
        Reyting
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
        Eng qat'iyatlilar.
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Avval o'z viloyating bilan raqobatlash — keyin butun O'zbekiston.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <MapPin className="h-4 w-4 text-primary" />
        <select
          value={viloyat}
          onChange={(e) => saveMyViloyat(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">Barcha viloyatlar</option>
          {VILOYATLAR.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        <div className="flex gap-2">
          {(["all", "week"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                "rounded-full border px-3 py-1 font-ui text-xs transition-colors " +
                (filter === f
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground")
              }
            >
              {f === "all" ? "Barcha davr" : "Haftalik"}
            </button>
          ))}
        </div>
        {myViloyat && viloyat === "all" && (
          <Button variant="ghost" size="sm" onClick={() => saveMyViloyat(myViloyat)}>
            Mening viloyatim: {myViloyat}
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-8 text-center text-muted-foreground">Reyting bo'sh</p>
      ) : (
        <ol className="mt-8 space-y-2">
          {filtered.map((r, i) => {
            const isMe = r.user_id === userId;
            return (
              <li
                key={r.user_id}
                className={
                  "flex items-center justify-between rounded-[var(--radius)] border p-4 " +
                  (isMe
                    ? "border-primary/50 bg-primary/5"
                    : "border-border bg-card")
                }
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border font-serif">
                    {i < 3 ? <Trophy className="h-4 w-4 text-primary" /> : i + 1}
                  </span>
                  <div>
                    <p className="font-serif text-lg">
                      {r.display_name}
                      {isMe && (
                        <span className="ml-2 font-ui text-xs uppercase tracking-[0.2em] text-primary">
                          sen
                        </span>
                      )}
                    </p>
                    <p className="font-ui text-xs uppercase tracking-[0.18em] text-muted-foreground/80">
                      Daraja {r.level}
                    </p>
                  </div>
                </div>
                <p className="font-serif text-xl">{r.total_xp} XP</p>
              </li>
            );
          })}
        </ol>
      )}
    </AppShell>
  );
}
