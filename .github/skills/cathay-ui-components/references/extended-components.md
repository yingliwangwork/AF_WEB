---
description: "延伸 UI 元件參考 - 低頻元件完整用法"
version: "1.1.0" # 語義化版本號 (Semantic Versioning)
id: "extended-components.reference" # 唯一的Prompt識別碼
author: "張立賢" # 作者
type: "reference" # 分類
lvl: "feature" # 層級(copilot層級 > bundle層級 > feature層級)
bundle: "CathayBoostFrontendVue" # 所屬bundle
tag: ["reference", "ui", "cropper", "loading", "uploader", "cathay", "frontend", "vue"] # 相關標籤
created_date: "2026-03-03" # 建立日期
last_modified: "2026-07-01" # 最後修改日期
---

# 延伸 UI 元件參考

以下元件使用頻率較低，需要時參考此文件。

---

## CxlCropper — 圖片裁切

**前置準備**：先檢查 `package.json` 是否已安裝 `cropperjs`。若未安裝，先向使用者確認是否可新增 dependency；未取得確認前不得執行安裝。

```bash
# 使用專案既有 package manager 安裝；需先取得使用者確認。
```

### 基本用法

```vue
<CxlCropper modalTitle="請選擇裁切範圍" @getCroppedImage="getCroppedImage" />
<img :src="previewImage" />
```

```javascript
const previewImage = ref('')

// 裁切完成後取得 base64 圖片
const getCroppedImage = (croppedImage) => {
  previewImage.value = croppedImage
}
```

---

## CxlLoading — 載入指示器

### 版本區分

| 版本 | 使用方式 |
|------|----------|
| 標準版 | `<CxlLoading />` |
| TS版 | `<CxlLoading class="cxl-loading-ts" />` |

### 核心屬性

| 屬性 | 類型 | 預設 | 說明 |
|------|------|------|------|
| `display` | Boolean | false | 控制顯示/隱藏 |
| `label` | String | '' | 載入文字 |

### 基本用法

```vue
<CxlLoading label="載入中" :display="isLoading" />
```

---

## CxlUploader — 檔案上傳

### 核心事件

| 事件 | 說明 |
|------|------|
| `@getFiles` | 檔案異動時觸發，參數為 FormData |
| `@uploadFiles` | 點擊上傳按鈕時觸發 |

### 方法（透過 ref 呼叫）

| 方法 | 說明 |
|------|------|
| `clear()` | 清除所有檔案 |

### 基本用法

```vue
<CxlUploader ref="refUploader" name="files" @getFiles="getFiles" @uploadFiles="uploadFiles" />
<CxlButton label="清除" @click="refUploader.clear()" />
```

```javascript
const $cathayAxios = inject('$cathayAxios')
const refUploader = ref(null)
const files = ref(null)

const getFiles = (formData) => {
  if (formData.keys().next().done) {
    // TODO: 顯示無檔案提示或維持既有 UI 狀態
    return
  }
  files.value = formData
}

const uploadFiles = () => {
  $cathayAxios.upload(URL, files.value).then((resp) => {
    // TODO: 處理上傳結果
  })
}
```

---

## CxlCarousel — 輪播

```vue
<CxlCarousel v-model="currentSlide" :datas="slides" autoplay infinite arrows navigation />
```

```javascript
const currentSlide = ref('1')
const slides = ref([
  { name: '1', img: '/images/banner1.jpg' },
  { name: '2', img: '/images/banner2.jpg' },
])
```

### 多圖輪播

```vue
<CxlCarousel v-model="slide" :datas="[]" arrows navigation>
  <q-carousel-slide name="0" class="row no-wrap">
    <q-img src="/img1.jpg" class="col-4 q-px-xs" />
    <q-img src="/img2.jpg" class="col-4 q-px-xs" />
    <q-img src="/img3.jpg" class="col-4 q-px-xs" />
  </q-carousel-slide>
</CxlCarousel>
```

---

## CxlBreadcrumbs — 麵包屑（僅標準版）

```vue
<CxlBreadcrumbs
  :breadcrumbs="navCollection"
  :routerPath="$route.path"
  :rootPath="{ label: '首頁', url: '/' }"
/>
```

- `breadcrumbs`：來自 `@/service/NavCollection.js`
- `rootPath`：必須手動指定，格式為 `{ label: '首頁', url: '/' }`

---

## CxlStepper — 步驟進度

### 版本區分

| 版本 | 使用方式 |
|------|---------|
| 標準版 | `<CxlStepper />` |
| 行動版 | `<CxlStepper class="cxl-stepper-ts" />` |

### 標準版

```vue
<CxlStepper ref="stepper" v-model="step" :steps="stepList" />
<CxlButton label="上一步" @click="stepper.previousStep()" />
<CxlButton label="下一步" @click="stepper.nextStep()" />
```

```javascript
const stepper = ref(null)
const step = ref(1)
const stepList = reactive([
  { counter: 1, title: '基本資料' },
  { counter: 2, title: '確認資訊' },
  { counter: 3, title: '完成' },
])
```

### 方法（透過 ref 呼叫）

| 方法 | 說明 |
|------|------|
| `previousStep()` | 回到上一步 |
| `nextStep()` | 前進下一步 |
| `setStepStatus(step, options)` | 設定步驟狀態（如 title, done, edit）|

### Steps 屬性

| 屬性 | 類型 | 說明 |
|------|------|------|
| `counter` | Number | 步驟編號 |
| `title` | String | 步驟標題 |
| `edit` | Boolean | 顯示驚嘆號（需修改）|
| `done` | Boolean | 顯示勾勾（已完成）|
| `disable` | Boolean | 顯示禁止 |

### 事件

| 事件 | 說明 |
|------|------|
| `@clickStep` | 點擊步驟圈圈時觸發 |

### TS 版（行動版）

TS 版加上 `class="cxl-stepper-ts"`，額外支援右側操作按鈕：

| 屬性 | 類型 | 說明 |
|------|------|------|
| `actions` | Object | 右方三個按鈕狀態：`{ check: { show, disable }, upload: { show, disable }, view: { show, disable } }` |

| TS 事件 | 說明 |
|---------|------|
| `@stepCheck` | 檢核按鈕點擊 |
| `@stepUpload` | 資料上傳按鈕點擊 |
| `@stepView` | 檢視按鈕點擊 |

| TS Slot | 說明 |
|---------|------|
| `#extra-actions` | 加入額外自訂按鈕 |

```vue
<CxlStepper
  ref="stepper"
  v-model="step"
  class="cxl-stepper-ts"
  :steps="steps"
  :actions="actions"
  @stepCheck="handleCheck"
  @stepUpload="handleUpload"
  @stepView="handleView"
/>
```

```javascript
const actions = ref({
  check: { show: true, disable: false },
  upload: { show: false, disable: false },
  view: { show: true, disable: true },
})
```

---

## CxlKeyboard — 虛擬鍵盤

**v-model 為 Boolean**，控制鍵盤顯示/隱藏。輸入值透過 `@confirm` 事件回傳。

**注意拼字差異**：標準版用 `suffle`（單 f），TS 版用 `shuffle`（雙 f）。

### 標準版

```vue
<CxlKeyboard
  v-model="isOpen"
  title="請輸入密碼"
  :maxLength="6"
  suffle
  @confirm="handleConfirm"
  @cancel="handleCancel"
/>
```

### TS 版

```vue
<CxlKeyboardTs
  v-model="showKeyboard"
  title="請輸入密碼"
  :maxLength="6"
  shuffle
  password
  @confirm="handleConfirm"
/>
```

TS 版額外屬性：`password`（密碼模式）、`hideCloseButton`、`persistent`

---

## CxlBadge / CxlBadgeTs — 徽章

### 標準版

| 屬性 | 類型 | 預設 | 說明 |
|------|------|------|------|
| `text` | String | '徽章' | 徽章文字 |
| `theme` | String | 'primary' | 顏色：`primary`、`primary-light`、`warn`、`info`、`neutral` 等 |
| `shape` | String | 'rectangle' | 形狀：`rectangle`、`circle` |
| `maxNumber` | Number | 99 | 圓形時最大值（超過顯示 99+）|

```vue
<CxlBadge text="NEW" />
<CxlBadge text="120" theme="warn" shape="circle" :maxNumber="99" />
```

### TS 版

| 屬性 | 類型 | 說明 |
|------|------|------|
| `label` | String | 標籤文字 |
| `theme` | String | 背景顏色 class：`cxl-bg-primary`、`cxl-bg-info`、`cxl-bg-warning`、`cxl-bg-danger`、`cxl-bg-gray-a7` |
| `size` | String | 尺寸：`lg`(預設)、`sm` |
| `isFirstOrLast` | Boolean | v-for 中的首/尾處理（用於圓角）|

**isFirstOrLast 規則**：
- `size="lg"` 時：`index === badges.length - 1`（最後一個）
- `size="sm"` 時：`index === 0`（第一個）

```vue
<CxlBadgeTs
  v-for="(badge, index) in badges"
  :key="badge.id"
  :label="badge.label"
  :theme="badge.theme"
  size="lg"
  :isFirstOrLast="index === badges.length - 1"
/>
```

```javascript
const badges = ref([
  { id: '1', label: '保戶已處理', theme: 'cxl-bg-primary' },
  { id: '2', label: '即將到期', theme: 'cxl-bg-danger' },
])
```

---

## CxlTag — 狀態標籤（僅 TS 版）

| 屬性 | 類型 | 預設 | 說明 |
|------|------|------|------|
| `type` | String | 'success' | 色系：`success`(綠)、`warning`(橘)、`error`(紅) |
| `theme` | String | 'none' | 背景：`none`(無背景)、`light`(淺色)、`dark`(深色) |
| `text` | String | **必填** | 標籤文字 |

```vue
<!-- 成功，無背景（預設） -->
<CxlTag text="有行動保全資格" />

<!-- 警告，淺色背景 -->
<CxlTag type="warning" theme="light" text="待補件" />

<!-- 錯誤，深色背景 -->
<CxlTag type="error" theme="dark" text="資格不符" />
```

---

## CxlToolbarTs — 行動工具列（僅 TS 版）

### 核心屬性

| 屬性 | 類型 | 預設 | 說明 |
|------|------|------|------|
| `buttonItems` | Array | `[]` | 左側按鈕區塊，格式：`[{ label, action }]` |
| `menuItems` | Array | `[]` | Sidebar 選單，格式：`[{ label, action, prevIcon? }]` |
| `showListTypeIcon` | Boolean | false | 顯示牌卡呈現切換 icon |
| `showSearchIcon` | Boolean | false | 顯示搜尋 icon |
| `showDeleteIcon` | Boolean | false | 顯示刪除 icon |
| `showMoreIcon` | Boolean | false | 顯示 more(Sidebar 選單) icon |
| `keepMenuOpen` | Boolean | false | 點擊選單後是否保持開啟（需 showMoreIcon 為 true）|

### 事件

| 事件 | 說明 |
|------|------|
| `@listTypeChange` | 牌卡呈現切換時觸發，回傳新的類型 |
| `@searchClick` | 搜尋 icon 點擊時觸發 |
| `@deleteClick` | 刪除 icon 點擊時觸發 |

### 基本用法

```vue
<CxlToolbarTs
  :buttonItems="buttons"
  :menuItems="menus"
  showListTypeIcon
  showSearchIcon
  showDeleteIcon
  showMoreIcon
  @listTypeChange="handleListTypeChange"
  @searchClick="handleSearchClick"
  @deleteClick="handleDeleteClick"
/>
```

```javascript
const buttons = [
  { label: '新增項目A', action: handleAddA },
  { label: '新增項目B', action: handleAddB },
]
const menus = [
  { label: '設定', action: handleSettings },
  { label: '登出', action: handleLogout, prevIcon: 'cxl-icon-logout-ts' },
]

const handleAddA = () => {
  // TODO: 新增項目 A
}
const handleAddB = () => {
  // TODO: 新增項目 B
}
const handleSettings = () => {
  // TODO: 開啟設定
}
const handleLogout = () => {
  // TODO: 執行登出確認流程
}
const handleListTypeChange = (newType) => {
  // TODO: 切換列表呈現為 newType
}
const handleSearchClick = () => {
  // TODO: 開啟搜尋條件
}
const handleDeleteClick = () => {
  // TODO: 執行刪除確認流程
}
```

---

## CxlPaginator — 獨立分頁器

> **注意**：CxlTable 已內建分頁功能，此元件僅用於特殊場景（如自訂列表）。

### 核心屬性

| 屬性 | 類型 | 說明 |
|------|------|------|
| `v-model:initPagination` | Object | 分頁狀態：`{ page, rowsPerPage }` |
| `totalItemLength` | Number | 資料總筆數 |

### 基本用法

```vue
<CxlPaginator
  v-model:initPagination="pagination"
  :totalItemLength="totalItemLength"
/>
```

```javascript
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
})
const totalItemLength = ref(100)
```
