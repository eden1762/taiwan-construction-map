(() => {
  const STORAGE_KEY = 'taiwan-construction-map-layer-default-applied-v1';
  const DEFAULT_VISIBLE = new Set(['公共工程', '捷運/交通', 'Public works', 'Transit / traffic']);
  const MAX_ATTEMPTS = 80;
  let attempts = 0;

  const safeStorage = window.__taiwanConstructionMapSafeStorage || {
    getItem(key) {
      try { return localStorage.getItem(key); } catch { return null; }
    },
    setItem(key, value) {
      try { localStorage.setItem(key, value); } catch {}
    }
  };

  function normalizeLabel(text) {
    return String(text || '')
      .replace(/\d+$/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function applyDefaultLayerFocus() {
    if (safeStorage.getItem(STORAGE_KEY) === 'done') return true;

    const buttons = [...document.querySelectorAll('.mvp-layer-toggle[data-category]')];
    if (!buttons.length) return false;

    buttons.forEach(button => {
      const label = normalizeLabel(button.querySelector('span')?.textContent || button.dataset.category);
      const isDefault = DEFAULT_VISIBLE.has(label) || DEFAULT_VISIBLE.has(button.dataset.category);
      const isActive = button.classList.contains('active') || button.getAttribute('aria-pressed') === 'true';
      if (!isDefault && isActive) button.click();
    });

    safeStorage.setItem(STORAGE_KEY, 'done');
    return true;
  }

  function watch() {
    if (applyDefaultLayerFocus()) return;
    attempts += 1;
    if (attempts < MAX_ATTEMPTS) window.setTimeout(watch, 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watch, { once: true });
  } else {
    watch();
  }
})();
