import { useEffect, useRef, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const QUOTES = [
  { t: "Sen bo'la oladigan eng yaxshi versiyang bo'l.", a: "Mark Avreliy" },
  { t: "Qiyinchilik — bu sening kuching o'sadigan joy.", a: "Seneka" },
  { t: "Boshlash — yarim ish.", a: "Aristotel" },
  { t: "Disiplin — istakdan kuchliroq.", a: "Jocko Willink" },
  { t: "Kim o'zini yenga olsa, eng kuchli odamdir.", a: "Lao Tszi" },
  { t: "Kichik odat — katta taqdir.", a: "James Clear" },
  { t: "Bugun qilgan ishing ertangi seni yaratadi.", a: "Life Order" },
  { t: "Motivatsiya tugaydi. Tizim qoladi.", a: "Life Order" },
  { t: "Ish qilmasang, hech narsa o'zgarmaydi.", a: "Marcus Aurelius" },
  { t: "Kichik qadamlar — ulkan sayohatning boshlanishi.", a: "Lao Tszi" },
];

const SKIP = ["/onboarding", "/auth", "/reset-password", "/pricing"];

export function DailyQuoteModal() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(QUOTES[0]);
  const { pathname } = useLocation();
  const prev = useRef<HTMLElement | null>(null);

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

  function handleChange(next: boolean) {
    setOpen(next);
    if (!next && prev.current && document.body.contains(prev.current)) {
      requestAnimationFrame(() => prev.current?.focus());
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleChange}>
      <DialogContent className="max-w-md" aria-describedby="daily-quote-desc">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif">
            <Sparkles className="h-5 w-5 text-primary" /> Bugungi iqtibos
          </DialogTitle>
          <DialogDescription id="daily-quote-desc" className="sr-only">
            Kunlik motivatsion iqtibos
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-center">
          <p className="font-serif text-xl leading-relaxed">"{q.t}"</p>
          <p className="mt-3 font-ui text-xs uppercase tracking-[0.28em] text-muted-foreground">
            — {q.a}
          </p>
        </div>
        <Button onClick={() => handleChange(false)} autoFocus className="w-full">
          Boshladik
        </Button>
      </DialogContent>
    </Dialog>
  );
}
