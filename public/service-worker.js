// no bundling, just import the script
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

const VERSION = 'v1';

const urlsToCache = [
    "/",
    "/script.js",
    "/api.js",
    "/storage.js",
    "/style.css",
    "/handle-service-worker.js",
    "/service-worker.js",
];

// disabling logging
// self.__WB_DISABLE_DEV_LOGS = true;

if (workbox) {
    console.log('Workbox is loaded!');

    workbox.routing.registerRoute(
        ({ request }) => request.destination === 'image',
        new workbox.strategies.CacheFirst({
            cacheName: 'images-cache',
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 3,
                })
            ]
        }),
    );

    workbox.routing.registerRoute(
        ({ url }) => url.pathname === '/displays',
        new workbox.strategies.NetworkFirst({ cacheName: 'api-cache' })
    );

    workbox.precaching.precacheAndRoute(urlsToCache.map(url => ({ url, revision: VERSION })));

} else {
    console.error('Workbox failed to load!');
}
