const ACTIVE_CORE_DATASET='./data/active_construction_projects.geojson';
const ACTIVE_DATASET_MANIFEST='./data/active_dataset_manifest.json';
const HOME_FEATURE_LIMIT=220;
const HOME_DATASET_TIME_BUDGET_MS=1800;
const DATASET_FETCH_TIMEOUT_MS=900;
const nativeFetch=window.fetch.bind(window);
const getUrl=input=>typeof input==='string'?input:input?.url||String(input||'');
const cacheBust=url=>`${url}${url.includes('?')?'&':'?'}v=${Date.now()}`;
const withTimeout=(promise,ms)=>new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(new Error('資料載入逾時，先顯示首頁必要資料。')),ms);
  promise.then(value=>{clearTimeout(timer);resolve(value)},error=>{clearTimeout(timer);reject(error)});
});
async function fetchJsonDataset(url,{fresh=false,timeout=DATASET_FETCH_TIMEOUT_MS}={}){
  const target=fresh?cacheBust(url):url;
  const response=await withTimeout(nativeFetch(target,{cache:fresh?'no-cache':'default'}),timeout);
  if(!response.ok)throw new Error(`dataset unavailable: ${url}`);
  const data=await response.json();
  if(data?.type==='FeatureCollection'&&Array.isArray(data.features))return data;
  throw new Error(`dataset format mismatch: ${url}`);
}
function mergeCollections(collections,limit=HOME_FEATURE_LIMIT){
  const seen=new Set();
  const features=[];
  for(const collection of collections){
    for(const feature of collection.features||[]){
      const props=feature?.properties||{};
      const key=[props.source_url,props.name,props.address,props.owner].join('|').trim().toLowerCase()||props.id;
      if(!key||seen.has(key))continue;
      seen.add(key);
      features.push(feature);
      if(features.length>=limit)return features;
    }
  }
  return features;
}
function manifestDatasetUrls(manifest){
  return (manifest?.datasets||[]).map(item=>typeof item==='string'?{url:item,count:0,label:item}:item).filter(item=>item?.url);
}
window.fetch=async function taiwanConstructionMapBatchFetch(input,init={}){
  const url=getUrl(input);
  if(url.includes('active_construction_projects.geojson')){
    const started=performance.now();
    const collections=[];
    let manifest=null;
    try{
      const manifestResponse=await nativeFetch(cacheBust(ACTIVE_DATASET_MANIFEST),{cache:'no-cache'});
      if(manifestResponse.ok)manifest=await manifestResponse.json();
    }catch(e){
      console.warn('Active dataset manifest unavailable; using core dataset only.',e);
    }
    try{
      collections.push(await fetchJsonDataset(ACTIVE_CORE_DATASET,{fresh:true,timeout:1000}));
    }catch(e){
      console.warn('Core active project dataset unavailable.',e);
    }
    const batchItems=manifestDatasetUrls(manifest);
    for(const item of batchItems){
      if(performance.now()-started>HOME_DATASET_TIME_BUDGET_MS)break;
      const currentCount=mergeCollections(collections).length;
      if(currentCount>=HOME_FEATURE_LIMIT)break;
      try{
        collections.push(await fetchJsonDataset(item.url,{timeout:650}));
      }catch(e){
        console.warn('Active project batch skipped for fast home load:',item.url,e);
      }
    }
    const features=mergeCollections(collections);
    const manifestTotal=batchItems.reduce((sum,item)=>sum+Number(item.count||0),0);
    const body=JSON.stringify({
      type:'FeatureCollection',
      name:'taiwan_construction_projects_active_home_budget',
      updated_at:new Date().toISOString().slice(0,10),
      dataset_count:1+batchItems.length,
      home_loaded_count:features.length,
      home_feature_limit:HOME_FEATURE_LIMIT,
      home_time_budget_ms:HOME_DATASET_TIME_BUDGET_MS,
      dataset_total_count:Math.max(features.length,manifestTotal),
      target_active_project_count:3000,
      loading_policy:'首頁先載入輕量現況資料；大量資料以分類、分批或搜尋後載入，維持手機快速可用。',
      features
    });
    return new Response(body,{status:200,headers:{'content-type':'application/geo+json; charset=utf-8'}});
  }
  return nativeFetch(input,init);
};

await import('./basemap-fallback-copy.js');
await import('./app-active.js');
await import('./status-filter-pre-tender.js');
await import('./app-resilience.js');
