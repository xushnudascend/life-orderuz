import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, X } from "lucide-react";
import { Link } from "@tanstack/react-router";

type Nudge = { id: string; kind: string; message: string };

export function NadirNudgeBanner({ userId }: { userId: string }) {
  const [nudge, setNudge] = useState<Nudge | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from("nadir_nudges")
        .select("id, kind, message")
        .eq("user_id", userId)
        .is("read_at", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (alive) setNudge((data as Nudge | null) ?? null);
    })();
    return () => {
      alive = false;
    };
  }, [userId]);

  async function dismiss() {
    if (!nudge) return;
    await supabase
      .from("nadir_nudges")
      .update({ resolved_at: new Date().toISOString() })
      .eq("id", nudge.id);
    setNudge(null);
  }

  if (!nudge) return null;

  return (
    <div className="mb-4 rounded-[var(--radius)] border border-primary/40 bg-primary/5 p-4">
      <div className="flex items-start gap-3">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
            Nadir · {nudge.kind === "burnout" ? "Sokinlik" : "Xabar"}
          </p>
          <p className="mt-1.5 text-sm text-foreground/90">{nudge.message}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/mentor"
              className="inline-flex h-8 items-center rounded-md bg-primary px-3 font-ui text-xs font-semibold text-primary-foreground hover:opacity-90"
            >
              Nadir bilan gaplash
            </Link>
            <button
              onClick={dismiss}
              className="inline-flex h-8 items-center rounded-md border border-border px-3 font-ui text-xs text-muted-foreground hover:text-foreground"
            >
              Yopish
            </button>
          </div>
        </div>
        <button
          onClick={dismiss}
          aria-label="Yopish"
          className="rounded p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
