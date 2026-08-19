---
name: design-system-reference
description: "Use when applying or reviewing Cathay design system details: cxl color classes and hex values, Quasar spacing, border utilities, cxl-title typography, font sizes, icon class prefixes, data formatting, SCSS variables, deep selectors, or matching colors from reference screenshots."
version: "1.1.0" # 語義化版本號 (Semantic Versioning)
id: "design-system-reference.skill" # 唯一的Prompt識別碼
author: "張立賢" # 作者
type: "skill" # 分類
lvl: "feature" # 層級(copilot層級 > bundle層級 > feature層級)
bundle: "CathayBoostFrontendVue" # 所屬bundle
tag: ["skill", "design-system", "colors", "typography", "spacing", "cathay", "frontend"] # 相關標籤
created_date: "2026-03-03" # 建立日期
last_modified: "2026-07-01" # 最後修改日期
---

# 國泰設計系統參考

## 核心規則

1. **優先順序**：國泰 CSS 類別 (`cxl-*`) > Quasar utility classes (`q-*`) > 自訂 CSS
2. **自訂 style/CSS**：僅在國泰 CSS 與 Quasar utility 無法滿足，且使用者明確要求時使用
3. **行內樣式例外**：`q-markup-table` 密集表格的 `<col style="width: ...">` 可用來控制欄寬
4. **禁止**：自定義 `cxl-*` 前綴的 CSS 類別
5. 專案預設黑色字體，一般文字不需加 class

### SCSS 原始檔索引

> ⚠️ **查詢順序**：先使用下方常用 class 表格，僅在找不到時才讀取原始 SCSS 檔案。

完整 class 定義位於 `node_modules/vue-cathaylife-component/src/assets/scss/`：

| 檔案 | 內容 |
|------|------|
| `_colors.scss` | 顏色變數、`cxl-text-*`、`cxl-bg-*`、`cxl-border-*` class |
| `_typography.scss` | 標題系統、`cxl-title-h*`、`cxl-h*`、字體大小 |
| `utilities/_border.scss` | 邊框系統、`cxl-b{direction}-{width}` |
| `utilities/_spacing.scss` | 國泰專用間距（Quasar 間距仍優先使用）|
| `_components.scss` | 元件專用樣式（表格、表單等）|

---

## 顏色系統

### 場景快速對應

| 場景 | CSS Class |
|------|-----------|
| 一般文字 | 不加 class（預設黑色）|
| 錯誤訊息 | `cxl-text-danger` |
| 警告訊息 | `cxl-text-warning` |
| 品牌強調/連結 | `cxl-text-primary` |
| 提示說明 | `cxl-text-info` |
| 次要文字/註解 | `cxl-text-gray-6d` |
| 禁用狀態 | `cxl-text-gray-a7` |

### 中性色系

| CSS Class | Hex | 用途 |
|-----------|-----|------|
| `cxl-text-black-11` | #111111 | 極深灰，黑色強調 |
| `cxl-text-black-4a` | #4a4a4a | 深灰，明確需要時 |
| `cxl-text-gray-6d` | #6d6d6d | 中灰，次要文字/註解 |
| `cxl-text-gray-a7` | #a7a7a7 | 淺灰，placeholder/disabled |
| `cxl-text-gray-d8` | #d8d8d8 | 極淺灰，邊框/背景 |
| `cxl-text-gray-f1` | #f1f1f1 | 近白灰，淺色背景 |
| `cxl-text-gray-fa` | #fafafa | 幾乎白，淺色背景 |
| `cxl-white-ff` | #ffffff | 純白 |
| `cxl-text-gray-overlay` | rgba(0,0,0,0.6) | 半透明黑，遮罩 |

### 品牌綠色系 (Primary)

| CSS Class | Hex | 用途 |
|-----------|-----|------|
| `cxl-text-primary` | #00994e | 品牌綠，主要色 |
| `cxl-text-primary-dark` | #006f30 | 深綠 |
| `cxl-text-primary-light` | #51be77 | 淺綠 |
| `cxl-text-primary-bright` | #30c666 | 明亮綠 |
| `cxl-text-primary-pale` | #95ebb3 | 極淺綠 |
| `cxl-text-primary-overlay` | #e0ffeb | 淡綠背景 |
| `cxl-primary-e3f6ec` | #e3f6ec | 淡綠背景2 |

### 錯誤紅色系 (Danger)

| CSS Class | Hex | 用途 |
|-----------|-----|------|
| `cxl-text-danger` | #fd596d | 錯誤紅 |
| `cxl-text-danger-bright` | #ff2828 | 鮮紅，嚴重錯誤 |
| `cxl-text-danger-dark` | #ff4769 | 深紅 |
| `cxl-text-danger-light` | #ff788e | 淺紅 |
| `cxl-text-danger-pale` | #ffe6ea | 淡紅背景 |

### 警告橘色系 (Warning)

| CSS Class | Hex | 用途 |
|-----------|-----|------|
| `cxl-text-warning` | #ffa81a | 警告橘 |
| `cxl-text-warning-dark` | #ff9600 | 深橘 |
| `cxl-text-warning-light` | #ffbe53 | 淺橘 |
| `cxl-text-warning-pale` | #fffdd9 | 淡黃背景 |

### 資訊藍色系 (Info)

| CSS Class | Hex |
|-----------|-----|
| `cxl-text-info` | #2cbdff |

### 邊框顏色

| CSS Class | Hex | 用途 |
|-----------|-----|------|
| `cxl-border-gray-d8` | #d8d8d8 | 主要邊框（卡片、表格）|
| `cxl-border-gray-a7` | #a7a7a7 | 次要邊框（輸入框）|
| `cxl-border-primary` | #00994e | 品牌綠色邊框 |
| `cxl-border-warning` | #ffa81a | 警告橘色邊框 |

---

## 顏色匹配流程（參考圖片時）

```
步驟 1：辨識圖片/代碼中的顏色
步驟 2：在顏色表中找最接近的
步驟 3：使用對應 CSS class

範例：
圖片中 #00a050（綠色）→ 最接近 #00994e → cxl-text-primary
代碼 style="color: #ff5555" → 最接近 #fd596d → cxl-text-danger
```

匹配標準：色系相同 → 亮度接近 → 飽和度接近

---

## 間距系統（Quasar Spacing）

**格式**：`q-{type}{direction}-{size}`

| type | 說明 | direction | 說明 | size | px |
|------|------|-----------|------|------|----|
| `m` | margin | `a` | 四邊 | `xs` | 4px |
| `p` | padding | `t`/`b`/`l`/`r` | 上/下/左/右 | `sm` | 8px |
| | | `x`/`y` | 左右/上下 | `md` | 16px |
| | | | | `lg` | 24px |
| | | | | `xl` | 48px |

**範例**：`q-pa-md` = padding 四邊 16px、`q-mt-lg` = margin 上 24px

---

## 邊框系統

**格式**：`cxl-b{direction}-{width}[-{style}]` + 邊框顏色

| direction | width | style |
|-----------|-------|-------|
| `a`=四邊, `t`/`b`/`l`/`r` | 1-10 (px) | `solid`(可省略), `dashed`, `dotted` |

**必須同時使用邊框樣式 + 邊框顏色**：

```vue
<div class="cxl-ba-1 cxl-border-gray-d8">標準邊框</div>
<div class="cxl-ba-2-dashed cxl-border-gray-a7">虛線邊框</div>
<div class="cxl-bt-1 cxl-border-gray-d8">上邊框分隔線</div>
```

---

## 標題系統

### Web 版

| CSS Class | 大小 | 規則 |
|-----------|------|------|
| `cxl-h1` / `cxl-title-h1` | 22px | 每頁僅一個 |
| `cxl-h2` / `cxl-title-h2` | 20px | |
| `cxl-h3` / `cxl-title-h3` | 18px | |
| `cxl-h4` / `cxl-title-h4` | 16px | |
| `cxl-h5` / `cxl-title-h5` | 14px | |
| `cxl-h6` / `cxl-title-h6` | 12px | |

### TS 版

| CSS Class | 大小 |
|-----------|------|
| `cxl-h1-ts` / `cxl-title-h1-ts` | 28px |
| `cxl-h2-ts` / `cxl-title-h2-ts` | 24px |
| `cxl-h3-ts` / `cxl-title-h3-ts` | 22px |
| `cxl-h4-ts` / `cxl-title-h4-ts` | 20px |
| `cxl-h5-ts` / `cxl-title-h5-ts` | 18px |
| `cxl-h6-ts` / `cxl-title-h6-ts` | 16px |

---

## 字體大小

**格式**：`cxl-font-{size}`（10-80px，最小 12px）

常用：`cxl-font-12`、`cxl-font-14`、`cxl-font-16`、`cxl-font-18`、`cxl-font-20`、`cxl-font-22`、`cxl-font-24`、`cxl-font-28`、`cxl-font-32`

若使用 >32px 字體，應主動告知使用者確認。

---

## 列表樣式

- `cxl-ordered-list` / `cxl-ordered-list-lg` / `cxl-ordered-list-sm`
- `cxl-unordered-list` / `cxl-unordered-list-lg` / `cxl-unordered-list-sm`
- `cxl-definition-list` / `cxl-definition-list-lg` / `cxl-definition-list-sm`

---

## 圖示系統

| 版本 | 前綴 | 最小尺寸 |
|------|------|---------|
| Web 版 | `cub-icon-*` | 12px |
| TS 版 | `cxl-icon-*-ts` | 24×24px（按鈕內標準）|

---

## 資料格式

### 日期時間

```javascript
import dayjs from 'dayjs'
dayjs(date).format('YYYY-MM-DD')           // 日期：2025-01-20
dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')  // 時間戳：2025-01-20 14:30:45
```

### 金額（千分位，靠右）

```javascript
const formatCurrency = (value) => Number(value).toLocaleString()
// 1234567 → 1,234,567
```

表格中金額欄位使用 `align: 'right'`。

---

## SCSS 變數（自訂樣式時）

```scss
@import '@/assets/scss/colors';

.custom-element {
  color: $cxl-primary;
  border: 1px solid $cxl-border-gray-d8;
}
```

## Deep Selector

```scss
:deep(.q-field__native) {
  font-size: 14px;
}
```

---

## 檢查清單

- [ ] 無不必要的 `style="..."` 行內樣式；密集表格 `<col style="width: ...">` 例外
- [ ] 所有間距使用 `q-m*` / `q-p*`
- [ ] 場景明確時使用對應顏色
- [ ] 邊框有「樣式類別」+「顏色類別」
- [ ] 每頁只有一個 `<h1>`
- [ ] 字體不小於 12px
