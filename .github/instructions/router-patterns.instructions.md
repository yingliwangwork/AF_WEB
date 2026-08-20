---
applyTo: "**/router/**/*.js"
description: "Use when adding or reviewing Vue Router route entries, nested children, lazy-loaded view components, route name/path conventions, router.push state, query parameters, or history.state handoff."
version: "1.1.0" # 語義化版本號 (Semantic Versioning)
id: "router-patterns.instructions" # 唯一的Prompt識別碼
author: "張立賢" # 作者
type: "instructions" # 分類
lvl: "feature" # 層級(copilot層級 > bundle層級 > feature層級)
bundle: "CathayBoostFrontendVue" # 所屬bundle
tag: ["router", "vue-router", "navigation", "frontend", "vue"] # 相關標籤
created_date: "2026-03-03" # 建立日期
last_modified: "2026-07-01" # 最後修改日期
---

# Vue Router 路由模式

## 基本配置

```javascript
const BaseLayout = () => import('@/components/BaseLayout.vue')

const routes = [
  {
    path: '/',
    component: BaseLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home/HomePage.vue')
      }
    ]
  },
  {
    path: '/XX',
    name: 'XX',
    component: BaseLayout,
    children: [
      {
        path: 'XXXX0100',
        name: 'XXXX0100',
        component: () => import('@/views/XX/XXXX0100.vue'),
      },
    ],
  },
  { path: '/:catchAll(.*)', redirect: '/' }
]

export default { routes }
```

## 路由傳遞參數優先級

### 優先級 1：HTML5 History API state（推薦）

```javascript
import { toRaw } from 'vue'

// 傳遞純物件
router.push({ name: 'ProductDetail', state: { productData: { id: 123 } } })

// 傳遞響應式資料時，必須用 toRaw 轉換
const selected = ref({ id: 123 })
router.push({ name: 'ProductDetail', state: { data: toRaw(selected.value) } })

// 接收
const productData = history.state?.productData
```

### 優先級 2：query 參數

```javascript
router.push({ name: 'ProductList', query: { keyword: '手機', page: 1 } })
const keyword = route.query.keyword
```

適用場景：需要分享 URL 或書籤的頁面。
