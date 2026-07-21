/**
 * Tier-aware per-user daily AI request budget.
 * Free vs Pro caps enforced server-side via `profiles.subscription_tier`.
 * Uses the same `rate_limit_hit` RPC with a 24h window keyed by user id + endpoint + tier.
 * Fail-open on limiter/lookup errors so a broken counter never blocks legitimate use.
 */
import { rateLimit } from "@/lib/rate-limit";

export type AiBudgetResult =
  | { ok: true; tier: "free" | "pro" }
  | { ok: false; response: Response };

type Endpoint =
  | "chat"
  | "generate-plan"
  | "micro-insight"
  | "weekly-report"
  | "onboarding-nudge";

const FREE_DAILY_CAPS: Record<Endpoint, number> = {
  chat: 10,
  "generate-plan": 1,
  "micro-insight": 5,
  "weekly-report": 1,
  "onboarding-nudge": 2,
};

const PRO_DAILY_CAPS: Record<Endpoint, number> = {
  chat: 300,
  "generate-plan": 15,
  "micro-insight": 100,
  "weekly-report": 10,
  "onboarding-nudge": 10,
};

const DAY_SECONDS = 24 * 60 * 60;

async function getTier(userId: string): Promise<"free" | "pro"> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("subscription_tier")
      .eq("id", userId)
      .maybeSingle();
    const t = (data as { subscription_tier?: string } | null)?.subscription_tier;
    return t === "pro" ? "pro" : "free";
  } catch {
    // fail-open to free (more restrictive) so we never accidentally unlock paid features
    return "free";
  }
}

export async function enforceAiDailyBudget(
  userId: string,
  endpoint: Endpoint | string,
): Promise<AiBudgetResult> {
  const tier = await getTier(userId);
  const caps = tier === "pro" ? PRO_DAILY_CAPS : FREE_DAILY_CAPS;
  const limit = caps[endpoint as Endpoint] ?? (tier === "pro" ? 60 : 15);
  const rl = await rateLimit({
    key: `ai-budget:${tier}:${endpoint}:${userId}`,
    limit,
    windowSeconds: DAY_SECONDS,
  });
  if (rl.allowed) return { ok: true, tier };
  return {
    ok: false,
    response: new Response(
      JSON.stringify({
        error: "daily_ai_budget_exceeded",
        endpoint,
        tier,
        limit,
        upgradeUrl: tier === "free" ? "/pricing" : null,
        retryAfter: rl.retryAfter,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rl.retryAfter),
          "X-Ai-Tier": tier,
          "X-Ai-Limit": String(limit),
        },
      },
    ),
  };
}

export const AI_LIMITS = { free: FREE_DAILY_CAPS, pro: PRO_DAILY_CAPS };
