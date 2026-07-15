import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2 } from "lucide-react";
import { uz } from "@/i18n";

export const Route = createFileRoute("/_authenticated/journal")({
  head: () => ({
    meta: [
      { title: `Kundalik — ${uz.brand.name}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: JournalPage,
});

type Entry = {
  id: string;
  entry_date: string;
  mood: number | null;
  content: string;
  created_at: string;
};

const MOODS = [
  { v: 1, label: "😔" },
  { v: 2, label: "😐" },
  { v: 3, label: "🙂" },
  { v: 4, label: "😌" },
  { v: 5, label: "🔥" },
];

function JournalPage() {
  const { userId } = Route.useRouteContext();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const { data } = await supabase
      .from("journal_entries")
      .select("id,entry_date,mood,content,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    setEntries((data as Entry[] | null) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSaving(true);
    await supabase.from("journal_entries").insert({
      user_id: userId,
      content: content.trim(),
      mood,
    });
    await supabase.from("xp_events").insert({
      user_id: userId,
      source: "journal",
      amount: 5,
    });
    setContent("");
    setMood(null);
    setSaving(false);
    refresh();
  }

  async function remove(id: string) {
    await supabase.from("journal_entries").delete().eq("id", id);
    refresh();
  }

  return (
    <AppShell title="Kundalik">
      <p className="font-ui text-xs uppercase tracking-[0.28em] text-primary">
        Refleksiya
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
        Kundalik
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Bugun o'zing bilan halol gaplash. Faqat sen o'qiysan.
      </p>

      <form
        onSubmit={save}
        className="mt-8 space-y-4 rounded-[var(--radius)] border border-border p-5"
      >
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Bugun nima bo'ldi? Nimadan qochding? Nimani boshqara oldingmi?"
          rows={5}
          className="font-ui resize-none"
        />
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            {MOODS.map((m) => (
              <button
                type="button"
                key={m.v}
                onClick={() => setMood(m.v)}
                className={
                  "flex h-9 w-9 items-center justify-center rounded-full border text-lg transition-colors " +
                  (mood === m.v
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-foreground/30")
                }
                aria-label={`Kayfiyat ${m.v}`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <Button type="submit" disabled={saving || !content.trim()}>
            Saqlash
          </Button>
        </div>
      </form>

      <div className="mt-10 space-y-3">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : entries.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">
            Hozircha yozuv yo'q.
          </p>
        ) : (
          entries.map((e) => {
            const m = MOODS.find((x) => x.v === e.mood);
            return (
              <article
                key={e.id}
                className="rounded-[var(--radius)] border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-ui text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {new Date(e.created_at).toLocaleString("uz-UZ", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                    {m && <span className="text-lg">{m.label}</span>}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(e.id)}
                    aria-label="O'chirish"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-3 whitespace-pre-wrap leading-relaxed">
                  {e.content}
                </p>
              </article>
            );
          })
        )}
      </div>
    </AppShell>
  );
}
