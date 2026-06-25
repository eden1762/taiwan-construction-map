import { PROJECTS, PROJECT_TYPES, DATA_SOURCES } from './data/projects.js';

const TILE_SIZE = 256;
const MIN_ZOOM = 6;
const MAX_ZOOM = 15;
const DEFAULT_VIEW = { lat: 23.78, lng: 120.98, zoom: 7 };
const LANG_KEY = 'taiwan-construction-map-language';

const COPY = {
  zh: {
    documentTitle: '台灣工程地圖｜Taiwan Construction Map',
    skipLink: '跳到工程資訊',
    brandEyebrow: '工程位置 × 進度 × 甲乙方',
    brandTitle: '台灣工程地圖',
    brandSubtitle: 'Taiwan Construction Map',
    navMap: '工程地圖',
    navSources: '資料入口',
    navGuide: '補資料',
    heroPill: 'OpenStreetMap 開放底圖；只載入需要的地圖畫面，手機速度更穩。',
    heroTitle: '台灣正在升級的地方，一張圖先 get。',
    heroText: '給工程公司、發包甲方、地圖控與年輕使用者看的工程雷達。先看位置與施工範圍，再看甲方、乙方、開工日、預計完工與啟用日；資訊不迷路，城市進度直接開圖。',
    metricProjects: '工程/資料圖層',
    metricCost: '工程級距總覽',
    metricSources: '可查資料入口',
    panelEyebrow: '工程雷達',
    panelTitle: '先找地點，再看工程脈絡',
    panelText: '輸入地名、工程名、廠商或發包單位，快速定位。適合估案、查進度、看城市變化，也適合地圖玩家開圖探索。',
    searchLabel: '搜尋',
    searchPlaceholder: '例：淡江大橋、高雄捷運、工信工程、道路挖掘',
    typeLabel: '類型',
    typeAll: '全部類型',
    statusLabel: '狀態',
    statusAll: '全部狀態',
    resetMap: '回到全台',
    toggleSources: '看資料入口',
    legendPublic: '公共工程',
    legendTransit: '捷運/交通',
    legendRoad: '道路/管線',
    legendPlanning: '規劃/環評',
    legendBuilding: '建築/園區',
    mapEyebrow: 'OpenStreetMap 電子地圖',
    mapTitle: '台灣工程現場一眼看',
    mapNote: '可拖曳、縮放、查看道路地名與城市位置。手機瀏覽時先順滑看內容，需要移動地圖時再點一下啟用。',
    mapLoading: '電子地圖準備中，工程清單仍可先查。',
    sourcesEyebrow: '資料入口',
    sourcesTitle: '工程資料很分散，要分層查才準。',
    sourcesText: '公共工程、採購決標、重大建設、道路挖掘、環評、建管、能源水利與地方開放資料各有入口。這裡把常用平台集中，方便工程公司、甲方、地圖控交叉查證。',
    guideEyebrow: '補資料指南',
    guideTitle: '資料要好用，關鍵是位置、來源與欄位一致。',
    guide1Title: '1. 補上工程基本盤',
    guide1Text: '工程名、地點、甲方、乙方、經費、開工日、預計完工日與啟用日要盡量完整，查案才順。',
    guide2Title: '2. 標清楚施工範圍',
    guide2Text: '橋梁、道路、捷運適合畫路線；園區與基地適合畫範圍；單一設施用標記點。地圖準，信任感就上來。',
    guide3Title: '3. 來源要能回查',
    guide3Text: '每筆資料都盡量附官方公告、採購資料、工程頁面或地方圖台。看到來源，資訊力直接 up。',
    guide4Title: '4. 手機先好用',
    guide4Text: '現場人員、通勤族、地圖控多半用手機看；清單、篩選、地圖點擊都要單手可用、載入快速。',
    footerTitle: '台灣工程地圖｜Taiwan Construction Map',
    footerText: '工程位置、經費、期程與甲乙方資料，請以各主管機關、政府電子採購網、公共工程雲端服務網、建管、環評與地方圖台最新公告為準。地圖底圖 © OpenStreetMap contributors。',
    emptyTitle: '沒有符合條件的工程',
    emptyText: '換個地名、工程名、甲方或乙方，讓地圖重新開圖。',
    owner: '甲方',
    contractor: '乙方',
    cost: '經費/級距',
    area: '施工範圍',
    ownerFull: '發包甲方',
    contractorFull: '乙方/廠商',
    startDate: '開工日期',
    expectedFinish: '預計完工日',
    expectedOpen: '預計啟用日',
    source: '資料來源',
    missing: '待官方資料回填',
    openSource: '打開資料來源 ↗',
    openMap: '用 OpenStreetMap 看位置 ↗',
    sourceFit: '適合查：',
    sourceCta: '前往資料入口',
    metricCostValue: '多層級',
    mapReady: 'OpenStreetMap 電子地圖已載入，可拖曳縮放並點選工程熱點。',
    initHint: '可拖曳、滾輪縮放，點選工程熱點看甲方、乙方、工期與來源。手機上想往下看，直接滑就好。',
    resetHint: '已回到全台 OpenStreetMap 視角，點選任一工程熱點開始探索。',
    filterHint: count => `目前顯示 ${count} 個工程熱點與資料圖層。`,
    filterEmpty: '目前沒有符合條件的工程，換個地名、廠商或資料入口再試試。',
    zoomHint: zoom => `目前地圖縮放層級：${zoom}。`,
    mapTouchEnable: '啟用地圖',
    mapTouchDisable: '鎖住地圖',
    mapTouchActive: '地圖拖曳已開啟；再點一次可恢復網頁滑動優先。',
    mapTouchLocked: '手機滑動已改成網頁優先，不會被地圖卡住。要移動地圖請點「啟用地圖」。',
    languageButton: 'EN',
    ariaLanguage: 'Switch to English'
  },
  en: {
    documentTitle: 'Taiwan Construction Map｜Engineering Radar',
    skipLink: 'Skip to engineering info',
    brandEyebrow: 'Location × Progress × Owner / Contractor',
    brandTitle: 'Taiwan Construction Map',
    brandSubtitle: 'Engineering Radar',
    navMap: 'Map',
    navSources: 'Sources',
    navGuide: 'Data guide',
    heroPill: 'OpenStreetMap base map; lightweight map loading for smoother mobile browsing.',
    heroTitle: 'Taiwan’s upgrades, mapped in one view.',
    heroText: 'A construction radar for engineering firms, project owners, map lovers, and younger readers. Check location, work area, owner, contractor, start date, target finish, and opening timeline without getting lost in scattered sources.',
    metricProjects: 'Projects / layers',
    metricCost: 'Cost levels',
    metricSources: 'Source portals',
    panelEyebrow: 'Engineering radar',
    panelTitle: 'Find a place, then read the project story',
    panelText: 'Search by place, project name, contractor, or owner. Useful for bid scouting, progress checks, city watching, and map exploration.',
    searchLabel: 'Search',
    searchPlaceholder: 'Example: Tamkang Bridge, Kaohsiung MRT, road works',
    typeLabel: 'Type',
    typeAll: 'All types',
    statusLabel: 'Status',
    statusAll: 'All status',
    resetMap: 'Taiwan view',
    toggleSources: 'Source list',
    legendPublic: 'Public works',
    legendTransit: 'Transit / traffic',
    legendRoad: 'Road / utilities',
    legendPlanning: 'Planning / EIA',
    legendBuilding: 'Buildings / parks',
    mapEyebrow: 'OpenStreetMap map',
    mapTitle: 'Construction sites at a glance',
    mapNote: 'Drag, zoom, and read city locations. On mobile, page scrolling comes first; tap once when you want to move the map.',
    mapLoading: 'Map is loading. The project list is still ready.',
    sourcesEyebrow: 'Source portals',
    sourcesTitle: 'Engineering data is scattered. Layered checking is the smart move.',
    sourcesText: 'Public works, procurement awards, major projects, road works, EIA, building permits, energy, water, and local open data all live in different places. This page gathers common entry points for cross-checking.',
    guideEyebrow: 'Data guide',
    guideTitle: 'Good data needs clear location, source, and fields.',
    guide1Title: '1. Add the core project facts',
    guide1Text: 'Project name, location, owner, contractor, budget, start date, target finish, and opening date make case tracking much smoother.',
    guide2Title: '2. Mark the work area clearly',
    guide2Text: 'Bridges, roads, and rail lines work well as routes; parks and campuses need area shapes; single facilities can use pins. Accurate maps build trust.',
    guide3Title: '3. Keep sources traceable',
    guide3Text: 'Attach official notices, procurement records, project pages, or local map portals whenever possible. Source clarity is instant credibility.',
    guide4Title: '4. Mobile-first for real users',
    guide4Text: 'Site staff, commuters, and map fans often check by phone. Lists, filters, and map taps should be easy with one hand and quick to load.',
    footerTitle: 'Taiwan Construction Map',
    footerText: 'For project location, budget, timeline, owner, and contractor data, please verify with the latest official notices from competent authorities, procurement portals, public works systems, building management, EIA records, and local map portals. Map base © OpenStreetMap contributors.',
    emptyTitle: 'No matching projects',
    emptyText: 'Try another place, project name, owner, or contractor to reopen the map view.',
    owner: 'Owner',
    contractor: 'Contractor',
    cost: 'Cost / level',
    area: 'Work area',
    ownerFull: 'Project owner',
    contractorFull: 'Contractor',
    startDate: 'Start date',
    expectedFinish: 'Target finish',
    expectedOpen: 'Target opening',
    source: 'Source',
    missing: 'Pending official data',
    openSource: 'Open source ↗',
    openMap: 'View on OpenStreetMap ↗',
    sourceFit: 'Best for: ',
    sourceCta: 'Open source portal',
    metricCostValue: 'Multi-level',
    mapReady: 'OpenStreetMap is ready. Drag, zoom, and tap project hotspots.',
    initHint: 'Drag or use the zoom buttons, then tap a project hotspot for owner, contractor, timeline, and source. On mobile, just swipe to keep reading.',
    resetHint: 'Back to the full Taiwan view. Tap any project hotspot to start exploring.',
    filterHint: count => `Showing ${count} project hotspots and data layers.`,
    filterEmpty: 'No matching projects right now. Try another place, contractor, or source keyword.',
    zoomHint: zoom => `Current map zoom: ${zoom}.`,
    mapTouchEnable: 'Move map',
    mapTouchDisable: 'Lock map',
    mapTouchActive: 'Map dragging is on. Tap again to prioritize page scrolling.',
    mapTouchLocked: 'Mobile scrolling now comes first, so the map will not trap the page. Tap “Move map” to drag it.',
    languageButton: '中',
    ariaLanguage: '切換成中文'
  }
};

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
  languageToggle: document.querySelector('#languageToggle')
};

let activeId = '';
let visibleProjects = [...PROJECTS];
let mapView = { ...DEFAULT_VIEW };
let dragStart = null;
let resizeTimer = null;
let mobileMapActive = false;
let currentLang = localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'zh';

init();

function init() {
  hydrateFilters();
  renderMetrics();
  setLanguage(currentLang, { skipRender: true });
  renderSources();
  renderProjects(visibleProjects);
  renderMap(visibleProjects);
  bindEvents();
  showMapHint(t('initHint'));
}

function bindEvents() {
  refs.search.addEventListener('input', applyFilters);
  refs.typeFilter.addEventListener('change', applyFilters);
  refs.statusFilter.addEventListener('change', applyFilters);
  refs.resetMap.addEventListener('click', resetView);
  refs.toggleSources.addEventListener('click', () => {
    document.querySelector('#sourcePanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  refs.languageToggle.addEventListener('click', () => {
    setLanguage(currentLang === 'zh' ? 'en' : 'zh');
  });

  refs.map.addEventListener('wheel', event => {
    event.preventDefault();
    setZoom(mapView.zoom + (event.deltaY < 0 ? 1 : -1));
  }, { passive: false });

  refs.map.addEventListener('pointerdown', event => {
    if (event.target.closest('[data-project-id]') || event.target.closest('.map-zoom-control') || event.target.closest('.map-touch-toggle')) return;
    if (isTouchScrollFirst(event)) return;
    refs.map.setPointerCapture?.(event.pointerId);
    const centerWorld = latLngToWorld(mapView.lat, mapView.lng, mapView.zoom);
    dragStart = { x: event.clientX, y: event.clientY, centerWorld };
    refs.map.classList.add('dragging');
  });

  refs.map.addEventListener('pointermove', event => {
    if (!dragStart) return;
    const dx = event.clientX - dragStart.x;
    const dy = event.clientY - dragStart.y;
    const nextCenter = worldToLatLng(dragStart.centerWorld.x - dx, dragStart.centerWorld.y - dy, mapView.zoom);
    mapView = { ...mapView, lat: nextCenter.lat, lng: nextCenter.lng };
    renderMap(visibleProjects, { keepStatus: true });
  });

  refs.map.addEventListener('pointerup', endDrag);
  refs.map.addEventListener('pointercancel', endDrag);

  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => renderMap(visibleProjects, { keepStatus: true }), 120);
  });
}

function setLanguage(lang, options = {}) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  document.title = t('documentTitle');

  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    if (typeof COPY[lang][key] === 'string') element.textContent = COPY[lang][key];
  });

  refs.search.placeholder = t('searchPlaceholder');
  refs.typeFilter.options[0].textContent = t('typeAll');
  refs.statusFilter.options[0].textContent = t('statusAll');
  refs.languageToggle.textContent = t('languageButton');
  refs.languageToggle.setAttribute('aria-label', t('ariaLanguage'));
  renderMetrics();

  if (!options.skipRender) {
    renderSources();
    renderProjects(visibleProjects);
    renderMap(visibleProjects, { keepStatus: true });
    showMapHint(t('initHint'));
  }
}

function endDrag(event) {
  if (!dragStart) return;
  refs.map.releasePointerCapture?.(event.pointerId);
  dragStart = null;
  refs.map.classList.remove('dragging');
}

function resetView() {
  activeId = '';
  visibleProjects = [...PROJECTS];
  refs.search.value = '';
  refs.typeFilter.value = 'all';
  refs.statusFilter.value = 'all';
  mapView = { ...DEFAULT_VIEW };
  renderProjects(visibleProjects);
  renderMap(visibleProjects);
  showMapHint(t('resetHint'));
}

function hydrateFilters() {
  Object.entries(PROJECT_TYPES).forEach(([key, config]) => {
    refs.typeFilter.add(new Option(config.label, key));
  });

  const statuses = [...new Set(PROJECTS.map(project => project.status))].sort((a, b) => a.localeCompare(b, 'zh-Hant'));
  statuses.forEach(status => refs.statusFilter.add(new Option(status, status)));
}

function applyFilters() {
  const keyword = normalize(refs.search.value);
  const type = refs.typeFilter.value;
  const status = refs.statusFilter.value;

  visibleProjects = PROJECTS.filter(project => {
    const matchesType = type === 'all' || project.type === type;
    const matchesStatus = status === 'all' || project.status === status;
    const text = normalize(`${project.name} ${project.shortName} ${project.region} ${project.owner} ${project.contractor} ${project.summary} ${project.area} ${project.sourceLabel} ${project.tags?.join(' ') ?? ''}`);
    const matchesKeyword = !keyword || text.includes(keyword);
    return matchesType && matchesStatus && matchesKeyword;
  });

  if (!visibleProjects.some(project => project.id === activeId)) activeId = '';

  renderProjects(visibleProjects);
  renderMap(visibleProjects);
  showMapHint(visibleProjects.length ? t('filterHint')(visibleProjects.length) : t('filterEmpty'));
}

function renderProjects(projects) {
  refs.projectList.innerHTML = '';

  if (projects.length === 0) {
    refs.projectList.innerHTML = `<div class="project-card empty"><h3>${escapeHtml(t('emptyTitle'))}</h3><p>${escapeHtml(t('emptyText'))}</p></div>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  projects.forEach(project => {
    const card = document.createElement('article');
    card.className = `project-card${project.id === activeId ? ' active' : ''}`;
    card.tabIndex = 0;
    card.dataset.projectId = project.id;
    card.innerHTML = `
      <div class="meta-row">
        <span class="badge">${escapeHtml(PROJECT_TYPES[project.type]?.label ?? '工程')}</span>
        <span class="badge status">${escapeHtml(project.status)}</span>
        <span class="badge confidence">${escapeHtml(project.confidence)}</span>
      </div>
      <h3>${escapeHtml(project.name)}</h3>
      <p>${escapeHtml(project.region)}｜${escapeHtml(project.summary)}</p>
      <div class="mini-facts">
        <span>${escapeHtml(t('owner'))}：${escapeHtml(shorten(project.owner, 18))}</span>
        <span>${escapeHtml(t('contractor'))}：${escapeHtml(shorten(project.contractor, 18))}</span>
      </div>
    `;
    card.addEventListener('click', () => selectProject(project.id));
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectProject(project.id);
      }
    });
    fragment.append(card);
  });

  refs.projectList.append(fragment);
}

function renderMap(projects, options = {}) {
  refs.map.classList.toggle('map-touch-active', mobileMapActive);
  const width = Math.max(refs.map.clientWidth || 900, 320);
  const height = Math.max(refs.map.clientHeight || 620, 360);
  const tiles = buildTiles(width, height);
  const overlay = buildOverlay(projects, width, height);

  refs.map.innerHTML = `
    <div class="real-map" style="width:${width}px;height:${height}px" aria-label="OpenStreetMap 台灣工程電子地圖">
      <div class="tile-layer">${tiles}</div>
      <svg class="map-overlay" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" aria-hidden="false">
        ${overlay}
      </svg>
      <button type="button" class="map-touch-toggle">${escapeHtml(mobileMapActive ? t('mapTouchDisable') : t('mapTouchEnable'))}</button>
      <div class="map-zoom-control" aria-label="地圖縮放">
        <button type="button" data-zoom="in" aria-label="放大地圖">＋</button>
        <button type="button" data-zoom="out" aria-label="縮小地圖">－</button>
      </div>
      <div class="map-attribution">© OpenStreetMap contributors</div>
    </div>
  `;

  refs.map.querySelector('.map-touch-toggle')?.addEventListener('click', () => {
    mobileMapActive = !mobileMapActive;
    refs.map.classList.toggle('map-touch-active', mobileMapActive);
    renderMap(visibleProjects, { keepStatus: true });
    showMapHint(mobileMapActive ? t('mapTouchActive') : t('mapTouchLocked'));
  });

  refs.map.querySelectorAll('[data-project-id]').forEach(element => {
    element.addEventListener('click', event => {
      event.stopPropagation();
      selectProject(element.dataset.projectId);
    });
    element.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectProject(element.dataset.projectId);
      }
    });
  });

  refs.map.querySelector('[data-zoom="in"]')?.addEventListener('click', () => setZoom(mapView.zoom + 1));
  refs.map.querySelector('[data-zoom="out"]')?.addEventListener('click', () => setZoom(mapView.zoom - 1));

  if (!options.keepStatus) showMapHint(t('mapReady'));
}

function buildTiles(width, height) {
  const center = latLngToWorld(mapView.lat, mapView.lng, mapView.zoom);
  const startX = Math.floor((center.x - width / 2) / TILE_SIZE);
  const endX = Math.floor((center.x + width / 2) / TILE_SIZE);
  const startY = Math.floor((center.y - height / 2) / TILE_SIZE);
  const endY = Math.floor((center.y + height / 2) / TILE_SIZE);
  const maxTile = 2 ** mapView.zoom;
  const parts = [];

  for (let x = startX; x <= endX; x += 1) {
    for (let y = startY; y <= endY; y += 1) {
      if (y < 0 || y >= maxTile) continue;
      const wrappedX = ((x % maxTile) + maxTile) % maxTile;
      const left = x * TILE_SIZE - center.x + width / 2;
      const top = y * TILE_SIZE - center.y + height / 2;
      parts.push(`<img class="map-tile" src="https://tile.openstreetmap.org/${mapView.zoom}/${wrappedX}/${y}.png" alt="" loading="lazy" decoding="async" style="left:${left}px;top:${top}px" onerror="this.classList.add('tile-error')" />`);
    }
  }

  return parts.join('');
}

function buildOverlay(projects, width, height) {
  const items = projects.map(project => createProjectGraphic(project, width, height)).join('');
  return `<g class="project-layer">${items}</g>`;
}

function createProjectGraphic(project, width, height) {
  const color = PROJECT_TYPES[project.type]?.color ?? '#2f80ed';
  const geometry = project.geometry;
  const centroid = getCentroid(geometry.coordinates);
  const labelPoint = mapPixel(centroid, width, height);
  const activeClass = project.id === activeId ? ' active' : '';
  const title = `${project.shortName || project.name}｜${project.status}`;
  const label = `<text x="${labelPoint.x + 15}" y="${labelPoint.y - 13}">${escapeHtml(project.shortName || project.name)}</text>`;

  if (geometry.type === 'line') {
    const points = geometry.coordinates.map(coord => {
      const point = mapPixel(coord, width, height);
      return `${point.x},${point.y}`;
    }).join(' ');
    return `
      <g class="project-item project-line${activeClass}" tabindex="0" data-project-id="${escapeAttr(project.id)}" style="--project-color:${escapeAttr(color)}">
        <title>${escapeHtml(title)}</title>
        <polyline points="${points}"></polyline>
        <circle cx="${labelPoint.x}" cy="${labelPoint.y}" r="11"></circle>
        ${label}
      </g>
    `;
  }

  if (geometry.type === 'polygon') {
    const points = geometry.coordinates.map(coord => {
      const point = mapPixel(coord, width, height);
      return `${point.x},${point.y}`;
    }).join(' ');
    return `
      <g class="project-item project-polygon${activeClass}" tabindex="0" data-project-id="${escapeAttr(project.id)}" style="--project-color:${escapeAttr(color)}">
        <title>${escapeHtml(title)}</title>
        <polygon points="${points}"></polygon>
        <circle cx="${labelPoint.x}" cy="${labelPoint.y}" r="11"></circle>
        ${label}
      </g>
    `;
  }

  return `
    <g class="project-item project-point${activeClass}" tabindex="0" data-project-id="${escapeAttr(project.id)}" style="--project-color:${escapeAttr(color)}">
      <title>${escapeHtml(title)}</title>
      <circle cx="${labelPoint.x}" cy="${labelPoint.y}" r="16"></circle>
      ${label}
    </g>
  `;
}

function selectProject(projectId) {
  const project = PROJECTS.find(item => item.id === projectId);
  if (!project) return;

  activeId = projectId;
  const center = getCentroid(project.geometry.coordinates);
  if (project.geometry.type !== 'polygon') {
    mapView = { ...mapView, lat: center[0], lng: center[1], zoom: Math.max(mapView.zoom, 11) };
  }
  renderProjects(visibleProjects);
  renderMap(visibleProjects, { keepStatus: true });
  showProjectDetail(project);

  const activeCard = refs.projectList.querySelector(`[data-project-id="${cssEscape(projectId)}"]`);
  activeCard?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function showProjectDetail(project) {
  refs.mapStatus.hidden = false;
  refs.mapStatus.innerHTML = `
    <article class="map-detail-card">
      <div class="meta-row">
        <span class="badge">${escapeHtml(PROJECT_TYPES[project.type]?.label ?? '工程')}</span>
        <span class="badge status">${escapeHtml(project.status)}</span>
        <span class="badge confidence">${escapeHtml(project.confidence)}</span>
      </div>
      <h3>${escapeHtml(project.name)}</h3>
      <p>${escapeHtml(project.summary)}</p>
      <dl>
        ${detailRow(t('cost'), project.cost)}
        ${detailRow(t('area'), `${project.region}｜${project.area}`)}
        ${detailRow(t('ownerFull'), project.owner)}
        ${detailRow(t('contractorFull'), project.contractor)}
        ${detailRow(t('startDate'), project.startDate)}
        ${detailRow(t('expectedFinish'), project.expectedFinish)}
        ${detailRow(t('expectedOpen'), project.expectedOpen)}
        ${detailRow(t('source'), project.sourceLabel)}
      </dl>
      <div class="detail-actions">
        <a href="${safeUrl(project.source)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('openSource'))}</a>
        <a href="${safeUrl(openMapUrl(project))}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('openMap'))}</a>
      </div>
    </article>
  `;
}

function showMapHint(message) {
  refs.mapStatus.hidden = false;
  refs.mapStatus.textContent = message;
}

function renderSources() {
  refs.sourceCards.innerHTML = DATA_SOURCES.map(source => `
    <article class="source-card">
      <div class="source-topline">
        <span class="badge">${escapeHtml(source.category)}</span>
        <span>${escapeHtml(source.kind)}</span>
      </div>
      <h3>${escapeHtml(source.name)}</h3>
      <p><strong>${escapeHtml(t('sourceFit'))}</strong>${escapeHtml(source.fitFor)}</p>
      <p>${escapeHtml(source.note)}</p>
      <a href="${safeUrl(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('sourceCta'))}</a>
    </article>
  `).join('');
}

function renderMetrics() {
  refs.metricProjects.textContent = PROJECTS.length.toString();
  refs.metricSources.textContent = DATA_SOURCES.length.toString();
  refs.metricCost.textContent = t('metricCostValue');
}

function detailRow(label, value) {
  return `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value || t('missing'))}</dd></div>`;
}

function setZoom(nextZoom) {
  const zoom = clamp(Math.round(nextZoom), MIN_ZOOM, MAX_ZOOM);
  if (zoom === mapView.zoom) return;
  mapView = { ...mapView, zoom };
  renderMap(visibleProjects, { keepStatus: true });
  showMapHint(t('zoomHint')(zoom));
}

function mapPixel([lat, lng], width, height) {
  const point = latLngToWorld(lat, lng, mapView.zoom);
  const center = latLngToWorld(mapView.lat, mapView.lng, mapView.zoom);
  return {
    x: point.x - center.x + width / 2,
    y: point.y - center.y + height / 2
  };
}

function latLngToWorld(lat, lng, zoom) {
  const sin = Math.sin((clamp(lat, -85.05112878, 85.05112878) * Math.PI) / 180);
  const scale = TILE_SIZE * 2 ** zoom;
  return {
    x: ((lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale
  };
}

function worldToLatLng(x, y, zoom) {
  const scale = TILE_SIZE * 2 ** zoom;
  const lng = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return { lat: clamp(lat, -85.05112878, 85.05112878), lng: wrapLng(lng) };
}

function getCentroid(coordinates) {
  const points = flattenCoordinates(coordinates);
  if (!points.length) return [DEFAULT_VIEW.lat, DEFAULT_VIEW.lng];
  const totals = points.reduce((sum, point) => [sum[0] + point[0], sum[1] + point[1]], [0, 0]);
  return [totals[0] / points.length, totals[1] / points.length];
}

function flattenCoordinates(value) {
  if (!Array.isArray(value)) return [];
  if (typeof value[0] === 'number' && typeof value[1] === 'number') return [value];
  return value.flatMap(flattenCoordinates);
}

function openMapUrl(project) {
  if (project.openMapUrl) return project.openMapUrl;
  const [lat, lng] = getCentroid(project.geometry.coordinates);
  return `https://www.openstreetmap.org/?mlat=${lat.toFixed(5)}&mlon=${lng.toFixed(5)}#map=14/${lat.toFixed(5)}/${lng.toFixed(5)}`;
}

function isTouchScrollFirst(event) {
  return event.pointerType !== 'mouse' && isMobileLike() && !mobileMapActive;
}

function isMobileLike() {
  return window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;
}

function t(key) {
  return COPY[currentLang][key] ?? COPY.zh[key] ?? key;
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function wrapLng(lng) {
  return ((((lng + 180) % 360) + 360) % 360) - 180;
}

function shorten(value, max) {
  const text = String(value || t('missing'));
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function safeUrl(value) {
  const text = String(value || '');
  if (text.startsWith('https://') || text.startsWith('http://')) return escapeAttr(text);
  return '#';
}

function cssEscape(value) {
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
