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
    { to: "/mentor", label: "Nadir AI", icon: BookOpen },
    { to: "/profile", label: "Profil", icon: User },
    { to: "/settings", label: "Sozlamalar", icon: Settings },
    { to: "/settings/subscription", label: "Obunani boshqarish", icon: Shield },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0a0502] border-r border-border/40 w-72 p-8 overflow-y-auto relative backdrop-blur-4xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.15),transparent_75%)] pointer-events-none" />
      
      <div className="mb-14 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-5">
          <div className="h-12 w-12 rounded-[20px] bg-primary text-primary-foreground flex items-center justify-center shadow-[0_0_25px_hsl(var(--primary)/0.5)]">
            <Shield className="h-7 w-7" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight">Life Order</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 relative z-10">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to as any}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-ui text-sm text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary group active:scale-[0.98]"
            activeProps={{ className: "bg-primary/15 text-primary shadow-[0_0_20px_-10px_hsl(var(--primary)/0.4)]" }}
          >
            <link.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="font-medium tracking-wide">{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-border relative z-10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl font-ui text-sm text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive active:scale-[0.98]"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium">Chiqish</span>
        </button>
      </div>
    </div>
  );
}
