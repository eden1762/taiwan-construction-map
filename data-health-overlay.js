const DATASET_URL = './data/active_construction_projects.geojson';
const MANIFEST_URL = './data/active_dataset_manifest.json';
const REQUIRED_FIELDS = ['id','name','category','status','owner','contractor','budget_ntd','start_date','planned_end_date','address','source_name','source_url','updated_at'];
const ACTIVE_STATUSES = new Set(['規劃中','招標準備','招標中','施工中','延宕']);
const TARGET_COUNT = 3000;

const copy = {
  zh: {
    eyebrow: '資料健康度',
    title: '工程資料不只要多，也要能查、能篩、能回溯。',
    text: '首頁資料會自動檢查欄位完整度、來源連結、地圖標示與現況狀態；有缺漏就先提醒，避免把過期或無法回查的工程混進現況地圖。',
    active: '現況資料',
    progress: '累積進度',
    sources: '來源入口',
    geometry: '可上圖資料',
    field: '欄位完整',
    issueTitle: '待補強項目',
    noIssue: '目前沒有明顯資料健康問題。',
    missingFields: '有工程仍缺必要欄位，建議補齊甲方、乙方、金額、期程或來源。',
    missingSource: '有工程缺少可回查來源連結，暫時不宜當成正式引用資料。',
    missingGeometry: '有工程缺少有效地圖標示，建議補點位、路線或範圍。',
    inactive: '有資料狀態不屬於現況規則，建議移出首頁 active 地圖或改放歷史區。',
    duplicate: '偵測到疑似重複資料，建議合併同一工程或保留契約分段。',
    target: '朝 3000 筆可回查現況工程累積',
    updated: '更新日'
  },
  en: {
    eyebrow: 'Data health',
    title: 'Construction data should be traceable, searchable, and map-ready.',
    text: 'The active map checks field coverage, source links, map geometry, and current status so stale or untraceable projects do not blend into the live view.',
    active: 'Active records',
    progress: 'Growth progress',
    sources: 'Source portals',
    geometry: 'Map-ready records',
    field: 'Field coverage',
    issueTitle: 'Needs attention',
    noIssue: 'No obvious data health issue found right now.',
    missingFields: 'Some projects still miss required fields. Add owner, contractor, budget, dates, or source details.',
    missingSource: 'Some projects do not have traceable source links yet, so they should not be cited as official records.',
    missingGeometry: 'Some projects do not have valid map marks. Add points, routes, or areas.',
    inactive: 'Some records are outside the active-status rule. Move them out of the live map or into history.',
    duplicate: 'Possible duplicate records were detected. Merge the same project unless the contract segment is clearly different.',
    target: 'Growing toward 3,000 traceable active projects',
    updated: 'Updated'
  }
};

const lang = () => document.documentElement.lang?.startsWith('en') ? 'en' : 'zh';
const t = key => copy[lang()][key] || key;
const esc = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const norm = value => String(value || '').trim().toLowerCase();

injectDataHealthStyles();
window.addEventListener('languagechange', () => setTimeout(renderDataHealth, 120));
setTimeout(renderDataHealth, 900);

async function renderDataHealth(){
  const host = document.querySelector('#maintainPanel .section-title') || document.querySelector('#maintainPanel');
  if(!host) return;
  try{
    const [geojson, manifest] = await Promise.all([loadJson(DATASET_URL), loadJson(MANIFEST_URL).catch(() => null)]);
    const features = Array.isArray(geojson.features) ? geojson.features : [];
    const report = buildReport(features, manifest);
    const panel = ensurePanel(host);
    panel.innerHTML = panelHtml(report);
  }catch(error){
    const panel = ensurePanel(host);
    panel.innerHTML = `<div class="data-health-card"><p class="eyebrow">${esc(t('eyebrow'))}</p><h3>${esc(t('title'))}</h3><p>${esc(t('text'))}</p></div>`;
  }
}

async function loadJson(url){
  const response = await fetch(`${url}?health=${Date.now()}`, {cache:'no-store'});
  if(!response.ok) throw new Error('data-unavailable');
  return response.json();
}

function buildReport(features, manifest){
  const total = features.length;
  let fieldReady = 0;
  let geometryReady = 0;
  let sourceReady = 0;
  let activeReady = 0;
  const seen = new Set();
  let duplicates = 0;

  for(const feature of features){
    const p = feature.properties || {};
    const missing = REQUIRED_FIELDS.filter(field => p[field] === undefined || p[field] === null || String(p[field]).trim() === '');
    if(!missing.length) fieldReady += 1;
    if(validGeometry(feature.geometry)) geometryReady += 1;
    if(/^https?:\/\//.test(String(p.source_url || ''))) sourceReady += 1;
    if(ACTIVE_STATUSES.has(p.status) || recentlyCompleted(p)) activeReady += 1;
    const key = norm([p.source_url, p.name, p.address, p.owner].join('|')) || norm(p.id);
    if(key){
      if(seen.has(key)) duplicates += 1;
      seen.add(key);
    }
  }

  const sourceCount = new Set(features.map(f => f.properties?.source_name).filter(Boolean)).size;
  const target = Number(manifest?.target_active_project_count || TARGET_COUNT);
  return {
    total,
    target,
    progress: target ? Math.min(100, Math.round(total / target * 1000) / 10) : 0,
    sourceCount,
    fieldPct: pct(fieldReady, total),
    geometryPct: pct(geometryReady, total),
    sourcePct: pct(sourceReady, total),
    activePct: pct(activeReady, total),
    missingFields: total - fieldReady,
    missingGeometry: total - geometryReady,
    missingSource: total - sourceReady,
    inactive: total - activeReady,
    duplicates,
    updated: manifest?.updated_at || geojsonDate(features)
  };
}

function validGeometry(geometry){
  if(!geometry || !geometry.type) return false;
  if(geometry.type === 'Point') return Number.isFinite(geometry.coordinates?.[0]) && Number.isFinite(geometry.coordinates?.[1]);
  return ['LineString','MultiLineString','Polygon','MultiPolygon'].includes(geometry.type);
}

function recentlyCompleted(p){
  if(p.status !== '完工') return false;
  const d = new Date(p.updated_at || p.planned_end_date || '');
  if(Number.isNaN(d.getTime())) return false;
  return (Date.now() - d.getTime()) <= 31 * 24 * 60 * 60 * 1000;
}

function pct(done, total){
  if(!total) return 0;
  return Math.round(done / total * 100);
}

function geojsonDate(features){
  return features.map(f => f.properties?.updated_at).filter(Boolean).sort().at(-1) || '—';
}

function ensurePanel(host){
  let panel = document.querySelector('#dataHealthPanel');
  if(!panel){
    panel = document.createElement('section');
    panel.id = 'dataHealthPanel';
    panel.className = 'data-health-panel';
    panel.setAttribute('aria-live','polite');
    host.insertAdjacentElement('afterend', panel);
  }
  return panel;
}

function panelHtml(report){
  const issues = [];
  if(report.missingFields) issues.push(t('missingFields'));
  if(report.missingSource) issues.push(t('missingSource'));
  if(report.missingGeometry) issues.push(t('missingGeometry'));
  if(report.inactive) issues.push(t('inactive'));
  if(report.duplicates) issues.push(t('duplicate'));
  return `<div class="data-health-card">
    <p class="eyebrow">${esc(t('eyebrow'))}</p>
    <h3>${esc(t('title'))}</h3>
    <p>${esc(t('text'))}</p>
    <div class="data-health-stats">
      ${stat(t('active'), report.total)}
      ${stat(t('progress'), `${report.progress}%`)}
      ${stat(t('sources'), report.sourceCount)}
      ${stat(t('geometry'), `${report.geometryPct}%`)}
      ${stat(t('field'), `${report.fieldPct}%`)}
    </div>
    <div class="data-health-progress" aria-label="${esc(t('target'))}"><span style="width:${Math.max(2, report.progress)}%"></span></div>
    <p class="data-health-small">${esc(t('target'))} · ${esc(t('updated'))} ${esc(report.updated || '—')}</p>
    <h4>${esc(t('issueTitle'))}</h4>
    <ul>${(issues.length ? issues : [t('noIssue')]).map(item => `<li>${esc(item)}</li>`).join('')}</ul>
  </div>`;
}

function stat(label, value){
  return `<div><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`;
}

function injectDataHealthStyles(){
  if(document.querySelector('#dataHealthStyles')) return;
  const style = document.createElement('style');
  style.id = 'dataHealthStyles';
  style.textContent = `
    .data-health-panel{margin:1.2rem 0 0;}
    .data-health-card{border:1px solid rgba(148,163,184,.24);border-radius:24px;padding:1.25rem;background:linear-gradient(135deg,rgba(15,23,42,.92),rgba(8,47,73,.78));box-shadow:0 18px 55px rgba(2,8,23,.26);}
    .data-health-card h3{margin:.25rem 0 .55rem;font-size:clamp(1.25rem,2vw,1.8rem);}
    .data-health-card p{color:rgba(226,232,240,.82);line-height:1.7;}
    .data-health-stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:.75rem;margin:1rem 0;}
    .data-health-stats div{border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:.85rem;background:rgba(255,255,255,.07);}
    .data-health-stats strong{display:block;font-size:1.35rem;}
    .data-health-stats span,.data-health-small{font-size:.86rem;color:rgba(226,232,240,.72);}
    .data-health-progress{height:10px;border-radius:999px;background:rgba(255,255,255,.12);overflow:hidden;margin:.4rem 0 .45rem;}
    .data-health-progress span{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#38bdf8,#22c55e,#fbbf24);}
    .data-health-card h4{margin:1rem 0 .35rem;}
    .data-health-card ul{margin:0;padding-left:1.15rem;color:rgba(226,232,240,.84);line-height:1.65;}
    @media (max-width:760px){.data-health-card{border-radius:20px;padding:1rem}.data-health-stats{grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem}.data-health-stats div:last-child{grid-column:1/-1}.data-health-stats strong{font-size:1.15rem}}
  `;
  document.head.append(style);
}
