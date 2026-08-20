<template>
  <CxlBreadcrumbs
    :breadcrumbs="navCollection"
    :router-path="$route.path"
    :root-path="rootPath"
  />
  <div class="cxl-title-h1 q-mt-md q-mb-md">公會通報查詢</div>

  <form @submit.prevent="handleQuery">
    <q-markup-table
      class="cxl-table cxl-table-horizontal q-mb-lg"
      separator="cell"
      flat
      bordered
    >
      <thead>
        <tr>
          <th colspan="6" class="cxl-table-header">查詢條件</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th><span class="cxl-text-danger">*</span> 身份證字號/統一編號</th>
          <td>
            <div class="row items-center q-gutter-md">
              <div class="col">
                <CxlInput
                  v-model="inputId"
                  placeholder="請輸入身份證字號或統一編號"
                  :error="!!errors.inputId"
                  :error-message="errors.inputId"
                />
              </div>
              <q-checkbox
                v-if="isReturnVisible"
                v-model="queryForm.isReturn"
                class="cxl-checkbox"
                label="同步更新公會回檔狀態"
                dense
              />
            </div>
          </td>
          <th>契約角色</th>
          <td>
            <CxlDropdown
              v-model="queryForm.role"
              :options="roleOptions"
              map-options
              emit-value
            />
          </td>
          <th>保單效力</th>
          <td>
            <CxlDropdown
              v-model="queryForm.status"
              :options="policyValidityOptions"
              map-options
              emit-value
            />
          </td>
        </tr>
        <tr>
          <th>姓名</th>
          <td>{{ queryInfo.name }}</td>
          <th>生日</th>
          <td>{{ queryInfo.birthday }}</td>
          <th>公會資料取回日期</th>
          <td>{{ queryInfo.lastUpdateTime }}</td>
        </tr>
        <tr>
          <td colspan="6">
            <div class="row justify-center q-gutter-sm">
              <CxlButton label="查詢" type="submit" :loading="isQuerying" />
            </div>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </form>

  <q-markup-table
    class="cxl-table cxl-table-horizontal q-mb-lg"
    separator="cell"
    flat
    bordered
  >
    <thead>
      <tr>
        <th colspan="5" class="cxl-table-header">保障項目彙整</th>
      </tr>
      <tr>
        <th>項目</th>
        <th>合計</th>
        <th>同業合計</th>
        <th>收件</th>
        <th>承保</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in coverageSummaryRows" :key="item.key">
        <th>{{ item.label }}</th>
        <td class="text-right">{{ formatAmount(item.total) }}</td>
        <td class="text-right">{{ formatAmount(item.sameIndustryTotal) }}</td>
        <td class="text-right">{{ formatAmount(item.received) }}</td>
        <td class="text-right">{{ formatAmount(item.underwritten) }}</td>
      </tr>
    </tbody>
  </q-markup-table>

  <q-markup-table
    class="cxl-table cxl-table-horizontal q-mb-lg"
    separator="cell"
    flat
    bordered
  >
    <thead>
      <tr>
        <th colspan="5" class="cxl-table-header">保費資料彙整</th>
      </tr>
      <tr>
        <th>項目</th>
        <th>合計</th>
        <th>收件</th>
        <th>承保</th>
        <th>操作者</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in premiumSummaryRows" :key="item.key">
        <th>{{ item.label }}</th>
        <td class="text-right">{{ formatAmount(item.total) }}</td>
        <td class="text-right">{{ formatAmount(item.received) }}</td>
        <td class="text-right">{{ formatAmount(item.underwritten) }}</td>
        <td>{{ item.operator }}</td>
      </tr>
    </tbody>
  </q-markup-table>

  <div class="cxl-title-h2 q-mb-sm">新制通報資料明細</div>
  <CxlTable
    v-model:selected="selectedRows"
    class="q-mb-md"
    :rows="resultRows"
    :columns="resultColumns"
    row-key="_rowKey"
    selection="single"
    separator="cell"
  >
    <template #body-cell-reportMethod="props">
      <q-td :props="props">
        <CxlButton
          :label="formatReportMethod(props.row)"
          theme="primary-outline"
          @click="handleOpenDetail(props.row)"
        />
      </q-td>
    </template>
  </CxlTable>

  <div v-if="canRetrieveLatest" class="row justify-center q-mb-lg">
    <CxlButton
      label="即時取回公會資料"
      :loading="isRetrieving"
      @click="handleRetrieveLatestCheck"
    />
  </div>

  <q-markup-table
    v-if="selectedRows.length"
    class="cxl-table-form q-mb-lg"
    flat
    bordered
    separator="horizontal"
  >
    <colgroup>
      <col style="width: 11%" />
      <col style="width: 22%" />
      <col style="width: 11%" />
      <col style="width: 22%" />
      <col style="width: 11%" />
      <col style="width: 23%" />
    </colgroup>
    <thead>
      <tr>
        <th colspan="6" class="cxl-form-title">資料編輯區</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in readOnlyFieldRows" :key="`readonly-${rowIndex}`">
        <template v-for="(field, fieldIndex) in row" :key="field?.key || `empty-${fieldIndex}`">
          <th>{{ field?.label || "" }}</th>
          <td>{{ field ? editDto[field.key] : "" }}</td>
        </template>
      </tr>
      <tr v-for="(row, rowIndex) in editableFieldRows" :key="`editable-${rowIndex}`">
        <template v-for="(field, fieldIndex) in row" :key="field?.key || `empty-${fieldIndex}`">
          <th>{{ field?.label || "" }}</th>
          <td>
            <CxlInput
              v-if="field?.type === 'input'"
              v-model="editDto[field.key]"
              :placeholder="field.placeholder"
              :inputmode="field.inputmode"
              :error="!!editErrors[field.key]"
              :error-message="editErrors[field.key]"
            />
            <CxlDropdown
              v-else-if="field?.type === 'dropdown'"
              v-model="editDto[field.key]"
              :options="field.options"
              :error="!!editErrors[field.key]"
              :error-message="editErrors[field.key]"
              map-options
              emit-value
            />
          </td>
        </template>
      </tr>
      <tr>
        <td colspan="6">
          <div class="row justify-center q-gutter-sm">
            <CxlButton label="修改" :loading="isUpdating" @click="handleUpdate" />
            <CxlButton label="刪除" theme="danger" @click="handleDeleteRequest" />
            <CxlButton label="取消" theme="primary-outline" @click="clearSelection" />
          </div>
        </td>
      </tr>
    </tbody>
  </q-markup-table>

  <CxlAccordion class="q-mb-lg">
    <template #header>
      <span class="cxl-accordion-title">欄位代碼說明</span>
      <span class="cxl-accordion-subtitle">公會通報資料代碼與彙整規則</span>
    </template>
    <template #content>
      <ol class="q-pl-lg q-mb-none">
        <li v-for="note in fieldNotes" :key="note">{{ note }}</li>
      </ol>
    </template>
  </CxlAccordion>

  <CxlModal
    v-model="confirmDialog.open"
    :title="confirmDialog.title"
    :confirm-text="confirmDialog.confirmText"
    cancel-text="取消"
    disable-close-button
    persistent
    @confirm="handleConfirm"
    @cancel="handleCancelConfirm"
  >
    <p class="cxl-font-18">{{ confirmDialog.message }}</p>
  </CxlModal>

  <CxlModal
    v-model="detailDialog.open"
    title="通報資料明細"
    size="lg"
    content-scroll
  >
    <q-markup-table class="cxl-table-form" flat bordered separator="horizontal">
      <colgroup>
        <col style="width: 16%" />
        <col style="width: 34%" />
        <col style="width: 16%" />
        <col style="width: 34%" />
      </colgroup>
      <tbody>
        <tr v-for="(row, rowIndex) in detailFieldRows" :key="`detail-${rowIndex}`">
          <template v-for="(field, fieldIndex) in row" :key="field?.key || `empty-${fieldIndex}`">
            <th>{{ field?.label || "" }}</th>
            <td>{{ field ? detailDialog.data[field.key] : "" }}</td>
          </template>
        </tr>
      </tbody>
    </q-markup-table>
  </CxlModal>
</template>

<script setup>
import { computed, inject, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useField, useForm } from "vee-validate";
import { object, string, ValidationError } from "yup";
import {
  CxlAccordion,
  CxlBreadcrumbs,
  CxlButton,
  CxlDropdown,
  CxlInput,
  CxlModal,
  CxlTable,
} from "vue-cathaylife-component";
import navCollection from "@/service/NavCollection.js";
import afy10100Service from "@/service/AFY10100Service.js";
import { numberAddComma } from "@/utils/format.js";

const $route = useRoute();
const $cathayAxios = inject("$cathayAxios");
const rootPath = { label: "首頁", url: "/" };

const roleOptions = [
  { label: "被保人", value: "I" },
  { label: "要保人", value: "A" },
];
const policyValidityOptions = [
  { label: "有效", value: "Y" },
  { label: "無效", value: "N" },
  { label: "全部", value: "A" },
];
const genderOptions = [
  { label: "男", value: "1" },
  { label: "女", value: "2" },
];
const paymentTypeOptions = [
  { label: "無", value: "0" },
  { label: "公費", value: "1" },
  { label: "自費", value: "2" },
];

const coverageFields = [
  { key: "payAmt1", apiKey: "PAY_AMT1", label: "身故" },
  { key: "payAmt2", apiKey: "PAY_AMT2", label: "完全失能或最高級失能" },
  { key: "payAmt3", apiKey: "PAY_AMT3", label: "失能扶助金" },
  { key: "payAmt4", apiKey: "PAY_AMT4", label: "特定事故" },
  { key: "payAmt5", apiKey: "PAY_AMT5", label: "初次罹患" },
  { key: "payAmt6", apiKey: "PAY_AMT6", label: "醫療限額" },
  { key: "payAmt7", apiKey: "PAY_AMT7", label: "醫療限額自負" },
  { key: "payAmt8", apiKey: "PAY_AMT8", label: "醫療日額" },
  { key: "payAmt9", apiKey: "PAY_AMT9", label: "住院手術" },
  { key: "payAmt10", apiKey: "PAY_AMT10", label: "門診手術" },
  { key: "payAmt11", apiKey: "PAY_AMT11", label: "門診" },
  { key: "payAmt12", apiKey: "PAY_AMT12", label: "重大疾/傷病" },
  { key: "payAmt13", apiKey: "PAY_AMT13", label: "重大燒燙傷" },
  { key: "payAmt14", apiKey: "PAY_AMT14", label: "癌症療養" },
  { key: "payAmt15", apiKey: "PAY_AMT15", label: "出院療養" },
  { key: "payAmt16", apiKey: "PAY_AMT16", label: "喪失工作能力" },
  { key: "payAmt17", apiKey: "PAY_AMT17", label: "喪葬費用" },
  { key: "payAmt18", apiKey: "PAY_AMT18", label: "銜接原醫療限額之自負額" },
  { key: "payAmt19", apiKey: "PAY_AMT19", label: "分期給付" },
];

const readOnlyFields = [
  { key: "reportMethod", label: "通報方式" },
  { key: "companyCode", label: "公司別" },
  { key: "insuredId", label: "被保人ID" },
  { key: "insuredBirthday", label: "被保人生日" },
  { key: "policyNo", label: "保單號碼" },
  { key: "policyCategory", label: "保單分類" },
  { key: "policyDuty", label: "險種分類" },
  { key: "productKind", label: "險種" },
  { key: "policyStatus", label: "保單狀況" },
  { key: "policyStatusDate", label: "保單狀況生效日期" },
  { key: "mainPolicyNo", label: "主約保單號碼" },
  { key: "issueDate", label: "契約生效日" },
  { key: "issueTime", label: "契約生效時分" },
  { key: "lapseDate", label: "契約滿期日" },
  { key: "lapseTime", label: "契約滿期時分" },
  { key: "signDate", label: "要保書填寫日" },
  { key: "premium", label: "保費" },
  { key: "paymentFrequency", label: "保費繳別" },
  { key: "paymentPeriod", label: "保費繳費年期" },
  { key: "policyStatusTime", label: "保單狀況生效時分" },
  { key: "inputTime", label: "資料寫入時間" },
  { key: "serialNo", label: "公會取回序號" },
  { key: "sourceDescription", label: "來源別" },
  { key: "salesChannelDescription", label: "銷售通路" },
  { key: "productCode", label: "商品代碼" },
];

const editableFields = [
  ...coverageFields.map((field) => ({
    ...field,
    type: "input",
    inputmode: "numeric",
    placeholder: "請輸入金額",
  })),
  { key: "brokerType", label: "保經代分類", type: "input", placeholder: "請輸入" },
  { key: "applicantName", label: "要保人姓名", type: "input", placeholder: "請輸入" },
  { key: "applicantId", label: "要保人身分證號碼", type: "input", placeholder: "請輸入" },
  { key: "applicantBirthday", label: "要保人出生日期", type: "input", placeholder: "請輸入" },
  { key: "relation", label: "要保人與被保險人關係", type: "input", placeholder: "請輸入" },
  {
    key: "insuredGender",
    label: "被保險人性別",
    type: "dropdown",
    options: genderOptions,
  },
  {
    key: "paymentType",
    label: "公、自費件",
    type: "dropdown",
    options: paymentTypeOptions,
  },
];

const detailFields = [
  ...readOnlyFields,
  ...editableFields.map(({ key, label }) => ({ key, label })),
];

const premiumFields = [
  { key: "yearPremium", apiPrefix: "YEAR_PREM", label: "年繳保費" },
  { key: "singlePremium", apiPrefix: "ONCE_PREM", label: "躉繳保費" },
  { key: "flexiblePremium", apiPrefix: "FLEX_PREM", label: "超額(彈性)保險費" },
];

const fieldNotes = [
  "銷售通路：1 網路投保；2 業務員；3 保經、保代；4 電話行銷；5 機場櫃檯。",
  "保單分類：1 個人；2 團體。",
  "險種分類：1 人壽保險；2 傷害保險；3 健康保險；4 年金保險。",
  "險種：01 一般；02 特定；03 投資型；04 日額型；05 實支實付型；06 日額或實支實付擇一型；07 手術型；08 重大疾病；09 帳戶型；10 長期看護型；11 喪失工作能力；12 防癌；13 旅平險；14 微型；15 微型實支實付；16 小額終老保險；17 失能扶助保險；18 登山綜合保險；19 定期人壽保險（不含一年期）；20 海域活動綜合保險；21 一年期。",
  "繳別：1 躉繳；2 年繳；3 半年繳；4 季繳；5 月繳；6 彈性繳；9 繳費期滿。",
  "保單狀況（收件）：01 有效；06 未承保取消件；07 契約註銷；11 滿期（契約到期）；12 鍵值欄位通報錯誤終止；15 通報更正；50 一○七條／一○七條之一承保資料；51 一○七條理賠資料（未滿 14 足歲之未成年人）；52 一○七條／一○七條之一理賠資料（精神障礙或其他心智缺陷／受監護宣告尚未撤銷）。",
  "保單狀況（承保）：01 有效；02 增額；03 減額；04 展期；05 繳清；06 契約撤銷；07 停效；10 解除契約；11 滿期（契約到期）；12 鍵值欄位通報錯誤終止；20 終止 1（由要保人提出終止契約效力）；21 終止 2（主被保險人死亡，其他被保險人附同時終止，或完全失能、理賠給付後終止附約）；30 被保險人因自然死身故；31 被保險人因意外身故；32 被保險人因其他原因身故；50、51、52 同收件定義。",
  "保障及保費彙整金額依頁面筆數加總，包含本公司及產、壽險通報資料。",
  "即時取回公會資料：輸入身份證字號或統一證號後，按「即時取回公會資料」。",
];

const validationSchema = object({
  inputId: string().trim().required("身份證字號/統一編號：不得為空值"),
});
const { errors, validate } = useForm({
  validationSchema,
  initialValues: {
    inputId: "",
  },
  validateOnMount: false,
});
const { value: inputId } = useField("inputId");

const editValidationSchema = object({
  ...Object.fromEntries(
    coverageFields.map((field) => [
      field.key,
      string().validateNumber(`${field.label}須為有效數字格式`),
    ]),
  ),
  applicantId: string().matches(
    /^[A-Za-z0-9]*$/,
    "要保人身分證號碼僅能輸入英文字母與數字",
  ),
  applicantBirthday: string().dateformatvalid(
    "要保人出生日期須為有效的 YYYYMMDD 格式",
  ),
  insuredGender: string().oneOf(["", "1", "2"], "請選擇有效的被保險人性別"),
  paymentType: string().oneOf(["", "0", "1", "2"], "請選擇有效的公、自費類型"),
});

const queryForm = reactive({
  role: "I",
  status: "Y",
  isReturn: false,
});
const queryInfo = reactive({
  name: "",
  birthday: "",
  lastUpdateTime: "",
});
const summaryData = ref({});
const resultRows = ref([]);
const selectedRows = ref([]);
const isReturnVisible = ref(false);
const canRetrieveLatest = ref(false);
const isQuerying = ref(false);
const isRetrieving = ref(false);
const isUpdating = ref(false);

const createEmptyEditDto = () => ({
  tableName: "",
  reportMethod: "",
  companyCode: "",
  insuredId: "",
  insuredBirthday: "",
  policyNo: "",
  policyCategory: "",
  policyDuty: "",
  productKind: "",
  policyStatus: "",
  policyStatusDate: "",
  mainPolicyNo: "",
  issueDate: "",
  issueTime: "",
  lapseDate: "",
  lapseTime: "",
  signDate: "",
  premium: "",
  paymentFrequency: "",
  paymentPeriod: "",
  policyStatusTime: "",
  brokerType: "",
  applicantName: "",
  applicantId: "",
  applicantBirthday: "",
  relation: "",
  inputTime: "",
  updateTime: "",
  serialNo: "",
  insuredGender: "",
  paymentType: "",
  sourceCode: "",
  sourceDescription: "",
  salesChannel: "",
  salesChannelDescription: "",
  productCode: "",
  ...Object.fromEntries(coverageFields.map((field) => [field.key, ""])),
});

const editDto = reactive(createEmptyEditDto());
const editErrors = reactive({});
const confirmDialog = reactive({
  open: false,
  title: "",
  message: "",
  confirmText: "確認",
});
const pendingConfirmAction = ref(null);
const detailDialog = reactive({
  open: false,
  data: createEmptyEditDto(),
});
const lookupMaps = reactive({
  reportMethod: {},
  source: {},
  salesChannel: {},
});

/**
 * 將欄位依指定欄數分組，並補齊最後一列空格。
 *
 * @param {object[]} fields - 欄位定義
 * @param {number} size - 每列欄位數
 * @returns {(object|null)[][]} 分組後欄位
 */
const chunkFields = (fields, size) => {
  const rows = [];
  for (let index = 0; index < fields.length; index += size) {
    const row = fields.slice(index, index + size);
    while (row.length < size) {
      row.push(null);
    }
    rows.push(row);
  }
  return rows;
};

const readOnlyFieldRows = chunkFields(readOnlyFields, 3);
const editableFieldRows = chunkFields(editableFields, 3);
const detailFieldRows = chunkFields(detailFields, 2);

/**
 * 依候選欄位順序取得第一個存在的值。
 *
 * @param {object} source - 資料來源
 * @param {...string} keys - 候選欄位
 * @returns {*} 欄位值
 */
const readValue = (source, ...keys) => {
  for (const key of keys) {
    if (source?.[key] !== undefined && source[key] !== null) {
      return source[key];
    }
  }
  return "";
};

/**
 * 將既有 ErrMsg/jsonData 外層轉為標準 returnCode/data 格式。
 *
 * @param {object} response - API 回應
 * @returns {{returnCode: number, data: object|null}} 標準 API 回應
 */
const normalizeResponse = (response) => {
  if (response?.returnCode !== undefined) {
    return {
      returnCode: response.returnCode,
      data: response.data ?? null,
    };
  }
  if (response?.ErrMsg?.returnCode !== undefined) {
    return {
      returnCode: Number(response.ErrMsg.returnCode),
      data: response.jsonData ?? null,
    };
  }
  return {
    returnCode: -1,
    data: null,
  };
};

/**
 * 將後端權限旗標轉為布林值。
 *
 * @param {*} value - 權限旗標
 * @returns {boolean} 是否允許
 */
const parsePermissionFlag = (value) =>
  value === true ||
  value === 1 ||
  value === "1" ||
  value === "Y" ||
  value === "true";

/**
 * 取得選項的顯示文字。
 *
 * @param {object[]} options - 選項清單
 * @param {string} value - 選項值
 * @returns {string} 顯示文字
 */
const findOptionLabel = (options, value) =>
  options.find((option) => option.value === value)?.label || value;

/**
 * 格式化金額。
 *
 * @param {string|number} value - 金額
 * @returns {string} 千分位金額
 */
const formatAmount = (value) => numberAddComma(value);

const coverageSummaryRows = computed(() =>
  coverageFields.map((field) => ({
    key: field.key,
    label: field.label,
    total: readValue(summaryData.value, `${field.apiKey}_Tot`, `${field.key}Total`),
    sameIndustryTotal: readValue(
      summaryData.value,
      `${field.apiKey}_TotSame`,
      `${field.key}SameIndustryTotal`,
    ),
    received: readValue(summaryData.value, `${field.apiKey}_Rr`, `${field.key}Received`),
    underwritten: readValue(
      summaryData.value,
      `${field.apiKey}_LN`,
      `${field.key}Underwritten`,
    ),
  })),
);

const premiumSummaryRows = computed(() =>
  premiumFields.map((field) => ({
    key: field.key,
    label: field.label,
    total: readValue(summaryData.value, `${field.apiPrefix}_Tot`, `${field.key}Total`),
    received: readValue(summaryData.value, `${field.apiPrefix}_Rr`, `${field.key}Received`),
    underwritten: readValue(
      summaryData.value,
      `${field.apiPrefix}_LN`,
      `${field.key}Underwritten`,
    ),
    operator: readValue(summaryData.value, "UPDATE_ID", "updateId"),
  })),
);

const resultColumns = [
  { name: "index", label: "序號", field: "_index", align: "center" },
  {
    name: "reportMethod",
    label: "通報方式",
    field: "reportMethod",
    align: "left",
    sortable: true,
  },
  {
    name: "companyName",
    label: "公司別",
    field: "companyName",
    align: "left",
    sortable: true,
  },
  {
    name: "policyNo",
    label: "保單號碼",
    field: "policyNo",
    align: "center",
    sortable: true,
  },
  { name: "salesChannel", label: "銷售通路", field: "salesChannel", align: "left" },
  { name: "productCode", label: "商品代碼", field: "productCode", align: "left" },
  { name: "policyCategory", label: "保單分類", field: "policyCategory", align: "left" },
  { name: "policyDuty", label: "險種分類", field: "policyDuty", align: "left" },
  {
    name: "productKind",
    label: "險種",
    field: "productKind",
    align: "left",
    sortable: true,
  },
  { name: "policyStatus", label: "保單狀況", field: "policyStatus", align: "left" },
  {
    name: "deathBenefit",
    label: "身故保額",
    field: "payAmt1",
    align: "right",
    format: formatAmount,
  },
  {
    name: "medicalLimit",
    label: "醫療限額",
    field: "payAmt6",
    align: "right",
    format: formatAmount,
  },
  {
    name: "dailyMedical",
    label: "醫療日額",
    field: "payAmt8",
    align: "right",
    format: formatAmount,
  },
  {
    name: "issueDate",
    label: "契約生效日",
    field: "issueDate",
    align: "left",
    sortable: true,
  },
  { name: "lapseDate", label: "契約滿期日", field: "lapseDate", align: "left" },
  { name: "applicantName", label: "要保人姓名", field: "applicantName", align: "left" },
  { name: "updateTime", label: "通報時間", field: "updateTime", align: "left" },
];

/**
 * 將查詢結果資料轉為頁面欄位。
 *
 * @param {object} row - API 結果列
 * @param {number} index - 資料索引
 * @returns {object} 頁面結果列
 */
const mapResultRow = (row, index) => {
  const reportMethod = readValue(row, "INSR_TYPE", "reportMethod");
  return {
    ...row,
    _rowKey: `${readValue(row, "TBL_NAME", "tableName")}-${readValue(
      row,
      "SER_NO",
      "serialNo",
    )}-${index}`,
    _index: index + 1,
    reportMethod,
    reportMethodDescription:
      readValue(row, "INSR_TYPE_DESC", "reportMethodDescription") ||
      lookupMaps.reportMethod[reportMethod] ||
      "",
    companyName: readValue(row, "COMPANY_NAME", "companyName"),
    policyNo: readValue(row, "POLICY_NO", "policyNo"),
    salesChannel: readValue(row, "SALE_CHNL", "salesChannel"),
    productCode: readValue(row, "PROD_CODE", "productCode"),
    policyCategory: readValue(row, "POLICY_CAT", "policyCategory"),
    policyDuty: readValue(row, "POLICY_DUTY", "policyDuty"),
    productKind: readValue(row, "PROD_KIND", "productKind"),
    policyStatus: readValue(row, "STATUS", "policyStatus"),
    payAmt1: readValue(row, "PAY_AMT1", "payAmt1"),
    payAmt6: readValue(row, "PAY_AMT6", "payAmt6"),
    payAmt8: readValue(row, "PAY_AMT8", "payAmt8"),
    issueDate: readValue(row, "ISSUE_DATE", "issueDate"),
    lapseDate: readValue(row, "LPS_DATE", "lapseDate"),
    applicantName: readValue(row, "A_NAME", "applicantName"),
    updateTime: readValue(row, "UPDATE_TIME", "updateTime"),
  };
};

/**
 * 將結果列映射至編輯 DTO。
 *
 * @param {object} row - 選取的結果列
 * @returns {object} 編輯 DTO
 */
const mapEditDto = (row) => {
  const sourceCode = readValue(row, "OIU_IND", "sourceCode");
  const salesChannel = readValue(row, "SALE_CHNL", "salesChannel");
  return {
  tableName: readValue(row, "TBL_NAME", "tableName"),
  reportMethod: readValue(row, "INSR_TYPE", "reportMethod"),
  companyCode: readValue(row, "CMNY_CODE", "companyCode"),
  insuredId: readValue(row, "I_ID", "insuredId"),
  insuredBirthday: readValue(row, "I_BIRTHDAY", "insuredBirthday"),
  policyNo: readValue(row, "POLICY_NO", "policyNo"),
  policyCategory: readValue(row, "POLICY_CAT", "policyCategory"),
  policyDuty: readValue(row, "POLICY_DUTY", "policyDuty"),
  productKind: readValue(row, "PROD_KIND", "productKind"),
  policyStatus: readValue(row, "STATUS", "policyStatus"),
  policyStatusDate: readValue(row, "LST_CHG_DATE", "policyStatusDate"),
  mainPolicyNo: readValue(row, "MAIN_POLICY_NO", "mainPolicyNo"),
  issueDate: readValue(row, "ISSUE_DATE", "issueDate"),
  issueTime: readValue(row, "ISSUE_TIME", "issueTime"),
  lapseDate: readValue(row, "LPS_DATE", "lapseDate"),
  lapseTime: readValue(row, "LPS_TIME", "lapseTime"),
  signDate: readValue(row, "SIGN_DATE", "signDate"),
  premium: readValue(row, "PREM", "premium"),
  paymentFrequency: readValue(row, "PAY_FREQ", "paymentFrequency"),
  paymentPeriod: readValue(row, "PAY_PERIOD", "paymentPeriod"),
  policyStatusTime: readValue(row, "LST_CHG_TIME", "policyStatusTime"),
  brokerType: readValue(row, "BROKTYPE", "brokerType"),
  applicantName: readValue(row, "A_NAME", "applicantName"),
  applicantId: readValue(row, "A_ID", "applicantId"),
  applicantBirthday: readValue(row, "A_BIRTHDAY", "applicantBirthday"),
  relation: readValue(row, "RELATION", "relation"),
  inputTime: readValue(row, "INPUT_TIME", "inputTime"),
  updateTime: readValue(row, "UPDATE_TIME", "updateTime"),
  serialNo: readValue(row, "SER_NO", "serialNo"),
  insuredGender: readValue(row, "I_GENDER", "insuredGender"),
  paymentType: readValue(row, "PAY_TYPE", "paymentType"),
  sourceCode,
  sourceDescription:
    readValue(row, "OIU_IND_DESC", "sourceDescription") ||
    lookupMaps.source[sourceCode] ||
    "",
  salesChannel,
  salesChannelDescription:
    readValue(row, "SALE_CHNL_DESC", "salesChannelDescription") ||
    lookupMaps.salesChannel[salesChannel] ||
    "",
  productCode: readValue(row, "PROD_CODE", "productCode"),
  ...Object.fromEntries(
    coverageFields.map((field) => [
      field.key,
      readValue(row, field.apiKey, field.key),
    ]),
  ),
  };
};

/**
 * 建立舊系統欄位名稱格式的編輯請求。
 *
 * @param {object} dto - 編輯 DTO
 * @returns {object} API 請求
 */
const buildEditRequest = (dto) => ({
  TBL_NAME: dto.tableName,
  INSR_TYPE: dto.reportMethod,
  CMNY_CODE: dto.companyCode,
  I_ID: dto.insuredId,
  I_BIRTHDAY: dto.insuredBirthday,
  POLICY_NO: dto.policyNo,
  POLICY_CAT: dto.policyCategory,
  POLICY_DUTY: dto.policyDuty,
  PROD_KIND: dto.productKind,
  STATUS: dto.policyStatus,
  LST_CHG_DATE: dto.policyStatusDate,
  MAIN_POLICY_NO: dto.mainPolicyNo,
  ISSUE_DATE: dto.issueDate,
  ISSUE_TIME: dto.issueTime,
  LPS_DATE: dto.lapseDate,
  LPS_TIME: dto.lapseTime,
  SIGN_DATE: dto.signDate,
  PREM: dto.premium,
  PAY_FREQ: dto.paymentFrequency,
  PAY_PERIOD: dto.paymentPeriod,
  LST_CHG_TIME: dto.policyStatusTime,
  BROKTYPE: dto.brokerType,
  A_NAME: dto.applicantName,
  A_ID: dto.applicantId,
  A_BIRTHDAY: dto.applicantBirthday,
  RELATION: dto.relation,
  UPDATE_TIME: dto.updateTime,
  SER_NO: dto.serialNo,
  I_GENDER: dto.insuredGender,
  PAY_TYPE: dto.paymentType,
  OIU_IND: dto.sourceCode,
  SALE_CHNL: dto.salesChannel,
  PROD_CODE: dto.productCode,
  ...Object.fromEntries(coverageFields.map((field) => [field.apiKey, dto[field.key]])),
});

/**
 * 將查詢結果套用到頁面。
 *
 * @param {object} payload - 查詢回應資料
 * @returns {void}
 */
const applyQueryPayload = (payload) => {
  const dataMap = payload?.dataMap ?? payload?.summary ?? {};
  const rows = payload?.resultList ?? payload?.rows ?? [];

  Object.assign(
    lookupMaps.reportMethod,
    payload?.INSRMAP ?? payload?.insrMap ?? {},
  );
  Object.assign(
    lookupMaps.source,
    payload?.oiuIndDesc ?? payload?.sourceDescriptions ?? {},
  );
  Object.assign(
    lookupMaps.salesChannel,
    payload?.saleChnlDesc ?? payload?.salesChannelDescriptions ?? {},
  );
  summaryData.value = dataMap;
  queryInfo.name = readValue(dataMap, "NAME", "name");
  queryInfo.birthday = readValue(dataMap, "BIRTHDAY", "birthday");
  queryInfo.lastUpdateTime = readValue(
    dataMap,
    "LAST_UPDATE_TIME",
    "lastUpdateTime",
  );
  resultRows.value = Array.isArray(rows) ? rows.map(mapResultRow) : [];
  isReturnVisible.value = parsePermissionFlag(
    payload?.isReturn ?? payload?.canSyncReturn,
  );
  canRetrieveLatest.value = parsePermissionFlag(
    payload?.isAllow ?? payload?.canRetrieveLatest,
  );
  if (!isReturnVisible.value) {
    queryForm.isReturn = false;
  }
  clearSelection();
};

/**
 * 清除編輯欄位驗證錯誤。
 *
 * @returns {void}
 */
const clearEditErrors = () => {
  Object.keys(editErrors).forEach((key) => {
    delete editErrors[key];
  });
};

/**
 * 驗證可編輯的公會通報欄位。
 *
 * @returns {Promise<boolean>} 是否通過驗證
 */
const validateEditForm = async () => {
  clearEditErrors();
  try {
    await editValidationSchema.validate(editDto, { abortEarly: false });
    return true;
  } catch (error) {
    if (!(error instanceof ValidationError)) {
      throw error;
    }
    error.inner.forEach((validationError) => {
      if (validationError.path && !editErrors[validationError.path]) {
        editErrors[validationError.path] = validationError.message;
      }
    });
    return false;
  }
};

/**
 * 查詢公會通報資料。
 *
 * @returns {Promise<void>}
 */
const handleQuery = async () => {
  const { valid } = await validate();
  if (!valid) {
    return;
  }

  const shouldSyncReturn = isReturnVisible.value && queryForm.isReturn;
  isReturnVisible.value = false;
  canRetrieveLatest.value = false;
  queryForm.isReturn = false;
  isQuerying.value = true;
  const response = normalizeResponse(
    await $cathayAxios
      .post(afy10100Service.query, {
        inputId: inputId.value.trim(),
        role: queryForm.role,
        status: queryForm.status,
        IS_RETURN: shouldSyncReturn ? "Y" : "",
      })
      .finally(() => {
        isQuerying.value = false;
      }),
  );

  if (response.returnCode !== 0) {
    return;
  }
  applyQueryPayload(response.data ?? {});
};

/**
 * 開啟確認對話框並保存確認後動作。
 *
 * @param {string} message - 提示訊息
 * @param {string} title - 對話框標題
 * @param {() => Promise<void>} action - 確認後動作
 * @param {string} [confirmText] - 確認按鈕文字
 * @returns {void}
 */
const openConfirm = (message, title, action, confirmText = "確認") => {
  confirmDialog.message = message;
  confirmDialog.title = title;
  confirmDialog.confirmText = confirmText;
  pendingConfirmAction.value = action;
  confirmDialog.open = true;
};

/**
 * 執行確認對話框所保存的動作。
 *
 * @returns {Promise<void>}
 */
const handleConfirm = async () => {
  const action = pendingConfirmAction.value;
  confirmDialog.open = false;
  pendingConfirmAction.value = null;
  if (action) {
    await action();
  }
};

/**
 * 取消確認對話框。
 *
 * @returns {void}
 */
const handleCancelConfirm = () => {
  confirmDialog.open = false;
  pendingConfirmAction.value = null;
  isRetrieving.value = false;
};

/**
 * 檢查輸入證號後決定是否即時取回公會資料。
 *
 * @returns {Promise<void>}
 */
const handleRetrieveLatestCheck = async () => {
  if (isRetrieving.value) {
    return;
  }
  isRetrieving.value = true;
  let keepRetrieveLock = false;
  try {
    const { valid } = await validate();
    if (!valid) {
      return;
    }

    const response = normalizeResponse(
      await $cathayAxios.post(afy10100Service.checkRetrieveLatest, {
        inputId: inputId.value.trim(),
      }),
    );
    if (response.returnCode !== 0) {
      return;
    }

    const payload = response.data ?? {};
    if (readValue(payload, "isIdError") === "Y") {
      keepRetrieveLock = true;
      openConfirm(
        `輸入值 ${inputId.value} 不符身份證/統一證號檢核規則，是否仍要繼續作業？`,
        "證號檢核提示",
        retrieveLatest,
        "繼續取回",
      );
      return;
    }
    keepRetrieveLock = true;
    await retrieveLatest();
  } finally {
    if (!keepRetrieveLock) {
      isRetrieving.value = false;
    }
  }
};

/**
 * 即時取回公會資料並重新查詢。
 *
 * @returns {Promise<void>}
 */
const retrieveLatest = async () => {
  isRetrieving.value = true;
  try {
    const response = normalizeResponse(
      await $cathayAxios.post(afy10100Service.retrieveLatest, {
        inputId: inputId.value.trim(),
        role: queryForm.role,
        status: queryForm.status,
        IS_RETURN: queryForm.isReturn ? "Y" : "",
      }),
    );

    if (response.returnCode !== 0) {
      return;
    }

    const payload = response.data ?? {};
    if (payload?.dataMap || payload?.resultList || payload?.rows) {
      applyQueryPayload(payload);
      return;
    }
    await handleQuery();
  } finally {
    isRetrieving.value = false;
  }
};

/**
 * 更新選取的公會通報資料。
 *
 * @returns {Promise<void>}
 */
const handleUpdate = async () => {
  const isValid = await validateEditForm();
  if (!isValid) {
    return;
  }

  isUpdating.value = true;
  const response = normalizeResponse(
    await $cathayAxios
      .post(afy10100Service.update, buildEditRequest(editDto))
      .finally(() => {
        isUpdating.value = false;
      }),
  );

  if (response.returnCode !== 0) {
    return;
  }
  await handleQuery();
};

/**
 * 開啟刪除確認視窗。
 *
 * @returns {void}
 */
const handleDeleteRequest = () => {
  openConfirm(
    `確定刪除保單 ${editDto.policyNo || "所選"} 的通報資料？`,
    "刪除確認",
    handleDelete,
    "刪除",
  );
};

/**
 * 刪除選取的公會通報資料。
 *
 * @returns {Promise<void>}
 */
const handleDelete = async () => {
  const response = normalizeResponse(
    await $cathayAxios.post(
      afy10100Service.delete,
      buildEditRequest(editDto),
    ),
  );
  if (response.returnCode !== 0) {
    return;
  }
  await handleQuery();
};

/**
 * 顯示查詢結果已包含的通報明細。
 *
 * @param {object} row - 結果列
 * @returns {void}
 */
const handleOpenDetail = (row) => {
  const mappedRow = mapEditDto(row);
  detailDialog.data = {
    ...mappedRow,
    insuredGender: findOptionLabel(genderOptions, mappedRow.insuredGender),
    paymentType: findOptionLabel(paymentTypeOptions, mappedRow.paymentType),
  };
  detailDialog.open = true;
};

/**
 * 顯示通報方式代碼與說明。
 *
 * @param {object} row - 結果列
 * @returns {string} 通報方式顯示文字
 */
const formatReportMethod = (row) =>
  [row.reportMethod, row.reportMethodDescription].filter(Boolean).join(" ");

/**
 * 清除結果選取與編輯資料。
 *
 * @returns {void}
 */
const clearSelection = () => {
  selectedRows.value = [];
  Object.assign(editDto, createEmptyEditDto());
  clearEditErrors();
};

watch(selectedRows, (rows) => {
  if (rows.length) {
    Object.assign(editDto, mapEditDto(rows[0]));
    clearEditErrors();
  }
});
</script>
