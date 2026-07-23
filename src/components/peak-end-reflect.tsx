import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useNadir } from "@/lib/nadir-context";

const DISMISS_KEY = "peakEnd:dismissedAt";

/**
 * Peak-End rule (Kahneman & Redelmeier).
 * Kunning oxirgi 15 daqiqasi butun kunning xotirasini shakllantiradi.
 * Kechqurun (>= 20:00) yumshoq eslatma — 3 qatorli mikro-refleksiya.
 * Bir kunda faqat 1 marta ko'rinadi.
 */
export function PeakEndReflect() {
  const [show, setShow] = useState(false);
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
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  return (
    <aside
      role="region"
      aria-label="Kunni yopish"
      className="mb-4 flex flex-col gap-3 rounded-[var(--radius)] border border-primary/30 bg-primary/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
        <div>
          <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            Kunni yopish · 2 daqiqa
          </p>
          <p className="mt-1 font-serif text-base leading-snug text-foreground">
            Bugungi eng yorug' daqiqa qanday edi?
          </p>
          <p className="mt-1 font-ui text-xs text-muted-foreground">
            Peak-End: kunning oxirgi taassuroti butun kunni belgilaydi.
          </p>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => {
            open({ contextHint: "Kunni yopish. Bugungi eng yorug' daqiqa haqida qisqa refleksiya qilaylik." });
            dismiss();
          }}
          className="inline-flex h-8 items-center rounded-full bg-primary px-3 font-ui text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Nadir bilan
        </button>
        <Link
          to="/journal"
          onClick={dismiss}
          className="inline-flex h-8 items-center rounded-full border border-border px-3 font-ui text-xs text-muted-foreground hover:text-foreground"
        >
          Jurnal
        </Link>
        <button
          onClick={dismiss}
          className="inline-flex h-8 items-center rounded-full px-2 font-ui text-xs text-muted-foreground hover:text-foreground"
          aria-label="Yopish"
        >
          Keyinroq
        </button>
      </div>
    </aside>
  );
}
