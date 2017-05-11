/**
 * Created by andreivinogradov on 05.05.17.
 */

const CACHE_NAME = 'cardDefence';

self.addEventListener('install', function(event) {
  console.log('WORKER: install event in progress.');
  event.waitUntil(
    /* The caches built-in is a promise-based API that helps you cache responses,
     as well as finding and deleting them.
     */
    caches
    /* You can open a cache by name, and this method returns a promise. We use
     a versioned cache name here so that we can remove old cache entries in
     one fell swoop later, when phasing out an older service worker.
     */
      .open(CACHE_NAME)
      .then(function(cache) {
        /* After the cache is opened, we can fill it with the offline fundamentals.
         The method below will add all resources we've indicated to the cache,
         after making HTTP requests for each of them.
         */
        return cache.addAll([
          '/',
          '/style.css',
          '/vendor.bundle.js',
          '/bundle.js',
        ]);
      })
      .then(function() {
        console.log('WORKER: install completed');
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .catch(error => {
            return caches.open(CACHE_NAME).then((cache) => {
              console.log('!!!' + cache);
              return cache.match("bundle.js").then((cachedResponse) => {
                return cachedResponse;
              })
            });
        })
    })
  )
});
