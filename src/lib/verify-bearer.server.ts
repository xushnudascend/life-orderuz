import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Verify a Supabase JWT from an incoming server-route `Request`.
 * Returns { userId } on success, or a 401 `Response` to return directly.
 *
 * Server-only. Do not import from browser paths.
 */
export async function verifySupabaseBearer(
  request: Request,
): Promise<
  { ok: true; userId: string; claims: Record<string, unknown> } | { ok: false; response: Response }
> {
  const authHeader = request.headers.get("authorization") ?? request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { ok: false, response: new Response("Unauthorized", { status: 401 }) };
  }
  const token = authHeader.slice("Bearer ".length).trim();
  if (!token || token.split(".").length !== 3) {
    return { ok: false, response: new Response("Unauthorized", { status: 401 }) };
  }

  const url = process.env.SUPABASE_URL;
  const publishable = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishable) {
    return { ok: false, response: new Response("Server misconfigured", { status: 500 }) };
  }

  const supabase = createClient<Database>(url, publishable, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
  });
  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims?.sub) {
    return { ok: false, response: new Response("Unauthorized", { status: 401 }) };
  }
  return {
    ok: true,
    userId: String(data.claims.sub),
    claims: data.claims as Record<string, unknown>,
  };
}
