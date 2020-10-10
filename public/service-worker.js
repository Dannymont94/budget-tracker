const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
  './',
  './index.html',
  '/js/index.js',
  '/css/styles.css',
  '/icons/icons-72x72.png',
  '/icons/icons-96x96.png',
  '/icons/icons-128x128.png',
  '/icons/icons-144x144.png',
  '/icons/icons-152x152.png',
  '/icons/icons-192x192.png',
  '/icons/icons-384x384.png',
  '/icons/icons-512x512.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Your files were pre-cached successfully!');
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Removing old cache data', key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('fetch request : ' + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(request) {
      if (request) {
        console.log(`responding with cache : ${e.request.url}`);
        return request;
      }

      console.log(`file is not cached, fetching : ${e.request.url}`);
      fetch(e.request).then(response => {
        if (response.status === 200) {
          cache.put(e.request.url, response.clone());
        }
        return response;
      });
    })
  );
});