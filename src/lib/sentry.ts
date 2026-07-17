// Sentry browser init — only runs on client
import * as Sentry from "@sentry/react";

let initialized = false;

export function initSentry() {
  if (initialized || typeof window === "undefined") return;
  const dsn = import.meta.env.VITE_SENTRY_DSN_PUBLIC as string | undefined;
  if (!dsn) return;
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0.5,
    environment: import.meta.env.MODE,
  });
  initialized = true;
}

export function captureError(err: unknown, ctx?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  Sentry.captureException(err, ctx ? { extra: ctx } : undefined);
}
