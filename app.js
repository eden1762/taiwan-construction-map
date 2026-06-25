import { PROJECTS, PROJECT_TYPES, DATA_SOURCES } from './data/projects.js';

const TAIWAN_CENTER = [23.75, 121.0];
const TAIWAN_BOUNDS = L.latLngBounds([21.85, 119.55], [25.40, 122.25]);
const map = L.map('map', {
  center: TAIWAN_CENTER,
  zoom: 7,
  minZoom: 6,
  maxZoom: 18,
  preferCanvas: true,
  zoomControl: false
});

L.control.zoom({ position: 'bottomright' }).addTo(map);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

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
  sourceCards: document.querySelector('#sourceCards')
};

const layersById = new Map();
let activeId = '';
let visibleProjects = [...PROJECTS];

init();

function init() {
  hydrateFilters();
  renderSources();
  renderMetrics();
  renderProjects(PROJECTS);
  drawProjects(PROJECTS);
  bindEvents();
  map.fitBounds(TAIWAN_BOUNDS, { padding: [12, 12] });
}

function bindEvents() {
  refs.search.addEventListener('input', applyFilters);
  refs.typeFilter.addEventListener('change', applyFilters);
  refs.statusFilter.addEventListener('change', applyFilters);
  refs.resetMap.addEventListener('click', () => {
    activeId = '';
    highlightListItem();
    map.fitBounds(TAIWAN_BOUNDS, { padding: [12, 12] });
  });
  refs.toggleSources.addEventListener('click', () => {
    document.querySelector('#sourcePanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function hydrateFilters() {
  Object.entries(PROJECT_TYPES).forEach(([key, config]) => {
    const option = new Option(config.label, key);
    refs.typeFilter.add(option);
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

  renderProjects(visibleProjects);
  drawProjects(visibleProjects);

  if (visibleProjects.length > 0) {
    const group = L.featureGroup([...layersById.values()]);
    map.fitBounds(group.getBounds(), { padding: [28, 28], maxZoom: 11 });
  }
}

function drawProjects(projects) {
  layersById.forEach(layer => layer.remove());
  layersById.clear();

  projects.forEach(project => {
    const layer = createProjectLayer(project);
    layer.bindPopup(createPopup(project));
    layer.on('click', () => selectProject(project.id, { openPopup: false }));
    layer.addTo(map);
    layersById.set(project.id, layer);
  });
}

function createProjectLayer(project) {
  const color = PROJECT_TYPES[project.type]?.color ?? '#2f80ed';
  const style = {
    color,
    weight: project.geometry.type === 'polygon' ? 2 : 5,
    opacity: 0.88,
    fillColor: color,
    fillOpacity: project.geometry.type === 'polygon' ? 0.12 : 0.26,
    dashArray: project.confidence.includes('待補') || project.confidence.includes('示範') ? '7 8' : undefined
  };

  if (project.geometry.type === 'line') {
    return L.polyline(project.geometry.coordinates, style);
  }

  if (project.geometry.type === 'polygon') {
    return L.polygon(project.geometry.coordinates, style);
  }

  return L.circleMarker(project.geometry.coordinates, {
    ...style,
    radius: project.type === 'planning' ? 15 : 12,
    weight: 3,
    fillOpacity: 0.82
  });
}

function renderProjects(projects) {
  refs.projectList.innerHTML = '';

  if (projects.length === 0) {
    refs.projectList.innerHTML = '<div class="project-card"><h3>沒有符合條件的工程</h3><p>換個關鍵字或清除篩選，讓地圖重新開圖。</p></div>';
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
        <span class="badge">${PROJECT_TYPES[project.type]?.label ?? '工程'}</span>
        <span class="badge status">${project.status}</span>
        <span class="badge confidence">${project.confidence}</span>
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

function selectProject(projectId, options = { openPopup: true }) {
  const project = PROJECTS.find(item => item.id === projectId);
  const layer = layersById.get(projectId);
  if (!project || !layer) return;

  activeId = projectId;
  highlightListItem();

  const bounds = typeof layer.getBounds === 'function'
    ? layer.getBounds()
    : L.latLngBounds([layer.getLatLng(), layer.getLatLng()]);

  map.fitBounds(bounds.pad(0.8), { maxZoom: project.geometry.type === 'point' ? 10 : 13, padding: [36, 36] });

  if (options.openPopup) {
    setTimeout(() => layer.openPopup(), 240);
  }
}

function highlightListItem() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.classList.toggle('active', card.dataset.projectId === activeId);
  });
}

function createPopup(project) {
  return `
    <article class="popup-card">
      <h3>${escapeHtml(project.name)}</h3>
      <p>${escapeHtml(project.summary)}</p>
      <dl class="popup-table">
        ${popupRow('成本', project.cost)}
        ${popupRow('位置/範圍', `${project.region}｜${project.area}`)}
        ${popupRow('發包甲方', project.owner)}
        ${popupRow('施工廠商', project.contractor)}
        ${popupRow('工期', project.schedule)}
        ${popupRow('預計完工', project.expectedFinish)}
        ${popupRow('預計啟用', project.expectedOpen)}
        ${popupRow('資料品質', project.confidence)}
      </dl>
      <a href="${project.source}" target="_blank" rel="noopener noreferrer">打開官方/來源資料 ↗</a>
    </article>
  `;
}

function popupRow(label, value) {
  return `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`;
}

function renderSources() {
  refs.sourceCards.innerHTML = DATA_SOURCES.map(source => `
    <article class="source-card">
      <h3>${escapeHtml(source.name)}</h3>
      <p><strong>適合查：</strong>${escapeHtml(source.fitFor)}</p>
      <p>${escapeHtml(source.note)}</p>
      <a href="${source.url}" target="_blank" rel="noopener noreferrer">前往資料源</a>
    </article>
  `).join('');
}

function renderMetrics() {
  refs.metricProjects.textContent = PROJECTS.length.toString();
  refs.metricSources.textContent = DATA_SOURCES.length.toString();
  refs.metricCost.textContent = '2,000億+';
}

function normalize(value) {
  return value.trim().toLowerCase();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
