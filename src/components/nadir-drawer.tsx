import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { X, MessageSquare, Loader2, ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNadir } from "@/lib/nadir-context";
import { ensurePrimaryThread, loadThreadMessages } from "@/lib/nadir-threads.functions";
import {
  offlineNadirReply,
  queueOfflineMessage,
  drainOfflineQueue,
} from "@/lib/nadir-offline";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

type Persona = "therapist" | "goggins" | "huberman";

function extractText(m: UIMessage): string {
  return m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

function rowToUIMessage(r: { id: string; role: string; content: string }): UIMessage {
  return {
    id: r.id,
    role: r.role as UIMessage["role"],
    parts: [{ type: "text", text: r.content }],
  } as UIMessage;
}

export function NadirDrawer() {
  const { isOpen, close, contextHint, seed, clearSeed } = useNadir();
  const ensureFn = useServerFn(ensurePrimaryThread);
  const loadFn = useServerFn(loadThreadMessages);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [initial, setInitial] = useState<UIMessage[] | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [persona, setPersona] = useState<Persona>("therapist");
  const hasLoadedRef = useRef(false);

  // Lazy init on first open
  useEffect(() => {
    if (!isOpen || hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    (async () => {
      const [{ data: userData }, saved] = await Promise.all([
        supabase.auth.getUser(),
        Promise.resolve(
          typeof window !== "undefined"
            ? (window.localStorage.getItem("lo:mentor:persona") as Persona | null)
            : null,
        ),
      ]);
      if (saved === "goggins" || saved === "huberman" || saved === "therapist") setPersona(saved);
      const uid = userData.user?.id ?? null;
      setUserId(uid);
      if (!uid) {
        setInitial([]);
        return;
      }
      const { threadId: tid } = await ensureFn({ data: undefined as never });
      setThreadId(tid);
      const { messages } = await loadFn({ data: { threadId: tid } });
      setInitial(messages.filter((m) => m.role !== "system").map(rowToUIMessage));
    })();
  }, [isOpen, ensureFn, loadFn]);

  // Seed message from caller — prefill input once
  useEffect(() => {
    if (isOpen && seed) {
      setInput(seed);
      clearSeed();
    }
  }, [isOpen, seed, clearSeed]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        aria-hidden={!isOpen}
        className={
          "fixed inset-0 z-40 bg-background/70 backdrop-blur-sm transition-opacity duration-300 " +
          (isOpen ? "opacity-100" : "pointer-events-none opacity-0")
        }
      />
      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Nadir bilan suhbat"
        aria-hidden={!isOpen}
        className={
          "fixed right-0 top-0 z-50 flex h-dvh w-full max-w-[440px] flex-col border-l border-border bg-background shadow-[0_0_60px_-10px_hsl(var(--primary)/0.25)] transition-transform duration-300 " +
          (isOpen ? "translate-x-0" : "translate-x-full")
        }
      >
        <header className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <span
              aria-hidden
              className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary"
            >
              <MessageSquare className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-serif text-sm font-semibold">Nadir</p>
              <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {contextHint ? `Kontekst: ${contextHint}` : "Doimiy suhbat"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Link
              to="/mentor"
              onClick={close}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="To'liq ekranda ochish"
              title="To'liq ekran"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <button
              onClick={close}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Yopish"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {isOpen && initial !== null && userId && threadId ? (
          <DrawerChat
            key={threadId}
            userId={userId}
            threadId={threadId}
            persona={persona}
            contextHint={contextHint}
            initialMessages={initial}
            input={input}
            setInput={setInput}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            {isOpen ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : null}
          </div>
        )}
      </aside>
    </>
  );
}

function DrawerChat({
  userId,
  threadId,
  persona,
  contextHint,
  initialMessages,
  input,
  setInput,
}: {
  userId: string;
  threadId: string;
  persona: Persona;
  contextHint?: string;
  initialMessages: UIMessage[];
  input: string;
  setInput: (v: string) => void;
}) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { persona, threadId, contextHint },
      }),
    [persona, threadId, contextHint],
  );
  const { messages, sendMessage, setMessages, status, error } = useChat({
    id: `nadir:${threadId}`,
    messages: initialMessages,
    transport,
  });
  const busy = status === "streaming" || status === "submitted";
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Internet holati — offline'da Nadir qurilmada javob beradi.
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  // Internet qaytganda navbatdagi xabarlarni yuboramiz.
  useEffect(() => {
    if (!online) return;
    const queued = drainOfflineQueue();
    if (queued.length === 0) return;
    const last = queued[queued.length - 1];
    if (last) void sendMessage({ text: last.text });
  }, [online, sendMessage]);

  const handleOffline = (text: string) => {
    queueOfflineMessage(text);
    setMessages((prev) => [
      ...prev,
      { id: `off-u-${Date.now()}`, role: "user", parts: [{ type: "text", text }] } as UIMessage,
      {
        id: `off-a-${Date.now() + 1}`,
        role: "assistant",
        parts: [{ type: "text", text: offlineNadirReply(text) }],
      } as UIMessage,
    ]);
  };


  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Conversation className="flex-1">
        <ConversationContent className="space-y-4 px-4 py-4">
          {messages.length === 0 && (
            <div className="space-y-3">
              <p className="font-serif text-base text-foreground">Bugun nima seni to'xtatyapti?</p>
              <p className="text-sm text-muted-foreground">
                Bir jumla bilan yoz — Nadir avval eshitadi, keyin bitta aniq mikro-qadam beradi.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Ertalab tura olmayapman", "Odatimni o'tkazib yubordim", "Fokusim tarqoq"].map(
                  (p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setInput(p)}
                      className="rounded-full border border-border bg-card px-3 py-1.5 font-ui text-[11px] text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                    >
                      {p}
                    </button>
                  ),
                )}
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
                  <p className="mb-1 font-ui text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {isUser ? "Sen" : "Nadir"}
                  </p>
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{text}</p>
                  ) : (
                    <MessageResponse>{text}</MessageResponse>
                  )}
                </MessageContent>
              </Message>
            );
          })}
          {busy && (
            <div className="pl-1">
              <Shimmer className="font-ui text-sm">Nadir o'ylayapti…</Shimmer>
            </div>
          )}
          {error &&
            (() => {
              const msg = error.message || "";
              const isQuota = /daily_ai_budget_exceeded|429/i.test(msg);
              return (
                <div
                  className={
                    "rounded-[var(--radius)] border p-3 text-sm " +
                    (isQuota
                      ? "border-primary/40 bg-primary/5"
                      : "border-destructive/40 bg-destructive/10 text-destructive")
                  }
                >
                  {isQuota ? (
                    <>
                      Bugungi bepul limit tugadi.{" "}
                      <Link to="/pricing" className="underline">
                        Pro rejasi
                      </Link>
                    </>
                  ) : (
                    <>Xato: {msg}</>
                  )}
                </div>
              );
            })()}
          <div ref={bottomRef} />
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border/60 px-3 py-3">
        <PromptInput
          onSubmit={(_msg, e) => {
            e.preventDefault();
            const text = input.trim();
            if (!text || busy) return;
            setInput("");
            void sendMessage({ text });
          }}
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
        <p className="mt-2 text-center font-ui text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          suhbat saqlanadi · esc yopadi
        </p>
      </div>
    </div>
  );
  void userId;
}
