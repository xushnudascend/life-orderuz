import { supabase } from "@/integrations/supabase/client";

/**
 * Yengil analitika: hodisalarni analytics_events jadvaliga yozadi.
 * Batch (2s yoki 10 event) + non-blocking + xatolarni yutadi.
 * Foydalanuvchi kirmagan bo'lsa — jimgina o'tkazib yuboradi.
 */

export type AnalyticsEvent =
  | "signup"
  | "login"
  | "onboarding_started"
  | "onboarding_completed"
  | "assessment_started"
  | "assessment_completed"
  | "first_habit_created"
  | "habit_logged"
  | "habit_completed_all_today"
  | "streak_milestone"
  | "mentor_message_sent"
  | "shield_used"
  | "level_up"
  | "pricing_viewed"
  | "checkout_started"
  | "page_view";

type QueuedEvent = {
  event: AnalyticsEvent;
  props: Record<string, unknown>;
  path: string | null;
  ts: string;
};

const QUEUE: QueuedEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const FLUSH_MS = 2000;
const MAX_BATCH = 10;

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let sid = window.sessionStorage.getItem("lo_sid");
    if (!sid) {
      sid = crypto.randomUUID();
      window.sessionStorage.setItem("lo_sid", sid);
    }
    return sid;
  } catch {
    return "no-storage";
  }
}

async function flush(): Promise<void> {
  if (QUEUE.length === 0) return;
  const batch = QUEUE.splice(0, QUEUE.length);
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return; // anon events dropped — RLS would reject
    const sid = getSessionId();
    await supabase.from("analytics_events").insert(
      batch.map((e) => ({
        user_id: user.id,
        event: e.event,
        props: e.props as never,
        session_id: sid,
        path: e.path,
      })),
    );
  } catch {
    // yutamiz — analitika hech qachon UX ni buzmasin
  }
}

function schedule(): void {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flush();
  }, FLUSH_MS);
}

export function track(event: AnalyticsEvent, props: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  QUEUE.push({
    event,
    props,
    path: window.location.pathname,
    ts: new Date().toISOString(),
  });
  if (QUEUE.length >= MAX_BATCH) {
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    void flush();
  } else {
    schedule();
  }
}

// Sahifa yopilishida qolgan hodisalarni yuborishga urinib ko'rish
if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => void flush());
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") void flush();
  });
}
