// Lightweight map guard: keep one custom map view and never add a second external map component.
// Project hotspots remain visible even when map tiles are slow or unavailable.

function enhanceStableMap() {
  const realMap = document.querySelector('.real-map');
  if (!realMap || realMap.dataset.stableMapReady === 'true') return;

  realMap.dataset.stableMapReady = 'true';
  realMap.classList.add('stable-map-mode');

  realMap.querySelectorAll('.map-tile').forEach(tile => {
    tile.loading = 'lazy';
    tile.decoding = 'async';
    tile.addEventListener('error', () => tile.classList.add('tile-error'), { once: true });
  });

  const attribution = realMap.querySelector('.map-attribution');
  if (attribution) attribution.textContent = 'Map reference｜工程熱點優先顯示';
}

function scheduleEnhance() {
  window.requestAnimationFrame(enhanceStableMap);
}

scheduleEnhance();

const observer = new MutationObserver(scheduleEnhance);
observer.observe(document.body, { childList: true, subtree: true });

document.addEventListener('taiwan-map:rerender', scheduleEnhance);
