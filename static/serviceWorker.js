/* globals self, caches, fetch, fetchCommits, sendMessageToClients */

// self.importScripts('/vendor/idb-keyval-min.js');
// self.importScripts('/helpers.js');
const CACHE_NAME = 'awesome-app--cache-v1';

/*
 * Task 3a)
 *   Create list of known files
 */

 const urls = [
 '/',
 '/vendor.bundle.js',
 '/bundle.js',
 '/style.css',
 ];


function updateCommits() {
  self.clients.matchAll()
    .then(function (clients) {
      clients.forEach(function (client) {
        client.postMessage({ type: 'start-loading' });
      });
    });

  return fetchCommits()
    .then(function (commits) {
      return sendMessageToClients({ type: 'commits', body: commits });
    })
    .catch(function (error) {
      return sendMessageToClients({ type: 'failed-to-load', error: error.toString() });
    });
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        cache.addAll(urls);
      }));
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (cacheResponse) {
        if (cacheResponse) {
          return cacheResponse;
        }

        const fetchRequest = event.request.clone();
        return fetch(fetchRequest)
          .then((response) => {
            if (!response || response.status !== 200) {
              return response;
            }
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(function (cache) {
                cache.put(event.request, responseClone);
              });
            return response;
          });
      }));

  /*
   * Task 5)
   *   If not in cache: request it and then cache it
   */

  /*
   * Task 6)
   *   Do not cache API responses
   */
});

/*
 * Task 8a)
 *   Add background sync
 */
