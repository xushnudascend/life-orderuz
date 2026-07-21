// Sentry browser init — client-only, fetches DSN from public config endpoint.
import * as Sentry from "@sentry/react";

let initialized = false;
let inflight: Promise<void> | null = null;

async function fetchDsn(): Promise<string | null> {
  try {
    const res = await fetch("/api/public/config", { cache: "force-cache" });
    if (!res.ok) return null;
    const json = (await res.json()) as { sentryDsn?: string | null };
    return json.sentryDsn ?? null;
  } catch {
    return null;
  }
}

export function initSentry(): Promise<void> {
  if (initialized || typeof window === "undefined") return Promise.resolve();
  if (inflight) return inflight;
  inflight = (async () => {
    const dsn = await fetchDsn();
    if (!dsn || initialized) return;
    Sentry.init({
      dsn,
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0.5,
      environment: import.meta.env.MODE,
    });
    initialized = true;
  })();
  return inflight;
}

export function captureError(err: unknown, ctx?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  Sentry.captureException(err, ctx ? { extra: ctx } : undefined);
}
