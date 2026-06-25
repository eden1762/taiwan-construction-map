// 台灣工程地圖｜Taiwan Construction Map
// 維護原則：只要新增/修改這個檔案，首頁地圖與工程清單會自動更新。
// 座標格式採 Leaflet 慣用的 [緯度, 經度]。
// geometry.type 支援：point、line、polygon。
// confidence 建議填：官方確認、部分確認、待補資料、示範資料。

export const PROJECT_TYPES = {
  public: { label: '公共工程', color: '#2f80ed' },
  transit: { label: '捷運/交通', color: '#f28c28' },
  road: { label: '道路/管線', color: '#1ca678' },
  planning: { label: '規劃/環評', color: '#8b5cf6' },
  building: { label: '建築/民間建案', color: '#0ea5e9' }
};

export const DATA_SOURCES = [
  {
    name: '公共工程雲端服務網',
    fitFor: '施工中公共工程、標案管理、進度、查核紀錄',
    url: 'https://pcic.pcc.gov.tw/',
    note: '適合追工程進度與公共工程標案資料，是公共工程主戰場。'
  },
  {
    name: '政府電子採購網',
    fitFor: '招標、決標、得標廠商、決標金額、履約期限',
    url: 'https://web.pcc.gov.tw/',
    note: '要查誰發包、誰得標、多少錢，通常從這裡開始。'
  },
  {
    name: '全民督工',
    fitFor: '施工中公共工程、民眾通報、缺失追蹤',
    url: 'https://cmdweb.pcc.gov.tw/pccms/owa/cmdmang.userin',
    note: '工程品質與現場狀態的民眾視角，適合補足地面情報。'
  },
  {
    name: '國發會重大公共建設',
    fitFor: '規劃中、核定中、總經費十億以上重大建設',
    url: 'https://www.ndc.gov.tw/Content_List.aspx?n=367921C6BC7A934E',
    note: '還沒開工但已進入重大建設計畫的案子，從這裡抓輪廓。'
  },
  {
    name: '臺北市道路挖掘管理中心',
    fitFor: '台北道路施工、管線挖掘、預定施工路段',
    url: 'https://dig.taipei/',
    note: '道路與管線工程最在地、最即時，台北施工控必看。'
  },
  {
    name: '新北 iRoad 智慧道路管理中心',
    fitFor: '新北申挖、孔蓋、緊急搶修、公共工程、道路工程',
    url: 'https://roadmt.maintenance.ntpc.gov.tw/iROAD/Home/index',
    note: '可從 GIS 圖台看當日或未來預定施工案件。'
  },
  {
    name: '環境部環評書件查詢系統',
    fitFor: '大型開發案、環評審查、會議紀錄、審查結論',
    url: 'https://eiadoc.moenv.gov.tw/',
    note: '工程還沒動工前，環評常先爆雷，也可能先透露路線與基地。'
  },
  {
    name: '全國土地使用分區資料查詢系統',
    fitFor: '都市計畫、非都市土地、國家公園使用分區',
    url: 'https://luz.nlma.gov.tw/web/default.aspx',
    note: '想確認某地是不是道路、公設、工業或住宅用地，可從這裡交叉比對。'
  }
];

export const PROJECTS = [
  {
    id: 'danjiang-bridge',
    name: '淡江大橋及其連絡道路',
    shortName: '淡江大橋',
    type: 'public',
    status: '施工中',
    region: '新北市淡水區、八里區',
    summary: '跨越淡水河口的指標性橋梁工程，採單塔不對稱斜張橋設計，是北海岸交通與景觀的超大級更新。',
    cost: '約新臺幣 212.3 億元（整體計畫，待逐標回填）',
    area: '路廊約 8.5 公里；主橋段約 1.9 公里（概略）',
    owner: '交通部公路局 / 相關工程處（待標案逐筆確認）',
    contractor: '主橋段公開資料常見：工信工程；各標需回查採購網',
    schedule: '分標施工；主橋段 2019 起動工',
    expectedFinish: '公開資料曾列 2026 年完工目標；以主管機關最新公告為準',
    expectedOpen: '待主管機關公告',
    confidence: '部分確認',
    source: 'https://pcic.pcc.gov.tw/',
    geometry: {
      type: 'line',
      coordinates: [
        [25.1707, 121.4075],
        [25.1696, 121.3998],
        [25.1678, 121.3918],
        [25.1658, 121.3836]
      ]
    }
  },
  {
    id: 'kaohsiung-yellow-line',
    name: '高雄捷運黃線｜都會線',
    shortName: '高捷黃線',
    type: 'transit',
    status: '施工中',
    region: '高雄市',
    summary: '高雄捷運路網的關鍵補完，串接鳥松、鳳山、三民、苓雅、前鎮等生活圈，屬大型軌道工程。',
    cost: '約新臺幣 1442.37 億元（綜合規劃核定版本；後續修正請回查官方）',
    area: 'Y 字型路網，約 26 站（概略）',
    owner: '高雄市政府捷運工程局',
    contractor: '多標案分包；土建、機電、軌道需逐標回查政府電子採購網',
    schedule: '2022 起陸續動工；分段施工',
    expectedFinish: '局部/全線時程以高雄市政府最新公告為準',
    expectedOpen: '待官方公告，可能採分段啟用',
    confidence: '部分確認',
    source: 'https://mtbu.kcg.gov.tw/',
    geometry: {
      type: 'line',
      coordinates: [
        [22.7062, 120.3621],
        [22.6748, 120.3546],
        [22.6432, 120.3334],
        [22.6226, 120.3156],
        [22.5962, 120.3141],
        [22.6168, 120.3403],
        [22.6378, 120.3655]
      ]
    }
  },
  {
    id: 'taichung-blue-line',
    name: '臺中捷運藍線第一階段',
    shortName: '中捷藍線',
    type: 'transit',
    status: '規劃/招標準備',
    region: '臺中市',
    summary: '沿臺灣大道串接臺中港、市政府、臺中車站等核心節點，是臺中東西向交通的主幹級工程。',
    cost: '公開討論版本曾見約新臺幣 1615 億元；以核定計畫與最新預算為準',
    area: '第一階段約 24.78 公里，20 站（概略）',
    owner: '臺中市政府 / 交通局及捷運工程相關單位',
    contractor: '待招標/決標後回填',
    schedule: '規劃推動中；工程標案待官方公告',
    expectedFinish: '待官方公告',
    expectedOpen: '待官方公告',
    confidence: '待補資料',
    source: 'https://www.traffic.taichung.gov.tw/',
    geometry: {
      type: 'line',
      coordinates: [
        [24.2607, 120.5268],
        [24.2342, 120.5798],
        [24.1832, 120.6176],
        [24.1612, 120.6460],
        [24.1376, 120.6868],
        [24.1360, 120.6973]
      ]
    }
  },
  {
    id: 'taoyuan-rail-underground',
    name: '桃園鐵路地下化工程',
    shortName: '桃鐵地下化',
    type: 'transit',
    status: '施工中',
    region: '桃園市',
    summary: '桃園都會區鐵路立體化，目標縫合都市南北、改善平交道與車站周邊生活圈。',
    cost: '待逐標回填；請以鐵道局、工程會與採購網為準',
    area: '桃園都會區鐵道路廊（概略線位）',
    owner: '交通部鐵道局 / 桃園市政府相關單位',
    contractor: '多標案分包，需逐標回查政府電子採購網',
    schedule: '分段分標施工',
    expectedFinish: '待主管機關最新公告',
    expectedOpen: '待主管機關公告',
    confidence: '待補資料',
    source: 'https://www.rb.gov.tw/',
    geometry: {
      type: 'line',
      coordinates: [
        [24.9707, 121.2578],
        [24.9897, 121.3133],
        [25.0010, 121.3562],
        [25.0138, 121.3832]
      ]
    }
  },
  {
    id: 'taipei-road-excavation-layer',
    name: '臺北市道路挖掘與管線工程資料層',
    shortName: '台北道路施工',
    type: 'road',
    status: '即時資料源',
    region: '臺北市',
    summary: '台北道路施工與管線挖掘案件可由道路挖掘管理中心查詢；這裡用行政區範圍提示資料來源，不代表單一工程。',
    cost: '依各申挖/施工案件公告',
    area: '臺北市道路與管線施工範圍',
    owner: '臺北市政府工務局及各管線/工程單位',
    contractor: '依各案件公告',
    schedule: '即時/預定施工路段依官方圖台更新',
    expectedFinish: '依各案件公告',
    expectedOpen: '不適用；以道路恢復通行為主',
    confidence: '官方資料源',
    source: 'https://dig.taipei/',
    geometry: {
      type: 'polygon',
      coordinates: [
        [25.1220, 121.4570],
        [25.2100, 121.5600],
        [25.1240, 121.6650],
        [24.9700, 121.6300],
        [24.9600, 121.5000],
        [25.1220, 121.4570]
      ]
    }
  },
  {
    id: 'newtaipei-iroad-layer',
    name: '新北 iRoad 道路/公共工程資料層',
    shortName: '新北 iRoad',
    type: 'road',
    status: '即時資料源',
    region: '新北市',
    summary: '新北市 iRoad 可查申挖、孔蓋、緊急搶修、公共工程、道路工程。這裡標示資料服務範圍，方便從地圖切進官方。',
    cost: '依各案件公告',
    area: '新北市道路與公共工程範圍',
    owner: '新北市政府養護工程處及相關單位',
    contractor: '依各案件公告',
    schedule: '當日或未來預定施工案件依 GIS 圖台更新',
    expectedFinish: '依各案件公告',
    expectedOpen: '不適用；以道路恢復與工程驗收為主',
    confidence: '官方資料源',
    source: 'https://roadmt.maintenance.ntpc.gov.tw/iROAD/Home/index',
    geometry: {
      type: 'polygon',
      coordinates: [
        [25.305, 121.330],
        [25.300, 122.005],
        [24.705, 121.950],
        [24.720, 121.250],
        [25.305, 121.330]
      ]
    }
  },
  {
    id: 'eia-major-project-layer',
    name: '大型開發案環評資料層',
    shortName: '環評資料層',
    type: 'planning',
    status: '規劃/審查資料源',
    region: '全台灣',
    summary: '大型開發案、園區、能源、交通建設常在開工前進入環評；這層提醒使用者：工程地圖不只看施工，也要看審查前哨站。',
    cost: '依各開發案書件',
    area: '依各開發案基地或路廊',
    owner: '各開發單位 / 目的事業主管機關',
    contractor: '規劃階段多未定；施工標案後續回填',
    schedule: '環評審查、補件、通過、備查等階段',
    expectedFinish: '依各開發計畫',
    expectedOpen: '依各開發計畫',
    confidence: '官方資料源',
    source: 'https://eiadoc.moenv.gov.tw/',
    geometry: {
      type: 'point',
      coordinates: [23.6978, 120.9605]
    }
  },
  {
    id: 'building-permit-layer',
    name: '縣市建管與建築執照資料層',
    shortName: '建管資料層',
    type: 'building',
    status: '資料源',
    region: '各縣市',
    summary: '民間住宅、商辦、廠房等工程通常要查建照、施工進度、使用執照；此層提供建管資料的入口概念。',
    cost: '工程造價依建照資料；不等於總銷或總投資',
    area: '依基地地號/建築地址',
    owner: '起造人 / 建商 / 業主',
    contractor: '承造人依建照揭露',
    schedule: '建照核發、開工申報、施工進度、使照核發',
    expectedFinish: '依建照與施工進度',
    expectedOpen: '依使用執照/營運公告',
    confidence: '官方資料源',
    source: 'https://tccmoapply.dba.tcg.gov.tw/',
    geometry: {
      type: 'point',
      coordinates: [24.1477, 120.6736]
    }
  }
];
