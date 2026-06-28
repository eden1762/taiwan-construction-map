import { DATA_SOURCES } from './data/projects.js';

const LANG_KEY = 'tcmap.lang';
const OLD_LANG_KEY = 'taiwan-construction-map-language';
const searchInput = document.getElementById('sourceSearch');
const sourceCount = document.getElementById('sourceCount');
const sourceCards = document.getElementById('sourceCards');
const langButton = document.getElementById('sourceLanguageToggle');
const eyebrow = document.getElementById('sourcesEyebrow');
const title = document.getElementById('sourcesTitle');
const intro = document.getElementById('sourcesIntro');
const label = document.getElementById('sourceSearchLabel');
const back = document.getElementById('backToMap');
const footer = document.getElementById('sourcesFooter');
const brand = document.getElementById('sourceBrand');
const line = document.getElementById('sourceLine');
const nav = document.getElementById('mainNav');

const SECTORS = [
  ['public-works', '公共工程', 'Public Works'],
  ['roads', '道路', 'Roads'],
  ['utilities', '管線', 'Utilities'],
  ['metro', '捷運', 'Metro'],
  ['rail', '鐵路', 'Rail'],
  ['buildings', '建築', 'Buildings'],
  ['parks', '園區', 'Parks'],
  ['planning', '規劃', 'Planning'],
  ['eia', '環評', 'Environmental Review'],
  ['uncrewed', '無人載具', 'Uncrewed Systems'],
  ['ai', 'AI', 'AI'],
  ['other', '其他', 'Other']
];

const MENU = [
  { type: 'home', zh: '全國工程概況', en: 'National Overview', href: './index.html' },
  ...SECTORS.map(([key, zh, en]) => ({ type: 'sector', zh, en, href: `./category.html?sector=${encodeURIComponent(key)}` })),
  { type: 'sources', zh: '資料入口', en: 'Data Sources', href: './sources.html' }
];

const zh = {
  pageTitle: '資料入口｜台灣工程地圖',
  brand: '台灣工程地圖',
  line: '全國工程概況 × 分類地圖 × 資料入口',
  eyebrow: '資料入口',
  title: '查工程，先找對入口。',
  intro: '公共工程、標案決標、重大建設、道路挖掘、環評、建管、能源水利、園區、無人載具、AI 與地方資料都放在這裡。工程公司、發包甲方、地圖控要查案，直接從這頁開圖。',
  label: '搜尋資料入口',
  placeholder: '例：決標、道路挖掘、環評、建照、捷運、無人機、AI',
  back: '回全國工程概況',
  fit: '適合查：',
  open: '前往資料入口',
  empty: '沒有符合的資料入口，換個關鍵字再試試。',
  button: 'EN',
  aria: 'Switch to English',
  footer: '資料請以各主管機關、採購、公共工程、建管、環評與地方圖台最新公告為準。'
};

const en = {
  pageTitle: 'Data Sources｜Taiwan Construction Map',
  brand: 'Taiwan Construction Map',
  line: 'National overview × sector maps × source portals',
  eyebrow: 'Data Sources',
  title: 'Find the right source before checking a project.',
  intro: 'Public works, tenders, awards, major infrastructure, road works, EIA, permits, water, energy, parks, uncrewed systems, AI, and local open data are gathered here for engineering teams, project owners, map lovers, and curious readers.',
  label: 'Search source portals',
  placeholder: 'Example: tender, road works, EIA, permit, MRT, drones, AI',
  back: 'Back to national overview',
  fit: 'Best for: ',
  open: 'Open source portal',
  empty: 'No matching source portal. Try another keyword.',
  button: '中',
  aria: 'Switch to Chinese',
  footer: 'Please verify project data with the latest official notices from competent authorities and local map portals.'
};

const SOURCE_NAME_EN = {
  '行政院公共工程委員會': 'Public Construction Commission',
  '公共工程雲端服務網': 'Public Construction Cloud Service',
  '政府電子採購網': 'Government e-Procurement System',
  '公共工程標案管理系統': 'Public Works Tender Management System',
  '台灣採購公報網': 'Taiwan Procurement Gazette',
  '國發會重大公共建設計畫': 'NDC Major Public Construction Plans',
  '重大公共建設年度預算先期作業': 'Major Public Construction Annual Budget Review',
  '行政院重要政策／重大建設': 'Executive Yuan Major Policies and Infrastructure',
  '公共政策網路參與平臺 JOIN': 'JOIN Public Policy Participation Platform',
  '政府資料開放平臺': 'Taiwan Government Open Data Platform',
  '交通部重要公共建設計畫': 'MOTC Major Public Construction Plans',
  '交通部鐵道局': 'Railway Bureau, MOTC',
  '交通部公路局': 'Highway Bureau, MOTC',
  '公路局施工路段查詢': 'Highway Bureau Work Zone Lookup',
  '高速公路局': 'Freeway Bureau, MOTC',
  '臺北市政府捷運工程局': 'Taipei Department of Rapid Transit Systems',
  '新北市政府捷運工程局': 'New Taipei Department of Rapid Transit Systems',
  '桃園市政府捷運工程局': 'Taoyuan Department of Rapid Transit Systems',
  '臺中市交通局／捷運工程': 'Taichung Transportation Bureau / MRT Projects',
  '高雄市政府捷運工程局': 'Kaohsiung Mass Rapid Transit Bureau',
  '臺南市交通局捷運相關頁': 'Tainan Transportation Bureau / MRT Planning',
  '環境部環評書件查詢系統': 'Ministry of Environment EIA Document Search',
  '全國土地使用分區資料查詢系統': 'National Land Use Zoning Lookup',
  '內政部國土管理署': 'National Land Management Agency, MOI',
  '國土測繪圖資服務雲': 'NLSC Maps and Geospatial Data Cloud',
  '地籍圖資網路便民服務系統': 'Online Cadastral Map Service',
  '臺北市道路挖掘管理中心': 'Taipei Road Excavation Management Center',
  '新北 iRoad 智慧道路管理中心': 'New Taipei iRoad Smart Road Management Center',
  '桃園市道路挖掘／道管資訊中心': 'Taoyuan Road Excavation and Road Management Center',
  '臺南市政府工務局': 'Tainan Public Works Bureau',
  '高雄市政府工務局': 'Kaohsiung Public Works Bureau',
  '臺北市建管業務 e 辦網': 'Taipei Building Administration Online Service',
  '新北市建管便民服務資訊網': 'New Taipei Building Management Service',
  '臺中市建築執照存根查詢系統': 'Taichung Building Permit Record Search',
  '高雄市建築管理系統': 'Kaohsiung Building Management System',
  '桃園市建築管理資訊系統': 'Taoyuan Building Management Information System',
  '全國建築管理系統入口網': 'National Building Management Portal',
  '內政部不動產交易實價查詢服務網': 'MOI Real Estate Transaction Price Lookup',
  '經濟部水利署': 'Water Resources Agency, MOEA',
  '台灣電力公司': 'Taiwan Power Company',
  '台灣中油': 'CPC Corporation, Taiwan',
  '交通部航港局': 'Maritime and Port Bureau, MOTC',
  '臺灣港務公司': 'Taiwan International Ports Corporation',
  '經濟部產業園區管理局': 'Industrial Parks Administration, MOEA',
  '國科會科學園區': 'National Science and Technology Council Science Parks',
  '臺北市資料大平台': 'Taipei Open Data Platform',
  '新北市政府資料開放平台': 'New Taipei Open Data Platform',
  '桃園開放資料平台': 'Taoyuan Open Data Platform',
  '臺中市政府資料開放平台': 'Taichung Open Data Platform',
  '臺南市政府資料開放平台': 'Tainan Open Data Platform',
  '高雄市政府資料開放平台': 'Kaohsiung Open Data Platform'
};

let currentLang = safeGetLang();

function c(key) {
  const pack = currentLang === 'en' ? en : zh;
  return pack[key] || zh[key] || key;
}

function renderMenu() {
  if (!nav) return;
  nav.innerHTML = MENU.map(item => {
    const active = item.type === 'sources';
    return `<a href="${item.href}" ${active ? 'aria-current="page"' : ''}>${currentLang === 'en' ? item.en : item.zh}</a>`;
  }).join('');
}

function setLanguage(lang) {
  currentLang = lang === 'en' ? 'en' : 'zh';
  safeSetLang(currentLang);
  document.documentElement.lang = currentLang === 'zh' ? 'zh-Hant' : 'en';
  document.title = c('pageTitle');
  brand.textContent = c('brand');
  line.textContent = c('line');
  eyebrow.textContent = c('eyebrow');
  title.textContent = c('title');
  intro.textContent = c('intro');
  label.textContent = c('label');
  back.textContent = c('back');
  footer.textContent = c('footer');
  searchInput.placeholder = c('placeholder');
  langButton.textContent = c('button');
  langButton.setAttribute('aria-label', c('aria'));
  renderMenu();
  render();
}

function render() {
  const keyword = normalize(searchInput.value);
  const list = DATA_SOURCES.filter(item => {
    const text = normalize(`${item.category} ${item.kind} ${item.name} ${englishSourceName(item.name)} ${item.fitFor} ${item.note}`);
    return keyword === '' || text.includes(keyword);
  });

  sourceCount.textContent = currentLang === 'en' ? `Showing ${list.length} source portals` : `目前顯示 ${list.length} 個資料入口`;
  sourceCards.replaceChildren();

  if (list.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'sources-empty';
    empty.textContent = c('empty');
    sourceCards.append(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  list.forEach(item => fragment.append(createCard(item)));
  sourceCards.append(fragment);
}

function createCard(item) {
  const article = document.createElement('article');
  article.className = 'source-card';

  const top = document.createElement('div');
  top.className = 'source-topline';

  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = currentLang === 'en' ? englishCategory(item.category) : item.category;

  const kind = document.createElement('span');
  kind.textContent = currentLang === 'en' ? englishKind(item.kind) : item.kind;
  top.append(badge, kind);

  const h3 = document.createElement('h3');
  h3.textContent = currentLang === 'en' ? englishSourceName(item.name) : item.name;

  const fit = document.createElement('p');
  const strong = document.createElement('strong');
  strong.textContent = c('fit');
  fit.append(strong, document.createTextNode(currentLang === 'en' ? englishFit(item.fitFor) : item.fitFor));

  const note = document.createElement('p');
  note.textContent = currentLang === 'en'
    ? 'Use this portal to cross-check official records, maps, budgets, tenders, schedules, or project pages.'
    : item.note;

  const link = document.createElement('a');
  link.href = item.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = c('open');
  link.setAttribute('aria-label', currentLang === 'en' ? `Open ${englishSourceName(item.name)}` : `開啟${item.name}`);

  article.append(top, h3, fit, note, link);
  return article;
}

function englishCategory(text) {
  if (text.includes('標案') || text.includes('決標')) return 'Public works / tenders / awards';
  if (text.includes('交通') || text.includes('鐵路') || text.includes('捷運')) return 'Transit / roads / rail / MRT';
  if (text.includes('環評') || text.includes('土地') || text.includes('圖資')) return 'EIA / land / planning / maps';
  if (text.includes('道路') || text.includes('管線')) return 'Road excavation / utilities / live works';
  if (text.includes('建築') || text.includes('建照')) return 'Building works / permits';
  if (text.includes('水利') || text.includes('能源') || text.includes('港灣') || text.includes('園區')) return 'Water / energy / ports / parks';
  if (text.includes('地方政府')) return 'Local open data';
  return 'Planning / budget / major public works';
}

function englishKind(text) {
  if (text.includes('官方主入口')) return 'Official main portal';
  if (text.includes('官方系統')) return 'Official system';
  if (text.includes('官方')) return 'Official portal';
  if (text.includes('圖台')) return 'Map portal';
  if (text.includes('施工')) return 'Construction lookup';
  if (text.includes('開放資料')) return 'Open data';
  if (text.includes('捷運工程')) return 'MRT project office';
  if (text.includes('市場輔助')) return 'Market reference';
  return 'Data portal';
}

function englishFit(text) {
  const result = [];
  if (text.includes('採購') || text.includes('標案') || text.includes('決標')) result.push('tenders and awards');
  if (text.includes('進度') || text.includes('工期')) result.push('progress and schedules');
  if (text.includes('道路') || text.includes('管線')) result.push('road and utility works');
  if (text.includes('捷運') || text.includes('鐵路')) result.push('rail and MRT projects');
  if (text.includes('環評')) result.push('EIA documents');
  if (text.includes('建照') || text.includes('建築')) result.push('building permits');
  if (text.includes('圖資') || text.includes('地籍')) result.push('maps and cadastral checks');
  if (text.includes('水利') || text.includes('防洪')) result.push('water resources and flood control');
  if (text.includes('能源') || text.includes('電力')) result.push('energy infrastructure');
  if (text.includes('港灣') || text.includes('碼頭')) result.push('port and marine works');
  if (text.includes('無人') || text.includes('UAV')) result.push('uncrewed systems');
  if (text.includes('AI') || text.includes('人工智慧')) result.push('AI infrastructure');
  return result.length ? [...new Set(result)].join(', ') : 'official project checks';
}

function englishSourceName(name) {
  return SOURCE_NAME_EN[name] || name.replaceAll('臺', 'Tai').replaceAll('台', 'Taiwan ');
}

function safeGetLang() {
  try {
    const v = localStorage.getItem(LANG_KEY) || localStorage.getItem(OLD_LANG_KEY);
    return v === 'en' ? 'en' : 'zh';
  } catch {
    return 'zh';
  }
}

function safeSetLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
    localStorage.setItem(OLD_LANG_KEY, lang);
  } catch {
    return false;
  }
  return true;
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

searchInput.addEventListener('input', render);
langButton.addEventListener('click', () => setLanguage(currentLang === 'zh' ? 'en' : 'zh'));
setLanguage(currentLang);
