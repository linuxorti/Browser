self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    if (event.request.url.startsWith('http')) {
        event.respondWith(
            fetch(event.request, {
                mode: 'cors',
                credentials: 'omit'
            }).catch(error => {
                return new Response('CORS error handled', {
                    status: 200,
                    headers: {'Content-Type': 'text/plain'}
                });
            })
        );
    }
});