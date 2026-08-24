<template>
  <CxlBreadcrumbs
    v-if="!props.embedded"
    class="q-mb-md"
    :breadcrumbs="DETAIL_BREADCRUMBS"
    :routerPath="$route.path"
    :rootPath="ROOT_PATH"
  />
  <div v-if="!props.embedded" class="cxl-title-h1 q-mt-md q-mb-md">公會通報查詢</div>

  <q-card class="cxl-card q-pa-md" :class="{ 'q-mb-lg': !props.embedded }">
    <q-markup-table class="cxl-table-form" separator="horizontal" flat bordered>
      <colgroup>
        <template v-for="columnIndex in 5" :key="columnIndex">
          <col style="width: 10%" />
          <col style="width: 10%" />
        </template>
      </colgroup>
      <thead>
        <tr>
          <th colspan="10" class="cxl-form-title">通報資料明細</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in detailRows" :key="row.id">
          <template v-for="field in row.fields" :key="field.key">
            <th>{{ field.label }}</th>
            <td>{{ field.value }}</td>
          </template>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>
</template>

<script setup>
import { computed, inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { CxlBreadcrumbs } from "vue-cathaylife-component";
import afy10100Service from "@/service/AFY10100Service.js";
import navCollection from "@/service/NavCollection.js";

const $cathayAxios = inject("$cathayAxios");
const $route = useRoute();
const props = defineProps({
  requestParams: {
    type: Object,
    default: () => ({}),
  },
  embedded: {
    type: Boolean,
    default: false,
  },
});
const ROOT_PATH = { label: "首頁", url: "/" };
const DETAIL_BREADCRUMBS = navCollection.map((section) => ({
  ...section,
  items: section.items.map((item) =>
    item.url === "/Y1/AFY10100"
      ? {
          ...item,
          items: [{ label: "通報資料明細", url: "/Y1/AFY10100/detail" }],
        }
      : item,
  ),
}));

const pageData = ref({
  dataMap: {},
  genderDesc: {},
  payTypeDesc: {},
  oiuIndDesc: {},
  saleChnlDesc: {},
});

const DETAIL_ROW_DEFINITIONS = [
  {
    id: 'notification',
    fields: [
      { key: 'INSR_TYPE', label: '通報方式' },
      { key: 'CMNY_CODE', label: '公司別' },
      { key: 'I_ID', label: '被保人ID' },
      { key: 'I_BIRTHDAY', label: '被保人生日' },
      { key: 'POLICY_NO', label: '保單號碼' },
    ],
  },
  {
    id: 'policy-status',
    fields: [
      { key: 'POLICY_CAT', label: '保單分類' },
      { key: 'POLICY_DUTY', label: '險種分類' },
      { key: 'PROD_KIND', label: '險種' },
      { key: 'STATUS', label: '保單狀況' },
      { key: 'LST_CHG_DATE', label: '保單狀況生效日期(受理理賠日、身故日)' },
    ],
  },
  {
    id: 'policy-period',
    fields: [
      { key: 'MAIN_POLICY_NO', label: '主約保單號碼' },
      { key: 'ISSUE_DATE', label: '契約生效日' },
      { key: 'ISSUE_TIME', label: '契約生效時分' },
      { key: 'LPS_DATE', label: '契約滿期日' },
      { key: 'LPS_TIME', label: '契約滿期時分' },
    ],
  },
  {
    id: 'premium',
    fields: [
      { key: 'SIGN_DATE', label: '要保書填寫日' },
      { key: 'PREM', label: '保費' },
      { key: 'PAY_FREQ', label: '保費繳別' },
      { key: 'PAY_PERIOD', label: '保費繳費年期' },
      { key: 'LST_CHG_TIME', label: '保單狀況生效時分' },
    ],
  },
  {
    id: 'benefit-1-to-5',
    fields: [
      { key: 'PAY_AMT1', label: '身故' },
      { key: 'PAY_AMT2', label: '完全失能或最高級失能' },
      { key: 'PAY_AMT3', label: '失能扶助金' },
      { key: 'PAY_AMT4', label: '特定事故' },
      { key: 'PAY_AMT5', label: '初次罹患' },
    ],
  },
  {
    id: 'benefit-6-to-10',
    fields: [
      { key: 'PAY_AMT6', label: '醫療限額' },
      { key: 'PAY_AMT7', label: '醫療限額自負' },
      { key: 'PAY_AMT8', label: '醫療日額' },
      { key: 'PAY_AMT9', label: '住院手術' },
      { key: 'PAY_AMT10', label: '門診手術' },
    ],
  },
  {
    id: 'benefit-11-to-15',
    fields: [
      { key: 'PAY_AMT11', label: '門診' },
      { key: 'PAY_AMT12', label: '重大疾/傷病' },
      { key: 'PAY_AMT13', label: '重大燒燙傷' },
      { key: 'PAY_AMT14', label: '癌症療養' },
      { key: 'PAY_AMT15', label: '出院療養' },
    ],
  },
  {
    id: 'benefit-16-to-19',
    fields: [
      { key: 'PAY_AMT16', label: '喪失工作能力' },
      { key: 'PAY_AMT17', label: '喪葬費用' },
      { key: 'PAY_AMT18', label: '銜接原醫療限額之自負額' },
      { key: 'PAY_AMT19', label: '分期給付' },
      { key: 'BROKTYPE', label: '保經代分類' },
    ],
  },
  {
    id: 'applicant',
    fields: [
      { key: 'A_NAME', label: '要保人姓名' },
      { key: 'A_ID', label: '要保人身分證號碼' },
      { key: 'A_BIRTHDAY', label: '要保人出生日期' },
      { key: 'RELATION', label: '要保人與被保險人關係' },
      { key: 'UPDATE_TIME', label: '資料寫入時間' },
    ],
  },
  {
    id: 'classification',
    fields: [
      { key: 'I_GENDER', label: '被保險人性別', lookup: 'genderDesc' },
      { key: 'PAY_TYPE', label: '公、自費件', lookup: 'payTypeDesc' },
      { key: 'OIU_IND', label: '來源別', lookup: 'oiuIndDesc' },
      { key: 'SALE_CHNL', label: '銷售通路', lookup: 'saleChnlDesc' },
      { key: 'PROD_CODE', label: '商品代碼' },
    ],
  },
  {
    id: 'serial-number',
    fields: [
      { key: 'SER_NO', label: '公會取回序號' },
      { key: 'EMPTY_1', label: '', empty: true },
      { key: 'EMPTY_2', label: '', empty: true },
      { key: 'EMPTY_3', label: '', empty: true },
      { key: 'EMPTY_4', label: '', empty: true },
    ],
  },
];

/**
 * 取得明細欄位的顯示值，並套用代碼說明對照。
 *
 * @param {object} field - 明細欄位定義
 * @param {string} field.key - API 資料欄位名稱
 * @param {string} [field.lookup] - 代碼說明對照表名稱
 * @param {boolean} [field.empty] - 是否為版面留白欄位
 * @returns {*} 欄位顯示值
 */
const resolveFieldValue = (field) => {
  if (field.empty) {
    return undefined;
  }

  const value = pageData.value.dataMap?.[field.key];
  if (!field.lookup) {
    return value;
  }

  return pageData.value[field.lookup]?.[value];
};

const detailRows = computed(() =>
  DETAIL_ROW_DEFINITIONS.map((row) => ({
    ...row,
    fields: row.fields.map((field) => ({
      ...field,
      value: resolveFieldValue(field),
    })),
  })),
);

/**
 * 載入公會通報明細資料。
 *
 * @returns {Promise<void>}
 */
const loadDetail = async () => {
  const response = await $cathayAxios.post(afy10100Service.showDetail, {
    ...props.requestParams,
  });
  if (response.returnCode !== 0) {
    return;
  }

  pageData.value = response.data;
};

onMounted(loadDetail);
</script>
