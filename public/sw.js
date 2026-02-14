/**
 * 🔧 Service Worker - Hidden Performance Booster
 * ===============================================
 * Background এ চলবে, user দেখবে না কিন্তু lightning fast করবে
 */

const CACHE_NAME = 'rahim-portfolio-v1';
const RUNTIME_CACHE = 'rahim-runtime-v1';

// 📦 Critical resources to cache immediately
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/favicon.png'
];

// 🚀 Install - Cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('🚀 Service Worker: Caching critical resources');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// 🔄 Activate - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('🧹 Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 📡 Fetch - Intelligent caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip Firebase/API calls
  if (url.hostname.includes('firebase') || url.hostname.includes('googleapis')) {
    return;
  }

  // 🎯 Strategy: Network First, fallback to Cache (for HTML)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone and cache the response
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(request);
        })
    );
    return;
  }

  // 🎨 Strategy: Cache First (for static assets)
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf)$/)
  ) {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // Return cached version immediately
            // Update cache in background
            fetch(request).then(response => {
              caches.open(RUNTIME_CACHE).then(cache => {
                cache.put(request, response);
              });
            }).catch(() => {});
            
            return cachedResponse;
          }

          // Not in cache, fetch from network
          return fetch(request)
            .then(response => {
              // Cache for next time
              const responseClone = response.clone();
              caches.open(RUNTIME_CACHE).then(cache => {
                cache.put(request, responseClone);
              });
              return response;
            });
        })
    );
    return;
  }

  // 🌐 Default: Network with cache fallback
  event.respondWith(
    fetch(request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(RUNTIME_CACHE).then(cache => {
          cache.put(request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// 🧹 Periodic cache cleanup (limit cache size)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
});

console.log('✅ Service Worker loaded successfully');