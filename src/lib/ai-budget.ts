/**
 * Per-user daily AI request budget.
 * Uses the same `rate_limit_hit` RPC with a 24h window keyed by user id + endpoint.
 * Fail-open on limiter errors so a broken counter never blocks legitimate use.
 */
import { rateLimit } from "@/lib/rate-limit";

export type AiBudgetResult =
  | { ok: true }
  | { ok: false; response: Response };

/**
 * Daily caps per authenticated user, per endpoint.
 * Chat is intentionally larger (short messages) — heavier endpoints are stricter.
 */
const DEFAULT_DAILY_CAPS: Record<string, number> = {
  chat: 200,
  "generate-plan": 10,
  "micro-insight": 60,
  "weekly-report": 5,
  "onboarding-nudge": 5,
};

const DAY_SECONDS = 24 * 60 * 60;

export async function enforceAiDailyBudget(
  userId: string,
  endpoint: keyof typeof DEFAULT_DAILY_CAPS | string,
): Promise<AiBudgetResult> {
  const limit = DEFAULT_DAILY_CAPS[endpoint] ?? 30;
  const rl = await rateLimit({
    key: `ai-budget:${endpoint}:${userId}`,
    limit,
    windowSeconds: DAY_SECONDS,
  });
  if (rl.allowed) return { ok: true };
  return {
    ok: false,
    response: new Response(
      JSON.stringify({
        error: "daily_ai_budget_exceeded",
        endpoint,
        retryAfter: rl.retryAfter,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rl.retryAfter),
        },
      },
    ),
  };
}
