import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  Menu,
  type LucideIcon,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type Item = { to: string; label: string; icon: LucideIcon; hint?: string };

const PRIMARY: Item[] = [
  { to: "/dashboard", label: "Bosh sahifa", icon: Compass, hint: "Bugungi reja" },
  { to: "/roadmap", label: "Yo'l xarita", icon: Target, hint: "Reclaim → Rebuild → Rise" },
  { to: "/habits", label: "Odatlar", icon: ListChecks, hint: "Kunlik odatlar" },
  { to: "/quests", label: "Vazifalar", icon: Trophy, hint: "Haftalik questlar" },
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

function NavItem({ item, active, onClick }: { item: Item; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 font-ui text-sm transition-all duration-200",
        active
          ? "bg-primary/10 text-foreground shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.2)]"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
      )}
    >
      {active && (
        <span aria-hidden className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-primary" />
      )}
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
        )}
        strokeWidth={active ? 2.2 : 1.7}
      />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function Group({
  label,
  items,
  pathname,
  onNavigate,
}: {
  label: string;
  items: Item[];
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <div>
      <p className="mb-1.5 px-3 font-ui text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/60">
        {label}
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.to}>
            <NavItem
              item={item}
              active={pathname === item.to || pathname.startsWith(item.to + "/")}
              onClick={onNavigate}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Yagona navigatsiya — topbar'dagi 3 chiziqcha orqali ochiladi. */
export function NavMenu() {
  const location = useLocation();
  const pathname = location.pathname;
  const [open, setOpen] = useState(false);

  // Route almashsa panel yopiladi
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="tap grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        aria-label="Menyuni ochish"
      >
        <Menu className="h-4 w-4" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[19rem] border-border bg-background p-0">
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-5">
          <span
            aria-hidden
            className="grid h-7 w-7 place-items-center rounded-[10px] bg-primary text-primary-foreground"
          >
            <span className="font-serif text-[14px] font-bold leading-none">L</span>
          </span>
          <span className="font-serif text-[15px] font-semibold tracking-tight">
            Life<span className="text-primary">.</span>Order
          </span>
        </div>

        <nav className="space-y-6 overflow-y-auto px-3 py-5" aria-label="Asosiy navigatsiya">
          <Group label="Asosiy" items={PRIMARY} pathname={pathname} onNavigate={close} />
          <Group
            label="Sog'liq va o'sish"
            items={SECONDARY}
            pathname={pathname}
            onNavigate={close}
          />
          <Group label="Hisob" items={ACCOUNT} pathname={pathname} onNavigate={close} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
