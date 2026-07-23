import { MessageSquare } from "lucide-react";
import { useNadir } from "@/lib/nadir-context";

export function NadirFab() {
  const { open, isOpen } = useNadir();
  if (isOpen) return null;
  return (
    <button
      type="button"
      onClick={() => open()}
      aria-label="Nadir bilan suhbat ochish"
      className="group fixed bottom-24 right-4 z-30 grid h-14 w-14 place-items-center rounded-full border border-primary/40 bg-primary text-primary-foreground shadow-[0_10px_30px_-10px_hsl(var(--primary)/0.6)] transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:bottom-6"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-primary/40 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
      />
      <MessageSquare className="relative h-5 w-5" aria-hidden />
    </button>
  );
}
