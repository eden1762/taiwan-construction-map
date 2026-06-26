const FALLBACK_COPY = {
  zh: {
    mapEyebrowOld: 'OpenStreetMap 電子地圖',
    mapEyebrowNew: '互動工程地圖',
    footerOld: '工程位置、經費、期程與甲乙方資料，請以各主管機關、政府電子採購網、公共工程雲端服務網、建管、環評與地方圖台最新公告為準。地圖底圖 © OpenStreetMap contributors。',
    footerNew: '工程位置、經費、期程與甲乙方資料，請以各主管機關、政府電子採購網、公共工程雲端服務網、建管、環評與地方圖台最新公告為準。地圖底圖與官方圖資來源，請以地圖上的即時來源註記為準。'
  },
  en: {
    mapEyebrowOld: 'OpenStreetMap map',
    mapEyebrowNew: 'Interactive engineering map',
    footerOld: 'For project location, budget, timeline, owner, and contractor data, please verify with the latest official notices from competent authorities, procurement portals, public works systems, building management, EIA records, and local map portals. Map base © OpenStreetMap contributors.',
    footerNew: 'For project location, budget, timeline, owner, and contractor data, verify the latest official notices from competent authorities, procurement portals, public works systems, building management, EIA records, and local map portals. For base maps and official geospatial layers, follow the live attribution shown on the map.'
  }
};

function currentLang() {
  return document.documentElement.lang === 'en' ? 'en' : 'zh';
}

function guardMapAndFooterCopy() {
  const lang = currentLang();
  const copy = FALLBACK_COPY[lang];
  const mapEyebrow = document.querySelector('[data-i18n="mapEyebrow"]');
  const footerText = document.querySelector('[data-i18n="footerText"]');
  const metaDescription = document.querySelector('meta[name="description"]');

  if (mapEyebrow && mapEyebrow.textContent.trim() === copy.mapEyebrowOld) {
    mapEyebrow.textContent = copy.mapEyebrowNew;
  }

  if (footerText && footerText.textContent.trim() === copy.footerOld) {
    footerText.textContent = copy.footerNew;
  }

  if (metaDescription && metaDescription.content.includes('OpenStreetMap 電子地圖')) {
    metaDescription.content = '台灣工程地圖：把公共工程、交通建設、道路管線、建築開發、環評與重大建設入口，整理成手機也好看的互動工程地圖，預設 OpenStreetMap，並可切換官方圖資參考。';
  }
}

guardMapAndFooterCopy();

const observer = new MutationObserver(() => guardMapAndFooterCopy());
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  characterData: true,
  attributes: true,
  attributeFilter: ['lang']
});

document.addEventListener('taiwan-map:basemap-change', guardMapAndFooterCopy);