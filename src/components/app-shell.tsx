import { Link, useLocation } from "@tanstack/react-router";
import { Home, ListChecks, BookText, Sparkles, User } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { uz } from "@/i18n";
import { BottomNav } from "@/components/bottom-nav";
import { ARCHETYPES, type Archetype } from "@/lib/nervous";

const NAV = [
  { to: "/dashboard", label: "Bugun", icon: Home },
  { to: "/habits", label: "Odatlar", icon: ListChecks },
  { to: "/mentor", label: "Nadir", icon: Sparkles },
  { to: "/journal", label: "Kundalik", icon: BookText },
  { to: "/profile", label: "Profil", icon: User },
] as const;

export function AppShell({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const location = useLocation();
  const [archetype, setArchetype] = useState<Archetype | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { data } = await supabase
        .from("profiles")
        .select("archetype")
        .eq("id", userData.user.id)
        .maybeSingle();
      if (!alive) return;
      const key = (data as { archetype?: string } | null)?.archetype;
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

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-10">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link to="/" className="font-serif text-lg tracking-tight transition-opacity hover:opacity-80">
            {uz.brand.name}
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Asosiy">
            {NAV.map((n) => {
              const active =
                location.pathname === n.to ||
                location.pathname.startsWith(n.to + "/");
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={
                    "relative rounded-md px-3 py-1.5 font-ui text-xs uppercase tracking-[0.2em] transition-colors " +
                    (active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground")
                  }
                >
                  {n.label}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-x-3 -bottom-[17px] h-[2px] rounded-full bg-primary"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            {title && (
              <span className="hidden font-ui text-xs uppercase tracking-[0.24em] text-muted-foreground lg:inline">
                {title}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="font-ui text-muted-foreground hover:text-foreground"
              onClick={signOut}
            >
              Chiqish
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 md:py-10 animate-route-in">{children}</main>

      <BottomNav recommendedTab={archetype?.preferredTab} />
    </div>
  );
}
