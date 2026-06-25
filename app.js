import { PROJECTS, PROJECT_TYPES, DATA_SOURCES } from './data/projects.js';

const MAP_VIEWBOX = { width: 1000, height: 700 };
const TAIWAN_BOUNDS = {
  minLat: 21.75,
  maxLat: 25.45,
  minLng: 119.50,
  maxLng: 122.35
};

const TAIWAN_SHAPE = 'M620 54 C660 84 684 128 690 176 C696 236 666 286 655 340 C642 401 682 448 646 516 C613 580 562 640 504 670 C448 642 422 594 394 540 C365 484 334 435 350 374 C365 315 410 277 424 219 C439 158 486 92 548 54 C574 38 599 38 620 54 Z';
const ISLANDS = [
  { name: '澎湖', x: 285, y: 382, r: 18 },
  { name: '金門', x: 172, y: 300, r: 13 },
  { name: '馬祖', x: 260, y: 115, r: 10 },
  { name: '綠島', x: 734, y: 470, r: 10 },
  { name: '蘭嶼', x: 742, y: 575, r: 12 }
];
const CITY_LABELS = [
  { name: '台北', lat: 25.05, lng: 121.52 },
  { name: '桃園', lat: 24.99, lng: 121.30 },
  { name: '台中', lat: 24.15, lng: 120.67 },
  { name: '台南', lat: 22.99, lng: 120.20 },
  { name: '高雄', lat: 22.63, lng: 120.30 },
  { name: '花蓮', lat: 23.99, lng: 121.60 },
  { name: '台東', lat: 22.76, lng: 121.14 }
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
  mapStatus: document.querySelector('#mapStatus')
};

let activeId = '';
let visibleProjects = [...PROJECTS];

init();

function init() {
  hydrateFilters();
  renderSources();
  renderMetrics();
  renderProjects(visibleProjects);
  renderMap(visibleProjects);
  bindEvents();
  showMapHint('點選工程熱點，看經費、甲方、施工廠商與工期。');
}

function bindEvents() {
  refs.search.addEventListener('input', applyFilters);
  refs.typeFilter.addEventListener('change', applyFilters);
  refs.statusFilter.addEventListener('change', applyFilters);
  refs.resetMap.addEventListener('click', () => {
    activeId = '';
    renderProjects(visibleProjects);
    renderMap(visibleProjects);
    showMapHint('已回到全台視角，點選任一工程熱點開始探索。');
  });
  refs.toggleSources.addEventListener('click', () => {
    document.querySelector('#sourcePanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
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
    const text = normalize(`${project.name} ${project.shortName} ${project.region} ${project.owner} ${project.contractor} ${project.summary}`);
    const matchesKeyword = !keyword || text.includes(keyword);
    return matchesType && matchesStatus && matchesKeyword;
  });

  if (!visibleProjects.some(project => project.id === activeId)) {
    activeId = '';
  }

  renderProjects(visibleProjects);
  renderMap(visibleProjects);
  showMapHint(visibleProjects.length ? `目前顯示 ${visibleProjects.length} 個工程熱點。` : '目前沒有符合條件的工程，換個關鍵字再試試。');
}

function renderProjects(projects) {
  refs.projectList.innerHTML = '';

  if (projects.length === 0) {
    refs.projectList.innerHTML = '<div class="project-card empty"><h3>沒有符合條件的工程</h3><p>換個地名、工程名或廠商名稱，讓地圖重新開圖。</p></div>';
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

function renderMap(projects) {
  const mapGraphics = projects.map(createProjectGraphic).join('');
  const labels = CITY_LABELS.map(label => {
    const [x, y] = projectCoord([label.lat, label.lng]);
    return `<text class="city-label" x="${x + 10}" y="${y - 6}">${escapeHtml(label.name)}</text>`;
  }).join('');
  const islands = ISLANDS.map(island => `
    <g class="island">
      <circle cx="${island.x}" cy="${island.y}" r="${island.r}"></circle>
      <text x="${island.x + island.r + 6}" y="${island.y + 4}">${escapeHtml(island.name)}</text>
    </g>
  `).join('');

  refs.map.innerHTML = `
    <svg class="taiwan-map" viewBox="0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}" aria-label="台灣工程熱點示意圖" role="img">
      <defs>
        <linearGradient id="oceanGlow" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#dff7ff"></stop>
          <stop offset="58%" stop-color="#b7e8ff"></stop>
          <stop offset="100%" stop-color="#f7f0df"></stop>
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#0b2a44" flood-opacity="0.22"></feDropShadow>
        </filter>
      </defs>
      <rect class="ocean" width="1000" height="700" rx="28"></rect>
      <g class="map-grid" aria-hidden="true">
        ${buildGrid()}
      </g>
      <path class="taiwan-shape" d="${TAIWAN_SHAPE}"></path>
      ${islands}
      ${labels}
      <g class="project-layer">
        ${mapGraphics}
      </g>
    </svg>
  `;

  refs.map.querySelectorAll('[data-project-id]').forEach(element => {
    element.addEventListener('click', () => selectProject(element.dataset.projectId));
    element.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectProject(element.dataset.projectId);
      }
    });
  });
}

function createProjectGraphic(project) {
  const color = PROJECT_TYPES[project.type]?.color ?? '#2f80ed';
  const geometry = project.geometry;
  const centroid = getCentroid(geometry.coordinates);
  const [labelX, labelY] = projectCoord(centroid);
  const activeClass = project.id === activeId ? ' active' : '';
  const title = `${project.shortName || project.name}｜${project.status}`;

  if (geometry.type === 'line') {
    const points = geometry.coordinates.map(coord => projectCoord(coord).join(',')).join(' ');
    return `
      <g class="project-item project-line${activeClass}" tabindex="0" data-project-id="${escapeAttr(project.id)}" style="--project-color:${escapeAttr(color)}">
        <title>${escapeHtml(title)}</title>
        <polyline points="${points}"></polyline>
        <circle cx="${labelX}" cy="${labelY}" r="12"></circle>
        <text x="${labelX + 14}" y="${labelY - 12}">${escapeHtml(project.shortName || project.name)}</text>
      </g>
    `;
  }

  if (geometry.type === 'polygon') {
    const points = geometry.coordinates.map(coord => projectCoord(coord).join(',')).join(' ');
    return `
      <g class="project-item project-polygon${activeClass}" tabindex="0" data-project-id="${escapeAttr(project.id)}" style="--project-color:${escapeAttr(color)}">
        <title>${escapeHtml(title)}</title>
        <polygon points="${points}"></polygon>
        <circle cx="${labelX}" cy="${labelY}" r="11"></circle>
        <text x="${labelX + 14}" y="${labelY - 10}">${escapeHtml(project.shortName || project.name)}</text>
      </g>
    `;
  }

  return `
    <g class="project-item project-point${activeClass}" tabindex="0" data-project-id="${escapeAttr(project.id)}" style="--project-color:${escapeAttr(color)}">
      <title>${escapeHtml(title)}</title>
      <circle cx="${labelX}" cy="${labelY}" r="16"></circle>
      <text x="${labelX + 18}" y="${labelY - 12}">${escapeHtml(project.shortName || project.name)}</text>
    </g>
  `;
}

function selectProject(projectId) {
  const project = PROJECTS.find(item => item.id === projectId);
  if (!project) return;

  activeId = projectId;
  renderProjects(visibleProjects);
  renderMap(visibleProjects);
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
      </div>
      <h3>${escapeHtml(project.name)}</h3>
      <p>${escapeHtml(project.summary)}</p>
      <dl>
        ${detailRow('經費', project.cost)}
        ${detailRow('位置/範圍', `${project.region}｜${project.area}`)}
        ${detailRow('發包甲方', project.owner)}
        ${detailRow('施工廠商', project.contractor)}
        ${detailRow('工期', project.schedule)}
        ${detailRow('預計完工', project.expectedFinish)}
      </dl>
      <a href="${safeUrl(project.source)}" target="_blank" rel="noopener noreferrer">打開資料來源 ↗</a>
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
      <h3>${escapeHtml(source.name)}</h3>
      <p><strong>適合查：</strong>${escapeHtml(source.fitFor)}</p>
      <p>${escapeHtml(source.note)}</p>
      <a href="${safeUrl(source.url)}" target="_blank" rel="noopener noreferrer">前往官方入口</a>
    </article>
  `).join('');
}

function renderMetrics() {
  refs.metricProjects.textContent = PROJECTS.length.toString();
  refs.metricSources.textContent = DATA_SOURCES.length.toString();
  refs.metricCost.textContent = '2,000億+';
}

function detailRow(label, value) {
  return `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`;
}

function projectCoord([lat, lng]) {
  const x = ((lng - TAIWAN_BOUNDS.minLng) / (TAIWAN_BOUNDS.maxLng - TAIWAN_BOUNDS.minLng)) * MAP_VIEWBOX.width;
  const y = ((TAIWAN_BOUNDS.maxLat - lat) / (TAIWAN_BOUNDS.maxLat - TAIWAN_BOUNDS.minLat)) * MAP_VIEWBOX.height;
  return [clamp(x, 36, MAP_VIEWBOX.width - 36), clamp(y, 36, MAP_VIEWBOX.height - 36)];
}

function getCentroid(coordinates) {
  const points = flattenCoordinates(coordinates);
  const totals = points.reduce((sum, point) => [sum[0] + point[0], sum[1] + point[1]], [0, 0]);
  return [totals[0] / points.length, totals[1] / points.length];
}

function flattenCoordinates(value) {
  if (!Array.isArray(value)) return [];
  if (typeof value[0] === 'number' && typeof value[1] === 'number') return [value];
  return value.flatMap(flattenCoordinates);
}

function buildGrid() {
  const lines = [];
  for (let x = 100; x < MAP_VIEWBOX.width; x += 100) {
    lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${MAP_VIEWBOX.height}"></line>`);
  }
  for (let y = 100; y < MAP_VIEWBOX.height; y += 100) {
    lines.push(`<line x1="0" y1="${y}" x2="${MAP_VIEWBOX.width}" y2="${y}"></line>`);
  }
  return lines.join('');
}

function normalize(value) {
  return value.trim().toLowerCase();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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
