import { MessageSquare } from "lucide-react";
import { useNadir } from "@/lib/nadir-context";

/**
 * Nadir FAB — doimo qo'l ostida (Hick's law: 1 aniq kirish nuqtasi).
 * Kichikroq, silliqroq, pulsatsiya faqat hover'da.
 */
export function NadirFab() {
  const { open, isOpen } = useNadir();
  if (isOpen) return null;
  return (
    <button
      type="button"
      onClick={() => open()}
      aria-label="Nadir bilan suhbat"
      title="Nadir (⌘/)"
      className="group fixed bottom-24 right-4 z-30 grid h-12 w-12 place-items-center rounded-full border border-primary/40 bg-primary text-primary-foreground shadow-[0_10px_30px_-12px_hsl(var(--primary)/0.6)] transition-all duration-200 hover:scale-105 hover:shadow-[0_14px_36px_-10px_hsl(var(--primary)/0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:bottom-6"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-primary/40 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
      />
      <span
        aria-hidden
        className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary-foreground/90 ring-2 ring-primary"
      />
      <MessageSquare className="relative h-4.5 w-4.5" aria-hidden />
    </button>
  );
}
