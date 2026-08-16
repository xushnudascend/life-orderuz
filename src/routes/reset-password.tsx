import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { uz } from "@/i18n";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: `Parolni tiklash — Life Order` },
      { name: "description", content: "Life Order — hisob parolini tiklash" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [recovery, setRecovery] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setRecovery(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setRecovery(Boolean(data.session));
    });
  }, []);

  async function update(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (pwd.length < 8) return setErr("Parol kamida 8 belgi bo'lishi kerak.");
    if (!/[A-Za-z]/.test(pwd) || !/[0-9]/.test(pwd))
      return setErr("Parolda harf va raqam bo'lsin.");
    if (pwd !== confirm) return setErr("Parollar mos emas.");
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pwd });
      if (error) throw error;
      toast.success("Parol yangilandi. Qayta kiring.");
      await supabase.auth.signOut();
      navigate({ to: "/auth", replace: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Xatolik yuz berdi";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-[var(--radius)] border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-primary" />
          <h1 className="font-serif text-2xl">Parolni tiklash</h1>
        </div>
        {recovery === null ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : !recovery ? (
          <>
            <p className="text-sm text-muted-foreground">
              Tiklash havolasi noto'g'ri yoki muddati o'tgan. Iltimos, qaytadan so'rang.
            </p>
            <Button asChild className="w-full">
              <Link to="/auth">Kirish sahifasiga qaytish</Link>
            </Button>
          </>
        ) : (
          <form onSubmit={update} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="pwd">Yangi parol</Label>
              <div className="relative">
                <Input
                  id="pwd"
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="Kamida 8 belgi, harf + raqam"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Parolni yashirish" : "Parolni ko'rsatish"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm">Parolni tasdiqlang</Label>
              <Input
                id="confirm"
                type={show ? "text" : "password"}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            {err && <p className="text-xs text-destructive">{err}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Parolni yangilash
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
