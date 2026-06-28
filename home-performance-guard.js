(() => {
  const DATA_PATH_MARKERS = ['/data/', './data/'];
  const originalFetch = window.fetch?.bind(window);
  if (!originalFetch || window.__TCM_HOME_PERFORMANCE_GUARD__) return;
  window.__TCM_HOME_PERFORMANCE_GUARD__ = true;

  function isLocalDataRequest(input) {
    const raw = typeof input === 'string' ? input : input?.url || '';
    return DATA_PATH_MARKERS.some(marker => raw.includes(marker));
  }

  function stripCacheBuster(input) {
    const raw = typeof input === 'string' ? input : input?.url || '';
    if (!raw || !isLocalDataRequest(raw)) return input;
    try {
      const url = new URL(raw, window.location.href);
      url.searchParams.delete('v');
      if (typeof input === 'string') {
        return url.pathname.startsWith('/') ? `${url.pathname}${url.search}${url.hash}` : url.toString();
      }
      return new Request(url.toString(), input);
    } catch (error) {
      return String(raw).replace(/[?&]v=\d+/, '');
    }
  }

  window.fetch = (input, init = {}) => {
    const target = stripCacheBuster(input);
    const nextInit = { ...init };
    if (isLocalDataRequest(target)) {
      delete nextInit.cache;
      nextInit.cache = 'default';
    }
    return originalFetch(target, nextInit);
  };

  function currentLanguage() {
    try {
      return localStorage.getItem('taiwan-construction-map-language') === 'en' ? 'en' : 'zh';
    } catch (error) {
      return document.documentElement.lang === 'en' ? 'en' : 'zh';
    }
  }

  function ensureFastFallback() {
    const map = document.querySelector('#map');
    const status = document.querySelector('#mapStatus');
    const list = document.querySelector('#projectList');
    if (!map || !status) return;
    const hasUsableMap = map.classList.contains('tcm-map-ready') || map.querySelector('[data-map-pin]');
    const hasUsableList = Boolean(list?.children?.length);
    if (hasUsableMap && hasUsableList) return;
    const lang = currentLanguage();
    const text = lang === 'en'
      ? {
          title: 'Fast view is ready',
          body: 'The project list, search, filters, and source entry stay available first. Heavier map details will continue loading in the background.',
          action: 'Try again'
        }
      : {
          title: '快速檢視已可使用',
          body: '工程清單、搜尋、篩選與資料入口會先保持可用；較重的地圖細節會在背景繼續補上。',
          action: '重新整理'
        };
    status.classList.add('is-open', 'tcm-fast-fallback');
    status.innerHTML = `<article class="map-detail-card"><h3>${text.title}</h3><p>${text.body}</p><button type="button" data-refresh-map="true">${text.action}</button></article>`;
  }

  window.setTimeout(ensureFastFallback, 3200);
})();
