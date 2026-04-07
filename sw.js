const CACHE_NAME = 'sabrkei-v4';

// Derive base path from SW location so this works in any subfolder
// e.g. /sabrkei.com/sw.js → BASE = '/sabrkei.com/'
//      /sw.js              → BASE = '/'
const BASE = self.location.pathname.replace(/sw\.js$/, '');

const PRECACHE_ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'style.css',
  BASE + 'script.js',
  BASE + 'vue.global.prod.js',
  BASE + 'manifest.json',
  BASE + 'images/sabrkei-favicon.png',
  BASE + 'images/sabrkei.png',
  BASE + 'images/profilephoto.webp',
  BASE + 'images/icon-js.webp',
  BASE + 'images/icon-vuejs.webp',
  BASE + 'images/icon-react.webp',
  BASE + 'images/icon-nodejs.webp',
  BASE + 'images/icon-html5.webp',
  BASE + 'images/icon-css3.webp',
  BASE + 'images/icon-sass.webp',
  BASE + 'images/icon-git.webp',
  BASE + 'images/icon-wordpress.webp',
  BASE + 'images/icon-ts.webp'
];

// Install: precache all core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for static assets, network-first for navigation
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin requests (e.g. Google Fonts, Formspree)
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Navigation requests (HTML): network-first, fall back to cached index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(BASE + 'index.html'))
    );
    return;
  }

  // Static assets: cache-first, then network
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return response;
      });
    })
  );
});
