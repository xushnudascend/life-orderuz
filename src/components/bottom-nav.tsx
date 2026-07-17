import { Link, useLocation } from "@tanstack/react-router";
import { Compass, HeartPulse, Flame, GraduationCap, Users } from "lucide-react";

/**
 * 5 tab bottom nav (MEGA-PROMPT 1-bo'lim).
 * Faqat mobil ( md:hidden ) — desktop'da header-nav ishlatiladi.
 */
const TABS = [
  { to: "/dashboard", label: "Bosh",       icon: Compass,        match: ["/dashboard", "/analytics"] },
  { to: "/c/body",    label: "Tana",       icon: HeartPulse,     match: ["/c/body", "/workout", "/diet"] },
  { to: "/c/habits",  label: "Odatlar",    icon: Flame,          match: ["/c/habits", "/habits", "/quests"] },
  { to: "/c/learn",   label: "O'rganish",  icon: GraduationCap,  match: ["/c/learn", "/journal"] },
  { to: "/community", label: "Davra",      icon: Users,          match: ["/community"] },
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
                "tap relative flex flex-1 flex-col items-center justify-center gap-1 py-2 font-ui text-[10px] uppercase tracking-[0.16em] transition-colors " +
                (active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute top-0 h-[3px] w-9 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.6)]"
                />
              )}
              <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.6} />
              <span>{t.label}</span>
              {recommended && (
                <span
                  aria-hidden
                  className="absolute right-3 top-2 h-1.5 w-1.5 animate-pulse rounded-full bg-primary"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
