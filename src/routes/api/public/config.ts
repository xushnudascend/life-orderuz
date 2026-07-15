import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/public/config')({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({
          turnstileSiteKey: process.env.TURNSTILE_SITE_KEY ?? '',
          sentryDsn: process.env.SENTRY_DSN_PUBLIC ?? '',
        }, {
          headers: { 'Cache-Control': 'public, max-age=300' },
        })
      },
    },
  },
})
