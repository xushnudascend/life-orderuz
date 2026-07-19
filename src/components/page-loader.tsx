import { Loader2 } from "lucide-react";

export function PageLoader({ label = "Yuklanmoqda..." }: { label?: string }) {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-background">
      <div
        className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-primary/70 animate-pulse"
        aria-hidden
      />
      <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="font-ui text-xs uppercase tracking-[0.28em] text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );
}
