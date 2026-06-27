(() => {
  const memoryStore = new Map();
  const fallbackStorage = {
    getItem(key) {
      return memoryStore.has(key) ? memoryStore.get(key) : null;
    },
    setItem(key, value) {
      memoryStore.set(key, String(value));
    },
    removeItem(key) {
      memoryStore.delete(key);
    },
    clear() {
      memoryStore.clear();
    }
  };

  const safeStorage = {
    getItem(key) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return fallbackStorage.getItem(key);
      }
    },
    setItem(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        fallbackStorage.setItem(key, value);
      }
    },
    removeItem(key) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        fallbackStorage.removeItem(key);
      }
    }
  };

  try {
    const testKey = '__taiwan_construction_map_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
  } catch {
    try {
      Object.defineProperty(window, 'localStorage', {
        value: fallbackStorage,
        configurable: true
      });
    } catch {
      window.__taiwanConstructionMapStorageFallback = fallbackStorage;
    }
  }

  window.__taiwanConstructionMapSafeStorage = safeStorage;

  const styleId = 'taiwan-construction-map-upgrade-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .legacy-legend-hidden{display:none!important}.layer-switchboard{display:grid;gap:10px;padding:0 22px 14px}.layer-heading{display:flex;align-items:center;justify-content:space-between;gap:10px;color:#18324a;font-weight:950}.layer-mini-action{min-height:34px;padding:0 11px;border-radius:999px;border:1px solid rgba(15,42,68,.12);background:#fff;color:#0f2b44;box-shadow:none;font-size:12px}.layer-chip-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.layer-chip{display:flex;align-items:center;gap:8px;min-height:42px;width:100%;padding:8px 10px;border-radius:15px;border:1px solid rgba(15,42,68,.12);background:#fff;color:#31485b;box-shadow:none;text-align:left}.layer-chip i{width:11px;height:11px;border-radius:999px;background:var(--chip-color,#35d4ff);box-shadow:0 0 0 5px rgba(53,212,255,.12);flex:0 0 auto}.layer-chip span{min-width:0;flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-weight:950}.layer-chip b{flex:0 0 auto;min-width:24px;padding:3px 6px;border-radius:999px;background:#eef6ff;color:#1d5d93;font-size:11px;text-align:center}.layer-chip.active{border-color:rgba(47,128,237,.45);background:linear-gradient(135deg,#f7fbff,#fff);color:#0f2b44;box-shadow:0 10px 22px rgba(15,42,68,.08)}.layer-chip:not(.active){opacity:.58}.status-strip{display:grid;gap:8px;padding:0 22px 14px}.status-strip div{display:grid;gap:3px;border:1px solid rgba(15,42,68,.1);border-radius:15px;background:linear-gradient(135deg,rgba(15,43,68,.04),rgba(53,212,255,.08));padding:10px 12px}.status-strip span{color:#647486;font-size:11px;font-weight:950;letter-spacing:.06em}.status-strip strong{color:#102131;font-size:13px;line-height:1.35}.heat-layer{pointer-events:none}.heat-ring{fill:rgba(255,179,71,.2);stroke:rgba(242,140,40,.56);stroke-width:2;filter:drop-shadow(0 10px 20px rgba(242,140,40,.18))}.heat-core{fill:rgba(242,140,40,.34);stroke:rgba(255,255,255,.88);stroke-width:2}.heat-zone text{fill:#102131;font-size:13px;font-weight:950;text-anchor:middle;paint-order:stroke;stroke:rgba(255,255,255,.92);stroke-width:5}.project-card.active{background:linear-gradient(135deg,#fff,#f6fbff)}@media(max-width:760px){.layer-switchboard,.status-strip{padding-left:16px;padding-right:16px}.layer-chip-grid{display:flex;overflow-x:auto;padding-bottom:2px;scrollbar-width:thin}.layer-chip-grid .layer-chip{min-width:138px;flex:0 0 auto}.layer-chip-wide{min-height:46px}.status-strip{grid-template-columns:1fr}.heat-zone text{font-size:11px}.map-detail-card h3{font-size:18px}}
    `;
    document.head.append(style);
  }
})();
