<template>
  <CxlBreadcrumbs
    class="q-mb-md"
    :breadcrumbs="navCollection"
    :routerPath="$route.path"
    :rootPath="ROOT_PATH"
  />
  <div class="cxl-title-h1 q-mt-md q-mb-md">公會通報下傳作業</div>

  <q-card class="cxl-card q-pa-md q-mb-lg">
    <div class="text-h6 q-mb-md">作業說明</div>
    <ol class="q-my-none">
      <li>
        此畫面請使用
        <span class="cxl-text-danger">Google Chrome</span>
        操作。
      </li>
      <li>
        收承方式、商品屬性每次只能針對一種組合下載；如需下載多種組合，請分次匯出。
      </li>
      <li>
        同一被保人 ID 查詢多筆保單時，請在保單號碼欄位輸入多筆資料，並以
        <span class="cxl-text-danger">Enter</span>
        分隔。
      </li>
    </ol>
  </q-card>

  <q-card class="cxl-card q-pa-md q-mb-lg">
    <q-markup-table
      class="cxl-table cxl-table-horizontal"
      separator="cell"
      flat
      bordered
    >
      <thead>
        <tr>
          <th colspan="4" class="cxl-table-header">匯出條件</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th><span class="cxl-text-danger">*</span> 收承方式</th>
          <td>
            <CxlDropdown
              v-model="insrType"
              :options="INSURANCE_TYPE_OPTIONS"
              emit-value
              map-options
              :error="!!errors.insrType"
              :error-message="errors.insrType"
            />
          </td>
          <th><span class="cxl-text-danger">*</span> 商品屬性</th>
          <td>
            <CxlDropdown
              v-model="prodType"
              :options="PRODUCT_TYPE_OPTIONS"
              emit-value
              map-options
              :error="!!errors.prodType"
              :error-message="errors.prodType"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>

  <q-card class="cxl-card q-pa-md q-mb-lg">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6">匯出資料</div>
      <CxlButton label="新增一列" theme="primary-outline" @click="addEntry" />
    </div>

    <CxlTable
      v-model:pagination="pagination"
      :rows="entries"
      :columns="ENTRY_COLUMNS"
      row-key="rowId"
      separator="cell"
      :rows-per-page-options="[0]"
      hide-bottom
    >
      <template #body-cell-delete="props">
        <q-td :props="props">
          <CxlButton
            label="刪除此列"
            theme="danger"
            @click="deleteEntry(props.row.rowId)"
          />
        </q-td>
      </template>

      <template #body-cell-insuredId="props">
        <q-td :props="props">
          <CxlInput
            v-model="props.row.insuredId"
            maxlength="10"
            placeholder="請輸入被保人 ID"
          />
        </q-td>
      </template>

      <template #body-cell-policyNumbers="props">
        <q-td :props="props">
          <CxlTextarea
            v-model="props.row.policyNumbers"
            rows="3"
            placeholder="請輸入保單號碼，多筆請以 Enter 分隔"
          />
        </q-td>
      </template>

      <template #body-cell-result="props">
        <q-td :props="props">
          {{ props.row.result }}
        </q-td>
      </template>
    </CxlTable>

    <div class="row justify-center q-mt-md">
      <CxlButton
        label="匯出檔案"
        prevIcon="cub-icon-download"
        :loading="isExporting"
        @click="exportFile"
      />
    </div>
  </q-card>

  <CxlModal
    v-model="isMessageModalVisible"
    title="提示"
    confirm-text="關閉"
    @confirm="closeMessageModal"
  >
    <p v-for="(message, index) in modalMessages" :key="`${index}-${message}`">
      {{ message }}
    </p>
  </CxlModal>
</template>

<script setup>
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useField, useForm } from "vee-validate";
import { array, object, string } from "yup";
import {
  CxlBreadcrumbs,
  CxlButton,
  CxlDropdown,
  CxlInput,
  CxlModal,
  CxlTable,
  CxlTextarea,
} from "vue-cathaylife-component";
import afy10400Service from "@/service/AFY10400Service.js";
import navCollection from "@/service/NavCollection.js";

const $cathayAxios = inject("$cathayAxios");
const $route = useRoute();
const ROOT_PATH = { label: "首頁", url: "/" };
const INSURANCE_TYPE_OPTIONS = [
  { label: "承保", value: "L" },
  { label: "收件", value: "R" },
];
const PRODUCT_TYPE_OPTIONS = [
  { label: "個險", value: "AT" },
  { label: "團險", value: "BG" },
  { label: "意外險", value: "CB" },
];
const ENTRY_COLUMNS = [
  {
    name: "delete",
    label: "刪除",
    field: "delete",
    align: "center",
  },
  {
    name: "insuredId",
    label: "被保人 ID",
    field: "insuredId",
    align: "left",
  },
  {
    name: "policyNumbers",
    label: "保單號碼",
    field: "policyNumbers",
    align: "left",
  },
  {
    name: "result",
    label: "匯出結果",
    field: "result",
    align: "center",
  },
];

const isExporting = ref(false);
const isMessageModalVisible = ref(false);
const modalMessages = ref([]);
const pagination = ref({ rowsPerPage: 0 });
let nextRowId = 0;

const requiredEntry = {
  name: "requiredEntry",
  message: "被保人 ID 或保單號碼不得為空值",
  test: function (value = []) {
    const invalidIndex = value.findIndex(
      (entry) => !entry.insuredId?.trim() || !entry.policyNumbers?.trim(),
    );
    if (invalidIndex === -1) return true;
    return this.createError({
      message: `第 ${invalidIndex + 1} 列的被保人 ID 或保單號碼不得為空值，若不需要請刪除該列`,
    });
  },
};
const uniqueInsuredId = {
  name: "uniqueInsuredId",
  message: "被保人 ID 不得重覆",
  test: function (value = []) {
    const insuredIds = new Set();
    const duplicate = value.find((entry) => {
      const insuredId = entry.insuredId?.trim();
      if (!insuredId) return false;
      if (insuredIds.has(insuredId)) return true;
      insuredIds.add(insuredId);
      return false;
    });
    if (!duplicate) return true;
    return this.createError({
      message: `被保人 ID：${duplicate.insuredId} 有重覆出現，請合併在同一列處理`,
    });
  },
};
const validationSchema = object({
  insrType: string().required("請選擇收承方式"),
  prodType: string().required("請選擇商品屬性"),
  entries: array()
    .test(requiredEntry)
    .test(uniqueInsuredId),
});

const { errors, validate } = useForm({
  validationSchema,
  initialValues: {
    insrType: "L",
    prodType: "AT",
    entries: [],
  },
  validateOnMount: false,
});
const { value: insrType } = useField("insrType");
const { value: prodType } = useField("prodType");
const { value: entries } = useField("entries");

/**
 * 新增一列匯出資料。
 *
 * @returns {void}
 */
const addEntry = () => {
  const rowId = nextRowId;
  nextRowId += 1;
  entries.value = [
    ...entries.value,
    {
      rowId,
      insuredId: "",
      policyNumbers: "",
      result: "",
    },
  ];
};

/**
 * 刪除指定匯出資料列。
 *
 * @param {number} rowId - 資料列識別值
 * @returns {void}
 */
const deleteEntry = (rowId) => {
  entries.value = entries.value.filter((entry) => entry.rowId !== rowId);
};

/**
 * 顯示頁面提示訊息。
 *
 * @param {unknown} messages - 後端回傳訊息
 * @returns {void}
 */
const displayMessages = (messages) => {
  const normalizedMessages = Array.isArray(messages)
    ? messages.filter(Boolean).map(String)
    : messages
      ? [String(messages)]
      : [];
  if (normalizedMessages.length === 0) return;
  modalMessages.value = normalizedMessages;
  isMessageModalVisible.value = true;
};

/**
 * 關閉提示視窗。
 *
 * @returns {void}
 */
const closeMessageModal = () => {
  isMessageModalVisible.value = false;
};

/**
 * 將後端匯出結果映射回各資料列。
 *
 * @param {Record<string, string>} resultMap - 被保人 ID 對應的匯出結果
 * @returns {void}
 */
const applyExportResults = (resultMap) => {
  entries.value = entries.value.map((entry) => ({
    ...entry,
    result: resultMap?.[entry.insuredId] ?? "",
  }));
};

/**
 * 下載伺服器產製的檔案。
 *
 * @param {string} fileName - 後端產製的檔案名稱
 * @returns {Promise<void>}
 */
const downloadFile = async (fileName) => {
  await $cathayAxios.download(
    afy10400Service.download,
    { fileName },
    fileName,
  );
};

/**
 * 驗證並匯出公會通報檔案。
 *
 * @returns {Promise<void>}
 */
const exportFile = async () => {
  const { valid } = await validate();
  if (!valid) {
    displayMessages(errors.value.entries ?? "請確認匯出條件");
    return;
  }

  isExporting.value = true;
  try {
    const response = await $cathayAxios.post(afy10400Service.export, {
      insrType: insrType.value,
      prodType: prodType.value,
      I_ID: entries.value.map((entry) => entry.insuredId),
      POLICY_NO: entries.value.map((entry) => entry.policyNumbers),
    });
    if (response.returnCode !== 0) return;
    applyExportResults(response.data.rtnMap);
    await downloadFile(response.data.fileName);
  } finally {
    isExporting.value = false;
  }
};

/**
 * 載入頁面初始提示訊息。
 *
 * @returns {Promise<void>}
 */
const loadPrompt = async () => {
  const response = await $cathayAxios.post(afy10400Service.prompt, {});
  if (response.returnCode !== 0) return;
  displayMessages(response.data.messages);
};

onMounted(loadPrompt);
</script>
