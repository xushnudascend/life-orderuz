import { Link, useLocation } from "@tanstack/react-router";
import { Compass, ListChecks, GraduationCap, Sparkles, User, Zap, Users } from "lucide-react";
import { useT } from "@/i18n/use-t";

/**
 * 5 tab bottom nav + markazda Nadir FAB (floating action button).
 * Faqat mobilda ( md:hidden ).
 */
const TABS = [
  { to: "/dashboard", label: "Bugun", icon: Compass, match: ["/dashboard"] },
  { to: "/hub", label: "Hub", icon: ListChecks, match: ["/hub"] },
  { to: "/pricing", label: "Premium", icon: Zap, match: ["/pricing"], highlight: true },
  { to: "/community", label: "Davra", icon: Users, match: ["/community"] },
  { to: "/profile", label: "Profil", icon: User, match: ["/profile"] },
] as const;

type TabItem = typeof TABS[number] & { highlight?: boolean };

export function BottomNav({ recommendedTab }: { recommendedTab?: string }) {
  const { t } = useT();
  const location = useLocation();

  const isNadirActive = location.pathname.startsWith("/mentor");

  const isTabActive = (tab: any) =>
    tab.match.some((m: string) => location.pathname === m || location.pathname.startsWith(m + "/"));

  return (
    <>
      {/* Nadir FAB — markaziy, ko'tarilgan */}
      <Link
        to="/mentor"
        aria-label="Nadir AI mentor"
        aria-current={isNadirActive ? "page" : undefined}
        className={
          "fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 z-50 -translate-x-1/2 md:hidden " +
          "grid h-14 w-14 place-items-center rounded-[18px] bg-primary text-primary-foreground " +
          "shadow-glow " +
          "transition-all duration-300 hover:scale-110 active:scale-90 " +
          (isNadirActive ? "ring-2 ring-primary shadow-[0_0_30px_hsl(var(--primary)/0.5)]" : "")
        }
      >
        <Sparkles className="h-6 w-6" strokeWidth={2.2} aria-hidden />
        <span
          aria-hidden
          className="halo-spin absolute inset-[-6px] -z-10 rounded-2xl bg-[conic-gradient(from_0deg,hsl(var(--primary)/0.6),transparent_40%,hsl(var(--primary)/0.6)_80%,transparent)] blur-md opacity-70"
        />
        <span
          aria-hidden
          className="orb-breathe absolute inset-0 -z-10 rounded-full bg-primary/40 blur-xl"
        />
        <span className="sr-only">Nadir</span>
      </Link>

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background-primary pb-[env(safe-area-inset-bottom)] backdrop-blur-3xl md:hidden h-16"
        aria-label="Asosiy navigatsiya"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-around px-1">
          {TABS.map((t: TabItem, idx) => {
            const active = isTabActive(t);
            const recommended = recommendedTab === t.to && !active;
            const Icon = t.icon;
            
            // Central gap for Nadir FAB remains at idx 2 if we use 5 tabs but 
            // wait, we need it between idx 1 and 3 or similar.
            // Let's adjust the indices.
            
            return (
              <div key={t.to} className="contents">
                {idx === 2 && <div className="w-16 shrink-0" aria-hidden="true" />}
                <Link
                  to={t.to}
                  aria-current={active ? "page" : undefined}
                  className={
                    "tap relative flex min-w-[56px] flex-1 flex-col items-center justify-center gap-1 py-1 font-ui text-[7.5px] font-bold uppercase tracking-[0.12em] transition-all duration-300 " +
                    (active
                      ? "text-primary"
                      : t.highlight 
                        ? "text-primary animate-pulse" 
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
                  <span className="truncate">{t.label}</span>
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
