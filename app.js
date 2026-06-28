const CORE_DATA_URL = './data/active_construction_projects.geojson';
const MANIFEST_URL = './data/active_dataset_manifest.json';
const LANG_KEY = 'taiwan-construction-map-language';
const PAGE_SIZE = 8;
const MAX_BACKGROUND_ITEMS = 180;

const CATEGORY_META = [
  { key: '公共工程', en: 'Public works', color: '#2f80ed' },
  { key: '道路/管線', en: 'Roads / utilities', color: '#1ca678' },
  { key: '捷運/交通', en: 'Transit / transport', color: '#f28c28' },
  { key: '建築/園區', en: 'Buildings / parks', color: '#0ea5e9' },
  { key: '規劃/環評', en: 'Planning / review', color: '#8b5cf6' }
];

const STATUS_META = {
  '規劃中': 'Planning',
  '招標準備': 'Pre-tender',
  '招標中': 'Tendering',
  '施工中': 'Under construction',
  '完工': 'Recently completed',
  '延宕': 'Delayed'
};

const COPY = {
  zh: {
    documentTitle: '台灣工程地圖｜Taiwan Construction Map',
    skipLink: '跳到工程資訊',
    brandEyebrow: '工程位置 × 工程進度 × 甲乙方',
    brandTitle: '台灣工程地圖',
    brandSubtitle: 'Taiwan Construction Map',
    navMap: '工程地圖',
    navSources: '資料入口',
    navGuide: '補資料',
    heroPill: '工程位置、施工範圍、甲方乙方、期程與來源，一張圖先看懂。',
    heroTitle: '台灣正在升級的地方，一張圖先 get。',
    heroText: '給工程公司、發包甲方、地理地圖愛好者與年輕使用者看的工程雷達。先看位置與施工範圍，再看甲方、乙方、金額、期程與來源；查工程不用迷路。',
    metricProjects: '現況工程',
    metricCost: '總工程金額估算',
    metricSources: '資料來源入口',
    panelEyebrow: '工程雷達',
    panelTitle: '找工程、看位置、追進度',
    panelText: '搜尋工程名、地點、發包方或施工方；也可以用類型、狀態與分頁縮小範圍。工程控、地圖控、估案人員都能快速開圖。',
    searchLabel: '搜尋',
    searchPlaceholder: '例：淡江大橋、高雄捷運、臺南、道路挖掘、科學園區',
    typeLabel: '工程類型',
    typeAll: '全部類型',
    statusLabel: '辦理狀態',
    statusAll: '全部狀態',
    resetMap: '回到全台',
    toggleSources: '資料入口',
    mapEyebrow: '互動工程位置圖',
    mapTitle: '工程點位、路線與範圍一眼看',
    mapNote: '點選工程熱點，可查看甲方、乙方、金額、期程與來源。清單採分頁顯示，手機載入更快。',
    mapLoading: '工程資料載入中，先幫你整理清單與位置。',
    sourcesEyebrow: '資料入口',
    sourcesTitle: '工程資料很分散，要分層查才準。',
    sourcesText: '公共工程、採購決標、重大建設、道路挖掘、環評、建管、能源水利與地方資料各有入口。',
    guideEyebrow: '補資料指南',
    guideTitle: '資料要好用，關鍵是位置、來源與欄位一致。',
    guide1Title: '1. 補上工程基本盤',
    guide1Text: '工程名、地點、甲方、乙方、金額、開工日、預計完工日與狀態要完整。',
    guide2Title: '2. 標清楚施工位置',
    guide2Text: '單一設施用點位；道路、捷運與橋梁用路線；園區與基地用範圍。地圖準，信任感就上來。',
    guide3Title: '3. 來源要能回查',
    guide3Text: '每筆資料都附來源名稱與連結，使用者才能交叉確認。',
    guide4Title: '4. 手機先好用',
    guide4Text: '現場人員與通勤族多半用手機看，清單、分頁與工程卡片要單手順滑。',
    footerTitle: '台灣工程地圖｜Taiwan Construction Map',
    footerText: '首頁以計畫中、招標準備、招標中、施工中，或完工啟用未滿一個月的現況資料為主；正式引用請回各主管機關、採購、工程、建管、環評與地方圖台確認最新公告。',
    loadingTitle: '工程資料整理中',
    loadingText: '先顯示可用的工程清單與位置圖；大量資料會分批補上，不讓首頁卡住。',
    emptyTitle: '沒有符合條件的工程',
    emptyText: '換個工程名、地點、甲方或乙方試試。',
    owner: '甲方',
    contractor: '乙方',
    budget: '工程金額',
    start: '開工日',
    end: '預計完工日',
    source: '來源',
    updated: '更新日',
    address: '地點',
    category: '工程類型',
    status: '辦理狀態',
    geometry: '標示方式',
    showing: '目前顯示',
    total: '總筆數',
    page: '頁次',
    previous: '上一頁',
    next: '下一頁',
    allTaiwan: '全台視角',
    mapLabel: '台灣工程位置示意圖',
    listLabel: '工程清單',
    openSource: '查看來源',
    pageOf: '第 {page} / {pages} 頁',
    activeLoad: '現況資料已上線',
    backgroundLoad: '更多現況資料分批補上中',
    languageButton: 'EN',
    ariaLanguage: 'Switch to English',
    sourcePage: '開啟資料入口新頁 ↗',
    pin: '工程熱點',
    countProjects: '筆工程',
    billion: '億',
    noBudget: '金額待補',
    retry: '重新整理'
  },
  en: {
    documentTitle: 'Taiwan Construction Map',
    skipLink: 'Skip to project info',
    brandEyebrow: 'Location × Progress × Owner / Contractor',
    brandTitle: 'Taiwan Construction Map',
    brandSubtitle: 'Active infrastructure map',
    navMap: 'Project map',
    navSources: 'Source portals',
    navGuide: 'Data guide',
    heroPill: 'Locations, work areas, owners, contractors, schedules, and sources in one clean map.',
    heroTitle: 'Taiwan’s upgrades, mapped in one view.',
    heroText: 'A practical project radar for engineering firms, project owners, geospatial map lovers, and young readers. Check location, work scope, owner, contractor, budget, schedule, and source without the wild goose chase.',
    metricProjects: 'Active projects',
    metricCost: 'Estimated total budget',
    metricSources: 'Source portals',
    panelEyebrow: 'Project radar',
    panelTitle: 'Find projects, places, and progress',
    panelText: 'Search by project name, place, owner, or contractor. Use type, status, and pages to keep the view light, fast, and field-ready.',
    searchLabel: 'Search',
    searchPlaceholder: 'Example: Tamkang Bridge, Kaohsiung MRT, Tainan, road works, science park',
    typeLabel: 'Project type',
    typeAll: 'All types',
    statusLabel: 'Delivery status',
    statusAll: 'All status',
    resetMap: 'Taiwan view',
    toggleSources: 'Source portals',
    mapEyebrow: 'Interactive project map',
    mapTitle: 'Project points, routes, and work areas at a glance',
    mapNote: 'Tap a hotspot to view owner, contractor, budget, schedule, and source. The list is paged for faster mobile browsing.',
    mapLoading: 'Loading project data and map view.',
    sourcesEyebrow: 'Source portals',
    sourcesTitle: 'Engineering data is scattered. Layered checking is the smart move.',
    sourcesText: 'Public works, tender awards, major infrastructure, road works, EIA, permits, water, energy, and local data live in different places.',
    guideEyebrow: 'Data guide',
    guideTitle: 'Good data needs clear location, source, and fields.',
    guide1Title: '1. Add the core project facts',
    guide1Text: 'Project name, place, owner, contractor, budget, start date, target finish, and status should be complete.',
    guide2Title: '2. Mark the work area clearly',
    guide2Text: 'Use points for facilities, routes for roads and transit, and areas for parks, campuses, and sites.',
    guide3Title: '3. Keep sources traceable',
    guide3Text: 'Each project should include a source name and link so readers can cross-check the record.',
    guide4Title: '4. Mobile-first',
    guide4Text: 'Field teams and commuters often use phones, so search, pages, and project cards must stay smooth.',
    footerTitle: 'Taiwan Construction Map',
    footerText: 'The active map focuses on planned, pre-tender, tendering, under-construction, or completed/opened within one month. For official use, verify the latest notices from competent authorities and source portals.',
    loadingTitle: 'Preparing project data',
    loadingText: 'The project list and map view load first. More active records are added in batches, so the home page stays fast.',
    emptyTitle: 'No matching projects',
    emptyText: 'Try another project name, place, owner, or contractor.',
    owner: 'Owner',
    contractor: 'Contractor',
    budget: 'Project budget',
    start: 'Start',
    end: 'Target finish',
    source: 'Source',
    updated: 'Updated',
    address: 'Place',
    category: 'Project type',
    status: 'Delivery status',
    geometry: 'Map mark',
    showing: 'Showing',
    total: 'Total',
    page: 'Page',
    previous: 'Previous',
    next: 'Next',
    allTaiwan: 'Taiwan view',
    mapLabel: 'Taiwan project location map',
    listLabel: 'Project list',
    openSource: 'Check source',
    pageOf: 'Page {page} / {pages}',
    activeLoad: 'Active data is live',
    backgroundLoad: 'More records are loading in batches',
    languageButton: '中',
    ariaLanguage: 'Switch to Chinese',
    sourcePage: 'Open source portals ↗',
    pin: 'Project hotspot',
    countProjects: 'projects',
    billion: 'B',
    noBudget: 'Budget pending',
    retry: 'Refresh'
  }
};

const BUILTIN_FEATURES = [
  { type: 'Feature', properties: { id: 'builtin-001', name: '淡江大橋及連絡道路', category: '捷運/交通', status: '施工中', owner: '交通部公路局', contractor: '工信工程及相關分包團隊', budget_ntd: 23000000000, start_date: '2019-02-22', planned_end_date: '2026-12-31', address: '新北市淡水區、八里區淡水河口', source_name: '交通部公路局', source_url: 'https://www.thb.gov.tw/', updated_at: '2026-06-27' }, geometry: { type: 'Point', coordinates: [121.4008, 25.1694] } },
  { type: 'Feature', properties: { id: 'builtin-002', name: '桃園國際機場第三航廈', category: '建築/園區', status: '施工中', owner: '桃園國際機場股份有限公司', contractor: '三星物產、榮工工程等工程團隊', budget_ntd: 95600000000, start_date: '2017-05-01', planned_end_date: '2027-12-31', address: '桃園市大園區桃園國際機場', source_name: '桃園國際機場股份有限公司', source_url: 'https://www.taoyuan-airport.com/', updated_at: '2026-06-27' }, geometry: { type: 'Point', coordinates: [121.2329, 25.0781] } },
  { type: 'Feature', properties: { id: 'builtin-003', name: '桃園捷運綠線 GC01 標周邊工程', category: '捷運/交通', status: '施工中', owner: '桃園市政府捷運工程局', contractor: '大陸工程及協力廠商', budget_ntd: 9820000000, start_date: '2018-10-15', planned_end_date: '2027-07-31', address: '桃園市桃園區、中正路與經國路周邊', source_name: '桃園市政府捷運工程局', source_url: 'https://dorts.tycg.gov.tw/', updated_at: '2026-06-27' }, geometry: { type: 'Point', coordinates: [121.3015, 25.0172] } },
  { type: 'Feature', properties: { id: 'builtin-004', name: '臺北捷運萬大線第一期 CQ850 區段', category: '捷運/交通', status: '施工中', owner: '臺北市政府捷運工程局', contractor: '中華工程及相關機電團隊', budget_ntd: 7410000000, start_date: '2014-11-01', planned_end_date: '2027-12-31', address: '臺北市萬華區、中正區至新北市中和區', source_name: '臺北市政府捷運工程局', source_url: 'https://www.dorts.gov.taipei/', updated_at: '2026-06-27' }, geometry: { type: 'Point', coordinates: [121.5054, 25.0211] } },
  { type: 'Feature', properties: { id: 'builtin-005', name: '新北捷運三鶯線土城端工程', category: '捷運/交通', status: '施工中', owner: '新北市政府捷運工程局', contractor: '榮工工程及系統工程團隊', budget_ntd: 50500000000, start_date: '2016-07-21', planned_end_date: '2026-12-31', address: '新北市土城區、三峽區、鶯歌區', source_name: '新北市政府捷運工程局', source_url: 'https://www.dorts.ntpc.gov.tw/', updated_at: '2026-06-27' }, geometry: { type: 'Point', coordinates: [121.3988, 24.9526] } },
  { type: 'Feature', properties: { id: 'builtin-006', name: '高雄捷運黃線 Y15 車站周邊工程', category: '捷運/交通', status: '施工中', owner: '高雄市政府捷運工程局', contractor: '中鋼構、互助營造及相關團隊', budget_ntd: 4420000000, start_date: '2022-10-31', planned_end_date: '2029-12-31', address: '高雄市三民區、苓雅區主要路廊', source_name: '高雄市政府捷運工程局', source_url: 'https://mtbu.kcg.gov.tw/', updated_at: '2026-06-27' }, geometry: { type: 'Point', coordinates: [120.3334, 22.6432] } },
  { type: 'Feature', properties: { id: 'builtin-007', name: '臺中捷運藍線臺灣大道核心段', category: '規劃/環評', status: '招標中', owner: '臺中市政府交通局', contractor: '待決標公告', budget_ntd: 161500000000, start_date: '2026-01-01', planned_end_date: '2034-12-31', address: '臺中市臺灣大道沿線', source_name: '臺中市政府交通局', source_url: 'https://www.traffic.taichung.gov.tw/', updated_at: '2026-06-27' }, geometry: { type: 'Point', coordinates: [120.646, 24.1612] } },
  { type: 'Feature', properties: { id: 'builtin-008', name: '臺南市區鐵路地下化北段', category: '捷運/交通', status: '延宕', owner: '交通部鐵道局', contractor: '中華工程及相關工程團隊', budget_ntd: 29360000000, start_date: '2017-03-15', planned_end_date: '2027-12-31', address: '臺南市東區、北區鐵路沿線', source_name: '交通部鐵道局', source_url: 'https://www.rb.gov.tw/', updated_at: '2026-06-27' }, geometry: { type: 'Point', coordinates: [120.215, 23.005] } },
  { type: 'Feature', properties: { id: 'builtin-009', name: '嘉義市區鐵路高架化車站段', category: '捷運/交通', status: '施工中', owner: '交通部鐵道局', contractor: '東元電機、互助營造及協力團隊', budget_ntd: 23840000000, start_date: '2019-09-01', planned_end_date: '2026-12-31', address: '嘉義市西區嘉義車站周邊', source_name: '交通部鐵道局', source_url: 'https://www.rb.gov.tw/', updated_at: '2026-06-27' }, geometry: { type: 'Point', coordinates: [120.441, 23.486] } },
  { type: 'Feature', properties: { id: 'builtin-010', name: '花東鐵路雙軌化玉里段', category: '捷運/交通', status: '施工中', owner: '交通部鐵道局', contractor: '各區段工程得標廠商', budget_ntd: 45600000000, start_date: '2021-01-01', planned_end_date: '2030-12-31', address: '花蓮縣玉里鎮至臺東縣池上鄉沿線', source_name: '交通部鐵道局', source_url: 'https://www.rb.gov.tw/', updated_at: '2026-06-27' }, geometry: { type: 'Point', coordinates: [121.314, 23.332] } },
  { type: 'Feature', properties: { id: 'builtin-011', name: '臺北市道路挖掘信義幹線更新', category: '道路/管線', status: '施工中', owner: '臺北市政府工務局', contractor: '道路管線申挖核准廠商', budget_ntd: 180000000, start_date: '2026-03-01', planned_end_date: '2026-10-31', address: '臺北市信義區松仁路、信義路周邊', source_name: '臺北市道路挖掘管理中心', source_url: 'https://dig.taipei/', updated_at: '2026-06-27' }, geometry: { type: 'Point', coordinates: [121.5683, 25.0339] } },
  { type: 'Feature', properties: { id: 'builtin-012', name: '橋頭科學園區公共設施第一期', category: '建築/園區', status: '施工中', owner: '南部科學園區管理局', contractor: '園區公共工程得標廠商', budget_ntd: 12800000000, start_date: '2022-06-01', planned_end_date: '2027-12-31', address: '高雄市橋頭區橋頭科學園區', source_name: '南部科學園區管理局', source_url: 'https://www.stsp.gov.tw/', updated_at: '2026-06-27' }, geometry: { type: 'Point', coordinates: [120.325, 22.775] } }
];

const refs = {
  search: document.querySelector('#searchInput'),
  typeFilter: document.querySelector('#typeFilter'),
  statusFilter: document.querySelector('#statusFilter'),
  projectList: document.querySelector('#projectList'),
  resetMap: document.querySelector('#resetMap'),
  toggleSources: document.querySelector('#toggleSources'),
  metricProjects: document.querySelector('#metricProjects'),
  metricCost: document.querySelector('#metricCost'),
  metricSources: document.querySelector('#metricSources'),
  sourceCards: document.querySelector('#sourceCards'),
  map: document.querySelector('#map'),
  mapStatus: document.querySelector('#mapStatus'),
  languageToggle: document.querySelector('#languageToggle'),
  legend: document.querySelector('.legend'),
  mapFrame: document.querySelector('.map-frame')
};

const state = {
  lang: safeGetLang(),
  features: normalizeFeatures(BUILTIN_FEATURES),
  selectedId: '',
  page: 1,
  loadingMore: false,
  manifestTotal: 0
};

init();

async function init() {
  injectStyles();
  setLanguage(state.lang, { skipRender: true });
  hydrateFilters();
  bindEvents();
  renderAll();
  await loadCoreData();
  loadMoreInBackground();
}

function bindEvents() {
  refs.search?.addEventListener('input', () => { state.page = 1; state.selectedId = ''; renderAll(); });
  refs.typeFilter?.addEventListener('change', () => { state.page = 1; state.selectedId = ''; renderAll(); });
  refs.statusFilter?.addEventListener('change', () => { state.page = 1; state.selectedId = ''; renderAll(); });
  refs.resetMap?.addEventListener('click', resetView);
  refs.toggleSources?.addEventListener('click', event => {
    event.preventDefault();
    window.open('./sources.html', '_blank', 'noopener,noreferrer');
  });
  refs.languageToggle?.addEventListener('click', () => setLanguage(state.lang === 'zh' ? 'en' : 'zh'));
  document.addEventListener('click', event => {
    const card = event.target.closest('[data-project-id]');
    if (card) selectFeature(card.dataset.projectId);
    const pin = event.target.closest('[data-map-pin]');
    if (pin) selectFeature(pin.dataset.mapPin);
    const pageButton = event.target.closest('[data-page-action]');
    if (pageButton) changePage(pageButton.dataset.pageAction);
    if (event.target.closest('[data-refresh-map="true"]')) window.location.reload();
  });
  document.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-project-id], [data-map-pin]')) {
      event.preventDefault();
      selectFeature(event.target.dataset.projectId || event.target.dataset.mapPin);
    }
  });
}

async function loadCoreData() {
  try {
    const collection = await fetchCollection(CORE_DATA_URL, 1200);
    mergeFeatures(collection.features || []);
    renderAll();
  } catch (error) {
    console.warn('Core construction records are not reachable, built-in records are displayed.', error);
    renderAll(t('loadingText'));
  }
}

async function loadMoreInBackground() {
  if (state.loadingMore) return;
  state.loadingMore = true;
  try {
    const manifest = await fetchJson(MANIFEST_URL, 1000);
    const datasets = Array.isArray(manifest?.datasets) ? manifest.datasets : [];
    state.manifestTotal = datasets.reduce((sum, item) => sum + Number(item.count || 0), state.features.length);
    renderMetrics();
    for (const item of datasets) {
      if (state.features.length >= MAX_BACKGROUND_ITEMS) break;
      try {
        const collection = await fetchCollection(item.url, 900);
        mergeFeatures(collection.features || []);
        renderAll(t('backgroundLoad'));
        await pause(40);
      } catch (error) {
        console.warn('Skipped one construction batch while keeping the page fast.', item?.url, error);
      }
    }
  } catch (error) {
    console.warn('Manifest not reachable; core construction records remain available.', error);
  } finally {
    state.loadingMore = false;
    renderAll(t('activeLoad'));
  }
}

function fetchCollection(url, timeoutMs) {
  return fetchJson(`${url}${url.includes('?') ? '&' : '?'}v=${Date.now()}`, timeoutMs).then(data => {
    if (data?.type !== 'FeatureCollection' || !Array.isArray(data.features)) throw new Error('資料格式需再確認');
    return data;
  });
}

function fetchJson(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { cache: 'no-store', signal: controller.signal })
    .then(response => {
      if (!response.ok) throw new Error(`資料暫時無法讀取：${response.status}`);
      return response.json();
    })
    .finally(() => clearTimeout(timer));
}

function mergeFeatures(features) {
  const combined = [...state.features, ...normalizeFeatures(features)];
  const seen = new Set();
  state.features = combined.filter(feature => {
    const props = feature.properties || {};
    const key = normalize([props.source_url, props.name, props.address, props.owner].join('|')) || normalize(props.id);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const maxPage = Math.max(1, Math.ceil(getFilteredFeatures().length / PAGE_SIZE));
  if (state.page > maxPage) state.page = maxPage;
}

function normalizeFeatures(features) {
  const seen = new Set();
  return (features || []).filter(feature => {
    const props = feature?.properties || {};
    if (feature?.type !== 'Feature' || !props.name || !feature.geometry || !hasUsableGeometry(feature.geometry)) return false;
    const key = normalize(props.id || [props.name, props.address, props.source_url].join('|'));
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return isActiveRecord(props);
  });
}

function isActiveRecord(props) {
  if (props.active === false || props.cancelled === true) return false;
  const activeStatuses = new Set(['規劃中', '招標準備', '招標中', '施工中', '延宕']);
  if (activeStatuses.has(props.status)) return true;
  if (props.status === '完工') return isWithinOneMonth(props.actual_end_date || props.opened_date || props.planned_end_date);
  return false;
}

function isWithinOneMonth(value) {
  const date = new Date(`${value}T00:00:00+08:00`);
  if (Number.isNaN(date.getTime())) return false;
  const limit = new Date();
  limit.setMonth(limit.getMonth() - 1);
  return date >= limit;
}

function hasUsableGeometry(geometry) {
  if (geometry.type === 'Point') return Number.isFinite(geometry.coordinates?.[0]) && Number.isFinite(geometry.coordinates?.[1]);
  return ['LineString', 'MultiLineString', 'Polygon', 'MultiPolygon'].includes(geometry.type) && flattenCoordinates(geometry.coordinates).length > 0;
}

function renderAll(message = '') {
  renderMetrics();
  renderFiltersLabels();
  renderLayerSwitches();
  const filtered = getFilteredFeatures();
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (state.page > pageCount) state.page = pageCount;
  const pageItems = filtered.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);
  renderProjectList(pageItems, filtered.length, pageCount);
  renderMap(filtered, pageItems);
  renderStatus(message, filtered.length, pageCount);
}

function renderMetrics() {
  const total = state.features.reduce((sum, feature) => sum + Number(feature.properties?.budget_ntd || 0), 0);
  const sources = new Set(state.features.map(feature => feature.properties?.source_name).filter(Boolean)).size;
  if (refs.metricProjects) refs.metricProjects.textContent = state.manifestTotal && state.manifestTotal > state.features.length ? `${state.features.length}+` : String(state.features.length);
  if (refs.metricCost) refs.metricCost.textContent = formatMetricBudget(total);
  if (refs.metricSources) refs.metricSources.textContent = String(sources);
}

function renderFiltersLabels() {
  document.querySelectorAll('[data-i18n]').forEach(node => {
    const key = node.dataset.i18n;
    if (COPY[state.lang]?.[key]) node.textContent = t(key);
  });
  if (refs.search) refs.search.placeholder = t('searchPlaceholder');
  if (refs.languageToggle) {
    refs.languageToggle.textContent = t('languageButton');
    refs.languageToggle.setAttribute('aria-label', t('ariaLanguage'));
  }
  const sourceLink = document.querySelector('.source-page-link');
  if (sourceLink) sourceLink.textContent = t('sourcePage');
}

function hydrateFilters() {
  if (refs.typeFilter) {
    const current = refs.typeFilter.value || 'all';
    refs.typeFilter.innerHTML = `<option value="all">${escapeHtml(t('typeAll'))}</option>${CATEGORY_META.map(item => `<option value="${escapeAttr(item.key)}">${escapeHtml(labelCategory(item.key))}</option>`).join('')}`;
    refs.typeFilter.value = ['all', ...CATEGORY_META.map(item => item.key)].includes(current) ? current : 'all';
  }
  if (refs.statusFilter) {
    const statuses = Object.keys(STATUS_META);
    const current = refs.statusFilter.value || 'all';
    refs.statusFilter.innerHTML = `<option value="all">${escapeHtml(t('statusAll'))}</option>${statuses.map(status => `<option value="${escapeAttr(status)}">${escapeHtml(labelStatus(status))}</option>`).join('')}`;
    refs.statusFilter.value = ['all', ...statuses].includes(current) ? current : 'all';
  }
}

function renderLayerSwitches() {
  if (!refs.legend) return;
  const counts = new Map(CATEGORY_META.map(item => [item.key, 0]));
  state.features.forEach(feature => counts.set(feature.properties?.category, (counts.get(feature.properties?.category) || 0) + 1));
  refs.legend.classList.add('tcm-layer-list');
  refs.legend.innerHTML = CATEGORY_META.map(item => `
    <span class="tcm-layer-pill">
      <i style="--layer-color:${escapeAttr(item.color)}"></i>
      <span>${escapeHtml(labelCategory(item.key))}</span>
      <b>${counts.get(item.key) || 0}</b>
    </span>
  `).join('');
}

function renderProjectList(pageItems, total, pageCount) {
  if (!refs.projectList) return;
  if (!total) {
    refs.projectList.innerHTML = `<div class="project-card empty"><h3>${escapeHtml(t('emptyTitle'))}</h3><p>${escapeHtml(t('emptyText'))}</p></div>`;
    return;
  }
  const cards = pageItems.map(feature => {
    const props = feature.properties || {};
    const active = String(props.id) === state.selectedId ? ' active' : '';
    return `<article class="project-card${active}" data-project-id="${escapeAttr(props.id || '')}" tabindex="0">
      <div class="meta-row">
        <span class="badge" style="--badge-color:${escapeAttr(categoryColor(props.category))}">${escapeHtml(labelCategory(props.category))}</span>
        <span class="badge status">${escapeHtml(labelStatus(props.status))}</span>
      </div>
      <h3>${escapeHtml(props.name)}</h3>
      <p>${escapeHtml(props.address || '')}</p>
      <div class="mini-facts">
        <span>${escapeHtml(t('owner'))}：${escapeHtml(shorten(props.owner, 22))}</span>
        <span>${escapeHtml(t('contractor'))}：${escapeHtml(shorten(props.contractor, 22))}</span>
      </div>
    </article>`;
  }).join('');
  refs.projectList.innerHTML = `${cards}${renderPager(total, pageCount)}`;
}

function renderPager(total, pageCount) {
  if (pageCount <= 1) return `<div class="tcm-page-status">${escapeHtml(t('showing'))} ${total} ${escapeHtml(t('countProjects'))}</div>`;
  return `<nav class="tcm-pager" aria-label="${escapeAttr(t('page'))}">
    <button type="button" data-page-action="prev" ${state.page <= 1 ? 'disabled' : ''}>${escapeHtml(t('previous'))}</button>
    <span>${escapeHtml(t('pageOf').replace('{page}', state.page).replace('{pages}', pageCount))}</span>
    <button type="button" data-page-action="next" ${state.page >= pageCount ? 'disabled' : ''}>${escapeHtml(t('next'))}</button>
  </nav>
  <div class="tcm-page-status">${escapeHtml(t('showing'))} ${Math.min(PAGE_SIZE, Math.max(0, total - ((state.page - 1) * PAGE_SIZE)))} / ${total} ${escapeHtml(t('countProjects'))}</div>`;
}

function renderMap(filtered, pageItems) {
  if (!refs.map) return;
  const mapItems = filtered.slice(0, 80);
  const pins = mapItems.map(feature => {
    const props = feature.properties || {};
    const position = pointPosition(feature);
    const active = String(props.id) === state.selectedId ? ' active' : '';
    return `<button type="button" class="tcm-map-pin${active}" data-map-pin="${escapeAttr(props.id || '')}" style="left:${position.left}%;top:${position.top}%;--pin-color:${escapeAttr(categoryColor(props.category))}" aria-label="${escapeAttr(`${t('pin')}：${props.name || ''}`)}" title="${escapeAttr(props.name || '')}"></button>`;
  }).join('');

  const selected = state.features.find(feature => String(feature.properties?.id) === state.selectedId);
  const pageNames = pageItems.slice(0, 4).map(feature => escapeHtml(feature.properties?.name || '')).join('、');

  refs.map.classList.add('tcm-map-ready');
  refs.map.innerHTML = `<div class="tcm-map-canvas" role="img" aria-label="${escapeAttr(t('mapLabel'))}">
    <div class="tcm-map-grid"></div>
    <div class="tcm-map-glow"></div>
    <svg class="tcm-island" viewBox="0 0 220 460" aria-hidden="true" focusable="false">
      <path d="M123 7 C163 30 184 83 181 135 C178 196 218 245 197 303 C177 358 141 428 86 453 C48 431 39 371 31 319 C20 251 13 203 35 146 C58 85 83 35 123 7Z" />
      <path d="M76 116 C107 124 129 152 139 190 M83 235 C116 250 142 286 147 329" />
    </svg>
    ${pins}
    <div class="tcm-map-topline">
      <strong>${escapeHtml(t('mapLabel'))}</strong>
      <span>${escapeHtml(t('showing'))} ${filtered.length} ${escapeHtml(t('countProjects'))}</span>
    </div>
    ${pageNames ? `<div class="tcm-map-bottomline">${pageNames}</div>` : ''}
  </div>`;

  if (selected) {
    renderFeatureCard(selected);
  }
}

function renderStatus(message, total, pageCount) {
  if (!refs.mapStatus || state.selectedId) return;
  refs.mapStatus.classList.add('is-open');
  refs.mapStatus.innerHTML = `<article class="map-detail-card">
    <h3>${escapeHtml(message || t('activeLoad'))}</h3>
    <p>${escapeHtml(t('loadingText'))}</p>
    <dl>
      ${row(t('showing'), `${total} ${t('countProjects')}`)}
      ${row(t('page'), t('pageOf').replace('{page}', state.page).replace('{pages}', pageCount))}
      ${row(t('category'), currentTypeLabel())}
      ${row(t('status'), currentStatusLabel())}
    </dl>
  </article>`;
}

function selectFeature(id) {
  const feature = state.features.find(item => String(item.properties?.id) === String(id));
  if (!feature) return;
  state.selectedId = String(id);
  renderProjectList(getPageItems(), getFilteredFeatures().length, Math.max(1, Math.ceil(getFilteredFeatures().length / PAGE_SIZE)));
  renderMap(getFilteredFeatures(), getPageItems());
  renderFeatureCard(feature);
  refs.projectList?.querySelector(`[data-project-id="${cssEscape(id)}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function renderFeatureCard(feature) {
  if (!refs.mapStatus) return;
  const props = feature.properties || {};
  refs.mapStatus.classList.add('is-open');
  refs.mapStatus.innerHTML = `<article class="map-detail-card tcm-project-detail">
    <button class="tcm-card-close" type="button" aria-label="${escapeAttr(t('allTaiwan'))}" data-close-card>×</button>
    <div class="meta-row">
      <span class="badge" style="--badge-color:${escapeAttr(categoryColor(props.category))}">${escapeHtml(labelCategory(props.category))}</span>
      <span class="badge status">${escapeHtml(labelStatus(props.status))}</span>
    </div>
    <h3>${escapeHtml(props.name)}</h3>
    <p>${escapeHtml(props.address || '')}</p>
    <dl>
      ${row(t('owner'), props.owner)}
      ${row(t('contractor'), props.contractor)}
      ${row(t('budget'), formatBudget(props.budget_ntd))}
      ${row(t('start'), props.start_date)}
      ${row(t('end'), props.planned_end_date)}
      ${row(t('updated'), props.updated_at)}
    </dl>
    ${safeUrl(props.source_url) ? `<div class="detail-actions"><a href="${escapeAttr(props.source_url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(props.source_name || t('openSource'))} ↗</a></div>` : ''}
  </article>`;
  refs.mapStatus.querySelector('.tcm-card-close')?.addEventListener('click', event => {
    event.preventDefault();
    state.selectedId = '';
    renderAll();
  });
}

function changePage(action) {
  const total = getFilteredFeatures().length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (action === 'prev') state.page = Math.max(1, state.page - 1);
  if (action === 'next') state.page = Math.min(pageCount, state.page + 1);
  state.selectedId = '';
  renderAll();
}

function resetView() {
  state.page = 1;
  state.selectedId = '';
  if (refs.search) refs.search.value = '';
  if (refs.typeFilter) refs.typeFilter.value = 'all';
  if (refs.statusFilter) refs.statusFilter.value = 'all';
  renderAll(t('allTaiwan'));
  document.querySelector('#mapArea')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

function getFilteredFeatures() {
  const query = normalize(refs.search?.value || '');
  const type = refs.typeFilter?.value || 'all';
  const status = refs.statusFilter?.value || 'all';
  return state.features.filter(feature => {
    const props = feature.properties || {};
    const haystack = normalize([props.name, props.name_en, props.address, props.address_en, props.owner, props.owner_en, props.contractor, props.contractor_en, props.category, props.status, props.source_name].join(' '));
    return (type === 'all' || props.category === type) && (status === 'all' || props.status === status) && (!query || haystack.includes(query));
  });
}

function getPageItems() {
  const filtered = getFilteredFeatures();
  return filtered.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);
}

function setLanguage(lang, options = {}) {
  state.lang = lang === 'en' ? 'en' : 'zh';
  safeSetLang(state.lang);
  document.documentElement.lang = state.lang === 'zh' ? 'zh-Hant' : 'en';
  document.title = t('documentTitle');
  hydrateFilters();
  renderFiltersLabels();
  if (!options.skipRender) renderAll();
}

function pointPosition(feature) {
  const center = featureCenter(feature);
  if (!center) return { left: 50, top: 50 };
  const lon = center[0];
  const lat = center[1];
  const left = clamp(((lon - 119.2) / (122.35 - 119.2)) * 100, 6, 94);
  const top = clamp((1 - ((lat - 21.7) / (25.45 - 21.7))) * 100, 5, 95);
  return { left, top };
}

function featureCenter(feature) {
  const geometry = feature?.geometry;
  if (!geometry) return null;
  if (geometry.type === 'Point') return geometry.coordinates;
  const points = flattenCoordinates(geometry.coordinates);
  if (!points.length) return null;
  return [
    points.reduce((sum, point) => sum + Number(point[0] || 0), 0) / points.length,
    points.reduce((sum, point) => sum + Number(point[1] || 0), 0) / points.length
  ];
}

function flattenCoordinates(value) {
  if (!Array.isArray(value)) return [];
  if (Number.isFinite(value[0]) && Number.isFinite(value[1])) return [value];
  return value.flatMap(flattenCoordinates);
}

function categoryColor(category) {
  return CATEGORY_META.find(item => item.key === category)?.color || '#2f80ed';
}

function labelCategory(category) {
  const item = CATEGORY_META.find(entry => entry.key === category);
  return state.lang === 'en' ? (item?.en || category || '') : (category || '');
}

function labelStatus(status) {
  return state.lang === 'en' ? (STATUS_META[status] || status || '') : (status || '');
}

function currentTypeLabel() {
  return refs.typeFilter?.value === 'all' ? t('typeAll') : labelCategory(refs.typeFilter?.value);
}

function currentStatusLabel() {
  return refs.statusFilter?.value === 'all' ? t('statusAll') : labelStatus(refs.statusFilter?.value);
}

function formatMetricBudget(value) {
  const amount = Number(value || 0);
  if (!amount) return state.lang === 'en' ? 'Pending' : '待補';
  return state.lang === 'en' ? `NT$ ${(amount / 1e12).toFixed(2)}T` : `約 ${Math.round(amount / 1e8).toLocaleString('zh-Hant')}億`;
}

function formatBudget(value) {
  const amount = Number(value || 0);
  if (!amount) return t('noBudget');
  return state.lang === 'en' ? `NT$ ${(amount / 1e9).toFixed(2)}B` : `約 ${Math.round(amount / 1e8).toLocaleString('zh-Hant')} 億元`;
}

function row(label, value) {
  return `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value || '—')}</dd></div>`;
}

function safeUrl(value) {
  const url = String(value || '');
  return url.startsWith('https://') || url.startsWith('http://') ? url : '';
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function shorten(value, maxLength) {
  const text = String(value || '—');
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

function cssEscape(value) {
  if (window.CSS?.escape) return CSS.escape(String(value));
  return String(value).replaceAll('\\', '\\\\').replaceAll('"', '\\"');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('`', '&#096;');
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function pause(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function t(key) {
  return COPY[state.lang]?.[key] ?? COPY.zh[key] ?? key;
}

function safeGetLang() {
  try {
    return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'zh';
  } catch (error) {
    return 'zh';
  }
}

function safeSetLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (error) {
    return false;
  }
  return true;
}

function injectStyles() {
  if (document.getElementById('tcm-single-source-style')) return;
  const style = document.createElement('style');
  style.id = 'tcm-single-source-style';
  style.textContent = `
    .map-card{min-height:0}.map-frame{position:relative;overflow:hidden;background:#dff0f6}.map-frame #map.tcm-map-ready{height:100%;min-height:520px;touch-action:manipulation;cursor:default;background:#dff0f6}
    .tcm-map-canvas{position:absolute;inset:0;overflow:hidden;background:linear-gradient(135deg,#dff6ff 0%,#f7fbff 48%,#fff3dd 100%)}
    .tcm-map-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(15,42,68,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(15,42,68,.08) 1px,transparent 1px);background-size:44px 44px}
    .tcm-map-glow{position:absolute;inset:8%;border-radius:50%;background:radial-gradient(circle at 55% 40%,rgba(53,212,255,.28),transparent 45%),radial-gradient(circle at 70% 18%,rgba(248,178,91,.2),transparent 30%)}
    .tcm-island{position:absolute;left:38%;top:6%;width:31%;height:86%;filter:drop-shadow(0 24px 36px rgba(15,42,68,.22));opacity:.94}
    .tcm-island path:first-child{fill:rgba(255,255,255,.78);stroke:rgba(15,42,68,.35);stroke-width:4}
    .tcm-island path:last-child{fill:none;stroke:rgba(47,128,237,.42);stroke-width:9;stroke-linecap:round}
    .tcm-map-pin{position:absolute;z-index:5;width:18px;height:18px;margin:-9px 0 0 -9px;border:3px solid #fff;border-radius:999px;background:var(--pin-color,#2f80ed);box-shadow:0 10px 22px rgba(15,42,68,.32);cursor:pointer;transition:transform .16s ease,box-shadow .16s ease}
    .tcm-map-pin::after{content:"";position:absolute;inset:-9px;border-radius:999px;background:color-mix(in srgb,var(--pin-color,#2f80ed) 20%,transparent)}
    .tcm-map-pin:hover,.tcm-map-pin:focus-visible,.tcm-map-pin.active{transform:scale(1.35);outline:0;box-shadow:0 12px 28px rgba(15,42,68,.4)}
    .tcm-map-topline,.tcm-map-bottomline{position:absolute;z-index:6;left:14px;right:14px;display:flex;gap:10px;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:16px;background:rgba(255,255,255,.88);box-shadow:0 14px 28px rgba(15,42,68,.14);color:#102131;font-weight:900}
    .tcm-map-topline{top:14px}.tcm-map-topline span{color:#647486;font-size:12px}.tcm-map-bottomline{bottom:14px;display:block;font-size:12px;color:#425466;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .tcm-layer-list{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
    .tcm-layer-pill{display:flex!important;align-items:center;gap:8px;border-radius:14px!important;white-space:nowrap}.tcm-layer-pill i{width:11px;height:11px;border-radius:999px;background:var(--layer-color)}.tcm-layer-pill b{margin-left:auto;background:#eef6ff;color:#1d5d93;border-radius:999px;padding:2px 7px;font-size:11px}
    .project-card{border-left:5px solid transparent}.project-card .badge:first-child{background:color-mix(in srgb,var(--badge-color,#2f80ed) 12%,#fff);color:#16334c}.project-card.active{border-left-color:#35d4ff}
    .tcm-pager{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;padding:2px 0 0}.tcm-pager button{min-height:40px;border-radius:14px}.tcm-pager button:disabled{opacity:.45;cursor:not-allowed;transform:none}.tcm-pager span,.tcm-page-status{text-align:center;color:#647486;font-size:12px;font-weight:900}.tcm-page-status{padding:8px 0 0}
    .tcm-card-close{position:absolute;right:10px;top:10px;width:34px;min-height:34px;padding:0;border-radius:50%;box-shadow:none}.tcm-project-detail{position:relative}.map-detail-card dl{grid-template-columns:repeat(2,minmax(0,1fr))}
    @media(max-width:1180px){.map-frame #map.tcm-map-ready{min-height:430px}.tcm-island{left:36%;width:34%}}
    @media(max-width:760px){body{padding-bottom:calc(92px + env(safe-area-inset-bottom))}.hero-metrics{grid-template-columns:repeat(3,minmax(0,1fr))!important}.hero-metrics strong{font-size:clamp(22px,7vw,30px)!important}.hero-metrics span{font-size:11px!important}.control-panel{max-height:none!important}.project-list{max-height:none!important;overflow:visible!important}.map-card{display:grid;grid-template-rows:auto minmax(380px,52svh)!important}.map-frame{height:auto!important;max-height:none!important;min-height:380px!important}.map-frame #map.tcm-map-ready{height:100%!important;min-height:380px!important}.map-status{position:absolute!important;left:10px!important;right:10px!important;bottom:10px!important;max-height:44%!important;padding:10px 12px!important}.map-status .map-detail-card p{display:block!important;font-size:12px}.map-detail-card dl{grid-template-columns:1fr}.tcm-layer-list{display:flex!important;overflow-x:auto}.tcm-layer-pill{min-width:max-content}.tcm-map-topline{display:grid;gap:2px}.tcm-map-bottomline{display:none}.tcm-island{left:34%;top:8%;width:40%;height:82%}.quick-actions{grid-template-columns:1fr 1fr!important}.filter-grid{grid-template-columns:1fr 1fr!important}}
    @media(max-width:420px){.hero-metrics{grid-template-columns:repeat(3,minmax(0,1fr))!important}.filter-grid{grid-template-columns:1fr!important}.quick-actions{grid-template-columns:1fr!important}.map-card{grid-template-rows:auto minmax(340px,50svh)!important}.map-frame #map.tcm-map-ready{min-height:340px!important}}
  `;
  document.head.append(style);
}
