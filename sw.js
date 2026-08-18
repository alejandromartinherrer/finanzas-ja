/* Guarda la app en el teléfono para que abra sin conexión.
   La versión cambia en cada publicación: así el móvil se entera de que hay
   datos nuevos y se actualiza solo la próxima vez que la abras. */
const VERSION = 'c3aebe8ac526';
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
  e.respondWith(
    caches.match(e.request).then(hit => {
      const red = fetch(e.request).then(r => {
        if (r && r.status === 200) {
          const copia = r.clone();
          caches.open(VERSION).then(c => c.put(e.request, copia));
        }
        return r;
      }).catch(() => hit);
      return hit || red;
    })
  );
});
