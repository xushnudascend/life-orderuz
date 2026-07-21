import { useEffect, useRef, useState } from "react";
import { X, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Anti-addiction: silent screen-time watcher.
 * After ~45 minutes of continuous session, nudges the user to rest.
 * Local-only (sessionStorage). No dark patterns — one nudge per session, dismissible.
 */
const NUDGE_AFTER_MS = 45 * 60 * 1000;
const KEY = "life-order:rest-nudge-shown";

export function RestNudge() {
  const [visible, setVisible] = useState(false);
  const start = useRef<number>(Date.now());

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(KEY)) return;
    const id = window.setInterval(() => {
      if (Date.now() - start.current >= NUDGE_AFTER_MS) {
        setVisible(true);
        sessionStorage.setItem(KEY, "1");
        window.clearInterval(id);
      }
    }, 30_000);
    return () => window.clearInterval(id);
  }, []);

  if (!visible) return null;
  return (
    <div
      role="status"
      className="fixed bottom-4 right-4 z-40 max-w-sm rounded-lg border border-border/60 bg-card/95 p-4 shadow-lg backdrop-blur-md animate-in slide-in-from-bottom-4"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
          <Moon className="h-4 w-4" />
        </div>
        <div className="flex-1 space-y-1.5">
          <p className="font-ui text-[13px] font-semibold">45 daqiqa o'tdi</p>
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            Ekrandan uzoqroq turing — 2 daqiqa nafas oling. Bu ilova sizni bog'lab
            qolish uchun qurilmagan.
          </p>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setVisible(false)}
            className="mt-1 h-7 text-[12px]"
          >
            Rahmat, davom etaman
          </Button>
        </div>
        <button
          onClick={() => setVisible(false)}
          aria-label="Yopish"
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
