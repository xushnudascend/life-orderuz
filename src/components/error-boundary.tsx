import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { reportLovableError } from "@/lib/lovable-error-reporting";

type Props = {
  children: ReactNode;
  /** Kontekst nomi — xato hisobotida ko'rinadi */
  boundary?: string;
  /** Fallback UI qanchalik ixchamligi */
  variant?: "panel" | "inline";
  /** Ixtiyoriy fallback render */
  fallback?: (error: Error, reset: () => void) => ReactNode;
};

type State = { error: Error | null };

/**
 * Granular xato chegarasi.
 * Butun sahifa emas, faqat bitta panel/vidjet ishlamay qolsa yiqilmasin.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportLovableError(error, {
      boundary: this.props.boundary ?? "component_error_boundary",
      componentStack: info.componentStack ?? undefined,
    });
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;

    if (this.props.fallback) return this.props.fallback(this.state.error, this.reset);

    const compact = this.props.variant === "inline";
    return (
      <div
        role="alert"
        aria-live="polite"
        className={
          compact
            ? "flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 font-ui text-xs text-destructive"
            : "rounded-[var(--radius)] border border-destructive/40 bg-destructive/5 p-4"
        }
      >
        <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-ui text-sm font-medium text-foreground">
            Bu bo'lim yuklanmadi
          </p>
          {!compact && (
            <p className="mt-0.5 font-ui text-xs text-muted-foreground">
              Qayta urinib ko'ring — qolgan sahifa ishlamoqda.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={this.reset}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 font-ui text-xs text-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          <RefreshCw className="h-3 w-3" aria-hidden />
          Qayta
        </button>
      </div>
    );
  }
}
