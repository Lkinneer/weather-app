// Keeps the app itself available offline. Forecast data is fetched fresh from
// api.weather.gov each time; the page saves the last good forecast on its own.
const VERSION = 'wx-shell-v9';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function saveCopy(req, res) {
  if (res && res.ok) {
    const copy = res.clone();
    caches.open(VERSION).then(cache => cache.put(req, copy));
  }
  return res;
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // weather data goes straight to the network

  if (req.mode === 'navigate') {
    // The page itself: get the newest version when online, fall back to the saved one.
    // On a slow connection, don't keep the screen blank: after 3 seconds use the saved copy.
    const saved = () => caches.match('./index.html').then(r => r || caches.match('./'));
    const net = fetch(req).then(res => saveCopy(new Request('./index.html'), res));
    event.waitUntil(net.catch(() => null));
    event.respondWith(new Promise(resolve => {
      let done = false;
      const finish = r => { if (!done && r) { done = true; resolve(r); } };
      const timer = setTimeout(() => saved().then(finish), 3000);
      net.then(r => { clearTimeout(timer); finish(r); })
        .catch(() => { clearTimeout(timer); saved().then(r => finish(r || Response.error())); });
    }));
    return;
  }

  // Icons and other files: serve the saved copy, refresh it in the background.
  const network = fetch(req).then(res => saveCopy(req, res)).catch(() => null);
  event.waitUntil(network.then(() => undefined));
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(cached => cached || network.then(res => res || Response.error()))
  );
});
