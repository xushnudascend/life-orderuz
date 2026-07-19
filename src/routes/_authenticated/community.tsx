import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { PageHero } from "@/components/page-hero";
import { Loader2, Hash } from "lucide-react";
import { uz } from "@/i18n";

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
        eyebrow="Jamoa"
        title="Davra."
        subtitle="Kanallar, chaqiriqlar, kitobxonlar. Bir yo'lda emassan."
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : channels.length === 0 ? (
        <EmptyState
          icon={<Hash className="h-5 w-5" />}
          title="Kanallar hali ochilmagan"
          description="Tez orada — kitobxonlik, streak partnyorlik va tematik davralar shu yerda paydo bo'ladi."
        />

      ) : (
        <div className="mt-8 space-y-2">
          {channels.map((c) => (
            <Link
              key={c.id}
              to="/community/$channel"
              params={{ channel: c.slug }}
              className="flex items-start gap-4 rounded-[var(--radius)] border border-border bg-card p-4 transition-colors hover:border-foreground/20"
            >
              <Hash className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="font-serif text-xl">{c.title}</p>
                {c.description && (
                  <p className="font-ui text-sm text-muted-foreground">{c.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
