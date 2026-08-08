import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/bottom-nav";
import { NavMenu } from "@/components/nav-menu";
import { CommandBar } from "@/components/command-bar";
import { QuickLogFab } from "@/components/quick-log-fab";
import { SkipLink } from "@/components/skip-link";
import { ErrorBoundary } from "@/components/error-boundary";
import { NadirProvider } from "@/lib/nadir-context";
import { NadirDrawer } from "@/components/nadir-drawer";
import { applyArchetypeTheme } from "@/lib/archetype-theme";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ARCHETYPES, type Archetype } from "@/lib/nervous";
import { loadReminderPrefs, scheduleDailyReminder } from "@/lib/reminders";

export function AppShell({ title, children }: { title?: string; children: ReactNode }) {
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [archetypeId, setArchetypeId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { data } = await supabase
        .from("profiles")
        .select("archetype, display_name")
        .eq("id", userData.user.id)
        .maybeSingle();
      if (!alive) return;
      const key = (data as { archetype?: string } | null)?.archetype;
      const dn = (data as { display_name?: string } | null)?.display_name ?? null;
      setName(dn);
      setArchetypeId(key ?? null);
      if (key && key in ARCHETYPES) setArchetype(ARCHETYPES[key as Archetype["id"]]);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    applyArchetypeTheme(archetypeId);
  }, [archetypeId]);

  // Kunlik eslatmani rejalashtirish (qurilma ichida).
  useEffect(() => {
    const prefs = loadReminderPrefs();
    if (!prefs) return;
    return scheduleDailyReminder(prefs);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const initial = (name?.trim()?.[0] ?? "L").toUpperCase();

  return (
    <NadirProvider>
      <div className="min-h-dvh bg-[#0a0502] text-foreground relative">
        {/* Girih ornament + Premium dark background with subtle warmth */}
        <div className="pointer-events-none absolute inset-0 -z-10">
        </div>
        <SkipLink />
        <div style={{ paddingBottom: "calc(6rem + env(safe-area-inset-bottom))" }}>
          {/* Topbar — scroll'da yengil soya, blur past-perf'da o'chadi */}
          <header
            className={
              "sticky top-0 z-20 border-b bg-background/90 supports-[backdrop-filter]:bg-background/70 backdrop-blur transition-[border-color,box-shadow] duration-300 " +
              (scrolled
                ? "border-border shadow-[0_6px_20px_-14px_hsl(240_30%_0%/0.6)]"
                : "border-border/40")
            }
            role="banner"
          >
            <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6">
              <Link
                to="/"
                className="flex items-center gap-2 font-serif text-base font-semibold tracking-tight"
                aria-label="Life Order — bosh sahifa"
              >
                Life Order
              </Link>
              <div className="hidden min-w-0 flex-1 items-center justify-center gap-3 md:flex">
                <CommandBar />
              </div>

              <div className="flex items-center gap-3">
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card transition-all hover:border-primary/50">
                      <Menu className="h-4 w-4" />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 border-none w-64">
                    <NavMenu />
                  </SheetContent>
                </Sheet>
                <div className="flex items-center gap-2">
                  <Link
                    to="/profile"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card font-ui text-sm font-semibold text-foreground transition-all hover:border-primary/50 hover:shadow-[0_0_12px_hsl(var(--primary)/0.2)]"
                    aria-label={name ? `Profil — ${name}` : "Profil"}
                  >
                    {initial}
                  </Link>
                </div>
              </div>
            </div>
          </header>

          <main
            id="main-content"
            tabIndex={-1}
            className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 animate-route-in focus:outline-none"
          >
            <ErrorBoundary boundary="app_shell_main">{children}</ErrorBoundary>
          </main>
        </div>

        <BottomNav recommendedTab={archetype?.preferredTab} />
        <QuickLogFab />
        <NadirDrawer />
      </div>
    </NadirProvider>
  );
}
