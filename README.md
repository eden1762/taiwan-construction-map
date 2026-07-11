# 台灣工程地圖｜Taiwan Construction Map

台灣工程地圖是一個可直接部署的靜態網站，主題是把台灣各地可回查的現況工程整理成互動地圖、工程圖層與資料入口。

網站面向工程公司、發包甲方、地理地圖愛好者與年輕使用者，重點是快速看懂工程位置、狀態、甲方、乙方、金額、期程與公開來源。

## 現況頁面與單一來源

正式網站只使用一套共用來源，避免維護時改到重複版本：

- `index.html`：全國工程概況與五大圖層入口。
- `category.html`：五大工程圖層共用頁，透過網址參數切換，不複製五份頁面。
- `sources.html`：公開來源類型、收錄規則與引用提醒。
- `site-shell.js`：全站唯一的商標、導覽、頁尾與語言切換外框。
- `fast-map.js`：全站唯一的地圖、篩選、語系、清單與互動邏輯。
- `fast-map.css`：全站唯一的手機優先樣式。
- `data/active_construction_projects.geojson`：首頁與分類頁共用的 active 工程資料。
- `Content/Taiwan_Construction.PNG`：全站唯一商標圖檔。

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

## 維護原則

- 商標只使用 `Content/Taiwan_Construction.PNG`。
- 公開頁面文案使用工程公司、發包甲方、地理地圖愛好者與年輕人容易理解的工程用語。
- 公開頁面不放內部維護術語或與使用者無關的技術說明。
- 手機優先，觸控按鈕保持好按，工程清單在地圖背景較慢時仍可先查。
- 不建立重複部署子資料夾，也不複製五份分類頁。

## 本機預覽

```bash
python3 -m http.server 5173
```

瀏覽 `http://localhost:5173`。

## 部署

本專案維持靜態檔案架構，不需要 build output。部署根目錄指向 repository 根目錄即可。
