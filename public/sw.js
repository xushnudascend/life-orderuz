// Life Order — App-shell service worker.
// NetworkFirst navigations, CacheFirst for hashed static assets, offline fallback.
// Registration is guarded on the client (see src/routes/__root.tsx) so it never
// runs in Lovable preview / iframe / dev.

const VERSION = "v4-2026-07-30";
const RUNTIME_CACHE = `life-order-runtime-${VERSION}`;
const ASSETS_CACHE = `life-order-assets-${VERSION}`;
const OFFLINE_URL = "/offline.html";
const PRECACHE = [
  "/",
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/favicon.ico",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(RUNTIME_CACHE)
      .then((c) => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      const keep = new Set([RUNTIME_CACHE, ASSETS_CACHE]);
      await Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

function isHashedAsset(url) {
  // Vite emits /assets/<name>.<hash>.<ext>
  return url.pathname.startsWith("/assets/") && /\.[a-f0-9]{6,}\./i.test(url.pathname);
}

function isBypassPath(pathname) {
  return (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_") ||
    pathname.startsWith("/.mcp") ||
    pathname.startsWith("/.well-known") ||
    pathname.startsWith("/.lovable") ||
    pathname.startsWith("/~oauth") ||
    pathname.startsWith("/lovable/") ||
    pathname === "/sw.js" ||
    pathname === "/sitemap.xml"
  );
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (isBypassPath(url.pathname)) return;

  // NetworkFirst for HTML navigations, with offline fallback.
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put("/", fresh.clone()).catch(() => {});
          return fresh;
        } catch {
          const cached = await caches.match(req);
          if (cached) return cached;
          const shell = await caches.match("/");
          if (shell) return shell;
          const offline = await caches.match(OFFLINE_URL);
          return offline || new Response("Offline", { status: 503 });
        }
      })(),
    );
    return;
  }

  // CacheFirst for hashed same-origin build assets.
  if (isHashedAsset(url)) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req).then((resp) => {
            if (resp.ok && resp.type === "basic") {
              const clone = resp.clone();
              caches.open(ASSETS_CACHE).then((c) => c.put(req, clone));
            }
            return resp;
          }),
      ),
    );
    return;
  }

  // Stale-while-revalidate for other same-origin static requests (icons, images).
  if (["image", "font", "style", "script"].includes(req.destination)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const network = fetch(req)
          .then((resp) => {
            if (resp.ok && resp.type === "basic") {
              const clone = resp.clone();
              caches.open(ASSETS_CACHE).then((c) => c.put(req, clone));
            }
            return resp;
          })
          .catch(() => cached);
        return cached || network;
      }),
    );
  }
});
