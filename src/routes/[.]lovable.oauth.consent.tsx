import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { uz } from "@/i18n";

// Beta namespace not yet typed in the SDK version we use. Keep a narrow local
// wrapper so we still call the real client methods.
type OAuthDetails = {
  client?: { name?: string; redirect_uri?: string } | null;
  scope?: string | null;
  redirect_url?: string | null;
  redirect_to?: string | null;
};
type OAuthResp<T> = { data: T | null; error: { message: string } | null };
interface OAuthApi {
  getAuthorizationDetails(id: string): Promise<OAuthResp<OAuthDetails>>;
  approveAuthorization(
    id: string,
  ): Promise<OAuthResp<{ redirect_url?: string; redirect_to?: string }>>;
  denyAuthorization(
    id: string,
  ): Promise<OAuthResp<{ redirect_url?: string; redirect_to?: string }>>;
}
function oauthApi(): OAuthApi {
  return (supabase.auth as unknown as { oauth: OAuthApi }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/auth", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauthApi().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="grid min-h-dvh place-items-center bg-background px-6 text-foreground">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl">Ulanish so'rovi yuklanmadi</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {(error as Error)?.message ?? String(error)}
        </p>
      </div>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState<"approve" | "deny" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function decide(approve: boolean) {
    setBusy(approve ? "approve" : "deny");
    setError(null);
    const api = oauthApi();
    const { data, error } = approve
      ? await api.approveAuthorization(authorization_id)
      : await api.denyAuthorization(authorization_id);
    if (error) {
      setBusy(null);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(null);
      setError("Yo'naltirish manzili qaytmadi.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "Tashqi ilova";
  const redirectUri = details?.client?.redirect_uri;
  const scopes: string[] = (details?.scope ?? "").split(/\s+/).filter(Boolean);

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6 text-foreground">
      <div className="glass w-full max-w-md rounded-[var(--radius)] p-8">
        <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-primary">
          Ruxsat berish
        </p>
        <h1 className="mt-3 font-serif text-3xl leading-tight tracking-tight">
          {clientName} — {uz.brand.name} bilan ulanishi
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          <span className="text-foreground">{clientName}</span> sizning nomingizdan bu ilovaning
          vositalarini chaqirishi mumkin bo'ladi: odatlar, kundalik yozuvlar va progress
          ma'lumotlaringizga kirish. Bu ilovaning ichki qoidalari va ma'lumot ruxsatlarini chetlab
          o'tmaydi.
        </p>

        {scopes.length > 0 && (
          <ul className="mt-5 space-y-1 font-ui text-xs text-muted-foreground">
            {scopes.map((s) => (
              <li key={s}>• {s}</li>
            ))}
          </ul>
        )}
        {redirectUri && (
          <p className="mt-4 break-all font-ui text-[11px] text-muted-foreground/80">
            Qaytish manzili: {redirectUri}
          </p>
        )}

        {error && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <Button
            className="flex-1 font-ui font-semibold"
            disabled={busy !== null}
            onClick={() => decide(true)}
          >
            {busy === "approve" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ruxsat berish
          </Button>
          <Button
            variant="secondary"
            className="flex-1 font-ui"
            disabled={busy !== null}
            onClick={() => decide(false)}
          >
            {busy === "deny" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Bekor qilish
          </Button>
        </div>
      </div>
    </main>
  );
}
