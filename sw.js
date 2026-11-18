// Plano: service worker senzill. Desa l'app al dispositiu perquè funcioni sense connexió i s'hi pugui instal·lar.
const CACHE = 'plano-v2';
self.addEventListener('install', (e) => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './manifest.webmanifest', './favicon.svg']))); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;
  // Primer la xarxa (així les versions noves arriben soles); si no n'hi ha, el que hi ha desat.
  e.respondWith(
    fetch(req.mode === 'navigate' || req.url.endsWith('/sw.js') ? new Request(req, { cache: 'no-store' }) : req).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res; })
      .catch(() => caches.match(req).then((r) => r || caches.match('./')))
  );
});
