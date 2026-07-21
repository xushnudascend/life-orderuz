import { createFileRoute } from "@tanstack/react-router";

// Public runtime config. DSN is a publishable value — safe to expose.
export const Route = createFileRoute("/api/public/config")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(
          {
            sentryDsn: process.env.SENTRY_DSN_PUBLIC ?? null,
            env: process.env.NODE_ENV ?? "production",
          },
          {
            headers: {
              "cache-control": "public, max-age=300, s-maxage=300",
            },
          },
        );
      },
    },
  },
});
