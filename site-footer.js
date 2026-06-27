import { PROJECTS, PROJECT_TYPES, DATA_SOURCES } from './data/projects.js';

const FOOTER_COPY = {
  zh: '工程位置、經費、期程與甲乙方資料，請以各主管機關、政府電子採購網、公共工程雲端服務網、建管、環評與地方圖台最新公告為準。地圖底圖與官方圖資來源，請以地圖上的即時來源註記為準。',
  en: 'For project location, budget, timeline, owner, and contractor data, please verify with the latest official notices from competent authorities, procurement portals, public works systems, building management, EIA records, and local map portals. Please follow the live map attribution for the active base map and official geospatial layers.'
};

const META_COPY = {
  zh: '台灣工程地圖：把公共工程、交通建設、道路管線、建築開發、環評與重大建設入口，整理成手機也好看的互動工程地圖；可切換道路地圖、官方電子圖、灰階底圖、航照與地籍參考套疊。',
  en: 'Taiwan Construction Map gathers public works, transport infrastructure, road and utility works, building development, EIA records, and major project source portals into a mobile-friendly engineering map with road maps, official street maps, light maps, aerial imagery, and cadastre reference overlays.'
};

const UPGRADE_COPY = {
  zh: {
    layerTitle: '工程圖層', all: '全部打開', heat: '工程熱區', heatOn: '熱區開', heatOff: '熱區關',
    current: '目前視角', showing: '工程熱點', source: '可查入口', geometry: '圖資型態',
    point: '標記點', line: '路廊線', polygon: '範圍面',
    hintHeat: '工程熱區依目前顯示的熱點聚合，先看哪裡工程量最密。',
    hintLayer: '工程圖層已切換，清單與地圖同步更新。'
  },
  en: {
    layerTitle: 'Project layers', all: 'Show all', heat: 'Project heat zones', heatOn: 'Heat on', heatOff: 'Heat off',
    current: 'Current view', showing: 'hotspots', source: 'Source portals', geometry: 'Geometry',
    point: 'Point', line: 'Corridor', polygon: 'Area',
    hintHeat: 'Heat zones group the visible project hotspots so dense areas stand out first.',
    hintLayer: 'Project layer switched. The list and map are updated together.'
  }
};

const TYPE_EN = {
  public: 'Public works',
  transit: 'Transit / traffic',
  road: 'Road / utilities',
  planning: 'Planning / EIA',
  building: 'Buildings / parks',
  energy: 'Water / energy / ports'
};

let syncingFooter = false;
let upgradeReady = false;
let heatEnabled = true;
let heatObserverMuted = false;

function footerLang() {
  return document.documentElement.lang?.toLowerCase().startsWith('en') ? 'en' : 'zh';
}

function syncFooterSourceNote() {
  const lang = footerLang();
  const footerText = document.querySelector('[data-i18n="footerText"]');
  const metaDescription = document.querySelector('meta[name="description"]');
  if (footerText && footerText.textContent !== FOOTER_COPY[lang]) footerText.textContent = FOOTER_COPY[lang];
  if (metaDescription && metaDescription.content !== META_COPY[lang]) metaDescription.content = META_COPY[lang];
}

function scheduleFooterSourceSync() {
  if (syncingFooter) return;
  syncingFooter = true;
  requestAnimationFrame(() => {
    syncFooterSourceNote();
    syncingFooter = false;
  });
}

function upgradeText(key) {
  const lang = footerLang();
  return UPGRADE_COPY[lang]?.[key] || UPGRADE_COPY.zh[key] || key;
}

function initEngineeringMapUpgrade() {
  if (upgradeReady) return;
  const legend = document.querySelector('.legend');
  const projectList = document.querySelector('#projectList');
  const map = document.querySelector('#map');
  const typeFilter = document.querySelector('#typeFilter');
  const statusFilter = document.querySelector('#statusFilter');
  const searchInput = document.querySelector('#searchInput');
  if (!legend || !projectList || !map || !typeFilter || !statusFilter || !searchInput) return;

  upgradeReady = true;
  legend.classList.add('legacy-legend-hidden');

  const layerPanel = document.createElement('section');
  layerPanel.className = 'layer-switchboard';
  layerPanel.setAttribute('aria-label', upgradeText('layerTitle'));
  legend.after(layerPanel);

  const statusStrip = document.createElement('section');
  statusStrip.className = 'status-strip';
  statusStrip.setAttribute('aria-label', upgradeText('current'));
  layerPanel.after(statusStrip);

  const controls = { legend, projectList, map, typeFilter, statusFilter, searchInput, layerPanel, statusStrip };
  renderLayerPanel(controls);
  renderStatusStrip(controls);
  syncHeatOverlay(controls);
  syncHeroMicrocopy();

  ['input', 'change'].forEach(eventName => {
    searchInput.addEventListener(eventName, () => schedulePanelSync(controls));
    typeFilter.addEventListener(eventName, () => schedulePanelSync(controls));
    statusFilter.addEventListener(eventName, () => schedulePanelSync(controls));
  });

  document.querySelector('#languageToggle')?.addEventListener('click', () => setTimeout(() => {
    renderLayerPanel(controls);
    renderStatusStrip(controls);
    syncHeatOverlay(controls);
    syncHeroMicrocopy();
  }, 0));

  new MutationObserver(mutations => {
    if (heatObserverMuted || mutations.every(isHeatOnlyMutation)) return;
    scheduleHeatSync(controls);
  }).observe(map, { childList: true, subtree: true });
}

function renderLayerPanel(controls) {
  const activeType = controls.typeFilter.value || 'all';
  const typeButtons = Object.entries(PROJECT_TYPES).map(([key, config]) => {
    const active = activeType === 'all' || activeType === key;
    const count = PROJECTS.filter(project => project.type === key).length;
    return `<button type="button" class="layer-chip${active ? ' active' : ''}" data-layer-type="${escapeAttr(key)}" aria-pressed="${active}"><i style="--chip-color:${escapeAttr(config.color)}"></i><span>${escapeHtml(typeLabel(key, config))}</span><b>${count}</b></button>`;
  }).join('');

  controls.layerPanel.setAttribute('aria-label', upgradeText('layerTitle'));
  controls.layerPanel.innerHTML = `
    <div class="layer-heading"><strong>${escapeHtml(upgradeText('layerTitle'))}</strong><button type="button" class="layer-mini-action" data-layer-type="all">${escapeHtml(upgradeText('all'))}</button></div>
    <div class="layer-chip-grid">${typeButtons}</div>
    <button type="button" class="layer-chip layer-chip-wide${heatEnabled ? ' active' : ''}" data-heat-toggle="true" aria-pressed="${heatEnabled}"><i style="--chip-color:#ffb347"></i><span>${escapeHtml(upgradeText('heat'))}</span><b>${escapeHtml(heatEnabled ? upgradeText('heatOn') : upgradeText('heatOff'))}</b></button>`;

  controls.layerPanel.querySelectorAll('[data-layer-type]').forEach(button => {
    button.addEventListener('click', () => {
      controls.typeFilter.value = button.dataset.layerType || 'all';
      controls.typeFilter.dispatchEvent(new Event('change', { bubbles: true }));
      renderLayerPanel(controls);
      setMapStatus(upgradeText('hintLayer'));
    });
  });

  controls.layerPanel.querySelector('[data-heat-toggle]')?.addEventListener('click', () => {
    heatEnabled = !heatEnabled;
    renderLayerPanel(controls);
    syncHeatOverlay(controls);
    setMapStatus(upgradeText('hintHeat'));
  });
}

function renderStatusStrip(controls) {
  const visible = getVisibleProjects(controls);
  const geometry = countBy(visible, project => project.geometry?.type || 'point');
  controls.statusStrip.setAttribute('aria-label', upgradeText('current'));
  controls.statusStrip.innerHTML = `
    <div><span>${escapeHtml(upgradeText('current'))}</span><strong>${visible.length} ${escapeHtml(upgradeText('showing'))}</strong></div>
    <div><span>${escapeHtml(upgradeText('source'))}</span><strong>${DATA_SOURCES.length}</strong></div>
    <div><span>${escapeHtml(upgradeText('geometry'))}</span><strong>${escapeHtml(upgradeText('point'))} ${geometry.point || 0}・${escapeHtml(upgradeText('line'))} ${geometry.line || 0}・${escapeHtml(upgradeText('polygon'))} ${geometry.polygon || 0}</strong></div>`;
}

function syncHeatOverlay(controls) {
  const svg = controls.map.querySelector('svg.map-overlay');
  if (!svg) return;

  heatObserverMuted = true;
  svg.querySelector('.heat-layer')?.remove();
  if (!heatEnabled) {
    heatObserverMuted = false;
    return;
  }

  const projectLayer = svg.querySelector('.project-layer');
  const items = [...svg.querySelectorAll('[data-project-id]')]
    .map(element => {
      const project = PROJECTS.find(item => item.id === element.dataset.projectId);
      const circle = element.querySelector('circle');
      if (!project || !circle) return null;
      return { project, x: Number(circle.getAttribute('cx')), y: Number(circle.getAttribute('cy')) };
    })
    .filter(item => Number.isFinite(item?.x) && Number.isFinite(item?.y));

  if (items.length) {
    const groups = groupHeatItems(items);
    const max = Math.max(1, ...groups.map(group => group.count));
    const heat = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    heat.setAttribute('class', 'heat-layer');
    heat.innerHTML = groups.map(group => {
      const radius = 28 + (group.count / max) * 56;
      return `<g class="heat-zone"><circle class="heat-ring" cx="${group.x}" cy="${group.y}" r="${radius}"></circle><circle class="heat-core" cx="${group.x}" cy="${group.y}" r="${Math.max(13, radius * 0.24)}"></circle><text x="${group.x}" y="${group.y + radius + 17}">${escapeHtml(group.label)} ${group.count}</text></g>`;
    }).join('');
    svg.insertBefore(heat, projectLayer || svg.firstChild);
  }

  requestAnimationFrame(() => { heatObserverMuted = false; });
}

function groupHeatItems(items) {
  const groups = new Map();
  items.forEach(item => {
    const key = regionKey(item.project);
    const label = regionLabel(key);
    const group = groups.get(key) || { key, label, count: 0, x: 0, y: 0 };
    group.count += 1;
    group.x += item.x;
    group.y += item.y;
    groups.set(key, group);
  });
  return [...groups.values()].map(group => ({ ...group, x: Math.round(group.x / group.count), y: Math.round(group.y / group.count) }));
}

function getVisibleProjects(controls) {
  const keyword = normalize(controls.searchInput.value);
  const activeType = controls.typeFilter.value || 'all';
  const activeStatus = controls.statusFilter.value || 'all';
  return PROJECTS.filter(project => {
    const text = normalize(`${project.name} ${project.shortName} ${project.region} ${project.owner} ${project.contractor} ${project.summary} ${project.area} ${project.sourceLabel} ${project.tags?.join(' ')}`);
    return (activeType === 'all' || project.type === activeType)
      && (activeStatus === 'all' || project.status === activeStatus)
      && (!keyword || text.includes(keyword));
  });
}

function schedulePanelSync(controls) {
  requestAnimationFrame(() => {
    renderLayerPanel(controls);
    renderStatusStrip(controls);
    syncHeatOverlay(controls);
  });
}

function scheduleHeatSync(controls) {
  requestAnimationFrame(() => syncHeatOverlay(controls));
}

function isHeatOnlyMutation(mutation) {
  const nodes = [...mutation.addedNodes, ...mutation.removedNodes].filter(node => node.nodeType === 1);
  return nodes.length > 0 && nodes.every(node => node.classList?.contains('heat-layer') || node.closest?.('.heat-layer'));
}

function regionKey(project) {
  const [lat, lng] = centroid(project.geometry?.coordinates || []);
  if (lat >= 24.75 && lng >= 121) return 'north';
  if (lat >= 23.85 && lat < 24.75 && lng < 121) return 'central';
  if (lat >= 22.85 && lat < 23.85) return 'southwest';
  if (lat < 22.85 && lng < 121) return 'kaoping';
  if (lng >= 121) return 'east';
  return 'taiwan';
}

function regionLabel(key) {
  const zh = { north: '北北基桃', central: '中彰投苗', southwest: '雲嘉南', kaoping: '高屏', east: '宜花東', taiwan: '全台' };
  const en = { north: 'North', central: 'Central', southwest: 'Yun-Chia-Nan', kaoping: 'Kao-Ping', east: 'East', taiwan: 'Taiwan' };
  return footerLang() === 'en' ? en[key] : zh[key];
}

function centroid(coords) {
  const points = flatten(coords);
  if (!points.length) return [23.78, 120.98];
  const sum = points.reduce((acc, point) => [acc[0] + point[0], acc[1] + point[1]], [0, 0]);
  return [sum[0] / points.length, sum[1] / points.length];
}

function flatten(value) {
  if (!Array.isArray(value)) return [];
  if (typeof value[0] === 'number' && typeof value[1] === 'number') return [value];
  return value.flatMap(flatten);
}

function countBy(items, getter) {
  return items.reduce((acc, item) => {
    const key = getter(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function typeLabel(key, config) {
  return footerLang() === 'en' ? (TYPE_EN[key] || 'Project') : (config?.label || '工程');
}

function syncHeroMicrocopy() {
  const pill = document.querySelector('[data-i18n="heroPill"]');
  if (pill && footerLang() === 'zh') pill.textContent = '道路地名、官方電子圖、航照與地籍參考可以分層切換。';
}

function setMapStatus(message) {
  const status = document.querySelector('#mapStatus');
  if (status) status.textContent = message;
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('`', '&#096;');
}

const footerObserver = new MutationObserver(() => {
  scheduleFooterSourceSync();
  if (upgradeReady) requestAnimationFrame(syncHeroMicrocopy);
});
footerObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
footerObserver.observe(document.body, { childList: true, characterData: true, subtree: true });

scheduleFooterSourceSync();
requestAnimationFrame(initEngineeringMapUpgrade);
