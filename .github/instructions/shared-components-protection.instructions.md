---
applyTo: "**/*.{vue,js}"
description: "Use when modifying protected shared frontend files such as src/components/**, src/assets/utils/**, src/assets/libs/**, or nested src/views/{module}/{subfolder}/** files. Requires Impact Gate, dependency search, affected page list, and explicit user confirmation before edits."
version: "1.1.0"
id: "shared-components-protection.instructions"
author: "張立賢"
type: "instructions"
lvl: "feature"
bundle: "CathayBoostFrontendVue"
tag: ["instructions", "shared-component", "protection", "gate", "frontend", "vue"]
created_date: "2026-05-18"
last_modified: "2026-07-01"
---

# 共用元件與共用模組保護規則

此 instruction 故意套用到所有 Vue/JS 編輯，讓 agent 在動手前先判斷本次檔案是否落入受保護區域；未命中下列路徑時，不需要執行 Impact Gate。

## 受保護區域（Protected Zones）

下列路徑屬於**受保護區域**，未取得使用者確認前，**不得修改**：

| 路徑 | 說明 |
|------|------|
| `src/components/**` | 全域通用元件，多個頁面共用 |
| `src/assets/utils/**` | 共用工具函式 |
| `src/assets/libs/**` | 第三方函式庫封裝或共用模組 |
| `src/views/{代號}/{子資料夾}/**/*.{vue,js}` | 代號內子資料夾的元件或工具（深度 ≥ 3 層），可能被同模組多個頁面引用 |

> **深度說明**：`src/views/ModuleA/ComponentsFolder/Foo.vue`（第三層）屬於受保護區域；`src/views/ModuleA/Foo.vue`（第二層，頁面主檔）不受限制。

## 例外：新增頁面流程允許直接修改的檔案

下列檔案在正常產製新頁面流程中可直接修改，**不需要 Impact Gate**：

| 檔案 / 路徑模式 | 允許操作 | 限制 |
|----------------|---------|------|
| `src/views/{代號}/*.vue`（頁面主檔，第二層）| 新增或修改頁面主檔 | 不適用 |
| `src/router/router.js`（或 `index.js`）| 新增 route entry | 不得修改或刪除現有 route |
| `src/service/NavCollection.js` | 新增 nav 項目 | 不得修改或刪除現有 nav 項目 |
| `src/service/**Service.js`（新建） | 建立新的 service 檔案 | 不適用 |

## Impact Gate：受保護區域修改流程

### Gate 觸發條件

當實作某功能**必須修改**受保護區域的檔案時，在動手之前執行以下步驟。

### Step 1：影響範圍分析

讀取目標共用元件或工具函式，確認：
1. 目前的 `props` / `emits` / `slots` 介面（Vue 元件）或 function signature（JS 工具）
2. 搜尋 `src/views/` 下所有直接或間接引用此檔案的頁面
3. 判斷預計修改內容是否會影響現有頁面的行為或外觀

### Step 2：呈現確認請求

向使用者呈現以下格式，並**等待明確同意後才執行修改**：

```
⚠️ 共用元件修改確認

計畫修改：`{受保護檔案路徑}`

影響範圍：
  引用此元件 / 模組的頁面：
  - {頁面路徑 1}
  - {頁面路徑 2}
  預計修改內容：{說明新增 / 移除 / 變更的 props、函式或行為}
  潛在影響：{說明對現有頁面可能的副作用}

替代方案：
  [可選] {替代做法，例如：建立新的 component 避免影響現有頁面}
  [可選] {使用 slot / extend 的方式擴充，不修改現有 props}

是否確認修改上述共用元件？
```

### Step 3：根據使用者回應決策

| 使用者回應 | 後續動作 |
|-----------|---------|
| 明確確認（「是」、「確認」、「OK」等）| 執行修改 |
| 拒絕或無回應 | 改用替代方案或保留現有結構 |
| 要求說明 | 補充說明後重新確認 |

可接受確認語意包含「確認」、「OK」、「好」、「沒問題」等明確同意。  
**「繼續」、「keep going」、「直接做」不算確認通過 Impact Gate。**

## 禁止行為

- ❌ 未執行影響範圍分析就修改 `components/` 下的任何元件
- ❌ 未取得使用者確認就刪除或變更共用工具函式的 function signature
- ❌ 以「讓目前 spec 更好實作」為理由直接修改共用元件
- ❌ 影響範圍分析不完整（遺漏已引用的頁面）就要求使用者確認
- ❌ 在修改摘要中僅列出「可能影響其他頁面」但未實際列舉頁面路徑

## 推薦替代策略

當修改共用元件有風險時，優先考慮以下替代策略：

1. **建立新 component**：在 `src/components/` 新增一個新檔案，保留舊元件不動
2. **Slot 擴充**：透過 slot 新增彈性，不改動現有 props 介面
3. **透過 props 選擇性啟用**：新增一個可選 prop 來控制新行為，不影響未傳入此 prop 的現有使用
4. **頁面層實作**：在呼叫共用元件的頁面層處理差異邏輯，不修改共用元件本身
