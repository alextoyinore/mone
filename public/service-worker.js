const CACHE_NAME = 'xitoplay-cache-v1';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/assets/*',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(ASSETS_TO_CACHE)
        .catch((error) => {
          console.error('Failed to cache assets:', error);
          // Ensure the service worker still installs even if caching fails
          return Promise.resolve();
        });
    })
  );
  // Force the waiting service worker to become active
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests and requests to external domains
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return the response from the cached version
      if (response) {
        return response;
      }

      // Not in cache - return the result from the live server
      return fetch(event.request)
        .then((networkResponse) => {
          // Check if we should cache the response
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch((error) => {
                console.error('Failed to cache response:', error);
              });
          }
          return networkResponse;
        })
        .catch((error) => {
          console.error('Fetch failed for:', event.request.url, 'Error:', error);
          // Return a custom offline response if needed
          return new Response('Offline', { 
            status: 503, 
            headers: { 'Content-Type': 'text/plain' } 
          });
        });
    })
    .catch((error) => {
      console.error('Service worker fetch error:', error);
      throw error;
    })
  );
});
