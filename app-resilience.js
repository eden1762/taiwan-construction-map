const FALLBACK_GEOJSON_URL='./data/active_construction_projects.geojson';
const FALLBACK_DELAY_MS=1800;
const isEnglish=()=>document.documentElement.lang?.startsWith('en');
const text={
  zh:{loading:'工程資料整理中。',fallbackTitle:'地圖暫時不穩，工程資料先給你看',fallbackText:'底圖或地圖元件連線不穩時，工程清單、搜尋結果與來源連結會先顯示；你仍可先查工程名、地點、甲方與乙方。',open:'來源連結 ↗',budget:'金額',owner:'甲方',contractor:'乙方',place:'地點',status:'狀態',type:'類型',updated:'更新日',empty:'目前沒有可顯示的工程資料',projects:'現況工程',sources:'資料來源',cost:'總金額估算'},
  en:{loading:'Preparing project data.',fallbackTitle:'Map is unstable, project data is still available',fallbackText:'When the base map or map viewer is unstable, the project list, search results, and source links load first so you can still check project names, places, owners, and contractors.',open:'Source link ↗',budget:'Budget',owner:'Owner',contractor:'Contractor',place:'Place',status:'Status',type:'Type',updated:'Updated',empty:'No project data is available right now',projects:'Active projects',sources:'Sources',cost:'Budget total'}
};
const t=k=>text[isEnglish()?'en':'zh'][k]||k;
const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const validUrl=v=>/^https?:\/\//.test(String(v||''));
const normalize=v=>String(v||'').trim().toLowerCase();
const byId=id=>document.getElementById(id);
const selectors={list:'#projectList',status:'#mapStatus',mapFrame:'.map-frame'};

setTimeout(initResilience,FALLBACK_DELAY_MS);
window.addEventListener('languagechange',()=>setTimeout(initResilience,80));

async function initResilience(){
  const list=document.querySelector(selectors.list);
  if(!list)return;
  const mapError=document.querySelector('.mvp-map-error');
  const hasCards=list.querySelector('.project-card:not(.empty)');
  if(hasCards&&!mapError)return;
  try{
    const data=await fetchProjects();
    const features=dedupe((data.features||[]).filter(hasGeometry));
    updateMetrics(features);
    renderFallbackList(features);
    if(mapError||!hasCards)renderFallbackStatus(features.length);
    bindFallbackSearch(features);
  }catch(e){
    if(!list.children.length)list.innerHTML=`<div class="project-card empty"><h3>${esc(t('empty'))}</h3><p>${esc(t('loading'))}</p></div>`;
  }
}

async function fetchProjects(){
  const r=await fetch(`${FALLBACK_GEOJSON_URL}?resilience=${Date.now()}`,{cache:'no-store'});
  if(!r.ok)throw new Error('project-data-unavailable');
  const data=await r.json();
  if(data?.type!=='FeatureCollection'||!Array.isArray(data.features))throw new Error('project-data-invalid');
  return data;
}

function dedupe(features){
  const seen=new Set();
  const output=[];
  for(const feature of features){
    const p=feature.properties||{};
    const key=normalize([p.source_url,p.name,p.address,p.owner].join('|'))||normalize(p.id);
    if(!key||seen.has(key))continue;
    seen.add(key);
    output.push(feature);
  }
  return output;
}
function hasGeometry(feature){
  const g=feature?.geometry;
  if(!g)return false;
  if(g.type==='Point')return Number.isFinite(g.coordinates?.[0])&&Number.isFinite(g.coordinates?.[1]);
  return ['LineString','MultiLineString','Polygon','MultiPolygon'].includes(g.type);
}
function updateMetrics(features){
  const total=features.reduce((s,f)=>s+Number(f.properties?.budget_ntd||0),0);
  const sources=new Set(features.map(f=>f.properties?.source_name).filter(Boolean)).size;
  const metricProjects=byId('metricProjects'), metricCost=byId('metricCost'), metricSources=byId('metricSources');
  if(metricProjects)metricProjects.textContent=String(features.length);
  if(metricCost)metricCost.textContent=isEnglish()?`${(total/1e9).toFixed(1)}B`:`${Math.round(total/1e8).toLocaleString('zh-Hant')}億`;
  if(metricSources)metricSources.textContent=String(sources);
}
function renderFallbackList(features){
  const list=document.querySelector(selectors.list);
  if(!list)return;
  const current=filterFeatures(features);
  if(!current.length){list.innerHTML=`<div class="project-card empty"><h3>${esc(t('empty'))}</h3></div>`;return;}
  const frag=document.createDocumentFragment();
  current.forEach(feature=>{
    const p=feature.properties||{};
    const card=document.createElement('article');
    card.className='project-card resilience-card';
    card.tabIndex=0;
    card.innerHTML=`<div class="meta-row"><span class="badge">${esc(p.category||'')}</span><span class="badge status">${esc(p.status||'')}</span></div><h3>${esc(p.name||p.name_en||'')}</h3><p>${esc(p.address||p.address_en||'')}</p><div class="mini-facts"><span>${esc(t('owner'))}：${esc(p.owner||p.owner_en||'—')}</span><span>${esc(t('contractor'))}：${esc(p.contractor||p.contractor_en||'—')}</span></div>`;
    card.addEventListener('click',()=>renderFallbackDetail(feature));
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();renderFallbackDetail(feature);}});
    frag.append(card);
  });
  list.replaceChildren(frag);
}
function renderFallbackStatus(count){
  const status=document.querySelector(selectors.status);
  if(!status)return;
  status.classList.add('is-open');
  status.innerHTML=`<article class="map-detail-card"><h3>${esc(t('fallbackTitle'))}</h3><p>${esc(t('fallbackText'))}</p><dl><div><dt>${esc(t('projects'))}</dt><dd>${count}</dd></div></dl></article>`;
}
function renderFallbackDetail(feature){
  const p=feature.properties||{};
  const status=document.querySelector(selectors.status);
  if(!status)return;
  status.classList.add('is-open');
  status.innerHTML=`<article class="map-detail-card mvp-project-card"><div class="meta-row"><span class="badge">${esc(p.category||'')}</span><span class="badge status">${esc(p.status||'')}</span></div><h3>${esc(p.name||p.name_en||'')}</h3><p>${esc(p.address||p.address_en||'')}</p><dl>${row(t('owner'),p.owner||p.owner_en)}${row(t('contractor'),p.contractor||p.contractor_en)}${row(t('budget'),formatBudget(p.budget_ntd))}${row(t('place'),p.address||p.address_en)}${row(t('updated'),p.updated_at)}</dl>${validUrl(p.source_url)?`<div class="detail-actions"><a href="${esc(p.source_url)}" target="_blank" rel="noopener noreferrer">${esc(p.source_name||t('open'))}</a></div>`:''}</article>`;
}
function bindFallbackSearch(features){
  const search=byId('searchInput'), type=byId('typeFilter'), status=byId('statusFilter');
  const render=()=>renderFallbackList(features);
  search?.removeEventListener('input',render);
  type?.removeEventListener('change',render);
  status?.removeEventListener('change',render);
  search?.addEventListener('input',render);
  type?.addEventListener('change',render);
  status?.addEventListener('change',render);
}
function filterFeatures(features){
  const q=normalize(byId('searchInput')?.value||''), type=byId('typeFilter')?.value||'all', status=byId('statusFilter')?.value||'all';
  return features.filter(f=>{
    const p=f.properties||{};
    const hay=normalize([p.name,p.name_en,p.address,p.address_en,p.owner,p.owner_en,p.contractor,p.contractor_en,p.category,p.status].join(' '));
    return (type==='all'||p.category===type)&&(status==='all'||p.status===status)&&(!q||hay.includes(q));
  });
}
function row(label,value){return `<div><dt>${esc(label)}</dt><dd>${esc(value||'—')}</dd></div>`;}
function formatBudget(v){const n=Number(v||0);if(!n)return '—';return isEnglish()?`NT$ ${(n/1e9).toFixed(2)}B`:`約 ${Math.round(n/1e8).toLocaleString('zh-Hant')} 億元`;}
