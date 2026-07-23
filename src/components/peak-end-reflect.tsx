import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, Check } from "lucide-react";
import { useNadir } from "@/lib/nadir-context";
import { supabase } from "@/integrations/supabase/client";

const DISMISS_KEY = "peakEnd:dismissedAt";

/**
 * Peak-End rule (Kahneman & Redelmeier, 1993).
 * Kunning oxirgi taassuroti butun kunni belgilaydi.
 * 1-tap mood check-in (Fogg tiny habit) + chuqurroq yo'llar.
 */
const MOODS = [
  { key: "spark", label: "Yorug'", tone: "text-primary" },
  { key: "steady", label: "Barqaror", tone: "text-foreground" },
  { key: "heavy", label: "Og'ir", tone: "text-muted-foreground" },
] as const;

export function PeakEndReflect() {
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const { open } = useNadir();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 20) return;
    const today = new Date().toISOString().slice(0, 10);
    const dismissed = typeof window !== "undefined" ? localStorage.getItem(DISMISS_KEY) : null;
    if (dismissed === today) return;
    setShow(true);
  }, []);

  if (!show) return null;

  function dismiss() {
    const today = new Date().toISOString().slice(0, 10);
    try {
      localStorage.setItem(DISMISS_KEY, today);
    } catch { /* ignore */ }
    setShow(false);
  }

  async function tapMood(key: string, label: string) {
    setSaved(label);
    // best-effort micro-journal (1 word)
    try {
      const { data: u } = await supabase.auth.getUser();
      if (u.user) {
        await supabase.from("journal_entries").insert({
          user_id: u.user.id,
          content: `peak-end: ${label.toLowerCase()}`,
          mood: key,
        } as never);
      }
    } catch { /* ignore */ }
    setTimeout(dismiss, 1200);
  }

  return (
    <aside
      role="region"
      aria-label="Kunni yopish"
      className="mb-4 rounded-[var(--radius)] border border-primary/30 bg-primary/[0.04] p-4"
    >
      <div className="flex items-start gap-3">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
            Kunni yopish · Peak-End
          </p>
          <p className="mt-1 font-serif text-base leading-snug text-foreground">
            {saved ? `Belgilandi: ${saved}` : "Bugun qanday tugadi?"}
          </p>
          {!saved && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {MOODS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => tapMood(m.key, m.label)}
                  className={
                    "inline-flex h-7 items-center gap-1 rounded-full border border-border bg-card px-2.5 font-ui text-[11px] transition hover:border-primary/40 hover:bg-primary/5 " +
                    m.tone
                  }
                >
                  {m.label}
                </button>
              ))}
              <button
                onClick={() => {
                  open({ contextHint: "Kunni yopish. Bugungi eng yorug' daqiqa haqida qisqa refleksiya." });
                  dismiss();
                }}
                className="ml-auto inline-flex h-7 items-center rounded-full bg-primary px-3 font-ui text-[11px] font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Nadir bilan
              </button>
              <Link
                to="/journal"
                onClick={dismiss}
                className="inline-flex h-7 items-center rounded-full border border-border px-2.5 font-ui text-[11px] text-muted-foreground hover:text-foreground"
              >
                Jurnal
              </Link>
              <button
                onClick={dismiss}
                aria-label="Keyinroq"
                className="inline-flex h-7 items-center rounded-full px-2 font-ui text-[11px] text-muted-foreground hover:text-foreground"
              >
                Keyinroq
              </button>
            </div>
          )}
          {saved && (
            <p className="mt-1 inline-flex items-center gap-1 font-ui text-[11px] text-muted-foreground">
              <Check className="h-3 w-3 text-primary" aria-hidden /> jurnalga yozildi
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
