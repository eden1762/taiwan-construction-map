(() => {
  const DATA_URL = './data/active_construction_projects.geojson';
  const LANG_KEY = 'taiwan-construction-map-language';
  const FALLBACK_DELAY_MS = 650;
  const FETCH_TIMEOUT_MS = 850;
  const LIST_LIMIT = 24;
  const CATEGORIES = [
    ['公共工程', 'Public works'],
    ['道路/管線', 'Road / utilities'],
    ['捷運/交通', 'Transit / traffic'],
    ['建築/園區', 'Buildings / parks'],
    ['規劃/環評', 'Planning / EIA']
  ];
  const STATUSES = ['規劃中', '招標準備', '招標中', '施工中', '完工', '延宕'];
  const STATUS_EN = {
    '規劃中': 'Planning',
    '招標準備': 'Pre-tender',
    '招標中': 'Tendering',
    '施工中': 'Under construction',
    '完工': 'Completed',
    '延宕': 'Delayed'
  };
  const COPY = {
    zh: {
      title: '工程資料先上線，地圖背景稍後接上',
      text: '目前先顯示可搜尋、可篩選的工程清單與簡化位置圖；若外部地圖載入較慢，首頁也不會卡在 0。',
      showing: '目前顯示',
      projects: '筆工程',
      retry: '重新載入地圖',
      owner: '甲方',
      contractor: '乙方',
      budget: '金額',
      source: '來源',
      address: '地點',
      typeAll: '全部類型',
      statusAll: '全部狀態',
      sourceCount: '可查資料入口',
      costTotal: '工程級距總覽',
      activeProjects: '現況工程',
      empty: '目前沒有符合條件的工程，換個地名、工程名或廠商試試。',
      simplifiedMap: '簡化工程位置圖'
    },
    en: {
      title: 'Project data is ready first; the map background will join later',
      text: 'Searchable and filterable project data is shown immediately, so the home page will not stay at zero while external map files are slow.',
      showing: 'Showing',
      projects: 'projects',
      retry: 'Reload map',
      owner: 'Owner',
      contractor: 'Contractor',
      budget: 'Budget',
      source: 'Source',
      address: 'Place',
      typeAll: 'All types',
      statusAll: 'All status',
      sourceCount: 'Sources',
      costTotal: 'Budget total',
      activeProjects: 'Active projects',
      empty: 'No matching projects. Try another place, project name, or company.',
      simplifiedMap: 'Simplified project map'
    }
  };
  const BUILTIN_FEATURES = [
    { properties: { id: 'instant-001', name: '淡江大橋及連絡道路', category: '捷運/交通', status: '施工中', owner: '交通部公路局', contractor: '工信工程及相關分包團隊', budget_ntd: 23000000000, address: '新北市淡水區、八里區淡水河口', source_name: '交通部公路局', source_url: 'https://www.thb.gov.tw/' }, geometry: { type: 'Point', coordinates: [121.4008, 25.1694] } },
    { properties: { id: 'instant-002', name: '桃園國際機場第三航廈', category: '建築/園區', status: '施工中', owner: '桃園國際機場股份有限公司', contractor: '三星物產、榮工工程等工程團隊', budget_ntd: 95600000000, address: '桃園市大園區桃園國際機場', source_name: '桃園國際機場股份有限公司', source_url: 'https://www.taoyuan-airport.com/' }, geometry: { type: 'Point', coordinates: [121.2329, 25.0781] } },
    { properties: { id: 'instant-003', name: '桃園捷運綠線 GC01 標周邊工程', category: '捷運/交通', status: '施工中', owner: '桃園市政府捷運工程局', contractor: '大陸工程及協力廠商', budget_ntd: 9820000000, address: '桃園市桃園區、中正路與經國路周邊', source_name: '桃園市政府捷運工程局', source_url: 'https://dorts.tycg.gov.tw/' }, geometry: { type: 'Point', coordinates: [121.3015, 25.0172] } },
    { properties: { id: 'instant-004', name: '臺北捷運萬大線第一期 CQ850 區段', category: '捷運/交通', status: '施工中', owner: '臺北市政府捷運工程局', contractor: '中華工程及相關機電團隊', budget_ntd: 7410000000, address: '臺北市萬華區、中正區至新北市中和區', source_name: '臺北市政府捷運工程局', source_url: 'https://www.dorts.gov.taipei/' }, geometry: { type: 'Point', coordinates: [121.5054, 25.0211] } },
    { properties: { id: 'instant-005', name: '新北捷運三鶯線土城端工程', category: '捷運/交通', status: '施工中', owner: '新北市政府捷運工程局', contractor: '榮工工程及系統工程團隊', budget_ntd: 50500000000, address: '新北市土城區、三峽區、鶯歌區', source_name: '新北市政府捷運工程局', source_url: 'https://www.dorts.ntpc.gov.tw/' }, geometry: { type: 'Point', coordinates: [121.3988, 24.9526] } },
    { properties: { id: 'instant-006', name: '高雄捷運黃線 Y15 車站周邊工程', category: '捷運/交通', status: '施工中', owner: '高雄市政府捷運工程局', contractor: '中鋼構、互助營造及相關團隊', budget_ntd: 4420000000, address: '高雄市三民區、苓雅區主要路廊', source_name: '高雄市政府捷運工程局', source_url: 'https://mtbu.kcg.gov.tw/' }, geometry: { type: 'Point', coordinates: [120.3334, 22.6432] } },
    { properties: { id: 'instant-007', name: '臺中捷運藍線臺灣大道核心段', category: '規劃/環評', status: '招標中', owner: '臺中市政府交通局', contractor: '待決標公告', budget_ntd: 161500000000, address: '臺中市臺灣大道沿線', source_name: '臺中市政府交通局', source_url: 'https://www.traffic.taichung.gov.tw/' }, geometry: { type: 'Point', coordinates: [120.646, 24.1612] } },
    { properties: { id: 'instant-008', name: '臺南市區鐵路地下化北段', category: '捷運/交通', status: '延宕', owner: '交通部鐵道局', contractor: '中華工程及相關工程團隊', budget_ntd: 29360000000, address: '臺南市東區、北區鐵路沿線', source_name: '交通部鐵道局', source_url: 'https://www.rb.gov.tw/' }, geometry: { type: 'Point', coordinates: [120.215, 23.005] } },
    { properties: { id: 'instant-009', name: '嘉義市區鐵路高架化車站段', category: '捷運/交通', status: '施工中', owner: '交通部鐵道局', contractor: '東元電機、互助營造及協力團隊', budget_ntd: 23840000000, address: '嘉義市西區嘉義車站周邊', source_name: '交通部鐵道局', source_url: 'https://www.rb.gov.tw/' }, geometry: { type: 'Point', coordinates: [120.441, 23.486] } },
    { properties: { id: 'instant-010', name: '花東鐵路雙軌化玉里段', category: '捷運/交通', status: '施工中', owner: '交通部鐵道局', contractor: '各區段工程得標廠商', budget_ntd: 45600000000, address: '花蓮縣玉里鎮至臺東縣池上鄉沿線', source_name: '交通部鐵道局', source_url: 'https://www.rb.gov.tw/' }, geometry: { type: 'Point', coordinates: [121.314, 23.332] } },
    { properties: { id: 'instant-011', name: '臺北市道路挖掘信義幹線更新', category: '道路/管線', status: '施工中', owner: '臺北市政府工務局', contractor: '道路管線申挖核准廠商', budget_ntd: 180000000, address: '臺北市信義區松仁路、信義路周邊', source_name: '臺北市道路挖掘管理中心', source_url: 'https://dig.taipei/' }, geometry: { type: 'Point', coordinates: [121.5683, 25.0339] } },
    { properties: { id: 'instant-012', name: '橋頭科學園區公共設施第一期', category: '建築/園區', status: '施工中', owner: '南部科學園區管理局', contractor: '園區公共工程得標廠商', budget_ntd: 12800000000, address: '高雄市橋頭區橋頭科學園區', source_name: '南部科學園區管理局', source_url: 'https://www.stsp.gov.tw/' }, geometry: { type: 'Point', coordinates: [120.325, 22.775] } }
  ];

  let instantFeatures = BUILTIN_FEATURES;
  let activated = false;

  const $ = selector => document.querySelector(selector);
  const lang = () => {
    try { return localStorage.getItem(LANG_KEY) === 'en' || document.documentElement.lang?.startsWith('en') ? 'en' : 'zh'; }
    catch { return document.documentElement.lang?.startsWith('en') ? 'en' : 'zh'; }
  };
  const text = key => COPY[lang()]?.[key] || COPY.zh[key] || key;
  const esc = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  const safeUrl = value => {
    const url = String(value || '');
    return url.startsWith('https://') || url.startsWith('http://') ? esc(url) : '#';
  };
  const labelCategory = category => lang() === 'en' ? (CATEGORIES.find(item => item[0] === category)?.[1] || category) : category;
  const labelStatus = status => lang() === 'en' ? (STATUS_EN[status] || status) : status;
  const normalize = value => String(value || '').trim().toLowerCase();
  const hasPrimaryContent = () => Number($('#metricProjects')?.textContent || 0) > 0 && document.querySelector('#projectList .project-card:not(.empty):not(.instant-empty)') && document.querySelector('.map-frame.mvp-leaflet-ready');
  const usableFeatures = features => {
    const seen = new Set();
    return (features || []).filter(feature => {
      const props = feature?.properties || {};
      const id = String(props.id || [props.name, props.address, props.source_url].join('|')).toLowerCase();
      if (!props.name || !feature?.geometry || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  };
  const currentFilters = () => ({
    query: normalize($('#searchInput')?.value || ''),
    type: $('#typeFilter')?.value || 'all',
    status: $('#statusFilter')?.value || 'all'
  });
  const filteredFeatures = () => {
    const filters = currentFilters();
    return instantFeatures.filter(feature => {
      const props = feature.properties || {};
      const haystack = normalize([props.name, props.address, props.owner, props.contractor, props.category, props.status, props.source_name].join(' '));
      return (filters.type === 'all' || props.category === filters.type)
        && (filters.status === 'all' || props.status === filters.status)
        && (!filters.query || haystack.includes(filters.query));
    });
  };
  const formatBudget = value => {
    const amount = Number(value || 0);
    if (!amount) return '—';
    return lang() === 'en' ? `NT$ ${(amount / 1e9).toFixed(2)}B` : `約 ${Math.round(amount / 1e8).toLocaleString('zh-Hant')} 億元`;
  };
  const updateMetrics = features => {
    const total = features.reduce((sum, feature) => sum + Number(feature.properties?.budget_ntd || 0), 0);
    const sources = new Set(features.map(feature => feature.properties?.source_name).filter(Boolean)).size;
    const metricProjects = $('#metricProjects');
    const metricCost = $('#metricCost');
    const metricSources = $('#metricSources');
    if (metricProjects) metricProjects.textContent = String(features.length);
    if (metricCost) metricCost.textContent = total ? (lang() === 'en' ? `${(total / 1e9).toFixed(1)}B` : `${Math.round(total / 1e8)}億`) : '—';
    if (metricSources) metricSources.textContent = String(sources);
  };
  const hydrateFilters = () => {
    const typeFilter = $('#typeFilter');
    const statusFilter = $('#statusFilter');
    if (typeFilter && typeFilter.options.length <= 1) {
      const oldValue = typeFilter.value || 'all';
      typeFilter.innerHTML = `<option value="all">${esc(text('typeAll'))}</option>` + CATEGORIES.map(item => `<option value="${esc(item[0])}">${esc(labelCategory(item[0]))}</option>`).join('');
      typeFilter.value = [...CATEGORIES.map(item => item[0]), 'all'].includes(oldValue) ? oldValue : 'all';
    }
    if (statusFilter && statusFilter.options.length <= 1) {
      const oldValue = statusFilter.value || 'all';
      statusFilter.innerHTML = `<option value="all">${esc(text('statusAll'))}</option>` + STATUSES.map(status => `<option value="${esc(status)}">${esc(labelStatus(status))}</option>`).join('');
      statusFilter.value = [...STATUSES, 'all'].includes(oldValue) ? oldValue : 'all';
    }
  };
  const pointPosition = feature => {
    const coordinates = feature.geometry?.coordinates;
    if (!Array.isArray(coordinates) || !Number.isFinite(coordinates[0]) || !Number.isFinite(coordinates[1])) return { left: 50, top: 50 };
    const x = Math.min(94, Math.max(6, ((coordinates[0] - 119.2) / (122.3 - 119.2)) * 100));
    const y = Math.min(94, Math.max(6, (1 - ((coordinates[1] - 21.8) / (25.4 - 21.8))) * 100));
    return { left: x, top: y };
  };
  const selectFeature = id => {
    const feature = instantFeatures.find(item => String(item.properties?.id) === String(id));
    if (!feature) return;
    const props = feature.properties || {};
    const status = $('#mapStatus');
    if (status) {
      status.classList.add('is-open');
      status.innerHTML = `<article class="map-detail-card instant-ready-card"><h3>${esc(props.name)}</h3><p>${esc(props.address || '')}</p><dl><div><dt>${esc(text('owner'))}</dt><dd>${esc(props.owner || '—')}</dd></div><div><dt>${esc(text('contractor'))}</dt><dd>${esc(props.contractor || '—')}</dd></div><div><dt>${esc(text('budget'))}</dt><dd>${esc(formatBudget(props.budget_ntd))}</dd></div><div><dt>${esc(text('source'))}</dt><dd>${esc(props.source_name || '—')}</dd></div></dl><div class="detail-actions"><a href="${safeUrl(props.source_url)}" target="_blank" rel="noopener noreferrer">${esc(props.source_name || text('source'))} ↗</a></div></article>`;
    }
    document.querySelectorAll('[data-instant-project], [data-instant-pin]').forEach(node => node.classList.toggle('active', node.dataset.instantProject === id || node.dataset.instantPin === id));
  };
  const renderMap = features => {
    const map = $('#map');
    if (!map || document.querySelector('.map-frame.mvp-leaflet-ready')) return;
    const pins = features.slice(0, LIST_LIMIT).map(feature => {
      const props = feature.properties || {};
      const position = pointPosition(feature);
      return `<button type="button" class="instant-pin" data-instant-pin="${esc(props.id || '')}" style="left:${position.left}%;top:${position.top}%" aria-label="${esc(props.name || '')}"></button>`;
    }).join('');
    map.innerHTML = `<div class="instant-map" role="img" aria-label="${esc(text('simplifiedMap'))}"><div class="instant-map-grid"></div><div class="instant-taiwan-shape"></div>${pins}<div class="instant-map-title">${esc(text('simplifiedMap'))}</div></div>`;
    map.querySelectorAll('[data-instant-pin]').forEach(pin => pin.addEventListener('click', () => selectFeature(pin.dataset.instantPin)));
  };
  const renderList = features => {
    const list = $('#projectList');
    if (!list) return;
    const visible = features.slice(0, LIST_LIMIT);
    if (!visible.length) {
      list.innerHTML = `<div class="project-card empty instant-empty"><h3>${esc(text('empty'))}</h3></div>`;
      return;
    }
    list.innerHTML = visible.map(feature => {
      const props = feature.properties || {};
      return `<article class="project-card instant-project-card" data-instant-project="${esc(props.id || '')}" tabindex="0"><div class="meta-row"><span class="badge status">${esc(labelStatus(props.status || ''))}</span><span class="badge">${esc(labelCategory(props.category || ''))}</span></div><h3>${esc(props.name)}</h3><p>${esc(props.address || '')}</p><div class="mini-facts"><span>${esc(text('owner'))}：${esc(props.owner || '—')}</span><span>${esc(text('contractor'))}：${esc(props.contractor || '—')}</span></div></article>`;
    }).join('');
    list.querySelectorAll('[data-instant-project]').forEach(card => {
      card.addEventListener('click', () => selectFeature(card.dataset.instantProject));
      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectFeature(card.dataset.instantProject);
        }
      });
    });
  };
  const renderStatus = count => {
    const status = $('#mapStatus');
    if (!status || status.querySelector('.mvp-project-card')) return;
    status.classList.add('is-open');
    status.innerHTML = `<article class="map-detail-card instant-ready-card"><h3>${esc(text('title'))}</h3><p>${esc(text('text'))}</p><dl><div><dt>${esc(text('showing'))}</dt><dd>${count} ${esc(text('projects'))}</dd></div></dl><div class="detail-actions"><button type="button" data-instant-retry>${esc(text('retry'))}</button></div></article>`;
    status.querySelector('[data-instant-retry]')?.addEventListener('click', () => window.location.reload());
  };
  const render = () => {
    if (hasPrimaryContent()) return;
    hydrateFilters();
    const features = filteredFeatures();
    updateMetrics(instantFeatures);
    renderList(features);
    renderMap(features);
    renderStatus(features.length);
    document.documentElement.classList.add('tcm-instant-ready');
  };
  const bind = () => {
    $('#searchInput')?.addEventListener('input', render);
    $('#typeFilter')?.addEventListener('change', render);
    $('#statusFilter')?.addEventListener('change', render);
    $('#languageToggle')?.addEventListener('click', () => setTimeout(render, 80));
    document.addEventListener('click', event => {
      if (event.target.closest('[data-retry-map]')) {
        event.preventDefault();
        window.location.reload();
      }
    });
  };
  const ensureStyles = () => {
    if ($('#tcm-instant-ready-style')) return;
    const style = document.createElement('style');
    style.id = 'tcm-instant-ready-style';
    style.textContent = `.instant-map{position:absolute;inset:0;overflow:hidden;border-radius:inherit;background:linear-gradient(135deg,#e8f6ff 0%,#f7fbff 46%,#fef6e9 100%)}.instant-map-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(15,42,68,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(15,42,68,.08) 1px,transparent 1px);background-size:44px 44px}.instant-taiwan-shape{position:absolute;left:43%;top:10%;width:27%;height:78%;border-radius:48% 55% 45% 50%/38% 45% 55% 62%;background:linear-gradient(180deg,rgba(44,135,184,.28),rgba(32,115,172,.12));transform:rotate(-17deg);box-shadow:inset 0 0 0 2px rgba(18,63,102,.16),0 22px 60px rgba(18,63,102,.12)}.instant-pin{position:absolute;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:999px;border:2px solid #fff;background:#0f6fae;box-shadow:0 6px 18px rgba(8,42,70,.28);cursor:pointer;z-index:3}.instant-pin.active,.instant-pin:focus{width:22px;height:22px;margin:-11px 0 0 -11px;outline:3px solid rgba(14,165,233,.24)}.instant-map-title{position:absolute;left:14px;top:14px;padding:8px 12px;border-radius:999px;background:rgba(255,255,255,.9);color:#16334c;font-weight:900;box-shadow:0 12px 26px rgba(8,42,70,.12)}.instant-project-card.active{outline:3px solid rgba(14,165,233,.25)}.tcm-instant-ready .hero-metrics strong{font-variant-numeric:tabular-nums}@media(max-width:900px){.instant-map{min-height:380px}.instant-pin{width:18px;height:18px;margin:-9px 0 0 -9px}#projectList .instant-project-card:nth-of-type(n+13){display:none}}`;
    document.head.append(style);
  };
  const fetchQuickData = async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(`${DATA_URL}?instant=${Date.now()}`, { cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new Error('instant data unavailable');
      const data = await response.json();
      const features = usableFeatures(data.features);
      if (features.length) instantFeatures = features;
    } catch (error) {
      console.warn('Using built-in instant construction data while the full dataset loads.', error);
    } finally {
      clearTimeout(timer);
    }
  };
  const activate = async () => {
    if (activated || hasPrimaryContent()) return;
    activated = true;
    ensureStyles();
    bind();
    render();
    await fetchQuickData();
    render();
  };
  const schedule = () => setTimeout(activate, FALLBACK_DELAY_MS);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
  else schedule();
  setTimeout(activate, FALLBACK_DELAY_MS + 1600);
})();