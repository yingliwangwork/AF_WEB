---
description: "密集資料顯示參考 - 7+ 欄位詳細資料展示寫法"
version: "1.1.0" # 語義化版本號 (Semantic Versioning)
id: "dense-data-display.reference" # 唯一的Prompt識別碼
author: "張立賢" # 作者
type: "reference" # 分類
lvl: "feature" # 層級(copilot層級 > bundle層級 > feature層級)
bundle: "CathayBoostFrontendVue" # 所屬bundle
tag: ["reference", "table", "dense-data", "layout", "cathay", "frontend", "vue"] # 相關標籤
created_date: "2026-03-03" # 建立日期
last_modified: "2026-07-01" # 最後修改日期
---

# 密集資料顯示

適用於 7+ 欄位的詳細資料展示。

## 版本決策

| 元件庫版本 | 推薦寫法 |
|-----------|---------|
| `vue-cathaylife-component` >= 2.4.0 | `q-markup-table` + `cxl-table-form`（新版） |
| `vue-cathaylife-component` < 2.4.0 | `cxl-form-column` + `cxl-form-grid`（舊版） |

> ⚠️ 使用新版寫法前，請確認 `package.json` 中 `vue-cathaylife-component` 版本 >= 2.4.0。若版本不符，請使用舊版寫法。

---

## 新版寫法（>= 2.4.0）：q-markup-table + cxl-table-form

使用 `q-markup-table` 搭配 `cxl-table-form` class，結構更簡潔。

> `<col style="width: ...">` 是密集表格控制欄寬的允許例外；其他樣式仍優先使用國泰 CSS 與 Quasar utility class。

### 基本結構

```vue
<q-markup-table class="cxl-table-form" flat bordered separator="horizontal">
  <!-- 使用 colgroup 控制欄位寬度比例 -->
  <colgroup>
    <col style="width: 10%" />
    <col style="width: 23%" />
    <col style="width: 10%" />
    <col style="width: 23%" />
    <col style="width: 10%" />
    <col style="width: 23%" />
  </colgroup>
  <tbody>
    <tr>
      <th>保單號碼</th>
      <td>1234567891</td>
      <th>契約效力</th>
      <td>正常</td>
      <th>險別</th>
      <td>LS 終身壽險</td>
    </tr>
    <tr>
      <th>要保人</th>
      <td>王小明</td>
      <th>要保人國籍</th>
      <td>TW-中華民國</td>
      <th>要保人生日</th>
      <td>83/01/31</td>
    </tr>
  </tbody>
</q-markup-table>
```

### 帶標題（thead）

```vue
<q-markup-table class="cxl-table-form" flat bordered separator="horizontal">
  <colgroup>
    <col style="width: 10%" />
    <col style="width: 23%" />
    <col style="width: 10%" />
    <col style="width: 23%" />
    <col style="width: 10%" />
    <col style="width: 23%" />
  </colgroup>
  <thead>
    <tr>
      <th colspan="6" class="cxl-form-title">保單詳細資料</th>
    </tr>
  </thead>
  <tbody>
    <!-- rows -->
  </tbody>
</q-markup-table>
```

> 注意：`thead` 為選用，僅在使用者要求時加入。

### 跨欄與混合編輯

```vue
<tbody>
  <!-- 跨欄顯示 -->
  <tr>
    <th>較長欄位</th>
    <td colspan="3">較長的內容顯示</td>
    <th>短欄位</th>
    <td>短內容</td>
  </tr>
  <!-- 混合編輯 -->
  <tr>
    <th>聯絡電話</th>
    <td>
      <CxlInput v-model="phone" />
    </td>
    <th>備註</th>
    <td colspan="3">
      <CxlTextarea v-model="note" dense auto-grow />
    </td>
  </tr>
</tbody>
```

---

## 舊版寫法（< 2.4.0）：cxl-form-column + cxl-form-grid

適用於元件庫版本 < 2.4.0 或新版寫法無效時的後備方案。

**注意**：必須包含 `row` class，使用 `cxl-form-label` 和 `cxl-form-content`。

### 唯讀模式

```vue
<div class="cxl-form-column">
  <div class="row cxl-form-grid">
    <div class="row col-4">
      <div class="col-4 cxl-form-label">姓名</div>
      <div class="col-8 cxl-form-content">{{ userName }}</div>
    </div>
    <div class="row col-4">
      <div class="col-4 cxl-form-label">部門</div>
      <div class="col-8 cxl-form-content">{{ department }}</div>
    </div>
    <div class="row col-4">
      <div class="col-4 cxl-form-label">電話</div>
      <div class="col-8 cxl-form-content">{{ phone }}</div>
    </div>
  </div>
</div>
```

### 混合編輯模式

```vue
<div class="cxl-form-column">
  <div class="row cxl-form-grid">
    <!-- 唯讀欄位 -->
    <div class="row col-4">
      <div class="col-4 cxl-form-label">保單號碼</div>
      <div class="col-8 cxl-form-content">1234567891</div>
    </div>
    <!-- 可編輯欄位 -->
    <div class="row col-4">
      <div class="col-4 cxl-form-label">聯絡電話</div>
      <div class="col-8 cxl-form-content">
        <CxlInput v-model="phone" />
      </div>
    </div>
    <div class="row col-4">
      <div class="col-4 cxl-form-label">收件方式</div>
      <div class="col-8 cxl-form-content">
        <CxlDropdown v-model="method" :options="options" map-options emit-value />
      </div>
    </div>
  </div>
</div>
```

### 寬欄位變化

```vue
<!-- 單欄跨多格 -->
<div class="row cxl-form-grid">
  <div class="row col-8">
    <div class="col-2 cxl-form-label">備註</div>
    <div class="col-10 cxl-form-content">
      <CxlTextarea v-model="note" />
    </div>
  </div>
</div>
```
