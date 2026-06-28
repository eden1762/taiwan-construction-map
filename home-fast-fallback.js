const FAST_FALLBACK_DELAY_MS=3200;
const FAST_FALLBACK_LIMIT=24;
const FAST_FETCH_TIMEOUT_MS=1100;
const FAST_DATA_URL='./data/active_construction_projects.geojson';
const FAST_LANG_KEY='taiwan-construction-map-language';
const FAST_COPY={
  zh:{loading:'工程資料先上線，地圖背景仍在準備中。',ready:'先顯示輕量工程清單，地圖背景完成後會自動接上。',retry:'重試地圖',owner:'甲方',contractor:'乙方',source:'來源',empty:'目前沒有可先顯示的工程資料。',summary:'先顯示',projects:'筆精選工程',slow:'目前網路較慢，先保留搜尋、篩選與資料入口；請點重試重新載入工程資料。'},
  en:{loading:'Project data is ready first while the map background is still loading.',ready:'Showing a lightweight project list first. The map background will join when ready.',retry:'Retry map',owner:'Owner',contractor:'Contractor',source:'Source',empty:'No project data is ready for the quick view yet.',summary:'Showing',projects:'featured projects',slow:'The connection looks slow, so search, filters, and source links stay available first. Tap retry to reload project data.'}
};
function fastLang(){try{return localStorage.getItem(FAST_LANG_KEY)==='en'?'en':'zh'}catch{return document.documentElement.lang==='en'?'en':'zh'}}
function fastText(key){return FAST_COPY[fastLang()]?.[key]||FAST_COPY.zh[key]||key}
function fastEscape(value){return String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;')}
function fastSafeUrl(value){const url=String(value||'');return url.startsWith('https://')||url.startsWith('http://')?url:'#'}
function hasPrimaryHomeContent(){
  const cards=document.querySelectorAll('#projectList .project-card:not(.empty)').length;
  const ready=document.querySelector('.map-frame.mvp-leaflet-ready');
  const metric=Number(document.querySelector('#metricProjects')?.textContent||0);
  return cards>0&&metric>0&&ready;
}
function normalizeFastFeatures(features){
  const seen=new Set();
  return (features||[]).filter(feature=>{
    const props=feature?.properties||{};
    const key=String(props.id||[props.source_url,props.name,props.address].join('|')).toLowerCase();
    if(!feature?.geometry||!props.name||seen.has(key))return false;
    seen.add(key);
    return true;
  });
}
function renderFastMetrics(features){
  const metricProjects=document.querySelector('#metricProjects');
  const metricSources=document.querySelector('#metricSources');
  const metricCost=document.querySelector('#metricCost');
  if(metricProjects)metricProjects.textContent=String(features.length);
  if(metricSources)metricSources.textContent=String(new Set(features.map(f=>f.properties?.source_name).filter(Boolean)).size);
  if(metricCost){
    const total=features.reduce((sum,f)=>sum+Number(f.properties?.budget_ntd||0),0);
    metricCost.textContent=total?fastLang()==='en'?`${(total/1e9).toFixed(1)}B`:`${Math.round(total/1e8)}億`:'—';
  }
}
function renderFastList(features){
  const list=document.querySelector('#projectList');
  if(!list)return;
  const items=features.slice(0,FAST_FALLBACK_LIMIT);
  if(!items.length){
    list.innerHTML=`<div class="project-card empty"><h3>${fastEscape(fastText('empty'))}</h3></div>`;
    return;
  }
  list.innerHTML=items.map(feature=>{
    const props=feature.properties||{};
    return `<article class="project-card quick-ready" data-fast-project="${fastEscape(props.id||'')}"><div class="meta-row"><span class="badge status">${fastEscape(props.status||'')}</span><span class="badge">${fastEscape(props.category||'')}</span></div><h3>${fastEscape(props.name)}</h3><p>${fastEscape(props.address||'')}</p><div class="mini-facts"><span>${fastEscape(fastText('owner'))}：${fastEscape(props.owner||'—')}</span><span>${fastEscape(fastText('contractor'))}：${fastEscape(props.contractor||'—')}</span></div><div class="detail-actions"><a href="${fastEscape(fastSafeUrl(props.source_url))}" target="_blank" rel="noopener noreferrer">${fastEscape(props.source_name||fastText('source'))} ↗</a></div></article>`;
  }).join('');
}
function renderFastMapNotice(count){
  const map=document.querySelector('#map');
  const status=document.querySelector('#mapStatus');
  const html=`<article class="map-detail-card fast-home-ready"><h3>${fastEscape(fastText('ready'))}</h3><p>${fastEscape(fastText('summary'))} ${count} ${fastEscape(fastText('projects'))}。</p><div class="detail-actions"><button type="button" data-retry-map>${fastEscape(fastText('retry'))}</button></div></article>`;
  if(map&&!document.querySelector('.map-frame.mvp-leaflet-ready')){
    map.innerHTML=`<div class="mvp-map-loading fast-home-map"><strong>${fastEscape(fastText('loading'))}</strong><button type="button" data-retry-map>${fastEscape(fastText('retry'))}</button></div>`;
  }
  if(status)status.innerHTML=html;
}
function renderFastSlowNotice(){
  const list=document.querySelector('#projectList');
  const map=document.querySelector('#map');
  const status=document.querySelector('#mapStatus');
  const html=`<div class="project-card empty fast-slow"><h3>${fastEscape(fastText('slow'))}</h3><div class="detail-actions"><button type="button" data-retry-map>${fastEscape(fastText('retry'))}</button></div></div>`;
  if(list&&!list.querySelector('.project-card:not(.empty)'))list.innerHTML=html;
  if(map&&!document.querySelector('.map-frame.mvp-leaflet-ready'))map.innerHTML=`<div class="mvp-map-loading fast-home-map"><strong>${fastEscape(fastText('slow'))}</strong><button type="button" data-retry-map>${fastEscape(fastText('retry'))}</button></div>`;
  if(status&&!status.querySelector('.fast-home-ready'))status.innerHTML=`<article class="map-detail-card fast-home-ready"><h3>${fastEscape(fastText('slow'))}</h3><div class="detail-actions"><button type="button" data-retry-map>${fastEscape(fastText('retry'))}</button></div></article>`;
}
function ensureFastStyles(){
  if(document.querySelector('#fast-home-fallback-style'))return;
  const style=document.createElement('style');
  style.id='fast-home-fallback-style';
  style.textContent='.project-card.quick-ready{animation:none}.fast-home-map{z-index:4}.fast-home-map strong{color:#102131;font-size:18px}.fast-home-map button{width:max-content;justify-self:center;padding:10px 14px;border-radius:999px}.fast-slow button{margin-top:8px}@media(max-width:900px){#projectList .project-card.quick-ready:nth-of-type(n+13){display:none}}';
  document.head.append(style);
}
async function fetchFastData(){
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),FAST_FETCH_TIMEOUT_MS);
  try{
    const response=await fetch(FAST_DATA_URL,{cache:'default',signal:controller.signal});
    if(!response.ok)throw new Error('quick data unavailable');
    return response.json();
  }finally{
    clearTimeout(timeout);
  }
}
async function activateFastFallback(){
  if(hasPrimaryHomeContent())return;
  ensureFastStyles();
  try{
    const data=await fetchFastData();
    const features=normalizeFastFeatures(data.features);
    if(hasPrimaryHomeContent())return;
    renderFastMetrics(features);
    renderFastList(features);
    renderFastMapNotice(Math.min(features.length,FAST_FALLBACK_LIMIT));
    document.dispatchEvent(new CustomEvent('taiwan-construction-fast-home-ready',{detail:{count:features.length,limit:FAST_FALLBACK_LIMIT}}));
  }catch(error){
    renderFastSlowNotice();
    console.warn('Fast home fallback used slow-network notice.',error);
  }
}
window.addEventListener('DOMContentLoaded',()=>setTimeout(activateFastFallback,FAST_FALLBACK_DELAY_MS));
setTimeout(activateFastFallback,FAST_FALLBACK_DELAY_MS+900);
