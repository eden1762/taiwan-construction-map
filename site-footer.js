const FOOTER_COPY = {
  zh: '工程位置、經費、期程與甲乙方資料，請以各主管機關、政府電子採購網、公共工程雲端服務網、建管、環評與地方圖台最新公告為準。地圖底圖與官方圖資來源，請以地圖上的即時來源註記為準。',
  en: 'For project location, budget, timeline, owner, and contractor data, please verify with the latest official notices from competent authorities, procurement portals, public works systems, building management, EIA records, and local map portals. Please follow the live map attribution for the active base map and official geospatial layers.'
};

function footerLang() {
  return document.documentElement.lang?.toLowerCase().startsWith('en') ? 'en' : 'zh';
}

function syncFooterSourceNote() {
  const footerText = document.querySelector('[data-i18n="footerText"]');
  if (!footerText) return;
  const nextText = FOOTER_COPY[footerLang()];
  if (footerText.textContent !== nextText) footerText.textContent = nextText;
}

const footerObserver = new MutationObserver(syncFooterSourceNote);
footerObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
footerObserver.observe(document.body, { childList: true, subtree: true });

syncFooterSourceNote();
