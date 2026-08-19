---
description: "Use when adding or reviewing Vue 表單驗證、VeeValidate、Yup schema、useForm/useField、CxlField 錯誤訊息、載入既有資料後 setValues。"
version: "1.1.0" # 語義化版本號 (Semantic Versioning)
id: "form-validation.instructions" # 唯一的Prompt識別碼
author: "張立賢" # 作者
type: "instructions" # 分類
lvl: "feature" # 層級(copilot層級 > bundle層級 > feature層級)
bundle: "CathayBoostFrontendVue" # 所屬bundle
tag: ["form", "validation", "veevalidate", "yup", "frontend", "vue"] # 相關標籤
created_date: "2026-03-03" # 建立日期
last_modified: "2026-07-01" # 最後修改日期
---

# 表單驗證

使用 **VeeValidate + Yup** 進行表單驗證。

## 專案自訂驗證規則（優先使用）

使用前先檢查 `src/assets/libs/CathayValidateRules.js` 是否存在。若存在，優先使用以下專案規則：

```javascript
import '@/assets/libs/CathayValidateRules.js' // 擴展 Yup 方法

// 可用的自訂方法（string 類型）
string()
  .mobile()              // 手機: 09xxxxxxxx
  .dateformatvalid()     // 日期: YYYYMMDD
  .validateROCDate()     // 民國日期
  .validateHHMM()        // 時間: HH:MM (24hr)
  .validatorROCID()      // 身分證
  .validatorResidentID() // 居留證

// 相對驗證（跨欄位比較）
string()
  .validateHHMMMax('endTime', '開始時間不得大於結束時間')
  .validateROCDateMax('endDate', '起日不得大於迄日')
```

## Composition API 核心模式

### ⚠️ 關鍵配置

```javascript
const { errors, validate, setValues, handleSubmit } = useForm({
  validationSchema,
  initialValues: {            // ⚠️ 必須設定，否則進入頁面就顯示錯誤
    fieldName: '',
  },
  validateOnMount: false,     // ⚠️ 必須設定，防止頁面載入時觸發驗證
})

// ⚠️ 驗證欄位必須使用 useField，並直接綁定至 v-model
const { value: fieldName } = useField('fieldName')
```

### ❌ 常見錯誤：v-model 綁定錯誤

```javascript
// ❌ 錯誤：使用 formData 物件綁定（VeeValidate 無法追蹤，錯誤不會消失）
const { value: email } = useField('email')
const formData = ref({ email: '' })
// Template: <CxlInput v-model="formData.email" />

// ✅ 正確：直接綁定 useField 返回的 value
const { value: email } = useField('email')
// Template: <CxlInput v-model="email" />
```

### Template 錯誤綁定

```vue
<!-- ⚠️ 錯誤訊息從 useForm 的 errors 物件取得，不是 useField -->
<CxlInput
  v-model="email"
  :error="!!errors.email"
  :error-message="errors.email"
/>
```

### 載入既有資料

```javascript
// ✅ 使用 setValues 更新 VeeValidate 追蹤的欄位
setValues({ email: data.email, name: data.name })

// ❌ 錯誤：直接賦值不會觸發 VeeValidate 更新
email.value = data.email
```

### 提交表單

```javascript
// 方式 1：手動驗證（推薦，專案撰寫風格）
const handleSubmit = async () => {
  const { valid } = await validate()
  if (!valid) return
  await api.submit({ email: email.value })
}

// 方式 2：使用 handleSubmit（自動驗證）
const onSubmit = handleSubmit(async (values) => {
  await api.submit(values)
})
```

## CxlField vs q-field

| 情境 | 使用元件 |
|------|---------|
| 包覆國泰元件（Cxl 開頭或 class 含 `cxl-*`） | `CxlField` |
| 包覆純 Quasar 原生元件 | `q-field` |

```vue
<!-- Checkbox/Radio 驗證需用 CxlField 包覆 -->
<CxlField :error="!!errors.agree" :error-message="errors.agree">
  <template #control>
    <q-checkbox v-model="agree" class="cxl-checkbox" label="同意條款" />
  </template>
</CxlField>
```

## 最佳實踐清單

| 項目 | 規則 |
|------|------|
| `initialValues` | ⚠️ 必須設定，所有欄位給初始值 |
| `validateOnMount` | ⚠️ 設為 `false`，防止頁面載入時顯示錯誤 |
| 驗證欄位 | 使用 `useField()` 取得 `value`，直接綁定 `v-model` |
| 非驗證欄位 | 使用一般 `ref()` |
| 載入資料 | 使用 `setValues()`，不要直接賦值 |
| 提交表單 | 使用 `handleSubmit()` 或先 `await validate()` |
| 專案規則 | 優先檢查並使用 `CathayValidateRules.js` |
