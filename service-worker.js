const cache_name = 'my-site-cache-v1';
const cache_assets = [
    './offline.html',  // Gunakan jalur relatif yang benar
    './halaman.html',
    './style.css',
    './patners.html',
    './index.html',
    './192x192.png',
    './512x512.png',
    './Foto1.avif',
    './Foto2.avif',
    './Foto3.avif',
];

// Install event
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
    event.waitUntil(
        caches.open(cache_name)
            .then((cache) => {
                console.log('Service Worker: Caching Files');
                return cache.addAll(cache_assets)
                    .then(() => {
                        console.log('All files cached successfully');
                    })
                    .catch((error) => {
                        console.error('Error caching some assets:', error);
                    });
            })
            .catch((error) => {
                console.error('Error opening cache:', error);
            })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    event.waitUntil(
        caches.keys().then(
            (cacheNames) => {
                return Promise.all(
                    cacheNames.map(
                        (cache) => {
                            if (cache !== cache_name) {
                                console.log('Service Worker: Clearing Old Cache');
                                return caches.delete(cache);
                            }
                        }
                    )
                );
            }
        )
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Fetching', event.request.url);
    event.respondWith(
        caches.match(event.request).then(
            (response) => {
                // Return cached response if found
                if (response) {
                    return response;
                }
                // Fallback to network fetch if not found in cache
                return fetch(event.request).catch(
                    () => {
                        // Fallback to offline.html if fetch fails
                        return caches.match('./offline.html');
                    }
                );
            }
        ).catch((error) => {
            console.error('Error fetching resource:', error);
            return caches.match('./offline.html');
        })
    );
});
