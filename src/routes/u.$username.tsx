import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RankBadge } from "@/components/rank-badge";
import { uz } from "@/i18n";
import { ArrowLeft, User as UserIcon } from "lucide-react";

/**
 * Public profile — /u/:username. Faqat is_public=true bo'lgan profillar.
 */
export const Route = createFileRoute("/u/$username")({
  ssr: false,
  loader: async ({ params }) => {
    const { data: prof } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, is_public")
      .eq("username", params.username)
      .eq("is_public", true)
      .maybeSingle();
    if (!prof) throw notFound();
    const [{ data: stats }, { data: streak }] = await Promise.all([
      supabase
        .from("user_stats")
        .select("total_xp, level, discipline_score")
        .eq("user_id", (prof as { id: string }).id)
        .maybeSingle(),
      supabase
        .from("streaks")
        .select("current_days, longest_days")
        .eq("user_id", (prof as { id: string }).id)
        .maybeSingle(),
    ]);
    return { prof, stats, streak };
  },
  head: ({ params }) => {
    const desc = `@${params.username} — Life Order ochiq profili: intizom balli, streak, XP darajasi va yutuqlar. Self-Control OS jamoasidagi shaxsiy natijalar.`;
    return {
      meta: [
        { title: `@${params.username} — ${uz.brand.name}` },
        { name: "description", content: desc },
        { property: "og:title", content: `@${params.username} — ${uz.brand.name}` },
        { property: "og:description", content: desc },
        { property: "og:url", content: `https://life-orderuz.lovable.app/u/${params.username}` },
      ],
      links: [{ rel: "canonical", href: `https://life-orderuz.lovable.app/u/${params.username}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              name: params.username,
              url: `https://life-orderuz.lovable.app/u/${params.username}`,
            },
          }),
        },
      ],
    };
  },
  component: PublicProfile,
  notFoundComponent: NotPublic,
  errorComponent: () => (
    <div className="mx-auto max-w-lg px-5 py-20 text-center">
      <p className="text-muted-foreground">Xatolik yuz berdi.</p>
    </div>
  ),
});

function PublicProfile() {
  const { prof, stats, streak } = Route.useLoaderData() as {
    prof: {
      id: string;
      username: string;
      display_name: string | null;
      avatar_url: string | null;
    };
    stats: { total_xp: number; level: number; discipline_score: number } | null;
    streak: { current_days: number; longest_days: number } | null;
  };
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-5 py-10">
        <Button asChild variant="ghost" size="sm">
          <Link to="/">
            <ArrowLeft className="mr-1 h-4 w-4" /> Bosh sahifa
          </Link>
        </Button>

        <div className="mt-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-border bg-card">
            {prof.avatar_url ? (
              <img src={prof.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <UserIcon className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <h1 className="font-serif text-3xl">{prof.display_name ?? prof.username}</h1>
            <p className="font-ui text-xs uppercase tracking-[0.22em] text-muted-foreground">
              @{prof.username}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <RankBadge score={stats?.discipline_score ?? 0} />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card label="Daraja" value={stats?.level ?? 1} />
          <Card label="XP" value={stats?.total_xp ?? 0} />
          <Card label="Streak" value={`${streak?.current_days ?? 0} kun`} />
        </div>

        <div className="mt-6 rounded-[var(--radius)] border border-border p-5">
          <p className="font-ui text-sm">
            Eng uzun streak:{" "}
            <span className="text-foreground">{streak?.longest_days ?? 0}</span> kun
          </p>
        </div>

        <p className="mt-10 font-ui text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Life Order — Self-Control OS
        </p>
      </div>
    </div>
  );
}

function NotPublic() {
  return (
    <div className="mx-auto max-w-lg px-5 py-20 text-center">
      <p className="font-serif text-2xl">Profil yopiq yoki topilmadi.</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Foydalanuvchi profilni yopib qo'ygan.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Bosh sahifa</Link>
      </Button>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[var(--radius)] border border-border p-5">
      <p className="font-ui text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl">{value}</p>
    </div>
  );
}
