let cached: { turnstileSiteKey: string; sentryDsn: string } | null = null
let pending: Promise<{ turnstileSiteKey: string; sentryDsn: string }> | null = null

export async function loadPublicConfig() {
  if (cached) return cached
  if (pending) return pending
  pending = fetch('/api/public/config')
    .then((r) => r.json())
    .then((v) => {
      cached = v
      return v
    })
    .catch(() => ({ turnstileSiteKey: '', sentryDsn: '' }))
  return pending
}
