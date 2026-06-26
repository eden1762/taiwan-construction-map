const META_COPY = {
  zh: '台灣工程地圖：把公共工程、交通建設、道路管線、建築開發、環評與重大建設入口，整理成手機也好看的互動工程地圖；預設 OpenStreetMap，並提供官方電子地圖、灰階底圖、航照與地籍參考套疊切換。',
  en: 'Taiwan Construction Map turns public works, transport projects, road and utility works, building development, EIA records, and major infrastructure source portals into a mobile-friendly engineering map. OpenStreetMap is the default base map, with official street maps, light maps, aerial imagery, and cadastre reference overlays available when needed.'
};

let metaQueued = false;

function currentLang() {
  return document.documentElement.lang === 'en' ? 'en' : 'zh';
}

function syncMetaDescription() {
  metaQueued = false;
  const meta = document.querySelector('meta[name="description"]');
  if (!meta) return;
  const next = META_COPY[currentLang()];
  if (meta.getAttribute('content') !== next) meta.setAttribute('content', next);
}

function queueMetaSync() {
  if (metaQueued) return;
  metaQueued = true;
  requestAnimationFrame(syncMetaDescription);
}

syncMetaDescription();

new MutationObserver(queueMetaSync).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['lang']
});
