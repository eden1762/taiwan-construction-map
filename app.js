import { PROJECTS, PROJECT_TYPES, DATA_SOURCES } from './data/projects.js';

const TILE_SIZE = 256;
const MIN_ZOOM = 6;
const MAX_ZOOM = 15;
const DEFAULT_VIEW = { lat: 23.78, lng: 120.98, zoom: 7 };

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
  mapStatus: document.querySelector('#mapStatus')
};

let activeId = '';
let visibleProjects = [...PROJECTS];
let mapView = { ...DEFAULT_VIEW };
let dragStart = null;
let resizeTimer = null;

init();

function init() {
  hydrateFilters();
  renderSources();
  renderMetrics();
  renderProjects(visibleProjects);
  renderMap(visibleProjects);
  bindEvents();
  showMapHint('可拖曳、滾輪縮放，點選工程熱點看甲方、乙方、工期與來源。');
}

function bindEvents() {
  refs.search.addEventListener('input', applyFilters);
  refs.typeFilter.addEventListener('change', applyFilters);
  refs.statusFilter.addEventListener('change', applyFilters);
  refs.resetMap.addEventListener('click', resetView);
  refs.toggleSources.addEventListener('click', () => {
    document.querySelector('#sourcePanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  refs.map.addEventListener('wheel', event => {
    event.preventDefault();
    setZoom(mapView.zoom + (event.deltaY < 0 ? 1 : -1));
  }, { passive: false });

  refs.map.addEventListener('pointerdown', event => {
    if (event.target.closest('[data-project-id]') || event.target.closest('.map-zoom-control')) return;
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
  showMapHint('已回到全台 OpenStreetMap 視角，點選任一工程熱點開始探索。');
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
  showMapHint(visibleProjects.length ? `目前顯示 ${visibleProjects.length} 個工程熱點與資料圖層。` : '目前沒有符合條件的工程，換個地名、廠商或資料入口再試試。');
}

function renderProjects(projects) {
  refs.projectList.innerHTML = '';

  if (projects.length === 0) {
    refs.projectList.innerHTML = '<div class="project-card empty"><h3>沒有符合條件的工程</h3><p>換個地名、工程名、甲方或乙方，讓地圖重新開圖。</p></div>';
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
        <span>甲方：${escapeHtml(shorten(project.owner, 18))}</span>
        <span>乙方：${escapeHtml(shorten(project.contractor, 18))}</span>
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
  const width = Math.max(refs.map.clientWidth || 900, 320);
  const height = Math.max(refs.map.clientHeight || 620, 420);
  const tiles = buildTiles(width, height);
  const overlay = buildOverlay(projects, width, height);

  refs.map.innerHTML = `
    <div class="real-map" style="width:${width}px;height:${height}px" aria-label="OpenStreetMap 台灣工程電子地圖">
      <div class="tile-layer">${tiles}</div>
      <svg class="map-overlay" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" aria-hidden="false">
        ${overlay}
      </svg>
      <div class="map-zoom-control" aria-label="地圖縮放">
        <button type="button" data-zoom="in" aria-label="放大地圖">＋</button>
        <button type="button" data-zoom="out" aria-label="縮小地圖">－</button>
      </div>
      <div class="map-attribution">© OpenStreetMap contributors</div>
    </div>
  `;

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

  if (!options.keepStatus) showMapHint('OpenStreetMap 電子地圖已載入，可拖曳縮放並點選工程熱點。');
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
      parts.push(`<img class="map-tile" src="https://tile.openstreetmap.org/${mapView.zoom}/${wrappedX}/${y}.png" alt="" loading="eager" decoding="async" style="left:${left}px;top:${top}px" onerror="this.classList.add('tile-error')" />`);
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
        ${detailRow('經費/級距', project.cost)}
        ${detailRow('施工範圍', `${project.region}｜${project.area}`)}
        ${detailRow('發包甲方', project.owner)}
        ${detailRow('乙方/廠商', project.contractor)}
        ${detailRow('開工日期', project.startDate)}
        ${detailRow('預計完工日', project.expectedFinish)}
        ${detailRow('預計啟用日', project.expectedOpen)}
        ${detailRow('資料來源', project.sourceLabel)}
      </dl>
      <div class="detail-actions">
        <a href="${safeUrl(project.source)}" target="_blank" rel="noopener noreferrer">打開資料來源 ↗</a>
        <a href="${safeUrl(openMapUrl(project))}" target="_blank" rel="noopener noreferrer">用 OpenStreetMap 看位置 ↗</a>
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
      <p><strong>適合查：</strong>${escapeHtml(source.fitFor)}</p>
      <p>${escapeHtml(source.note)}</p>
      <a href="${safeUrl(source.url)}" target="_blank" rel="noopener noreferrer">前往資料入口</a>
    </article>
  `).join('');
}

function renderMetrics() {
  refs.metricProjects.textContent = PROJECTS.length.toString();
  refs.metricSources.textContent = DATA_SOURCES.length.toString();
  refs.metricCost.textContent = '多層級';
}

function detailRow(label, value) {
  return `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value || '待官方資料回填')}</dd></div>`;
}

function setZoom(nextZoom) {
  const zoom = clamp(Math.round(nextZoom), MIN_ZOOM, MAX_ZOOM);
  if (zoom === mapView.zoom) return;
  mapView = { ...mapView, zoom };
  renderMap(visibleProjects, { keepStatus: true });
  showMapHint(`目前地圖縮放層級：${zoom}。`);
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
  const text = String(value || '待回填');
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
