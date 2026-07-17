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
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { to: string; label: string; icon: LucideIcon; hint?: string };

const PRIMARY: Item[] = [
  { to: "/dashboard", label: "Bosh sahifa", icon: Compass, hint: "Bugungi reja" },
  { to: "/habits", label: "Odatlar", icon: ListChecks, hint: "Kunlik odatlar" },
  { to: "/quests", label: "Vazifalar", icon: Target, hint: "Haftalik quest'lar" },
  { to: "/journal", label: "Kundalik", icon: BookText, hint: "Fikrlar" },
  { to: "/mentor", label: "Nadir AI", icon: Sparkles, hint: "AI mentor" },
];

const SECONDARY: Item[] = [
  { to: "/workout", label: "Mashg'ulot", icon: Dumbbell },
  { to: "/diet", label: "Ovqatlanish", icon: Salad },
  { to: "/analytics", label: "Tahlil", icon: BarChart3 },
  { to: "/community", label: "Davra", icon: Users },
  { to: "/leaderboard", label: "Reyting", icon: Trophy },
];

const ACCOUNT: Item[] = [
  { to: "/profile", label: "Profil", icon: User },
  { to: "/settings", label: "Sozlamalar", icon: Settings },
];

function NavItem({ item, active }: { item: Item; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      aria-current={active ? "page" : undefined}
      title={item.hint}
      className={cn(
        "relative flex items-center gap-2.5 rounded-md px-2.5 py-2 font-ui text-[13px] transition-colors",
        active
          ? "bg-primary/10 text-foreground"
          : "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
      )}
    >
      {active && (
        <span
          aria-hidden
          className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.6)]"
        />
      )}
      <Icon
        className={cn(
          "h-[15px] w-[15px] shrink-0",
          active ? "text-primary" : "text-muted-foreground",
        )}
        strokeWidth={active ? 2.2 : 1.7}
      />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function Section({ label, items, pathname }: { label?: string; items: Item[]; pathname: string }) {
  return (
    <div>
      {label && (
        <p className="mb-1.5 px-2.5 font-ui text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/60">
          {label}
        </p>
      )}
      <ul className="space-y-0.5">
        {items.map((item) => {
          const active =
            pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <li key={item.to}>
              <NavItem item={item} active={active} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SidebarNav() {
  const location = useLocation();
  const pathname = location.pathname;
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
        <Section items={PRIMARY} pathname={pathname} />
        <Section label="Ko'proq" items={SECONDARY} pathname={pathname} />
        <Section label="Hisob" items={ACCOUNT} pathname={pathname} />
      </nav>

      <div className="border-t border-border/70 px-4 py-3">
        <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
          Maslahat
        </p>
        <p className="mt-1 font-ui text-[11px] text-muted-foreground">
          Bugun bitta kichik qadam qo'y — streak saqlansin.
        </p>
      </div>
    </aside>
  );
}
