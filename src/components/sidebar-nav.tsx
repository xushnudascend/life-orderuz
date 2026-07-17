import { Link, useLocation } from "@tanstack/react-router";
import {
  Compass,
  ListChecks,
  Sparkles,
  BookText,
  Trophy,
  Target,
  Dumbbell,
  Salad,
  Users,
  BarChart3,
  User,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const GROUPS = [
  {
    label: "Bosh",
    items: [
      { to: "/dashboard", label: "Bugun", icon: Compass },
      { to: "/analytics", label: "Tahlil", icon: BarChart3 },
    ],
  },
  {
    label: "Tizim",
    items: [
      { to: "/habits", label: "Odatlar", icon: ListChecks },
      { to: "/quests", label: "Vazifalar", icon: Target },
      { to: "/journal", label: "Kundalik", icon: BookText },
    ],
  },
  {
    label: "Tana",
    items: [
      { to: "/workout", label: "Mashg'ulot", icon: Dumbbell },
      { to: "/diet", label: "Ovqatlanish", icon: Salad },
    ],
  },
  {
    label: "Ijtimoiy",
    items: [
      { to: "/mentor", label: "Nadir AI", icon: Sparkles },
      { to: "/community", label: "Davra", icon: Users },
      { to: "/leaderboard", label: "Reyting", icon: Trophy },
    ],
  },
  {
    label: "Men",
    items: [
      { to: "/profile", label: "Profil", icon: User },
      { to: "/settings", label: "Sozlamalar", icon: Settings },
    ],
  },
] as const;

export function SidebarNav() {
  const location = useLocation();
  return (
    <aside
      className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:z-30 md:border-r md:border-border/70 md:bg-card/40 md:backdrop-blur"
      style={{ width: "var(--sidebar-width)" }}
      aria-label="Yon navigatsiya"
    >
      <div className="flex h-14 items-center border-b border-border/70 px-4">
        <Link
          to="/"
          className="font-serif text-base font-semibold tracking-tight"
        >
          Life<span className="text-primary">.</span>Order
        </Link>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {GROUPS.map((g) => (
          <div key={g.label}>
            <p className="mb-1.5 px-2 font-ui text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70">
              {g.label}
            </p>
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const active =
                  location.pathname === item.to ||
                  location.pathname.startsWith(item.to + "/");
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 font-ui text-[13px] transition-colors",
                        active
                          ? "bg-primary/10 text-foreground"
                          : "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
                      )}
                    >
                      {active && (
                        <span
                          aria-hidden
                          className="absolute inset-y-1 left-0 w-[3px] rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.6)]"
                        />
                      )}
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          active ? "text-primary" : "text-muted-foreground",
                        )}
                        strokeWidth={active ? 2.2 : 1.7}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
