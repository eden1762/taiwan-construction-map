const BASE_LAYER_KEY = 'taiwan-construction-map-base-layer';
const DATA_LAYER_KEY = 'taiwan-construction-map-data-layers';

const BASE_LAYERS = {
  osm: {
    label: { zh: 'OpenStreetMap', en: 'OpenStreetMap' },
    attribution: { zh: '© OpenStreetMap contributors', en: '© OpenStreetMap contributors' },
    attributionUrl: 'https://www.openstreetmap.org/copyright',
    tile: ({ z, x, y }) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`
  },
  nlscEmap: {
    label: { zh: '官方電子圖', en: 'NLSC e-Map' },
    attribution: { zh: '國土測繪中心電子地圖', en: 'NLSC Taiwan e-Map' },
    attributionUrl: 'https://maps.nlsc.gov.tw/',
    tile: ({ z, x, y }) => `https://wmts.nlsc.gov.tw/wmts/EMAP/default/GoogleMapsCompatible/${z}/${y}/${x}`
  },
  nlscGray: {
    label: { zh: '官方灰階', en: 'NLSC Gray' },
    attribution: { zh: '國土測繪中心灰階電子地圖', en: 'NLSC gray e-Map' },
    attributionUrl: 'https://maps.nlsc.gov.tw/',
    tile: ({ z, x, y }) => `https://wmts.nlsc.gov.tw/wmts/EMAP2/default/GoogleMapsCompatible/${z}/${y}/${x}`
  },
  nlscPhoto: {
    label: { zh: '官方航照', en: 'NLSC Orthophoto' },
    attribution: { zh: '國土測繪中心正射影像', en: 'NLSC orthophoto' },
    attributionUrl: 'https://maps.nlsc.gov.tw/',
    tile: ({ z, x, y }) => `https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/GoogleMapsCompatible/${z}/${y}/${x}`
  },
  nlscCadastre: {
    label: { zh: '地籍參考套疊', en: 'Cadastre overlay' },
    attribution: { zh: '國土測繪中心灰階電子地圖＋地籍參考圖｜地籍套疊僅供參考', en: 'NLSC gray e-Map + cadastral reference｜Cadastre overlay is for reference only' },
    attributionUrl: 'https://maps.nlsc.gov.tw/',
    tile: ({ z, x, y }) => `https://wmts.nlsc.gov.tw/wmts/EMAP2/default/GoogleMapsCompatible/${z}/${y}/${x}`,
    overlayTile: ({ z, x, y }) => `https://wmts.nlsc.gov.tw/wmts/LANDSECT/default/GoogleMapsCompatible/${z}/${y}/${x}`
  }
};

const DATA_LAYER_DEFAULTS = {
  points: true,
  routes: true,
  areas: true,
  labels: true
};

function safeGetPreference(key) {
  try {
    return window.localStorage?.getItem(key) || '';
  } catch {
    return '';
  }
}

function safeSetPreference(key, value) {
  try {
    window.localStorage?.setItem(key, value);
  } catch {
    // Some privacy modes block storage. Keep the map usable with in-memory state.
  }
}

let activeBaseLayer = BASE_LAYERS[safeGetPreference(BASE_LAYER_KEY)] ? safeGetPreference(BASE_LAYER_KEY) : 'osm';
let activeDataLayers = loadDataLayers();
let applyingBaseLayer = false;
let lastRenderedLang = '';

const getLang = () => document.documentElement.lang?.toLowerCase().startsWith('en') ? 'en' : 'zh';

function loadDataLayers() {
  try {
    return { ...DATA_LAYER_DEFAULTS, ...JSON.parse(safeGetPreference(DATA_LAYER_KEY) || '{}') };
  } catch {
    return { ...DATA_LAYER_DEFAULTS };
  }
}

function saveDataLayers() {
  safeSetPreference(DATA_LAYER_KEY, JSON.stringify(activeDataLayers));
}

function parseTilePosition(img) {
  if (img.dataset.z && img.dataset.x && img.dataset.y) {
    return { z: Number(img.dataset.z), x: Number(img.dataset.x), y: Number(img.dataset.y) };
  }
  const src = img.getAttribute('src') || '';
  let match = src.match(/openstreetmap\.org\/(\d+)\/(-?\d+)\/(-?\d+)\.png/);
  if (match) {
    return { z: Number(match[1]), x: Number(match[2]), y: Number(match[3]) };
  }
  match = src.match(/GoogleMapsCompatible\/(\d+)\/(-?\d+)\/(-?\d+)/);
  if (match) {
    return { z: Number(match[1]), y: Number(match[2]), x: Number(match[3]) };
  }
  return null;
}

function rewriteTiles(realMap) {
  const layer = BASE_LAYERS[activeBaseLayer] || BASE_LAYERS.osm;
  const overlayTiles = [];

  realMap.querySelectorAll('.map-tile').forEach(img => {
    const tile = parseTilePosition(img);
    if (!tile) return;
    img.dataset.z = String(tile.z);
    img.dataset.x = String(tile.x);
    img.dataset.y = String(tile.y);
    img.classList.remove('tile-error');
    img.onerror = () => {
      if (activeBaseLayer !== 'osm') {
        activeBaseLayer = 'osm';
        safeSetPreference(BASE_LAYER_KEY, activeBaseLayer);
        applyBaseLayer({ forceText: true });
      } else {
        img.classList.add('tile-error');
      }
    };
    const nextSrc = layer.tile(tile);
    if (img.getAttribute('src') !== nextSrc) img.setAttribute('src', nextSrc);

    if (layer.overlayTile) {
      overlayTiles.push({
        src: layer.overlayTile(tile),
        left: img.style.left,
        top: img.style.top,
        z: tile.z,
        x: tile.x,
        y: tile.y
      });
    }
  });

  syncReferenceOverlay(realMap, overlayTiles);
}

function syncReferenceOverlay(realMap, overlayTiles) {
  let overlay = realMap.querySelector('.reference-tile-layer');
  if (!overlayTiles.length) {
    overlay?.remove();
    return;
  }

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'reference-tile-layer';
    realMap.querySelector('.tile-layer')?.after(overlay);
  }

  overlay.innerHTML = overlayTiles.map(tile => `<img class="map-reference-tile" src="${tile.src}" alt="" loading="lazy" decoding="async" data-z="${tile.z}" data-x="${tile.x}" data-y="${tile.y}" style="left:${tile.left};top:${tile.top}" />`).join('');
  overlay.querySelectorAll('.map-reference-tile').forEach(img => {
    img.onerror = () => img.remove();
  });
}

function renderLayerControl(realMap, options = {}) {
  const lang = getLang();
  const stateKey = `${lang}:${activeBaseLayer}`;
  let control = realMap.querySelector('.base-layer-control');
  if (!options.forceText && control?.dataset.state === stateKey) return;

  const labels = {
    title: lang === 'en' ? 'Base map' : '底圖',
    note: lang === 'en' ? 'Mobile loads one base layer at a time.' : '手機一次只載入一種底圖。'
  };
  const html = `<div class="base-layer-title"><span>${labels.title}</span><small>${labels.note}</small></div><div class="base-layer-buttons">${Object.entries(BASE_LAYERS).map(([id, cfg]) => `<button type="button" data-base-layer="${id}" class="${id === activeBaseLayer ? 'active' : ''}" aria-pressed="${id === activeBaseLayer}">${cfg.label[lang]}</button>`).join('')}</div>`;

  if (!control) {
    control = document.createElement('div');
    control.className = 'base-layer-control';
    realMap.append(control);
  }
  control.dataset.state = stateKey;
  control.innerHTML = html;

  control.querySelectorAll('[data-base-layer]').forEach(button => {
    button.addEventListener('pointerdown', event => event.stopPropagation());
    button.addEventListener('click', event => {
      event.stopPropagation();
      const next = button.dataset.baseLayer;
      if (!BASE_LAYERS[next]) return;
      activeBaseLayer = next;
      safeSetPreference(BASE_LAYER_KEY, activeBaseLayer);
      applyBaseLayer({ forceText: true });
    });
  });
}

function renderDataLayerControl(realMap, options = {}) {
  const lang = getLang();
  const stateKey = `${lang}:${JSON.stringify(activeDataLayers)}`;
  let control = realMap.querySelector('.data-layer-control');
  if (!options.forceText && control?.dataset.state === stateKey) return;

  const labels = lang === 'en'
    ? { title: 'Data layers', note: 'Keep only what you need on.', points: 'Pins', routes: 'Routes', areas: 'Areas', labels: 'Labels' }
    : { title: '資料層', note: '只開需要看的圖層。', points: '點位', routes: '路線', areas: '範圍', labels: '標籤' };

  const html = `<div class="base-layer-title"><span>${labels.title}</span><small>${labels.note}</small></div><div class="data-layer-buttons">${Object.keys(DATA_LAYER_DEFAULTS).map(key => `<button type="button" data-data-layer="${key}" class="${activeDataLayers[key] ? 'active' : ''}" aria-pressed="${activeDataLayers[key]}">${labels[key]}</button>`).join('')}</div>`;

  if (!control) {
    control = document.createElement('div');
    control.className = 'data-layer-control';
    realMap.append(control);
  }
  control.dataset.state = stateKey;
  control.innerHTML = html;

  control.querySelectorAll('[data-data-layer]').forEach(button => {
    button.addEventListener('pointerdown', event => event.stopPropagation());
    button.addEventListener('click', event => {
      event.stopPropagation();
      const key = button.dataset.dataLayer;
      activeDataLayers[key] = !activeDataLayers[key];
      saveDataLayers();
      applyBaseLayer({ forceText: true });
    });
  });
}

function applyDataLayerState(realMap) {
  realMap.classList.toggle('hide-project-points', !activeDataLayers.points);
  realMap.classList.toggle('hide-project-routes', !activeDataLayers.routes);
  realMap.classList.toggle('hide-project-areas', !activeDataLayers.areas);
  realMap.classList.toggle('hide-project-labels', !activeDataLayers.labels);
}

function attributionHTML(layer, lang) {
  const text = layer.attribution[lang];
  const url = layer.attributionUrl;
  return url
    ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
    : text;
}

function updateAttribution(realMap) {
  const attr = realMap.querySelector('.map-attribution');
  const layer = BASE_LAYERS[activeBaseLayer] || BASE_LAYERS.osm;
  if (!attr) return;
  const nextHTML = attributionHTML(layer, getLang());
  if (attr.innerHTML !== nextHTML) attr.innerHTML = nextHTML;
  attr.classList.toggle('reference-note', activeBaseLayer === 'nlscCadastre');
}

function guardMapChrome(realMap) {
  realMap.querySelectorAll('.base-layer-control, .data-layer-control, .map-attribution').forEach(element => {
    if (element.dataset.mapChromeGuarded === 'true') return;
    element.dataset.mapChromeGuarded = 'true';
    ['pointerdown', 'pointermove', 'pointerup', 'touchstart', 'wheel'].forEach(type => {
      element.addEventListener(type, event => event.stopPropagation(), { passive: true });
    });
  });
}

function applyBaseLayer(options = {}) {
  if (applyingBaseLayer) return;
  applyingBaseLayer = true;
  requestAnimationFrame(() => {
    const realMap = document.querySelector('.real-map');
    const currentLang = getLang();
    const forceText = options.forceText || currentLang !== lastRenderedLang;
    if (realMap) {
      rewriteTiles(realMap);
      renderLayerControl(realMap, { forceText });
      renderDataLayerControl(realMap, { forceText });
      applyDataLayerState(realMap);
      updateAttribution(realMap);
      guardMapChrome(realMap);
      lastRenderedLang = currentLang;
    }
    applyingBaseLayer = false;
  });
}

const observer = new MutationObserver(() => applyBaseLayer());
observer.observe(document.body, { childList: true, subtree: true });

const languageObserver = new MutationObserver(() => applyBaseLayer({ forceText: true }));
languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

applyBaseLayer({ forceText: true });
