<template>
  <CxlBreadcrumbs
    class="q-mb-md"
    :breadcrumbs="navCollection"
    :routerPath="$route.path"
    :rootPath="ROOT_PATH"
  />
  <div class="cxl-title-h1 q-mt-md q-mb-md">公會通報設定</div>

  <q-card class="cxl-card q-pa-md q-mb-lg">
    <q-markup-table class="cxl-table-form" separator="horizontal" flat bordered>
      <colgroup>
        <col style="width: 10%" />
        <col style="width: 23%" />
        <col style="width: 10%" />
        <col style="width: 23%" />
        <col style="width: 10%" />
        <col style="width: 23%" />
      </colgroup>
      <thead>
        <tr>
          <th colspan="6" class="cxl-form-title">新增公會通報設定</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th><span class="cxl-text-danger">*</span> 契約來源</th>
          <td>
            <CxlInput
              v-model="newSrc"
              placeholder="請輸入契約來源"
              :error="!!errors['newEntry.src']"
              :error-message="errors['newEntry.src']"
            />
          </td>
          <th><span class="cxl-text-danger">*</span> 等待時間（毫秒）</th>
          <td>
            <CxlInput
              v-model="newTimeout"
              placeholder="請輸入等待時間"
              :error="!!errors['newEntry.timeout']"
              :error-message="errors['newEntry.timeout']"
            />
          </td>
          <th>是否通算</th>
          <td>
            <CxlDropdown
              v-model="newCallAsso"
              :options="CALL_ASSO_OPTIONS"
              emit-value
              map-options
            />
          </td>
        </tr>
        <tr>
          <th><span class="cxl-text-danger">*</span> 通算網址</th>
          <td colspan="3">
            <CxlInput
              v-model="newUrl"
              placeholder="請輸入通算網址"
              :error="!!errors['newEntry.url']"
              :error-message="errors['newEntry.url']"
            />
          </td>
          <th><span class="cxl-text-danger">*</span> 累計最大保障（萬）</th>
          <td>
            <CxlInput
              v-model="newMaxAmt"
              placeholder="請輸入累計最大保障"
              :error="!!errors['newEntry.maxAmt']"
              :error-message="errors['newEntry.maxAmt']"
            />
          </td>
        </tr>
        <tr>
          <th><span class="cxl-text-danger">*</span> 連線等候時間（毫秒）</th>
          <td>
            <CxlInput
              v-model="newConnectTimeout"
              placeholder="請輸入連線等候時間"
              :error="!!errors['newEntry.connectTimeout']"
              :error-message="errors['newEntry.connectTimeout']"
            />
          </td>
          <th><span class="cxl-text-danger">*</span> 重試次數</th>
          <td>
            <CxlInput
              v-model="newRetry"
              placeholder="請輸入重試次數"
              :error="!!errors['newEntry.retry']"
              :error-message="errors['newEntry.retry']"
            />
          </td>
          <th></th>
          <td></td>
        </tr>
        <tr>
          <td colspan="6">
            <div class="row justify-center">
              <CxlButton
                label="新增"
                :disable="isBusy"
                :loading="pendingAction === 'insert'"
                @click="insertDetail"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>

  <q-card class="cxl-card q-pa-md q-mb-lg">
    <div class="text-h6 q-mb-md">公會通報設定清單</div>
    <CxlTable
      v-model:pagination="pagination"
      :rows="details"
      :columns="DETAIL_COLUMNS"
      row-key="src"
      separator="cell"
      :rows-per-page-options="[0]"
      hide-bottom
    >
      <template #body="props">
        <q-tr :props="props">
          <q-td key="srcName" :props="props">
            {{ props.row.srcName }}
          </q-td>
          <q-td key="src" :props="props">
            {{ props.row.src }}
          </q-td>
          <q-td key="timeout" :props="props">
            <CxlInput
              v-model="props.row.timeout"
              :error="!!getDetailFieldError(props.rowIndex, 'timeout')"
              :error-message="getDetailFieldError(props.rowIndex, 'timeout')"
              @update:model-value="clearDetailFieldError(props.rowIndex, 'timeout')"
            />
          </q-td>
          <q-td key="callAsso" :props="props">
            <CxlDropdown
              v-model="props.row.callAsso"
              :options="CALL_ASSO_OPTIONS"
              emit-value
              map-options
            />
          </q-td>
          <q-td key="url" :props="props">
            <CxlInput
              v-model="props.row.url"
              :error="!!getDetailFieldError(props.rowIndex, 'url')"
              :error-message="getDetailFieldError(props.rowIndex, 'url')"
              @update:model-value="clearDetailFieldError(props.rowIndex, 'url')"
            />
          </q-td>
          <q-td key="maxAmt" :props="props">
            <CxlInput
              v-model="props.row.maxAmt"
              :error="!!getDetailFieldError(props.rowIndex, 'maxAmt')"
              :error-message="getDetailFieldError(props.rowIndex, 'maxAmt')"
              @update:model-value="clearDetailFieldError(props.rowIndex, 'maxAmt')"
            />
          </q-td>
          <q-td key="connectTimeout" :props="props">
            <CxlInput
              v-model="props.row.connectTimeout"
              :error="!!getDetailFieldError(props.rowIndex, 'connectTimeout')"
              :error-message="getDetailFieldError(props.rowIndex, 'connectTimeout')"
              @update:model-value="
                clearDetailFieldError(props.rowIndex, 'connectTimeout')
              "
            />
          </q-td>
          <q-td key="retry" :props="props">
            <CxlInput
              v-model="props.row.retry"
              :error="!!getDetailFieldError(props.rowIndex, 'retry')"
              :error-message="getDetailFieldError(props.rowIndex, 'retry')"
              @update:model-value="clearDetailFieldError(props.rowIndex, 'retry')"
            />
          </q-td>
          <q-td key="action" :props="props">
            <div class="row justify-center q-gutter-sm no-wrap">
              <CxlButton
                label="修改"
                :disable="isBusy"
                :loading="pendingAction === `update-${props.rowIndex}`"
                @click="requestUpdate(props.rowIndex)"
              />
              <CxlButton
                label="刪除"
                theme="danger"
                :disable="isBusy"
                :loading="pendingAction === `delete-${props.rowIndex}`"
                @click="requestDelete(props.rowIndex)"
              />
            </div>
          </q-td>
        </q-tr>
      </template>
    </CxlTable>
  </q-card>

  <CxlModal
    v-model="isModalVisible"
    :title="modalTitle"
    :cancelText="modalCancelText"
    :confirmText="modalConfirmText"
    persistent
    @confirm="handleModalConfirm"
    @cancel="handleModalCancel"
    @hide="handleModalHide"
  >
    <p
      v-for="(message, index) in modalMessages"
      :key="`${index}-${message}`"
      class="q-mb-sm"
    >
      {{ message }}
    </p>
  </CxlModal>
</template>

<script setup>
import { computed, inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useField, useForm } from "vee-validate";
import { ValidationError, object, string } from "yup";
import {
  CxlBreadcrumbs,
  CxlButton,
  CxlDropdown,
  CxlInput,
  CxlModal,
  CxlTable,
} from "vue-cathaylife-component";
import "@/assets/libs/CathayValidateRules.js";
import ata08110Service from "@/service/ATA08110Service.js";
import navCollection from "@/service/NavCollection.js";

const $cathayAxios = inject("$cathayAxios");
const $route = useRoute();
const ROOT_PATH = { label: "首頁", url: "/" };
const EMPTY_NEW_ENTRY = {
  src: "",
  timeout: "",
  callAsso: "Y",
  url: "",
  maxAmt: "",
  connectTimeout: "",
  retry: "",
};
const CALL_ASSO_OPTIONS = [
  { label: "是", value: "Y" },
  { label: "否", value: "N" },
];
const validNumericText = (message) => ({
  name: "validNumericText",
  message,
  test: (value) => !value?.trim() || !Number.isNaN(Number(value)),
});
const DETAIL_COLUMNS = [
  {
    name: "srcName",
    label: "契約來源中文",
    field: "srcName",
    align: "left",
  },
  {
    name: "src",
    label: "契約來源",
    field: "src",
    align: "center",
  },
  {
    name: "timeout",
    label: "等待時間（毫秒）",
    field: "timeout",
    align: "center",
  },
  {
    name: "callAsso",
    label: "是否通算",
    field: "callAsso",
    align: "center",
  },
  {
    name: "url",
    label: "通算網址",
    field: "url",
    align: "left",
  },
  {
    name: "maxAmt",
    label: "累計最大保障（萬）",
    field: "maxAmt",
    align: "center",
  },
  {
    name: "connectTimeout",
    label: "連線等候時間（毫秒）",
    field: "connectTimeout",
    align: "center",
  },
  {
    name: "retry",
    label: "重試次數",
    field: "retry",
    align: "center",
  },
  {
    name: "action",
    label: "操作",
    field: "action",
    align: "center",
  },
];
const detailValidationSchema = object({
  timeout: string()
    .trim()
    .required("等待時間必須輸入")
    .validateNumber("等待時間限定只能輸入數字")
    .test(validNumericText("等待時間限定只能輸入數字")),
  callAsso: string(),
  url: string().trim().required("通算網址必須輸入"),
  maxAmt: string()
    .trim()
    .required("累計最大保障必須輸入")
    .validateNumber("累計最大保障限定只能輸入數字")
    .test(validNumericText("累計最大保障限定只能輸入數字")),
  connectTimeout: string()
    .trim()
    .required("連線等候時間必須輸入")
    .validateNumber("連線等候時間限定只能輸入數字")
    .test(validNumericText("連線等候時間限定只能輸入數字")),
  retry: string()
    .trim()
    .required("重試次數必須輸入")
    .validateNumber("重試次數限定只能輸入數字")
    .test(validNumericText("重試次數限定只能輸入數字")),
});
const validationSchema = object({
  newEntry: object({
    src: string().trim().required("契約來源必須輸入"),
    timeout: string()
      .trim()
      .required("等待時間必須輸入")
      .validateNumber("等待時間限定只能輸入數字")
      .test(validNumericText("等待時間限定只能輸入數字")),
    callAsso: string(),
    url: string().trim().required("通算網址必須輸入"),
    maxAmt: string()
      .trim()
      .required("累計最大保障必須輸入")
      .validateNumber("累計最大保障限定只能輸入數字")
      .test(validNumericText("累計最大保障限定只能輸入數字")),
    connectTimeout: string()
      .trim()
      .required("連線等候時間必須輸入")
      .validateNumber("連線等候時間限定只能輸入數字")
      .test(validNumericText("連線等候時間限定只能輸入數字")),
    retry: string()
      .trim()
      .required("重試次數必須輸入")
      .validateNumber("重試次數限定只能輸入數字")
      .test(validNumericText("重試次數限定只能輸入數字")),
  }),
});

const pendingAction = ref("");
const isOperationLocked = ref(false);
const selectedIndex = ref(-1);
const detailFieldErrors = ref({});
const pagination = ref({ rowsPerPage: 0 });
const isModalVisible = ref(false);
const modalTitle = ref("提示");
const modalMessages = ref([]);
const modalCancelText = ref("");
const modalConfirmText = ref("關閉");
const isBusy = computed(() => isOperationLocked.value);
let modalResult = false;
let resolveModal;

const { errors, setErrors, setValues, validate } = useForm({
  validationSchema,
  initialValues: {
    newEntry: { ...EMPTY_NEW_ENTRY },
    details: [],
  },
  validateOnMount: false,
});
const { value: newSrc } = useField("newEntry.src");
const { value: newTimeout } = useField("newEntry.timeout");
const { value: newCallAsso } = useField("newEntry.callAsso");
const { value: newUrl } = useField("newEntry.url");
const { value: newMaxAmt } = useField("newEntry.maxAmt");
const { value: newConnectTimeout } = useField("newEntry.connectTimeout");
const { value: newRetry } = useField("newEntry.retry");
const { value: details } = useField("details");

/**
 * 將訊息正規化為彈窗可顯示的字串陣列。
 *
 * @param {unknown} messages - 待顯示訊息
 * @returns {string[]} 正規化後的訊息
 */
const normalizeMessages = (messages) => {
  if (Array.isArray(messages)) {
    return messages.filter(Boolean).map(String);
  }
  return messages ? [String(messages)] : [];
};

/**
 * 開啟訊息或確認彈窗。
 *
 * @param {object} options - 彈窗設定
 * @param {string} options.title - 彈窗標題
 * @param {unknown} options.messages - 彈窗訊息
 * @param {string} options.confirmText - 確認按鈕文字
 * @param {string} options.cancelText - 取消按鈕文字
 * @returns {Promise<boolean>} 使用者是否確認
 */
const openModal = ({
  title,
  messages,
  confirmText,
  cancelText,
}) => new Promise((resolve) => {
  modalTitle.value = title;
  modalMessages.value = normalizeMessages(messages);
  modalConfirmText.value = confirmText;
  modalCancelText.value = cancelText;
  modalResult = false;
  resolveModal = resolve;
  isModalVisible.value = true;
});

/**
 * 顯示提示訊息。
 *
 * @param {unknown} messages - 待顯示訊息
 * @returns {Promise<void>} 彈窗關閉後完成
 */
const showAlert = async (messages) => {
  const normalizedMessages = normalizeMessages(messages);
  if (normalizedMessages.length === 0) return;
  await openModal({
    title: "提示",
    messages: normalizedMessages,
    confirmText: "關閉",
    cancelText: "",
  });
};

/**
 * 顯示操作確認訊息。
 *
 * @param {string} message - 確認訊息
 * @returns {Promise<boolean>} 使用者是否確認
 */
const showConfirm = (message) => openModal({
  title: "確認",
  messages: message,
  confirmText: "確認",
  cancelText: "取消",
});

/**
 * 處理彈窗確認按鈕。
 *
 * @returns {void}
 */
const handleModalConfirm = () => {
  modalResult = true;
  isModalVisible.value = false;
};

/**
 * 處理彈窗取消按鈕。
 *
 * @returns {void}
 */
const handleModalCancel = () => {
  modalResult = false;
  isModalVisible.value = false;
};

/**
 * 在彈窗完全關閉後結束等待中的操作。
 *
 * @returns {void}
 */
const handleModalHide = () => {
  if (!resolveModal) return;
  const resolve = resolveModal;
  resolveModal = undefined;
  resolve(modalResult);
};

/**
 * 顯示表單驗證錯誤。
 *
 * @param {string[]} messages - 驗證錯誤訊息
 * @returns {Promise<void>} 彈窗關閉後完成
 */
const showValidationErrors = async (messages) => {
  const uniqueMessages = [...new Set(messages.filter(Boolean))];
  await showAlert([...uniqueMessages, "請確認紅框欄位後再執行操作。"]);
};

/**
 * 取得指定清單欄位的錯誤訊息。
 *
 * @param {number} index - 清單索引
 * @param {string} field - 欄位名稱
 * @returns {string} 錯誤訊息
 */
const getDetailFieldError = (index, field) => (
  selectedIndex.value === index ? detailFieldErrors.value[field] ?? "" : ""
);

/**
 * 清除指定清單欄位的錯誤訊息。
 *
 * @param {number} index - 清單索引
 * @param {string} field - 欄位名稱
 * @returns {void}
 */
const clearDetailFieldError = (index, field) => {
  if (selectedIndex.value !== index || !detailFieldErrors.value[field]) return;
  const nextErrors = { ...detailFieldErrors.value };
  delete nextErrors[field];
  detailFieldErrors.value = nextErrors;
};

/**
 * 驗證指定清單資料。
 *
 * @param {number} index - 清單索引
 * @returns {Promise<boolean>} 是否通過驗證
 */
const validateDetail = async (index) => {
  const detail = details.value[index];
  if (!detail) {
    await showAlert("找不到指定的公會通報設定。");
    return false;
  }

  try {
    await detailValidationSchema.validate(detail, { abortEarly: false });
    detailFieldErrors.value = {};
    return true;
  } catch (error) {
    if (!(error instanceof ValidationError)) throw error;
    const nextErrors = {};
    error.inner.forEach(({ path, message }) => {
      if (path && !nextErrors[path]) nextErrors[path] = message;
    });
    detailFieldErrors.value = nextErrors;
    await showValidationErrors(Object.values(nextErrors));
    return false;
  }
};

/**
 * 建立後端作業所需的原始 DTO。
 *
 * @returns {object} 公會通報設定作業參數
 */
const buildFormPayload = () => ({
  SRC_NEW: newSrc.value,
  TIMEOUT_NEW: newTimeout.value,
  CALL_ASSO_NEW: newCallAsso.value,
  URL_NEW: newUrl.value,
  MAXAMT_NEW: newMaxAmt.value,
  CONNECT_TIMEOUT_NEW: newConnectTimeout.value,
  RETRY_NEW: newRetry.value,
  index: selectedIndex.value,
  SRC: details.value.map((detail) => detail.src),
  TIMEOUT: details.value.map((detail) => detail.timeout),
  CALL_ASSO: details.value.map((detail) => detail.callAsso),
  URL: details.value.map((detail) => detail.url),
  MAXAMT: details.value.map((detail) => detail.maxAmt),
  CONNECT_TIMEOUT: details.value.map((detail) => detail.connectTimeout),
  RETRY: details.value.map((detail) => detail.retry),
});

/**
 * 載入公會通報設定清單。
 *
 * @returns {Promise<void>} 載入完成
 */
const fetchPageData = async () => {
  const response = await $cathayAxios.post(ata08110Service.prompt, {});
  if (response.returnCode !== 0) return;
  if (!Array.isArray(response.data?.details)) {
    await showAlert("伺服器回傳的公會通報設定格式錯誤。");
    return;
  }

  setValues({
    newEntry: { ...EMPTY_NEW_ENTRY },
    details: response.data.details,
  });
  setErrors({});
  selectedIndex.value = -1;
  detailFieldErrors.value = {};
  await showAlert(response.data.messages);
};

/**
 * 執行新增、修改或刪除作業。
 *
 * @param {string} actionKey - 畫面操作識別值
 * @param {string} endpoint - API endpoint
 * @param {string} successMessage - 成功訊息
 * @returns {Promise<void>} 作業完成
 */
const executeAction = async (actionKey, endpoint, successMessage) => {
  pendingAction.value = actionKey;
  try {
    const response = await $cathayAxios.post(endpoint, buildFormPayload());
    if (response.returnCode !== 0) return;
    await showAlert(successMessage);
    await fetchPageData();
  } finally {
    pendingAction.value = "";
  }
};

/**
 * 驗證並新增公會通報設定。
 *
 * @returns {Promise<void>} 新增流程完成
 */
const insertDetail = async () => {
  if (isOperationLocked.value) return;
  isOperationLocked.value = true;
  try {
    selectedIndex.value = -1;
    detailFieldErrors.value = {};
    const { valid } = await validate();
    if (!valid) {
      await showValidationErrors(Object.values(errors.value));
      return;
    }
    await executeAction(
      "insert",
      ata08110Service.insert,
      "公會通報設定新增成功",
    );
  } finally {
    isOperationLocked.value = false;
  }
};

/**
 * 確認並刪除指定公會通報設定。
 *
 * @param {number} index - 清單索引
 * @returns {Promise<void>} 刪除流程完成
 */
const requestDelete = async (index) => {
  if (isOperationLocked.value) return;
  isOperationLocked.value = true;
  try {
    selectedIndex.value = index;
    detailFieldErrors.value = {};
    const confirmed = await showConfirm("請確認是否要刪除？");
    if (!confirmed) return;
    await executeAction(
      `delete-${index}`,
      ata08110Service.delete,
      "公會通報設定刪除成功",
    );
  } finally {
    isOperationLocked.value = false;
  }
};

/**
 * 驗證、確認並修改指定公會通報設定。
 *
 * @param {number} index - 清單索引
 * @returns {Promise<void>} 修改流程完成
 */
const requestUpdate = async (index) => {
  if (isOperationLocked.value) return;
  isOperationLocked.value = true;
  try {
    selectedIndex.value = index;
    const valid = await validateDetail(index);
    if (!valid) return;
    const confirmed = await showConfirm("請確認是否要修改？");
    if (!confirmed) return;
    await executeAction(
      `update-${index}`,
      ata08110Service.update,
      "公會通報設定修改成功",
    );
  } finally {
    isOperationLocked.value = false;
  }
};

onMounted(fetchPageData);
</script>
