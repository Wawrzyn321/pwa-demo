const urlsToCache = [
    // page
    "/",
    "script.js",
    "api.js",
    "storage.js",
    "style.css",
    "handle-service-worker.js",
    "service-worker.js",
    // api
    "displays",
];

self.addEventListener("install", event => {
    console.log("Service worker installed.");
    event.waitUntil(
        caches.open("assets")
            .then(cache => {
                console.log('Caches open, register asset urls.')
                return cache.addAll(urlsToCache);
            }).catch(console.warn)
    );
});


self.addEventListener("fetch", event => {
    if (event.request.url.endsWith('.jpg')) {
        handleImageCache(event);
    } else {
        handleDocumentsCache(event)
    }
});

function handleImageCache(event) {
    event.respondWith(
        caches.match(event.request).then(response => response ?? fetch(event.request))
            .then(response => {
                if (response.ok) {
                    const clonedResponse = response.clone()
                    caches.open('images')
                        .then(cache => cache.put(event.request, clonedResponse))
                }
                return response
            })
            .catch(console.warn)
    )
}

function handleDocumentsCache(event) {
    event.respondWith(
        caches.match(event.request)
            .then(async cachedResponse => {
                try {
                    // fetch first here
                    return await fetch(event.request);
                } catch {
                    // that's ok, we might be in offline mode
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                }
            }
            )
            .catch(console.warn)
    )
}
