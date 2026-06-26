const BASE_LAYER_KEY = 'taiwan-construction-map-base-layer';
const STORAGE = window.__taiwanConstructionMapSafeStorage || {
  getItem(key) {
    try { return window.localStorage.getItem(key); } catch { return null; }
  },
  setItem(key, value) {
    try { window.localStorage.setItem(key, value); } catch {}
  }
};

const BASE_LAYERS = {
  osm: {
    zh: 'OpenStreetMap',
    en: 'OpenStreetMap',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    source: 'OpenStreetMap contributors',
    sourceEn: 'OpenStreetMap contributors',
    sourceUrl: 'https://www.openstreetmap.org/copyright'
  },
  nlscEmap: {
    zh: '官方電子地圖',
    en: 'Official street map',
    url: 'https://wmts.nlsc.gov.tw/wmts/EMAP/default/GoogleMapsCompatible/{z}/{y}/{x}',
    source: '國土測繪圖資服務雲',
    sourceEn: 'National Land Surveying and Mapping Center geospatial services',
    sourceUrl: 'https://maps.nlsc.gov.tw/'
  },
  nlscGray: {
    zh: '官方灰階底圖',
    en: 'Official light map',
    url: 'https://wmts.nlsc.gov.tw/wmts/EMAP2/default/GoogleMapsCompatible/{z}/{y}/{x}',
    source: '國土測繪圖資服務雲',
    sourceEn: 'National Land Surveying and Mapping Center geospatial services',
    sourceUrl: 'https://maps.nlsc.gov.tw/'
  },
  nlscPhoto: {
    zh: '官方航照底圖',
    en: 'Official aerial imagery',
    url: 'https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/GoogleMapsCompatible/{z}/{y}/{x}',
    source: '國土測繪圖資服務雲',
    sourceEn: 'National Land Surveying and Mapping Center geospatial services',
    sourceUrl: 'https://maps.nlsc.gov.tw/'
  },
  cadastre: {
    zh: '地籍參考套疊',
    en: 'Cadastre reference overlay',
    url: 'https://wmts.nlsc.gov.tw/wmts/EMAP2/default/GoogleMapsCompatible/{z}/{y}/{x}',
    overlayUrl: 'https://wmts.nlsc.gov.tw/wmts/LANDSECT/default/GoogleMapsCompatible/{z}/{y}/{x}',
    source: '國土測繪圖資服務雲（地籍僅供參考）',
    sourceEn: 'National Land Surveying and Mapping Center geospatial services (cadastre reference only)',
    sourceUrl: 'https://maps.nlsc.gov.tw/'
  }
};

const layerState = {
  base: safeRead(BASE_LAYER_KEY) || 'osm',
  applying: false
};

initBaseLayerSwitcher();

function initBaseLayerSwitcher() {
  const map = document.querySelector('#map');
  if (!map) return;
  applyLayerEnhancements();
  const observer = new MutationObserver(() => {
    if (layerState.applying) return;
    window.requestAnimationFrame(applyLayerEnhancements);
  });
  observer.observe(map, { childList: true });
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-base-layer]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    const next = BASE_LAYERS[button.dataset.baseLayer] ? button.dataset.baseLayer : 'osm';
    layerState.base = next;
    safeWrite(BASE_LAYER_KEY, next);
    applyLayerEnhancements();
  }, true);
}

function applyLayerEnhancements() {
  const realMap = document.querySelector('#map .real-map');
  if (!realMap) return;
  layerState.applying = true;
  try {
    const active = BASE_LAYERS[layerState.base] || BASE_LAYERS.osm;
    swapTileLayer(realMap, active);
    upsertCadastreOverlay(realMap, active);
    upsertControls(realMap);
    upsertAttribution(realMap, active);
    updateMapEyebrow(active);
  } finally {
    layerState.applying = false;
  }
}

function swapTileLayer(realMap, layer) {
  realMap.querySelectorAll('.tile-layer > .map-tile').forEach(img => {
    const tile = parseOsmTile(img.src);
    if (!tile) return;
    img.src = tileUrl(layer.url, tile);
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.onerror = () => {
      if (layerState.base !== 'osm') {
        layerState.base = 'osm';
        safeWrite(BASE_LAYER_KEY, 'osm');
        window.requestAnimationFrame(applyLayerEnhancements);
      } else {
        img.classList.add('tile-error');
      }
    };
  });
}

function upsertCadastreOverlay(realMap, layer) {
  realMap.querySelector('.cadastre-tile-layer')?.remove();
  if (!layer.overlayUrl) return;
  const baseTiles = realMap.querySelectorAll('.tile-layer > .map-tile');
  if (!baseTiles.length) return;
  const overlay = document.createElement('div');
  overlay.className = 'cadastre-tile-layer';
  baseTiles.forEach(base => {
    const tile = parseOsmTile(base.src) || parseTileFromPosition(base);
    if (!tile) return;
    const img = document.createElement('img');
    img.className = 'map-tile cadastre-map-tile';
    img.src = tileUrl(layer.overlayUrl, tile);
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.style.left = base.style.left;
    img.style.top = base.style.top;
    img.onerror = () => img.classList.add('tile-error');
    overlay.append(img);
  });
  realMap.querySelector('.tile-layer')?.after(overlay);
}

function upsertControls(realMap) {
  let controls = realMap.querySelector('.base-layer-control');
  const lang = document.documentElement.lang === 'en' ? 'en' : 'zh';
  if (!controls) {
    controls = document.createElement('div');
    controls.className = 'base-layer-control';
    realMap.append(controls);
  }
  controls.setAttribute('aria-label', lang === 'en' ? 'Base map switcher' : '底圖切換');
  controls.innerHTML = Object.entries(BASE_LAYERS).map(([key, layer]) => {
    const active = key === layerState.base ? ' active' : '';
    const pressed = key === layerState.base ? 'true' : 'false';
    return `<button type="button" class="base-layer-chip${active}" data-base-layer="${escapeAttr(key)}" aria-pressed="${pressed}">${escapeHtml(layer[lang])}</button>`;
  }).join('');
}

function upsertAttribution(realMap, layer) {
  const lang = document.documentElement.lang === 'en' ? 'en' : 'zh';
  let attr = realMap.querySelector('.map-attribution');
  if (!attr) {
    attr = document.createElement('div');
    attr.className = 'map-attribution';
    realMap.append(attr);
  }
  const prefix = lang === 'en' ? 'Source' : '來源';
  attr.innerHTML = `${prefix}: <a href="${escapeAttr(layer.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(sourceText(layer, lang))}</a>`;
}

function updateMapEyebrow(layer) {
  const lang = document.documentElement.lang === 'en' ? 'en' : 'zh';
  document.querySelectorAll('[data-i18n="mapEyebrow"]').forEach(node => {
    node.textContent = lang === 'en'
      ? `${layer.en} with project layers`
      : `${layer.zh}＋工程圖層`;
  });
}

function parseOsmTile(src) {
  const match = String(src || '').match(/\/(\d+)\/(\d+)\/(\d+)\.png(?:\?|$)|GoogleMapsCompatible\/(\d+)\/(\d+)\/(\d+)(?:\?|$)/);
  if (!match) return null;
  if (match[1]) return { z: match[1], x: match[2], y: match[3] };
  return { z: match[4], y: match[5], x: match[6] };
}

function parseTileFromPosition(img) {
  const src = img.getAttribute('src') || '';
  return parseOsmTile(src);
}

function tileUrl(template, tile) {
  return template.replace('{z}', tile.z).replace('{x}', tile.x).replace('{y}', tile.y);
}

function sourceText(layer, lang) {
  return lang === 'en' ? (layer.sourceEn || layer.source) : layer.source;
}

function safeRead(key) {
  return STORAGE.getItem(key);
}

function safeWrite(key, value) {
  STORAGE.setItem(key, value);
}

function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('`', '&#096;');
}
