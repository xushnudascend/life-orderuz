import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, RefreshCw } from "lucide-react";
import { Panel, PanelHeader } from "@/components/panel";

type Props = {
  context: string;
  storageKey?: string;
};

/**
 * Nadir mikro-kuzatuv kartasi. Bir kunga bir marta chaqiradi (session cache).
 */
export function AIInsightCard({ context, storageKey = "nadir-insight-today" }: Props) {
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const dayKey = new Date().toISOString().slice(0, 10);

  async function fetchInsight(force = false) {
    setError(false);
    if (!force) {
      try {
        const cached = sessionStorage.getItem(`${storageKey}:${dayKey}`);
        if (cached) {
          setText(cached);
          return;
        }
      } catch {
        /* noop */
      }
    }
    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await fetch("/api/ai/micro-insight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ context, language: "uz" }),
      });
      if (!res.ok) {
        setError(true);
        setLoading(false);
        return;
      }
      const json = (await res.json()) as { insight?: string };
      const insight = (json.insight ?? "").trim();
      if (insight) {
        setText(insight);
        try {
          sessionStorage.setItem(`${storageKey}:${dayKey}`, insight);
        } catch {
          /* noop */
        }
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Panel className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl"
      />
      <PanelHeader
        eyebrow={
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-primary" /> Nadir · mikro-kuzatuv
          </span>
        }
        action={
          <button
            type="button"
            onClick={() => fetchInsight(true)}
            disabled={loading}
            aria-label="Yangilash"
            className="tap inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary disabled:opacity-50"
          >
            <RefreshCw className={"h-3.5 w-3.5 " + (loading ? "animate-spin" : "")} />
          </button>
        }
      />
      <div className="relative mt-3 min-h-[3.25rem]">
        {loading && !text ? (
          <div className="space-y-2" aria-hidden>
            <div className="skeleton h-3 w-3/4" />
            <div className="skeleton h-3 w-1/2" />
          </div>
        ) : text ? (
          <p className="font-serif text-[15px] leading-relaxed text-foreground/90">
            {text}
          </p>
        ) : error ? (
          <p className="font-ui text-sm text-muted-foreground">
            Hozircha kuzatuv yo'q. Keyinroq urinib ko'ring.
          </p>
        ) : (
          <p className="font-ui text-sm text-muted-foreground">
            Bugungi harakatlaringiz uchun kuzatuv tayyorlanmoqda…
          </p>
        )}
      </div>
    </Panel>
  );
}
