---
name: cathay-page-layout
description: "Use when planning or reviewing Cathay admin page layout: query criteria tables, result sections, dense data display, required-field markers, button grouping, CxlBreadcrumbs plus cxl-title-h1 page header, q-card containers, and field-count based display decisions."
version: "1.2.0" # 語義化版本號 (Semantic Versioning)
id: "cathay-page-layout.skill" # 唯一的Prompt識別碼
author: "張立賢" # 作者
type: "skill" # 分類
lvl: "feature" # 層級(copilot層級 > bundle層級 > feature層級)
bundle: "CathayBoostFrontendVue" # 所屬bundle
tag: ["skill", "layout", "page", "ux", "design", "cathay", "frontend", "vue"] # 相關標籤
created_date: "2026-03-03" # 建立日期
last_modified: "2026-07-01" # 最後修改日期
---

# 頁面佈局與 UX 指南

## 資料呈現元件決策

根據資料顯示需求與欄位數量選擇適當的呈現方式。

| 欄位數量 | 元件選擇 | 適用場景 | CSS Class |
|---------|---------|---------|----------|
| ≤ 6 | `q-markup-table` | 查詢條件、簡單資料顯示 | `cxl-table cxl-table-horizontal` |
| ≥ 7 | `q-markup-table` | 密集資料顯示（元件庫 >= 2.4.0）| `cxl-table-form` |
| ≥ 7 | `<div>` 結構 | 密集資料顯示（元件庫 < 2.4.0）| `cxl-form-column` + `cxl-form-grid` |
| 動態列表 | `CxlTable` | 可排序、分頁、選取的資料表格 | — |
| 區塊分隔 | `q-card` | 卡片式佈局容器 | `cxl-card` |

**注意**：計算欄位數量時，不包含按鈕操作列。

**密集顯示格式詳見**：`cathay-table` skill 的「密集資料顯示」章節。

---

## 頁面頂部標準結構

**未特別指示時**，生成或審查頁面必須確認頂部含有以下兩元素，且順序不可對調：

```vue
<CxlBreadcrumbs :breadcrumbs="navCollection" :routerPath="$route.path" :rootPath="rootPath" />
<div class="cxl-title-h1 q-mt-md">頁面標題</div>
```

| 元素 | 說明 |
|--------|------|
| `CxlBreadcrumbs` | 導覽列，提供頁面位置相關資訊 |
| `<div class="cxl-title-h1 q-mt-md">` | 頁面主標題，每頁僅允許一個 |

---

## 查詢頁面佈局

### 標準結構：搜尋條件 + 結果

```vue
<template>
  <CxlBreadcrumbs :breadcrumbs="navCollection" :routerPath="$route.path" :rootPath="rootPath" />
  <div class="cxl-title-h1 q-mt-md">查詢頁面</div>

  <!-- 搜尋條件區 -->
  <q-markup-table
    class="cxl-table cxl-table-horizontal q-mt-md"
    square
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
        <td><CxlInput v-model="form.divNo" placeholder="請輸入" /></td>
        <th>姓名</th>
        <td><CxlInput v-model="form.name" placeholder="請輸入" /></td>
      </tr>
      <tr>
        <td colspan="4">
          <div class="q-gutter-sm row justify-center">
            <CxlButton label="查詢" @click="doQuery" />
            <CxlButton label="清除" theme="primary-outline" @click="clearForm" />
          </div>
        </td>
      </tr>
    </tbody>
  </q-markup-table>

  <!-- 結果表格 -->
  <CxlTable :rows="results" :columns="columns" row-key="id" class="q-mt-md" />
</template>
```

---

## 按鈕位置與視覺分組

### 核心原則：避免孤島效應

**按鈕應該與其操作的內容視覺上連貫**，避免孤立地漂浮在頁面上。

| 情境 | 按鈕位置 | 理由 |
|------|---------|------|
| 查詢條件表格 | 放在表格內（`<tr><td colspan="N">`） | 與查詢條件視覺分組 |
| 資料顯示表格上方 | 放在獨立 `<div>` 並置中 | 屬於表格操作，可獨立區域 |

### 正確與錯誤示範

**✅ 正確：按鈕與查詢條件視覺分組**
```vue
<q-markup-table class="cxl-table cxl-table-horizontal">
  <tbody>
    <tr>
      <th>人員編號</th>
      <td><CxlInput v-model="preId" /></td>
    </tr>
    <!-- 按鈕放在表格內 -->
    <tr>
      <td colspan="4">
        <div class="row justify-center q-gutter-sm">
          <CxlButton label="查詢" />
          <CxlButton label="清除" theme="primary-outline" />
        </div>
      </td>
    </tr>
  </tbody>
</q-markup-table>
```

**❌ 錯誤：按鈕孤立在表格外，產生孤島效應**
```vue
<q-markup-table class="cxl-table cxl-table-horizontal">
  <tbody>
    <tr>
      <th>人員編號</th>
      <td><CxlInput v-model="preId" /></td>
    </tr>
  </tbody>
</q-markup-table>

<!-- ❌ 按鈕獨立在外，視覺上與表格脫離 -->
<div class="row justify-center q-gutter-sm q-mt-md">
  <CxlButton label="查詢" />
  <CxlButton label="清除" theme="primary-outline" />
</div>
```

**說明**：
- 查詢/清除按鈕 → 與查詢條件表格視覺連貫
- 新增/刪除/匯出按鈕 → 獨立區域，清楚表示是對結果表格的操作
- 避免所有按鈕擠在同一列造成混淆

---

## 按鈕排列規則

按鈕按**業務流程順序**從左到右排列，分為 5 類：

| 順序 | 類別 | 常見按鈕 |
|------|------|---------|
| 1 | 資訊查詢 | 查詢、檢視、狀態查詢 |
| 2 | 資料操作 | 新增、修改、暫存、試算 |
| 3 | 流程控制 | 提交、送出、同意、退回 |
| 4 | 破壞性操作 | 刪除、清除、結案 |
| 5 | 導航操作 | 回上頁、取消、回一覽 |

### 排列範例

```vue
<!-- [查詢, 清除] → 類別 1-4（查詢條件區域常見） -->
<div class="q-gutter-sm row justify-center">
  <CxlButton label="查詢" />
  <CxlButton label="清除" theme="primary-outline" />
</div>

<!-- [查詢, 新增, 刪除] → 類別 1-2-4 -->
<div class="q-gutter-sm row justify-center">
  <CxlButton label="查詢" />
  <CxlButton label="新增" />
  <CxlButton label="刪除" theme="danger" />
</div>

<!-- [暫存, 送出] → 類別 2-3 -->
<div class="q-gutter-sm row justify-center">
  <CxlButton label="暫存" theme="primary-outline" />
  <CxlButton label="送出" />
</div>

<!-- [修改, 提交, 回上頁] → 類別 2-3-5 -->
<div class="q-gutter-sm row justify-center">
  <CxlButton label="修改" />
  <CxlButton label="提交" />
  <CxlButton label="回上頁" theme="primary-outline" />
</div>

<!-- [檢視, 試算, 送出, 清除, 取消] → 類別 1-2-3-4-5 -->
<div class="q-gutter-sm row justify-center">
  <CxlButton label="檢視" theme="primary-outline" />
  <CxlButton label="試算" />
  <CxlButton label="送出" />
  <CxlButton label="清除" theme="danger" />
  <CxlButton label="取消" theme="primary-outline" />
</div>
```

### 按鈕 Theme 對應

| 動作類型 | Theme |
|---------|-------|
| 主要操作（查詢/確認/下一步）| `primary` |
| 次要操作（清除/取消/上一步）| `primary-outline` |
| 危險操作（刪除/移除）| `danger` |
| 警告操作 | `warning` |

---

## 必填欄位標記

### 在 q-markup-table 中

```vue
<th>
  <span class="cxl-text-danger">*</span> 保單號碼
</th>
```

### 在 cxl-form-grid 中

```vue
<div class="row cxl-form-grid">
  <div class="row col-4">
    <div class="col-4 cxl-form-label">
      <span class="cxl-text-danger">*</span> 聯絡電話
    </div>
    <div class="col-8 cxl-form-content">
      <CxlInput v-model="phone" />
    </div>
  </div>
</div>
```

---

## 密集資料顯示

適用於 7+ 欄位的詳細資料展示。

> 📖 完整用法請參考 `cathay-table` skill 的「密集資料顯示」章節，包含版本決策和新舊寫法範例。

### 快速參照

| 元件庫版本 | 推薦寫法 |
|-----------|---------|
| >= 2.4.0 | `q-markup-table` + `cxl-table-form` |
| < 2.4.0 | `cxl-form-column` + `cxl-form-grid` |

---

## 間距規則

| 元素間 | 使用 |
|--------|------|
| 標題與內容 | `q-mb-md` |
| 查詢區與按鈕 | `q-mb-md` |
| 按鈕與表格 | `q-mb-md` |
| 按鈕之間 | `q-gutter-sm` |
| 區塊之間 | `q-mb-lg` |

---

## 元件優先級

```
1. 國泰元件庫 (Cxl*)          — 最高
2. Quasar + 國泰 CSS          — 次要
3. 原生 HTML + Quasar utility — 最後
```

## 關鍵約束

- 未特別指示時，頁面頂部須依序包含 `CxlBreadcrumbs` + `<div class="cxl-title-h1 q-mt-md">`
- 每頁僅一個 `<h1>` / `cxl-title-h1`
- 自訂 style/CSS 僅在國泰 CSS 與 Quasar utility 無法滿足，且使用者明確要求時使用
- 行內樣式原則上不使用；密集表格 `<col style="width: ...">` 例外
- 使用 Quasar spacing classes，禁止自定義 margin/padding
- 禁止多斷點響應式設計和 `@media` queries
