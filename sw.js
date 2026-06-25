// SHIELD Cinema Redirect - Service Worker
const CACHE = 'shield-redirect-v1';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(['./', './index.html', './icon-192.png', './icon-512.png']))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // url.txt siempre desde la red (tiene la URL actual del tunel)
  if (e.request.url.includes('url.txt') || e.request.url.includes('raw.githubusercontent')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // resto: cache first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
