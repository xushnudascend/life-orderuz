import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Send, Trash2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { uz } from "@/i18n";
import { PostComments } from "@/components/post-comments";
import { PageHero } from "@/components/page-hero";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/_authenticated/community/$channel")({
  head: () => ({
    meta: [{ title: `Davra — ${uz.brand.name}` }, { name: "robots", content: "noindex" }],
  }),
  component: ChannelView,
  notFoundComponent: ChannelNotFound,
});

type Channel = { id: string; slug: string; title: string; description: string | null };
type Post = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  author?: { display_name: string | null; username: string | null } | null;
};

function ChannelView() {
  const { channel: slug } = Route.useParams();
  const { userId } = Route.useRouteContext();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  async function refresh() {
    const { data: ch } = await supabase
      .from("community_channels")
      .select("id, slug, title, description")
      .eq("slug", slug)
      .maybeSingle();
    if (!ch) {
      throw notFound();
    }
    setChannel(ch as Channel);
    const { data: ps } = await supabase
      .from("community_posts")
      .select("id, user_id, content, created_at")
      .eq("channel_id", (ch as Channel).id)
      .order("created_at", { ascending: false })
      .limit(100);
    const raw = (ps as Post[] | null) ?? [];
    // Batch fetch authors
    const uids = Array.from(new Set(raw.map((p) => p.user_id)));
    const authors: Record<string, { display_name: string | null; username: string | null }> = {};
    if (uids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, display_name, username")
        .in("id", uids);
      for (const p of (profs as
        | { id: string; display_name: string | null; username: string | null }[]
        | null) ?? []) {
        authors[p.id] = { display_name: p.display_name, username: p.username };
      }
    }
    setPosts(raw.map((p) => ({ ...p, author: authors[p.user_id] ?? null })));
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function submit() {
    if (!content.trim() || !channel) return;
    setPosting(true);
    const { error } = await supabase.from("community_posts").insert({
      user_id: userId,
      channel_id: channel.id,
      content: content.trim(),
    });
    setPosting(false);
    if (error) return toast.error("Yuborib bo'lmadi");
    setContent("");
    toast.success("Yozuv qo'shildi.");
    refresh();
  }

  async function del(id: string) {
    await supabase.from("community_posts").delete().eq("id", id);
    refresh();
  }

  return (
    <AppShell title={channel?.title ?? "Kanal"}>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link to="/community">
          <ArrowLeft className="mr-1 h-4 w-4" /> Kanallar
        </Link>
      </Button>
      <PageHero
        eyebrow={`# ${slug}`}
        title={channel?.title ?? "..."}
        subtitle={channel?.description ?? undefined}
      />

      <div className="mt-8 rounded-[var(--radius)] border border-border p-4">
        <p className="mb-3 font-ui text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Muhokama-boshlovchi savollar (bosib qo'yish mumkin)
        </p>
        <div className="mb-3 flex flex-wrap gap-2">
          {[
            "Bugun sizni bir qadam yaxshiroq qilgan odat qaysi?",
            "Bu oy qancha tejadingiz? Sirini bo'lishing.",
            "Bugungi eng katta darsingiz nima?",
            "Kim yoki nima energiyangizni o'g'irladi?",
            "Bir hafta keyin bugunni eslab nima deysiz?",
          ].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setContent(q + "\n\n")}
              className="rounded-full border border-border bg-card px-3 py-1 font-ui text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {q}
            </button>
          ))}
        </div>
        <Textarea
          placeholder="Bugun sizni bir qadam yaxshiroq qilgan odat qaysi?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <div className="mt-2 flex justify-end">
          <Button onClick={submit} disabled={posting || !content.trim()}>
            <Send className="mr-1 h-4 w-4" /> Yuborish
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="h-5 w-5" />}
          title="Hali yozuv yo'q"
          description="Birinchi bo'l — savolga javob ber."
          className="mt-8"
        />
      ) : (
        <div className="mt-8 space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="rounded-[var(--radius)] border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-ui text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {p.author?.username ? (
                      <Link
                        to="/u/$username"
                        params={{ username: p.author.username }}
                        className="hover:text-foreground"
                      >
                        {p.author?.display_name ?? p.author.username}
                      </Link>
                    ) : (
                      (p.author?.display_name ?? "A'zo")
                    )}
                    <span className="ml-2 opacity-60">
                      {new Date(p.created_at).toLocaleString("uz-UZ")}
                    </span>
                  </p>
                  <p className="mt-2 whitespace-pre-wrap font-ui text-sm">{p.content}</p>
                  <p className="mt-3 inline-flex items-center gap-1 font-ui text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
                    <MessageSquare className="h-3 w-3" /> Izohlar
                  </p>
                  <PostComments postId={p.id} userId={userId} />
                </div>
                {p.user_id === userId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Xabarni o'chirish"
                    onClick={() => del(p.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}

function ChannelNotFound() {
  return (
    <AppShell title="Davra">
      <p className="mt-8 text-muted-foreground">Kanal topilmadi.</p>
      <Button asChild className="mt-4" variant="outline">
        <Link to="/community">Kanallarga qaytish</Link>
      </Button>
    </AppShell>
  );
}
