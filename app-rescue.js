import { PROJECTS, PROJECT_TYPES, DATA_SOURCES } from './data/projects.js';

const LANG_KEY = 'taiwan-construction-map-language';
const DEFAULT_VIEW = { lat: 23.78, lng: 120.98, zoom: 7 };
const TILE_SIZE = 256;
const MIN_ZOOM = 6;
const MAX_ZOOM = 12;

const copy = {
  zh: {
    skipLink: '跳到工程資訊', brandEyebrow: '工程位置 × 進度 × 甲乙方', brandTitle: '台灣工程地圖', brandSubtitle: 'Taiwan Construction Map', navMap: '工程地圖', navSources: '資料入口', navGuide: '補資料',
    heroPill: '工程熱點先顯示；不用等底圖，手機速度更穩。', heroTitle: '台灣正在升級的地方，一張圖先 get。', heroText: '給工程公司、發包甲方、地圖控與年輕使用者看的工程雷達。先看位置與施工範圍，再看甲方、乙方、開工日、預計完工與啟用日；資訊不迷路，城市進度直接開圖。',
    metricProjects: '工程/資料圖層', metricCost: '工程級距總覽', metricSources: '可查資料入口', panelEyebrow: '工程雷達', panelTitle: '先找地點，再看工程脈絡', panelText: '輸入地名、工程名、廠商或發包單位，快速定位。適合估案、查進度、看城市變化，也適合地圖玩家開圖探索。',
    searchLabel: '搜尋', searchPlaceholder: '例：淡江大橋、高雄捷運、工信工程、道路挖掘', typeLabel: '類型', typeAll: '全部類型', statusLabel: '狀態', statusAll: '全部狀態', resetMap: '回到全台', toggleSources: '開資料入口',
    legendPublic: '公共工程', legendTransit: '捷運/交通', legendRoad: '道路/管線', legendPlanning: '規劃/環評', legendBuilding: '建築/園區', mapEyebrow: '互動工程地圖', mapTitle: '台灣工程現場一眼看', mapNote: '工程熱點、路線與範圍會先出現；手機瀏覽時先順滑看內容，需要移動地圖時再點一下啟用。', mapLoading: '工程熱點準備中，清單仍可先查。',
    sourcesEyebrow: '資料入口', sourcesTitle: '工程資料很分散，要分層查才準。', sourcesText: '公共工程、採購決標、重大建設、道路挖掘、環評、建管、能源水利與地方開放資料各有入口。完整清單已整理到獨立頁面，手機不用一路滑到天荒地老。',
    guideEyebrow: '補資料指南', guideTitle: '資料要好用，關鍵是位置、來源與欄位一致。', guide1Title: '1. 補上工程基本盤', guide1Text: '工程名、地點、甲方、乙方、經費、開工日、預計完工日與啟用日要盡量完整，查案才順。', guide2Title: '2. 標清楚施工範圍', guide2Text: '橋梁、道路、捷運適合畫路線；園區與基地適合畫範圍；單一設施用標記點。地圖準，信任感就上來。', guide3Title: '3. 來源要能回查', guide3Text: '每筆資料都盡量附官方公告、採購資料、工程頁面或地方圖台。看到來源，資訊力直接 up。', guide4Title: '4. 手機先好用', guide4Text: '現場人員、通勤族、地圖控多半用手機看；清單、篩選、地圖點擊都要單手可用、載入快速。',
    footerTitle: '台灣工程地圖｜Taiwan Construction Map', footerText: '工程位置、經費、期程與甲乙方資料，請以各主管機關、政府電子採購網、公共工程雲端服務網、建管、環評與地方圖台最新公告為準。本頁工程熱點為快速定位用，精準範圍請回查來源。',
    owner: '甲方', contractor: '乙方', source: '資料來源', cost: '經費/級距', area: '施工範圍', startDate: '開工日期', expectedFinish: '預計完工日', expectedOpen: '預計啟用日', emptyTitle: '沒有符合條件的工程', emptyText: '換個地名、工程名、甲方或乙方再試試。', openSource: '打開資料來源 ↗', openMap: '開位置參考 ↗', missing: '待官方資料回填', langButton: 'EN', mapReady: '工程熱點地圖已就緒，不再等待外部底圖。', moveMap: '啟用地圖', lockMap: '鎖住地圖'
  },
  en: {
    skipLink: 'Skip to engineering info', brandEyebrow: 'Location × Progress × Owner / Contractor', brandTitle: 'Taiwan Construction Map', brandSubtitle: 'Engineering Radar', navMap: 'Map', navSources: 'Sources', navGuide: 'Data guide',
    heroPill: 'Project hotspots load first; no base-map waiting on mobile.', heroTitle: 'Taiwan’s upgrades, mapped in one view.', heroText: 'A construction radar for engineering firms, project owners, map lovers, and younger readers. Check location, work area, owner, contractor, start date, target finish, and opening timeline without getting lost in scattered sources.',
    metricProjects: 'Projects / layers', metricCost: 'Cost levels', metricSources: 'Source portals', panelEyebrow: 'Engineering radar', panelTitle: 'Find a place, then read the project story', panelText: 'Search by place, project name, contractor, or owner. Useful for bid scouting, progress checks, city watching, and map exploration.',
    searchLabel: 'Search', searchPlaceholder: 'Example: Tamkang Bridge, Kaohsiung MRT, road works', typeLabel: 'Type', typeAll: 'All types', statusLabel: 'Status', statusAll: 'All status', resetMap: 'Taiwan view', toggleSources: 'Open sources',
    legendPublic: 'Public works', legendTransit: 'Transit / traffic', legendRoad: 'Road / utilities', legendPlanning: 'Planning / EIA', legendBuilding: 'Buildings / parks', mapEyebrow: 'Interactive engineering map', mapTitle: 'Construction sites at a glance', mapNote: 'Project hotspots, routes, and areas appear first. On mobile, page scrolling comes first; tap once when you want to move the map.', mapLoading: 'Project hotspots are preparing. The list is still ready.',
    sourcesEyebrow: 'Source portals', sourcesTitle: 'Engineering data is scattered. Layered checking is the smart move.', sourcesText: 'The full source list is on a separate page for faster mobile browsing.',
    guideEyebrow: 'Data guide', guideTitle: 'Good data needs clear location, source, and fields.', guide1Title: '1. Add the core project facts', guide1Text: 'Project name, location, owner, contractor, budget, start date, target finish, and opening date make case tracking smoother.', guide2Title: '2. Mark the work area clearly', guide2Text: 'Bridges, roads, and rail lines work well as routes; parks and campuses need area shapes; single facilities can use pins.', guide3Title: '3. Keep sources traceable', guide3Text: 'Attach official notices, procurement records, project pages, or local map portals whenever possible.', guide4Title: '4. Mobile-first for real users', guide4Text: 'Lists, filters, and map taps should be easy with one hand and quick to load.',
    footerTitle: 'Taiwan Construction Map', footerText: 'For project location, budget, timeline, owner, and contractor data, verify the latest official notices. Hotspots are for quick orientation; verify exact boundaries with sources.',
    owner: 'Owner', contractor: 'Contractor', source: 'Source', cost: 'Cost / level', area: 'Work area', startDate: 'Start date', expectedFinish: 'Target finish', expectedOpen: 'Target opening', emptyTitle: 'No matching projects', emptyText: 'Try another place, project name, owner, or contractor.', openSource: 'Open source ↗', openMap: 'Open location reference ↗', missing: 'Pending official data', langButton: '中', mapReady: 'The engineering hotspot map is ready without waiting for an external base map.', moveMap: 'Move map', lockMap: 'Lock map'
  }
};

const statusEn = { '施工中': 'Under construction', '規劃/招標準備': 'Planning / tender prep', '規劃/審查資料源': 'Planning / review source', '規劃/預算資料源': 'Planning / budget source', '規劃/施工並行': 'Planning and staged construction', '規劃/環評資料源': 'Planning / EIA source', '即時資料源': 'Live data source', '資料源': 'Data source' };
const typeEn = { public: 'Public works', transit: 'Transit / transport', road: 'Road / utilities', planning: 'Planning / EIA', building: 'Buildings / campuses', energy: 'Water / energy / ports' };
const cities = [[25.04,121.56,'台北','Taipei'],[24.99,121.31,'桃園','Taoyuan'],[24.15,120.67,'台中','Taichung'],[23.48,120.45,'嘉義','Chiayi'],[22.99,120.21,'台南','Tainan'],[22.63,120.30,'高雄','Kaohsiung'],[23.99,121.60,'花蓮','Hualien'],[22.76,121.15,'台東','Taitung']];
const outline = [[25.30,121.55],[25.18,121.75],[24.70,121.88],[24.22,121.72],[23.70,121.58],[23.18,121.43],[22.70,121.20],[22.17,120.90],[21.90,120.78],[22.12,120.58],[22.55,120.33],[23.05,120.12],[23.55,120.04],[24.05,120.18],[24.55,120.48],[24.98,120.90],[25.30,121.55]];

const refs = {
  search: document.getElementById('searchInput'), type: document.getElementById('typeFilter'), status: document.getElementById('statusFilter'), list: document.getElementById('projectList'), map: document.getElementById('map'), statusBox: document.getElementById('mapStatus'), reset: document.getElementById('resetMap'), sources: document.getElementById('toggleSources'), lang: document.getElementById('languageToggle'), metricProjects: document.getElementById('metricProjects'), metricCost: document.getElementById('metricCost'), metricSources: document.getElementById('metricSources')
};

let lang = localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'zh';
let view = { ...DEFAULT_VIEW };
let activeId = '';
let mapActive = false;
let drag = null;

init();

function init() {
  refs.metricProjects.textContent = PROJECTS.length;
  refs.metricCost.textContent = lang === 'en' ? 'Multi-level' : '多層級';
  refs.metricSources.textContent = DATA_SOURCES.length;
  fillFilters();
  applyLang();
  bind();
  renderAll();
}

function bind() {
  refs.search.addEventListener('input', renderAll);
  refs.type.addEventListener('change', renderAll);
  refs.status.addEventListener('change', renderAll);
  refs.reset.addEventListener('click', () => { refs.search.value = ''; refs.type.value = 'all'; refs.status.value = 'all'; view = { ...DEFAULT_VIEW }; activeId = ''; renderAll(); });
  refs.sources.addEventListener('click', () => window.open('./sources.html', '_blank', 'noopener,noreferrer'));
  refs.lang.addEventListener('click', () => { lang = lang === 'zh' ? 'en' : 'zh'; localStorage.setItem(LANG_KEY, lang); fillFilters(); applyLang(); renderAll(); });
  window.addEventListener('resize', () => renderMap(filteredProjects(), true));
}

function fillFilters() {
  const oldType = refs.type.value || 'all';
  const oldStatus = refs.status.value || 'all';
  refs.type.replaceChildren(new Option(t('typeAll'), 'all'));
  Object.entries(PROJECT_TYPES).forEach(([key, value]) => refs.type.add(new Option(lang === 'en' ? typeEn[key] || key : value.label, key)));
  refs.status.replaceChildren(new Option(t('statusAll'), 'all'));
  [...new Set(PROJECTS.map(item => item.status))].forEach(value => refs.status.add(new Option(lang === 'en' ? statusEn[value] || value : value, value)));
  refs.type.value = oldType;
  refs.status.value = oldStatus;
}

function applyLang() {
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-Hant';
  document.title = lang === 'en' ? 'Taiwan Construction Map｜Engineering Radar' : '台灣工程地圖｜Taiwan Construction Map';
  document.querySelectorAll('[data-i18n]').forEach(node => { if (typeof t(node.dataset.i18n) === 'string') node.textContent = t(node.dataset.i18n); });
  refs.search.placeholder = t('searchPlaceholder');
  refs.lang.textContent = t('langButton');
  refs.metricCost.textContent = lang === 'en' ? 'Multi-level' : '多層級';
}

function renderAll() {
  const projects = filteredProjects();
  renderList(projects);
  renderMap(projects);
  showHint(projects.length ? (lang === 'en' ? `Showing ${projects.length} project hotspots.` : `目前顯示 ${projects.length} 個工程熱點。`) : t('emptyText'));
}

function filteredProjects() {
  const keyword = (refs.search.value || '').trim().toLowerCase();
  return PROJECTS.filter(item => {
    const text = `${item.name} ${item.shortName} ${item.region} ${item.owner} ${item.contractor} ${item.summary} ${item.area} ${item.sourceLabel} ${item.tags?.join(' ')}`.toLowerCase();
    return (refs.type.value === 'all' || item.type === refs.type.value) && (refs.status.value === 'all' || item.status === refs.status.value) && (!keyword || text.includes(keyword));
  });
}

function renderList(projects) {
  refs.list.replaceChildren();
  if (!projects.length) {
    const empty = document.createElement('article');
    empty.className = 'project-card empty';
    empty.innerHTML = `<h3>${esc(t('emptyTitle'))}</h3><p>${esc(t('emptyText'))}</p>`;
    refs.list.append(empty);
    return;
  }
  const fragment = document.createDocumentFragment();
  projects.forEach(item => {
    const card = document.createElement('article');
    card.className = `project-card${item.id === activeId ? ' active' : ''}`;
    card.tabIndex = 0;
    card.dataset.projectId = item.id;
    card.innerHTML = `<div class="meta-row"><span class="badge">${esc(typeLabel(item))}</span><span class="badge status">${esc(statusLabel(item.status))}</span><span class="badge confidence">${esc(item.confidence || t('missing'))}</span></div><h3>${esc(projectName(item))}</h3><p>${esc(item.region)}｜${esc(item.summary || item.area || '')}</p><div class="mini-facts"><span>${esc(t('owner'))}：${esc(short(item.owner, 18))}</span><span>${esc(t('contractor'))}：${esc(short(item.contractor, 18))}</span></div>`;
    card.addEventListener('click', () => selectProject(item.id));
    card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectProject(item.id); } });
    fragment.append(card);
  });
  refs.list.append(fragment);
}

function renderMap(projects, keepStatus = false) {
  const width = Math.max(refs.map.clientWidth || 360, 320);
  const height = Math.max(refs.map.clientHeight || 320, 250);
  refs.map.classList.toggle('map-touch-active', mapActive);
  refs.map.innerHTML = `<div class="real-map local-map" style="width:${width}px;height:${height}px"><svg class="local-base-map" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" aria-hidden="true">${baseSvg(width, height)}</svg><svg class="map-overlay" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${projectSvg(projects, width, height)}</svg><button type="button" class="map-touch-toggle">${esc(mapActive ? t('lockMap') : t('moveMap'))}</button><div class="map-zoom-control" aria-label="地圖縮放"><button type="button" data-zoom="in">＋</button><button type="button" data-zoom="out">－</button></div><div class="map-attribution">工程熱點優先顯示</div></div>`;
  refs.map.querySelector('.map-touch-toggle').addEventListener('click', () => { mapActive = !mapActive; renderMap(filteredProjects(), true); showHint(mapActive ? '地圖拖曳已開啟。' : '手機滑動已改成網頁優先。'); });
  refs.map.querySelector('[data-zoom="in"]').addEventListener('click', () => { view.zoom = Math.min(MAX_ZOOM, view.zoom + 1); renderMap(filteredProjects(), true); });
  refs.map.querySelector('[data-zoom="out"]').addEventListener('click', () => { view.zoom = Math.max(MIN_ZOOM, view.zoom - 1); renderMap(filteredProjects(), true); });
  refs.map.querySelectorAll('[data-project-id]').forEach(node => node.addEventListener('click', () => selectProject(node.dataset.projectId)));
  refs.map.addEventListener('pointerdown', startDrag);
  refs.map.addEventListener('pointermove', moveDrag);
  refs.map.addEventListener('pointerup', endDrag);
  refs.map.addEventListener('pointercancel', endDrag);
  if (!keepStatus) showHint(t('mapReady'));
}

function baseSvg(width, height) {
  const grid = gridPath(width, height);
  const land = path(outline, width, height, true);
  const west = path([[25.2,120.08],[24.4,120.32],[23.6,120.32],[22.8,120.25],[22.45,120.35]], width, height, false);
  const east = path([[24.8,121.75],[24.0,121.62],[23.2,121.36],[22.6,121.05]], width, height, false);
  const labels = cities.map(([lat, lng, zh, en]) => { const p = pixel([lat, lng], width, height); return `<g class="base-city"><circle cx="${r(p.x)}" cy="${r(p.y)}" r="3.5"></circle><text x="${r(p.x + 7)}" y="${r(p.y - 7)}">${esc(lang === 'en' ? en : zh)}</text></g>`; }).join('');
  return `<defs><linearGradient id="landTone" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e7f6ec"/><stop offset="0.55" stop-color="#d2eadc"/><stop offset="1" stop-color="#fff2d2"/></linearGradient></defs><rect class="base-sea" width="${width}" height="${height}"></rect><path class="base-grid" d="${grid}"></path><path class="base-land-shadow" d="${land}"></path><path class="base-land" d="${land}"></path><path class="base-corridor" d="${west}"></path><path class="base-corridor east" d="${east}"></path>${labels}`;
}

function projectSvg(projects, width, height) {
  return projects.map(item => {
    const color = PROJECT_TYPES[item.type]?.color || '#2f80ed';
    const center = centroid(item.geometry.coordinates);
    const p = pixel(center, width, height);
    const active = item.id === activeId ? ' active' : '';
    const label = `<text x="${r(p.x + 15)}" y="${r(p.y - 13)}">${esc(item.shortName || item.name)}</text>`;
    if (item.geometry.type === 'line') {
      const points = item.geometry.coordinates.map(c => { const q = pixel(c, width, height); return `${r(q.x)},${r(q.y)}`; }).join(' ');
      return `<g class="project-item project-line${active}" data-project-id="${esc(item.id)}" style="--project-color:${esc(color)}"><polyline points="${points}"></polyline><circle cx="${r(p.x)}" cy="${r(p.y)}" r="11"></circle>${label}</g>`;
    }
    if (item.geometry.type === 'polygon') {
      const points = item.geometry.coordinates.map(c => { const q = pixel(c, width, height); return `${r(q.x)},${r(q.y)}`; }).join(' ');
      return `<g class="project-item project-polygon${active}" data-project-id="${esc(item.id)}" style="--project-color:${esc(color)}"><polygon points="${points}"></polygon><circle cx="${r(p.x)}" cy="${r(p.y)}" r="11"></circle>${label}</g>`;
    }
    return `<g class="project-item project-point${active}" data-project-id="${esc(item.id)}" style="--project-color:${esc(color)}"><circle cx="${r(p.x)}" cy="${r(p.y)}" r="16"></circle>${label}</g>`;
  }).join('');
}

function selectProject(id) {
  const item = PROJECTS.find(project => project.id === id);
  if (!item) return;
  activeId = id;
  const c = centroid(item.geometry.coordinates);
  view = { lat: c[0], lng: c[1], zoom: Math.max(view.zoom, 10) };
  renderList(filteredProjects());
  renderMap(filteredProjects(), true);
  showDetail(item);
}

function showDetail(item) {
  refs.statusBox.innerHTML = `<article class="map-detail-card"><div class="meta-row"><span class="badge">${esc(typeLabel(item))}</span><span class="badge status">${esc(statusLabel(item.status))}</span></div><h3>${esc(projectName(item))}</h3><p>${esc(item.summary || item.area || '')}</p><dl>${row(t('cost'), item.cost)}${row(t('area'), `${item.region}｜${item.area}`)}${row(t('owner'), item.owner)}${row(t('contractor'), item.contractor)}${row(t('startDate'), item.startDate)}${row(t('expectedFinish'), item.expectedFinish)}${row(t('expectedOpen'), item.expectedOpen)}${row(t('source'), item.sourceLabel)}</dl><div class="detail-actions"><a href="${safeUrl(item.source)}" target="_blank" rel="noopener noreferrer">${esc(t('openSource'))}</a><a href="${safeUrl(locationUrl(item))}" target="_blank" rel="noopener noreferrer">${esc(t('openMap'))}</a></div></article>`;
}

function startDrag(event) {
  if (!mapActive || event.target.closest('button') || event.target.closest('[data-project-id]')) return;
  const center = world(view.lat, view.lng, view.zoom);
  drag = { x: event.clientX, y: event.clientY, center };
}
function moveDrag(event) {
  if (!drag) return;
  const next = latLng(drag.center.x - (event.clientX - drag.x), drag.center.y - (event.clientY - drag.y), view.zoom);
  view = { ...view, ...next };
  renderMap(filteredProjects(), true);
}
function endDrag() { drag = null; }

function pixel(coord, width, height) { const p = world(coord[0], coord[1], view.zoom); const c = world(view.lat, view.lng, view.zoom); return { x: p.x - c.x + width / 2, y: p.y - c.y + height / 2 }; }
function world(lat, lng, zoom) { const sin = Math.sin((Math.max(-85.051, Math.min(85.051, lat)) * Math.PI) / 180); const scale = TILE_SIZE * 2 ** zoom; return { x: ((lng + 180) / 360) * scale, y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale }; }
function latLng(x, y, zoom) { const scale = TILE_SIZE * 2 ** zoom; const lng = (x / scale) * 360 - 180; const n = Math.PI - (2 * Math.PI * y) / scale; const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))); return { lat, lng: ((((lng + 180) % 360) + 360) % 360) - 180 }; }
function centroid(coords) { const pts = flat(coords); const sum = pts.reduce((a, p) => [a[0] + p[0], a[1] + p[1]], [0, 0]); return pts.length ? [sum[0] / pts.length, sum[1] / pts.length] : [DEFAULT_VIEW.lat, DEFAULT_VIEW.lng]; }
function flat(value) { if (!Array.isArray(value)) return []; if (typeof value[0] === 'number') return [value]; return value.flatMap(flat); }
function path(coords, width, height, close) { return coords.map((coord, index) => { const p = pixel(coord, width, height); return `${index ? 'L' : 'M'} ${r(p.x)} ${r(p.y)}`; }).join(' ') + (close ? ' Z' : ''); }
function gridPath(width, height) { const lines = []; for (let x = 0; x <= width; x += 52) lines.push(`M ${x} 0 L ${x} ${height}`); for (let y = 0; y <= height; y += 52) lines.push(`M 0 ${y} L ${width} ${y}`); return lines.join(' '); }
function typeLabel(item) { return lang === 'en' ? typeEn[item.type] || item.type : PROJECT_TYPES[item.type]?.label || '工程'; }
function statusLabel(value) { return lang === 'en' ? statusEn[value] || value : value; }
function projectName(item) { return lang === 'en' ? (item.shortName || item.name) : item.name; }
function row(label, value) { return `<div><dt>${esc(label)}</dt><dd>${esc(value || t('missing'))}</dd></div>`; }
function short(value, max) { const text = String(value || t('missing')); return text.length > max ? `${text.slice(0, max)}…` : text; }
function locationUrl(item) { const c = centroid(item.geometry.coordinates); return item.openMapUrl || `https://www.openstreetmap.org/?mlat=${c[0].toFixed(5)}&mlon=${c[1].toFixed(5)}`; }
function showHint(text) { refs.statusBox.textContent = text; }
function safeUrl(value) { const text = String(value || ''); return text.startsWith('http://') || text.startsWith('https://') ? text : '#'; }
function r(value) { return Math.round(value * 10) / 10; }
function t(key) { return copy[lang][key] || copy.zh[key] || key; }
function esc(value) { return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;'); }
