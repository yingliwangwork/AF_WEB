---
applyTo: "**/*.{vue,js}"
description: "Use when naming Vue components, routes, stores, variables, emits, CSS classes, or writing JSDoc for frontend functions, API methods, DTO parameters, and complex logic."
version: "1.2.0" # 語義化版本號 (Semantic Versioning)
id: "naming-jsdoc.instructions" # 唯一的Prompt識別碼
author: "張立賢" # 作者
type: "instructions" # 分類
lvl: "feature" # 層級(copilot層級 > bundle層級 > feature層級)
bundle: "CathayBoostFrontendVue" # 所屬bundle
tag: ["naming", "jsdoc", "conventions", "frontend", "vue"] # 相關標籤
created_date: "2026-03-03" # 建立日期
last_modified: "2026-07-01" # 最後修改日期
---

# 命名規範與 JSDoc 註解

## 命名對照表

| 項目 | 規則 | 範例 |
|------|------|------|
| Vue 檔案/元件 | PascalCase | `UserProfile.vue`、`<UserProfile />` |
| 變數/方法/props | camelCase | `userName`、`handleSubmit` |
| Emits 事件 | kebab-case | `emit('update-data')` |
| CSS 自訂類別 | kebab-case (BEM) | `search-form__field` |
| 資料夾/非 Vue 檔案 | kebab-case | `user-profile/`、`api-utils.js` |
| Element ID | camelCase | `id="mainContent"` |
| 常數 | UPPER_SNAKE_CASE | `const MAX_RETRY = 3` |

## 1. 函式定義風格
為了維持程式碼的一致性並避免 `this` 指向問題，除非有特殊理由，否則一律使用 **箭頭函式 (Arrow Functions)** 定義元件內的邏輯。

```javascript
// ✅ 正確：使用箭頭函式
const doSubmit = () => {
  // 邏輯實作
}

// ❌ 錯誤：使用 function 宣告
function doSubmit() {
  // ...
}
```

## 2. 關鍵規則
- **禁止**自定義 `cxl-` 前綴的 CSS 類別（保留給國泰元件庫）
- **Store 命名**：`useXxxStore`，檔案 kebab-case（`auth-store.js`）
- **路由命名**：name 用 PascalCase（與元件名一致），path 用 kebab-case

## 3. JSDoc 註解規範
所有自定義的函式（特別是包含 API 調用或複雜邏輯者）都必須包含標準 JSDoc 格式註解。

```javascript
/**
 * 取得產品詳細資訊並更新 DTO
 *
 * @param {string} id - 產品編號
 * @param {object} reqObj - 請求物件
 * @param {string} reqObj.keyOne - key1值 描述
 * @param {object[]} reqList - 列表描述
 * @param {string} reqList[].keyOne - key1值 描述
 * @param {string} [defVal] - 選填參數描述
 * @returns {Promise<void>} 回傳值描述
 */
const loadProductDetail = async (id, reqObj, reqList, defVal='Hello World!') => {
  // 實作邏輯
}
```
