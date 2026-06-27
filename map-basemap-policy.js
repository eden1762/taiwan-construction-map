(() => {
  const simplifiedTile = encodeURI(`data:image/svg+xml;utf8,
    <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
      <rect width="256" height="256" fill="#f6f9fc"/>
      <path d="M0 64H256M0 128H256M0 192H256M64 0V256M128 0V256M192 0V256" stroke="#dbe5ee" stroke-width="1" opacity="0.7"/>
      <path d="M118 31C139 48 157 76 163 110C169 145 156 180 132 215C110 181 97 146 101 111C104 78 109 53 118 31Z" fill="#c8d7e6" opacity="0.32"/>
      <path d="M118 31C139 48 157 76 163 110C169 145 156 180 132 215" fill="none" stroke="#9bb5cf" stroke-width="2" opacity="0.55"/>
    </svg>`).replace(/\s+/g, '');

  const PROVIDERS = [
    {
      name: 'Light infrastructure base',
      label: '輕量地圖背景',
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      options: {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }
    },
    {
      name: 'Open map backup',
      label: '開放地圖備援',
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      options: {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }
    },
    {
      name: 'Simplified local background',
      label: '簡化地圖背景',
      url: simplifiedTile,
      options: {
        maxZoom: 19,
        attribution: '簡化地圖背景；工程資料以來源連結為準'
      }
    }
  ];

  const patchLeaflet = L => {
    if (!L?.tileLayer || L.__taiwanConstructionBasemapPolicy) return;

    const nativeTileLayer = L.tileLayer.bind(L);

    L.tileLayer = (requestedUrl, requestedOptions = {}) => {
      const primary = PROVIDERS[0];
      const backup = PROVIDERS[1];
      const simplified = PROVIDERS[2];
      const layer = nativeTileLayer(primary.url, {
        ...requestedOptions,
        ...primary.options,
        attribution: primary.options.attribution
      });

      let currentProvider = primary;
      let errorCount = 0;

      const switchTo = provider => {
        if (currentProvider.name === provider.name) return;
        currentProvider = provider;
        try {
          layer.setUrl(provider.url);
          layer.options.attribution = provider.options.attribution;
          window.dispatchEvent(new CustomEvent('tcm:basemap-fallback', {
            detail: { to: provider.name, label: provider.label }
          }));
        } catch (error) {
          console.warn('Map background could not be changed.', error);
        }
      };

      layer.on('tileerror', () => {
        errorCount += 1;
        if (currentProvider.name === primary.name && errorCount >= 2) {
          switchTo(backup);
          return;
        }
        if (currentProvider.name === backup.name && errorCount >= 4) {
          switchTo(simplified);
        }
      });

      return layer;
    };

    L.__taiwanConstructionBasemapPolicy = true;
    window.__TAIWAN_CONSTRUCTION_BASEMAPS__ = PROVIDERS.map(({ name, label }) => ({ name, label }));
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
    console.warn('Map background policy could not watch viewer loading.', error);
  }
})();
