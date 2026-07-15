import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { uz } from "@/i18n";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: `Profil — ${uz.brand.name}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

type Profile = {
  display_name: string | null;
  plan_length_days: number | null;
  onboarding_completed_at: string | null;
};
type Stats = {
  total_xp: number;
  level: number;
} | null;
type Streak = {
  current_days: number;
  longest_days: number;
} | null;

function ProfilePage() {
  const { userId } = Route.useRouteContext();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats>(null);
  const [streak, setStreak] = useState<Streak>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.all([
      supabase
        .from("profiles")
        .select("display_name, plan_length_days, onboarding_completed_at")
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("user_stats")
        .select("total_xp, level")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("streaks")
        .select("current_days, longest_days")
        .eq("user_id", userId)
        .maybeSingle(),
    ]).then(([p, s, st]) => {
      if (!alive) return;
      setProfile((p.data as Profile | null) ?? null);
      setStats((s.data as Stats) ?? null);
      setStreak((st.data as Streak) ?? null);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [userId]);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }

  return (
    <AppShell title="Profil">
      <p className="font-ui text-xs uppercase tracking-[0.28em] text-primary">
        Sen
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
        {profile?.display_name ?? "Foydalanuvchi"}
      </h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat label="Daraja" value={stats?.level ?? 1} />
            <Stat label="Umumiy XP" value={stats?.total_xp ?? 0} />
            <Stat
              label="Joriy streak"
              value={`${streak?.current_days ?? 0} kun`}
            />
          </div>

          <div className="mt-10 space-y-3 rounded-[var(--radius)] border border-border p-5">
            <Row label="Reja" value={`${profile?.plan_length_days ?? 7} kun`} />
            <Row
              label="Onboarding"
              value={
                profile?.onboarding_completed_at
                  ? new Date(profile.onboarding_completed_at).toLocaleDateString(
                      "uz-UZ",
                    )
                  : "—"
              }
            />
            <Row
              label="Eng uzun streak"
              value={`${streak?.longest_days ?? 0} kun`}
            />
          </div>
        </>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link to="/dashboard">Bugungi kunga qaytish</Link>
        </Button>
        <Button variant="ghost" onClick={signOut}>
          Chiqish
        </Button>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[var(--radius)] border border-border p-5">
      <p className="font-ui text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between font-ui text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
