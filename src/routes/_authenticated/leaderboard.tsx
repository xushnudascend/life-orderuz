import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Loader2, Trophy } from "lucide-react";
import { uz } from "@/i18n";

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

function Leaderboard() {
  const { userId } = Route.useRouteContext();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("leaderboard_public" as never)
        .select("user_id, display_name, level, total_xp")
        .order("total_xp", { ascending: false })
        .limit(50);
      setRows((data as Row[] | null) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <AppShell title="Reyting">
      <p className="font-ui text-xs uppercase tracking-[0.28em] text-primary">
        Reyting
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
        Eng qat'iyatlilar.
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Reyting XP miqdori bo'yicha tuziladi. Halol o'ynasang — pastda emas, o'z ustingda ishlaysan.
      </p>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ol className="mt-8 space-y-2">
          {rows.map((r, i) => {
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
