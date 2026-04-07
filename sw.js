const CACHE_NAME = 'gbg-web-v3';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/vue.global.prod.js',
  '/manifest.json',
  '/images/sabrkei-favicon.png',
  '/images/sabrkei.png',
  '/images/profilephoto.webp',
  '/images/icon-js.webp',
  '/images/icon-vuejs.webp',
  '/images/icon-react.webp',
  '/images/icon-nodejs.webp',
  '/images/icon-html5.webp',
  '/images/icon-css3.webp',
  '/images/icon-sass.webp',
  '/images/icon-git.webp',
  '/images/icon-wordpress.webp',
  '/images/icon-ts.webp'
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
        .catch(() => caches.match('/index.html'))
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
