---
name: cathay-workspace-scanner
description: "Use when: 需要在產製前掃描並理解現有專案架構，包含路由設定、側邊欄選單、共用元件清單、Views 資料夾結構與命名慣例。觸發詞：掃描專案架構、了解現有路由、查看現有頁面結構、架構理解、workspace scan、project scan。"
version: "1.1.0"
id: "cathay-workspace-scanner.skill"
author: "張立賢"
type: "skill"
lvl: "feature"
bundle: "CathayBoostFrontendVue"
tag: ["skill", "workspace", "scanner", "architecture", "router", "frontend", "vue"]
created_date: "2026-05-18"
last_modified: "2026-07-01"
---

# Cathay Workspace Scanner

## 用途

在產製新頁面或功能前，掃描現有專案架構，確保：
1. 新頁面路由不與現有路由衝突或重複
2. 新檔案放置於正確位置並符合命名慣例
3. 共用元件不被誤改（配合 `shared-components-protection` instruction）
4. Route 與 NavCollection 設定正確反映在產製計畫中

## 掃描步驟

### Step 1：定位路由設定檔

嘗試以下路徑（擇一存在者）：
- `src/router/router.js`
- `src/router/index.js`

讀取並提取：
- 現有路由列表（`path`、`name`、`component`）
- 路由結構模式（巢狀 children / 平層）
- 業務模組前綴（例如：`/ins/`、`/cust/`、`/claim/`）

### Step 2：定位側邊欄選單

嘗試以下路徑（擇一存在者）：
- `src/service/NavCollection.js`
- `src/service/nav.js`

讀取並提取：
- 現有選單項目與分組名稱
- 每個選單項目對應的 route name 或 path

### Step 3：掃描 Views 資料夾結構

掃描 `src/views/` 資料夾（僅第一層及第二層），提取：
- 現有業務模組資料夾清單
- 各資料夾內的 `.vue` 檔案命名模式
- 常見命名規則（例如：`{模組代碼}{序號}.vue`、`{功能名稱}Page.vue`）

### Step 4：掃描共用元件

掃描 `src/components/common/` 資料夾，列出：
- 現有共用元件清單（`*.vue` 檔案）
- 各元件的 `defineProps` 介面（若可讀取）

### Step 5：掃描共用工具

掃描 `src/assets/utils/` 資料夾，列出：
- 現有工具函式模組清單

### Step 6：推導命名建議

根據以上掃描結果，為新功能推導：
- 建議的 route path（符合現有業務模組前綴）
- 建議的 route name
- 建議的 Vue 檔名（符合命名慣例）
- 建議的資料夾路徑

## 輸出格式

輸出以下 Markdown 格式的「專案架構快照」：

```
## 🗂️ 專案架構快照

### 現有路由
> 來源：`{路由設定檔路徑}`

| Path | Name | Component |
|------|------|-----------|
| {path} | {name} | {component 路徑} |

路由結構模式：{巢狀 / 平層}
業務模組前綴：{偵測到的前綴清單}

---

### 側邊欄選單
> 來源：`{NavCollection 路徑}`

| 分組 | 項目名稱 | 對應 Route |
|------|---------|-----------|
| {分組} | {名稱} | {route name/path} |

---

### Views 結構
> 來源：`src/views/`

| 模組資料夾 | 現有檔案 / 命名範例 |
|-----------|-----------------|
| {資料夾} | {檔名範例} |

命名慣例偵測：{偵測結果，例如「{4碼英文大寫}{4碼數字}.vue」}

---

### 共用元件
> 來源：`src/components/common/`

| 元件檔案 | 主要 Props |
|---------|----------|
| {檔案名} | {props 摘要} |

---

### 共用工具
> 來源：`src/assets/utils/`

- {工具模組清單}

---

### 📌 建議命名（針對本次任務）

| 項目 | 建議值 | 依據 |
|------|-------|------|
| Route path | {建議} | {現有模式} |
| Route name | {建議} | {現有模式} |
| Vue 檔名 | {建議} | {現有慣例} |
| 資料夾路徑 | {建議} | {現有模組結構} |
```

## 注意事項

- 若路由設定檔或 NavCollection 不存在，在輸出中標記「未偵測到，需使用者指定位置」
- 若 `src/components/common/` 為空或不存在，標記「無現有共用元件」
- 掃描深度限制：Views 僅掃描前兩層，避免讀取過多無關檔案
- 若無法確定命名慣例（例如命名不一致），列出多種觀察到的模式，供使用者選擇
