const BASE_LAYER_KEY = 'taiwan-construction-map-base-layer';

const BASE_LAYERS = {
  osm: {
    label: { zh: 'OpenStreetMap', en: 'OpenStreetMap' },
    attribution: { zh: '© OpenStreetMap contributors', en: '© OpenStreetMap contributors' },
    tile: ({ z, x, y }) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`
  },
  nlscEmap: {
    label: { zh: '官方電子圖', en: 'NLSC e-Map' },
    attribution: { zh: '國土測繪中心電子地圖', en: 'NLSC Taiwan e-Map' },
    tile: ({ z, x, y }) => `https://wmts.nlsc.gov.tw/wmts/EMAP/default/GoogleMapsCompatible/${z}/${y}/${x}`
  },
  nlscGray: {
    label: { zh: '官方灰階', en: 'NLSC Gray' },
    attribution: { zh: '國土測繪中心灰階電子地圖', en: 'NLSC gray e-Map' },
    tile: ({ z, x, y }) => `https://wmts.nlsc.gov.tw/wmts/EMAP2/default/GoogleMapsCompatible/${z}/${y}/${x}`
  },
  nlscPhoto: {
    label: { zh: '官方航照', en: 'NLSC Orthophoto' },
    attribution: { zh: '國土測繪中心正射影像', en: 'NLSC orthophoto' },
    tile: ({ z, x, y }) => `https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/GoogleMapsCompatible/${z}/${y}/${x}`
  },
  nlscCadastre: {
    label: { zh: '地籍參考套疊', en: 'Cadastre overlay' },
    attribution: { zh: '國土測繪中心灰階電子地圖＋地籍參考圖｜地籍套疊僅供參考', en: 'NLSC gray e-Map + cadastral reference｜Cadastre overlay is for reference only' },
    tile: ({ z, x, y }) => `https://wmts.nlsc.gov.tw/wmts/EMAP2/default/GoogleMapsCompatible/${z}/${y}/${x}`,
    overlayTile: ({ z, x, y }) => `https://wmts.nlsc.gov.tw/wmts/LANDSECT/default/GoogleMapsCompatible/${z}/${y}/${x}`
  }
};

let activeBaseLayer = BASE_LAYERS[localStorage.getItem(BASE_LAYER_KEY)] ? localStorage.getItem(BASE_LAYER_KEY) : 'osm';
let applyingBaseLayer = false;

const getLang = () => document.documentElement.lang?.toLowerCase().startsWith('en') ? 'en' : 'zh';

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
        localStorage.setItem(BASE_LAYER_KEY, activeBaseLayer);
        applyBaseLayer();
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

function renderLayerControl(realMap) {
  const lang = getLang();
  const stateKey = `${lang}:${activeBaseLayer}`;
  let control = realMap.querySelector('.base-layer-control');
  if (control?.dataset.state === stateKey) return;

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
      localStorage.setItem(BASE_LAYER_KEY, activeBaseLayer);
      applyBaseLayer();
    });
  });
}

function updateAttribution(realMap) {
  const attr = realMap.querySelector('.map-attribution');
  const layer = BASE_LAYERS[activeBaseLayer] || BASE_LAYERS.osm;
  if (!attr) return;
  const nextText = layer.attribution[getLang()];
  if (attr.textContent !== nextText) attr.textContent = nextText;
  attr.classList.toggle('reference-note', activeBaseLayer === 'nlscCadastre');
}

function applyBaseLayer() {
  if (applyingBaseLayer) return;
  applyingBaseLayer = true;
  requestAnimationFrame(() => {
    const realMap = document.querySelector('.real-map');
    if (realMap) {
      rewriteTiles(realMap);
      renderLayerControl(realMap);
      updateAttribution(realMap);
    }
    applyingBaseLayer = false;
  });
}

const observer = new MutationObserver(() => applyBaseLayer());
observer.observe(document.body, { childList: true, subtree: true });
document.addEventListener('DOMContentLoaded', applyBaseLayer);
applyBaseLayer();