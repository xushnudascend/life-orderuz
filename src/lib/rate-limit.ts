/**
 * Ad-hoc Postgres-based rate limiter.
 * Called from server routes / server functions only.
 */
export async function rateLimit(opts: {
  key: string;
  limit: number;
  windowSeconds: number;
}): Promise<{ allowed: boolean; retryAfter: number; count: number }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.rpc("rate_limit_hit", {
    _key: opts.key,
    _limit: opts.limit,
    _window_seconds: opts.windowSeconds,
  });
  if (error || !data || !Array.isArray(data) || data.length === 0) {
    // Fail-open on limiter errors — do not block legitimate traffic.
    return { allowed: true, retryAfter: 0, count: 0 };
  }
  const row = data[0] as { allowed: boolean; current_count: number; retry_after_seconds: number };
  return { allowed: row.allowed, retryAfter: row.retry_after_seconds, count: row.current_count };
}

export function clientIpFromRequest(request: Request): string {
  const h = request.headers;
  return (
    h.get("cf-connecting-ip") ||
    h.get("x-real-ip") ||
    (h.get("x-forwarded-for") || "").split(",")[0].trim() ||
    "unknown"
  );
}
