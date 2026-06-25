# 台灣工程地圖｜Taiwan Construction Map

一個可直接部署到 Vercel 的靜態網站。首頁使用 OpenStreetMap / Leaflet 顯示台灣工程位置、範圍、發包甲方、施工廠商、成本、工期、預計完工日與啟用日。

## 設計原則

- 第一性原則：工程資訊拆成「位置、時間、金額、責任單位」。
- 單一來源：只有 `index.html` 一頁，不複製多份頁面。
- 單一資料檔：新增工程只改 `data/projects.js`。
- 不 build 到 `dist`：Vercel 直接部署根目錄。
- 手機優先：地圖、篩選、工程卡片都支援小螢幕。
- 維護友善：Vanilla JS + JSDoc 風格資料結構，偏 Microsoft 生態可日後改成 TypeScript，但目前避免 build 流程。

## 檔案結構

```text
index.html          # 唯一頁面
styles.css          # 全站樣式
app.js              # 地圖、篩選、互動邏輯
data/projects.js    # 工程與資料源，維護重點
vercel.json         # Vercel 靜態部署設定
package.json        # 本機啟動指令，不需要 build
```

## 新增工程資料

打開 `data/projects.js`，在 `PROJECTS` 陣列新增一筆：

```js
{
  id: 'unique-project-id',
  name: '工程名稱',
  shortName: '短名',
  type: 'public', // public / transit / road / planning / building
  status: '施工中',
  region: '縣市與行政區',
  summary: '一句話說明',
  cost: '新臺幣 ...',
  area: '工程長度、面積或基地範圍',
  owner: '發包甲方',
  contractor: '施工廠商',
  schedule: '工期',
  expectedFinish: '預計完工日',
  expectedOpen: '預計啟用日',
  confidence: '官方確認',
  source: 'https://...',
  geometry: {
    type: 'line',
    coordinates: [[25.0, 121.5], [25.1, 121.6]]
  }
}
```

## 座標類型

- `point`：單點工程，例如建案、資料源入口。
- `line`：道路、橋梁、捷運、鐵路路廊。
- `polygon`：基地、行政區、施工範圍。

## 重要資料源

- 公共工程雲端服務網：公共工程進度、標案管理、查核。
- 政府電子採購網：招標、決標、得標廠商、決標金額。
- 全民督工：施工中公共工程與民眾通報。
- 國發會重大公共建設：規劃與核定中的大型公共建設。
- 縣市道路挖掘平台：道路與管線施工資訊。
- 縣市建管系統：建照、承造人、施工進度、使照。
- 環境部環評書件查詢系統：大型開發案與審查紀錄。
- 全國土地使用分區資料查詢系統：都市計畫與土地使用分區。

## 本機預覽

```bash
cd taiwan-construction-map
python3 -m http.server 5173
```

瀏覽 `http://localhost:5173`。

## 部署到 Vercel

把這個資料夾設為 Vercel 專案根目錄，直接部署即可。不要設定 build output，也不要產生 dist。
