import { Link, useLocation } from "@tanstack/react-router";
import { Home, ListChecks, BookText, Sparkles, User } from "lucide-react";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { uz } from "@/i18n";

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

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in pb-24">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5">
          <Link to="/" className="font-serif text-lg">
            {uz.brand.name}
          </Link>
          <div className="flex items-center gap-2">
            {title && (
              <span className="hidden font-ui text-xs uppercase tracking-[0.24em] text-muted-foreground sm:inline">
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

      <main className="mx-auto max-w-4xl px-5 py-10">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-stretch justify-around px-2">
          {NAV.map((item) => {
            const active =
              location.pathname === item.to ||
              location.pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  "flex flex-1 flex-col items-center gap-1 py-3 font-ui text-[11px] uppercase tracking-[0.18em] transition-colors " +
                  (active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                <Icon className="h-5 w-5" strokeWidth={1.6} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
