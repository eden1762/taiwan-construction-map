import { DATA_SOURCES } from './data/projects.js';

const LANG_KEY = 'taiwan-construction-map-language';
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

const zh = {
  pageTitle: '資料入口｜台灣工程地圖',
  eyebrow: '資料入口',
  title: '查工程，先找對入口。',
  intro: '公共工程、標案決標、重大建設、道路挖掘、環評、建管、能源水利與地方資料都放在這裡。工程公司、發包甲方、地圖控要查案，直接從這頁開圖。',
  label: '搜尋資料入口',
  placeholder: '例：決標、道路挖掘、環評、建照、捷運',
  back: '回工程地圖',
  fit: '適合查：',
  open: '前往資料入口',
  empty: '沒有符合的資料入口，換個關鍵字再試試。',
  button: 'EN',
  aria: 'Switch to English',
  footer: '資料請以各主管機關、採購、公共工程、建管、環評與地方圖台最新公告為準。'
};

const en = {
  pageTitle: 'Source Portals｜Taiwan Construction Map',
  eyebrow: 'Source portals',
  title: 'Find the right source before checking a project.',
  intro: 'Public works, tender awards, major infrastructure, road works, EIA, permits, water, energy, and local open data are gathered here for engineering teams, project owners, map lovers, and curious readers.',
  label: 'Search source portals',
  placeholder: 'Example: tender, road works, EIA, permit, MRT',
  back: 'Back to map',
  fit: 'Best for: ',
  open: 'Open source portal',
  empty: 'No matching source portal. Try another keyword.',
  button: '中',
  aria: 'Switch to Chinese',
  footer: 'Please verify project data with the latest official notices from competent authorities and local map portals.'
};

let currentLang = localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'zh';

function c(key) {
  const pack = currentLang === 'en' ? en : zh;
  return pack[key] || zh[key] || key;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  document.title = c('pageTitle');
  eyebrow.textContent = c('eyebrow');
  title.textContent = c('title');
  intro.textContent = c('intro');
  label.textContent = c('label');
  back.textContent = c('back');
  footer.textContent = c('footer');
  searchInput.placeholder = c('placeholder');
  langButton.textContent = c('button');
  langButton.setAttribute('aria-label', c('aria'));
  render();
}

function render() {
  const keyword = (searchInput.value || '').trim().toLowerCase();
  const list = DATA_SOURCES.filter(item => {
    const text = `${item.category} ${item.kind} ${item.name} ${item.fitFor} ${item.note}`.toLowerCase();
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
  h3.textContent = item.name;

  const fit = document.createElement('p');
  const strong = document.createElement('strong');
  strong.textContent = c('fit');
  fit.append(strong, document.createTextNode(currentLang === 'en' ? englishFit(item.fitFor) : item.fitFor));

  const note = document.createElement('p');
  note.textContent = currentLang === 'en' ? 'Use this portal to cross-check official records, maps, budgets, tenders, schedules, or project pages.' : item.note;

  const link = document.createElement('a');
  link.href = item.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = c('open');

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
  return 'Planning / budget / major public works';
}

function englishKind(text) {
  if (text.includes('官方主入口')) return 'Official main portal';
  if (text.includes('官方')) return 'Official portal';
  if (text.includes('圖台')) return 'Map portal';
  if (text.includes('施工')) return 'Construction lookup';
  if (text.includes('開放資料')) return 'Open data';
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
  return result.length ? [...new Set(result)].join(', ') : 'official project checks';
}

searchInput.addEventListener('input', render);
langButton.addEventListener('click', () => setLanguage(currentLang === 'zh' ? 'en' : 'zh'));
setLanguage(currentLang);
