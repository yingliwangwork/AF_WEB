---
applyTo: "**/*.{vue,scss}"
description: "Use when styling Vue or SCSS with 國泰 CSS classes, Quasar utility classes, cxl-* prefix rules, BEM custom classes, deep selectors, q-markup-table spacing, or Quasar component replacements."
version: "1.1.0" # 語義化版本號 (Semantic Versioning)
id: "scss-quasar.instructions" # 唯一的Prompt識別碼
author: "張立賢" # 作者
type: "instructions" # 分類
lvl: "feature" # 層級(copilot層級 > bundle層級 > feature層級)
bundle: "CathayBoostFrontendVue" # 所屬bundle
tag: ["scss", "quasar", "styling", "css", "frontend", "vue"] # 相關標籤
created_date: "2026-03-03" # 建立日期
last_modified: "2026-07-01" # 最後修改日期
---

# SCSS 與 Quasar 整合規範

## 樣式優先順序

1. **國泰 CSS 類別**：`cxl-text-primary`、`cxl-card`、`cxl-table`（最高優先級）
2. **Quasar Utility Classes**：`q-pa-md`、`row`、`col-6`（間距/布局）
3. **自訂 style/CSS**：僅在前兩者無法滿足且使用者明確要求時使用

行內樣式原則上不使用；`q-markup-table` 密集表格用 `<col style="width: ...">` 控制欄寬是允許例外。

## 元件選擇決策

| 需求 | 優先選擇 | 備註 |
|------|---------|------|
| 按鈕 | `CxlButton` | 不用 `q-btn` |
| 輸入框 | `CxlInput` | 不用 `q-input` |
| 下拉選單 | `CxlDropdown` | 不用 `q-select` |
| 表格 | `CxlTable` / `q-markup-table` + `cxl-table` | 動態/靜態分別 |
| 卡片容器 | `q-card` + `cxl-card` class | 無 CxlCard 元件 |
| 彈窗 | `CxlModal` / `CxlModalTs` | 不用 `q-dialog` |

## cxl- 前綴規則

- **使用**國泰提供的 `cxl-*` 類別
- **禁止**自定義 `cxl-*` 前綴的 CSS 類別

## BEM 命名（自訂 CSS 時）

使用 BEM 命名：`.block__element--modifier`（如 `.search-form__field--active`）

## SCSS 變數與顏色匯入

```scss
@import '@/assets/scss/colors';

.custom-element {
  color: $cxl-primary;       // 品牌綠
  border: 1px solid $cxl-border-gray-d8;
}
```

## Deep Selector（修改子元件樣式）

```scss
:deep(.q-field__native) {
  font-size: 14px;
}
```

## Quasar 整合注意事項

### 禁止創建不存在的 Quasar 元件

Quasar 沒有以下元件：`q-date-picker`、`q-container`、`q-row`、`q-col`。使用前請確認元件存在。

### CxlModal/CxlInfo 內的元件替換規則

| 標準元件 | Modal 內替換為 | 原因 |
|---------|---------------|------|
| `q-menu` | `q-menu :no-focus="true"` | 防止焦點衝突 |
| `q-popup-proxy` | `CxlPopupProxy` | 國泰封裝版本 |
| `q-popup-edit` | `CxlPopupEdit` | 國泰封裝版本 |

### Quasar Utility Classes 速查

| 類別 | 用途 |
|------|------|
| `q-pa-md`、`q-mt-lg` | 間距（padding/margin）|
| `row`、`col-6`、`col-auto` | 彈性佈局（flexbox grid）|
| `q-gutter-sm`、`q-gutter-md` | 子元素間距 |
| `items-center`、`justify-center` | 對齊方式 |
