/* SPS HQ. Copyright (c) 2026 Ethan Gallagher. All rights reserved. Proprietary; see LICENSE.txt. */
/* SPS HQ service worker.
   - The app page: network first, but if the venue Wi-Fi hasn't answered within 3.5 s the cached copy opens straight away
     (the network copy still lands in the cache for next time).
   - Libraries, icons and the 3D ambulance model: served from the cache (they only change with a new version of this file).
   - Everything else on this site: network first, cache as the fallback. Live data (Firebase) never goes through here. */
const CACHE = 'sps-hq-v278';
const SHELL = ['./', './index.html', './manifest.webmanifest', './favicon.ico', './icons/favicon-32.png', './icons/icon-192.png', './icons/icon-512.png', './vendor/leaflet.js', './vendor/three.min.js', './vendor/jsqr.min.js', './models/sprinter.glb'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
const put = (req, res) => { if (res && res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); } return res; };
const fromCache = req => caches.match(req, { ignoreSearch: true });
self.addEventListener('fetch', e => {
  const req = e.request; const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  const p = url.pathname;
  if (/^\/(vendor|models|icons)\//.test(p) || p === '/favicon.ico') {
    e.respondWith(fromCache(req).then(m => m || fetch(req).then(r => put(req, r))));
    return;
  }
  if (req.mode === 'navigate' || p === '/' || p === '/index.html') {
    e.respondWith(new Promise(resolve => {
      let done = false; const finish = r => { if (!done && r) { done = true; resolve(r); } };
      const cached = () => fromCache(req).then(m => m || caches.match('./index.html'));
      const t = setTimeout(() => cached().then(finish), 3500);
      fetch(req).then(r => { clearTimeout(t); put(req, r); finish(r); }).catch(() => { clearTimeout(t); cached().then(m => { if (m) finish(m); else finish(Response.error()); }); });
    }));
    return;
  }
  e.respondWith(fetch(req).then(r => put(req, r)).catch(() => fromCache(req).then(m => m || caches.match('./index.html'))));
});
