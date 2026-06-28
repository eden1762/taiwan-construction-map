(() => {
  const ACTIVE_DATA_URL = './data/active_construction_projects.geojson';
  const nativeFetch = window.fetch ? window.fetch.bind(window) : null;
  if (!nativeFetch || window.__tcmHomeCacheFriendlyData) return;
  window.__tcmHomeCacheFriendlyData = true;

  const normalized = input => {
    const raw = typeof input === 'string' ? input : input?.url || String(input || '');
    try {
      const url = new URL(raw, window.location.href);
      const activeUrl = new URL(ACTIVE_DATA_URL, window.location.href);
      if (url.pathname === activeUrl.pathname && url.searchParams.has('instant')) {
        return ACTIVE_DATA_URL;
      }
    } catch {
      if (raw.includes('active_construction_projects.geojson') && raw.includes('instant=')) return ACTIVE_DATA_URL;
    }
    return input;
  };

  window.fetch = (input, init = {}) => {
    const target = normalized(input);
    if (target === ACTIVE_DATA_URL) {
      const nextInit = { ...init, cache: 'default' };
      return nativeFetch(target, nextInit);
    }
    return nativeFetch(input, init);
  };
})();
