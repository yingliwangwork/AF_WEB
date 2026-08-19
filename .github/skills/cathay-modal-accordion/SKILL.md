---
name: cathay-modal-accordion
description: "Use when implementing or reviewing Cathay dialog and accordion interactions: CxlModal, CxlModalTs, CxlAccordion, CxlAccordionTs, confirmText/cancelText buttons, CxlPopupProxy replacement, #bottom slot behavior, interactive accordion headers, or TS modal search mode."
version: "1.1.0" # 語義化版本號 (Semantic Versioning)
id: "cathay-modal-accordion.skill" # 唯一的Prompt識別碼
author: "張立賢" # 作者
type: "skill" # 分類
lvl: "feature" # 層級(copilot層級 > bundle層級 > feature層級)
bundle: "CathayBoostFrontendVue" # 所屬bundle
tag: ["skill", "modal", "accordion", "popup", "cathay", "frontend", "vue"] # 相關標籤
created_date: "2026-03-03" # 建立日期
last_modified: "2026-07-01" # 最後修改日期
---

# 國泰彈窗與折疊面板指南

## 快速選擇

| 需求 | 桌面版 | 行動版 |
|------|--------|--------|
| 彈窗對話框 | CxlModal | CxlModalTs |
| 折疊面板 | CxlAccordion | CxlAccordionTs |

---

## CxlModal — 標準版彈窗

## 核心屬性

| 屬性 | 類型 | 預設 | 說明 |
|------|------|------|------|
| `v-model` | Boolean | — | 控制顯示/隱藏 |
| `title` | String | — | 標題 |
| `subtitle` | String | — | 副標題 |
| `cancelText` | String | `''` | 取消按鈕文字（空字串 = 按鈕不顯示）|
| `confirmText` | String | `''` | 確認按鈕文字（空字串 = 按鈕不顯示）|
| `size` | String | `'sm'` | 尺寸：`'sm'`、`'md'`、`'lg'` |
| `disableCloseButton` | Boolean | false | 隱藏右上角關閉按鈕 |
| `persistent` | Boolean | false | 禁止點擊遮罩/ESC 關閉 |
| `contentScroll` | Boolean | false | 內容區域獨立滾動 |

## 基本用法

```vue
<CxlModal
  v-model="showDialog"
  title="確認操作"
  subtitle="請確認以下資訊"
  confirmText="確定"
  cancelText="取消"
  @confirm="handleConfirm"
  @cancel="handleCancel"
>
  <p>是否確認刪除此筆資料？</p>
</CxlModal>
```

## 事件

| 事件 | 說明 |
|------|------|
| `@confirm` | 點擊確認按鈕 |
| `@cancel` | 點擊取消按鈕 |
| `@before-hide` | 彈窗關閉前觸發 |

## #bottom Slot

```vue
<CxlModal v-model="show" title="自訂按鈕">
  <p>內容</p>
  <template #bottom>
    <CxlButton label="自訂按鈕" @click="customAction" />
  </template>
</CxlModal>
```

**注意**：使用 `#bottom` 插槽時，`confirmText`/`@confirm`/`cancelText`/`@cancel` 全部失效。`#bottom` 已內建 `q-gutter-sm row justify-center`。

當有確認和取消按鈕需求時，應使用 `confirmText` + `cancelText` 屬性，而非 `#bottom` 插槽。

## Popup 元件替換規則

在 CxlModal 內部，必須替換以下元件：

| 標準元件 | Modal 內替換為 |
|---------|---------------|
| q-popup-proxy | CxlPopupProxy |
| q-popup-edit | CxlPopupEdit |
| q-menu | `q-menu :no-focus="true"` |

---

## CxlModalTs — 行動版彈窗

## 核心屬性

### 基本設定

| 屬性 | 類型 | 預設 | 說明 |
|------|------|------|------|
| `v-model` | Boolean | — | 控制顯示/隱藏 |
| `title` | String | '預設標題' | 標題（會被 `#header-title` 插槽覆蓋）|
| `confirmText` | String | '確認' | 確認按鈕文字 |
| `size` | String | 'sm' | 大小（sm/lg）|
| `disableCloseButton` | Boolean | false | 隱藏右上角關閉按鈕 |
| `persistent` | Boolean | false | 黏性模式（禁止跟 disableCloseButton 一起使用）|

### 表單搜尋模式

| 屬性 | 類型 | 預設 | 說明 |
|------|------|------|------|
| `useFormLayout` | Boolean | false | 使用表單 Modal 設置 |
| `showSearchButton` | Boolean | false | 顯示搜尋按鈕 |
| `searchBtnText` | String | '查詢' | 搜尋按鈕文字 |
| `searchTitle` | String | '請輸入查詢' | 搜尋欄位左方標題 |
| `searchAttrs` | Object | `{ placeholder: '請輸入關鍵字' }` | 搜尋 input 屬性 |

### 內容區域控制

| 屬性 | 類型 | 說明 |
|------|------|------|
| `noPadding` | Boolean | 設置 padding 為 0 |
| `contentCenter` | Boolean | 內容區塊置中 |
| `contentShadow` | Boolean | 內容區塊陰影（僅 `useFormLayout` 時有效）|
| `contentPadding` | String | 自訂內容 padding |

### Header 和 Footer 控制

| 屬性 | 類型 | 說明 |
|------|------|------|
| `showHeaderContent` | Boolean | 開啟 `#header-text` slot |
| `showFooterDescription` | Boolean | 開啟 `#footer-text` slot |
| `footerDescription` | String | Footer 上方描述（會被 `#footer-text` 覆蓋）|
| `footerTitle` | String | Footer 按鈕旁描述 |
| `showConfirmButton` | Boolean | 是否顯示確認按鈕（會被 `#footer` 覆蓋）|

## 雙向綁定

| 綁定 | 類型 | 說明 |
|------|------|------|
| `v-model` | Boolean | 控制顯示/隱藏 |
| `v-model:searchValue` | String | 搜尋 input 欄位值 |

## 事件

| 事件 | 說明 |
|------|------|
| `@confirm` | 確認按鈕點擊 |
| `@submit` | 搜尋按鈕點擊 |
| `@before-hide` | Modal 關閉前觸發 |

## 基本用法

```vue
<CxlModalTs
  v-model="showModal"
  title="篩選條件"
  confirmText="搜尋"
  @confirm="handleSearch"
  @before-hide="beforeHide"
>
  <CxlInput v-model="keyword" class="cxl-input-ts" placeholder="關鍵字" />
</CxlModalTs>
```

## 表單搜尋模式（完整範例）

```vue
<CxlModalTs
  v-model="showModal"
  v-model:searchValue="searchValue"
  title="預設標題"
  use-form-layout
  show-search-button
  search-title="請輸入查詢"
  search-btn-text="查詢"
  content-shadow
  confirm-text="確認"
  :footer-title="`已選擇 ${selected.length} 項`"
  show-footer-description
  @submit="handleSearch"
  @confirm="handleConfirm"
>
  <template #footer-text>
    <div class="cxl-text-grey">請至少選擇一項資料</div>
  </template>

  <CxlTable
    v-model:selected="selected"
    class="cxl-table-ts"
    :rows="rows"
    :columns="columns"
    row-key="id"
    selection="multiple"
    :rows-per-page-options="[0]"
    virtual-scroll
  />
</CxlModalTs>
```

**關鍵要點**：
- `v-model:searchValue` 雙向綁定搜尋值
- `content-shadow` 僅在 `use-form-layout` 為 true 時有效
- `#footer-text` 插槽需要 `show-footer-description="true"`

## Slots

| Slot | 說明 | 前置條件 |
|------|------|---------|
| `default` | 主要內容區域 | — |
| `#header-title` | 替換標題整塊區域 | — |
| `#header-text` | 標題下方描述區塊 | `showHeaderContent` 為 true |
| `#footer-text` | Footer 上方描述區塊 | `showFooterDescription` 為 true |
| `#footer` | 替換整個 Footer 區域 | — |

## 重要約束

- 不可同時使用 `persistent` 和 `disableCloseButton`
- 內部彈出元件必須用 CxlPopupProxy / CxlPopupEdit 替換
- `q-menu` 需加上 `:no-focus="true"`

---

## CxlAccordion — 標準版折疊面板

適合純文字內容、FAQ、簡單表單分組。

## 核心屬性

| 屬性 | 類型 | 預設 | 說明 |
|------|------|------|------|
| `default-opened` | Boolean | false | 預設是否展開內容 |

## 必填插槽

| Slot | 說明 |
|------|------|
| `#header` | 標題區域（使用 `.cxl-accordion-title` 和 `.cxl-accordion-subtitle` class）|
| `#content` | 內容區域 |

## 基本用法

```vue
<CxlAccordion default-opened>
  <template #header>
    <span class="cxl-accordion-title">折疊面板標題</span>
    <span class="cxl-accordion-subtitle">副標題</span>
  </template>
  <template #content>
    <p>折疊面板內容</p>
  </template>
</CxlAccordion>
```

**注意**：CxlAccordion（標準版）使用 `#header` + `#content` 插槽，與 CxlAccordionTs 的 API 完全不同。

---

## CxlAccordionTs — 行動版折疊面板

支援三層級（main/sub/aux）、插槽自訂、手風琴模式。

## 核心屬性

| 屬性 | 類型 | 預設 | 說明 |
|------|------|------|------|
| `mode` | String | 'main' | 呈現樣式：`'main'`、`'sub'`、`'aux'` |
| `title` | String | '' | 標題中間文字 |
| `label-name` | String | '' | 標題左側文字 |
| `title-class` | Array | [] | 標題中間 class |
| `label-class` | Array | [] | 標題左側文字 class |
| `label-icon-class` | Array | [] | 標題左側 icon class |
| `default-opened` | Boolean | false | 預設展開 |
| `disable` | Boolean | false | 關閉展開功能（展開 icon 消失）|
| `group` | String | '' | 手風琴群組名稱 |
| `expand-icon-toggle` | Boolean | false | 僅 icon 觸發展開（有互動元素時必加）|

## 三種模式層級

**嚴格規則**：層級順序必須是 main → sub → aux，不可跳級。

| 模式 | 說明 |
|------|------|
| `main` | 主層級，最外層，視覺最突出 |
| `sub` | 次層級，嵌套在 main 內 |
| `aux` | 輔助層級，最深層嵌套 |

## Slots

| Slot | 說明 |
|------|------|
| `default` | 主要內容區域 |
| `#headerLeft` | 標題左側自訂內容 |
| `#headerRight` | 標題右側自訂內容（通常放按鈕）|

## 基本用法

```vue
<CxlAccordionTs
  mode="main"
  title="申請服務"
  label-name="第一受益人"
  :title-class="['cxl-text-primary']"
  :label-icon-class="['cxl-icon-warning-ts', 'cxl-text-warning']"
>
  <div class="q-pa-md">內容</div>
</CxlAccordionTs>
```

## Header 有互動元素時

```vue
<CxlAccordionTs mode="sub" label-name="被保人 1" expand-icon-toggle>
  <template #headerRight>
    <CxlButton
      class="cxl-btn-ts"
      prevIcon="cxl-icon-delete-ts"
      theme="primary-outline"
      round
      @click.stop="handleDelete"
    />
  </template>
  <div class="q-pa-md">內容</div>
</CxlAccordionTs>
```

**注意**：`expand-icon-toggle` 搭配 `@click.stop` 防止事件冒泡。

## 手風琴群組模式

```vue
<CxlAccordionTs
  v-for="item in items"
  :key="item.id"
  mode="main"
  :title="item.name"
  group="myGroup"
>
  <div class="q-pa-md">{{ item.content }}</div>
</CxlAccordionTs>
```

**group 命名唯一性**：同一頁面多個群組時，確保 group 名稱唯一。

---

## 元件選擇指南

| 使用場景 | 推薦元件 |
|---------|---------|
| 內部系統資訊展示 | CxlAccordion（標準版）|
| 行動系列應用 | CxlAccordionTs |
| 表單查詢彈窗 | CxlModalTs（搭配 `useFormLayout`）|
| 簡單確認對話框 | CxlModal（標準版）|

## 關鍵約束

1. **persistent vs disableCloseButton**：不可同時使用
2. **Accordion API 差異**：CxlAccordion 用 `#header` + `#content`；CxlAccordionTs 用 `#headerLeft` + `#headerRight`
3. **模式層級**：main → sub → aux，不可跳級（僅 CxlAccordionTs）
4. **expand-icon-toggle**：Header 有互動元素時必加（僅 CxlAccordionTs）
5. **group 命名**：同一群組使用相同字串，確保唯一性
6. **Popup 替換**：Modal 內必須用 CxlPopupProxy 替換 q-popup-proxy
