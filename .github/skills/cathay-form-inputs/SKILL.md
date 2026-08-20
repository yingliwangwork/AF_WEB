---
name: cathay-form-inputs
description: "Use when implementing or reviewing Cathay form inputs in Vue: CxlInput, CxlDropdown, CxlTextarea, checkbox/radio with cxl classes, VeeValidate/Yup validation, useForm/useField binding, error-message handling, dynamic options, or TS input variants."
version: "1.1.0" # 語義化版本號 (Semantic Versioning)
id: "cathay-form-inputs.skill" # 唯一的Prompt識別碼
author: "張立賢" # 作者
type: "skill" # 分類
lvl: "feature" # 層級(copilot層級 > bundle層級 > feature層級)
bundle: "CathayBoostFrontendVue" # 所屬bundle
tag: ["skill", "form", "input", "dropdown", "validation", "cathay", "frontend", "vue"] # 相關標籤
created_date: "2026-03-03" # 建立日期
last_modified: "2026-07-01" # 最後修改日期
---

# 國泰表單元件指南

## 元件選擇決策

| 使用場景 | 推薦元件 | 關鍵屬性 |
|---------|---------|---------|
| 單行文字輸入 | CxlInput | 禁用 `label`，使用外部標籤 |
| 多行文字輸入 | CxlTextarea | `autogrow` 或 `rows`（二選一）|
| 單選（2-5 個選項）| q-radio + q-option-group | `dense`、`class="cxl-radio"` |
| 多選（2-5 個選項）| q-checkbox + q-option-group | `dense`、`class="cxl-checkbox"` |
| 下拉選單（5+ 選項）| CxlDropdown | 必須 `map-options` + `emit-value` |
| 日期選擇 | CxlCalendar + CxlInput + CxlPopupProxy | 參考 `cathay-ui-components` 技能 |

---

## CxlInput — 文字輸入

> **Quasar 透傳**：CxlInput 封裝 `q-input`，未列出的 `q-input` 屬性、事件、插槽均可直接使用。

### 核心規則

- **不支援 `label` 屬性**，必須使用外部標籤或 `placeholder`
- **不需預設加上 `clearable`**，僅在使用者明確要求時才加
- 使用 `#append` / `#prepend` 插槽顯示單位或圖示
- TS 版：加上 `class="cxl-input-ts"`

### ❗ 內部固定屬性（修改無效）

以下屬性已在元件內部硬編碼，設定會被忽略：

| 屬性 | 內部固定值 | 說明 |
|------|----------|------|
| `outlined` | `true` | 永遠使用外框樣式 |
| `dense` | `true` | 永遠緊湊模式 |
| `hide-bottom-space` | `true` | 不顯示底部空間 |
| `no-error-icon` | `true` | 不顯示錯誤圖示 |
| `input-class` | 自動設定 | 被 `cxl-input-root` 或 `cxl-input-ts-root` 覆蓋 |

### 核心屬性

| 屬性 | 類型 | 預設 | 說明 |
|------|------|------|------|
| `v-model` | String | `''` | 雙向綁定值 |
| `placeholder` | String | `''` | 提示文字 |
| `type` | String | `'text'` | 輸入類型（text/password/number/email/tel）|
| `clearable` | Boolean | false | 顯示清除按鈕 |
| `maxlength` | Number/String | — | 最大字元數 |
| `mask` | String | — | 輸入遮罩格式 |
| `readonly` | Boolean | false | 唯讀 |
| `disable` | Boolean | false | 停用 |
| `error` | Boolean | false | 錯誤狀態 |
| `error-message` | String | `''` | 錯誤訊息 |

### 插槽

| 插槽 | 說明 |
|------|------|
| `#prepend` | 輸入框左側內容 |
| `#append` | 輸入框右側內容（如單位、圖示）|

### 基本用法

```vue
<CxlInput v-model="userName" placeholder="請輸入姓名" />
```

### 帶單位的輸入

```vue
<CxlInput v-model="amount" placeholder="請輸入金額">
  <template #append>
    <span>元</span>
  </template>
</CxlInput>
```

### 驗證整合

```vue
<CxlInput
  v-model="email"
  placeholder="請輸入 Email"
  :error="!!errorMsg.email"
  :error-message="errorMsg.email"
/>
```

**注意**：必須同時設定 `error` 和 `error-message` 才能顯示驗證訊息。

---

## CxlDropdown — 下拉選單

> **Quasar 透傳**：CxlDropdown 封裝 `q-select`，未列出的 `q-select` 屬性、事件、插槽均可直接使用。

### 核心規則

- **必須同時使用 `map-options` 和 `emit-value`**（除非有特別指示）
- 選項格式：`[{ label: '顯示文字', value: '值' }]`
- TS 版：加上 `class="cxl-dropdown-ts"`

### 核心屬性

| 屬性 | 類型 | 預設 | 說明 |
|------|------|------|------|
| `options` | Array | `[]` | 選項陣列 |
| `map-options` | Boolean | `false` | 顯示 label 而非 value（必加）|
| `emit-value` | Boolean | `false` | v-model 回傳 value 而非整個 option（必加）|
| `clearable` | Boolean | `false` | 顯示清除按鈕 |
| `multiple` | Boolean | `false` | 多選模式（v-model 綁陣列）|
| `use-input` | Boolean | `false` | 可搜尋過濾 |
| `showHanlink` | Boolean | `false` | 顯示選單內的難字（使用者有提才需開啟）|

### 基本用法

```vue
<CxlDropdown
  v-model="selectedCity"
  :options="cityOptions"
  map-options
  emit-value
  placeholder="請選擇"
/>
```

```javascript
const selectedCity = ref('')
const cityOptions = reactive([
  { label: '台北', value: 'TPE' },
  { label: '高雄', value: 'KHH' },
])
```

### 可搜尋下拉

```vue
<CxlDropdown
  v-model="selected"
  :options="options"
  map-options
  emit-value
  use-input
  input-debounce="300"
  @filter="onFilter"
/>
```

### 多選下拉

```vue
<CxlDropdown
  v-model="selectedItems"
  :options="options"
  map-options
  emit-value
  multiple
/>
```

**注意**：多選時 `v-model` 綁定**陣列**。

### 動態選項更新

使用 `reactive` 陣列確保響應性：

```javascript
const options = reactive([])

const loadOptions = async () => {
  const data = await fetchData()
  options.splice(0, options.length, ...data)
}
```

---

## CxlTextarea — 多行輸入

> **Quasar 透傳**：CxlTextarea 封裝 `q-input`（type=textarea），未列出的 `q-input` 屬性、事件、插槽均可直接使用。

### 核心規則

- `autogrow` 和 `rows` **只能擇一使用**
- TS 版：加上 `class="cxl-textarea-ts"`

### 核心屬性

| 屬性 | 類型 | 預設 | 說明 |
|------|------|------|------|
| `v-model` | String | `''` | 雙向綁定值 |
| `rows` | String | `'4'` | 固定行數（使用字串格式）|
| `autogrow` | Boolean | `false` | 自動增長高度（與 rows 互斥）|
| `maxlength` | Number/String | — | 最大字元數 |
| `counter` | Boolean | `false` | 顯示字數計數器 |

### 基本用法

```vue
<!-- 固定行數 -->
<CxlTextarea v-model="memo" :rows="5" placeholder="請輸入備註" />

<!-- 自動增長 -->
<CxlTextarea v-model="memo" autogrow placeholder="請輸入備註" />
```

### 字數限制

```vue
<CxlTextarea
  v-model="memo"
  :maxlength="500"
  :counter="true"
  :rows="5"
/>
```

**注意**：`counter` 使用布林值 `:counter="true"`，不是字串。

---

## Checkbox 與 Radio — 選項元件

### 核心規則

- 使用 **Quasar 元件** + **國泰 CSS 類別**
- 建議使用 `QOptionGroup` 簡化程式碼
- **必須加 `dense` 屬性**
- Checkbox 的 `v-model` 綁定**陣列**，Radio 綁定**字串/數字**

### Checkbox — 多選

```vue
<q-option-group
  v-model="selectedFruits"
  :options="fruitOptions"
  type="checkbox"
  class="cxl-checkbox"
  dense
/>
```

```javascript
const selectedFruits = ref([])  // 陣列！
const fruitOptions = [
  { label: '蘋果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
]
```

### Radio — 單選

```vue
<q-option-group
  v-model="selectedGender"
  :options="genderOptions"
  type="radio"
  class="cxl-radio"
  dense
/>
```

```javascript
const selectedGender = ref('')  // 字串/數字！
const genderOptions = [
  { label: '男', value: 'M' },
  { label: '女', value: 'F' },
]
```

### TS 版差異

```vue
<!-- Checkbox TS版（單一 class，不可雙寫） -->
<q-checkbox v-model="agree" class="cxl-checkbox-ts" label="同意" dense />

<!-- Radio TS版（單一 class，不可雙寫） -->
<q-radio v-model="gender" val="M" class="cxl-radio-ts" label="男" dense />
```

---

## VeeValidate + Yup 表單驗證

### 基本整合模式

```vue
<template>
  <form @submit.prevent="onSubmit">
    <CxlInput
      v-model="email"
      placeholder="請輸入 Email"
      :error="!!errors.email"
      :error-message="errors.email"
    />
  </form>
</template>
<script setup>
import { useForm, useField } from 'vee-validate'
import { object, string } from 'yup'

const schema = object({
  email: string().email('Email 格式錯誤').required('必填'),
})

const { errors, validate } = useForm({
  validationSchema: schema,
  initialValues: { email: '' },
  validateOnMount: false,
})
const { value: email } = useField('email')

const onSubmit = async () => {
  const { valid } = await validate()
  if (!valid) return
  // TODO: 處理表單提交
}
</script>
```

### Checkbox/Radio 驗證

```vue
<CxlField :error="!!errors.gender" :error-message="errors.gender">
  <template #control>
    <q-option-group
      v-model="gender"
      :options="genderOptions"
      dense
      class="cxl-radio"
      type="radio"
    />
  </template>
</CxlField>
```

---

## 版本區分速查

| 元件 | 標準版 | TS版 |
|------|--------|------|
| CxlInput | 預設 | `class="cxl-input-ts"` |
| CxlDropdown | 預設 | `class="cxl-dropdown-ts"` |
| CxlTextarea | 預設 | `class="cxl-textarea-ts"` |
| QCheckbox | `class="cxl-checkbox"` | `class="cxl-checkbox-ts"` |
| QRadio | `class="cxl-radio"` | `class="cxl-radio-ts"` |

## 常見問題

| 問題 | 解決方案 |
|------|---------|
| CxlInput label 不顯示 | 使用外部標籤或 placeholder |
| 驗證訊息不顯示 | 同時設定 `error` 和 `error-message` |
| CxlDropdown v-model 綁定錯誤 | 確保加上 emit-value |
| 動態選項更新不生效 | 使用 reactive 陣列 |
| CxlTextarea rows 不生效 | autogrow 和 rows 只能擇一 |
| Counter 不顯示 | 使用布林值 `:counter="true"` |
| Checkbox 無法勾選 | v-model 綁定陣列 |
| Radio 無法選擇 | v-model 綁定字串/數字 |
| 選項樣式不符規範 | 加上 dense 屬性 |
