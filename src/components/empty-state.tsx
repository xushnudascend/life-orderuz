import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * EmptyState — used when a list/section has no rows yet.
 * Consistent voice: quiet, guiding, one CTA.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-[var(--radius)] border border-dashed border-border/70 bg-card/40 px-6 py-10 text-center",
        className,
      )}
      role="status"
    >
      {icon && (
        <div
          aria-hidden
          className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary"
        >
          {icon}
        </div>
      )}
      <h3 className="font-serif text-lg font-semibold tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="max-w-sm font-ui text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
