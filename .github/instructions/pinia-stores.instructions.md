---
applyTo: "src/stores/**/*.js"
description: "Use when creating Pinia stores or wiring Vue components to stores with defineStore、storeToRefs、useXxxStore、多路由暫存、多元件共用狀態、重新整理 fallback。"
version: "1.2.0" # 語義化版本號 (Semantic Versioning)
id: "pinia-stores.instructions" # 唯一的Prompt識別碼
author: "張立賢" # 作者
type: "instructions" # 分類
lvl: "feature" # 層級(copilot層級 > bundle層級 > feature層級)
bundle: "CathayBoostFrontendVue" # 所屬bundle
tag: ["pinia", "store", "state-management", "frontend", "vue"] # 相關標籤
created_date: "2026-03-03" # 建立日期
last_modified: "2026-07-01" # 最後修改日期
---

# Pinia Store 規範與決策

## 1. 架構決策指南 (重要)
在建立 Store 前，必須優先考慮是否有更輕量的方案。

### 什麼時候「禁止」使用 Pinia？
- **列表到詳情頁的 ID 傳遞**：嚴禁僅為了傳遞 ID 或簡單物件而建立 Store。請改用 **Vue Router 傳參 (Route Params)**。
  - *原因*：使用 Router 可支援頁面重新整理與網址分享，Pinia 在重新整理後資料會遺失。
- **單一頁面的狀態**：如果資料只在一個頁面使用，請使用 `ref/reactive`。

### 什麼時候「建議」使用 Pinia？
- **全域共用資料**：如登入者資訊、全域權限、選單狀態。
- **多步驟表單 (Multi-step Form)**：資料尚未存入資料庫，需在多個路由間暫存複雜物件。

## 2. Store 結構規範

1. **使用 Composition API 語法**：`defineStore('name', () => { ... })`
2. **添加 ESLint 註解**：`/* eslint-disable import/prefer-default-export */`

```javascript
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/* eslint-disable import/prefer-default-export */
export const useAuthStore = defineStore('authStore', () => {
  // 1. State
  const userName = ref('')
  
  // 2. Getters
  const isLoggedIn = computed(() => !!userName.value)

  // 3. Actions
  const setUser = (name) => { userName.value = name }

  return { userName, isLoggedIn, setUser }
})
```

## 3. 在元件中調用
- **保持響應性**：解構 State 時必須使用 `storeToRefs()`。
- **重新整理考量**：若元件依賴 Store 資料，必須實作「資料缺失時的重抓邏輯 (Fallback)」。

```vue
<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/Auth.js'

const authStore = useAuthStore()
const { userName } = storeToRefs(authStore) // 解構 State 用 storeToRefs
const { setUser } = authStore               // 解構 Actions 直接取用
</script>
```
