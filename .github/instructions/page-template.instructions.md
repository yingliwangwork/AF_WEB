---
applyTo: "**/views/**/*.vue"
description: "Use when creating or reviewing src/views Vue pages that need the 國泰後台 base page template, CxlBreadcrumbs, cxl-title-h1, navCollection, rootPath, and one-page-title structure."
version: "1.1.0" # 語義化版本號 (Semantic Versioning)
id: "page-template.instructions" # 唯一的Prompt識別碼
author: "張立賢" # 作者
type: "instructions" # 分類
lvl: "feature" # 層級(copilot層級 > bundle層級 > feature層級)
bundle: "CathayBoostFrontendVue" # 所屬bundle
tag: ["template", "page", "layout", "frontend", "vue"] # 相關標籤
created_date: "2026-03-03" # 建立日期
last_modified: "2026-07-01" # 最後修改日期
---

# 基礎頁面模板

當使用者僅用文字描述且無參考頁面時，使用此模板作為頁面基礎。

```vue
<template>
  <!-- 麵包屑 -->
  <CxlBreadcrumbs
    class="q-mb-md"
    :breadcrumbs="navCollection"
    :routerPath="$route.path"
    :rootPath="rootPath"
  />
  <!-- 頁面標題 -->
  <div class="cxl-title-h1 q-mb-md">頁面標題</div>
  <!-- TODO: 以下為頁面內容 -->
</template>

<script setup>
import { useRoute } from 'vue-router';
import { CxlBreadcrumbs } from 'vue-cathaylife-component';
import navCollection from '@/service/NavCollection.js';

const $route = useRoute();
const rootPath = { label: '首頁', url: '/' };
</script>
```

## 注意事項

- `navCollection` 來自 `@/service/NavCollection.js`，定義選單結構
- `rootPath` 必須手動提供，因為 navCollection 不含首頁資訊
- 每頁僅使用一個 `<h1>` / `cxl-title-h1`
