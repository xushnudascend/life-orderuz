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
  { to: "/roadmap", label: "Yo'l xarita", icon: Target, hint: "Reclaim → Rebuild → Rise" },
  { to: "/habits", label: "Odatlar", icon: ListChecks, hint: "Kunlik odatlar" },
  { to: "/quests", label: "Vazifalar", icon: Trophy, hint: "Haftalik quest'lar" },
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
        "group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 font-ui text-[13px] transition-all duration-200",
        active
          ? "bg-primary/10 text-foreground shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.18)]"
          : "text-muted-foreground hover:bg-accent/40 hover:text-foreground hover:translate-x-[1px]",
      )}
    >
      {active && (
        <span
          aria-hidden
          className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.7)]"
        />
      )}
      <Icon
        className={cn(
          "h-[15px] w-[15px] shrink-0 transition-colors",
          active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
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
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
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
      className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:z-30 md:border-r md:border-border/60 md:bg-gradient-to-b md:from-card/50 md:to-card/20 md:backdrop-blur-md"
      style={{ width: "var(--sidebar-width)" }}
      aria-label="Yon navigatsiya"
    >
      <div className="flex h-14 items-center gap-2.5 border-b border-border/60 px-4">
        <span
          aria-hidden
          className="grid h-7 w-7 place-items-center rounded-[10px] bg-primary text-primary-foreground shadow-[0_0_16px_hsl(var(--primary)/0.4)]"
        >
          <span className="font-serif text-[14px] font-bold leading-none">L</span>
        </span>
        <Link
          to="/"
          className="font-serif text-[15px] font-semibold tracking-tight transition-colors hover:text-primary"
        >
          Life<span className="text-primary">.</span>Order
        </Link>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        <Section label="Asosiy" items={PRIMARY} pathname={pathname} />
        <Section label="Sog'liq va o'sish" items={SECONDARY} pathname={pathname} />
        <Section label="Hisob" items={ACCOUNT} pathname={pathname} />
      </nav>

      <div className="border-t border-border/60 bg-background/30 px-4 py-3">
        <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.22em] text-primary/80">
          Bugungi eslatma
        </p>
        <p className="mt-1 font-ui text-[11px] leading-relaxed text-muted-foreground">
          Kichik qadam — davomiylik. Bugun bittasi kifoya.
        </p>
      </div>
    </aside>
  );
}
