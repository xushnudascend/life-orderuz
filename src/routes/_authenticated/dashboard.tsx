import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { uz } from "@/i18n";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: `Dashboard — ${uz.brand.name}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

type Profile = {
  display_name: string | null;
  plan_length_days: number | null;
  onboarding_completed_at: string | null;
};

function Dashboard() {
  const { userId } = Route.useRouteContext();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let alive = true;
    supabase
      .from("profiles")
      .select("display_name, plan_length_days, onboarding_completed_at")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (alive) setProfile((data as Profile | null) ?? null);
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
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5">
          <Link to="/" className="font-serif text-lg">
            {uz.brand.name}
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="font-ui text-muted-foreground hover:text-foreground"
            onClick={signOut}
          >
            Chiqish
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-16">
        <p className="font-ui text-xs uppercase tracking-[0.28em] text-primary">
          Bugungi kun
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight">
          Salom, {profile?.display_name ?? "do'st"}.
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
          Tashxis tugadi. {profile?.plan_length_days ?? 7} kunlik yo'l ochildi.
          Dashboard'ning to'liq versiyasi — kunlik uchta qadam, HubToday,
          HubAdvisor — keyingi bosqichda ochiladi.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { title: "Odatlar", body: "Kunlik streak va Discipline Score" },
            { title: "Nadir", body: "Halol AI mentor bilan muloqot" },
            { title: "Statistika", body: "Haftalik hisobot va grafik" },
          ].map((c) => (
            <div
              key={c.title}
              className="glass rounded-[var(--radius)] p-6 opacity-70"
            >
              <h3 className="font-serif text-xl">{c.title}</h3>
              <p className="mt-2 font-ui text-sm text-muted-foreground">
                {c.body}
              </p>
              <p className="mt-4 font-ui text-xs uppercase tracking-[0.22em] text-muted-foreground/70">
                Tez orada
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
