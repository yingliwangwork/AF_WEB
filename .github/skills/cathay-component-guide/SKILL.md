---
name: cathay-component-guide
description: "Use when choosing Cathay frontend components for Vue 3 + Quasar pages: decide CxlInput/CxlDropdown/CxlTable/CxlModal/CxlButton, distinguish standard vs TS Tablet-Series components, map user wording to Cxl skills, or avoid unsupported Quasar/native fallbacks."
version: "1.1.0" # 語義化版本號 (Semantic Versioning)
id: "cathay-component-guide.skill" # 唯一的Prompt識別碼
author: "張立賢" # 作者
type: "skill" # 分類
lvl: "feature" # 層級(copilot層級 > bundle層級 > feature層級)
bundle: "CathayBoostFrontendVue" # 所屬bundle
tag: ["skill", "component", "selection", "cathay", "frontend", "vue"] # 相關標籤
created_date: "2026-03-03" # 建立日期
last_modified: "2026-07-01" # 最後修改日期
---

# 國泰元件選擇決策指南

## 重要定義

**TS版 = Tablet-Series（行動裝置系列）**，不是 TypeScript。

## 元件優先級

```
1. 國泰元件庫 (vue-cathaylife-component) — 最高優先
2. Quasar Framework（搭配國泰 CSS）
3. 原生 HTML（最後選擇）
```

## 元件分類速查

此表只在本 skill 已載入後用來選元件與轉介細部 skill；初始觸發線索維持在各 skill 的 frontmatter `description`。

### 表單元件 → 使用 `cathay-form-inputs` skill

| 需求 | 元件 |
|------|------|
| 單行文字 | CxlInput |
| 下拉選單 | CxlDropdown |
| 多行文字 | CxlTextarea |
| 多選框 | QCheckbox + `cxl-checkbox` class |
| 單選框 | QRadio + `cxl-radio` class |
| 日曆選擇 | CxlCalendar（搭配 CxlInput + CxlPopupProxy）→ 詳見 `cathay-ui-components` skill |

### 資料顯示 → 使用 `cathay-table` skill

| 需求 | 元件 |
|------|------|
| 靜態表格/表單排列 | `q-markup-table` |
| 動態資料列表 | CxlTable |
| 密集資料顯示（7+ 欄位） | 依 `cathay-table` skill 的版本決策選擇 |

### 互動元件 → 使用 `cathay-modal-accordion` skill 或 `cathay-ui-components` skill

| 需求 | 元件 |
|------|------|
| 彈窗對話框（桌面）| CxlModal |
| 彈窗對話框（行動）| CxlModalTs |
| 折疊面板（桌面）| CxlAccordion |
| 折疊面板（行動）| CxlAccordionTs |
| 按鈕 | CxlButton |
| 頁籤（桌面）| CxlTabs |
| 頁籤（行動）| CxlTabsTs / CxlSubTabsTs |
| 虛擬鍵盤 | CxlKeyboard / CxlKeyboardTs |
| 通知訊息 | `$notify` (inject) |

### 容器/導航 → 使用 `cathay-ui-components` skill

| 需求 | 元件 |
|------|------|
| 卡片容器 | `<q-card class="cxl-card">`（無 CxlCard） |
| 麵包屑 | CxlBreadcrumbs |
| 輪播 | CxlCarousel |
| 步驟進度 | CxlStepper |
| 行動工具列 | CxlToolbarTs |
| 徽章 | CxlBadge / CxlBadgeTs |
| 標籤 | CxlTag（僅 TS 版）|

## 元件類型識別

### 共用元件（CSS 區分版本）

同一元件，透過 CSS 類別切換版本：

| 元件 | 標準版 | TS版 |
|------|--------|------|
| CxlButton | 預設 | `class="cxl-btn-ts"` |
| CxlInput | 預設 | `class="cxl-input-ts"` |
| CxlTable | 預設 | `class="cxl-table-ts"` |
| CxlDropdown | 預設 | `class="cxl-dropdown-ts"` |

### 獨立元件（不同元件名稱）

| 功能 | 標準版 | TS版 |
|------|--------|------|
| 折疊面板 | CxlAccordion | CxlAccordionTs |
| 彈窗 | CxlModal | CxlModalTs |
| 頁籤 | CxlTabs | CxlTabsTs / CxlSubTabsTs |
| 虛擬鍵盤 | CxlKeyboard | CxlKeyboardTs |

### Quasar + CSS 模式

| 功能 | 標準版 | TS版 |
|------|--------|------|
| 卡片 | `<q-card class="cxl-card">` | `<q-card class="cxl-card-ts">` |
| 多選框 | `<q-checkbox class="cxl-checkbox">` | `<q-checkbox class="cxl-checkbox-ts">` |
| 單選框 | `<q-radio class="cxl-radio">` | `<q-radio class="cxl-radio-ts">` |

## 版本選擇決策

```
確定設備類型
├─ 桌面應用 → 標準版
│  ├─ 共用元件：無額外 CSS
│  └─ 獨立元件：CxlModal, CxlAccordion
└─ 行動應用 → TS版
   ├─ 共用元件：加 cxl-xxx-ts 類別
   └─ 獨立元件：CxlModalTs, CxlAccordionTs
```

## 導入語句

```javascript
import { CxlButton, CxlInput, CxlTable } from 'vue-cathaylife-component'
```

## 關鍵注意事項

1. **CxlInput 不支援 label 屬性**：必須使用外部標籤或 placeholder
2. **CxlButton**：使用 `theme` 屬性而非 `color`
3. **CxlDropdown**：若無特別指示應同時使用 `map-options` 和 `emit-value`
4. **版本一致性**：整個專案統一使用標準版或 TS 版
5. **不存在 CxlCard**：使用 `<q-card class="cxl-card">`
