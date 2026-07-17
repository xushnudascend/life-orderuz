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
  validateSearch: (s: Record<string, unknown>) => ({
    next: sanitizeNext(s.next),
  }),
  head: () => ({
    meta: [
      { title: `Kirish — ${uz.brand.name}` },
      { name: "description", content: "Life Order — kirish va ro'yxatdan o'tish" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { next } = Route.useSearch();
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
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Animated ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-primary/20 blur-3xl lo-float-a" />
        <div className="absolute top-1/3 -right-32 h-[380px] w-[380px] rounded-full bg-primary/10 blur-3xl lo-float-b" />
        <div className="absolute -bottom-32 left-1/3 h-[360px] w-[360px] rounded-full bg-primary/15 blur-3xl lo-float-c" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:22px_22px]" />
      </div>
      <style>{`
        @keyframes lo-float-a { 0%,100% { transform: translate(0,0) scale(1);} 50% { transform: translate(40px,30px) scale(1.08);} }
        @keyframes lo-float-b { 0%,100% { transform: translate(0,0) scale(1);} 50% { transform: translate(-30px,20px) scale(1.05);} }
        @keyframes lo-float-c { 0%,100% { transform: translate(0,0) scale(1);} 50% { transform: translate(20px,-30px) scale(1.1);} }
        .lo-float-a { animation: lo-float-a 14s ease-in-out infinite; }
        .lo-float-b { animation: lo-float-b 18s ease-in-out infinite; }
        .lo-float-c { animation: lo-float-c 22s ease-in-out infinite; }
      `}</style>

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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 font-ui text-xs uppercase tracking-[0.2em] text-muted-foreground">
                yoki
              </span>
            </div>
          </div>

          <GoogleButton next={next} />
        </div>

        <p className="mt-6 text-center font-ui text-xs text-muted-foreground">
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
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          // Yangi hisob — to'g'ridan-to'g'ri onboarding'ga
          window.location.replace("/onboarding");
        } else {
          toast.success("Ro'yxatdan o'tildi. Endi kirishingiz mumkin.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.replace(next);
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
        <Label htmlFor="password">Parol</Label>
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
  if (s.includes("invalid login")) return "Email yoki parol noto'g'ri.";
  if (s.includes("already registered") || s.includes("user already"))
    return "Bu email allaqachon ro'yxatdan o'tgan. Kirish tabini tanlang.";
  if (s.includes("password")) return "Parol yetarli darajada kuchli emas.";
  if (s.includes("network") || s.includes("fetch"))
    return "Internet aloqasi uzildi. Qayta urinib ko'ring.";
  return msg;
}
