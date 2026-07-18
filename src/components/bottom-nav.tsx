import { Link, useLocation } from "@tanstack/react-router";
import { Compass, ListChecks, Sparkles, BookText, User } from "lucide-react";

/**
 * 5 tab bottom nav — sidebar bilan bir uslub.
 * Faqat mobil ( md:hidden ).
 */
const TABS = [
  { to: "/dashboard", label: "Bosh",     icon: Compass,    match: ["/dashboard", "/analytics"] },
  { to: "/habits",    label: "Odatlar",  icon: ListChecks, match: ["/habits", "/quests", "/c/habits"] },
  { to: "/mentor",    label: "Nadir",    icon: Sparkles,   match: ["/mentor"] },
  { to: "/journal",   label: "Kundalik", icon: BookText,   match: ["/journal", "/c/learn"] },
  { to: "/profile",   label: "Men",      icon: User,       match: ["/profile", "/settings", "/achievements"] },
] as const;

export function BottomNav({
  recommendedTab,
}: {
  recommendedTab?: string;
}) {
  const location = useLocation();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/70 bg-background/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 md:hidden"
      aria-label="Asosiy navigatsiya"
    >
      <div className="mx-auto flex max-w-6xl items-stretch justify-around px-1">
        {TABS.map((t) => {
          const active = t.match.some(
            (m) => location.pathname === m || location.pathname.startsWith(m + "/"),
          );
          const recommended = recommendedTab === t.to && !active;
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              aria-current={active ? "page" : undefined}
              className={
                "tap relative flex flex-1 flex-col items-center justify-center gap-1 py-2 font-ui text-[10px] uppercase tracking-[0.16em] transition-all duration-200 " +
                (active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground active:scale-[0.97]")
              }
            >
              {active && (
                <>
                  <span
                    aria-hidden
                    className="absolute top-0 h-[3px] w-9 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.7)]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-x-3 top-1.5 -z-10 h-9 rounded-lg bg-primary/[0.07]"
                  />
                </>
              )}
              <Icon
                className={"h-5 w-5 transition-transform " + (active ? "scale-[1.05]" : "")}
                strokeWidth={active ? 2.2 : 1.6}
              />
              <span>{t.label}</span>
              {recommended && (
                <span
                  aria-hidden
                  className="absolute right-3 top-2 h-1.5 w-1.5 animate-pulse rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.8)]"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
