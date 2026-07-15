// Simple offline-first service worker
const CACHE = "life-order-v1";
const OFFLINE_URL = "/offline.html";
const PRECACHE = ["/", OFFLINE_URL, "/manifest.webmanifest", "/favicon.ico"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Only handle same-origin navigations for offline fallback
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match(OFFLINE_URL).then((r) => r || new Response("Offline"))),
    );
    return;
  }
  // Skip API and dynamic requests
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_")) return;
  // Cache-first for static assets
  event.respondWith(
    caches.match(req).then((cached) =>
      cached ||
      fetch(req).then((resp) => {
        if (resp.ok && resp.type === "basic") {
          const clone = resp.clone();
          caches.open(CACHE).then((c) => c.put(req, clone));
        }
        return resp;
      }).catch(() => cached || Response.error()),
    ),
  );
});
