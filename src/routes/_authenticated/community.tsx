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
