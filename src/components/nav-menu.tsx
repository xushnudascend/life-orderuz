import { Link } from "@tanstack/react-router";
import { 
  Home, 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  Zap, 
  BookOpen, 
  Users,
  LayoutDashboard,
  Dumbbell,
  Target,
  Sparkles,
  Compass
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useT } from "@/i18n/use-t";

export function NavMenu({ onClose }: { onClose?: () => void }) {
  const { t } = useT();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Tizimdan chiqdingiz");
    window.location.href = "/";
  };

  const links = [
    { to: "/dashboard", label: "Bugun", icon: LayoutDashboard },
    { to: "/hub", label: "Ekotizim (Hub)", icon: Compass },
    { to: "/habits", label: "Odatlar", icon: Zap },
    { to: "/community", label: "Davra", icon: Users },
    { to: "/mentor", label: "Nadir AI", icon: BookOpen },
    { to: "/settings", label: "Sozlamalar", icon: Settings },
    { to: "/settings/subscription", label: "Obunani boshqarish", icon: Shield },
  ];

  return (
    <div className="flex flex-col h-full bg-background border-r border-border/40 w-64 p-6 overflow-y-auto relative backdrop-blur-4xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--accent)/0.05,transparent_75%)] pointer-events-none" />
      
      <div className="mb-10 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-[14px] bg-primary text-primary-foreground flex items-center justify-center shadow-glow">
            <Shield className="h-6 w-6" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight">Life Order</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 relative z-10">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to as any}
            onClick={onClose}
            className="flex items-center gap-3 px-2.5 py-2 rounded-lg font-ui text-xs text-text-secondary transition-all hover:bg-white/5 hover:text-text-primary group active:scale-[0.98]"
            activeProps={{ className: "bg-primary text-primary-foreground shadow-glow" }}
          >
            <link.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="font-medium tracking-wide">{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mb-6 relative z-10">
        <Link
          to="/pricing"
          onClick={onClose}
          className="group relative flex items-center gap-3 overflow-hidden rounded-xl bg-primary/10 p-3.5 transition-all hover:bg-primary/20 active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.4)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-ui text-sm font-bold text-primary">{t("nav.upgrade")}</span>
            <span className="font-ui text-[10px] text-muted-foreground uppercase tracking-wider">Cheksiz imkoniyatlar</span>
          </div>
        </Link>
      </div>

      <div className="mt-auto pt-6 border-t border-border relative z-10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-2.5 py-2 rounded-lg font-ui text-xs text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive active:scale-[0.98]"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium">Chiqish</span>
        </button>
      </div>
    </div>
  );
}
