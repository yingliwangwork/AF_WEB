<template>
  <CxlBreadcrumbs
    class="q-mb-md"
    :breadcrumbs="navCollection"
    :routerPath="$route.path"
    :rootPath="ROOT_PATH"
  />
  <div class="cxl-title-h1 q-mt-md q-mb-md">公會通報設定(AF)</div>

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
              :disable="isBusy"
              maxlength="6"
              placeholder="請輸入契約來源"
              :error="!!errors['newEntry.src']"
              :error-message="errors['newEntry.src']"
            />
          </td>
          <th><span class="cxl-text-danger">*</span> 連線等候時間（毫秒）</th>
          <td>
            <CxlInput
              v-model="newTimeout"
              :disable="isBusy"
              placeholder="請輸入連線等候時間"
              :error="!!errors['newEntry.timeout']"
              :error-message="errors['newEntry.timeout']"
            />
          </td>
          <th><span class="cxl-text-danger">*</span> 資料等候時間（毫秒）</th>
          <td>
            <CxlInput
              v-model="newDataTimeout"
              :disable="isBusy"
              placeholder="請輸入資料等候時間"
              :error="!!errors['newEntry.dataTimeout']"
              :error-message="errors['newEntry.dataTimeout']"
            />
          </td>
        </tr>
        <tr>
          <th>作業開關</th>
          <td>
            <CxlDropdown
              v-model="newIsEffective"
              :disable="isBusy"
              :options="EFFECTIVE_OPTIONS"
              emit-value
              map-options
            />
          </td>
          <th><span class="cxl-text-danger">*</span> 公會連線方式</th>
          <td>
            <CxlInput
              v-model="newConnection"
              :disable="isBusy"
              maxlength="1"
              placeholder="W 或 V"
              :error="!!errors['newEntry.connection']"
              :error-message="errors['newEntry.connection']"
              @update:model-value="handleNewConnectionInput"
            />
          </td>
          <th>WebService 呼叫方法</th>
          <td>
            <CxlDropdown
              v-model="newAction"
              :disable="isBusy"
              :options="actionOptions"
              emit-value
              map-options
            />
          </td>
        </tr>
        <tr>
          <th><span class="cxl-text-danger">*</span> 重試次數</th>
          <td>
            <CxlInput
              v-model="newRetry"
              :disable="isBusy"
              placeholder="請輸入重試次數"
              :error="!!errors['newEntry.retry']"
              :error-message="errors['newEntry.retry']"
            />
          </td>
          <th><span class="cxl-text-danger">*</span> FTP 登入帳號</th>
          <td>
            <CxlInput
              v-model="newFtpHost"
              :disable="isBusy"
              maxlength="1"
              placeholder="1 或 2"
              :error="!!errors['newEntry.ftpHost']"
              :error-message="errors['newEntry.ftpHost']"
            />
          </td>
          <th>通報種類</th>
          <td>
            <CxlInput
              v-model="newType"
              :disable="isBusy"
              maxlength="1"
              placeholder="R 或 L"
            />
          </td>
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
              :disable="isBusy"
              :error="!!getDetailFieldError(props.rowIndex, 'timeout')"
              :error-message="getDetailFieldError(props.rowIndex, 'timeout')"
              @update:model-value="
                clearDetailFieldError(props.rowIndex, 'timeout')
              "
            />
          </q-td>
          <q-td key="dataTimeout" :props="props">
            <CxlInput
              v-model="props.row.dataTimeout"
              :disable="isBusy"
              :error="!!getDetailFieldError(props.rowIndex, 'dataTimeout')"
              :error-message="
                getDetailFieldError(props.rowIndex, 'dataTimeout')
              "
              @update:model-value="
                clearDetailFieldError(props.rowIndex, 'dataTimeout')
              "
            />
          </q-td>
          <q-td key="isEffective" :props="props">
            <CxlDropdown
              v-model="props.row.isEffective"
              :disable="isBusy"
              :options="EFFECTIVE_OPTIONS"
              emit-value
              map-options
            />
          </q-td>
          <q-td key="connection" :props="props">
            <CxlInput
              v-model="props.row.connection"
              :disable="isBusy"
              maxlength="1"
              :error="!!getDetailFieldError(props.rowIndex, 'connection')"
              :error-message="
                getDetailFieldError(props.rowIndex, 'connection')
              "
              @update:model-value="
                handleDetailConnectionInput(props.rowIndex, $event)
              "
            />
          </q-td>
          <q-td key="action" :props="props">
            <CxlDropdown
              v-model="props.row.action"
              :disable="isBusy"
              :options="actionOptions"
              emit-value
              map-options
            />
          </q-td>
          <q-td key="retry" :props="props">
            <CxlInput
              v-model="props.row.retry"
              :disable="isBusy"
              :error="!!getDetailFieldError(props.rowIndex, 'retry')"
              :error-message="getDetailFieldError(props.rowIndex, 'retry')"
              @update:model-value="
                clearDetailFieldError(props.rowIndex, 'retry')
              "
            />
          </q-td>
          <q-td key="ftpHost" :props="props">
            <CxlInput
              v-model="props.row.ftpHost"
              :disable="isBusy"
              maxlength="1"
              :error="!!getDetailFieldError(props.rowIndex, 'ftpHost')"
              :error-message="getDetailFieldError(props.rowIndex, 'ftpHost')"
              @update:model-value="
                clearDetailFieldError(props.rowIndex, 'ftpHost')
              "
            />
          </q-td>
          <q-td key="type" :props="props">
            <CxlInput
              v-model="props.row.type"
              :disable="isBusy"
              maxlength="1"
            />
          </q-td>
          <q-td key="operation" :props="props">
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

  <q-card class="cxl-card q-pa-md q-mb-lg">
    <div class="text-subtitle1 q-mb-sm">使用說明</div>
    <ol class="q-my-none q-pl-lg">
      <li>通報種類：R＝收件，L＝承保（取回作業不使用此欄位）。</li>
      <li>公會連線方式：W＝WebService，V＝VPN。</li>
      <li>FTP 登入帳號：1＝網路投保，2＝批次。</li>
      <li>作業開關：Y＝開，N＝關；正式環境請小心使用。</li>
    </ol>
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
import ata08120Service from "@/service/ATA08120Service.js";
import navCollection from "@/service/NavCollection.js";

const $cathayAxios = inject("$cathayAxios");
const $route = useRoute();
const ROOT_PATH = { label: "首頁", url: "/" };
const EMPTY_NEW_ENTRY = {
  src: "",
  timeout: "",
  dataTimeout: "",
  isEffective: "Y",
  connection: "",
  action: "",
  retry: "",
  ftpHost: "",
  type: "",
};
const EFFECTIVE_OPTIONS = [
  { label: "開啟", value: "Y" },
  { label: "關閉", value: "N" },
];
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
    label: "連線等候時間（毫秒）",
    field: "timeout",
    align: "center",
  },
  {
    name: "dataTimeout",
    label: "資料等候時間（毫秒）",
    field: "dataTimeout",
    align: "center",
  },
  {
    name: "isEffective",
    label: "作業開關",
    field: "isEffective",
    align: "center",
  },
  {
    name: "connection",
    label: "公會連線方式",
    field: "connection",
    align: "center",
  },
  {
    name: "action",
    label: "WebService 呼叫方法",
    field: "action",
    align: "center",
  },
  {
    name: "retry",
    label: "重試次數",
    field: "retry",
    align: "center",
  },
  {
    name: "ftpHost",
    label: "FTP 登入帳號",
    field: "ftpHost",
    align: "center",
  },
  {
    name: "type",
    label: "通報種類",
    field: "type",
    align: "center",
  },
  {
    name: "operation",
    label: "操作",
    field: "operation",
    align: "center",
  },
];

/**
 * 建立數字字串的補充驗證規則。
 *
 * @param {string} message - 驗證失敗訊息
 * @returns {object} Yup 自訂驗證設定
 */
const validNumericText = (message) => ({
  name: "validNumericText",
  message,
  test: (value) => !value?.trim() || !Number.isNaN(Number(value)),
});

const detailValidationSchema = object({
  timeout: string()
    .trim()
    .required("連線等候時間必須輸入")
    .validateNumber("連線等候時間限定只能輸入數字")
    .test(validNumericText("連線等候時間限定只能輸入數字")),
  dataTimeout: string()
    .trim()
    .required("資料等候時間必須輸入")
    .validateNumber("資料等候時間限定只能輸入數字")
    .test(validNumericText("資料等候時間限定只能輸入數字")),
  connection: string()
    .trim()
    .required("公會連線方式必須輸入")
    .max(1, "公會連線方式限輸入 1 碼"),
  retry: string()
    .trim()
    .required("重試次數必須輸入")
    .validateNumber("重試次數限定只能輸入數字")
    .test(validNumericText("重試次數限定只能輸入數字")),
  ftpHost: string()
    .trim()
    .required("FTP 登入帳號必須輸入")
    .max(1, "FTP 登入帳號限輸入 1 碼"),
});
const validationSchema = object({
  newEntry: object({
    src: string()
      .trim()
      .required("契約來源必須輸入")
      .max(6, "契約來源限輸入 6 碼"),
    timeout: string()
      .trim()
      .required("連線等候時間必須輸入")
      .validateNumber("連線等候時間限定只能輸入數字")
      .test(validNumericText("連線等候時間限定只能輸入數字")),
    dataTimeout: string()
      .trim()
      .required("資料等候時間必須輸入")
      .validateNumber("資料等候時間限定只能輸入數字")
      .test(validNumericText("資料等候時間限定只能輸入數字")),
    isEffective: string(),
    connection: string()
      .trim()
      .required("公會連線方式必須輸入")
      .max(1, "公會連線方式限輸入 1 碼"),
    action: string(),
    retry: string()
      .trim()
      .required("重試次數必須輸入")
      .validateNumber("重試次數限定只能輸入數字")
      .test(validNumericText("重試次數限定只能輸入數字")),
    ftpHost: string()
      .trim()
      .required("FTP 登入帳號必須輸入")
      .max(1, "FTP 登入帳號限輸入 1 碼"),
    type: string().max(1, "通報種類限輸入 1 碼"),
  }),
});

const pendingAction = ref("");
const isOperationLocked = ref(false);
const isPageLoading = ref(false);
const selectedIndex = ref("");
const detailFieldErrors = ref({});
const actionOptions = ref([]);
const pagination = ref({ rowsPerPage: 0 });
const isModalVisible = ref(false);
const modalTitle = ref("提示");
const modalMessages = ref([]);
const modalCancelText = ref("");
const modalConfirmText = ref("關閉");
const isBusy = computed(
  () => isOperationLocked.value || isPageLoading.value,
);
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
const { value: newDataTimeout } = useField("newEntry.dataTimeout");
const { value: newIsEffective } = useField("newEntry.isEffective");
const { value: newConnection } = useField("newEntry.connection");
const { value: newAction } = useField("newEntry.action");
const { value: newRetry } = useField("newEntry.retry");
const { value: newFtpHost } = useField("newEntry.ftpHost");
const { value: newType } = useField("newEntry.type");
const { value: details } = useField("details");

/**
 * 將輸入值轉為大寫字串。
 *
 * @param {unknown} value - 待轉換值
 * @returns {string} 大寫字串
 */
const toUpperCase = (value) => String(value ?? "").toUpperCase();

/**
 * 將新增區的公會連線方式轉為大寫。
 *
 * @param {unknown} value - 欄位輸入值
 * @returns {void}
 */
const handleNewConnectionInput = (value) => {
  newConnection.value = toUpperCase(value);
};

/**
 * 將清單內的公會連線方式轉為大寫並清除欄位錯誤。
 *
 * @param {number} index - 清單索引
 * @param {unknown} value - 欄位輸入值
 * @returns {void}
 */
const handleDetailConnectionInput = (index, value) => {
  if (!details.value[index]) return;
  details.value[index].connection = toUpperCase(value);
  clearDetailFieldError(index, "connection");
};

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
 * 在彈窗關閉時結束等待中的操作。
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
  DATA_TIMEOUT_NEW: newDataTimeout.value,
  IS_EFFECTIVE_NEW: newIsEffective.value,
  CONNECTION_NEW: newConnection.value,
  ACTION_NEW: newAction.value,
  RETRY_NEW: newRetry.value,
  FTP_HOST_NEW: newFtpHost.value,
  TYPE_NEW: newType.value,
  SRC: details.value.map((detail) => detail.src),
  TIMEOUT: details.value.map((detail) => detail.timeout),
  DATA_TIMEOUT: details.value.map((detail) => detail.dataTimeout),
  IS_EFFECTIVE: details.value.map((detail) => detail.isEffective),
  CONNECTION: details.value.map((detail) => detail.connection),
  ACTION: details.value.map((detail) => detail.action),
  RETRY: details.value.map((detail) => detail.retry),
  FTP_HOST: details.value.map((detail) => detail.ftpHost),
  TYPE: details.value.map((detail) => detail.type),
  index: selectedIndex.value,
});

/**
 * 載入公會通報設定清單與 WebService 方法選項。
 *
 * @returns {Promise<void>} 載入完成
 */
const fetchPageData = async () => {
  isPageLoading.value = true;
  try {
    const response = await $cathayAxios.post(ata08120Service.prompt, {});
    if (response.returnCode !== 0) return;
    if (
      !Array.isArray(response.data?.details)
      || !Array.isArray(response.data?.actionOptions)
    ) {
      await showAlert("伺服器回傳的公會通報設定格式錯誤。");
      return;
    }

    setValues({
      newEntry: { ...EMPTY_NEW_ENTRY },
      details: response.data.details,
    });
    setErrors({});
    actionOptions.value = response.data.actionOptions;
    selectedIndex.value = "";
    detailFieldErrors.value = {};
    await showAlert(response.data.messages);
  } finally {
    isPageLoading.value = false;
  }
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
    selectedIndex.value = "";
    detailFieldErrors.value = {};
    const { valid } = await validate();
    if (!valid) {
      await showValidationErrors(Object.values(errors.value));
      return;
    }
    await executeAction(
      "insert",
      ata08120Service.insert,
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
  if (!details.value[index]) {
    await showAlert("找不到指定的公會通報設定。");
    return;
  }

  isOperationLocked.value = true;
  try {
    selectedIndex.value = index;
    detailFieldErrors.value = {};
    const confirmed = await showConfirm("請確認是否要刪除？");
    if (!confirmed) return;
    await executeAction(
      `delete-${index}`,
      ata08120Service.delete,
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
      ata08120Service.update,
      "公會通報設定修改成功",
    );
  } finally {
    isOperationLocked.value = false;
  }
};

onMounted(fetchPageData);
</script>
