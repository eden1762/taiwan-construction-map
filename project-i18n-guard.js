const PROJECT_NAME_EN = {
  'danjiang-bridge': ['Tamkang Bridge and approach roads', 'Tamkang Bridge'],
  'kaohsiung-yellow-line': ['Kaohsiung MRT Yellow Line', 'Kaohsiung Yellow Line'],
  'taipei-wanda-line': ['Taipei MRT Wanda Line Phase 1', 'Wanda Line'],
  'taipei-circular-north-south': ['Taipei MRT Circular Line North and South Sections', 'Circular Line N/S'],
  'newtaipei-sanying-line': ['New Taipei Metro Sanying Line', 'Sanying Line'],
  'taoyuan-green-line': ['Taoyuan MRT Green Line', 'Taoyuan Green Line'],
  'taichung-blue-line': ['Taichung MRT Blue Line Phase 1', 'Taichung Blue Line'],
  'taichung-green-extension': ['Taichung MRT Green Line Extension data layer', 'Taichung Green Extension'],
  'taoyuan-rail-underground': ['Taoyuan Railway Underground Project', 'Taoyuan Rail Undergrounding'],
  'tainan-rail-underground': ['Tainan Urban Railway Underground Project', 'Tainan Rail Undergrounding'],
  'chiayi-rail-elevated': ['Chiayi Urban Railway Elevation Project', 'Chiayi Rail Elevation'],
  'hualien-taitung-double-track': ['Hualien–Taitung Railway Double-Tracking data layer', 'Hualien–Taitung Rail Upgrade'],
  'taoyuan-airport-terminal-3': ['Taoyuan International Airport Terminal 3', 'Airport Terminal 3'],
  'keelung-mrt': ['Keelung MRT planning data layer', 'Keelung MRT'],
  'tainan-mrt-blue-line': ['Tainan MRT Phase 1 Blue Line data layer', 'Tainan Blue Line'],
  'taoyuan-aerotropolis': ['Taoyuan Aerotropolis public works', 'Taoyuan Aerotropolis'],
  'qiaotou-science-park': ['Qiaotou Science Park public-facility data layer', 'Qiaotou Science Park'],
  'shalun-green-energy': ['Shalun Smart Green Energy Science City data layer', 'Shalun Green Energy'],
  'freeway-project-layer': ['Freeway widening, interchange, and bridge works data layer', 'Freeway projects'],
  'national-route-7-layer': ['Kaohsiung National Route 7 planning data layer', 'National Route 7'],
  'thb-roadworks-layer': ['Highway Bureau work zones and provincial-road data layer', 'Highway work zones'],
  'taipei-road-excavation-layer': ['Taipei road excavation and utility-works data layer', 'Taipei road works'],
  'newtaipei-iroad-layer': ['New Taipei iRoad road / public-works data layer', 'New Taipei iRoad'],
  'taoyuan-road-dig-layer': ['Taoyuan road excavation and utility-works data layer', 'Taoyuan road works'],
  'taichung-road-open-data-layer': ['Taichung road excavation and work-zone data layer', 'Taichung road works'],
  'tainan-roadworks-layer': ['Tainan road works and maintenance data layer', 'Tainan road works'],
  'kaohsiung-roadworks-layer': ['Kaohsiung road excavation, maintenance, and new-construction data layer', 'Kaohsiung road works'],
  'eia-major-project-layer': ['Major development EIA data layer', 'EIA data layer'],
  'ndc-major-project-layer': ['NDC major public-works and annual-budget data layer', 'Major projects'],
  'building-permit-layer': ['City and county building-permit data layer', 'Building permits'],
  'taipei-building-permit-layer': ['Taipei building permits and construction-progress data layer', 'Taipei building permits'],
  'newtaipei-building-permit-layer': ['New Taipei building permits, occupancy permits, and presale-progress data layer', 'New Taipei building permits'],
  'science-park-layer': ['Science park roads, plants, and public-facility data layer', 'Science parks'],
  'social-housing-layer': ['Social housing new-build project data layer', 'Social housing projects'],
  'water-resource-layer': ['Reservoir, flood-control, and river-improvement data layer', 'Water infrastructure'],
  'power-grid-layer': ['Power grid, substation, and renewable-energy project data layer', 'Power infrastructure'],
  'lng-terminal-layer': ['LNG terminal, storage tank, and pipeline project data layer', 'LNG infrastructure'],
  'port-construction-layer': ['Port, fairway, and wharf project data layer', 'Port infrastructure'],
  'industrial-park-layer': ['Industrial park roads, drainage, and public-facility data layer', 'Industrial parks']
};

const PROJECT_FIELD_TRANSLATIONS = [
  ['部分確認', 'Partly verified'],
  ['待補資料', 'To be verified'],
  ['待官方資料回填', 'To be verified'],
  ['待主管機關公告', 'To be announced by the competent authority'],
  ['待官方公告', 'To be announced by the authority'],
  ['待標案與核定資料確認', 'To be verified through tender and approval records'],
  ['待招標決標後回填', 'To be updated after tender award'],
  ['待工程標案公告', 'Pending construction tender notice'],
  ['以官方最新工程進度為準', 'Use the latest official project progress as the source of truth'],
  ['以主管機關最新公告為準', 'Use the latest competent-authority notice as the source of truth'],
  ['以公路局與工程會最新公告為準', 'Verify with the latest Highway Bureau and PCC notices'],
  ['詳日請以標案與主管機關公告為準', 'Exact date to be verified from tender records and authority notices'],
  ['詳日請以捷運工程局公告為準', 'Exact date to be verified from MRT project-office notices'],
  ['詳日請以新北捷運局公告為準', 'Exact date to be verified from New Taipei MRT notices'],
  ['詳日請以桃園捷運工程局公告為準', 'Exact date to be verified from Taoyuan MRT project-office notices'],
  ['詳日請以鐵道局公告為準', 'Exact date to be verified from Railway Bureau notices'],
  ['分段分標施工中', 'Under staged construction by contract package'],
  ['分標施工中', 'Under construction by contract package'],
  ['已陸續動工', 'Construction has started in stages'],
  ['已施工', 'Under construction'],
  ['已動工', 'Construction started'],
  ['施工中', 'Under construction'],
  ['規劃/招標準備', 'Planning / tender preparation'],
  ['規劃/審查資料源', 'Planning / review data layer'],
  ['規劃/預算資料源', 'Planning / budget data layer'],
  ['規劃/施工並行', 'Planning and staged construction'],
  ['規劃/環評資料源', 'Planning / EIA data layer'],
  ['即時資料源', 'Live data layer'],
  ['資料源', 'Data layer'],
  ['官方資料源', 'Official data source'],
  ['概略標示', 'approximate alignment shown'],
  ['概略走廊', 'approximate corridor'],
  ['概略路廊', 'approximate corridor'],
  ['概略範圍', 'approximate area'],
  ['路廊', 'corridor'],
  ['施工範圍', 'work area'],
  ['資料來源', 'source'],
  ['公共工程雲端服務網', 'Public Construction Cloud Service'],
  ['政府電子採購網', 'Government e-Procurement System'],
  ['交通部公路局', 'Highway Bureau, MOTC'],
  ['公路局', 'Highway Bureau'],
  ['高雄市政府捷運工程局', 'Kaohsiung Mass Rapid Transit Bureau'],
  ['臺北市政府捷運工程局', 'Taipei Department of Rapid Transit Systems'],
  ['新北市政府捷運工程局', 'New Taipei Department of Rapid Transit Systems'],
  ['桃園市政府捷運工程局', 'Taoyuan Department of Rapid Transit Systems'],
  ['臺中市交通局', 'Taichung Transportation Bureau'],
  ['臺南市政府交通局', 'Tainan Transportation Bureau'],
  ['交通部鐵道局', 'Railway Bureau, MOTC'],
  ['交通部高速公路局', 'Freeway Bureau, MOTC'],
  ['高速公路局', 'Freeway Bureau'],
  ['交通部航港局', 'Maritime and Port Bureau, MOTC'],
  ['臺灣港務公司', 'Taiwan International Ports Corporation'],
  ['經濟部水利署', 'Water Resources Agency, MOEA'],
  ['台灣電力公司', 'Taiwan Power Company'],
  ['台灣中油', 'CPC Corporation, Taiwan'],
  ['經濟部產業園區管理局', 'Industrial Park Administration, MOEA'],
  ['國發會重大公共建設', 'NDC major public construction plans'],
  ['環評', 'EIA'],
  ['捷運', 'MRT'],
  ['鐵路', 'railway'],
  ['橋梁', 'bridge'],
  ['道路', 'road'],
  ['管線', 'utilities'],
  ['建照', 'building permits'],
  ['甲方', 'owner'],
  ['乙方', 'contractor'],
  ['廠商', 'contractor'],
  ['新北市', 'New Taipei City'],
  ['臺北市', 'Taipei City'],
  ['台北市', 'Taipei City'],
  ['桃園市', 'Taoyuan City'],
  ['臺中市', 'Taichung City'],
  ['台中市', 'Taichung City'],
  ['臺南市', 'Tainan City'],
  ['台南市', 'Tainan City'],
  ['高雄市', 'Kaohsiung City'],
  ['嘉義市', 'Chiayi City'],
  ['花蓮縣', 'Hualien County'],
  ['臺東縣', 'Taitung County'],
  ['台灣', 'Taiwan'],
  ['全台灣', 'Taiwan'],
  ['全台', 'Taiwan-wide'],
  ['新北', 'New Taipei'],
  ['高雄', 'Kaohsiung'],
  ['臺中', 'Taichung'],
  ['台中', 'Taichung'],
  ['臺南', 'Tainan'],
  ['台南', 'Tainan'],
  ['桃園', 'Taoyuan'],
  ['嘉義', 'Chiayi'],
  ['淡水', 'Tamsui'],
  ['八里', 'Bali'],
  ['土城', 'Tucheng'],
  ['三峽', 'Sanxia'],
  ['鶯歌', 'Yingge'],
  ['鳥松', 'Niaosong'],
  ['鳳山', 'Fengshan'],
  ['三民', 'Sanmin'],
  ['苓雅', 'Lingya'],
  ['前鎮', 'Qianzhen'],
  ['中正', 'Zhongzheng'],
  ['萬華', 'Wanhua'],
  ['中和', 'Zhonghe'],
  ['士林', 'Shilin'],
  ['內湖', 'Neihu'],
  ['文山', 'Wenshan'],
  ['八德', 'Bade'],
  ['蘆竹', 'Luzhu'],
  ['大園', 'Dayuan'],
  ['歸仁', 'Guiren'],
  ['基隆', 'Keelung'],
  ['汐止', 'Xizhi'],
  ['南港', 'Nangang'],
  ['中正紀念堂', 'Chiang Kai-shek Memorial Hall']
];

function englishMode() {
  return document.documentElement.lang === 'en';
}

function translateFieldText(value) {
  if (!value) return value;
  let text = String(value);
  PROJECT_FIELD_TRANSLATIONS.forEach(([zh, en]) => {
    text = text.split(zh).join(en);
  });
  return text;
}

function replaceTextContent(node) {
  if (!node) return;
  node.textContent = translateFieldText(node.textContent);
}

function applyEnglishProjectNames() {
  if (!englishMode()) return;

  document.querySelectorAll('.project-card[data-project-id]').forEach(card => {
    const names = PROJECT_NAME_EN[card.dataset.projectId];
    if (names) {
      const title = card.querySelector('h3');
      if (title) title.textContent = names[0];
    }
    card.querySelectorAll('p, .mini-facts span, .badge').forEach(replaceTextContent);
  });

  document.querySelectorAll('#map [data-project-id]').forEach(item => {
    const names = PROJECT_NAME_EN[item.dataset.projectId];
    if (!names) return;
    const label = item.querySelector('text');
    const title = item.querySelector('title');
    if (label) label.textContent = names[1] || names[0];
    if (title) title.textContent = `${names[1] || names[0]}｜${translateFieldText(title.textContent.split('｜').pop() || 'Project status')}`;
  });

  const activeId = document.querySelector('.project-card.active[data-project-id]')?.dataset.projectId;
  const detailTitle = document.querySelector('.map-detail-card h3');
  if (activeId && detailTitle && PROJECT_NAME_EN[activeId]) {
    detailTitle.textContent = PROJECT_NAME_EN[activeId][0];
  }
  document.querySelectorAll('.map-detail-card p, .map-detail-card dd, .map-detail-card .badge').forEach(replaceTextContent);
}

applyEnglishProjectNames();
new MutationObserver(() => window.requestAnimationFrame(applyEnglishProjectNames)).observe(document.documentElement, {
  subtree: true,
  childList: true,
  characterData: true,
  attributes: true,
  attributeFilter: ['lang', 'class']
});
