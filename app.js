const GEOJSON_URL = './data/construction_projects.geojson';
const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const LANG_KEY = 'taiwan-construction-map-language';
const TAIWAN_VIEW = { center: [23.75, 120.96], zoom: 7 };

const STORAGE = window.__taiwanConstructionMapSafeStorage || {
  getItem(key) { try { return window.localStorage.getItem(key); } catch { return null; } },
  setItem(key, value) { try { window.localStorage.setItem(key, value); } catch {} }
};

const CATEGORIES = [
  { key: '公共工程', en: 'Public works', color: '#2f80ed' },
  { key: '道路/管線', en: 'Road / utilities', color: '#1ca678' },
  { key: '捷運/交通', en: 'Transit / traffic', color: '#f28c28' },
  { key: '建築/園區', en: 'Buildings / parks', color: '#0ea5e9' },
  { key: '規劃/環評', en: 'Planning / EIA', color: '#8b5cf6' }
];

const STATUSES = ['規劃中', '招標中', '施工中', '完工', '延宕'];

const STATUS_EN = {
  '規劃中': 'Planning',
  '招標中': 'Tendering',
  '施工中': 'Under construction',
  '完工': 'Completed',
  '延宕': 'Delayed'
};

const COPY = {
  zh: {
    documentTitle: '台灣工程地圖｜Taiwan Construction Map',
    skipLink: '跳到工程資訊', brandEyebrow: '工程位置 × 進度 × 甲乙方', brandTitle: '台灣工程地圖', brandSubtitle: 'Taiwan Construction Map',
    navMap: '工程地圖', navSources: '資料入口', navGuide: '補資料',
    heroPill: '真正可互動的工程地圖 MVP：點位、圖層、搜尋、篩選與工程卡片一次到位。',
    heroTitle: '台灣正在升級的地方，一張圖先 get。',
    heroText: '給工程公司、發包甲方、地理地圖愛好者與年輕使用者看的工程雷達。先看位置，再看甲方、乙方、金額、期程與來源；查工程不用迷路。',
    metricProjects: '工程點位', metricCost: '總金額估算', metricSources: '資料來源',
    panelEyebrow: '工程雷達', panelTitle: '找工程、看位置、追進度', panelText: '搜尋工程名、地點、發包方或施工方；也可以開關圖層與狀態篩選。工程控、地圖控、估案人員都能快速開圖。',
    searchLabel: '搜尋', searchPlaceholder: '例：淡江大橋、高雄捷運、臺南、工信工程、道路挖掘',
    typeLabel: '類型', typeAll: '全部類型', statusLabel: '狀態', statusAll: '全部狀態', resetMap: '回到全台', toggleSources: '資料入口',
    mapEyebrow: 'Leaflet 互動工程地圖', mapTitle: '台灣工程點位一眼看', mapNote: '點選工程點位可查看甲方、乙方、金額、起訖日與來源。手機版會從下方滑出工程卡片。', mapLoading: '地圖與工程資料載入中。',
    sourcesEyebrow: '資料入口', sourcesTitle: '工程資料很分散，要分層查才準。', sourcesText: '公共工程、採購決標、重大建設、道路挖掘、環評、建管、能源水利與地方資料各有入口。',
    guideEyebrow: '補資料指南', guideTitle: '資料要好用，關鍵是位置、來源與欄位一致。',
    guide1Title: '1. 補上工程基本盤', guide1Text: '工程名、地點、甲方、乙方、金額、開工日、預計完工日與狀態要完整。',
    guide2Title: '2. 標清楚施工位置', guide2Text: '先用點位做 MVP；後續可升級成路線與範圍，讓工程脈絡更清楚。',
    guide3Title: '3. 來源要能回查', guide3Text: '每筆資料都附來源名稱與連結，使用者才能自己交叉確認。',
    guide4Title: '4. 手機先好用', guide4Text: '現場人員與通勤族多半用手機看，底部滑出卡片能更順手。',
    footerTitle: '台灣工程地圖｜Taiwan Construction Map', footerText: '工程資訊為 MVP 範例資料；正式引用請回各主管機關、採購、工程、建管、環評與地方圖台確認最新公告。',
    emptyTitle: '沒有符合條件的工程', emptyText: '換個工程名、地點、甲方或乙方試試。',
    cardIntroTitle: '點一個工程點位', cardIntroText: '右側會顯示工程卡片；手機版會從下方滑出。',
    close: '收合', retry: '重試載入', mapErrorTitle: '地圖載入失敗', dataErrorTitle: '工程資料載入失敗', tileErrorTitle: '底圖載入不穩',
    tileErrorText: '目前底圖圖磚連線不穩，工程清單仍可使用。可以稍後重試。',
    sourcePage: '開啟資料入口新頁 ↗', openSource: '來源連結 ↗',
    budget: '金額', start: '開工日', end: '預計完工日', owner: '甲方', contractor: '乙方', source: '來源', updated: '更新日', address: '地點', category: '類型', status: '狀態',
    languageButton: 'EN', ariaLanguage: 'Switch to English', totalPrefix: '約', totalSuffix: '億元', countProjects: '筆工程', showing: '目前顯示'
  },
  en: {
    documentTitle: 'Taiwan Construction Map｜MVP',
    skipLink: 'Skip to project info', brandEyebrow: 'Location × Progress × Owner / Contractor', brandTitle: 'Taiwan Construction Map', brandSubtitle: 'MVP',
    navMap: 'Map', navSources: 'Sources', navGuide: 'Data guide',
    heroPill: 'A working construction map MVP with points, layers, search, filters, and project cards.',
    heroTitle: 'Taiwan’s upgrades, mapped in one view.',
    heroText: 'A practical engineering radar for firms, project owners, map lovers, and young readers. Check location, owner, contractor, budget, schedule, and source without getting lost.',
    metricProjects: 'Project points', metricCost: 'Budget total', metricSources: 'Sources',
    panelEyebrow: 'Engineering radar', panelTitle: 'Find projects, places, and progress', panelText: 'Search by project name, place, owner, or contractor. Toggle layers and status filters to focus the map.',
    searchLabel: 'Search', searchPlaceholder: 'Example: Tamkang Bridge, Kaohsiung MRT, Tainan, road works',
    typeLabel: 'Type', typeAll: 'All types', statusLabel: 'Status', statusAll: 'All status', resetMap: 'Taiwan view', toggleSources: 'Sources',
    mapEyebrow: 'Leaflet interactive construction map', mapTitle: 'Construction points at a glance', mapNote: 'Tap a project point to view owner, contractor, budget, dates, and source. On mobile, the card slides up from the bottom.', mapLoading: 'Loading map and project data.',
    sourcesEyebrow: 'Source portals', sourcesTitle: 'Engineering data is scattered. Layered checking is the smart move.', sourcesText: 'Public works, tenders, road works, EIA, permits, energy, water, and local data live in different places.',
    guideEyebrow: 'Data guide', guideTitle: 'Good data needs clear location, source, and fields.',
    guide1Title: '1. Add the core project facts', guide1Text: 'Project name, place, owner, contractor, budget, start date, target finish, and status should be complete.',
    guide2Title: '2. Mark location clearly', guide2Text: 'The MVP starts with points; later versions can add routes and areas.',
    guide3Title: '3. Keep sources traceable', guide3Text: 'Each project includes a source name and URL for cross-checking.',
    guide4Title: '4. Mobile-first', guide4Text: 'Site staff and commuters often use phones, so the bottom project card stays easy to read.',
    footerTitle: 'Taiwan Construction Map', footerText: 'Project data is sample MVP data. For official use, verify the latest notices from competent authorities and source portals.',
    emptyTitle: 'No matching projects', emptyText: 'Try another project name, place, owner, or contractor.',
    cardIntroTitle: 'Tap a project point', cardIntroText: 'The project card appears on the right. On mobile, it slides up from the bottom.',
    close: 'Close', retry: 'Retry', mapErrorTitle: 'Map failed to load', dataErrorTitle: 'Project data failed to load', tileErrorTitle: 'Base map is unstable',
    tileErrorText: 'The base map tiles are unstable right now. The project list still works. Try again later.',
    sourcePage: 'Open source portals ↗', openSource: 'Source link ↗',
    budget: 'Budget', start: 'Start', end: 'Planned finish', owner: 'Owner', contractor: 'Contractor', source: 'Source', updated: 'Updated', address: 'Place', category: 'Type', status: 'Status',
    languageButton: '中', ariaLanguage: 'Switch to Chinese', totalPrefix: 'NT$', totalSuffix: 'B', countProjects: 'projects', showing: 'Showing'
  }
};

const refs = {
  search: document.querySelector('#searchInput'), typeFilter: document.querySelector('#typeFilter'), statusFilter: document.querySelector('#statusFilter'),
  projectList: document.querySelector('#projectList'), resetMap: document.querySelector('#resetMap'), toggleSources: document.querySelector('#toggleSources'),
  metricProjects: document.querySelector('#metricProjects'), metricCost: document.querySelector('#metricCost'), metricSources: document.querySelector('#metricSources'),
  sourceCards: document.querySelector('#sourceCards'), map: document.querySelector('#map'), mapStatus: document.querySelector('#mapStatus'), languageToggle: document.querySelector('#languageToggle'),
  legend: document.querySelector('.legend'), mapFrame: document.querySelector('.map-frame')
};

const state = {
  lang: STORAGE.getItem(LANG_KEY) === 'en' ? 'en' : 'zh',
  geojson: null,
  features: [],
  activeCategories: new Set(CATEGORIES.map(item => item.key)),
  activeFeatureId: '',
  map: null,
  layer: null,
  tileLayer: null,
  dataLoaded: false,
  leafletLoaded: false,
  lastError: null,
  tileErrorShown: false
};

init();

async function init() {
  injectMvpStyles();
  prepareSourcePanel();
  setLanguage(state.lang, { skipRender: true });
  hydrateFilters();
  bindEvents();
  renderIntroCard();
  showLoading();
  await loadMvpMap();
}

async function loadMvpMap() {
  try {
    clearErrorState();
    refs.mapFrame?.classList.add('mvp-loading');
    refs.map.innerHTML = `<div class="mvp-map-loading">${escapeHtml(t('mapLoading'))}</div>`;
    const [geojson] = await Promise.all([fetchGeoJson(), loadLeaflet()]);
    state.geojson = geojson;
    state.features = normalizeFeatures(geojson.features || []);
    state.dataLoaded = true;
    setupLeafletMap();
    renderMetrics();
    renderCategorySwitches();
    applyFilters({ fit: true });
    refs.mapFrame?.classList.remove('mvp-loading');
  } catch (error) {
    state.lastError = error;
    refs.mapFrame?.classList.remove('mvp-loading');
    showLoadError(error);
  }
}

function bindEvents() {
  refs.search?.addEventListener('input', () => applyFilters());
  refs.typeFilter?.addEventListener('change', () => applyFilters({ fit: true }));
  refs.statusFilter?.addEventListener('change', () => applyFilters({ fit: true }));
  refs.resetMap?.addEventListener('click', resetFiltersAndView);
  refs.toggleSources?.addEventListener('click', event => {
    event.preventDefault();
    window.open('./sources.html', '_blank', 'noopener,noreferrer');
  });
  refs.languageToggle?.addEventListener('click', () => setLanguage(state.lang === 'zh' ? 'en' : 'zh'));
  document.addEventListener('click', event => {
    if (event.target.closest('[data-retry-map]')) loadMvpMap();
    if (event.target.closest('[data-close-card]')) closeProjectCard();
  });
}

async function fetchGeoJson() {
  const response = await fetch(`${GEOJSON_URL}?v=${Date.now()}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${t('dataErrorTitle')}：HTTP ${response.status}`);
  const data = await response.json();
  if (!data || data.type !== 'FeatureCollection' || !Array.isArray(data.features)) throw new Error(t('dataErrorTitle'));
  return data;
}

function loadLeaflet() {
  if (window.L?.map) {
    state.leafletLoaded = true;
    return Promise.resolve();
  }
  return Promise.all([loadStyle(LEAFLET_CSS), loadScript(LEAFLET_JS)]).then(() => {
    if (!window.L?.map) throw new Error(t('mapErrorTitle'));
    state.leafletLoaded = true;
  });
}

function loadStyle(href) {
  if ([...document.styleSheets].some(sheet => sheet.href === href)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = () => reject(new Error(t('mapErrorTitle')));
    document.head.append(link);
  });
}

function loadScript(src) {
  if ([...document.scripts].some(script => script.src === src)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error(t('mapErrorTitle')));
    document.head.append(script);
  });
}

function setupLeafletMap() {
  const L = window.L;
  refs.map.innerHTML = '';
  refs.map.classList.add('mvp-leaflet-map');
  refs.mapFrame?.classList.add('mvp-leaflet-ready');
  if (state.map) state.map.remove();
  state.map = L.map(refs.map, { zoomControl: true, preferCanvas: true, worldCopyJump: true }).setView(TAIWAN_VIEW.center, TAIWAN_VIEW.zoom);
  state.tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(state.map);
  state.tileLayer.on('tileerror', showTileWarning);
  setTimeout(() => state.map.invalidateSize(), 80);
}

function applyFilters(options = {}) {
  if (!state.dataLoaded || !state.map) return;
  const query = normalize(refs.search?.value || '');
  const selectedType = refs.typeFilter?.value || 'all';
  const selectedStatus = refs.statusFilter?.value || 'all';
  const filtered = state.features.filter(feature => {
    const p = feature.properties || {};
    const categoryOk = state.activeCategories.has(p.category) && (selectedType === 'all' || p.category === selectedType);
    const statusOk = selectedStatus === 'all' || p.status === selectedStatus;
    const text = normalize([p.name, p.address, p.owner, p.contractor, p.category, p.status].join(' '));
    return categoryOk && statusOk && (!query || text.includes(query));
  });
  renderProjectList(filtered);
  renderMarkers(filtered, options);
  renderCurrentSummary(filtered);
}

function renderMarkers(features, options = {}) {
  const L = window.L;
  if (state.layer) state.layer.remove();
  state.layer = L.geoJSON({ type: 'FeatureCollection', features }, {
    pointToLayer(feature, latlng) {
      const props = feature.properties || {};
      return L.circleMarker(latlng, {
        radius: state.activeFeatureId === props.id ? 11 : 8,
        color: '#ffffff',
        weight: 2,
        fillColor: categoryColor(props.category),
        fillOpacity: 0.95,
        className: 'mvp-project-marker'
      });
    },
    onEachFeature(feature, layer) {
      const props = feature.properties || {};
      layer.bindTooltip(props.name || '', { direction: 'top', offset: [0, -8] });
      layer.on('click', () => selectFeature(props.id, { pan: true }));
    }
  }).addTo(state.map);

  if (features.length && options.fit) {
    const bounds = state.layer.getBounds();
    if (bounds.isValid()) state.map.fitBounds(bounds.pad(0.18), { maxZoom: 12 });
  }
}

function renderProjectList(features) {
  if (!refs.projectList) return;
  refs.projectList.innerHTML = '';
  if (!features.length) {
    refs.projectList.innerHTML = `<div class="project-card empty"><h3>${escapeHtml(t('emptyTitle'))}</h3><p>${escapeHtml(t('emptyText'))}</p></div>`;
    return;
  }
  const fragment = document.createDocumentFragment();
  features.forEach(feature => {
    const p = feature.properties || {};
    const card = document.createElement('article');
    card.className = `project-card${p.id === state.activeFeatureId ? ' active' : ''}`;
    card.tabIndex = 0;
    card.dataset.projectId = p.id;
    card.innerHTML = `
      <div class="meta-row"><span class="badge" style="--badge-color:${escapeAttr(categoryColor(p.category))}">${escapeHtml(labelCategory(p.category))}</span><span class="badge status">${escapeHtml(labelStatus(p.status))}</span></div>
      <h3>${escapeHtml(p.name)}</h3>
      <p>${escapeHtml(p.address || '')}</p>
      <div class="mini-facts"><span>${escapeHtml(t('owner'))}：${escapeHtml(shorten(p.owner, 18))}</span><span>${escapeHtml(t('contractor'))}：${escapeHtml(shorten(p.contractor, 18))}</span></div>`;
    card.addEventListener('click', () => selectFeature(p.id, { pan: true }));
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectFeature(p.id, { pan: true });
      }
    });
    fragment.append(card);
  });
  refs.projectList.append(fragment);
}

function renderCategorySwitches() {
  if (!refs.legend) return;
  refs.legend.classList.add('mvp-layer-switches');
  refs.legend.innerHTML = CATEGORIES.map(category => {
    const active = state.activeCategories.has(category.key);
    const count = state.features.filter(feature => feature.properties?.category === category.key).length;
    return `<button type="button" class="mvp-layer-toggle${active ? ' active' : ''}" data-category="${escapeAttr(category.key)}" aria-pressed="${active}"><i style="--layer-color:${escapeAttr(category.color)}"></i><span>${escapeHtml(labelCategory(category.key))}</span><b>${count}</b></button>`;
  }).join('');
  refs.legend.querySelectorAll('[data-category]').forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      if (state.activeCategories.has(category) && state.activeCategories.size > 1) state.activeCategories.delete(category);
      else state.activeCategories.add(category);
      renderCategorySwitches();
      applyFilters({ fit: true });
    });
  });
}

function renderMetrics() {
  const totalBudget = state.features.reduce((sum, feature) => sum + Number(feature.properties?.budget_ntd || 0), 0);
  const sourceCount = new Set(state.features.map(feature => feature.properties?.source_name).filter(Boolean)).size;
  if (refs.metricProjects) refs.metricProjects.textContent = String(state.features.length);
  if (refs.metricCost) refs.metricCost.textContent = state.lang === 'en' ? `${(totalBudget / 1_000_000_000).toFixed(1)}B` : `${Math.round(totalBudget / 100_000_000)}億`;
  if (refs.metricSources) refs.metricSources.textContent = String(sourceCount);
}

function renderCurrentSummary(features) {
  if (state.activeFeatureId) return;
  refs.mapStatus.classList.remove('is-open');
  refs.mapStatus.innerHTML = `
    <article class="map-detail-card mvp-intro-card">
      <h3>${escapeHtml(t('cardIntroTitle'))}</h3>
      <p>${escapeHtml(t('cardIntroText'))}</p>
      <dl>${detailRow(t('showing'), `${features.length} ${t('countProjects')}`)}${detailRow(t('category'), activeCategorySummary())}${detailRow(t('status'), refs.statusFilter?.value === 'all' ? t('statusAll') : labelStatus(refs.statusFilter.value))}</dl>
    </article>`;
}

function selectFeature(id, options = {}) {
  const feature = state.features.find(item => item.properties?.id === id);
  if (!feature) return;
  state.activeFeatureId = id;
  renderProjectList(getCurrentFilteredFeatures());
  renderMarkers(getCurrentFilteredFeatures());
  renderFeatureCard(feature);
  const [lng, lat] = feature.geometry?.coordinates || [];
  if (options.pan && Number.isFinite(lat) && Number.isFinite(lng)) state.map.setView([lat, lng], Math.max(state.map.getZoom(), 12), { animate: true });
  refs.projectList?.querySelector(`[data-project-id="${cssEscape(id)}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function renderFeatureCard(feature) {
  const p = feature.properties || {};
  refs.mapStatus.classList.add('is-open');
  refs.mapStatus.innerHTML = `
    <article class="map-detail-card mvp-project-card">
      <button type="button" class="mvp-card-close" data-close-card aria-label="${escapeAttr(t('close'))}">×</button>
      <div class="meta-row"><span class="badge" style="--badge-color:${escapeAttr(categoryColor(p.category))}">${escapeHtml(labelCategory(p.category))}</span><span class="badge status">${escapeHtml(labelStatus(p.status))}</span></div>
      <h3>${escapeHtml(p.name)}</h3>
      <p>${escapeHtml(p.address || '')}</p>
      <dl>
        ${detailRow(t('owner'), p.owner)}
        ${detailRow(t('contractor'), p.contractor)}
        ${detailRow(t('budget'), formatBudget(p.budget_ntd))}
        ${detailRow(t('start'), p.start_date)}
        ${detailRow(t('end'), p.planned_end_date)}
        ${detailRow(t('updated'), p.updated_at)}
      </dl>
      <div class="detail-actions"><a href="${safeUrl(p.source_url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(p.source_name || t('openSource'))} ↗</a></div>
    </article>`;
}

function closeProjectCard() {
  state.activeFeatureId = '';
  applyFilters();
}

function getCurrentFilteredFeatures() {
  const query = normalize(refs.search?.value || '');
  const selectedType = refs.typeFilter?.value || 'all';
  const selectedStatus = refs.statusFilter?.value || 'all';
  return state.features.filter(feature => {
    const p = feature.properties || {};
    const text = normalize([p.name, p.address, p.owner, p.contractor, p.category, p.status].join(' '));
    return state.activeCategories.has(p.category)
      && (selectedType === 'all' || p.category === selectedType)
      && (selectedStatus === 'all' || p.status === selectedStatus)
      && (!query || text.includes(query));
  });
}

function resetFiltersAndView() {
  state.activeCategories = new Set(CATEGORIES.map(item => item.key));
  state.activeFeatureId = '';
  if (refs.search) refs.search.value = '';
  if (refs.typeFilter) refs.typeFilter.value = 'all';
  if (refs.statusFilter) refs.statusFilter.value = 'all';
  renderCategorySwitches();
  applyFilters({ fit: true });
  if (state.map) state.map.setView(TAIWAN_VIEW.center, TAIWAN_VIEW.zoom);
}

function setLanguage(lang, options = {}) {
  state.lang = lang === 'en' ? 'en' : 'zh';
  STORAGE.setItem(LANG_KEY, state.lang);
  document.documentElement.lang = state.lang === 'zh' ? 'zh-Hant' : 'en';
  document.title = t('documentTitle');
  document.querySelectorAll('[data-i18n]').forEach(node => {
    const key = node.dataset.i18n;
    if (COPY[state.lang][key]) node.textContent = COPY[state.lang][key];
  });
  if (refs.search) refs.search.placeholder = t('searchPlaceholder');
  if (refs.languageToggle) {
    refs.languageToggle.textContent = t('languageButton');
    refs.languageToggle.setAttribute('aria-label', t('ariaLanguage'));
  }
  hydrateFilters();
  prepareSourcePanel();
  if (!options.skipRender && state.dataLoaded) {
    renderMetrics();
    renderCategorySwitches();
    applyFilters();
  }
}

function hydrateFilters() {
  if (refs.typeFilter) {
    const old = refs.typeFilter.value || 'all';
    refs.typeFilter.innerHTML = `<option value="all">${escapeHtml(t('typeAll'))}</option>` + CATEGORIES.map(category => `<option value="${escapeAttr(category.key)}">${escapeHtml(labelCategory(category.key))}</option>`).join('');
    refs.typeFilter.value = old && [...CATEGORIES.map(c => c.key), 'all'].includes(old) ? old : 'all';
  }
  if (refs.statusFilter) {
    const old = refs.statusFilter.value || 'all';
    refs.statusFilter.innerHTML = `<option value="all">${escapeHtml(t('statusAll'))}</option>` + STATUSES.map(status => `<option value="${escapeAttr(status)}">${escapeHtml(labelStatus(status))}</option>`).join('');
    refs.statusFilter.value = old && [...STATUSES, 'all'].includes(old) ? old : 'all';
  }
}

function prepareSourcePanel() {
  if (refs.sourceCards) {
    refs.sourceCards.replaceChildren();
    refs.sourceCards.setAttribute('aria-hidden', 'true');
  }
  let link = document.querySelector('.source-page-link');
  if (!link && document.querySelector('#sourcePanel')) {
    link = document.createElement('a');
    link.className = 'source-page-link';
    document.querySelector('#sourcePanel .section-title')?.after(link);
  }
  if (link) {
    link.href = './sources.html';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = t('sourcePage');
  }
}

function normalizeFeatures(features) {
  return features.filter(feature => {
    const coords = feature.geometry?.coordinates;
    return feature.type === 'Feature' && feature.geometry?.type === 'Point' && Number.isFinite(coords?.[0]) && Number.isFinite(coords?.[1]);
  });
}

function showLoading() {
  refs.mapStatus.innerHTML = `<article class="map-detail-card"><h3>${escapeHtml(t('mapLoading'))}</h3><p>${escapeHtml(t('cardIntroText'))}</p></article>`;
}

function showLoadError(error) {
  const message = error?.message || t('mapErrorTitle');
  refs.mapFrame?.classList.remove('mvp-leaflet-ready');
  refs.map.innerHTML = `<div class="mvp-map-error"><strong>${escapeHtml(message.includes('資料') ? t('dataErrorTitle') : t('mapErrorTitle'))}</strong><p>${escapeHtml(message)}</p><button type="button" data-retry-map>${escapeHtml(t('retry'))}</button></div>`;
  refs.mapStatus.classList.add('is-open');
  refs.mapStatus.innerHTML = `<article class="map-detail-card"><h3>${escapeHtml(message.includes('資料') ? t('dataErrorTitle') : t('mapErrorTitle'))}</h3><p>${escapeHtml(message)}</p><div class="detail-actions"><button type="button" data-retry-map>${escapeHtml(t('retry'))}</button></div></article>`;
}

function showTileWarning() {
  if (state.tileErrorShown) return;
  state.tileErrorShown = true;
  const warning = document.createElement('div');
  warning.className = 'mvp-tile-warning';
  warning.innerHTML = `<strong>${escapeHtml(t('tileErrorTitle'))}</strong><span>${escapeHtml(t('tileErrorText'))}</span><button type="button" data-retry-map>${escapeHtml(t('retry'))}</button>`;
  refs.map.append(warning);
}

function clearErrorState() {
  state.tileErrorShown = false;
  state.lastError = null;
}

function renderIntroCard() {
  refs.mapStatus.innerHTML = `<article class="map-detail-card"><h3>${escapeHtml(t('cardIntroTitle'))}</h3><p>${escapeHtml(t('cardIntroText'))}</p></article>`;
}

function categoryColor(category) {
  return CATEGORIES.find(item => item.key === category)?.color || '#2f80ed';
}

function labelCategory(category) {
  const item = CATEGORIES.find(entry => entry.key === category);
  return state.lang === 'en' ? (item?.en || category) : category;
}

function labelStatus(status) {
  return state.lang === 'en' ? (STATUS_EN[status] || status) : status;
}

function activeCategorySummary() {
  if (state.activeCategories.size === CATEGORIES.length) return t('typeAll');
  return [...state.activeCategories].map(labelCategory).join('、');
}

function formatBudget(value) {
  const n = Number(value || 0);
  if (!n) return '—';
  return state.lang === 'en' ? `NT$ ${(n / 1_000_000_000).toFixed(2)}B` : `約 ${Math.round(n / 100_000_000).toLocaleString('zh-Hant')} 億元`;
}

function detailRow(label, value) {
  return `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value || '—')}</dd></div>`;
}

function safeUrl(value) {
  const text = String(value || '');
  return text.startsWith('https://') || text.startsWith('http://') ? escapeAttr(text) : '#';
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function shorten(value, max) {
  const text = String(value || '—');
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function cssEscape(value) {
  return String(value).replaceAll('\\', '\\\\').replaceAll('"', '\\"');
}

function t(key) {
  return COPY[state.lang]?.[key] ?? COPY.zh[key] ?? key;
}

function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('`', '&#096;');
}

function injectMvpStyles() {
  if (document.getElementById('construction-map-mvp-style')) return;
  const style = document.createElement('style');
  style.id = 'construction-map-mvp-style';
  style.textContent = `
    .map-frame.mvp-leaflet-ready{display:grid;grid-template-columns:minmax(0,1fr) 380px;min-height:640px}.map-frame.mvp-leaflet-ready #map{min-height:640px;height:100%;touch-action:auto}.mvp-leaflet-map{background:#dcecf4}.mvp-map-loading,.mvp-map-error{position:absolute;inset:0;display:grid;place-content:center;gap:12px;text-align:center;padding:24px;background:linear-gradient(135deg,#e8f5fb,#f8fbff);z-index:3}.mvp-map-error strong{font-size:22px;color:#102131}.mvp-map-error p{max-width:420px;margin:0;color:#647486;line-height:1.6}.mvp-map-error button,.map-detail-card button{width:fit-content;justify-self:center;padding:10px 14px;border-radius:999px}.mvp-tile-warning{position:absolute;left:14px;right:14px;top:14px;z-index:600;display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 12px;border-radius:16px;background:rgba(255,255,255,.94);box-shadow:0 12px 28px rgba(15,42,68,.16);font-size:13px}.mvp-tile-warning span{color:#647486}.mvp-tile-warning button{min-height:34px;padding:0 10px}.map-frame.mvp-leaflet-ready .map-status{position:static;inset:auto;display:block;margin:0;border-radius:0;max-height:none;overflow:auto;border-left:1px solid rgba(15,42,68,.1);box-shadow:none}.mvp-layer-switches{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:0 22px 14px}.mvp-layer-toggle{display:flex;align-items:center;gap:8px;min-height:42px;padding:8px 10px;border-radius:15px;border:1px solid rgba(15,42,68,.12);background:#fff;color:#31485b;box-shadow:none;text-align:left}.mvp-layer-toggle i{width:11px;height:11px;border-radius:50%;background:var(--layer-color);box-shadow:0 0 0 5px rgba(53,212,255,.12)}.mvp-layer-toggle span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-weight:950}.mvp-layer-toggle b{padding:3px 6px;border-radius:999px;background:#eef6ff;color:#1d5d93;font-size:11px}.mvp-layer-toggle.active{border-color:rgba(47,128,237,.45);background:linear-gradient(135deg,#f7fbff,#fff);box-shadow:0 10px 22px rgba(15,42,68,.08)}.mvp-layer-toggle:not(.active){opacity:.52}.badge[style*='--badge-color']{background:color-mix(in srgb,var(--badge-color) 16%,white);color:#102131}.mvp-project-card{position:relative}.mvp-card-close{position:absolute;right:8px;top:8px;min-height:34px;width:34px;padding:0;border-radius:50%;background:#eef6ff;color:#0f2b44;box-shadow:none}.leaflet-container{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Microsoft JhengHei','Noto Sans TC',Arial,sans-serif}.leaflet-tooltip{font-weight:900;border:0;border-radius:999px;box-shadow:0 8px 18px rgba(15,42,68,.18)}
    @media(max-width:900px){.map-frame.mvp-leaflet-ready{display:block;min-height:430px}.map-frame.mvp-leaflet-ready #map{min-height:430px;height:430px}.mvp-layer-switches{display:flex;overflow-x:auto;padding:0 16px 14px;scrollbar-width:thin}.mvp-layer-toggle{min-width:136px;flex:0 0 auto}.map-frame.mvp-leaflet-ready .map-status{position:fixed;left:12px;right:12px;bottom:calc(74px + env(safe-area-inset-bottom));z-index:1200;max-height:62svh;border-radius:24px;box-shadow:0 18px 42px rgba(0,0,0,.26);border:1px solid rgba(15,42,68,.12);transform:translateY(calc(100% - 62px));transition:transform .22s ease}.map-frame.mvp-leaflet-ready .map-status.is-open{transform:translateY(0)}.map-detail-card{padding-right:32px}.mvp-tile-warning{top:60px}.control-panel{max-height:none!important}.project-list{max-height:220px!important}}
  `;
  document.head.append(style);
}
