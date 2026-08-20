---
name: cathay-table
description: "Use when implementing or reviewing Cathay table and data display patterns: q-markup-table static forms, CxlTable dynamic rows, pagination, selection, index columns, custom cell slots, dense data display, cxl-table-form, cxl-form-grid, virtual scroll, or table separator behavior."
version: "1.1.0" # 語義化版本號 (Semantic Versioning)
id: "cathay-table.skill" # 唯一的Prompt識別碼
author: "張立賢" # 作者
type: "skill" # 分類
lvl: "feature" # 層級(copilot層級 > bundle層級 > feature層級)
bundle: "CathayBoostFrontendVue" # 所屬bundle
tag: ["skill", "table", "data-grid", "pagination", "cathay", "frontend", "vue"] # 相關標籤
created_date: "2026-03-03" # 建立日期
last_modified: "2026-07-01" # 最後修改日期
---

# 國泰表格元件指南

## 表格元件決策

```
需要表格嗎？
├─ 靜態佈局/表單排列 → q-markup-table
├─ 密集資料顯示（7+ 欄位）→ 依元件庫版本選 `cxl-table-form` 或 `cxl-form-column` + `cxl-form-grid`
└─ 動態資料列表 → CxlTable
```

## q-markup-table — 靜態表格

用於查詢條件排列、固定結構的資料呈現。

### 基本用法

```vue
<q-markup-table
  class="cxl-table cxl-table-horizontal"
  separator="cell"
  flat
  bordered
>
  <thead>
    <tr>
      <th colspan="4" class="cxl-table-header">查詢條件</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>部門</th>
      <td><CxlInput v-model="divNo" placeholder="請輸入部門" /></td>
      <th>姓名</th>
      <td><CxlInput v-model="name" placeholder="請輸入姓名" /></td>
    </tr>
  </tbody>
</q-markup-table>
```

**關鍵要點**：
- 必須加上 `class="cxl-table cxl-table-horizontal"`
- 使用 `cxl-table-header` class 設定表格標題列
- 使用標準 HTML table 結構（thead/tbody）

### 必填欄位標記

```vue
<th>
  <span class="cxl-text-danger">*</span> 保單號碼
</th>
```

---

## CxlTable — 動態資料表格

**已內建**：`square`、`flat`、`bordered`、`dense`、`no-data-label="查無資料"`、分頁器（`CxlPaginatorForTable`）、無資料樣式。

**重要規則**：若無操作分頁的需求，**禁止**額外設定 `pagination` 以及 `rows-per-page-options` 屬性。

### 核心屬性

| 屬性 | 類型 | 說明 |
|------|------|------|
| `rows` | Array | 資料陣列 |
| `columns` | Array | 欄位定義 |
| `row-key` | String | 列唯一識別欄位（預設 `'id'`）|
| `separator` | String | 分隔線樣式：`'horizontal'`(預設)、`'vertical'`、`'cell'`、`'none'` |
| `flat` | Boolean | 平面化，預設 `true`（已內建）|
| `hide-header` | Boolean | 隱藏表頭 |
| `hide-bottom` | Boolean | 隱藏底部分頁區塊 |
| `selection` | String | 選擇模式：`'single'` 或 `'multiple'` |
| `v-model:selected` | Array | 雙向綁定選取的列 |
| `v-model:pagination` | Object | 雙向綁定分頁設定 |
| `dropdownOptions` | Array | 自訂分頁下拉選單選項（預設：5, 10, 30, 50, 100, All）|
| `virtual-scroll` | Boolean | 啟用虛擬滾動 |
| `rows-per-page-options` | Array | 每頁顯示筆數選項，設為 `[0]` 表示不分頁 |

### Column 定義

```javascript
const columns = ref([
  {
    name: 'empName',        // 唯一識別名稱
    label: '姓名',          // 表頭顯示文字
    field: 'empName',       // 對應 row 資料的 key
    align: 'left',          // 對齊方式
    sortable: true,         // 是否可排序
    format: (val) => val    // 格式化函式
  },
  {
    name: 'amount',
    label: '金額',
    field: 'amount',
    align: 'right',
    format: (val) => Number(val).toLocaleString()
  }
])
```

### 基本用法

基本用法已涵蓋大部分情境，已內建分頁器，預設 10 筆一頁，無需額外設定。

```vue
<CxlTable :rows="rows" :columns="columns" row-key="id" />
```

### TS 版

```vue
<CxlTable
  v-model:pagination="pagination"
  class="cxl-table-ts"
  :rows="rows"
  :columns="columns"
  row-key="id"
  separator="cell"
  :flat="false"
  :rows-per-page-options="[0]"
  :hide-bottom="rows.length > 0"
  virtual-scroll
/>
```

```javascript
const pagination = ref({ rowsPerPage: 0 })  // 不分頁
```

**TS 版要點**：`class="cxl-table-ts"`、`:flat="false"` 顯示陰影、無分頁。

---

## 索引欄（序號）

使用 `field` 函式動態生成索引（推薦）：

```javascript
const columns = ref([
  {
    name: 'index',
    label: '序號',
    field: (row, index) => index + 1,  // 動態生成序號
    align: 'center',
    style: 'width: 80px'
  },
  // ... 其他欄位
])
```

**注意**：使用分頁時索引會在每頁重新計算。若需跨頁連續編號：`(row, index) => (pagination.value.page - 1) * pagination.value.rowsPerPage + index + 1`

---

## 分頁

### 預設分頁（不需額外設定）

CxlTable 已內建分頁，預設每頁 10 筆。只有在需要改變預設行為時才傳入 `v-model:pagination`。

```vue
<!-- 自訂每頁顯示筆數 -->
<CxlTable
  v-model:pagination="pagination"
  :rows="rows"
  :columns="columns"
  row-key="id"
/>
```

```javascript
const pagination = ref({ page: 1, rowsPerPage: 5 })
```

### 自訂分頁下拉選單（dropdownOptions）

```vue
<CxlTable
  :rows="rows"
  :columns="columns"
  :dropdownOptions="[
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 },
  ]"
  row-key="id"
/>
```

### 隱藏分頁（不分頁）

```vue
<CxlTable
  v-model:pagination="pagination"
  :rows="rows"
  :columns="columns"
  :rows-per-page-options="[0]"
  :hide-bottom="rows.length > 0"
  row-key="id"
/>
```

```javascript
const pagination = ref({ rowsPerPage: 0 })  // 0 表示顯示所有資料
```

---

## 選取功能

### 標準版 — 多選/單選

設定 `selection="multiple"` 或 `selection="single"`，系統自動在左側加入 Checkbox。

```vue
<CxlTable
  v-model:selected="selected"
  :rows="rows"
  :columns="columns"
  row-key="id"
  selection="multiple"
/>
```

```javascript
const selected = ref([])
```

### TS 版 — 多選

直接使用 `selection="multiple"`，預設 Checkbox 樣式正確。

```vue
<CxlTable
  v-model:selected="selected"
  class="cxl-table-ts"
  :rows="rows"
  :columns="columns"
  row-key="id"
  selection="multiple"
  separator="cell"
  :flat="false"
  :rows-per-page-options="[0]"
  virtual-scroll
/>
```

### TS 版 — 單選（必須自訂插槽）

**TS 版單選必須加上以下三個要素，缺一不可**：

1. **屬性**：`selection="single"`
2. **header 插槽**：`#header="props"` — 自訂表頭以加入選取欄
3. **selection 插槽**：`#body-selection="scope"` — 使用 Radio 顯示單選

**重要**：若沒有加上 `#body-selection` 插槽，樣式會變成錯誤的 Checkbox，而非正確的 Radio。

```vue
<CxlTable
  v-model:pagination="pagination"
  v-model:selected="selected"
  class="cxl-table-ts"
  :rows="rows"
  :columns="columns"
  row-key="id"
  selection="single"
  separator="cell"
  :flat="false"
  :rows-per-page-options="[0]"
  :hide-bottom="rows.length > 0"
  virtual-scroll
>
  <template #header="props">
    <q-tr class="cxl-table-header" :props="props">
      <q-th auto-width>選取</q-th>
      <q-th v-for="col in props.cols" :key="col.name" :props="props">
        {{ col.label }}
      </q-th>
    </q-tr>
  </template>
  <template #body-selection="scope">
    <div class="row items-center justify-center">
      <q-radio v-model="scope.selected" :val="true" dense />
    </div>
  </template>
</CxlTable>
```

**#header 插槽**：`props.cols` 為欄位定義陣列，`<q-th auto-width>` 讓選取欄寬自動適應。

**#body-selection 插槽**：`scope.selected` 為該列是否被選取的雙向綁定值（Boolean），必須使用 `q-radio`（非 `q-checkbox`）。

---

## 進階功能

### 自訂 Cell Slot

```vue
<CxlTable :rows="data" :columns="columns">
  <template #body-cell-action="props">
    <q-td :props="props">
      <CxlButton label="編輯" @click="edit(props.row)" />
    </q-td>
  </template>
</CxlTable>
```

### 虛擬滾動（大量資料）

```vue
<CxlTable
  :rows="largeData"
  :columns="columns"
  virtual-scroll
  :rows-per-page-options="[0]"
/>
```

### 拖曳排序（Sortable.js）

```javascript
import Sortable from 'sortablejs'
import { onMounted, ref as templateRef } from 'vue'

const tableRef = templateRef('tableRef')

onMounted(() => {
  const tbody = tableRef.value.$el.querySelector('tbody')
  Sortable.create(tbody, {
    animation: 150,
    onEnd: ({ oldIndex, newIndex }) => {
      const item = tableData.value.splice(oldIndex, 1)[0]
      tableData.value.splice(newIndex, 0, item)
    }
  })
})
```

---

## 密集資料顯示

適用於 7+ 欄位的詳細資料展示。

### 版本決策

| 元件庫版本 | 推薦寫法 |
|-----------|---------|
| `vue-cathaylife-component` >= 2.4.0 | `q-markup-table` + `cxl-table-form`（新版） |
| `vue-cathaylife-component` < 2.4.0 | `cxl-form-column` + `cxl-form-grid`（舊版） |

> ⚠️ 使用新版寫法前，請確認 `package.json` 中 `vue-cathaylife-component` 版本 >= 2.4.0。若版本不符，請使用舊版寫法。

📖 **完整範例**：參考本 skill 的 `dense-data-display` reference

## Separator 視覺差異

| 值 | 說明 |
|----|------|
| `horizontal` | 僅水平線（預設）|
| `vertical` | 僅垂直線 |
| `cell` | 水平+垂直，完整格線 |
| `none` | 無分隔線 |

## 最佳實踐

- 表格必須指定 `row-key`
- 金額欄位使用 `align: 'right'` + `toLocaleString()` 格式化
- 大量資料（100+ 筆）考慮 `virtual-scroll`
- TS 版加 `class="cxl-table-ts"`
