import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { uz } from "@/i18n";

function sanitizeNext(next: unknown): string {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//")) return "/dashboard";
  return next;
}

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): { next?: string } => {
    const next = sanitizeNext(s.next);
    return next ? { next } : {};
  },
  head: () => ({
    meta: [
      { title: `Kirish — ${uz.brand.name}` },
      {
        name: "description",
        content:
          "Life Order hisobingizga kiring yoki bepul ro'yxatdan o'ting — odat, kundalik va Nadir AI mentor bir joyda.",
      },
      {
        property: "og:title",
        content: `Kirish — ${uz.brand.name}`,
      },
      {
        property: "og:description",
        content:
          "Life Order hisobingizga kiring yoki bepul ro'yxatdan o'ting — odat, kundalik va Nadir AI mentor bir joyda.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const next = search.next ?? "/dashboard";
  const [tab, setTab] = useState<"signin" | "signup">("signup");

  // If already signed in → return to `next` (defaults to /dashboard).
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) window.location.replace(next);
    });
    return () => {
      mounted = false;
    };
  }, [next]);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background text-foreground">
      {/* Calm ambient — single soft halo (amygdala down-regulation) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute left-1/2 top-[18%] h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-60 blur-[110px] halo-drift"
          style={{ background: "radial-gradient(closest-side, hsl(var(--primary) / 0.22), transparent 70%)" }}
        />
        <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="mx-auto max-w-md px-5 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-ui text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Bosh sahifa
        </Link>

        <div className="mt-10 text-center">
          <h1 className="font-serif text-3xl leading-tight tracking-tight">
            {uz.brand.name}
          </h1>
          <p className="mt-2 font-ui text-sm text-muted-foreground">
            {uz.brand.tagline}
          </p>
        </div>

        <div className="glass mt-8 rounded-[var(--radius)] p-6">
          <GoogleButton next={next} />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 font-ui text-xs uppercase tracking-[0.2em] text-muted-foreground">
                yoki email
              </span>
            </div>
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
            <TabsList className="grid w-full grid-cols-2 font-ui">
              <TabsTrigger value="signup">Ro'yxatdan o'tish</TabsTrigger>
              <TabsTrigger value="signin">Kirish</TabsTrigger>
            </TabsList>
            <TabsContent value="signup" className="pt-6">
              <EmailForm mode="signup" next={next} />
            </TabsContent>
            <TabsContent value="signin" className="pt-6">
              <EmailForm mode="signin" next={next} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 text-center font-ui text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <div className="rounded-md border border-border/60 bg-background/30 px-2 py-2">
            <p className="text-foreground/80">Shifrlangan</p>
            <p className="mt-0.5 text-muted-foreground/70 normal-case tracking-normal text-[10px]">TLS + RLS</p>
          </div>
          <div className="rounded-md border border-border/60 bg-background/30 px-2 py-2">
            <p className="text-foreground/80">Reklama yo'q</p>
            <p className="mt-0.5 text-muted-foreground/70 normal-case tracking-normal text-[10px]">sotilmaydi</p>
          </div>
          <div className="rounded-md border border-border/60 bg-background/30 px-2 py-2">
            <p className="text-foreground/80">Bir bosishda</p>
            <p className="mt-0.5 text-muted-foreground/70 normal-case tracking-normal text-[10px]">o'chirasan</p>
          </div>
        </div>

        <p className="mt-4 text-center font-ui text-xs text-muted-foreground">
          Davom etib, Shartlar va Maxfiylik siyosatiga rozilik bildirasiz.
        </p>
      </div>
    </div>
  );
}

function EmailForm({ mode, next }: { mode: "signin" | "signup"; next: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding`,
          },
        });
        if (error) throw error;
        // If auto-confirm is on, session exists. Otherwise try password login
        // (works when email confirmation is disabled server-side).
        const { data: sess } = await supabase.auth.getSession();
        let hasSession = !!sess.session;
        if (!hasSession) {
          const pw = await supabase.auth.signInWithPassword({ email, password });
          hasSession = !!pw.data.session && !pw.error;
        }
        if (hasSession) {
          window.location.replace("/onboarding");
        } else {
          toast.success("Emailingizga tasdiq havolasi yuborildi.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Route through the authenticated gate — it forwards to onboarding
        // or dashboard depending on profile state, avoiding a visible flash.
        window.location.replace(next === "/dashboard" ? "/dashboard" : next);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Xato yuz berdi";
      toast.error(translateAuthError(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="siz@example.com"
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Parol</Label>
          {mode === "signin" && (
            <ForgotPasswordLink email={email} />
          )}
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Kamida 8 belgi"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:text-foreground"
            aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full font-ui font-semibold"
        disabled={loading}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {mode === "signup" ? "Hisob yaratish" : "Kirish"}
      </Button>
    </form>
  );
}

function ForgotPasswordLink({ email }: { email: string }) {
  const [busy, setBusy] = useState(false);
  async function send() {
    if (busy) return;
    if (!email.trim()) {
      toast.error("Avval emailingizni kiriting");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Tiklash havolasi emailga yuborildi.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Xato yuz berdi";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }
  return (
    <button
      type="button"
      onClick={send}
      disabled={busy}
      className="font-ui text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-primary disabled:opacity-50"
    >
      {busy ? "Yuborilmoqda..." : "Parolni unutdim"}
    </button>
  );
}

function GoogleButton({ next }: { next: string }) {
  const [loading, setLoading] = useState(false);
  async function onClick() {
    if (loading) return;
    setLoading(true);
    try {
      // Return to /auth with the same `next` so this page can navigate onward
      // after the session is set.
      const redirectUri =
        next === "/dashboard"
          ? window.location.origin
          : `${window.location.origin}/auth?next=${encodeURIComponent(next)}`;
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: redirectUri,
      });
      if (result.error) {
        toast.error("Google orqali kirib bo'lmadi. Qayta urinib ko'ring.");
        return;
      }
      if (result.redirected) return; // full-page nav
      window.location.replace(next);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Button
      type="button"
      variant="secondary"
      className="w-full font-ui"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <GoogleIcon />
      )}
      Google bilan davom etish
    </Button>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.4 14.7 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.5H12z"
      />
    </svg>
  );
}

function translateAuthError(msg: string): string {
  const s = msg.toLowerCase();
  if (s.includes("invalid login") || s.includes("invalid credentials"))
    return "Email yoki parol mos kelmadi. Qayta tekshirib ko'ring — hech narsa yo'qolmadi.";
  if (s.includes("already registered") || s.includes("user already"))
    return "Bu email allaqachon ro'yxatdan o'tgan. Kirish tabini tanlang yoki parolni tiklang.";
  if (s.includes("email not confirmed"))
    return "Email hali tasdiqlanmagan. Pochtangizni tekshiring — havola yuborilgan.";
  if (s.includes("rate limit") || s.includes("too many"))
    return "Ko'p urinish bo'ldi. Bir daqiqadan keyin qayta urinib ko'ring.";
  if (s.includes("password")) return "Parol kuchsizroq — kamida 8 belgi va turli-tuman kombinatsiya bering.";
  if (s.includes("network") || s.includes("fetch"))
    return "Internet aloqasi uzildi. Ulanish tiklanganda qayta urinib ko'ring.";
  return "Xato yuz berdi. Qayta urinib ko'ring — hech narsa buzilmadi.";
}
