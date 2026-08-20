/* Guarda la app en el teléfono para que abra sin conexión.

   Dos estrategias, a propósito:
   - El HTML (que lleva los datos) va A LA RED PRIMERO. Si hay cobertura,
     siempre ves lo último que se publicó; si no la hay, tira del último que
     se guardó. Al revés —caché primero— tras republicar verías los datos
     viejos hasta la segunda apertura, que es justo lo que no queremos.
   - Los iconos y el manifiesto van al revés (caché primero): no cambian y
     así la app abre al instante. */
const VERSION = 'aebd915fdf88';
const FICHEROS = ['./', './index.html', './manifest.webmanifest',
                  './icono-192.png', './icono-512.png', './icono-180.png', './icono-mask.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FICHEROS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const esDocumento = e.request.mode === 'navigate' ||
                      (e.request.destination === 'document') ||
                      e.request.url.endsWith('/') || e.request.url.endsWith('index.html');

  if (esDocumento) {
    e.respondWith(
      fetch(e.request).then(r => {
        if (r && r.status === 200) {
          const copia = r.clone();
          caches.open(VERSION).then(c => c.put(e.request, copia));
        }
        return r;
      }).catch(() => caches.match(e.request).then(hit => hit || caches.match('./index.html')))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
      if (r && r.status === 200) {
        const copia = r.clone();
        caches.open(VERSION).then(c => c.put(e.request, copia));
      }
      return r;
    }))
  );
});
