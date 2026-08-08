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
  Target
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function NavMenu({ onClose }: { onClose?: () => void }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Tizimdan chiqdingiz");
    window.location.href = "/";
  };

  const links = [
    { to: "/dashboard", label: "Bosh sahifa", icon: LayoutDashboard },
    { to: "/habits", label: "Odatlar", icon: Zap },
    { to: "/workout", label: "Tana", icon: Dumbbell },
    { to: "/quests", label: "Vazifalar", icon: Target },
    { to: "/mentor", label: "Nadir AI", icon: BookOpen },
    { to: "/community", label: "Davra", icon: Users },
    { to: "/profile", label: "Profil", icon: User },
    { to: "/settings", label: "Sozlamalar", icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full bg-card border-r border-border w-64 p-6 overflow-y-auto">
      <div className="mb-8 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <span className="font-serif text-xl font-bold tracking-tight">Life Order</span>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to as any}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-ui text-sm text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary group"
            activeProps={{ className: "bg-primary/10 text-primary" }}
          >
            <link.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl font-ui text-sm text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Chiqish
        </button>
      </div>
    </div>
  );
}
