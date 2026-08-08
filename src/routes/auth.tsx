import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { uz } from "@/i18n";

import { track } from "@/lib/analytics";

function sanitizeNext(next: unknown): string {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//"))
    return "/dashboard";
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
      {/* Bitta sokin gradient — ortiqcha harakat yo'q */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 0%, hsl(var(--primary) / 0.12), transparent 72%)",
        }}
      />

      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 py-8">
        <Link
          to="/"
          className="inline-flex w-fit items-center gap-1.5 font-ui text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Bosh sahifa
        </Link>

        <div className="mt-10 animate-fade-in-up text-center">
          <h1 className="font-serif text-[28px] leading-tight tracking-tight md:text-3xl">
            Tizimingni bugun boshla
          </h1>
          <p className="mt-2 font-ui text-sm text-muted-foreground">
            3 daqiqalik tashxis — keyin birinchi qadam seni kutadi.
            <br />
            <span className="mt-1 block text-[11px] opacity-80">
              Ma'lumotlaringiz shifrlangan holda saqlanadi (TLS + RLS)
            </span>
          </p>
        </div>

        <div
          className="mt-8 animate-fade-in-up rounded-2xl border border-border bg-card/70 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm"
          style={{ animationDelay: "80ms" }}
        >
          <div className="space-y-2.5">
            <OAuthButton provider="google" label="Google bilan davom etish" next={next} />
            <OAuthButton provider="apple" label="Apple bilan davom etish" next={next} />
          </div>

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

        <Link
          to="/privacy"
          className="group mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-border/70 px-3.5 py-1.5 font-ui text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Maxfiylik va xavfsizlik
        </Link>
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
        const { data: up, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/onboarding` },
        });
        if (error) throw error;
        // Auto-confirm on → signUp already returns session. Skip extra roundtrips.
        if (up.session) {
          track("signup", { method: "email" });
          window.location.replace("/onboarding");
          return;
        }
        const pw = await supabase.auth.signInWithPassword({ email, password });
        if (pw.data.session && !pw.error) {
          track("signup", { method: "email" });
          window.location.replace("/onboarding");
        } else {
          toast.success("Emailingizga tasdiq havolasi yuborildi.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        track("login", { method: "email" });
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
          {mode === "signin" && <ForgotPasswordLink email={email} />}
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
          {mode === "signup" && password.length > 0 && (
            <div className="mt-1 flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 w-full rounded-full ${
                    i <= Math.min(4, Math.floor(password.length / 3))
                      ? "bg-primary"
                      : "bg-border"
                  }`}
                />
              ))}
              <span className="ml-2 font-ui text-[10px] uppercase text-muted-foreground">
                {password.length < 8 ? "Kuchsiz" : password.length < 12 ? "O'rtacha" : "Kuchli"}
              </span>
            </div>
          )}
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
      <Button type="submit" className="w-full font-ui font-semibold" disabled={loading}>
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

function OAuthButton({
  provider,
  label,
  next,
}: {
  provider: "google" | "apple";
  label: string;
  next: string;
}) {
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
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: redirectUri,
      });
      if (result.error) {
        toast.error(`${label} amalga oshmadi. Qayta urinib ko'ring yoki email orqali davom eting.`);
        return;
      }
      if (result.redirected) return; // full-page nav
      track("login", { method: provider });
      window.location.replace(next);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Button
      type="button"
      variant="secondary"
      className="tap w-full justify-center rounded-xl font-ui transition-transform duration-200 active:scale-[0.99]"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : provider === "google" ? (
        <GoogleIcon />
      ) : (
        <AppleIcon />
      )}
      {label}
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

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4 fill-current" aria-hidden>
      <path d="M16.36 12.72c.02 2.6 2.28 3.47 2.3 3.48-.02.06-.36 1.24-1.19 2.45-.72 1.05-1.47 2.1-2.65 2.12-1.16.02-1.53-.69-2.85-.69-1.32 0-1.73.67-2.83.71-1.14.04-2-1.13-2.73-2.18-1.49-2.15-2.63-6.08-1.1-8.73.76-1.32 2.12-2.15 3.59-2.17 1.12-.02 2.17.75 2.85.75.68 0 1.96-.93 3.3-.79.56.02 2.14.23 3.15 1.71-.08.05-1.88 1.1-1.86 3.34M14.2 4.6c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.55 1.31-.56.65-1.05 1.69-.92 2.68.97.08 1.96-.49 2.57-1.23" />
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
  if (s.includes("password"))
    return "Parol kuchsizroq — kamida 8 belgi va turli-tuman kombinatsiya bering.";
  if (s.includes("network") || s.includes("fetch"))
    return "Internet aloqasi uzildi. Ulanish tiklanganda qayta urinib ko'ring.";
  return "Xato yuz berdi. Qayta urinib ko'ring — hech narsa buzilmadi.";
}
