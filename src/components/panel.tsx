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
        // Base surface — subtle inner top-highlight + soft outer shadow, brand focus-ring
        "relative rounded-[var(--radius)] border border-border/80 bg-card p-4",
        "shadow-[inset_0_1px_0_hsl(var(--foreground)/0.03),0_1px_2px_hsl(240_30%_0%/0.35)]",
        "transition-[border-color,transform,box-shadow] duration-200",
        "focus-within:border-primary/50 focus-within:shadow-[inset_0_1px_0_hsl(var(--foreground)/0.03),0_0_0_1px_hsl(var(--primary)/0.35),0_6px_20px_-10px_hsl(var(--primary)/0.4)]",
        interactive && "lift-3d cursor-pointer",
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
      <p className="font-serif text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
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
