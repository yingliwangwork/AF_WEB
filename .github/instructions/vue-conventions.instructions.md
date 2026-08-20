---
applyTo: "**/*.{vue,js}"
description: "Use when writing Vue 3 components or JavaScript modules with <script setup>, Composition API imports, Cxl component imports, inject('$cathayAxios'), VeeValidate/Yup imports, and composable extraction decisions."
version: "1.1.0" # 語義化版本號 (Semantic Versioning)
id: "vue-conventions.instructions" # 唯一的Prompt識別碼
author: "張立賢" # 作者
type: "instructions" # 分類
lvl: "feature" # 層級(copilot層級 > bundle層級 > feature層級)
bundle: "CathayBoostFrontendVue" # 所屬bundle
tag: ["vue3", "composition-api", "conventions", "frontend"] # 相關標籤
created_date: "2026-03-03" # 建立日期
last_modified: "2026-07-01" # 最後修改日期
---

# Vue 3 開發規範

## 強制約束

- **必須**使用 `<script setup>`，**禁止** Options API
- **禁止** Vue 默認/星號導入：`import Vue from 'vue'`、`import * as Vue from 'vue'`

### 國泰元件庫

```javascript
import { CxlButton, CxlInput, CxlTable } from 'vue-cathaylife-component'
import { CxlModalTs, CxlAccordionTs } from 'vue-cathaylife-component'  // TS(行動裝置)版
```

### VeeValidate 與 Axios

```javascript
import { useForm, useField } from 'vee-validate'
import { object, string, number } from 'yup'

import { inject } from 'vue'
const $cathayAxios = inject('$cathayAxios')
```

## Composables 建立時機

| 情境 | 做法 |
|------|------|
| 單一元件使用 | 直接在元件內定義 |
| 2+ 元件共用 | 抽取為 `composables/` |
