const FOOTER_COPY = {
  zh: '工程位置、經費、期程與甲乙方資料，請以各主管機關、政府電子採購網、公共工程雲端服務網、建管、環評與地方圖台最新公告為準。地圖底圖與官方圖資來源，請以地圖上的即時來源註記為準。',
  en: 'For project location, budget, timeline, owner, and contractor data, please verify with the latest official notices from competent authorities, procurement portals, public works systems, building management, EIA records, and local map portals. Please follow the live map attribution for the active base map and official geospatial layers.'
};

const META_COPY = {
  zh: '台灣工程地圖：把公共工程、交通建設、道路管線、建築開發、環評與重大建設入口，整理成手機也好看的互動工程地圖；預設 OpenStreetMap，並提供官方電子地圖、灰階底圖、航照與地籍參考套疊切換。',
  en: 'Taiwan Construction Map gathers public works, transport infrastructure, road and utility works, building development, EIA records, and major project source portals into a mobile-friendly engineering map with OpenStreetMap by default and optional official street map, light map, aerial imagery, and cadastre reference overlays.'
};

let syncingFooter = false;

function footerLang() {
  return document.documentElement.lang?.toLowerCase().startsWith('en') ? 'en' : 'zh';
}

function syncFooterSourceNote() {
  const lang = footerLang();
  const footerText = document.querySelector('[data-i18n="footerText"]');
  const metaDescription = document.querySelector('meta[name="description"]');
  if (footerText && footerText.textContent !== FOOTER_COPY[lang]) footerText.textContent = FOOTER_COPY[lang];
  if (metaDescription && metaDescription.content !== META_COPY[lang]) metaDescription.content = META_COPY[lang];
}

function scheduleFooterSourceSync() {
  if (syncingFooter) return;
  syncingFooter = true;
  requestAnimationFrame(() => {
    syncFooterSourceNote();
    syncingFooter = false;
  });
}

const footerObserver = new MutationObserver(scheduleFooterSourceSync);
footerObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
footerObserver.observe(document.body, { childList: true, characterData: true, subtree: true });

scheduleFooterSourceSync();
