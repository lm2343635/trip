const CACHE = "tohoku-trip-v2";
const CORE = ["/", "/manifest.webmanifest", "/favicon.svg", "/og-v2.png", "/offline-assets.json"];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const response = await fetch("/");
    const html = await response.clone().text();
    const assets = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
      .map((match) => match[1])
      .filter((url) => url.startsWith("/") && !url.startsWith("//"));
    const offlineAssets = await fetch("/offline-assets.json").then((item) => item.json());
    const allAssets = [...new Set([...CORE, ...assets, ...offlineAssets])];
    for (let index = 0; index < allAssets.length; index += 12) {
      await cache.addAll(allAssets.slice(index, index + 12));
    }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok && new URL(event.request.url).origin === self.location.origin) {
        const cache = await caches.open(CACHE);
        cache.put(event.request, response.clone());
      }
      return response;
    } catch {
      return (await caches.match("/")) ?? Response.error();
    }
  })());
});
