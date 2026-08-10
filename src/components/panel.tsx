import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Dashboard panel — dense, info-forward card primitive.
 * Bir uslub: eyebrow (11px caps), value (2xl), caption (muted).
 */
export function Panel({
  className,
  children,
  as = "section",
  interactive = false,
}: {
  className?: string;
  children: ReactNode;
  as?: "section" | "div" | "article";
  interactive?: boolean;
}) {
  const Tag = as as "section";
  return (
    <Tag
      className={cn(
        // Base surface: standardized opaque surface from Life Order tokens
        "group/panel relative rounded-xl border border-border/70 bg-background-secondary p-4",
        "shadow-card",
        "transition-all duration-300 ease-out",
        "hover:border-border/100 hover:bg-background-tertiary",
        // ambient corner highlight — reveals on hover (visual reward without gamification)
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:opacity-0 before:transition-opacity before:duration-500",
        "before:bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.08),transparent_60%)]",
        "hover:before:opacity-100",
        interactive && "cursor-pointer hover:-translate-y-[1px]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function PanelHeader({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: string;
  title?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        {title && <div className="mt-1 min-w-0">{title}</div>}
      </div>
      {action}
    </div>
  );
}

export function PanelValue({
  value,
  caption,
  trend,
}: {
  value: ReactNode;
  caption?: ReactNode;
  trend?: "up" | "down" | "flat";
}) {
  return (
    <div className="mt-2">
      <p className="font-serif text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      {caption && (
        <p
          className={cn(
            "mt-1 font-ui text-xs",
            trend === "up" && "text-primary",
            trend === "down" && "text-destructive",
            (!trend || trend === "flat") && "text-muted-foreground",
          )}
        >
          {caption}
        </p>
      )}
    </div>
  );
}
