<template>
  <CxlBreadcrumbs
    class="q-mb-md"
    :breadcrumbs="navCollection"
    :routerPath="$route.path"
    :rootPath="ROOT_PATH"
  />
  <div class="cxl-title-h1 q-mt-md q-mb-md">公會補通報作業</div>

  <q-card class="cxl-card q-pa-md q-mb-lg">
    <q-markup-table
      class="cxl-table cxl-table-horizontal scroll-x"
      separator="cell"
      flat
      bordered
    >
      <thead>
        <tr>
          <th colspan="8" class="cxl-table-header">查詢條件</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="queryRow in QUERY_ROWS" :key="queryRow[0].name">
          <template v-for="field in queryRow" :key="field.name">
            <template v-if="field.kind === 'empty'">
              <th></th>
              <td></td>
            </template>
            <template v-else>
              <th>{{ field.label }}</th>
              <td>
                <CxlDropdown
                  v-if="field.kind === 'select'"
                  v-model="fieldModels[field.name].value"
                  :options="field.options"
                  emit-value
                  map-options
                  :error="!!errors[field.name]"
                  :error-message="errors[field.name]"
                />
                <CxlInput
                  v-else
                  v-model="fieldModels[field.name].value"
                  :maxlength="field.maxlength"
                  :placeholder="field.placeholder"
                  :error="!!errors[field.name]"
                  :error-message="errors[field.name]"
                >
                  <template v-if="field.kind === 'date'" #append>
                    <q-icon name="event" class="cursor-pointer">
                      <CxlPopupProxy>
                        <CxlCalendar
                          v-model="fieldModels[field.name].value"
                          calendar="ROC"
                          output-type="ROC"
                          mask="YYYMMDD"
                          minimal
                        />
                      </CxlPopupProxy>
                    </q-icon>
                  </template>
                </CxlInput>
              </td>
            </template>
          </template>
        </tr>
        <tr>
          <td colspan="8">
            <div class="row justify-center">
              <CxlButton label="F2 查詢" @click="query" />
            </div>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>

  <q-card v-if="showQuery" class="cxl-card q-pa-md q-mb-lg">
    <div class="text-h6 q-mb-md">補通報查詢結果</div>
    <CxlTable
      v-model:selected="selectedRows"
      :rows="resultRows"
      :columns="resultColumns"
      row-key="_rowKey"
      selection="single"
      separator="cell"
      @update:selected="handleResultSelection"
    >
      <template #header-selection>選取</template>
      <template #body-selection="scope">
        <q-radio
          v-model="scope.selected"
          class="cxl-radio"
          :val="true"
          dense
        />
      </template>
    </CxlTable>
    <div class="row justify-center q-mt-md">
      <CxlButton
        label="Excel 匯出"
        theme="primary-outline"
        prevIcon="cub-icon-download"
        @click="exportFile"
      />
    </div>
  </q-card>

  <q-card v-if="isEditVisible" class="cxl-card q-pa-md q-mb-lg">
    <q-markup-table
      class="cxl-table-form"
      separator="horizontal"
      flat
      bordered
    >
      <colgroup>
        <template v-for="columnIndex in 5" :key="columnIndex">
          <col style="width: 10%" />
          <col style="width: 10%" />
        </template>
      </colgroup>
      <thead>
        <tr>
          <th colspan="10" class="cxl-form-title">資料編輯區</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="editRow in EDIT_ROWS" :key="editRow[0].name">
          <template v-for="field in editRow" :key="field.name">
            <th>
              <span v-if="field.required" class="cxl-text-danger">*</span>
              <span :class="{ 'cxl-text-danger': field.emphasis }">
                {{ field.label }}
              </span>
            </th>
            <td>
              <template v-if="!field.requiresRType || isRType">
                <span v-if="field.kind === 'display'">
                  {{ displayValues[field.name] }}
                </span>
                <CxlDropdown
                  v-else-if="field.kind === 'select'"
                  v-model="fieldModels[field.name].value"
                  :options="resolveFieldOptions(field)"
                  emit-value
                  map-options
                  :error="!!errors[field.name]"
                  :error-message="errors[field.name]"
                />
                <CxlInput
                  v-else
                  v-model="fieldModels[field.name].value"
                  :maxlength="field.maxlength"
                  :error="!!errors[field.name]"
                  :error-message="errors[field.name]"
                >
                  <template v-if="field.kind === 'date'" #append>
                    <q-icon name="event" class="cursor-pointer">
                      <CxlPopupProxy>
                        <CxlCalendar
                          v-model="fieldModels[field.name].value"
                          calendar="ROC"
                          output-type="ROC"
                          mask="YYYMMDD"
                          minimal
                        />
                      </CxlPopupProxy>
                    </q-icon>
                  </template>
                </CxlInput>
              </template>
            </td>
          </template>
        </tr>
        <tr>
          <td colspan="10">
            <div class="row justify-center q-gutter-sm">
              <CxlButton label="F9 修改" @click="edit" />
              <CxlButton
                label="F10 取消"
                theme="primary-outline"
                @click="cancelEdit"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>

  <q-card class="cxl-card q-pa-md q-mb-lg">
    <div class="text-h6 q-mb-md">檔案匯入</div>
    <div class="row items-start q-gutter-md">
      <div class="col">
        <CxlUploader
          ref="uploaderRef"
          name="uploadFile"
          :ext="['xlsx']"
          :multiple="false"
          @getFiles="handleUploadFilesChange"
          @uploadFiles="importFile"
        />
        <div v-if="errors.uploadFile" class="cxl-text-danger q-mt-xs">
          {{ errors.uploadFile }}
        </div>
        <div class="cxl-text-gray-6d q-mt-xs">亦可按 F8 上傳檔案</div>
      </div>
      <CxlButton label="即時大批通報" @click="executeGroupReport" />
    </div>
  </q-card>

  <q-card class="cxl-card q-pa-md">
    <div class="text-h6 q-mb-md">操作說明</div>
    <ol class="cxl-ordered-list">
      <li>
        使用大批匯入時，請先查詢資料並匯出 Excel，修正錯誤及處理結果後再上傳。
        <span class="cxl-text-danger">保單狀況生效日亦須同步調整。</span>
      </li>
      <li>
        Excel 內容：
        <ul class="cxl-unordered-list q-mt-xs">
          <li>處理結果代碼：7 不需通報、8 重新通報、9 至公會系統人工通報。</li>
          <li>結果目前僅顯示 3（通報失敗）。</li>
          <li>保額為投保保額，目前僅壽險顯示。</li>
        </ul>
      </li>
      <li>F8 檔案上傳：收件批次每半小時處理，承保案件隔天通報。</li>
      <li>即時大批通報：將目前所有待通報的收件、承保案件立即通報公會。</li>
    </ol>
    <CxlButton
      label="開啟公會補通報操作手冊"
      theme="primary-outline"
      @click="openOperationManual"
    />
  </q-card>

  <CxlModal
    v-model="showGroupReportConfirm"
    title="確認即時大批通報"
    cancel-text="取消"
    confirm-text="確認通報"
    persistent
    @cancel="showGroupReportConfirm = false"
    @confirm="confirmGroupReport"
  >
    <p>{{ groupReportConfirmMessage }}</p>
  </CxlModal>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, onMounted, reactive, ref, shallowRef } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useField, useForm } from "vee-validate";
import { mixed, object, string } from "yup";
import {
  CxlBreadcrumbs,
  CxlButton,
  CxlCalendar,
  CxlDropdown,
  CxlInput,
  CxlModal,
  CxlPopupProxy,
  CxlTable,
  CxlUploader,
} from "vue-cathaylife-component";
import "@/assets/libs/CathayValidateRules.js";
import afy10300Service from "@/service/AFY10300Service.js";
import navCollection from "@/service/NavCollection.js";

const $cathayAxios = inject("$cathayAxios");
const $notify = inject("$notify");
const $route = useRoute();
const router = useRouter();
const ROOT_PATH = { label: "首頁", url: "/" };

const QUERY_NO_OPTIONS = [
  { label: "失敗檔（可不輸入失敗檔序號）", value: "0" },
  { label: "保單號碼", value: "1" },
  { label: "被保人 ID", value: "2" },
];
const ERROR_CODE_OPTIONS = ["99", "36", "37", "39", "40", "45"].map((value) => ({
  label: value === "99" ? "全部" : value,
  value,
}));
const INSR_TYPE_OPTIONS = [
  { label: "承保", value: "L" },
  { label: "收件", value: "R" },
];
const PROD_TYPE_OPTIONS = [
  { label: "個險", value: "AT" },
  { label: "團險", value: "BG" },
  { label: "意外險", value: "CB" },
];
const PROC_STATUS_OPTIONS = [
  { label: "未處理", value: "1" },
  { label: "已處理", value: "2" },
  { label: "全部", value: "0" },
];
const GENDER_OPTIONS = [
  { label: "男", value: "1" },
  { label: "女", value: "2" },
];
const POLICY_CAT_OPTIONS = [
  { label: "個人", value: "1" },
  { label: "團體", value: "2" },
];
const PAY_TYPE_OPTIONS = [
  { label: "無", value: "0" },
  { label: "公費", value: "1" },
  { label: "自費", value: "2" },
];
const PAYMENT_FIELDS = [
  { name: "payAmt1", label: "身故" },
  { name: "payAmt2", label: "完全失能" },
  { name: "payAmt3", label: "失能扶助金" },
  { name: "payAmt4", label: "特定事故" },
  { name: "payAmt5", label: "初次罹患" },
  { name: "payAmt6", label: "醫療限額" },
  { name: "payAmt7", label: "醫療限額自負" },
  { name: "payAmt8", label: "醫療日額" },
  { name: "payAmt9", label: "住院手術" },
  { name: "payAmt10", label: "門診手術" },
  { name: "payAmt11", label: "門診日額" },
  { name: "payAmt12", label: "重大疾／傷病" },
  { name: "payAmt13", label: "重大燒燙傷" },
  { name: "payAmt14", label: "癌症療養" },
  { name: "payAmt15", label: "出院療養" },
  { name: "payAmt16", label: "失能" },
  { name: "payAmt17", label: "喪葬費用" },
  { name: "payAmt18", label: "銜接原醫療限額之自負額" },
  { name: "payAmt19", label: "分開給付" },
];
const FORM_FIELD_NAMES = [
  "queryNo", "idNo", "insrDate", "errorCode", "insrType", "prodType", "procStatus",
  "uploadFile", "iName", "iId", "iBirthday", "iGender", "mainPolicyNo", "policyNo",
  "oiuInd", "saleChnl", "prodCode", "policyCat", "policyDuty", "prodKind", "payType",
  ...PAYMENT_FIELDS.map(({ name }) => name),
  "issueDate", "issueTime", "lpsDate", "lpsTime", "prem", "payFreq", "payPeriod",
  "status", "lstChgDate", "lstChgTime", "aName", "aId", "aBirthday", "relation",
  "signDate", "brokType", "liaStatus", "updateTime", "oldIId", "oldIBirthday",
  "oldPolicyNo", "oldPolicyCat", "oldPolicyDuty", "oldProdKind", "oldStatus",
  "oldLstChgDate", "oldUpdateTime", "regQueryNo", "regIdNo", "regInsrDate",
  "regInsrType", "regErrorCode", "regProdType", "regProcStatus", "regRadioNum",
  "showEdit",
];
const initialValues = Object.fromEntries(FORM_FIELD_NAMES.map((name) => [name, ""]));
Object.assign(initialValues, {
  queryNo: "0",
  errorCode: "99",
  insrType: "L",
  prodType: "AT",
  procStatus: "1",
  uploadFile: null,
});

const QUERY_ROWS = [
  [
    { name: "queryNo", label: "查詢方式", kind: "select", options: QUERY_NO_OPTIONS },
    {
      name: "idNo",
      label: "失敗檔／保單號碼／被保人 ID",
      kind: "input",
      placeholder: "請依查詢方式輸入",
    },
    {
      name: "insrDate",
      label: "通報日期",
      kind: "date",
      maxlength: 7,
      placeholder: "民國年月日",
    },
    { name: "errorCode", label: "錯誤代碼", kind: "select", options: ERROR_CODE_OPTIONS },
  ],
  [
    { name: "insrType", label: "收承方式", kind: "select", options: INSR_TYPE_OPTIONS },
    { name: "prodType", label: "商品屬性", kind: "select", options: PROD_TYPE_OPTIONS },
    { name: "procStatus", label: "處理狀態", kind: "select", options: PROC_STATUS_OPTIONS },
    { name: "queryEmpty", label: "", kind: "empty" },
  ],
];
const editFields = [
  { name: "insrTypeDesc", label: "通報方式", kind: "display" },
  { name: "iName", label: "被保險人姓名", kind: "input" },
  { name: "iId", label: "被保人 ID", kind: "input", required: true },
  { name: "iBirthday", label: "被保人生日", kind: "date", maxlength: 7, required: true },
  { name: "iGender", label: "被保險人性別", kind: "select", options: () => GENDER_OPTIONS },
  { name: "mainPolicyNo", label: "主約保單號碼", kind: "input", required: true },
  { name: "policyNo", label: "保單號碼", kind: "input", required: true },
  { name: "oiuInd", label: "來源別 OIU", kind: "input" },
  { name: "saleChnl", label: "銷售通路別", kind: "select", options: () => saleChnlOptions.value },
  { name: "prodCode", label: "商品代碼", kind: "input" },
  { name: "policyCat", label: "保單分類", kind: "select", options: () => POLICY_CAT_OPTIONS },
  { name: "policyDuty", label: "險種分類", kind: "select", options: () => policyDutyOptions.value },
  { name: "prodKind", label: "險種", kind: "select", options: () => prodKindOptions.value },
  { name: "payType", label: "公、自費件", kind: "select", options: () => PAY_TYPE_OPTIONS },
  ...PAYMENT_FIELDS.map((field) => ({ ...field, kind: "input", required: true })),
  { name: "issueDate", label: "契約生效日期", kind: "date", maxlength: 7, required: true },
  { name: "issueTime", label: "契約生效時分（旅平險）", kind: "input" },
  { name: "lpsDate", label: "契約滿期日期", kind: "date", maxlength: 7, required: true },
  { name: "lpsTime", label: "契約滿期時分", kind: "input" },
  { name: "prem", label: "保費", kind: "input", required: true },
  { name: "payFreq", label: "保費繳別", kind: "select", options: () => payFreqOptions.value },
  { name: "payPeriod", label: "保費繳費年期", kind: "input" },
  { name: "status", label: "保單狀況", kind: "input" },
  {
    name: "lstChgDate",
    label: "保單狀況生效日期",
    kind: "date",
    maxlength: 7,
    required: true,
    emphasis: true,
  },
  { name: "lstChgTime", label: "保單狀況生效時分", kind: "input" },
  { name: "aName", label: "要保人姓名", kind: "input" },
  { name: "aId", label: "要保人身分證號碼", kind: "input", required: true },
  { name: "aBirthday", label: "要保人生日", kind: "date", maxlength: 7, required: true },
  { name: "relation", label: "要被保人關係", kind: "select", options: () => relationOptions.value },
  {
    name: "signDate",
    label: "要保書填寫日（收件）",
    kind: "date",
    maxlength: 7,
    emphasis: true,
    requiresRType: true,
  },
  {
    name: "brokType",
    label: "保經代類別",
    kind: "select",
    options: () => brokTypeOptions.value,
    requiresRType: true,
  },
  {
    name: "liaStatus",
    label: "通報狀態",
    kind: "select",
    options: () => liaStatusOptions.value,
    required: true,
    emphasis: true,
  },
  { name: "outputTime", label: "通報日期", kind: "display" },
  { name: "serNo", label: "公會通報序號", kind: "display" },
  { name: "updateSrc", label: "資料來源", kind: "display" },
  { name: "memo", label: "失敗原因", kind: "display" },
];

/**
 * 將欄位定義切成固定欄數的資料列。
 *
 * @param {object[]} fields - 欄位定義
 * @param {number} size - 每列欄位數
 * @returns {object[][]} 分列後的欄位
 */
const chunkFields = (fields, size) => Array.from(
  { length: Math.ceil(fields.length / size) },
  (_, index) => fields.slice(index * size, index * size + size),
);

const EDIT_ROWS = chunkFields(editFields, 5);

/**
 * 建立必填非負數驗證。
 *
 * @param {string} message - 驗證錯誤訊息
 * @returns {import("yup").StringSchema} Yup 驗證規則
 */
const requiredNumber = (message) => string()
  .required(message)
  .test("nonNegativeNumber", message, (value) => (
    value !== undefined
    && value !== null
    && value.trim() !== ""
    && Number.isFinite(Number(value.trim()))
    && Number(value.trim()) >= 0
  ));

/**
 * 建立必填民國日期驗證。
 *
 * @param {string} message - 驗證錯誤訊息
 * @returns {import("yup").StringSchema} Yup 驗證規則
 */
const requiredRocDate = (message) => string().required(message).validateROCDate(message);

const querySchema = object({
  idNo: string().test({
    name: "queryIdNo",
    message: "查詢值不得為空白",
    test(value) {
      return this.parent.queryNo === "0" || Boolean(value?.trim());
    },
  }),
  insrDate: string().validateROCDate("通報日期格式不正確"),
});
const editSchema = object({
  iId: string().required("被保人 ID 不得為空值").max(10, "被保人 ID 不得超過 10 碼"),
  iBirthday: requiredRocDate("被保人生日不得為空值，且須為正確的民國日期"),
  mainPolicyNo: string()
    .required("主約保單號碼不得為空值")
    .max(20, "主約保單號碼不得超過 20 碼"),
  policyNo: string()
    .required("保單號碼不得為空值")
    .test({
      name: "policyNoPrefix",
      message: "保單號碼開頭不同於主約保單號碼",
      test(value) {
        return Boolean(value?.startsWith(this.parent.mainPolicyNo ?? ""));
      },
    }),
  ...Object.fromEntries(PAYMENT_FIELDS.map(({ name, label }) => [
    name,
    requiredNumber(`${label}不得為空值，且須為非負數`),
  ])),
  issueDate: requiredRocDate("契約生效日不得為空值，且須為正確的民國日期"),
  lpsDate: requiredRocDate("契約滿期日不得為空值，且須為正確的民國日期"),
  lstChgDate: requiredRocDate("保單狀況生效日不得為空值，且須為正確的民國日期"),
  prem: requiredNumber("保費不得為空值，且須為非負數"),
  aId: string().required("要保人身分證號碼不得為空值").max(10, "要保人身分證號碼不得超過 10 碼"),
  aBirthday: requiredRocDate("要保人生日不得為空值，且須為正確的民國日期"),
  liaStatus: string().required("通報狀態須選擇"),
  signDate: string().validateROCDate("要保書填寫日須為正確的民國日期"),
});
const uploadSchema = object({
  uploadFile: mixed()
    .required("請選擇檔案")
    .test("xlsxFile", "檔案格式必須為 xlsx", (file) => (
      file instanceof File && /\.xlsx$/i.test(file.name)
    )),
});
const activeSchema = shallowRef(querySchema);
const {
  errors,
  resetForm,
  setErrors,
  setFieldValue,
  setValues,
  validate,
  values,
} = useForm({
  validationSchema: activeSchema,
  initialValues,
  validateOnMount: false,
});
const fieldModels = Object.fromEntries(
  FORM_FIELD_NAMES.map((name) => [name, useField(name).value]),
);

const showQuery = ref(false);
const isRType = ref(false);
const isEditVisible = ref(false);
const showGroupReportConfirm = ref(false);
const groupReportConfirmMessage = ref("");
const selectedRows = ref([]);
const resultRows = ref([]);
const uploaderRef = ref(null);
const saleChnlOptions = ref([]);
const policyDutyOptions = ref([]);
const prodKindOptions = ref([]);
const payFreqOptions = ref([]);
const relationOptions = ref([]);
const brokTypeOptions = ref([]);
const liaStatusOptions = ref([]);
const displayValues = reactive({
  insrTypeDesc: "",
  outputTime: "",
  serNo: "",
  updateSrc: "",
  memo: "",
});

/**
 * 將數值格式化為千分位字串。
 *
 * @param {string|number|null|undefined} value - 待格式化數值
 * @returns {string} 格式化結果
 */
const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue.toLocaleString("zh-TW") : String(value);
};

const resultColumns = computed(() => {
  const columns = [
    { name: "index", label: "序號", field: "_sequence", align: "center" },
    { name: "result", label: "結果", field: "LIA_STATUS_DESC", align: "center" },
    { name: "faceAmount", label: "保額", field: "FACE_AMT", align: "right", format: formatNumber },
    { name: "insrType", label: "通報方式", field: "INSR_TYPE_DESC", align: "center" },
    { name: "insuredId", label: "被保人 ID", field: "I_ID", align: "center" },
    { name: "insuredBirthday", label: "被保人生日", field: "I_BIRTHDAY_ROC", align: "center" },
    { name: "insuredGender", label: "被保人性別", field: "I_GENDER_DESC", align: "center" },
    { name: "productCode", label: "商品代碼", field: "PROD_CODE", align: "center" },
    { name: "policyDuty", label: "險種分類", field: "POLICY_DUTY", align: "center" },
    { name: "productKind", label: "險種", field: "PROD_KIND", align: "center" },
    { name: "status", label: "保單狀況", field: "STATUS", align: "center" },
    { name: "issueDate", label: "契約生效日", field: "ISSUE_DATE_ROC", align: "center" },
    { name: "lapseDate", label: "契約滿期日", field: "LPS_DATE_ROC", align: "center" },
    { name: "changeDate", label: "保單狀況生效日期", field: "LST_CHG_DATE_ROC", align: "center" },
  ];
  if (isRType.value) {
    columns.push({
      name: "signDate",
      label: "要保書填寫日期",
      field: "SIGN_DATE",
      align: "center",
    });
  }
  columns.push(
    { name: "outputTime", label: "通報時間", field: "OUTPUT_TIME", align: "center" },
    { name: "memo", label: "錯誤原因", field: "MEMO", align: "left" },
  );
  return columns;
});

/**
 * 將後端代碼表轉成下拉選項。
 *
 * @param {object[]} options - 後端代碼表
 * @returns {{label: string, value: string}[]} 下拉選項
 */
const normalizeOptions = (options) => {
  if (!options) return [];

  const entries = Array.isArray(options)
    ? options.map((option) => [option.key, option.value])
    : Object.entries(options);

  return entries.map(([key, value]) => ({
    label: `${key} ${value}`,
    value: key,
  }));
};

/**
 * 取得動態欄位的選項清單。
 *
 * @param {object} field - 欄位定義
 * @returns {object[]} 下拉選項
 */
const resolveFieldOptions = (field) => (
  typeof field.options === "function" ? field.options() : field.options ?? []
);

/**
 * 建立查詢結果列的唯一鍵。
 *
 * @param {object} row - 查詢結果
 * @returns {string} 唯一鍵
 */
const buildRowKey = (row) => [
  row.I_ID,
  row.I_BIRTHDAY,
  row.POLICY_NO,
  row.POLICY_CAT,
  row.POLICY_DUTY,
  row.PROD_KIND,
  row.STATUS,
  row.LST_CHG_DATE,
  row.UPDATE_TIME,
].join("|");

/**
 * 使用指定 schema 驗證目前表單。
 *
 * @param {import("yup").ObjectSchema} schema - 驗證 schema
 * @returns {Promise<boolean>} 是否通過驗證
 */
const validateWithSchema = async (schema) => {
  setErrors({});
  activeSchema.value = schema;
  const { valid } = await validate();
  return valid;
};

/**
 * 套用後端回傳資料至畫面狀態。
 *
 * @param {object} data - AFY10300 回應資料
 * @returns {void}
 */
const applyServerData = (data) => {
  if (!data || typeof data !== "object") {
    throw new TypeError("AFY10300 response data must be an object");
  }

  resetForm({ values: initialValues });
  setValues({
    queryNo: String(data.queryNo ?? "0"),
    idNo: data.idNo ?? "",
    insrDate: data.insrDate ?? "",
    errorCode: String(data.errorCode ?? "99"),
    insrType: data.insrType ?? "L",
    prodType: data.prodType ?? "AT",
    procStatus: String(data.procStatus ?? "1"),
    regQueryNo: data.regQueryNo ?? "",
    regIdNo: data.regIdNo ?? "",
    regInsrDate: data.regInsrDate ?? "",
    regInsrType: data.regInsrType ?? "",
    regErrorCode: data.regErrorCode ?? "",
    regProdType: data.regProdType ?? "",
    regProcStatus: data.regProcStatus ?? "",
    regRadioNum: data.regRadioNum ?? "",
    showEdit: data.showEdit ?? "",
    iBirthday: data.I_BIRTHDAY ?? "",
    lpsDate: data.LPS_DATE ?? "",
    aBirthday: data.A_BIRTHDAY ?? "",
    signDate: data.SIGN_DATE ?? "",
  });

  showQuery.value = Boolean(data.showQuery);
  isRType.value = Boolean(data.rtype);
  saleChnlOptions.value = normalizeOptions(data.SALE_CHNL_OPTION);
  policyDutyOptions.value = normalizeOptions(data.POLICY_DUTY_OPTION);
  prodKindOptions.value = normalizeOptions(data.PROD_KIND_OPTION);
  payFreqOptions.value = normalizeOptions(data.PAY_FREQ_OPTION);
  relationOptions.value = normalizeOptions(data.RELATION_OPTION);
  brokTypeOptions.value = normalizeOptions(data.BROKTYPE_OPTION);
  liaStatusOptions.value = normalizeOptions(data.LIA_STATUS_OPTION);
  resultRows.value = (data.resultList ?? []).map((row, rowNumber) => ({
    ...row,
    _radioNum: String(rowNumber),
    _rowKey: buildRowKey(row),
    _sequence: rowNumber + 1,
  }));
  selectedRows.value = [];
  isEditVisible.value = false;
  uploaderRef.value?.clear();

  if (data.showEdit === "Y") {
    const selectedRow = resultRows.value.find(
      (row) => row._radioNum === String(data.regRadioNum),
    );
    if (selectedRow) {
      selectedRows.value = [selectedRow];
      selectRow(selectedRow);
    }
  }
};

/**
 * 將選取列帶入編輯區。
 *
 * @param {object} row - 選取的結果列
 * @returns {void}
 */
const selectRow = (row) => {
  setValues({
    regRadioNum: row._radioNum,
    iId: row.I_ID ?? "",
    iName: row.I_NAME ?? "",
    iBirthday: row.I_BIRTHDAY_ROC ?? "",
    iGender: row.I_GENDER ?? "",
    mainPolicyNo: row.MAIN_POLICY_NO ?? "",
    policyNo: row.POLICY_NO ?? "",
    oiuInd: row.OIU_IND ?? "",
    saleChnl: row.SALE_CHNL ?? "",
    prodCode: row.PROD_CODE ?? "",
    policyCat: row.POLICY_CAT ?? "",
    policyDuty: row.POLICY_DUTY ?? "",
    prodKind: row.PROD_KIND ?? "",
    payType: row.PAY_TYPE ?? "",
    ...Object.fromEntries(PAYMENT_FIELDS.map(({ name }, index) => [
      name,
      row[`PAY_AMT${index + 1}`] ?? "",
    ])),
    issueDate: row.ISSUE_DATE_ROC ?? "",
    issueTime: row.ISSUE_TIME ?? "",
    lpsDate: row.LPS_DATE_ROC ?? "",
    lpsTime: row.LPS_TIME ?? "",
    prem: row.PREM ?? "",
    payFreq: row.PAY_FREQ ?? "",
    payPeriod: row.PAY_PERIOD ?? "",
    status: row.STATUS ?? "",
    lstChgDate: row.LST_CHG_DATE_ROC ?? "",
    lstChgTime: row.LST_CHG_TIME ?? "",
    aName: row.A_NAME ?? "",
    aId: row.A_ID ?? "",
    aBirthday: row.A_BIRTHDAY_ROC ?? "",
    relation: row.RELATION ?? "",
    liaStatus: row.LIA_STATUS ?? "",
    updateTime: row.UPDATE_TIME ?? "",
    signDate: row.SIGN_DATE_ROC ?? "",
    brokType: row.BROKTYPE ?? "",
    oldIId: row.I_ID ?? "",
    oldIBirthday: row.I_BIRTHDAY ?? "",
    oldPolicyNo: row.POLICY_NO ?? "",
    oldPolicyCat: row.POLICY_CAT ?? "",
    oldPolicyDuty: row.POLICY_DUTY ?? "",
    oldProdKind: row.PROD_KIND ?? "",
    oldStatus: row.STATUS ?? "",
    oldLstChgDate: row.LST_CHG_DATE ?? "",
    oldUpdateTime: row.UPDATE_TIME ?? "",
    showEdit: "Y",
  });
  Object.assign(displayValues, {
    insrTypeDesc: row.INSR_TYPE_DESC ?? "",
    outputTime: row.OUTPUT_TIME ?? "",
    serNo: row.SER_NO ?? "",
    updateSrc: row.UPDATE_SRC ?? "",
    memo: row.MEMO ?? "",
  });
  isEditVisible.value = true;
};

/**
 * 處理 CxlTable 單選結果。
 *
 * @param {object[]} rows - 已選取資料列
 * @returns {void}
 */
const handleResultSelection = (rows) => {
  if (rows[0]) selectRow(rows[0]);
};

/**
 * 建立查詢與編輯共用的 API 請求資料。
 *
 * @returns {object} AFY10300 請求 DTO
 */
const buildMainPayload = () => ({
  queryNo: values.queryNo,
  idNo: values.idNo,
  insrDate: values.insrDate,
  errorCode: values.errorCode,
  insrType: values.insrType,
  prodType: values.prodType,
  procStatus: values.procStatus,
  regQueryNo: values.regQueryNo,
  regIdNo: values.regIdNo,
  regInsrDate: values.regInsrDate,
  regInsrType: values.regInsrType,
  regErrorCode: values.regErrorCode,
  regProdType: values.regProdType,
  regProcStatus: values.regProcStatus,
  regRadioNum: values.regRadioNum,
  item: values.regRadioNum,
  showEdit: values.showEdit,
  I_NAME: values.iName,
  I_ID: values.iId,
  I_BIRTHDAY: values.iBirthday,
  I_GENDER: values.iGender,
  MAIN_POLICY_NO: values.mainPolicyNo,
  POLICY_NO: values.policyNo,
  OIU_IND: values.oiuInd,
  SALE_CHNL: values.saleChnl,
  PROD_CODE: values.prodCode,
  POLICY_CAT: values.policyCat,
  POLICY_DUTY: values.policyDuty,
  PROD_KIND: values.prodKind,
  PAY_TYPE: values.payType,
  ...Object.fromEntries(PAYMENT_FIELDS.map(({ name }, index) => [
    `PAY_AMT${index + 1}`,
    values[name],
  ])),
  ISSUE_DATE: values.issueDate,
  ISSUE_TIME: values.issueTime,
  LPS_DATE: values.lpsDate,
  LPS_TIME: values.lpsTime,
  PREM: values.prem,
  PAY_FREQ: values.payFreq,
  PAY_PERIOD: values.payPeriod,
  STATUS: values.status,
  LST_CHG_DATE: values.lstChgDate,
  LST_CHG_TIME: values.lstChgTime,
  A_NAME: values.aName,
  A_ID: values.aId,
  A_BIRTHDAY: values.aBirthday,
  RELATION: values.relation,
  SIGN_DATE: values.signDate,
  BROKTYPE: values.brokType,
  LIA_STATUS: values.liaStatus,
  UPDATE_TIME: values.updateTime,
  OLD_I_ID: values.oldIId,
  OLD_I_BIRTHDAY: values.oldIBirthday,
  OLD_POLICY_NO: values.oldPolicyNo,
  OLD_POLICY_CAT: values.oldPolicyCat,
  OLD_POLICY_DUTY: values.oldPolicyDuty,
  OLD_PROD_KIND: values.oldProdKind,
  OLD_STATUS: values.oldStatus,
  OLD_LST_CHG_DATE: values.oldLstChgDate,
  OLD_UPDATE_TIME: values.oldUpdateTime,
});

/**
 * 查詢補通報資料。
 *
 * @returns {Promise<void>}
 */
const query = async () => {
  if (!await validateWithSchema(querySchema)) return;
  const response = await $cathayAxios.post(afy10300Service.query, buildMainPayload());
  if (response.returnCode !== 0) return;
  applyServerData(response.data);
};

/**
 * 儲存目前編輯資料。
 *
 * @returns {Promise<void>}
 */
const edit = async () => {
  if (!await validateWithSchema(editSchema)) return;
  const response = await $cathayAxios.post(afy10300Service.edit, buildMainPayload());
  if (response.returnCode !== 0) return;
  applyServerData(response.data);
};

/**
 * 關閉編輯區並清除選取。
 *
 * @returns {void}
 */
const cancelEdit = () => {
  setValues({ showEdit: "N" });
  selectedRows.value = [];
  isEditVisible.value = false;
  setErrors({});
};

/**
 * 匯出目前查詢條件的 Excel。
 *
 * @returns {Promise<void>}
 */
const exportFile = async () => {
  await $cathayAxios.download(
    afy10300Service.export,
    {
      regQueryNo: values.regQueryNo,
      regIdNo: values.regIdNo,
      regInsrDate: values.regInsrDate,
      regInsrType: values.regInsrType,
      regErrorCode: values.regErrorCode,
      regProdType: values.regProdType,
      regProcStatus: values.regProcStatus,
    },
    "公會補通報資料.xlsx",
  );
};

/**
 * 同步 CxlUploader 選取檔案至 VeeValidate。
 *
 * @param {FormData} formData - 上傳元件建立的資料
 * @returns {void}
 */
const handleUploadFilesChange = (formData) => {
  const file = formData.get("uploadFile");
  setFieldValue("uploadFile", file instanceof File ? file : null);
};

/**
 * 上傳補通報 Excel。
 *
 * @returns {Promise<void>}
 */
const importFile = async () => {
  if (!await validateWithSchema(uploadSchema)) return;
  const payload = new FormData();
  payload.append("uploadFile", values.uploadFile);
  const response = await $cathayAxios.post(afy10300Service.import, payload);
  if (response.returnCode !== 0) return;
  applyServerData(response.data);
};

/**
 * 檢核通報類型並開啟即時通報確認視窗。
 *
 * @returns {void}
 */
const executeGroupReport = () => {
  if (values.insrType === "R") {
    $notify.warning("僅可選擇承保通報；收件類每 30 分鐘執行一次");
    return;
  }
  const insrTypeText = INSR_TYPE_OPTIONS.find(
    (option) => option.value === values.insrType,
  )?.label ?? "";
  const prodTypeText = PROD_TYPE_OPTIONS.find(
    (option) => option.value === values.prodType,
  )?.label ?? "";
  groupReportConfirmMessage.value = `確認執行「${prodTypeText}${insrTypeText}」即時大批通報？`;
  showGroupReportConfirm.value = true;
};

/**
 * 執行即時大批通報。
 *
 * @returns {Promise<void>}
 */
const confirmGroupReport = async () => {
  showGroupReportConfirm.value = false;
  const response = await $cathayAxios.post(
    afy10300Service.execute,
    buildMainPayload(),
  );
  if (response.returnCode !== 0) return;
  applyServerData(response.data);
};

/**
 * 開啟補通報操作手冊。
 *
 * @returns {void}
 */
const openOperationManual = () => {
  if (!router.hasRoute("AAZ00404")) {
    $notify.warning("操作手冊頁面尚未建置");
    return;
  }
  router.push({
    name: "AAZ00404",
    state: {
      SYS_NO: "AT",
      SUB_SYS_NO: "A0",
      FUNC_ID: "ATA00611",
      isShowQueryItem: "R",
    },
  });
};

/**
 * 處理頁面功能鍵。
 *
 * @param {KeyboardEvent} event - 鍵盤事件
 * @returns {void}
 */
const handleHotKey = (event) => {
  const actions = {
    F2: query,
    F8: importFile,
    F9: isEditVisible.value ? edit : undefined,
    F10: isEditVisible.value ? cancelEdit : undefined,
  };
  const action = actions[event.key];
  if (!action) return;
  event.preventDefault();
  action();
};

/**
 * 載入頁面初始資料。
 *
 * @returns {Promise<void>}
 */
const loadPage = async () => {
  const response = await $cathayAxios.post(afy10300Service.prompt, {});
  if (response.returnCode !== 0) return;
  applyServerData(response.data);
};

onMounted(() => {
  window.addEventListener("keydown", handleHotKey);
  loadPage();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleHotKey);
});
</script>
