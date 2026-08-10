/**
 * Ad-hoc Postgres-based rate limiter with security event logging.
 * Called from server routes / server functions only.
 */
export async function rateLimit(opts: {
  key: string;
  limit: number;
  windowSeconds: number;
  request?: Request;
}): Promise<{ allowed: boolean; retryAfter: number; count: number }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  
  // Check if client is in blocked_clients table using raw select as types might be stale
  const { data: block } = await (supabaseAdmin as any)
    .from("blocked_clients")
    .select("*")
    .eq("identifier", opts.key)
    .gt("blocked_until", new Date().toISOString())
    .maybeSingle();

  if (block) {
    return { allowed: false, retryAfter: 3600, count: opts.limit + 1 };
  }

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
  
  // If hitting a hard limit (e.g., 2x the standard limit), log a security event
  if (!row.allowed && row.current_count > opts.limit * 2 && opts.request) {
    const ip = clientIpFromRequest(opts.request);
    await (supabaseAdmin as any).from("security_events").insert({
      event_type: "RATE_LIMIT_ABUSE",
      severity: "medium",
      details: { key: opts.key, count: row.current_count, limit: opts.limit },
      ip_address: ip !== "unknown" ? ip : null
    });
  }

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
