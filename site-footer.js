const FOOTER_COPY={zh:'工程資訊為範例資料；正式引用請回各主管機關、採購、工程、建管、環評與地方圖台確認最新公告。',en:'Project data is sample data. For official use, verify the latest notices from competent authorities and source portals.'};
const META_COPY={zh:'台灣工程地圖：互動台灣地圖、工程點位、圖層開關、搜尋、狀態篩選、工程卡片與手機底部滑出卡片。',en:'Taiwan Construction Map with an interactive map, project points, layer toggles, search, status filters, project cards, and mobile bottom sheets.'};
let queued=false;
function lang(){return document.documentElement.lang?.toLowerCase().startsWith('en')?'en':'zh'}
function sync(){queued=false;const l=lang();const f=document.querySelector('[data-i18n="footerText"]');const m=document.querySelector('meta[name="description"]');if(f&&f.textContent!==FOOTER_COPY[l])f.textContent=FOOTER_COPY[l];if(m&&m.content!==META_COPY[l])m.content=META_COPY[l]}
function queue(){if(queued)return;queued=true;requestAnimationFrame(sync)}
new MutationObserver(queue).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
sync();
