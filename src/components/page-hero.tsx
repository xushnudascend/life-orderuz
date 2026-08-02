import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CornerOrnament } from "@/components/corner-ornament";

/**
 * PageHero — every authenticated screen's opening block.
 * Uniform typographic rhythm: eyebrow (caps micro), title (serif display),
 * subtitle (muted), and optional actions rail on the right.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  actions,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "relative mb-6 flex flex-col gap-4 border-b border-border/60 pb-6 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:pb-8",
        // subtle amber hairline that decays — anchors the eye (Gestalt: continuity)
        "before:absolute before:-bottom-px before:left-0 before:h-px before:w-24 before:bg-gradient-to-r before:from-primary before:to-transparent",
        className,
      )}
    >
      {/* Regional visual signature — every hub inherits the girih mark */}
      <CornerOrnament position="top-right" size={180} className="opacity-60" />
      <div className="min-w-0">
        {eyebrow && (
          <p className="rise-1 flex items-center gap-2 font-ui text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
            <span className="line-sweep" aria-hidden />
            {eyebrow}
          </p>
        )}
        <h1 className="rise-2 mt-3 font-serif text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl md:text-[2.6rem]">
          {title}
        </h1>
        {subtitle && (
          <p className="rise-3 mt-3 max-w-2xl font-ui text-sm leading-relaxed text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="rise-4 flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      )}
    </header>
  );
}

/**
 * SectionHeader — inline section divider used between panels/lists.
 */
export function SectionHeader({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 mt-8 flex items-end justify-between gap-3", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1 font-serif text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
