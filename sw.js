// Service Worker for VoiceMemo PWA
const CACHE_VERSION = 'voicememo-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(URLS_TO_CACHE).catch(err => {
        console.log('[Service Worker] Cache addAll error:', err);
        // Don't fail on cache errors during install
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_VERSION) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip Firebase and external requests (they need network)
  if (event.request.url.includes('firebase') || 
      event.request.url.includes('googleapis') ||
      event.request.url.includes('gstatic')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful responses
          if (response.status === 200) {
            const clonedResponse = response.clone();
            caches.open(CACHE_VERSION).then(cache => {
              cache.put(event.request, clonedResponse);
            });
          }
          return response;
        })
        .catch(() => {
          // Return offline page or cached response
          return caches.match(event.request);
        })
    );
    return;
  }

  // For app resources: Network first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.status === 200) {
          const clonedResponse = response.clone();
          caches.open(CACHE_VERSION).then(cache => {
            cache.put(event.request, clonedResponse);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then(cachedResponse => {
            return cachedResponse || new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Background sync (future implementation for offline memo saving)
self.addEventListener('sync', event => {
  console.log('[Service Worker] Background sync:', event.tag);
  if (event.tag === 'sync-memos') {
    event.waitUntil(syncMemos());
  }
});

async function syncMemos() {
  console.log('[Service Worker] Syncing memos...');
  // Implementation for syncing offline memos
  return Promise.resolve();
}

// Handle messages from clients
self.addEventListener('message', event => {
  console.log('[Service Worker] Message received:', event.data);
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Periodic background sync (if needed for future notifications)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'check-memos') {
    event.waitUntil(checkNewMemos());
  }
});

async function checkNewMemos() {
  console.log('[Service Worker] Checking for new memos...');
  return Promise.resolve();
}

console.log('[Service Worker] Loaded');
