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
})();
