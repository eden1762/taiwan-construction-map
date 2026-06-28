const CACHE_NAME = 'tcm-active-data-v20260628b';
const CACHEABLE_DATA = [
  '/data/active_construction_projects.geojson',
  '/data/active_dataset_manifest.json'
];
const CACHEABLE_PREFIXES = [
  '/data/active-project-batches/'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHEABLE_DATA))
      .catch(() => undefined)
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('tcm-active-data-') && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin !== location.origin || !isActiveDataRequest(url.pathname)) return;
  event.respondWith(cacheFirstData(url));
});

function isActiveDataRequest(pathname) {
  return CACHEABLE_DATA.includes(pathname) || CACHEABLE_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

async function cacheFirstData(url) {
  const cache = await caches.open(CACHE_NAME);
  const canonical = new Request(url.pathname, { cache: 'reload' });
  const cached = await cache.match(canonical);
  if (cached) {
    refreshInBackground(cache, canonical);
    return cached;
  }
  try {
    const response = await fetch(canonical);
    if (response.ok) await cache.put(canonical, response.clone());
    return response;
  } catch (error) {
    return new Response(JSON.stringify({ type: 'FeatureCollection', features: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
}

function refreshInBackground(cache, request) {
  fetch(request)
    .then(response => {
      if (response.ok) cache.put(request, response.clone());
    })
    .catch(() => undefined);
}
