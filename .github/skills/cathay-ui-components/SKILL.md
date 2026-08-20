---
name: cathay-ui-components
description: "Use when implementing or reviewing Cathay UI components beyond form/table/modal patterns: CxlButton theme/icons/badges, CxlCalendar with CxlInput and CxlPopupProxy, CxlTabs, q-card with cxl-card, CxlBreadcrumbs, CxlStepper, CxlKeyboard, CxlBadge, CxlTag, CxlCarousel, CxlUploader, or $notify."
version: "1.1.0" # 語義化版本號 (Semantic Versioning)
id: "cathay-ui-components.skill" # 唯一的Prompt識別碼
author: "張立賢" # 作者
type: "skill" # 分類
lvl: "feature" # 層級(copilot層級 > bundle層級 > feature層級)
bundle: "CathayBoostFrontendVue" # 所屬bundle
tag: ["skill", "button", "calendar", "tabs", "ui", "cathay", "frontend", "vue"] # 相關標籤
created_date: "2026-03-03" # 建立日期
last_modified: "2026-07-01" # 最後修改日期
---

# 國泰 UI 元件集合

> **低頻元件**詳見本 skill 的 `extended-components` reference：
> CxlCropper、CxlLoading、CxlUploader、CxlPaginator、CxlCarousel、CxlBreadcrumbs、CxlStepper、CxlKeyboard、CxlBadge、CxlBadgeTs、CxlTag、CxlToolbarTs

---

## CxlButton — 按鈕

> **Quasar 透傳**：CxlButton 封裝 `q-btn`，未列出的 `q-btn` 屬性（如 `disabled`、`round`、`loading`）均可直接使用。

### 版本區分

- 標準版：預設
- TS 版：加上 `class="cxl-btn-ts"`

### ❗ 內部固定屬性（修改無效）

| 屬性 | 內部固定值 | 說明 |
|------|----------|------|
| `flat` | `true` | 按鈕樣式由 theme 控制，設定 flat 會被忽略 |
| `class` | 自動計算 | 被 `cxl-btn` + themeClass 覆蓋（可額外加 `cxl-btn-ts`）|

### ❗ 插槽使用限制

| 插槽 | 狀態 | 說明 |
|------|------|------|
| `#default` | ⚠️ 有限制 | 內容會**追加**在 prevIcon/label/nextIcon/number 之後，非獨佔使用 |
| `#loading` | ✅ 支援 | 可自訂 loading 狀態內容 |
| `#before` | ❌ 無效 | q-btn 有此 slot 但 CxlButton 未傳遞 |
| `#after` | ❌ 無效 | q-btn 有此 slot 但 CxlButton 未傳遞 |

### 核心屬性

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `label` | String | `''` | 按鈕文字 |
| `theme` | String | `'primary'` | 主題樣式（見下方表格）|
| `prevIcon` | String | `''` | 前置圖標 |
| `nextIcon` | String | `''` | 後置圖標 |
| `stack` | Boolean | `false` | 圖標與文字垂直排列 |
| `number` | String | `''` | 數字標記 |
| `card` | Boolean | `false` | 卡片式按鈕（僅 TS 版）|

### Theme 選項

| Theme | 說明 |
|-------|------|
| `primary` | 綠底白字（主要操作）|
| `primary-outline` | 綠框綠字（次要操作）|
| `warning` | 橘底白字 |
| `warning-outline` | 橘框橘字 |
| `danger` | 紅底白字（危險操作）|
| `danger-outline` | 紅框紅字 |

### 基本用法

```vue
<CxlButton label="確認" @click="handleConfirm" />
<CxlButton label="取消" theme="primary-outline" @click="handleCancel" />
<CxlButton label="刪除" theme="danger" @click="handleDelete" />
```

### 圖標按鈕

```vue
<CxlButton label="下載" prevIcon="cub-icon-download" />
<CxlButton round theme="primary-outline" prevIcon="cub-icon-search" />
```

### 數字徽章

```vue
<CxlButton label="通知" number="5" />
```

**注意**：
- 使用 `theme` 屬性，不是 `color`
- CxlButton 預設 `theme="primary"`，主要操作可省略該屬性
- 次要/危險操作必須明確指定 theme（如 `primary-outline`、`danger`）

---

## CxlCalendar — 日曆選擇器

> **Quasar 透傳**：CxlCalendar 封裝 `q-date`，未列出的 `q-date` 屬性（如 `minimal`、`multiple`、`range`）均可直接使用。

### 核心規則

**必須搭配 CxlInput + CxlPopupProxy 使用**，不可單獨使用。

### 基本用法（西元）

```vue
<CxlInput v-model="selectedDate" placeholder="請選擇日期">
  <template #append>
    <span class="cxl-icon-calendar-ts cursor-pointer">
      <CxlPopupProxy>
        <CxlCalendar v-model="selectedDate" />
      </CxlPopupProxy>
    </span>
  </template>
</CxlInput>
```

### 民國年

```vue
<CxlInput v-model="rocDate" placeholder="請選擇日期">
  <template #append>
    <span class="cxl-icon-calendar-ts cursor-pointer">
      <CxlPopupProxy>
        <CxlCalendar v-model="rocDate" calendar="ROC" outputType="ROC" minimal />
      </CxlPopupProxy>
    </span>
  </template>
</CxlInput>
```

**民國年 mask 規則**：民國年用 `YYY`（三碼），西元年用 `YYYY`（四碼）。

### 核心屬性

| 屬性 | 類型 | 預設 | 說明 |
|------|------|------|------|
| `calendar` | String | `'gregorian'` | 顯示模式：`'gregorian'`（西元）或 `'ROC'`（民國）|
| `outputType` | String | `'gregorian'` | 輸出格式：`'gregorian'` 或 `'ROC'`（與 calendar 獨立設定）|
| `defaultView` | String | `'Calendar'` | 預設視圖：`'Calendar'`、`'Years'`、`'Months'` |
| `pickMode` | String | `''` | 選擇模式：`''`(正常)、`'Years'`(單選年)、`'Months'`(單選月)、`'YearsMonths'`(選年月)|
| `emitImmediately` | Boolean | false | 選擇後立即回傳，必須配合 `pickMode`（不可用於 multiple/range）|
| `mask` | String | `'YYYY/MM/DD'` | 日期格式遮罩 |
| `title` | String | `''` | 自訂標題（空字串為預設行為）|

### 透傳屬性（常用）

以下屬性透傳至 `q-date`，可直接使用：

| 屬性 | 說明 |
|------|------|
| `minimal` | 精簡模式 |
| `multiple` | 多選日期 |
| `range` | 日期範圍（v-model 為 `{ from, to }`）|

### 選年月模式範例

```vue
<CxlInput v-model="date">
  <template #append>
    <span class="cxl-icon-calendar-ts cursor-pointer">
      <CxlPopupProxy>
        <CxlCalendar v-model="date" mask="YYYY/MM" pickMode="YearsMonths" defaultView="Years" emitImmediately />
      </CxlPopupProxy>
    </span>
  </template>
</CxlInput>
```

### 日期範圍驗證

```vue
<CxlField :error="!!errorMessage" :error-message="errorMessage">
  <div class="q-gutter-md row items-center">
    <CxlInput v-model="dateRange.from" placeholder="起始日" />
    <span>至</span>
    <CxlInput v-model="dateRange.to" placeholder="結束日">
      <template #append>
        <span class="cxl-icon-calendar-ts cursor-pointer">
          <CxlPopupProxy>
            <CxlCalendar v-model="dateRange" range />
          </CxlPopupProxy>
        </span>
      </template>
    </CxlInput>
  </div>
</CxlField>
```

```javascript
const dateRange = ref({ from: '', to: '' })
const errorMessage = computed(() => {
  if (!dateRange.value.from || !dateRange.value.to) return ''
  if (dateRange.value.from > dateRange.value.to) return '結束日不可早於起始日'
  return ''
})
```

---

## CxlTabs — 頁籤

### 標準版

```vue
<CxlTabs v-model:currentTab="activeTab" :tabs="tabList">
  <q-tab-panel name="tab1"><p>內容一</p></q-tab-panel>
  <q-tab-panel name="tab2"><p>內容二</p></q-tab-panel>
</CxlTabs>
```

```javascript
const activeTab = ref('tab1')
const tabList = ref([
  { name: 'tab1', label: '基本資料' },
  { name: 'tab2', label: '聯絡資訊' },
])
```

### 核心屬性

| 屬性 | 類型 | 說明 |
|------|------|------|
| `v-model:currentTab` | String | 當前選中頁籤 |
| `tabs` | Array | 頁籤定義（見下方屬性表）|
| `isYellowStyle` | Boolean | 黃色風格（預設綠色）|

### tabs 陣列物件屬性

| 屬性 | 類型 | 說明 |
|------|------|------|
| `name` | String | 唯一識別名稱，對應 `q-tab-panel` 的 name |
| `label` | String | 頁籤顯示文字 |
| `number` | Number/String | 頁籤旁的數字標記 |
| `disable` | Boolean | 是否禁用 |
| `hide` | Boolean | 是否隱藏 |

### Slots 與事件

| 項目 | 說明 |
|------|------|
| `#tabs-append` | 頁籤列右側額外內容（文字或按鈕）|
| `@buttonClick` | 頁籤點擊時觸發（參數為 tabName）|

### TS 版（CxlTabsTs / CxlSubTabsTs）

| 元件 | 樣式 | 說明 |
|------|------|------|
| `CxlTabsTs` | 綠色 | 行動版主要頁籤 |
| `CxlSubTabsTs` | 淺黃色方形 | 行動版次級頁籤，支援狀態圖標 |

用法與 CxlTabs 皆相同，差別在於樣式與 tabs 陣列可使用的額外屬性。

**CxlSubTabsTs tabs 額外屬性**：

| 屬性 | 類型 | 說明 |
|------|------|------|
| `iconType` | String | 狀態圖示：`'info'`、`'finish'`、`'warning'`、`'error'`、`'disabled'` |
| `number` | Number/String | 同時帶入 iconType 和 number 時，顯示帶狀態圖示的數字 |

```vue
<CxlSubTabsTs v-model:currentTab="activeTab" :tabs="tabList">
  <q-tab-panel name="tab1"><p>內容一</p></q-tab-panel>
  <q-tab-panel name="tab2"><p>內容二</p></q-tab-panel>
</CxlSubTabsTs>
```

```javascript
const activeTab = ref('tab1')
const tabList = ref([
  { name: 'tab1', label: '已完成', iconType: 'finish' },
  { name: 'tab2', label: '待處理', iconType: 'warning', number: 3 },
])
```

---

## 卡片容器（q-card + CSS）

**不存在 CxlCard**，使用 Quasar 搭配國泰 CSS：

```vue
<!-- 標準卡片 -->
<q-card class="cxl-card q-pa-md">
  <h3 class="cxl-h3">標題</h3>
  <p>內容</p>
</q-card>

<!-- 無陰影卡片 -->
<q-card class="cxl-card-flat q-pa-md">內容</q-card>

<!-- 大區塊 -->
<q-card class="cxl-jumbotron q-pa-lg">內容</q-card>

<!-- TS 版 -->
<q-card class="cxl-card-ts q-pa-md">內容</q-card>
```

---

## $notify — 通知訊息

### 導入與使用

```vue
<script setup>
import { inject } from 'vue'
const $notify = inject('$notify')

$notify.info('已複製到剪貼簿')
$notify.success('儲存成功')
$notify.error('操作失敗')
$notify.warning('請注意')
```

### 自訂停留時間

```javascript
$notify.info('處理中', 1000)  // 1 秒後消失（預設 3 秒）
```

**重要**：CathayAxios 已內建錯誤通知，API 失敗時**不需要**手動調用 `$notify.error()`。
