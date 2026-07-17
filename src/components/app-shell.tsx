import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/bottom-nav";
import { SidebarNav } from "@/components/sidebar-nav";
import { CommandBar } from "@/components/command-bar";
import { SkipLink } from "@/components/skip-link";
import { ErrorBoundary } from "@/components/error-boundary";
import { ARCHETYPES, type Archetype } from "@/lib/nervous";
import { LogOut } from "lucide-react";

export function AppShell({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [name, setName] = useState<string | null>(null);

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
      if (key && key in ARCHETYPES) setArchetype(ARCHETYPES[key as Archetype["id"]]);
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }

  const initial = (name?.trim()?.[0] ?? "L").toUpperCase();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SidebarNav />

      <div
        className="md:pl-[var(--sidebar-width)]"
        style={{ paddingBottom: "calc(6rem + env(safe-area-inset-bottom))" }}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6">
            <Link
              to="/"
              className="font-serif text-base font-semibold tracking-tight md:hidden"
            >
              Life<span className="text-primary">.</span>Order
            </Link>
            <div className="hidden min-w-0 items-center gap-3 md:flex">
              {title && (
                <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  {title}
                </p>
              )}
              <CommandBar />
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card font-ui text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                aria-label="Profil"
              >
                {initial}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="font-ui text-muted-foreground hover:text-foreground"
                aria-label="Chiqish"
              >
                <LogOut className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Chiqish</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 animate-route-in">
          {children}
        </main>
      </div>

      <BottomNav recommendedTab={archetype?.preferredTab} />
    </div>
  );
}
