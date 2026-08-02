import { Link, useLocation } from "@tanstack/react-router";
import { Compass, HeartPulse, ListChecks, GraduationCap, Users, Sparkles } from "lucide-react";

/**
 * 5 tab bottom nav + markazda Nadir FAB (floating action button).
 * Faqat mobilda ( md:hidden ).
 */
const TABS = [
  { to: "/dashboard", label: "Bosh", icon: Compass, match: ["/dashboard", "/analytics"] },
  { to: "/c/body", label: "Tana", icon: HeartPulse, match: ["/c/body", "/workout", "/diet"] },
  // FAB (Nadir) — markazda, ushbu slotni bo'sh qoldiramiz
  { to: "/habits", label: "Odat", icon: ListChecks, match: ["/habits", "/quests", "/c/habits"] },
  { to: "/c/learn", label: "O'rgan", icon: GraduationCap, match: ["/c/learn", "/journal"] },
  {
    to: "/community",
    label: "Davra",
    icon: Users,
    match: ["/community", "/party", "/leaderboard"],
  },
] as const;

export function BottomNav({ recommendedTab }: { recommendedTab?: string }) {
  const location = useLocation();

  const isNadirActive = location.pathname.startsWith("/mentor");

  const isTabActive = (t: (typeof TABS)[number]) =>
    t.match.some((m) => location.pathname === m || location.pathname.startsWith(m + "/"));

  return (
    <>
      {/* Nadir FAB — markaziy, ko'tarilgan */}
      <Link
        to="/mentor"
        aria-label="Nadir AI mentor"
        aria-current={isNadirActive ? "page" : undefined}
        className={
          "fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 z-50 -translate-x-1/2 md:hidden " +
          "grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground " +
          "shadow-[0_10px_30px_-8px_hsl(var(--primary)/0.6),0_0_0_4px_hsl(var(--background))] " +
          "transition-transform duration-200 active:scale-95 " +
          (isNadirActive ? "ring-2 ring-primary/60" : "")
        }
      >
        <Sparkles className="h-6 w-6" strokeWidth={2.2} aria-hidden />
        <span
          aria-hidden
          className="halo-spin absolute inset-[-6px] -z-10 rounded-full bg-[conic-gradient(from_0deg,hsl(var(--primary)/0.55),transparent_40%,hsl(var(--primary)/0.55)_80%,transparent)] blur-md opacity-70"
        />
        <span
          aria-hidden
          className="orb-breathe absolute inset-0 -z-10 rounded-full bg-primary/50 blur-xl"
        />
        <span className="sr-only">Nadir</span>
      </Link>

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/70 bg-background/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 md:hidden"
        aria-label="Asosiy navigatsiya"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-5 items-stretch px-1">
          {TABS.map((t, idx) => {
            const active = isTabActive(t);
            const recommended = recommendedTab === t.to && !active;
            const Icon = t.icon;
            // Markaziy slot (index 2) — FAB uchun bo'sh joy
            const insertGap = idx === 2;
            return (
              <div key={t.to} className="contents">
                {insertGap && <span aria-hidden className="pointer-events-none" />}
                <Link
                  to={t.to}
                  aria-current={active ? "page" : undefined}
                  className={
                    "tap relative flex flex-col items-center justify-center gap-1 py-2 font-ui text-[10px] uppercase tracking-[0.16em] transition-all duration-200 " +
                    (idx === 2 ? "col-start-auto " : "") +
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
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
}
