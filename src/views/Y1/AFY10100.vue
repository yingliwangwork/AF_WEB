<template>
  <CxlBreadcrumbs
    class="q-mb-md"
    :breadcrumbs="navCollection"
    :routerPath="$route.path"
    :rootPath="ROOT_PATH"
  />
  <div class="cxl-title-h1 q-mt-md q-mb-md">公會通報查詢</div>

  <q-card class="cxl-card q-pa-md q-mb-lg">
    <q-markup-table
      class="cxl-table cxl-table-horizontal"
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
            <div class="row items-center q-gutter-sm no-wrap">
              <CxlInput
                v-model="inputId"
                placeholder="請輸入身份證字號或統一編號"
                :error="!!errors.inputId"
                :error-message="errors.inputId"
              />
              <q-checkbox
                v-if="canReturn"
                v-model="syncReturn"
                class="cxl-checkbox"
                dense
                label="同步更新公會回檔狀態"
              />
            </div>
          </td>
          <th>契約角色</th>
          <td>
            <CxlDropdown
              v-model="role"
              :options="ROLE_OPTIONS"
              emit-value
              map-options
            />
          </td>
          <th>保單效力</th>
          <td>
            <CxlDropdown
              v-model="status"
              :options="STATUS_OPTIONS"
              emit-value
              map-options
            />
          </td>
        </tr>
        <tr>
          <th>姓名</th>
          <td>{{ dataMap.NAME }}</td>
          <th>生日</th>
          <td>{{ dataMap.BIRTHDAY }}</td>
          <th>公會資料取回日期</th>
          <td>{{ dataMap.LAST_UPDATE_TIME }}</td>
        </tr>
        <tr>
          <td colspan="6">
            <div class="row justify-center">
              <CxlButton label="F2 查詢" @click="query" />
            </div>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>

  <q-card class="cxl-card q-pa-md q-mb-lg">
    <div class="text-h6 q-mb-md">保障項目彙整</div>
    <q-markup-table
      class="cxl-table cxl-table-horizontal"
      separator="cell"
      flat
      bordered
      style="overflow-x: auto;"
    >
      <thead>
        <tr class="cxl-table-header">
          <template v-for="group in BENEFIT_HEADER_GROUPS" :key="group">
            <th>項目</th>
            <th>合計</th>
            <th>同業合計</th>
            <th>收件</th>
            <th>承保</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="benefitRow in BENEFIT_ROWS" :key="benefitRow[0].key">
          <template v-for="benefit in benefitRow" :key="benefit.key">
            <th>{{ benefit.label }}</th>
            <td class="text-right">{{ formatNumber(dataMap[`${benefit.key}_Tot`]) }}</td>
            <td class="text-right">
              {{ formatNumber(dataMap[`${benefit.key}_TotSame`]) }}
            </td>
            <td class="text-right">{{ formatNumber(dataMap[`${benefit.key}_Rr`]) }}</td>
            <td class="text-right">{{ formatNumber(dataMap[`${benefit.key}_LN`]) }}</td>
          </template>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>

  <q-card class="cxl-card q-pa-md q-mb-lg">
    <div class="text-h6 q-mb-md">保費資料彙整</div>
    <q-markup-table
      class="cxl-table cxl-table-horizontal"
      separator="cell"
      flat
      bordered
    >
      <thead>
        <tr class="cxl-table-header">
          <template v-for="premium in PREMIUM_ITEMS" :key="premium.key">
            <th>項目</th>
            <th>合計</th>
            <th>收件</th>
            <th>承保</th>
          </template>
          <th>操作者</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <template v-for="premium in PREMIUM_ITEMS" :key="premium.key">
            <th>{{ premium.label }}</th>
            <td class="text-right">{{ formatNumber(dataMap[`${premium.key}_Tot`]) }}</td>
            <td class="text-right">{{ formatNumber(dataMap[`${premium.key}_Rr`]) }}</td>
            <td class="text-right">{{ formatNumber(dataMap[`${premium.key}_LN`]) }}</td>
          </template>
          <td>{{ dataMap.UPDATE_ID }}</td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>

  <q-card v-if="selectedRow" class="cxl-card q-pa-md q-mb-lg">
    <q-markup-table class="cxl-table-form" separator="horizontal" flat bordered>
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
        <tr v-for="editRow in EDIT_ROWS" :key="editRow[0].rowKey">
          <template v-for="field in editRow" :key="field.key">
            <th v-if="field.kind === 'empty'"></th>
            <th v-else>{{ field.label }}</th>
            <td v-if="field.kind === 'empty'"></td>
            <td v-else>
              <CxlInput
                v-if="field.kind === 'input'"
                v-model="editValues[field.key]"
              />
              <CxlDropdown
                v-else-if="field.kind === 'gender'"
                v-model="editValues[field.key]"
                :options="GENDER_OPTIONS"
                emit-value
                map-options
              />
              <CxlDropdown
                v-else-if="field.kind === 'payType'"
                v-model="editValues[field.key]"
                :options="PAY_TYPE_OPTIONS"
                emit-value
                map-options
              />
              <span v-else>{{ displayEditorValue(field.key) }}</span>
            </td>
          </template>
        </tr>
        <tr>
          <td colspan="10">
            <div class="row justify-center q-gutter-sm">
              <CxlButton label="F9 修改" @click="edit" />
              <CxlButton label="F10 刪除" theme="danger" @click="remove" />
              <CxlButton label="取消" theme="primary-outline" @click="cleanEditor" />
            </div>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>

  <q-card class="cxl-card q-pa-md q-mb-lg">
    <div class="text-h6 q-mb-md">新制通報資料明細</div>
    <CxlTable
      v-model:pagination="resultPagination"
      v-model:selected="selectedRows"
      :rows="resultRows"
      :columns="RESULT_COLUMNS"
      row-key="__rowKey"
      selection="single"
      separator="cell"
      :rows-per-page-options="[0]"
      hide-bottom
    >
      <template #header-selection>選取</template>
      <template #body-selection="scope">
        <q-radio v-model="scope.selected" class="cxl-radio" :val="true" dense />
      </template>
      <template #body-cell-insrType="props">
        <q-td :props="props">
          <CxlButton
            :label="`${props.row.INSR_TYPE ?? ''} ${insrMap[props.row.INSR_TYPE] ?? ''}`"
            theme="primary-outline"
            @click="openDetail(props.row)"
          />
        </q-td>
      </template>
    </CxlTable>
    <div v-if="isAllow" class="row justify-center q-mt-md">
      <CxlButton label="F8 即時取回公會資料" @click="checkBeforeAsync" />
    </div>
  </q-card>

  <q-card class="cxl-card q-pa-md">
    <div class="text-h6 q-mb-md">欄位說明</div>
    <div
      v-for="note in NOTES"
      :key="note"
      class="q-mb-xs"
    >
      {{ note }}
    </div>
  </q-card>

  <CxlModal
    v-model="showAsyncConfirm"
    title="確認"
    cancelText="取消"
    confirmText="繼續作業"
    @cancel="showAsyncConfirm = false"
    @confirm="confirmAsyncRequest"
  >
    <p>{{ asyncConfirmMessage }}</p>
  </CxlModal>

  <CxlModal v-model="showDetail" title="通報資料明細" size="lg" content-scroll>
    <AFY10100Detail
      v-if="showDetail"
      :request-params="detailParams"
      embedded
    />
  </CxlModal>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useField, useForm } from "vee-validate";
import { object, string } from "yup";
import {
  CxlBreadcrumbs,
  CxlButton,
  CxlDropdown,
  CxlInput,
  CxlModal,
  CxlTable,
} from "vue-cathaylife-component";
import AFY10100Detail from "@/views/Y1/AFY10100Detail.vue";
import afy10100Service from "@/service/AFY10100Service.js";
import navCollection from "@/service/NavCollection.js";

const $cathayAxios = inject("$cathayAxios");
const $route = useRoute();
const ROOT_PATH = { label: "首頁", url: "/" };

const ROLE_OPTIONS = [
  { label: "被保人", value: "I" },
  { label: "要保人", value: "A" },
];
const STATUS_OPTIONS = [
  { label: "有效", value: "Y" },
  { label: "無效", value: "N" },
  { label: "全部", value: "A" },
];
const GENDER_OPTIONS = [
  { label: "男", value: "1" },
  { label: "女", value: "2" },
];
const PAY_TYPE_OPTIONS = [
  { label: "無", value: "0" },
  { label: "公費", value: "1" },
  { label: "自費", value: "2" },
];
const BENEFIT_HEADER_GROUPS = ["benefit-a", "benefit-b", "benefit-c"];
const BENEFIT_ITEMS = [
  { key: "PAY_AMT1", label: "身故" },
  { key: "PAY_AMT2", label: "完全失能或最高級失能" },
  { key: "PAY_AMT3", label: "失能扶助金" },
  { key: "PAY_AMT4", label: "特定事故" },
  { key: "PAY_AMT5", label: "初次罹患" },
  { key: "PAY_AMT6", label: "醫療限額" },
  { key: "PAY_AMT7", label: "醫療限額自負" },
  { key: "PAY_AMT8", label: "醫療日額" },
  { key: "PAY_AMT9", label: "住院手術" },
  { key: "PAY_AMT10", label: "門診手術" },
  { key: "PAY_AMT11", label: "門診" },
  { key: "PAY_AMT12", label: "重大疾/傷病" },
  { key: "PAY_AMT13", label: "重大傷燙傷" },
  { key: "PAY_AMT14", label: "癌症療養" },
  { key: "PAY_AMT15", label: "出院療養" },
  { key: "PAY_AMT16", label: "喪失工作能力" },
  { key: "PAY_AMT17", label: "喪葬費用" },
  { key: "PAY_AMT18", label: "銜接原醫療限額之自負額" },
  { key: "PAY_AMT19", label: "分期給付" },
  { key: "EMPTY_BENEFIT_1", label: "" },
  { key: "EMPTY_BENEFIT_2", label: "" },
];
const BENEFIT_ROWS = Array.from(
  { length: BENEFIT_ITEMS.length / 3 },
  (_, rowIndex) => BENEFIT_ITEMS.slice(rowIndex * 3, rowIndex * 3 + 3),
);
const PREMIUM_ITEMS = [
  { key: "YEAR_PREM", label: "年繳保費" },
  { key: "ONCE_PREM", label: "躉繳保費" },
  { key: "FLEX_PREM", label: "超額(彈性)保險費" },
];
const EDIT_ROWS = [
  [
    { key: "INSR_TYPE", label: "通報方式", kind: "text", rowKey: "edit-row-1" },
    { key: "CMNY_CODE", label: "公司別", kind: "text" },
    { key: "I_ID", label: "被保人ID", kind: "text" },
    { key: "I_BIRTHDAY", label: "被保人生日", kind: "text" },
    { key: "POLICY_NO", label: "保單號碼", kind: "text" },
  ],
  [
    { key: "POLICY_CAT", label: "保單分類", kind: "text", rowKey: "edit-row-2" },
    { key: "POLICY_DUTY", label: "險種分類", kind: "text" },
    { key: "PROD_KIND", label: "險種", kind: "text" },
    { key: "STATUS", label: "保單狀況", kind: "text" },
    { key: "LST_CHG_DATE", label: "保單狀況生效日期(受理理賠日、身故日)", kind: "text" },
  ],
  [
    { key: "MAIN_POLICY_NO", label: "主約保單號碼", kind: "text", rowKey: "edit-row-3" },
    { key: "ISSUE_DATE", label: "契約生效日", kind: "text" },
    { key: "ISSUE_TIME", label: "契約生效時分", kind: "text" },
    { key: "LPS_DATE", label: "契約滿期日", kind: "text" },
    { key: "LPS_TIME", label: "契約滿期時分", kind: "text" },
  ],
  [
    { key: "SIGN_DATE", label: "要保書填寫日", kind: "text", rowKey: "edit-row-4" },
    { key: "PREM", label: "保費", kind: "text" },
    { key: "PAY_FREQ", label: "保費繳別", kind: "text" },
    { key: "PAY_PERIOD", label: "保費繳費年期", kind: "text" },
    { key: "LST_CHG_TIME", label: "保單狀況生效時分", kind: "text" },
  ],
  [
    { key: "PAY_AMT1", label: "身故", kind: "input", rowKey: "edit-row-5" },
    { key: "PAY_AMT2", label: "完全失能或最高級失能", kind: "input" },
    { key: "PAY_AMT3", label: "失能扶助金", kind: "input" },
    { key: "PAY_AMT4", label: "特定事故", kind: "input" },
    { key: "PAY_AMT5", label: "初次罹患", kind: "input" },
  ],
  [
    { key: "PAY_AMT6", label: "醫療限額", kind: "input", rowKey: "edit-row-6" },
    { key: "PAY_AMT7", label: "醫療限額自負", kind: "input" },
    { key: "PAY_AMT8", label: "醫療日額", kind: "input" },
    { key: "PAY_AMT9", label: "住院手術", kind: "input" },
    { key: "PAY_AMT10", label: "門診手術", kind: "input" },
  ],
  [
    { key: "PAY_AMT11", label: "門診", kind: "input", rowKey: "edit-row-7" },
    { key: "PAY_AMT12", label: "重大疾/傷病", kind: "input" },
    { key: "PAY_AMT13", label: "重大燒燙傷", kind: "input" },
    { key: "PAY_AMT14", label: "癌症療養", kind: "input" },
    { key: "PAY_AMT15", label: "出院療養", kind: "input" },
  ],
  [
    { key: "PAY_AMT16", label: "喪失工作能力", kind: "input", rowKey: "edit-row-8" },
    { key: "PAY_AMT17", label: "喪葬費用", kind: "input" },
    { key: "PAY_AMT18", label: "銜接原醫療限額之自負額", kind: "input" },
    { key: "PAY_AMT19", label: "分期給付", kind: "input" },
    { key: "BROKTYPE", label: "保經代分類", kind: "input" },
  ],
  [
    { key: "A_NAME", label: "要保人姓名", kind: "input", rowKey: "edit-row-9" },
    { key: "A_ID", label: "要保人身分證號碼", kind: "input" },
    { key: "A_BIRTHDAY", label: "要保人出生日期", kind: "input" },
    { key: "RELATION", label: "要保人與被保險人關係", kind: "input" },
    { key: "UPDATE_TIME", label: "資料寫入時間", kind: "text" },
  ],
  [
    { key: "I_GENDER", label: "被保險人性別", kind: "gender", rowKey: "edit-row-10" },
    { key: "PAY_TYPE", label: "公、自費件", kind: "payType" },
    { key: "OIU_IND", label: "來源別", kind: "text" },
    { key: "SALE_CHNL", label: "銷售通路", kind: "text" },
    { key: "PROD_CODE", label: "商品代碼", kind: "text" },
  ],
  [
    { key: "SER_NO", label: "公會取回序號", kind: "text", rowKey: "edit-row-11" },
    { key: "EMPTY_EDIT_1", label: "", kind: "empty" },
    { key: "EMPTY_EDIT_2", label: "", kind: "empty" },
    { key: "EMPTY_EDIT_3", label: "", kind: "empty" },
    { key: "EMPTY_EDIT_4", label: "", kind: "empty" },
  ],
];
const EDITOR_KEYS = [
  "TBL_NAME",
  "INSR_TYPE",
  "CMNY_CODE",
  "I_ID",
  "I_BIRTHDAY",
  "POLICY_NO",
  "POLICY_CAT",
  "POLICY_DUTY",
  "PROD_KIND",
  "STATUS",
  "LST_CHG_DATE",
  "MAIN_POLICY_NO",
  "ISSUE_DATE",
  "ISSUE_TIME",
  "LPS_DATE",
  "LPS_TIME",
  "SIGN_DATE",
  "PREM",
  "PAY_FREQ",
  "PAY_PERIOD",
  "LST_CHG_TIME",
  ...Array.from({ length: 19 }, (_, index) => `PAY_AMT${index + 1}`),
  "BROKTYPE",
  "A_NAME",
  "A_ID",
  "A_BIRTHDAY",
  "RELATION",
  "UPDATE_TIME",
  "SER_NO",
  "I_GENDER",
  "PAY_TYPE",
];
const DETAIL_KEYS = [
  "INSR_TYPE",
  "CMNY_CODE",
  "I_ID",
  "I_BIRTHDAY",
  "POLICY_NO",
  "POLICY_CAT",
  "POLICY_DUTY",
  "PROD_KIND",
  "STATUS",
  "LST_CHG_DATE",
  "MAIN_POLICY_NO",
  "ISSUE_DATE",
  "ISSUE_TIME",
  "LPS_DATE",
  "LPS_TIME",
  "SIGN_DATE",
  "PREM",
  "PAY_FREQ",
  "PAY_PERIOD",
  "LST_CHG_TIME",
  ...Array.from({ length: 19 }, (_, index) => `PAY_AMT${index + 1}`),
  "BROKTYPE",
  "A_NAME",
  "A_ID",
  "A_BIRTHDAY",
  "RELATION",
  "UPDATE_TIME",
  "SER_NO",
  "I_GENDER",
  "PAY_TYPE",
  "OIU_IND",
  "SALE_CHNL",
  "PROD_CODE",
];
const RESULT_ROW_FIELD_ALIASES = {
  iid: "I_ID",
  ibirthday: "I_BIRTHDAY",
  igender: "I_GENDER",
  aid: "A_ID",
  abirthday: "A_BIRTHDAY",
  aname: "A_NAME",
  iname: "I_NAME",
};
const NOTES = [
  "1. 銷售通路:1網路投保 2業務員3保經、保代 4電話行銷 5機場櫃檯",
  "2. 保單分類：1個人；2團體",
  "3. 險種分類：1人壽保險；2傷害保險；3健康保險 4.年金保險。",
  "4. 險種：01一般；02特定；03投資型；04日額型；05實支實付型；06日額或實支實付擇一型；07手術型；08重大疾病；09帳戶型；10長期看護型；11喪失工作能力；12防癌；13旅平險；14微型；15微型實支實付；16小額終老保險；17.失能扶助保險；18.登山綜合保險；19定期人壽保險(不含一年期)；20海域活動綜合保險；21一年期",
  "5. 繳別：1躉繳；2年繳；3半年繳；4季繳；5月繳；6彈性繳；9繳費期滿",
  "6. 保單狀況：收件: 01有效；06未承保取消件；07契約註銷；11滿期(契約到期)；12鍵值欄位通報錯誤終止；15通報更正；50一○七條/一○七條之一承保資料；51一○七條理賠資料（未滿14足歲之未成年人）；52一○七條/一○七條之一理賠資料（精神障礙或其他心智缺陷/受監護宣告尚未撤銷）。承保: 01有效；02增額；03減額；04展期；05繳清；06契約撤銷；07停效；10解除契約；11滿期(契約到期)；12鍵值欄位通報錯誤終止；20終止1:由要保人提出終止契約效力；21終止2:主被保險人死亡，其他被保險人附同時終止或完全失能或理賠給付後終止附約；30被保險人因自然死身故；31被保險人因意外身故；32被保險人因其他原因故；50一○七條/一○七條之一承保資料；51一○七條理賠資料（未滿14足歲之未成年人）；52一○七條/一○七條之一理賠資料（精神障礙或其他心智缺陷/受監護宣告尚未撤銷）。",
  "7. 保障及保費彙整欄位，金額依頁面上的筆數加總，含本公司及產、壽險通報資料。",
  "8. 即時捉取公會資料：輸入身份證字號∕統一證號，按F8即時捉取公會資料鈕",
];
const NUMBER_FORMATTER = new Intl.NumberFormat("zh-TW", {
  maximumFractionDigits: 0,
});

/**
 * 將金額格式化為千分位字串。
 *
 * @param {string|number|null|undefined} value - 待格式化金額
 * @returns {string} 格式化後的金額
 */
const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") return "";
  return NUMBER_FORMATTER.format(value);
};

const RESULT_COLUMNS = [
  {
    name: "index",
    label: "序號",
    field: (row) => Number(row.__itemValue) + 1,
    align: "center",
  },
  { name: "insrType", label: "通報方式", field: "INSR_TYPE", align: "center", sortable: true },
  {
    name: "companyName",
    label: "公司別",
    field: "COMPANY_NAME",
    align: "center",
    sortable: true,
  },
  {
    name: "policyNo",
    label: "保單號碼",
    field: "POLICY_NO",
    align: "center",
    sortable: true,
  },
  { name: "saleChnl", label: "銷售通路", field: "SALE_CHNL", align: "center" },
  { name: "prodCode", label: "商品代碼", field: "PROD_CODE", align: "center" },
  { name: "policyCat", label: "保單分類", field: "POLICY_CAT", align: "center" },
  { name: "policyDuty", label: "險種分類", field: "POLICY_DUTY", align: "center" },
  {
    name: "prodKind",
    label: "險種",
    field: "PROD_KIND",
    align: "center",
    sortable: true,
  },
  { name: "status", label: "保單狀況", field: "STATUS", align: "center" },
  {
    name: "payAmt1",
    label: "身故保額",
    field: "PAY_AMT1",
    align: "right",
    format: formatNumber,
  },
  {
    name: "payAmt6",
    label: "醫療限額",
    field: "PAY_AMT6",
    align: "right",
    format: formatNumber,
  },
  {
    name: "payAmt8",
    label: "醫療日額",
    field: "PAY_AMT8",
    align: "right",
    format: formatNumber,
  },
  {
    name: "issueDate",
    label: "契約生效日",
    field: "ISSUE_DATE",
    align: "center",
    sortable: true,
  },
  { name: "lpsDate", label: "契約滿期日", field: "LPS_DATE", align: "center" },
  { name: "applicantName", label: "要保人姓名", field: "A_NAME", align: "center" },
  { name: "updateTime", label: "通報時間", field: "UPDATE_TIME", align: "center" },
];

const asyncSchema = object({
  inputId: string().required("身份證字號/統一編號：不得為空值"),
});
const { errors, setValues, validate } = useForm({
  validationSchema: asyncSchema,
  initialValues: { inputId: "" },
  validateOnMount: false,
});
const { value: inputId } = useField("inputId", undefined, {
  validateOnValueUpdate: true,
});

const role = ref("I");
const status = ref("Y");
const canReturn = ref(false);
const syncReturn = ref(false);
const isAllow = ref(false);
const dataMap = ref({});
const resultRows = ref([]);
const resultPagination = ref({ page: 1, rowsPerPage: 0 });
const selectedRows = ref([]);
const insrMap = ref({});
const oiuIndDesc = ref({});
const saleChnlDesc = ref({});
const showDetail = ref(false);
const showAsyncConfirm = ref(false);
const asyncConfirmMessage = ref("");
const detailParams = ref({});
const editValues = reactive(
  Object.fromEntries(EDITOR_KEYS.map((key) => [key, ""])),
);
editValues.I_GENDER = "1";
editValues.PAY_TYPE = "0";

const selectedRow = computed(() => selectedRows.value[0] ?? null);

/**
 * 清除編輯區並取消資料列選取。
 *
 * @returns {void}
 */
const resetEditorForPage = () => {
  EDITOR_KEYS.forEach((key) => {
    editValues[key] = "";
  });
  editValues.I_GENDER = "1";
  editValues.PAY_TYPE = "0";
  selectedRows.value = [];
};

/**
 * 將後端頁面資料映射至查詢條件、彙整與明細區。
 *
 * @param {object} pageData - AFY10100 頁面回傳資料
 * @returns {void}
 */
const applyPageData = (pageData) => {
  setValues({ inputId: pageData.inputId ?? "" });
  role.value = pageData.role ?? "I";
  status.value = pageData.status ?? "Y";
  canReturn.value = pageData.isReturn === true || pageData.isReturn === "true";
  syncReturn.value = false;
  isAllow.value = pageData.isAllow === true || pageData.isAllow === "true";
  dataMap.value = pageData.dataMap ?? {};
  insrMap.value = pageData.insrMap ?? {};
  oiuIndDesc.value = pageData.oiuIndDesc ?? {};
  saleChnlDesc.value = pageData.saleChnlDesc ?? {};
  resultRows.value = (pageData.resultList ?? []).map((row, index) => {
    const normalizedRow = Object.fromEntries(
      Object.entries(row).map(([key, value]) => [
        RESULT_ROW_FIELD_ALIASES[key] ??
          key.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toUpperCase(),
        value,
      ]),
    );
    return {
      ...row,
      ...normalizedRow,
      __itemValue: String(index),
      __rowKey: `${normalizedRow.TBL_NAME ?? ""}-${normalizedRow.SER_NO ?? ""}-${normalizedRow.POLICY_NO ?? ""}-${index}`,
    };
  });
  resetEditorForPage();
  editValues.I_GENDER = pageData.igender ?? "1";
  editValues.PAY_TYPE = pageData.payType ?? "0";
};

/**
 * 建立 AFY10100 共用請求資料。
 *
 * @returns {object} API 請求資料
 */
const buildFormRequest = () => {
  const request = {
    inputId: inputId.value,
    role: role.value,
    status: status.value,
    ...Object.fromEntries(EDITOR_KEYS.map((key) => [key, editValues[key]])),
  };
  if (canReturn.value && syncReturn.value) request.IS_RETURN = "Y";
  if (selectedRow.value) request.item = selectedRow.value.__itemValue;
  return request;
};

/**
 * 依目前 CathayAxios 執行模式解析成功回應資料。
 *
 * @param {object} response - CathayAxios 回應
 * @returns {object|null} 成功資料；失敗時回傳 null
 */
const resolveResponseData = (response) => {
  if (typeof response?.returnCode === "number") {
    return response.returnCode === 0 ? response.data : null;
  }
  if (response?.ErrMsg) {
    return Number(response.ErrMsg.returnCode) === 0 && !response.jsonData?.error
      ? response.jsonData
      : null;
  }
  return null;
};

/**
 * 送出頁面操作並套用回傳資料。
 *
 * @param {string} endpoint - AFY10100 API endpoint
 * @returns {Promise<void>}
 */
const submitPageAction = async (endpoint) => {
  const { valid } = await validate()
  if (!valid) return
  const response = await $cathayAxios.post(endpoint, buildFormRequest());
  const responseData = resolveResponseData(response);
  if (!responseData) return;
  applyPageData(responseData);
};

/**
 * 查詢公會通報資料。
 *
 * @returns {Promise<void>}
 */
const query = async () => {
  await submitPageAction(afy10100Service.query);
};

/**
 * 修改目前選取的通報資料。
 *
 * @returns {Promise<void>}
 */
const edit = async () => {
  await submitPageAction(afy10100Service.edit);
};

/**
 * 刪除目前選取的通報資料。
 *
 * @returns {Promise<void>}
 */
const remove = async () => {
  await submitPageAction(afy10100Service.delete);
};

/**
 * 即時取回公會資料。
 *
 * @returns {Promise<void>}
 */
const runAsync = async () => {
  await submitPageAction(afy10100Service.async);
};

/**
 * 驗證輸入值並確認是否可即時取回公會資料。
 *
 * @returns {Promise<void>}
 */
const checkBeforeAsync = async () => {
  const { valid } = await validate({ schema: asyncSchema });
  if (!valid) return;

  const response = await $cathayAxios.post(afy10100Service.asyncCheckId, {
    inputId: inputId.value,
  });
  const responseData = resolveResponseData(response);
  if (!responseData) return;

  if (responseData.isIdError === "Y") {
    asyncConfirmMessage.value =
      `輸入值 ${inputId.value} 不符身份證/統一證號檢核規則，請確認是否繼續作業？`;
    showAsyncConfirm.value = true;
    return;
  }
  await runAsync();
};

/**
 * 確認忽略證號格式檢核並執行即時取回。
 *
 * @returns {Promise<void>}
 */
const confirmAsyncRequest = async () => {
  showAsyncConfirm.value = false;
  await runAsync();
};

/**
 * 清除資料編輯區。
 *
 * @returns {void}
 */
const cleanEditor = () => {
  EDITOR_KEYS.forEach((key) => {
    editValues[key] = "";
  });
  selectedRows.value = [];
};

/**
 * 取得編輯區唯讀欄位顯示值。
 *
 * @param {string} key - 欄位名稱
 * @returns {string} 顯示值
 */
const displayEditorValue = (key) => {
  if (key === "UPDATE_TIME") return selectedRow.value?.INPUT_TIME ?? "";
  if (key === "OIU_IND") return oiuIndDesc.value[selectedRow.value?.OIU_IND] ?? "";
  if (key === "SALE_CHNL") return saleChnlDesc.value[selectedRow.value?.SALE_CHNL] ?? "";
  if (key === "PROD_CODE") return selectedRow.value?.PROD_CODE ?? "";
  return editValues[key] ?? "";
};

/**
 * 開啟尚待轉換的明細元件 placeholder。
 *
 * @param {object} row - 選取的通報資料
 * @returns {void}
 */
const openDetail = (row) => {
  detailParams.value = Object.fromEntries(
    DETAIL_KEYS.map((key) => [key, row[key] ?? ""]),
  );
  showDetail.value = true;
};

/**
 * 處理頁面功能鍵。
 *
 * @param {KeyboardEvent} event - 鍵盤事件
 * @returns {void}
 */
const handleHotKey = (event) => {
  if (showDetail.value || showAsyncConfirm.value) return;

  const actions = {
    F2: query,
    F8: isAllow.value ? checkBeforeAsync : null,
    F9: selectedRow.value ? edit : null,
    F10: selectedRow.value ? remove : null,
  };
  const action = actions[event.key];
  if (!action) return;
  event.preventDefault();
  action();
};

watch(selectedRows, ([row]) => {
  if (!row) return;
  EDITOR_KEYS.forEach((key) => {
    editValues[key] = row[key] ?? "";
  });
});

onMounted(() => {
  window.addEventListener("keydown", handleHotKey);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleHotKey);
});
</script>
