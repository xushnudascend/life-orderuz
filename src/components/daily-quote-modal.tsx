import { useEffect, useRef, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";

const QUOTES = [
  { t: "Sen bo'la oladigan eng yaxshi versiyang bo'l.", a: "Mark Avreliy" },
  { t: "Qiyinchilik — bu sening kuching o'sadigan joy.", a: "Seneka" },
  { t: "Boshlash — yarim ish.", a: "Aristotel" },
  { t: "Disiplin — istakdan kuchliroq.", a: "Jocko Willink" },
  { t: "Kim o'zini yenga olsa, eng kuchli odamdir.", a: "Lao Tszi" },
  { t: "Kichik odat — katta taqdir.", a: "James Clear" },
  { t: "Bugun qilgan ishing ertangi seni yaratadi.", a: "Life Order" },
  { t: "Motivatsiya tugaydi. Tizim qoladi.", a: "Life Order" },
  { t: "Kichik qadamlar — ulkan sayohatning boshlanishi.", a: "Lao Tszi" },
];

const SKIP = ["/onboarding", "/auth", "/reset-password", "/pricing", "/checkout"];

export function DailyQuoteModal() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(QUOTES[0]);
  const { pathname } = useLocation();
  const prev = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (SKIP.some((p) => pathname === p || pathname.startsWith(p + "/"))) return;
    const today = new Date().toDateString();
    if (window.localStorage.getItem("lo:daily-quote") === today) return;
    setQ(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    prev.current = (document.activeElement as HTMLElement) ?? null;
    setOpen(true);
    window.localStorage.setItem("lo:daily-quote", today);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    setOpen(false);
    if (prev.current && document.body.contains(prev.current)) {
      requestAnimationFrame(() => prev.current?.focus());
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-quote-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
    >
      <div
        className="relative w-full max-w-md rounded-[var(--radius)] border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          onClick={close}
          aria-label="Yopish"
          className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 id="daily-quote-title" className="font-ui text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            Bugungi iqtibos
          </h2>
        </div>
        <div className="py-6 text-center">
          <p className="font-serif text-2xl leading-snug">"{q.t}"</p>
          <p className="mt-4 font-ui text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            — {q.a}
          </p>
        </div>
        <Button onClick={close} className="w-full">Boshladik</Button>
      </div>
      <button
        aria-hidden
        tabIndex={-1}
        className="absolute inset-0 -z-10"
        onClick={close}
      />
    </div>
  );
}
