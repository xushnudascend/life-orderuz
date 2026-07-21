import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Copy, Check, Loader2, Sparkles } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EmptyState } from "@/components/empty-state";
import { uz } from "@/i18n";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

export const Route = createFileRoute("/_authenticated/mentor")({
  head: () => ({
    meta: [
      { title: `Nadir — ${uz.brand.name}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MentorPage,
});

type Row = { id: string; role: "user" | "assistant" | "system"; content: string };

type UserStats = {
  displayName: string | null;
  level: number;
  totalXp: number;
  currentStreak: number;
  disciplineScore: number;
  activeDays7: number;
  habitCompletion7: number;
  missedYesterday: boolean;
  archetype: string | null;
  planLength: number | null;
};

function rowToUIMessage(r: Row): UIMessage {
  return {
    id: r.id,
    role: r.role,
    parts: [{ type: "text", text: r.content }],
  } as UIMessage;
}

function extractText(m: UIMessage): string {
  return m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

async function fetchNadirStats(userId: string): Promise<UserStats> {
  const sevenAgo = new Date();
  sevenAgo.setUTCDate(sevenAgo.getUTCDate() - 7);
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const y = yesterday.toISOString().slice(0, 10);

  const [prof, stats, streak, logs, habits] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, archetype, plan_length_days")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("user_stats")
      .select("total_xp, level, discipline_score")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("streaks")
      .select("current_days")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("habit_logs")
      .select("logged_date")
      .eq("user_id", userId)
      .gte("logged_date", sevenAgo.toISOString().slice(0, 10)),
    supabase
      .from("habits")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_active", true),
  ]);

  const logsData = (logs.data as { logged_date: string }[] | null) ?? [];
  const uniqueDays = new Set(logsData.map((l) => l.logged_date));
  const totalHabits = habits.count ?? 0;
  const expected = totalHabits * 7;
  const done = logsData.length;
  const completion = expected > 0 ? Math.round((done / expected) * 100) : 0;
  const missedYesterday =
    totalHabits > 0 && !logsData.some((l) => l.logged_date === y);

  const p = prof.data as { display_name: string | null; archetype: string | null; plan_length_days: number | null } | null;
  const s = stats.data as { total_xp: number | null; level: number | null; discipline_score: number | null } | null;
  const st = streak.data as { current_days: number | null } | null;

  return {
    displayName: p?.display_name ?? null,
    level: s?.level ?? 1,
    totalXp: s?.total_xp ?? 0,
    currentStreak: st?.current_days ?? 0,
    disciplineScore: s?.discipline_score ?? 0,
    activeDays7: uniqueDays.size,
    habitCompletion7: completion,
    missedYesterday,
    archetype: p?.archetype ?? null,
    planLength: p?.plan_length_days ?? null,
  };
}

type Persona = "therapist" | "goggins" | "huberman";

const PERSONAS: Array<{ id: Persona; label: string; desc: string }> = [
  { id: "therapist", label: "Terapevt", desc: "Yumshoq, aks-ettiruvchi. Rogers + Beck." },
  { id: "goggins", label: "Goggins", desc: "Halol, bahonasiz. Bugun, hozir." },
  { id: "huberman", label: "Huberman", desc: "Neyroolim. Protokol shaklida." },
];

function usePersona(): [Persona, (p: Persona) => void] {
  const [persona, setPersona] = useState<Persona>("therapist");
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("lo:mentor:persona");
      if (saved === "goggins" || saved === "huberman" || saved === "therapist") {
        setPersona(saved);
      }
    } catch {
      /* ignore */
    }
  }, []);
  const update = (p: Persona) => {
    setPersona(p);
    try {
      window.localStorage.setItem("lo:mentor:persona", p);
    } catch {
      /* ignore */
    }
  };
  return [persona, update];
}

function MentorPage() {
  const { userId } = Route.useRouteContext();
  const [initial, setInitial] = useState<UIMessage[] | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [input, setInput] = useState("");
  const [persona, setPersona] = usePersona();
  const savedIdsRef = useRef<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [chat, s] = await Promise.all([
        supabase
          .from("chat_messages")
          .select("id, role, content")
          .eq("user_id", userId)
          .order("created_at", { ascending: true }),
        fetchNadirStats(userId),
      ]);
      if (!alive) return;
      const rows = ((chat.data as Row[] | null) ?? []).filter((r) => r.role !== "system");
      rows.forEach((r) => savedIdsRef.current.add(r.id));
      setInitial(rows.map(rowToUIMessage));
      setStats(s);
    })();
    return () => {
      alive = false;
    };
  }, [userId]);

  return initial && stats ? (
    <MentorChat
      key={userId}
      userId={userId}
      initialMessages={initial}
      stats={stats}
      persona={persona}
      setPersona={setPersona}
      input={input}
      setInput={setInput}
      savedIdsRef={savedIdsRef}
      bottomRef={bottomRef}
    />
  ) : (
    <AppShell title="Nadir">
      <div className="flex justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    </AppShell>
  );
}


function MentorChat({
  userId,
  initialMessages,
  stats,
  persona,
  setPersona,
  input,
  setInput,
  savedIdsRef,
  bottomRef,
}: {
  userId: string;
  initialMessages: UIMessage[];
  stats: UserStats;
  persona: Persona;
  setPersona: (p: Persona) => void;
  input: string;
  setInput: (v: string) => void;
  savedIdsRef: React.MutableRefObject<Set<string>>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { userStats: stats, persona },
      }),
    [stats, persona],
  );


  const { messages, sendMessage, status, error } = useChat({
    id: userId,
    messages: initialMessages,
    transport,
  });

  useEffect(() => {
    if (status === "streaming" || status === "submitted") return;
    const toSave = (messages as UIMessage[]).filter((m) => !savedIdsRef.current.has(m.id));
    if (toSave.length === 0) return;
    (async () => {
      for (const m of toSave) {
        const text = extractText(m);
        if (!text.trim()) continue;
        savedIdsRef.current.add(m.id);
        await supabase.from("chat_messages").insert({
          user_id: userId,
          role: m.role,
          content: text,
        });
        if (m.role === "assistant") {
          await supabase.from("xp_events").insert({
            user_id: userId,
            source: "journal",
            amount: 1,
          });
        }
      }
    })();
  }, [messages, status, userId, savedIdsRef]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, bottomRef]);

  const busy = status === "streaming" || status === "submitted";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    await sendMessage({ text });
  }

  return (
    <AppShell title="Nadir">
      <PageHero
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" /> AI Mentor
          </span>
        }
        title="Nadir"
        subtitle="Halol savol ber. Halol javob olasan. Bo'sh maqtov yo'q."
        actions={
          <span className="font-ui text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Daraja {stats.level} · Streak {stats.currentStreak} · Discipline {stats.disciplineScore}/100
          </span>
        }
      />

      <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Mentor rejimi">
        {PERSONAS.map((p) => {
          const active = persona === p.id;
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setPersona(p.id)}
              className={
                "group flex flex-col items-start rounded-[var(--radius)] border px-3 py-2 text-left transition " +
                (active
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/40")
              }
            >
              <span
                className={
                  "font-ui text-[11px] uppercase tracking-[0.2em] " +
                  (active ? "text-primary" : "text-muted-foreground")
                }
              >
                {p.label}
              </span>
              <span className="mt-0.5 text-[11px] text-muted-foreground">{p.desc}</span>
            </button>
          );
        })}
      </div>




      <div className="mt-6 flex min-h-[60vh] flex-col">
        <Conversation className="flex-1">
          <ConversationContent className="space-y-4">
            {messages.length === 0 && (
              <div className="space-y-4">
                <EmptyState
                  icon={<Sparkles className="h-5 w-5" />}
                  title="Bugun nima seni to'xtatyapti?"
                  description="Bir jumla bilan yoz — Nadir avval eshitadi, keyin bitta aniq mikro-qadam beradi."
                />
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    "Ertalab tura olmayapman",
                    "Kecha odatimni o'tkazib yubordim",
                    "Fokusim tarqoq, nima qilay?",
                    "Streak uzildi, qaytadan boshlashga qo'rqaman",
                  ].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setInput(p)}
                      className="rounded-full border border-border bg-card px-3 py-1.5 font-ui text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(messages as UIMessage[]).map((m) => {
              const text = extractText(m);
              const isUser = m.role === "user";
              return (
                <Message key={m.id} from={m.role}>
                  <MessageContent
                    className={
                      isUser
                        ? "bg-primary/5 border border-primary/30"
                        : "bg-transparent border-0 px-0"
                    }
                  >
                    <p className="mb-1 font-ui text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      {isUser ? "Sen" : "Nadir"}
                    </p>
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{text}</p>
                    ) : (
                      <>
                        <MessageResponse>{text}</MessageResponse>
                        <MessageActions>
                          <CopyAction text={text} />
                        </MessageActions>
                      </>
                    )}
                  </MessageContent>
                </Message>
              );
            })}

            {(() => {
              const lastAssistant = [...(messages as UIMessage[])].reverse().find((m) => m.role === "assistant");
              if (!lastAssistant || busy || messages.length === 0) return null;
              const followUps = [
                "Bu mikro-qadamni bugun qachon bajaraman?",
                "Agar to'siq chiqsa — plan B nima?",
                "Buni odatga aylantirish uchun kimga aytaman?",
              ];
              return (
                <div className="flex flex-wrap gap-2 pl-2">
                  {followUps.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setInput(q)}
                      className="rounded-full border border-border bg-card/60 px-3 py-1.5 font-ui text-[11px] text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              );
            })()}

            {busy && (
              <div className="flex items-center gap-2 pl-2">
                <Shimmer className="font-ui text-sm">Nadir o'ylayapti…</Shimmer>
              </div>
            )}
            {error && (() => {
              const msg = error.message || "";
              const isQuota = /daily_ai_budget_exceeded|429/i.test(msg);
              if (isQuota) {
                return (
                  <div className="rounded-[var(--radius)] border border-primary/40 bg-primary/5 p-4 text-sm">
                    <p className="mb-2 font-serif text-base text-foreground">
                      Bugungi bepul limit tugadi.
                    </p>
                    <p className="mb-3 text-muted-foreground">
                      Free rejimida kuniga 10 ta xabar. Pro'da 300 ta va boshqa AI xizmatlari cheklovsiz.
                    </p>
                    <a
                      href="/pricing"
                      className="inline-flex items-center rounded-full border border-primary bg-primary px-3 py-1.5 font-ui text-xs uppercase tracking-[0.2em] text-primary-foreground transition hover:opacity-90"
                    >
                      Pro'ga o'tish
                    </a>
                  </div>
                );
              }
              return (
                <div className="rounded-[var(--radius)] border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  Xato: {msg}
                </div>
              );
            })()}

            <div ref={bottomRef} />
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput
          onSubmit={(_msg, e) => {
            e.preventDefault();
            const text = input.trim();
            if (!text || busy) return;
            setInput("");
            void sendMessage({ text });
          }}
          className="mt-4"
        >
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nadirga yoz…"
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={busy ? "streaming" : undefined} disabled={!input.trim()} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </AppShell>
  );
}

function CopyAction({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <MessageAction
      tooltip={copied ? "Nusxa olindi" : "Nusxa ko'chirish"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* ignore */
        }
      }}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
    </MessageAction>
  );
}
