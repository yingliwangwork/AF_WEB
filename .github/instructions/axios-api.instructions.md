---
applyTo: "src/service/**/*.js"
description: "Use when declaring src/service endpoint URLs or implementing Vue API calls with CathayAxios、$cathayAxios、returnCode guard、DTO mapping、OpenAPI/Swagger 對齊。"
version: "1.1.1" # 語義化版本號 (Semantic Versioning)
id: "axios-api.instructions" # 唯一的Prompt識別碼
author: "張立賢" # 作者
type: "instructions" # 分類
lvl: "feature" # 層級(copilot層級 > bundle層級 > feature層級)
bundle: "CathayBoostFrontendVue" # 所屬bundle
tag: ["api", "axios", "service", "frontend", "vue"] # 相關標籤
created_date: "2026-03-03" # 建立日期
last_modified: "2026-07-01" # 最後修改日期
---

# API 請求與 DTO 規範

## 1. Service 宣告 (Endpoint Only)
Service 檔案**僅存放網址定義**，不包含邏輯。

```javascript
// ✅ 正確：src/service/ProductService.js
export default {
  queryProducts: '/api/product/query',
  getProductDetail: '/api/product/detail'
}
```

## 2. 元件實作與 DTO 結構
使用 `ref` 定義 DTO (Data Transfer Object) 以承接 API 資料。

```vue
<script setup>
import { ref, inject } from 'vue'
import productService from '@/service/ProductService'

const $cathayAxios = inject('$cathayAxios')

/**
 * 1. 定義 DTO 結構
 * - 優先來源：若使用者提供 Swagger/OpenAPI 或 API 規格文件，欄位命名與型別應與之完全對齊。
 * - VeeValidate 整合：若此 DTO 用於表單，建議作為 useForm 的 initialValues 基礎。
 */
const productDto = ref({
  productId: '',
  name: '',
  price: 0
})

const loadDetail = async (id) => {
  // 2. 調用 API (CathayAxios 已內建錯誤通知，不需 try-catch)
  const resp = await $cathayAxios.post(productService.getProductDetail, { id })

  // 3. 失敗跳脫機制 (Guard Clause)
  if (resp.returnCode !== 0) {
    // returnCode 不為 0 (Number) 代表失敗，CathayAxios 會自動彈出錯誤訊息
    return
  }

  // 4. 資料映射 (直接替換 ref 的值以維持響應性)
  productDto.value = { ...productDto.value, ...resp.data }
}
</script>
```

## 3. 關鍵約束
- **錯誤處理**：嚴禁使用 `try-catch` 或手動彈出通知，統一由 CathayAxios 全域攔截器處理。
- **回傳檢查**：若 `resp.returnCode !== 0` 應立即跳脫函數，不可進行後續資料處理。
- **VeeValidate 整合**：若頁面包含表單，DTO 欄位命名應與 VeeValidate 的 `Field` 名稱完全一致。
