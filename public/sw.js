const CACHE = "tohoku-trip-v5";
const BASE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const scoped = (path) => `${BASE_PATH}${path}`;
const HOME = scoped("/");
const CORE = [HOME, scoped("/manifest.webmanifest"), scoped("/favicon.svg"), scoped("/og-v2.png"), scoped("/offline-assets.json"), scoped("/place-assets.json")];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const response = await fetch(HOME);
    const html = await response.clone().text();
    const assets = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
      .map((match) => match[1])
      .filter((url) => url.startsWith(BASE_PATH + "/") && !url.startsWith("//"));
    const offlineAssets = await fetch(scoped("/offline-assets.json"))
      .then((item) => item.json())
      .then((assets) => assets.map(scoped));
    const placeAssets = await fetch(scoped("/place-assets.json"))
      .then((item) => item.json())
      .then((assets) => assets.map(scoped));
    const allAssets = [...new Set([...CORE, ...assets, ...offlineAssets, ...placeAssets])];
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
    if (event.request.mode === "navigate") {
      try {
        const response = await fetch(event.request);
        if (response.ok) {
          const cache = await caches.open(CACHE);
          cache.put(HOME, response.clone());
        }
        return response;
      } catch {
        return (await caches.match(HOME)) ?? Response.error();
      }
    }
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
      return Response.error();
    }
  })());
});
