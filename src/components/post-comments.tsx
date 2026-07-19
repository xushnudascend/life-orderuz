import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Comment = {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  author?: { display_name: string | null; username: string | null } | null;
};

export function PostComments({ postId, userId }: { postId: string; userId: string }) {
  const [items, setItems] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("post_comments")
      .select("id, user_id, post_id, content, created_at")
      .eq("post_id", postId)
      .order("created_at", { ascending: true })
      .limit(200);
    const rows = (data as Comment[] | null) ?? [];
    const uids = Array.from(new Set(rows.map((r) => r.user_id)));
    let authors: Record<string, { display_name: string | null; username: string | null }> = {};
    if (uids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, display_name, username")
        .in("id", uids);
      for (const p of (profs as { id: string; display_name: string | null; username: string | null }[] | null) ?? []) {
        authors[p.id] = { display_name: p.display_name, username: p.username };
      }
    }
    setItems(rows.map((r) => ({ ...r, author: authors[r.user_id] ?? null })));
  }

  useEffect(() => {
    load();
    const ch = supabase
      .channel(`post-comments-${postId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "post_comments", filter: `post_id=eq.${postId}` },
        load,
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  async function add() {
    const content = text.trim();
    if (!content) return;
    setBusy(true);
    const { error } = await supabase.from("post_comments").insert({
      post_id: postId,
      user_id: userId,
      content,
    });
    setBusy(false);
    if (error) {
      toast.error("Yuborib bo'lmadi");
      return;
    }
    setText("");
  }

  async function remove(id: string) {
    await supabase.from("post_comments").delete().eq("id", id);
  }

  return (
    <div className="mt-3 space-y-2 border-t border-border/60 pt-3">
      {items.map((c) => (
        <div key={c.id} className="group flex items-start gap-2 text-sm">
          <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary text-[10px] font-semibold uppercase">
            {(c.author?.display_name || c.author?.username || "A")[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-ui text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {c.author?.display_name || c.author?.username || "A'zo"} ·{" "}
              <span className="opacity-70">
                {new Date(c.created_at).toLocaleString("uz-UZ")}
              </span>
            </p>
            <p className="mt-0.5 whitespace-pre-wrap break-words">{c.content}</p>
          </div>
          {c.user_id === userId && (
            <button
              onClick={() => remove(c.id)}
              className="opacity-0 group-hover:opacity-100 text-destructive"
              aria-label="Izohni o'chirish"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Fikringni yoz..."
          className="h-8 text-sm"
        />
        <Button onClick={add} size="sm" disabled={busy || !text.trim()} className="h-8 px-3">
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
