const SOURCE_CHROME_COPY = {
  zh: {
    headerAria: '網站導覽',
    brandAria: '回到台灣工程地圖首頁',
    brandEyebrow: '工程位置 × 資料入口 × 查證路線',
    brandTitle: '資料入口',
    brandSubtitle: 'Taiwan Construction Map',
    navAria: '主要連結',
    navMap: '工程地圖',
    navSources: '資料入口',
    navGuide: '補資料',
    footerTitle: '台灣工程地圖｜Taiwan Construction Map',
    dockAria: '快速操作',
    langAria: 'Switch to English',
    description: '台灣工程地圖資料入口：集中公共工程、採購決標、重大建設、道路挖掘、環評、建管、能源水利與地方開放資料平台。'
  },
  en: {
    headerAria: 'Site navigation',
    brandAria: 'Back to Taiwan Construction Map home',
    brandEyebrow: 'Project location × source portals × verification route',
    brandTitle: 'Source Portals',
    brandSubtitle: 'Taiwan Construction Map',
    navAria: 'Main links',
    navMap: 'Project map',
    navSources: 'Source portals',
    navGuide: 'Data guide',
    footerTitle: 'Taiwan Construction Map',
    dockAria: 'Quick actions',
    langAria: 'Switch to Chinese',
    description: 'Taiwan Construction Map source portals: public works, procurement awards, major infrastructure, road works, EIA, building permits, water, energy, and local open-data platforms in one mobile-friendly guide.'
  }
};

function sourceChromeLang() {
  return document.documentElement.lang === 'en' ? 'en' : 'zh';
}

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node && node.textContent !== value) node.textContent = value;
}

function setAttr(selector, name, value) {
  const node = document.querySelector(selector);
  if (node && node.getAttribute(name) !== value) node.setAttribute(name, value);
}

function applySourceChromeCopy() {
  const copy = SOURCE_CHROME_COPY[sourceChromeLang()];
  setAttr('.site-header', 'aria-label', copy.headerAria);
  setAttr('.brand', 'aria-label', copy.brandAria);
  setText('.brand .eyebrow', copy.brandEyebrow);
  setText('.brand h1 span:first-child', copy.brandTitle);
  setText('.brand h1 span:last-child', copy.brandSubtitle);
  setAttr('.nav-links', 'aria-label', copy.navAria);
  setText('.nav-links a[href="./index.html#mapArea"]', copy.navMap);
  setText('.nav-links a[aria-current="page"]', copy.navSources);
  setText('.nav-links a[href="./index.html#maintainPanel"]', copy.navGuide);
  setText('.site-footer p:first-child', copy.footerTitle);
  setAttr('.quick-dock', 'aria-label', copy.dockAria);
  setAttr('#sourceLanguageToggle', 'aria-label', copy.langAria);
  setAttr('meta[name="description"]', 'content', copy.description);
}

applySourceChromeCopy();
new MutationObserver(applySourceChromeCopy).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['lang']
});