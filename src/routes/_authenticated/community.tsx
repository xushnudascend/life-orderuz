import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { PageHero } from "@/components/page-hero";
import { EmptyState } from "@/components/empty-state";
import { Panel } from "@/components/panel";
import { Button } from "@/components/ui/button";
import { Loader2, Hash, Users, Shield, Globe2 } from "lucide-react";
import { uz } from "@/i18n";
import { joinCohort } from "@/lib/cohort.functions";

export const Route = createFileRoute("/_authenticated/community")({
  head: () => ({
    meta: [
      { title: `Davra — ${uz.brand.name}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CommunityLayout,
});

type Channel = { id: string; slug: string; title: string; description: string | null };

function CommunityLayout() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("community_channels")
        .select("id, slug, title, description")
        .order("sort_order", { ascending: true });
      setChannels((data as Channel[] | null) ?? []);
      setLoading(false);
    })();
  }, []);

  const isChild = location.pathname !== "/community";

  if (isChild) return <Outlet />;

  return (
    <AppShell title="Davra">
      <PageHero
        eyebrow="Jamoa · Dunbar qatlamlari"
        title="Davra."
        subtitle="Bir yo'lda emassan. Kichik davralar — chuqurroq mas'uliyat."
      />

      <CohortJoiner />
      <p className="mt-3 font-ui text-[11px] leading-relaxed text-muted-foreground/70">
        Dunbar (1992): neokorteks hajmi ijtimoiy davra chegarasini belgilaydi. Katta guruh —
        yuzsiz; kichik davra — javobgar. Shuning uchun bizda 5 · 15 · 50 sig'imli qat'iy davralar.
      </p>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : channels.length === 0 ? (
        <EmptyState
          icon={<Hash className="h-5 w-5" />}
          title="Davra tez orada ochiladi"
          description="Kitobxonlik, streak partnyorlik va tematik davralar shu yerda paydo bo'ladi. Ayni paytda o'z tizimingga fokus qil — jamoa tayyor bo'lganda seni topamiz."
          action={
            <Link to="/dashboard" className="font-ui text-sm text-primary hover:underline">
              Bugungi kunga qaytish →
            </Link>
          }
        />
      ) : (
        <div className="mt-8 space-y-2">
          {channels.map((c) => (
            <Panel key={c.id} interactive className="p-0">
              <Link
                to="/community/$channel"
                params={{ channel: c.slug }}
                className="flex items-start gap-4 p-4"
              >
                <Hash className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-serif text-xl">{c.title}</p>
                  {c.description && (
                    <p className="font-ui text-sm text-muted-foreground">{c.description}</p>
                  )}
                </div>
              </Link>
            </Panel>
          ))}
        </div>
      )}
    </AppShell>
  );
}

const TIERS = [
  { tier: "inner5" as const, cap: 5, icon: Shield, label: "Yaqin halqa", hint: "Kundalik mas'uliyat · 5 kishi" },
  { tier: "trust15" as const, cap: 15, icon: Users, label: "Ishonch davrasi", hint: "Streak sheriklari · 15 kishi" },
  { tier: "circle50" as const, cap: 50, icon: Globe2, label: "Kengroq doira", hint: "Mavzuli · 50 kishi" },
];

function CohortJoiner() {
  const join = useServerFn(joinCohort);
  const [state, setState] = useState<Record<string, { members: number; loading?: boolean; error?: string }>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("cohort_members")
        .select("tier, cohort_id, cohorts(member_count)")
        .eq("user_id", user.id);
      if (cancelled || !data) return;
      const next: typeof state = {};
      for (const row of data as Array<{ tier: string; cohorts: { member_count: number } | null }>) {
        if (row.cohorts) next[row.tier] = { members: row.cohorts.member_count };
      }
      setState(next);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleJoin = async (tier: "inner5" | "trust15" | "circle50") => {
    setState((s) => ({ ...s, [tier]: { ...s[tier], loading: true } }));
    try {
      const res = await join({ data: { tier } });
      setState((s) => ({ ...s, [tier]: { members: res.memberCount } }));
    } catch (e) {
      setState((s) => ({ ...s, [tier]: { ...s[tier], loading: false, error: (e as Error).message } }));
    }
  };

  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      {TIERS.map(({ tier, cap, icon: Icon, label, hint }) => {
        const joined = state[tier];
        return (
          <Panel key={tier} className="flex flex-col gap-3 p-4">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-primary" />
              <span className="font-ui text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {label}
              </span>
            </div>
            <div>
              <p className="font-serif text-2xl tabular-nums">
                {joined ? `${joined.members}` : "0"}<span className="text-muted-foreground/60"> / {cap}</span>
              </p>
              <p className="mt-1 font-ui text-xs text-muted-foreground">{hint}</p>
            </div>
            {joined ? (
              <span className="font-ui text-[11px] uppercase tracking-[0.18em] text-primary">
                Tegishlisiz
              </span>
            ) : (
              <Button
                size="sm"
                variant="outline"
                disabled={state[tier]?.loading}
                onClick={() => handleJoin(tier)}
              >
                {state[tier]?.loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Qo'shilish"}
              </Button>
            )}
          </Panel>
        );
      })}
    </div>
  );
}
