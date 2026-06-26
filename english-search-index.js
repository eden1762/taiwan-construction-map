import { PROJECTS } from './data/projects.js';

const PROJECT_SEARCH_ALIASES = {
  'danjiang-bridge': ['Tamkang Bridge', 'Danjiang Bridge', 'Tamsui Bali bridge', 'approach roads', 'bridge construction'],
  'kaohsiung-yellow-line': ['Kaohsiung MRT Yellow Line', 'KMRT Yellow Line', 'metro construction', 'rail transit'],
  'taipei-wanda-line': ['Taipei MRT Wanda Line', 'Wanda Line', 'metro construction', 'rail transit'],
  'taipei-circular-north-south': ['Taipei MRT Circular Line north south sections', 'Circular Line N S', 'metro construction'],
  'newtaipei-sanying-line': ['New Taipei Metro Sanying Line', 'Sanying Line', 'Sanxia Yingge metro'],
  'taoyuan-green-line': ['Taoyuan MRT Green Line', 'Taoyuan Green Line', 'metro construction'],
  'taichung-blue-line': ['Taichung MRT Blue Line', 'Taichung Blue Line', 'metro planning'],
  'taichung-green-extension': ['Taichung MRT Green Line extension', 'Dakeng extension', 'Changhua extension'],
  'taoyuan-rail-underground': ['Taoyuan railway underground project', 'rail undergrounding', 'railway construction'],
  'tainan-rail-underground': ['Tainan railway underground project', 'rail undergrounding', 'railway construction'],
  'chiayi-rail-elevated': ['Chiayi railway elevation project', 'elevated railway', 'railway construction'],
  'hualien-taitung-double-track': ['Hualien Taitung railway double tracking', 'Eastern Taiwan rail upgrade'],
  'taoyuan-airport-terminal-3': ['Taoyuan International Airport Terminal 3', 'airport terminal', 'aviation construction'],
  'keelung-mrt': ['Keelung MRT', 'Keelung Xizhi Nangang corridor', 'metro planning'],
  'tainan-mrt-blue-line': ['Tainan MRT Blue Line', 'Tainan Blue Line', 'metro planning'],
  'taoyuan-aerotropolis': ['Taoyuan Aerotropolis', 'airport city', 'land development', 'public facilities'],
  'qiaotou-science-park': ['Qiaotou Science Park', 'Kaohsiung science park', 'park infrastructure'],
  'shalun-green-energy': ['Shalun Green Energy Science City', 'green energy', 'science city infrastructure'],
  'freeway-project-layer': ['freeway widening', 'interchange works', 'bridge works', 'Freeway Bureau'],
  'national-route-7-layer': ['Kaohsiung National Route 7', 'Route 7', 'freeway planning', 'EIA'],
  'thb-roadworks-layer': ['Highway Bureau work zones', 'provincial road works', 'bridge tunnel works'],
  'taipei-road-excavation-layer': ['Taipei road excavation', 'Taipei utility works', 'road works'],
  'newtaipei-iroad-layer': ['New Taipei iRoad', 'New Taipei road works', 'public works'],
  'taoyuan-road-dig-layer': ['Taoyuan road excavation', 'Taoyuan utility works', 'road works'],
  'taichung-road-open-data-layer': ['Taichung road excavation', 'Taichung work zones', 'road works'],
  'tainan-roadworks-layer': ['Tainan road works', 'road maintenance', 'utility works'],
  'kaohsiung-roadworks-layer': ['Kaohsiung road works', 'road excavation', 'maintenance works'],
  'eia-major-project-layer': ['EIA major development projects', 'environmental impact assessment', 'review documents'],
  'ndc-major-project-layer': ['NDC major public construction', 'annual budget', 'national development'],
  'building-permit-layer': ['building permits', 'construction permits', 'occupancy permits'],
  'taipei-building-permit-layer': ['Taipei building permits', 'construction progress', 'building projects'],
  'newtaipei-building-permit-layer': ['New Taipei building permits', 'occupancy permits', 'presale progress'],
  'science-park-layer': ['science park infrastructure', 'plants', 'public facilities'],
  'social-housing-layer': ['social housing projects', 'public housing', 'new build'],
  'water-resource-layer': ['water infrastructure', 'reservoir', 'flood control', 'river improvement'],
  'power-grid-layer': ['power grid', 'substation', 'renewable energy', 'transmission line'],
  'lng-terminal-layer': ['LNG terminal', 'storage tank', 'pipeline project', 'natural gas'],
  'port-construction-layer': ['port infrastructure', 'fairway', 'wharf', 'harbor construction'],
  'industrial-park-layer': ['industrial park infrastructure', 'drainage', 'public facilities']
};

const TYPE_KEYWORDS = {
  public: ['public works', 'civil engineering', 'infrastructure'],
  transit: ['transportation', 'transit', 'MRT', 'railway', 'road corridor'],
  road: ['road works', 'utility works', 'excavation', 'traffic control'],
  planning: ['planning', 'tender preparation', 'EIA', 'budget review'],
  building: ['building', 'campus', 'science park', 'land development'],
  energy: ['water', 'energy', 'port', 'harbor', 'power', 'LNG']
};

const STATUS_KEYWORDS = {
  '施工中': ['under construction', 'construction in progress', 'active work zone'],
  '規劃/招標準備': ['planning', 'tender preparation', 'pre tender'],
  '規劃/審查資料源': ['planning', 'review source', 'approval review'],
  '規劃/預算資料源': ['planning', 'budget source', 'annual budget'],
  '規劃/施工並行': ['planning and staged construction', 'phased works'],
  '規劃/環評資料源': ['planning', 'EIA source', 'environmental impact assessment'],
  '即時資料源': ['live data source', 'real time work zones'],
  '資料源': ['data source', 'reference layer']
};

PROJECTS.forEach(project => {
  const tags = new Set(project.tags || []);
  [...(PROJECT_SEARCH_ALIASES[project.id] || []), ...(TYPE_KEYWORDS[project.type] || []), ...(STATUS_KEYWORDS[project.status] || [])]
    .filter(Boolean)
    .forEach(tag => tags.add(tag));
  project.tags = [...tags];
});
