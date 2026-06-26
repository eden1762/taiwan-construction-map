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
  'science-park-layer': ['Science park roads, plants, and public-facility data layer', 'Science parks']
};

function englishMode() {
  return document.documentElement.lang === 'en';
}

function applyEnglishProjectNames() {
  if (!englishMode()) return;

  document.querySelectorAll('.project-card[data-project-id]').forEach(card => {
    const names = PROJECT_NAME_EN[card.dataset.projectId];
    if (!names) return;
    const title = card.querySelector('h3');
    if (title) title.textContent = names[0];
  });

  document.querySelectorAll('#map [data-project-id]').forEach(item => {
    const names = PROJECT_NAME_EN[item.dataset.projectId];
    if (!names) return;
    const label = item.querySelector('text');
    const title = item.querySelector('title');
    if (label) label.textContent = names[1] || names[0];
    if (title) title.textContent = `${names[1] || names[0]}｜${title.textContent.split('｜').pop() || 'Project status'}`;
  });

  const activeId = document.querySelector('.project-card.active[data-project-id]')?.dataset.projectId;
  const detailTitle = document.querySelector('.map-detail-card h3');
  if (activeId && detailTitle && PROJECT_NAME_EN[activeId]) {
    detailTitle.textContent = PROJECT_NAME_EN[activeId][0];
  }
}

applyEnglishProjectNames();
new MutationObserver(() => window.requestAnimationFrame(applyEnglishProjectNames)).observe(document.documentElement, {
  subtree: true,
  childList: true,
  characterData: true,
  attributes: true,
  attributeFilter: ['lang', 'class']
});
