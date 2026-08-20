<template>
    <div>
        <CxlBreadcrumbs
            class="q-mb-md"
            :breadcrumbs="navCollection"
            :routerPath="$route.path"
            :rootPath="rootPath"
        />
        <div class="cxl-title-h1 q-mb-md">公會通報查詢</div>

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
                        <th>
                            <span class="cxl-text-danger">*</span>
                            身份證字號/統一編號
                        </th>
                        <td>
                            <CxlInput
                                v-model="inputId"
                                placeholder="請輸入身份證字號或統一編號"
                                :error="!!errors.inputId"
                                :error-message="errors.inputId"
                            />
                            <q-checkbox
                                v-if="showReturnOption"
                                v-model="isReturnChecked"
                                class="cxl-checkbox q-mt-sm"
                                label="同步更新公會回檔狀態"
                                true-value="Y"
                                false-value=""
                                dense
                            />
                        </td>
                        <th>契約角色</th>
                        <td>
                            <CxlDropdown
                                v-model="role"
                                :options="roleOptions"
                                map-options
                                emit-value
                            />
                        </td>
                        <th>保單效力</th>
                        <td>
                            <CxlDropdown
                                v-model="status"
                                :options="statusOptions"
                                map-options
                                emit-value
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
                            <div class="row justify-center q-gutter-sm">
                                <CxlButton label="F2查詢" @click="doQuery" />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </q-markup-table>
        </q-card>

        <q-card class="cxl-card q-pa-md q-mb-lg">
            <div class="text-subtitle1 text-weight-bold q-mb-md">保障項目彙整</div>
            <div class="scroll">
                <q-markup-table class="cxl-table" separator="cell" flat bordered>
                    <thead>
                        <tr class="cxl-table-header">
                            <template v-for="group in 3" :key="`benefit-header-${group}`">
                                <th>項目</th>
                                <th>合計</th>
                                <th>同業合計</th>
                                <th>收件</th>
                                <th>承保</th>
                            </template>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in benefitSummaryRows" :key="row[0].code">
                            <template v-for="item in row" :key="item.code">
                                <th>{{ item.label }}</th>
                                <td class="text-right">{{ formatNumber(item.total) }}</td>
                                <td class="text-right">
                                    {{ formatNumber(item.sameTradeTotal) }}
                                </td>
                                <td class="text-right">{{ formatNumber(item.received) }}</td>
                                <td class="text-right">
                                    {{ formatNumber(item.underwritten) }}
                                </td>
                            </template>
                        </tr>
                    </tbody>
                </q-markup-table>
            </div>
        </q-card>

        <q-card class="cxl-card q-pa-md q-mb-lg">
            <div class="text-subtitle1 text-weight-bold q-mb-md">保費資料彙整</div>
            <div class="scroll">
                <q-markup-table class="cxl-table" separator="cell" flat bordered>
                    <thead>
                        <tr class="cxl-table-header">
                            <template v-for="item in premiumSummary" :key="`${item.code}-header`">
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
                            <template v-for="item in premiumSummary" :key="item.code">
                                <th>{{ item.label }}</th>
                                <td class="text-right">{{ formatNumber(item.total) }}</td>
                                <td class="text-right">{{ formatNumber(item.received) }}</td>
                                <td class="text-right">
                                    {{ formatNumber(item.underwritten) }}
                                </td>
                            </template>
                            <td class="text-center">{{ dataMap.UPDATE_ID }}</td>
                        </tr>
                    </tbody>
                </q-markup-table>
            </div>
        </q-card>

        <q-card v-if="hasSelectedRecord" class="cxl-card q-pa-md q-mb-lg">
            <div class="text-subtitle1 text-weight-bold q-mb-md">資料編輯區</div>

            <div class="scroll q-mb-md">
                <q-markup-table class="cxl-table-form" separator="horizontal" flat bordered>
                    <tbody>
                        <tr v-for="row in readonlyEditRows" :key="row[0].key">
                            <template v-for="field in row" :key="field.key">
                                <th>{{ field.label }}</th>
                                <td>{{ field.value }}</td>
                            </template>
                        </tr>
                    </tbody>
                </q-markup-table>
            </div>

            <div class="scroll q-mb-md">
                <q-markup-table class="cxl-table-form" separator="horizontal" flat bordered>
                    <tbody>
                        <tr v-for="row in benefitEditRows" :key="row[0].key">
                            <template v-for="field in row" :key="field.key">
                                <th>{{ field.label }}</th>
                                <td>
                                    <CxlInput
                                        v-if="!field.placeholder"
                                        v-model="editRecord[field.key]"
                                        :placeholder="`請輸入${field.label}`"
                                    />
                                </td>
                            </template>
                        </tr>
                    </tbody>
                </q-markup-table>
            </div>

            <div class="scroll">
                <q-markup-table class="cxl-table-form" separator="horizontal" flat bordered>
                    <tbody>
                        <tr>
                            <th>保經代分類</th>
                            <td>
                                <CxlInput
                                    v-model="editRecord.BROKTYPE"
                                    placeholder="請輸入保經代分類"
                                />
                            </td>
                            <th>要保人姓名</th>
                            <td>
                                <CxlInput
                                    v-model="editRecord.A_NAME"
                                    placeholder="請輸入要保人姓名"
                                />
                            </td>
                            <th>要保人身分證號碼</th>
                            <td>
                                <CxlInput
                                    v-model="editRecord.A_ID"
                                    placeholder="請輸入要保人身分證號碼"
                                />
                            </td>
                            <th>要保人出生日期</th>
                            <td>
                                <CxlInput
                                    v-model="editRecord.A_BIRTHDAY"
                                    placeholder="請輸入要保人出生日期"
                                />
                            </td>
                            <th>要保人與被保險人關係</th>
                            <td>
                                <CxlInput
                                    v-model="editRecord.RELATION"
                                    placeholder="請輸入關係"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>被保險人性別</th>
                            <td>
                                <CxlDropdown
                                    v-model="editRecord.I_GENDER"
                                    :options="genderOptions"
                                    map-options
                                    emit-value
                                />
                            </td>
                            <th>公、自費件</th>
                            <td>
                                <CxlDropdown
                                    v-model="editRecord.PAY_TYPE"
                                    :options="payTypeOptions"
                                    map-options
                                    emit-value
                                />
                            </td>
                            <th>來源別</th>
                            <td>{{ editRecord.OIU_IND_DESC }}</td>
                            <th>銷售通路</th>
                            <td>{{ editRecord.SALE_CHNL_DESC }}</td>
                            <th>商品代碼</th>
                            <td>{{ editRecord.PROD_CODE }}</td>
                        </tr>
                    </tbody>
                </q-markup-table>
            </div>

            <div class="row justify-center q-gutter-sm q-mt-md">
                <CxlButton label="F9修改" @click="doEdit" />
                <CxlButton label="F10刪除" theme="danger" @click="doDelete" />
                <CxlButton
                    label="取消"
                    theme="primary-outline"
                    @click="clearSelection"
                />
            </div>
        </q-card>

        <q-card class="cxl-card q-pa-md q-mb-lg">
            <div class="text-subtitle1 text-weight-bold q-mb-md">新制通報資料明細</div>
            <CxlTable
                v-model:pagination="tablePagination"
                :rows="resultTableRows"
                :columns="RESULT_COLUMNS"
                :selected="selectedRows"
                :rows-per-page-options="[0]"
                row-key="_rowKey"
                selection="single"
                separator="cell"
                hide-bottom
                @update:selected="updateSelectedRows"
            >
                <template #body-selection="scope">
                    <q-radio
                        v-model="scope.selected"
                        class="cxl-radio"
                        :val="true"
                        dense
                    />
                </template>
                <template #body-cell-insrType="props">
                    <q-td :props="props">
                        <a href="" @click.prevent="openDetail(props.row)">
                            {{ props.row.INSR_TYPE }}&nbsp;{{
                                insrMap[props.row.INSR_TYPE]
                            }}
                        </a>
                    </q-td>
                </template>
            </CxlTable>
            <div v-if="isAllow" class="row justify-center q-mt-md">
                <CxlButton label="F8即時取回公會資料" @click="doAsyncCheck" />
            </div>
        </q-card>

        <q-card class="cxl-card q-pa-md">
            <ol class="q-my-none q-pl-lg">
                <li>銷售通路：1網路投保 2業務員 3保經、保代 4電話行銷 5機場櫃檯</li>
                <li>保單分類：1個人；2團體</li>
                <li>險種分類：1人壽保險；2傷害保險；3健康保險；4年金保險。</li>
                <li>
                    險種：01一般；02特定；03投資型；04日額型；05實支實付型；06日額或實支實付擇一型；07手術型；08重大疾病；09帳戶型；10長期看護型；11喪失工作能力；12防癌；13旅平險；14微型；15微型實支實付；16小額終老保險；17失能扶助保險；18登山綜合保險；19定期人壽保險(不含一年期)；20海域活動綜合保險；21一年期
                </li>
                <li>繳別：1躉繳；2年繳；3半年繳；4季繳；5月繳；6彈性繳；9繳費期滿</li>
                <li>
                    保單狀況：收件：01有效；06未承保取消件；07契約註銷；11滿期(契約到期)；12鍵值欄位通報錯誤終止；15通報更正；50一○七條/一○七條之一承保資料；51一○七條理賠資料（未滿14足歲之未成年人）；52一○七條/一○七條之一理賠資料（精神障礙或其他心智缺陷/受監護宣告尚未撤銷）。承保：01有效；02增額；03減額；04展期；05繳清；06契約撤銷；07停效；10解除契約；11滿期(契約到期)；12鍵值欄位通報錯誤終止；20終止1：由要保人提出終止契約效力；21終止2：主被保險人死亡，其他被保險人附同時終止或完全失能或理賠給付後終止附約；30被保險人因自然死身故；31被保險人因意外身故；32被保險人因其他原因故；50一○七條/一○七條之一承保資料；51一○七條理賠資料（未滿14足歲之未成年人）；52一○七條/一○七條之一理賠資料（精神障礙或其他心智缺陷/受監護宣告尚未撤銷）。
                </li>
                <li>保障及保費彙整欄位，金額依頁面上的筆數加總，含本公司及產、壽險通報資料。</li>
                <li>即時捉取公會資料：輸入身份證字號∕統一證號，按F8即時捉取公會資料鈕。</li>
            </ol>
        </q-card>

        <CxlModal
            v-model="showAsyncConfirmation"
            title="確認提示"
            cancelText="否"
            confirmText="是"
            @cancel="closeAsyncConfirmation"
            @confirm="confirmAsync"
        >
            <p class="q-my-none">{{ asyncConfirmationMessage }}</p>
        </CxlModal>

        <CxlModal
            v-model="showDetail"
            title="通報資料明細"
            size="lg"
            cancelText="關閉"
            content-scroll
            @cancel="closeDetail"
        >
            <!-- TODO: PENDING_CONVERSION - AFY10100ShowDetail -->
            <!-- <AFY10100ShowDetail v-bind="detailParams" /> -->
        </CxlModal>
    </div>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, onMounted, reactive, ref } from "vue";
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
import navCollection from "@/service/NavCollection.js";
import afy10100Service from "@/service/AFY10100Service.js";

const $cathayAxios = inject("$cathayAxios");
const $notify = inject("$notify");
const $route = useRoute();
const rootPath = { label: "首頁", url: "/" };

const BENEFIT_FIELDS = [
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
    { key: "PAY_AMT13", label: "重大燒燙傷" },
    { key: "PAY_AMT14", label: "癌症療養" },
    { key: "PAY_AMT15", label: "出院療養" },
    { key: "PAY_AMT16", label: "喪失工作能力" },
    { key: "PAY_AMT17", label: "喪葬費用" },
    { key: "PAY_AMT18", label: "銜接原醫療限額之自負額" },
    { key: "PAY_AMT19", label: "分期給付" },
];

const PREMIUM_FIELDS = [
    { key: "YEAR_PREM", label: "年繳保費" },
    { key: "ONCE_PREM", label: "躉繳保費" },
    { key: "FLEX_PREM", label: "超額(彈性)保險費" },
];

const EDIT_READONLY_FIELDS = [
    { key: "INSR_TYPE", label: "通報方式" },
    { key: "CMNY_CODE", label: "公司別" },
    { key: "I_ID", label: "被保人ID" },
    { key: "I_BIRTHDAY", label: "被保人生日" },
    { key: "POLICY_NO", label: "保單號碼" },
    { key: "POLICY_CAT", label: "保單分類" },
    { key: "POLICY_DUTY", label: "險種分類" },
    { key: "PROD_KIND", label: "險種" },
    { key: "STATUS", label: "保單狀況" },
    { key: "LST_CHG_DATE", label: "保單狀況生效日期(受理理賠日、身故日)" },
    { key: "MAIN_POLICY_NO", label: "主約保單號碼" },
    { key: "ISSUE_DATE", label: "契約生效日" },
    { key: "ISSUE_TIME", label: "契約生效時分" },
    { key: "LPS_DATE", label: "契約滿期日" },
    { key: "LPS_TIME", label: "契約滿期時分" },
    { key: "SIGN_DATE", label: "要保書填寫日" },
    { key: "PREM", label: "保費" },
    { key: "PAY_FREQ", label: "保費繳別" },
    { key: "PAY_PERIOD", label: "保費繳費年期" },
    { key: "LST_CHG_TIME", label: "保單狀況生效時分" },
    { key: "UPDATE_TIME_DISPLAY", label: "資料寫入時間" },
    { key: "SER_NO", label: "公會取回序號" },
];

const EDIT_REQUEST_KEYS = [
    "TBL_NAME",
    ...EDIT_READONLY_FIELDS.map(({ key }) => key).filter(
        (key) => key !== "UPDATE_TIME_DISPLAY",
    ),
    ...BENEFIT_FIELDS.map(({ key }) => key),
    "BROKTYPE",
    "A_NAME",
    "A_ID",
    "A_BIRTHDAY",
    "RELATION",
    "UPDATE_TIME",
    "I_GENDER",
    "PAY_TYPE",
    "OIU_IND",
    "SALE_CHNL",
    "PROD_CODE",
];

const DETAIL_PARAMETER_KEYS = [
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
    ...BENEFIT_FIELDS.map(({ key }) => key),
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

const roleOptions = [
    { label: "被保人", value: "I" },
    { label: "要保人", value: "A" },
];

const statusOptions = [
    { label: "有效", value: "Y" },
    { label: "無效", value: "N" },
    { label: "全部", value: "A" },
];

const genderOptions = [
    { label: "男", value: "1" },
    { label: "女", value: "2" },
];

const payTypeOptions = [
    { label: "無", value: "0" },
    { label: "公費", value: "1" },
    { label: "自費", value: "2" },
];

const numberFormatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
});

/**
 * 將金額格式化為千分位顯示。
 *
 * @param {string|number|null|undefined} value - 原始金額
 * @returns {string|number} 格式化後的金額
 */
const formatNumber = (value) => {
    if (value === null || value === undefined || value === "") {
        return "";
    }

    const number = Number(value);
    return Number.isNaN(number) ? value : numberFormatter.format(number);
};

const RESULT_COLUMNS = [
    {
        name: "index",
        label: "序號",
        field: "_sourceIndex",
        align: "center",
        format: (value) => value + 1,
    },
    {
        name: "insrType",
        label: "通報方式",
        field: "INSR_TYPE",
        align: "left",
        sortable: true,
    },
    {
        name: "company",
        label: "公司別",
        field: "CMNY_CODE",
        align: "left",
        sortable: true,
        format: (value, row) => row.COMPANY_NAME ?? value,
    },
    {
        name: "policyNo",
        label: "保單號碼",
        field: "POLICY_NO",
        align: "center",
        sortable: true,
    },
    { name: "saleChnl", label: "銷售通路", field: "SALE_CHNL", align: "left" },
    { name: "prodCode", label: "商品代碼", field: "PROD_CODE", align: "left" },
    { name: "policyCat", label: "保單分類", field: "POLICY_CAT", align: "left" },
    {
        name: "policyDuty",
        label: "險種分類",
        field: "POLICY_DUTY",
        align: "left",
    },
    {
        name: "prodKind",
        label: "險種",
        field: "PROD_KIND",
        align: "left",
        sortable: true,
    },
    { name: "status", label: "保單狀況", field: "STATUS", align: "left" },
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
    { name: "applicantName", label: "要保人姓名", field: "A_NAME", align: "left" },
    {
        name: "updateTime",
        label: "通報時間",
        field: "UPDATE_TIME",
        align: "center",
    },
];

const validationSchema = object({
    inputId: string().required("身份證字號/統一編號：不得為空值"),
});

const queryForm = useForm({
    validationSchema,
    initialValues: {
        inputId: "",
    },
    validateOnMount: false,
});
const { errors, setValues, validate } = queryForm;
const { value: inputId } = useField("inputId", undefined, { form: queryForm });

const role = ref("I");
const status = ref("Y");
const isReturnChecked = ref("");
const showReturnOption = ref(false);
const isAllow = ref(false);
const dataMap = ref({});
const resultList = ref([]);
const insrMap = ref({});
const oiuIndDesc = ref({});
const saleChnlDesc = ref({});
const selectedRows = ref([]);
const showAsyncConfirmation = ref(false);
const asyncConfirmationMessage = ref("");
const showDetail = ref(false);
const detailParams = ref({});
const tablePagination = ref({
    page: 1,
    rowsPerPage: 0,
});

/**
 * 建立編輯資料的固定欄位結構。
 *
 * @returns {Record<string, string>} 空白編輯資料
 */
const createEditRecord = () =>
    Object.fromEntries(
        [
            ...EDIT_REQUEST_KEYS,
            "UPDATE_TIME_DISPLAY",
            "OIU_IND_DESC",
            "SALE_CHNL_DESC",
        ].map((key) => [key, ""]),
    );

const editRecord = reactive(createEditRecord());

/**
 * 將陣列依指定長度切分為多列。
 *
 * @param {Array} items - 原始資料
 * @param {number} size - 每列資料筆數
 * @returns {Array[]} 切分後的資料列
 */
const chunk = (items, size) => {
    const rows = [];
    for (let index = 0; index < items.length; index += size) {
        rows.push(items.slice(index, index + size));
    }
    return rows;
};

const benefitSummaryRows = computed(() => {
    const items = BENEFIT_FIELDS.map(({ key, label }) => ({
        code: key,
        label,
        total: dataMap.value[`${key}_Tot`],
        sameTradeTotal: dataMap.value[`${key}_TotSame`],
        received: dataMap.value[`${key}_Rr`],
        underwritten: dataMap.value[`${key}_LN`],
    }));

    while (items.length % 3 !== 0) {
        items.push({
            code: `EMPTY_${items.length}`,
            label: "",
            total: "",
            sameTradeTotal: "",
            received: "",
            underwritten: "",
        });
    }

    return chunk(items, 3);
});

const premiumSummary = computed(() =>
    PREMIUM_FIELDS.map(({ key, label }) => ({
        code: key,
        label,
        total: dataMap.value[`${key}_Tot`],
        received: dataMap.value[`${key}_Rr`],
        underwritten: dataMap.value[`${key}_LN`],
    })),
);

const readonlyEditRows = computed(() => {
    const fields = EDIT_READONLY_FIELDS.map(({ key, label }) => ({
        key,
        label,
        value: editRecord[key],
    }));

    while (fields.length % 5 !== 0) {
        fields.push({
            key: `EMPTY_READONLY_${fields.length}`,
            label: "",
            value: "",
        });
    }

    return chunk(fields, 5);
});

const benefitEditRows = computed(() => {
    const fields = BENEFIT_FIELDS.map(({ key, label }) => ({
        key,
        label,
        placeholder: false,
    }));

    while (fields.length % 5 !== 0) {
        fields.push({
            key: `EMPTY_EDIT_${fields.length}`,
            label: "",
            placeholder: true,
        });
    }

    return chunk(fields, 5);
});

/**
 * 建立明細表格列的唯一鍵值。
 *
 * @param {Record<string, unknown>} row - 明細資料
 * @param {number} index - 原始資料索引
 * @returns {string} 表格列鍵值
 */
const getRowKey = (row, index) =>
    JSON.stringify([
        row.TBL_NAME,
        row.SER_NO,
        row.POLICY_NO,
        row.UPDATE_TIME,
        row.INSR_TYPE,
        index,
    ]);

const resultTableRows = computed(() =>
    resultList.value.map((row, index) => ({
        ...row,
        _rowKey: getRowKey(row, index),
        _sourceIndex: index,
    })),
);

const hasSelectedRecord = computed(() => selectedRows.value.length > 0);

/**
 * 顯示後端回傳的頁面通知。
 *
 * @param {string[]} notifications - 通知訊息
 * @returns {void}
 */
const notifyMessages = (notifications = []) => {
    notifications.forEach((message) => $notify.info(message));
};

/**
 * 清除選取列與編輯資料。
 *
 * @returns {void}
 */
const clearSelection = () => {
    selectedRows.value = [];
    Object.assign(editRecord, createEditRecord());
};

/**
 * 套用後端回傳的完整頁面資料。
 *
 * @param {Record<string, any>} pageData - 頁面回應資料
 * @returns {void}
 */
const applyPageData = (pageData) => {
    setValues({
        inputId: pageData.inputId ?? "",
    });
    role.value = pageData.role ?? "I";
    status.value = pageData.status ?? "Y";
    isReturnChecked.value = "";
    showReturnOption.value = Boolean(pageData.isReturn);
    isAllow.value = Boolean(pageData.isAllow);
    dataMap.value = pageData.dataMap ?? {};
    resultList.value = pageData.resultList ?? [];
    insrMap.value = pageData.insrMap ?? {};
    oiuIndDesc.value = pageData.oiuIndDesc ?? {};
    saleChnlDesc.value = pageData.saleChnlDesc ?? {};
    clearSelection();
    notifyMessages(pageData.notifications);
};

/**
 * 將選取明細映射至編輯區。
 *
 * @param {Record<string, any>[]} rows - CxlTable 選取資料
 * @returns {void}
 */
const updateSelectedRows = (rows) => {
    selectedRows.value = rows;
    const row = rows[0];
    if (!row) {
        Object.assign(editRecord, createEditRecord());
        return;
    }

    const values = Object.fromEntries(
        EDIT_REQUEST_KEYS.map((key) => [key, row[key] ?? ""]),
    );
    Object.assign(editRecord, values, {
        UPDATE_TIME_DISPLAY: row.INPUT_TIME ?? "",
        OIU_IND_DESC: oiuIndDesc.value[row.OIU_IND] ?? "",
        SALE_CHNL_DESC: saleChnlDesc.value[row.SALE_CHNL] ?? "",
    });

    // TODO: UNKNOWN_SYNTAX - parseEUDC();
};

/**
 * 建立查詢、修改或刪除所需的請求資料。
 *
 * @returns {Record<string, any>} API 請求資料
 */
const buildFormPayload = () => {
    const payload = {
        inputId: inputId.value,
        role: role.value,
        status: status.value,
        ...Object.fromEntries(EDIT_REQUEST_KEYS.map((key) => [key, editRecord[key]])),
    };

    if (showReturnOption.value && isReturnChecked.value) {
        payload.IS_RETURN = isReturnChecked.value;
    }
    if (selectedRows.value[0]) {
        payload.item = selectedRows.value[0]._sourceIndex;
    }

    return payload;
};

/**
 * 呼叫指定 AFY10100 操作並更新頁面資料。
 *
 * @param {string} endpoint - API endpoint
 * @returns {Promise<void>}
 */
const executeAction = async (endpoint) => {
    const response = await $cathayAxios.post(endpoint, buildFormPayload());
    if (response.returnCode !== 0) {
        return;
    }
    applyPageData(response.data);
};

/**
 * 查詢公會通報資料。
 *
 * @returns {Promise<void>}
 */
const doQuery = () => executeAction(afy10100Service.query);

/**
 * 修改選取的公會通報資料。
 *
 * @returns {Promise<void>}
 */
const doEdit = () => executeAction(afy10100Service.edit);

/**
 * 刪除選取的公會通報資料。
 *
 * @returns {Promise<void>}
 */
const doDelete = () => executeAction(afy10100Service.delete);

/**
 * 即時取回公會通報資料。
 *
 * @returns {Promise<void>}
 */
const doAsync = () => executeAction(afy10100Service.async);

/**
 * 驗證身分證號後執行即時取回。
 *
 * @returns {Promise<void>}
 */
const doAsyncCheck = async () => {
    const { valid } = await validate();
    if (!valid) {
        return;
    }

    const response = await $cathayAxios.post(afy10100Service.asyncCheckId, {
        inputId: inputId.value,
    });
    if (response.returnCode !== 0) {
        return;
    }

    if (response.data.isIdError === "Y") {
        asyncConfirmationMessage.value = `輸入值 ${inputId.value} 不符身份證/統一證號檢核規則，請確認，是否要繼續作業?`;
        showAsyncConfirmation.value = true;
        return;
    }

    await doAsync();
};

/**
 * 關閉即時取回確認視窗。
 *
 * @returns {void}
 */
const closeAsyncConfirmation = () => {
    showAsyncConfirmation.value = false;
};

/**
 * 確認略過證號檢核並即時取回資料。
 *
 * @returns {Promise<void>}
 */
const confirmAsync = async () => {
    closeAsyncConfirmation();
    await doAsync();
};

/**
 * 開啟通報資料明細視窗。
 *
 * @param {Record<string, any>} row - 選取的明細資料
 * @returns {void}
 */
const openDetail = (row) => {
    detailParams.value = Object.fromEntries(
        DETAIL_PARAMETER_KEYS.map((key) => [key, row[key] ?? ""]),
    );
    showDetail.value = true;
};

/**
 * 關閉通報資料明細視窗。
 *
 * @returns {void}
 */
const closeDetail = () => {
    showDetail.value = false;
};

/**
 * 處理頁面功能鍵操作。
 *
 * @param {KeyboardEvent} event - 鍵盤事件
 * @returns {void}
 */
const handleHotKey = (event) => {
    const actions = {
        F2: doQuery,
        F8: isAllow.value ? doAsyncCheck : null,
        F9: hasSelectedRecord.value ? doEdit : null,
        F10: hasSelectedRecord.value ? doDelete : null,
    };
    const action = actions[event.key];
    if (!action) {
        return;
    }

    event.preventDefault();
    action();
};

/**
 * 載入 AFY10100 初始頁面資料。
 *
 * @returns {Promise<void>}
 */
const loadPageData = async () => {
    // TODO: OVER_APPROXIMATION - 待複查 prompt 端點回傳欄位是否與原伺服器注入資料完全一致。
    const response = await $cathayAxios.post(afy10100Service.prompt, {});
    if (response.returnCode !== 0) {
        return;
    }
    applyPageData(response.data);
};

onMounted(async () => {
    window.addEventListener("keydown", handleHotKey);
    await loadPageData();
});

onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleHotKey);
});
</script>
