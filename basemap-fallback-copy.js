(() => {
  const isEnglish = () => document.documentElement.lang?.startsWith('en');
  const escapeText = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const copy = {
    zh: {
      title: '地圖暫時不穩，工程資料仍可使用',
      backup: '地圖背景來源暫時切換中，工程清單與搜尋仍可正常使用。',
      simple: '目前已切到簡化地圖背景，工程點位、路線、範圍、清單與搜尋仍可使用。'
    },
    en: {
      title: 'Map is unstable, project data still works',
      backup: 'The map background is switching to a backup source. Project list and search are still available.',
      simple: 'The map is now using a simplified background. Project points, routes, areas, list, and search still work.'
    }
  };

  window.addEventListener('tcm:basemap-fallback', event => {
    const status = document.querySelector('#mapStatus');
    if (!status) return;
    const lang = isEnglish() ? 'en' : 'zh';
    const text = copy[lang];
    const isSimple = event.detail?.to === 'Simplified local background';
    status.classList.add('is-open');
    status.innerHTML = `<article class="map-detail-card"><h3>${escapeText(text.title)}</h3><p>${escapeText(isSimple ? text.simple : text.backup)}</p></article>`;
  });
})();
