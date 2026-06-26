const FALLBACK_COPY = {
  zh: {
    mapEyebrowOld: 'OpenStreetMap 電子地圖',
    mapEyebrowNew: '互動工程地圖',
    footerOld: '工程位置、經費、期程與甲乙方資料，請以各主管機關、政府電子採購網、公共工程雲端服務網、建管、環評與地方圖台最新公告為準。地圖底圖 © OpenStreetMap contributors。',
    footerNew: '工程位置、經費、期程與甲乙方資料，請以各主管機關、政府電子採購網、公共工程雲端服務網、建管、環評與地方圖台最新公告為準。地圖底圖與官方圖資來源，請以地圖上的即時來源註記為準。',
    metaDescription: '台灣工程地圖：把公共工程、交通建設、道路管線、建築開發、環評與重大建設入口，整理成手機也好看的互動工程地圖；預設 OpenStreetMap，並提供官方電子地圖、灰階底圖、航照與地籍參考套疊切換。',
    sourceButton: '開資料入口',
    sourcePageLink: '開啟資料入口新頁 ↗',
    sourcePageAria: '開啟台灣工程資料入口新頁'
  },
  en: {
    mapEyebrowOld: 'OpenStreetMap map',
    mapEyebrowNew: 'Interactive engineering map',
    footerOld: 'For project location, budget, timeline, owner, and contractor data, please verify with the latest official notices from competent authorities, procurement portals, public works systems, building management, EIA records, and local map portals. Map base © OpenStreetMap contributors.',
    footerNew: 'For project location, budget, timeline, owner, and contractor data, verify the latest official notices from competent authorities, procurement portals, public works systems, building management, EIA records, and local map portals. For base maps and official geospatial layers, follow the live attribution shown on the map.',
    metaDescription: 'Taiwan Construction Map turns public works, transport projects, road and utility works, building development, EIA records, and major infrastructure source portals into a mobile-friendly engineering map. OpenStreetMap is the default base map, with official street maps, light maps, aerial imagery, and cadastre reference overlays available when needed.',
    sourceButton: 'Open sources',
    sourcePageLink: 'Open source portals ↗',
    sourcePageAria: 'Open Taiwan construction source portals in a new page'
  }
};

let guardQueued = false;

function currentLang() {
  return document.documentElement.lang === 'en' ? 'en' : 'zh';
}

function setTextIfChanged(element, text) {
  if (element && element.textContent !== text) element.textContent = text;
}

function setAttrIfChanged(element, name, value) {
  if (element && element.getAttribute(name) !== value) element.setAttribute(name, value);
}

function guardMapAndFooterCopy() {
  guardQueued = false;
  const lang = currentLang();
  const copy = FALLBACK_COPY[lang];
  const mapEyebrow = document.querySelector('[data-i18n="mapEyebrow"]');
  const footerText = document.querySelector('[data-i18n="footerText"]');
  const metaDescription = document.querySelector('meta[name="description"]');
  const sourceCards = document.querySelector('#sourceCards.home-source-grid');
  const sourceButton = document.querySelector('#toggleSources');
  const sourceNav = document.querySelector('[data-i18n="navSources"]');
  const sourcePageLink = document.querySelector('.source-page-link');

  if (mapEyebrow && mapEyebrow.textContent.trim() === copy.mapEyebrowOld) {
    setTextIfChanged(mapEyebrow, copy.mapEyebrowNew);
  }

  if (footerText && footerText.textContent.trim() === copy.footerOld) {
    setTextIfChanged(footerText, copy.footerNew);
  }

  if (metaDescription) {
    setAttrIfChanged(metaDescription, 'content', copy.metaDescription);
  }

  if (sourceCards) {
    if (sourceCards.childElementCount) sourceCards.replaceChildren();
    setAttrIfChanged(sourceCards, 'aria-hidden', 'true');
  }

  [sourceNav, sourcePageLink].forEach(link => {
    if (!link) return;
    setAttrIfChanged(link, 'href', './sources.html');
    setAttrIfChanged(link, 'target', '_blank');
    setAttrIfChanged(link, 'rel', 'noopener noreferrer');
  });

  if (sourcePageLink) {
    setTextIfChanged(sourcePageLink, copy.sourcePageLink);
    setAttrIfChanged(sourcePageLink, 'aria-label', copy.sourcePageAria);
  }

  if (sourceButton) {
    setTextIfChanged(sourceButton, copy.sourceButton);
    sourceButton.dataset.sourceGuarded = 'true';
  }
}

function queueGuard() {
  if (guardQueued) return;
  guardQueued = true;
  requestAnimationFrame(guardMapAndFooterCopy);
}

function openSourcePage(event) {
  const button = event.target.closest?.('#toggleSources');
  if (!button) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  window.open('./sources.html', '_blank', 'noopener,noreferrer');
}

document.addEventListener('click', openSourcePage, true);

guardMapAndFooterCopy();

const observer = new MutationObserver(queueGuard);
observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['lang']
});

document.addEventListener('taiwan-map:language-change', queueGuard);
document.addEventListener('taiwan-map:basemap-change', queueGuard);
