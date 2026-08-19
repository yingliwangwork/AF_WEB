---
applyTo: "**/*.{vue,js}"
description: "Use when writing or reviewing Vue 3 + Quasar frontend code. Covers 國泰元件庫優先級、Script Setup、專案結構、Service endpoint 邊界、$cathayAxios、TS Tablet-Series 裝置策略。"
version: "1.1.0" # 語義化版本號 (Semantic Versioning)
id: "frontend-overview.instructions" # 唯一的Prompt識別碼
author: "張立賢" # 作者
type: "instructions" # 分類
lvl: "bundle" # 層級(copilot層級 > bundle層級 > feature層級)
bundle: "CathayBoostFrontendVue" # 所屬bundle
tag: ["overview", "architecture", "frontend", "vue", "quasar"] # 相關標籤
created_date: "2026-03-03" # 建立日期
last_modified: "2026-07-01" # 最後修改日期
---

# 前端專案開發規範

## 專案概述

公司內部管理系統。業務特性為後台管理頁面（資料查詢、表單輸入），核心價值是**資料正確性**優先於視覺效果。

**裝置策略**：
- **預設**：PC 桌面瀏覽器（標準版）
- **行動版**：僅在使用者明確指定或檔案/類別帶有 `ts` 後綴時使用
- **重要定義**：TS = Tablet-Series（行動裝置系列），不是 TypeScript
- 範例：`CxlModalTs`、`class="cxl-input-ts"`

## 技術棧

- **核心框架**：Vue 3 (^3.5.23) — **強制使用 Script Setup Composition API**
- **UI 框架**：Quasar Framework (^2.18.5)
- **元件庫**：`vue-cathaylife-component`（國泰元件庫，最高優先級）
- **狀態管理**：Pinia (^3.0.4)
- **路由**：Vue Router (^4.6.3)
- **表單驗證**：VeeValidate (^4.15.1) + Yup (^1.7.1)
- **HTTP**：CathayAxios（Axios 封裝）
- **建置工具**：Vite (^6.3.6)
- **時間處理**：dayjs (^1.11.19)

## 專案結構

```
src/
├── assets/                 # 靜態資源
│   ├── libs/               # 第三方函式庫
│   └── utils/              # 工具函式
├── components/      # 全域通用元件
├── router/                 # 路由設定
├── service/                # API 定義層（僅定義 endpoint，無邏輯）
├── stores/                 # Pinia 狀態管理
├── views/                  # 頁面視圖
│   └── [Module]/           # 業務模組資料夾
└── App.vue
```

## 執行原則（優先級順序）

1. **合規性**：優先遵守國泰設計系統（Cxl 元件、`cxl-*` class、Quasar utility）
2. **資料正確性**：API DTO、表單欄位、表格欄位與規格文件保持一致
3. **簡潔性**：優先選擇專案既有模式與低自訂樣式的實作
4. **安全性**：防止 `v-html`、敏感資料 console.log 與手寫 HTTP 錯誤通知

## 關鍵約束

### 元件選擇優先級
- **國泰元件**（Cxl*）→ **Quasar + 國泰 CSS** → **原生 HTML**
- 檢查是否有 `Cxl` 開頭的元件可用
- **無 CxlCard**：請使用 `<q-card class="cxl-card">`
- **TS版區隔**：行動裝置元件以 `-ts` 結尾，不可與標準版混用

### 樣式（CSS 類別優先級）
- **國泰 CSS** (`cxl-*`) → **Quasar Utility** (`q-*`, `row`, `col-*`) → **自訂 style/CSS**（僅在前兩者無法滿足且使用者明確要求時）
- **行內樣式**：原則上不使用 `style="..."`；`q-markup-table` 密集表格的 `<col style="width: ...">` 屬於允許例外
- **`<style scoped>`**：僅在國泰/Quasar class 無法滿足且使用者明確要求時使用

### 導入規則
- **禁止星號導入**：禁止 `import * as Vue`，必須使用具名導入
- **國泰元件**：`import { CxlButton } from 'vue-cathaylife-component'`
- **Axios**：`const $cathayAxios = inject('$cathayAxios')`

### 代碼生成
- **骨架優先**：先生成 UI 結構與 Script 骨架，複雜邏輯使用 `// TODO:` 標註
- **禁止** `v-html`、console.log 敏感資料
- **API / 表單驗證**：未收到明確 API 或 validation scope 時只產骨架；若使用者或 spec 明確要求，依 `axios-api` / `form-validation` 規範完整實作

## 執行範圍與邊界

### 應執行的任務
- 實作畫面布局與元件配置
- 使用 Quasar utility classes 實現彈性布局
- 實作基本互動與事件處理
- 實作表單欄位綁定與基本驗證結構

### 僅提供骨架的任務
- 權限控制邏輯：提供方法骨架與註解
- 敏感操作（支付/登入）：提供 UI 結構，不實作邏輯
- 複雜業務邏輯：提供基本架構，標註 TODO

## 架構規則

### 狀態管理決策
| 使用情境 | 方案 |
|---------|------|
| 單元件狀態 | `ref()`, `reactive()` |
| 多元件共用 | Pinia stores (`stores/`) |

### Service 檔案規則
**位置**: `src/service/**`。**僅包含** API endpoint 定義與 `functions` 物件格式。**禁止**業務邏輯、class 定義。

### Composables 建立時機
| 情境 | 做法 |
|------|------|
| 單一元件使用 | 直接在元件內定義 |
| 2+ 元件共用 | 抽取為 `composables/` |

## 執行工作流程

實作功能時的標準流程：
1. **分析**：識別需要讀取的規範檔案
2. **規劃**：列出實作步驟
3. **執行**：根據讀取到的規範生成程式碼
4. **驗證**：輸出前檢查是否違反關鍵約束

## 安全實踐

- 使用 Vue 自動轉義（`{{ }}` 或 `v-text`），禁止 `v-html`
- 統一使用 `$cathayAxios`，不直接使用 `fetch` 或 `axios.create()`
- 敏感資料不記錄在 console.log

## 效能考量

- 按需導入，避免未使用模組
- 路由元件懶載入：`() => import('./Component.vue')`
- 大型靜態資料不使用 `ref()` 或 `reactive()`

## 裝置策略約束

- 使用 Quasar spacing/flexbox classes 保持基本彈性
- 禁止多斷點響應式設計
- 禁止自定義 `@media` queries
