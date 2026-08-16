import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Loader2, 
  ShieldCheck, 
  Sparkles, 
  Lock,
  Zap,
  Shield
} from "lucide-react";
import { uz } from "@/i18n";
import { useT } from "@/i18n/use-t";
import { track } from "@/lib/analytics";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

const CANONICAL_URL = "https://life-orderuz.lovable.app/auth";

function sanitizeNext(next: unknown): string {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//"))
    return "/dashboard";
  return next;
}

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): { next?: string; mode?: "signin" | "signup" } => {
    const next = sanitizeNext(s.next);
    const mode = s.mode === "signin" || s.mode === "signup" ? s.mode : undefined;
    return { 
      next: next || "/dashboard",
      mode 
    };
  },
  head: () => ({
    meta: [
      { title: `Kirish — Life Order` },
      {
        name: "description",
        content:
          "Life Order hisobingizga kiring yoki bepul ro'yxatdan o'ting — odat, kundalik va Nadir AI mentor bir joyda.",
      },
      {
        property: "og:title",
        content: `Kirish — Life Order`,
      },
      {
        property: "og:description",
        content:
          "Life Order hisobingizga kiring yoki bepul ro'yxatdan o'ting — odat, kundalik va Nadir AI mentor bir joyda.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:image", content: "https://life-orderuz.lovable.app/og/auth.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://life-orderuz.lovable.app/og/auth.jpg" },
      { property: "og:url", content: CANONICAL_URL },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: CANONICAL_URL }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const { t } = useT();
  const next = search.next ?? "/dashboard";
  const [tab, setTab] = useState<"signin" | "signup">(search.mode ?? "signup");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) {
        const isNew = data.session.user.created_at === data.session.user.last_sign_in_at;
        navigate({ to: isNew ? "/onboarding" : next });
      }
    });
    return () => {
      mounted = false;
    };
  }, [next, navigate]);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background text-foreground flex items-center justify-center p-4 selection:bg-primary/20">
      {/* Premium Orbs */}
      <div className="absolute top-[-10%] right-[-10%] h-[600px] w-[600px] animate-orb-float rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] animate-orb-float-delayed rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        <Reveal delay={100}>
          <div className="mb-10 flex flex-col items-center text-center">
            <Link to="/" className="group mb-8 flex items-center gap-3 transition-transform hover:scale-105 active:scale-95">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-premium transition-shadow group-hover:shadow-[0_0_24px_hsl(var(--primary)/0.55)]">
                <span className="font-serif text-xl font-bold leading-none">L</span>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight">Life Order</span>
            </Link>
            
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-primary shadow-[0_0_20px_hsl(var(--primary)/0.15)] backdrop-blur-md">
              <Sparkles className="h-3 w-3" />
              ELITE PROTOCOL ACCESS
            </div>
            
            <h1 className="font-serif text-[44px] leading-[0.9] tracking-tighter md:text-[52px]">
              {t("auth.title")}
            </h1>
            <p className="mt-6 font-ui text-lg leading-relaxed text-muted-foreground/80 text-pretty">
              {t("auth.subtitle")}
            </p>
          </div>
        </Reveal>

        <Reveal delay={250}>
          <div className="rounded-[32px] border border-border bg-card/50 p-8 shadow-premium backdrop-blur-2xl md:p-10">
            <div className="mb-8 space-y-4">
              <OAuthButton provider="google" label={t("auth.google")} next={next} />
              <div className="grid grid-cols-2 gap-4">
                <OAuthButton provider="apple" label="Apple" next={next} />
                <OAuthButton provider="microsoft" label="Microsoft" next={next} />
              </div>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-border/60"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card/50 px-4 font-ui text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60">
                  {t("auth.or")}
                </span>
              </div>
            </div>

            <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-muted/40 p-1 mb-8">
                <TabsTrigger value="signup" className="rounded-xl font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  {t("auth.signUp")}
                </TabsTrigger>
                <TabsTrigger value="signin" className="rounded-xl font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  {t("auth.signIn")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="signup">
                <EmailForm mode="signup" next={next} />
              </TabsContent>
              <TabsContent value="signin">
                <EmailForm mode="signin" next={next} />
              </TabsContent>
            </Tabs>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <div className="mt-10 text-center">
            <Link
              to="/privacy"
              className="font-ui text-xs font-medium text-muted-foreground/60 transition-colors hover:text-primary"
            >
              {t("auth.privacy")}
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Feature Pills */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-6 opacity-30 grayscale transition-all hover:opacity-100 hover:grayscale-0 pointer-events-none sm:gap-12">
        <div className="flex items-center gap-2 font-ui text-[10px] font-bold uppercase tracking-widest">
          <Shield className="h-4 w-4" />
          Secure
        </div>
        <div className="flex items-center gap-2 font-ui text-[10px] font-bold uppercase tracking-widest">
          <Zap className="h-4 w-4" />
          Pro Performance
        </div>
      </div>
    </div>
  );
}

function EmailForm({ mode, next }: { mode: "signin" | "signup"; next: string }) {
  const { t } = useT();
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
      toast.error(translateAuthError(msg, t));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="font-ui text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
          {t("auth.email")}
        </Label>
        <Input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className="h-12 rounded-2xl bg-muted/20 border-border/60 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between ml-1">
          <Label htmlFor="password" className="font-ui text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {t("auth.password")}
          </Label>
          {mode === "signin" && <ForgotPasswordLink email={email} t={t} />}
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
            className="h-12 rounded-2xl bg-muted/20 border-border/60 pr-10 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
            aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      
      <Button
        type="submit"
        disabled={loading}
        size="lg"
        className="mt-8 w-full rounded-full font-bold shadow-premium transition-all hover:scale-[1.01] active:scale-[0.99]"
      >
        {loading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          mode === "signup" ? t("auth.signUp") : t("auth.signIn")
        )}
      </Button>
    </form>
  );
}

function ForgotPasswordLink({ email, t }: { email: string; t: any }) {
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
      {busy ? "..." : t("auth.forgot")}
    </button>
  );
}

function OAuthButton({
  provider,
  label,
  next,
}: {
  provider: "google" | "apple" | "microsoft";
  label: string;
  next: string;
}) {
  const [loading, setLoading] = useState(false);
  async function onClick() {
    if (loading) return;
    setLoading(true);
    try {
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
      if (result.redirected) return;
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
      className="tap w-full justify-center rounded-2xl h-12 font-bold transition-transform duration-200 active:scale-[0.99] border border-border/60 bg-muted/20"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : provider === "google" ? (
        <GoogleIcon />
      ) : provider === "apple" ? (
        <AppleIcon />
      ) : (
        <MicrosoftIcon />
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

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 23 23" className="mr-2 h-4 w-4" aria-hidden>
      <path fill="#f3f3f3" d="M0 0h11v11H0z" />
      <path fill="#f3f3f3" d="M12 0h11v11H12z" />
      <path fill="#f3f3f3" d="M0 12h11v11H0z" />
      <path fill="#f3f3f3" d="M12 12h11v11H12z" />
    </svg>
  );
}

function translateAuthError(msg: string, t: any): string {
  const s = msg.toLowerCase();
  
  if (s.includes("invalid login") || s.includes("invalid credentials"))
    return t("errors.auth.invalid");
  if (s.includes("already registered") || s.includes("user already"))
    return t("errors.auth.exists");
  if (s.includes("email not confirmed"))
    return t("errors.auth.confirm");
  if (s.includes("rate limit") || s.includes("too many"))
    return t("errors.auth.rate");
  if (s.includes("password"))
    return t("errors.auth.weak");
  if (s.includes("network") || s.includes("fetch"))
    return t("errors.auth.network");
  
  return t("errors.auth.generic");
}