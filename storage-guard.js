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
})();
