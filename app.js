const ACTIVE_CORE_DATASET='./data/active_construction_projects.geojson';
const ACTIVE_DATASET_MANIFEST='./data/active_dataset_manifest.json';
const nativeFetch=window.fetch.bind(window);
const getUrl=input=>typeof input==='string'?input:input?.url||String(input||'');
const cacheBust=url=>`${url}${url.includes('?')?'&':'?'}v=${Date.now()}`;

window.fetch=async function taiwanConstructionMapBatchFetch(input,init={}){
  const url=getUrl(input);
  if(url.includes('active_construction_projects.geojson')){
    const collections=[];
    const datasetUrls=[ACTIVE_CORE_DATASET];
    try{
      const manifestResponse=await nativeFetch(cacheBust(ACTIVE_DATASET_MANIFEST),{cache:'no-store'});
      if(manifestResponse.ok){
        const manifest=await manifestResponse.json();
        const batchUrls=(manifest.datasets||[]).map(item=>typeof item==='string'?item:item?.url).filter(Boolean);
        datasetUrls.push(...batchUrls);
      }
    }catch(e){
      console.warn('Active dataset manifest unavailable; using core dataset only.',e);
    }
    for(const datasetUrl of datasetUrls){
      try{
        const response=await nativeFetch(cacheBust(datasetUrl),{cache:'no-store'});
        if(response.ok){
          const data=await response.json();
          if(data?.type==='FeatureCollection'&&Array.isArray(data.features))collections.push(data);
        }
      }catch(e){
        console.warn('Active project dataset unavailable:',datasetUrl,e);
      }
    }
    const seen=new Set();
    const features=[];
    for(const collection of collections){
      for(const feature of collection.features||[]){
        const props=feature?.properties||{};
        const key=[props.source_url,props.name,props.address,props.owner].join('|').trim().toLowerCase()||props.id;
        if(!key||seen.has(key))continue;
        seen.add(key);
        features.push(feature);
      }
    }
    const body=JSON.stringify({type:'FeatureCollection',name:'taiwan_construction_projects_active_merged',updated_at:new Date().toISOString().slice(0,10),dataset_count:datasetUrls.length,target_active_project_count:3000,features});
    return new Response(body,{status:200,headers:{'content-type':'application/geo+json; charset=utf-8'}});
  }
  return nativeFetch(input,init);
};

await import('./app-active.js');
