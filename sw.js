const CACHE_NAME = "cassette-chacha-v1";
const APP_SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "assets/cassette-chacha-wordmark.svg",
  "assets/cassette-shop-bg.webp",
  "assets/favicon-32.png",
  "assets/favicon-512.png",
  "assets/apple-touch-icon.png",
  "assets/saloon.webp",
  "assets/raju.webp",
  "assets/horn.webp",
  "assets/busdriver.webp",
  "assets/dhaba.webp",
  "assets/chaiwala.webp",
  "assets/mehfil.webp"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
