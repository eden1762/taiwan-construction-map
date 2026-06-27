(() => {
  const PROVIDERS = [
    {
      name: 'Light infrastructure base',
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      options: {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }
    },
    {
      name: 'Open map backup',
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      options: {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }
    }
  ];

  const patchLeaflet = L => {
    if (!L?.tileLayer || L.__taiwanConstructionBasemapPolicy) return;

    const nativeTileLayer = L.tileLayer.bind(L);

    L.tileLayer = (requestedUrl, requestedOptions = {}) => {
      const primary = PROVIDERS[0];
      const backup = PROVIDERS[1];
      const layer = nativeTileLayer(primary.url, {
        ...requestedOptions,
        ...primary.options,
        attribution: primary.options.attribution
      });

      let backupUsed = false;
      let errorCount = 0;

      layer.on('tileerror', () => {
        errorCount += 1;
        if (backupUsed || errorCount < 2) return;
        backupUsed = true;
        try {
          layer.setUrl(backup.url);
          layer.options.attribution = backup.options.attribution;
          window.dispatchEvent(new CustomEvent('tcm:basemap-fallback', {
            detail: { from: primary.name, to: backup.name }
          }));
        } catch (error) {
          console.warn('Map backup layer could not be applied.', error);
        }
      });

      return layer;
    };

    L.__taiwanConstructionBasemapPolicy = true;
    window.__TAIWAN_CONSTRUCTION_BASEMAPS__ = PROVIDERS.map(({ name }) => name);
  };

  let currentLeaflet = window.L;
  if (currentLeaflet?.tileLayer) patchLeaflet(currentLeaflet);

  try {
    Object.defineProperty(window, 'L', {
      configurable: true,
      get() {
        return currentLeaflet;
      },
      set(value) {
        currentLeaflet = value;
        patchLeaflet(value);
      }
    });
  } catch (error) {
    console.warn('Map layer policy could not watch Leaflet loading.', error);
  }
})();
