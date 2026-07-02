# 台灣工程地圖｜Taiwan Construction Map

台灣工程地圖是一個可直接部署的靜態網站，主題是把台灣各地可回查的現況工程整理成互動地圖、工程圖層與資料入口。

網站面向工程公司、發包甲方、地理地圖愛好者與年輕使用者，重點是快速看懂工程位置、狀態、甲方、乙方、金額、期程與公開來源。

## 現況頁面

- `index.html`：全國工程概況與五大圖層入口。
- `category.html`：依工程圖層檢視工程點位與清單。
- `sources.html`：公開來源類型、收錄規則與引用提醒。
- `fast-map.js`：地圖、篩選、語系、清單與互動邏輯。
- `fast-map.css`：手機優先的全站樣式。
- `data/active_construction_projects.geojson`：首頁與分類頁使用的 active 工程資料。

## 資料分區

- `active`：只放現況有效、來源可回查、不重複，且適合顯示在首頁的工程。
- `candidate`：來源、欄位或 geometry 尚未補齊的候選工程，不混入首頁 active。
- `historical / excluded`：已完工超過 active 規則、取消、停辦、重複、來源失效或主題不符的資料。
- `batch log`：保存每批候選、通過、排除與查核備註，供後續追蹤。

## Active 工程基本欄位

每筆 active 工程至少應包含：

```json
{
  "id": "tcmap-unique-id",
  "name": "工程名稱",
  "category": "公共工程 / 道路/管線 / 捷運/交通 / 建築/園區 / 規劃/環評",
  "status": "計畫中 / 計劃中 / 評估中 / 設計中 / 施工中 / 完工或啟用一個月內",
  "owner": "發包甲方或主管機關",
  "contractor": "施工方或待補資料",
  "budget_ntd": 0,
  "start_date": "YYYY-MM-DD",
  "planned_end_date": "YYYY-MM-DD",
  "address": "工程位置或路廊描述",
  "source_name": "公開來源名稱",
  "source_url": "https://...",
  "updated_at": "YYYY-MM-DD",
  "geometry": {
    "type": "Point",
    "coordinates": [121.0, 25.0]
  }
}
```

GeoJSON 座標順序使用 `[longitude, latitude]`。能確認路廊或範圍時，優先使用 `LineString`、`MultiLineString`、`Polygon` 或 `MultiPolygon`；只有點位時才使用 `Point`。

## 收錄規則

Active 首頁資料只保留：

- 計畫中／計劃中
- 評估中
- 設計中
- 施工中
- 完工或啟用一個月內

以下資料不得混入 active：

- 已完工或啟用超過 active 規則範圍
- 取消、停辦、停止推動
- 來源失效或無法查證
- 工程主題不符
- 高度重複資料
- 欄位或 geometry 尚未補齊的候選資料

## 優先資料來源

資料應輪替查核，不長期依賴單一來源：

- 公共工程委員會、政府電子採購、公共工程雲端服務
- 各縣市政府工程與建設局處
- 捷運、鐵道、公路、道路工程主管機關
- 水利、防災、港灣、機場主管機關
- 產業園區、科學園區、航空城公開資料
- 環評、都市計畫、建照、使照公開資料
- 道路挖掘、管線施工、data.gov.tw 與其他可靠公開資料

## 本機預覽

```bash
python3 -m http.server 5173
```

瀏覽 `http://localhost:5173`。

## 部署

本專案維持靜態檔案架構，不需要 build output，也不要建立重複部署子資料夾。部署根目錄指向此 repository 根目錄即可。

## 靈感備註

部分資料視覺與城市脈動整理方式可參考 mini-taiwan-pulse；公開網站文案不使用內部專案或實驗名稱。
