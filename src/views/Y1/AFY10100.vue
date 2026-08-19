<template>
    <div class="afy10100 q-pa-sm q-gutter-sm">
        <q-toolbar>
            <q-toolbar-title>● 公會通報查詢</q-toolbar-title>
            <q-space />
            <span>畫面編號：AFY10100</span>
        </q-toolbar>

        <q-card flat bordered>
            <q-card-section class="text-subtitle1">公會通報查詢</q-card-section>
            <q-card-section>
                <q-markup-table separator="cell" dense flat bordered>
                    <tbody>
                        <tr>
                            <td class="tbYellow">身份證字號/統一編號</td>
                            <td class="tbYellow2">
                                <q-input
                                    v-model="inputId"
                                    :error="!!errors.inputId"
                                    :error-message="errors.inputId"
                                    dense
                                    outlined
                                />
                                <q-checkbox
                                    v-if="showReturnOption"
                                    v-model="isReturnChecked"
                                    label="同步更新公會回檔狀態"
                                    true-value="Y"
                                    false-value=""
                                    dense
                                />
                            </td>
                            <td class="tbYellow">契約角色</td>
                            <td class="tbYellow2">
                                <q-select
                                    v-model="role"
                                    :options="roleOptions"
                                    option-label="label"
                                    option-value="value"
                                    emit-value
                                    map-options
                                    dense
                                    outlined
                                />
                            </td>
                            <td class="tbYellow">保單效力</td>
                            <td class="tbYellow2">
                                <q-select
                                    v-model="status"
                                    :options="statusOptions"
                                    option-label="label"
                                    option-value="value"
                                    emit-value
                                    map-options
                                    dense
                                    outlined
                                />
                            </td>
                            <td class="tbYellow2 text-center">
                                <q-btn
                                    label="F2查詢"
                                    color="primary"
                                    dense
                                    filled
                                    unelevated
                                    @click="doQuery"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="tbYellow">姓名</td>
                            <td class="tbYellow2">{{ dataMap.NAME }}</td>
                            <td class="tbYellow">生日</td>
                            <td class="tbYellow2">{{ dataMap.BIRTHDAY }}</td>
                            <td class="tbYellow">公會資料取回日期</td>
                            <td class="tbYellow2" colspan="2">{{ dataMap.LAST_UPDATE_TIME }}</td>
                        </tr>
                    </tbody>
                </q-markup-table>
            </q-card-section>
        </q-card>

        <q-card flat bordered>
            <q-card-section class="text-subtitle1">保障項目彙整</q-card-section>
            <q-card-section class="afy10100__table-scroll">
                <q-markup-table separator="cell" dense flat bordered>
                    <thead>
                        <tr>
                            <template v-for="group in 3" :key="`benefit-header-${group}`">
                                <th class="tbBlue2">項目</th>
                                <th class="tbBlue">合計</th>
                                <th class="tbBlue">同業合計</th>
                                <th class="tbBlue">收件</th>
                                <th class="tbBlue">承保</th>
                            </template>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in benefitSummaryRows" :key="row[0].code">
                            <template v-for="item in row" :key="item.code">
                                <td class="tbBlue2 text-center">{{ item.label }}</td>
                                <td class="tbYellow2 text-center">{{ formatNumber(item.total) }}</td>
                                <td class="tbYellow2 text-center">{{ formatNumber(item.sameTradeTotal) }}</td>
                                <td class="tbYellow2 text-center">{{ formatNumber(item.received) }}</td>
                                <td class="tbYellow2 text-center">{{ formatNumber(item.underwritten) }}</td>
                            </template>
                        </tr>
                    </tbody>
                </q-markup-table>
            </q-card-section>
        </q-card>

        <q-card flat bordered>
            <q-card-section class="text-subtitle1">保費資料彙整</q-card-section>
            <q-card-section class="afy10100__table-scroll">
                <q-markup-table separator="cell" dense flat bordered>
                    <thead>
                        <tr>
                            <template v-for="item in premiumSummary" :key="`${item.code}-header`">
                                <th class="tbBlue2">項目</th>
                                <th class="tbBlue">合計</th>
                                <th class="tbBlue">收件</th>
                                <th class="tbBlue">承保</th>
                            </template>
                            <th class="tbBlue">操作者</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <template v-for="item in premiumSummary" :key="item.code">
                                <td class="tbBlue2 text-center">{{ item.label }}</td>
                                <td class="tbYellow2 text-center">{{ formatNumber(item.total) }}</td>
                                <td class="tbYellow2 text-center">{{ formatNumber(item.received) }}</td>
                                <td class="tbYellow2 text-center">{{ formatNumber(item.underwritten) }}</td>
                            </template>
                            <td class="tbYellow2 text-center">{{ dataMap.UPDATE_ID }}</td>
                        </tr>
                    </tbody>
                </q-markup-table>
            </q-card-section>
        </q-card>

        <q-card v-if="selectedRecordKey" flat bordered>
            <q-card-section class="text-subtitle1">資料編輯區</q-card-section>
            <q-card-section class="afy10100__table-scroll">
                <q-markup-table separator="cell" dense flat bordered>
                    <tbody>
                        <tr v-for="row in readonlyEditRows" :key="row[0].key">
                            <template v-for="field in row" :key="field.key">
                                <td class="tbYellow text-center">{{ field.label }}</td>
                                <td class="tbYellow2 text-center">{{ field.value }}</td>
                            </template>
                        </tr>
                    </tbody>
                </q-markup-table>
            </q-card-section>

            <q-card-section class="afy10100__table-scroll">
                <q-markup-table separator="cell" dense flat bordered>
                    <tbody>
                        <tr v-for="row in benefitEditRows" :key="row[0].key">
                            <template v-for="field in row" :key="field.key">
                                <td class="tbYellow text-center">{{ field.label }}</td>
                                <td class="tbYellow2">
                                    <q-input
                                        v-if="!field.placeholder"
                                        v-model="editRecord[field.key]"
                                        dense
                                        outlined
                                    />
                                </td>
                            </template>
                        </tr>
                    </tbody>
                </q-markup-table>
            </q-card-section>

            <q-card-section class="afy10100__table-scroll">
                <q-markup-table separator="cell" dense flat bordered>
                    <tbody>
                        <tr>
                            <td class="tbYellow text-center">保經代分類</td>
                            <td class="tbYellow2">
                                <q-input v-model="editRecord.BROKTYPE" dense outlined />
                            </td>
                            <td class="tbYellow text-center">要保人姓名</td>
                            <td class="tbYellow2">
                                <q-input v-model="editRecord.A_NAME" dense outlined />
                            </td>
                            <td class="tbYellow text-center">要保人身分證號碼</td>
                            <td class="tbYellow2">
                                <q-input v-model="editRecord.A_ID" dense outlined />
                            </td>
                            <td class="tbYellow text-center">要保人出生日期</td>
                            <td class="tbYellow2">
                                <q-input v-model="editRecord.A_BIRTHDAY" dense outlined />
                            </td>
                            <td class="tbYellow text-center">要保人與被保險人關係</td>
                            <td class="tbYellow2">
                                <q-input v-model="editRecord.RELATION" dense outlined />
                            </td>
                        </tr>
                        <tr>
                            <td class="tbYellow text-center">被保險人性別</td>
                            <td class="tbYellow2">
                                <q-select
                                    v-model="editRecord.I_GENDER"
                                    :options="genderOptions"
                                    option-label="label"
                                    option-value="value"
                                    emit-value
                                    map-options
                                    dense
                                    outlined
                                />
                            </td>
                            <td class="tbYellow text-center">公、自費件</td>
                            <td class="tbYellow2">
                                <q-select
                                    v-model="editRecord.PAY_TYPE"
                                    :options="payTypeOptions"
                                    option-label="label"
                                    option-value="value"
                                    emit-value
                                    map-options
                                    dense
                                    outlined
                                />
                            </td>
                            <td class="tbYellow text-center">來源別</td>
                            <td class="tbYellow2 text-center">{{ editRecord.OIU_IND_DESC }}</td>
                            <td class="tbYellow text-center">銷售通路</td>
                            <td class="tbYellow2 text-center">{{ editRecord.SALE_CHNL_DESC }}</td>
                            <td class="tbYellow text-center">商品代碼</td>
                            <td class="tbYellow2 text-center">{{ editRecord.PROD_CODE }}</td>
                        </tr>
                    </tbody>
                </q-markup-table>
            </q-card-section>

            <q-card-actions align="center">
                <q-btn
                    label="F9修改"
                    color="primary"
                    dense
                    filled
                    unelevated
                    @click="doEdit"
                />
                <q-btn
                    label="F10刪除"
                    color="primary"
                    dense
                    filled
                    unelevated
                    @click="doDelete"
                />
                <q-btn
                    label="取消"
                    color="primary"
                    dense
                    outlined
                    unelevated
                    @click="clearSelection"
                />
            </q-card-actions>
        </q-card>

        <q-card flat bordered>
            <q-card-section class="text-subtitle1">新制通報資料明細</q-card-section>
            <q-card-section class="afy10100__table-scroll">
                <q-markup-table separator="cell" dense flat bordered>
                    <thead>
                        <tr>
                            <th class="tbBlue">序號</th>
                            <th class="tbBlue">選取</th>
                            <th class="tbBlue">
                                <q-btn
                                    :label="`通報方式${sortIndicator('INSR_TYPE')}`"
                                    dense
                                    flat
                                    no-caps
                                    @click="sortResults('INSR_TYPE')"
                                />
                            </th>
                            <th class="tbBlue">
                                <q-btn
                                    :label="`公司別${sortIndicator('CMNY_CODE')}`"
                                    dense
                                    flat
                                    no-caps
                                    @click="sortResults('CMNY_CODE')"
                                />
                            </th>
                            <th class="tbBlue">
                                <q-btn
                                    :label="`保單號碼${sortIndicator('POLICY_NO')}`"
                                    dense
                                    flat
                                    no-caps
                                    @click="sortResults('POLICY_NO')"
                                />
                            </th>
                            <th class="tbBlue">銷售通路</th>
                            <th class="tbBlue">商品代碼</th>
                            <th class="tbBlue">保單分類</th>
                            <th class="tbBlue">險種分類</th>
                            <th class="tbBlue">
                                <q-btn
                                    :label="`險種${sortIndicator('PROD_KIND')}`"
                                    dense
                                    flat
                                    no-caps
                                    @click="sortResults('PROD_KIND')"
                                />
                            </th>
                            <th class="tbBlue">保單狀況</th>
                            <th class="tbBlue">身故保額</th>
                            <th class="tbBlue">醫療限額</th>
                            <th class="tbBlue">醫療日額</th>
                            <th class="tbBlue">
                                <q-btn
                                    :label="`契約生效日${sortIndicator('ISSUE_DATE')}`"
                                    dense
                                    flat
                                    no-caps
                                    @click="sortResults('ISSUE_DATE')"
                                />
                            </th>
                            <th class="tbBlue">契約滿期日</th>
                            <th class="tbBlue">要保人姓名</th>
                            <th class="tbBlue">通報時間</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in sortedResultList" :key="getRowKey(row)">
                            <td class="tbYellow2 text-center">{{ getSourceIndex(row) + 1 }}</td>
                            <td class="tbYellow2 text-center">
                                <q-radio
                                    :model-value="selectedRecordKey"
                                    :val="getRowKey(row)"
                                    @update:model-value="selectItem(row)"
                                />
                            </td>
                            <td class="tbYellow2">
                                <a href="" @click.prevent="openDetail(row)">
                                    {{ row.INSR_TYPE }}&nbsp;{{ insrMap[row.INSR_TYPE] }}
                                </a>
                            </td>
                            <td class="tbYellow2">{{ row.COMPANY_NAME }}</td>
                            <td class="tbYellow2 text-center">{{ row.POLICY_NO }}</td>
                            <td class="tbYellow2">{{ row.SALE_CHNL }}</td>
                            <td class="tbYellow2">{{ row.PROD_CODE }}</td>
                            <td class="tbYellow2">{{ row.POLICY_CAT }}</td>
                            <td class="tbYellow2">{{ row.POLICY_DUTY }}</td>
                            <td class="tbYellow2">{{ row.PROD_KIND }}</td>
                            <td class="tbYellow2">{{ row.STATUS }}</td>
                            <td class="tbYellow2">{{ formatNumber(row.PAY_AMT1) }}</td>
                            <td class="tbYellow2">{{ formatNumber(row.PAY_AMT6) }}</td>
                            <td class="tbYellow2">{{ formatNumber(row.PAY_AMT8) }}</td>
                            <td class="tbYellow2">{{ row.ISSUE_DATE }}</td>
                            <td class="tbYellow2">{{ row.LPS_DATE }}</td>
                            <td class="tbYellow2">{{ row.A_NAME }}</td>
                            <td class="tbYellow2">{{ row.UPDATE_TIME }}</td>
                        </tr>
                        <tr v-if="isAllow">
                            <td class="tbYellow2 text-center" colspan="18">
                                <q-btn
                                    label="F8即時取回公會資料"
                                    color="primary"
                                    dense
                                    filled
                                    unelevated
                                    @click="doAsyncCheck"
                                />
                            </td>
                        </tr>
                    </tbody>
                </q-markup-table>
            </q-card-section>
        </q-card>

        <q-card flat bordered>
            <q-card-section>
                <ol class="afy10100__notes">
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
            </q-card-section>
        </q-card>

        <q-dialog v-model="showAsyncConfirmation">
            <q-card>
                <q-card-section>{{ asyncConfirmationMessage }}</q-card-section>
                <q-card-actions align="right">
                    <q-btn label="否" color="primary" dense outlined unelevated v-close-popup />
                    <q-btn
                        label="是"
                        color="primary"
                        dense
                        filled
                        unelevated
                        @click="confirmAsync"
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="showDetail" full-width>
            <q-card>
                <q-card-section class="scroll">
                    <!-- TODO: PENDING_CONVERSION - AFY10100ShowDetail -->
                    <!-- <AFY10100ShowDetail v-bind="detailParams" /> -->
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn label="關閉" color="primary" dense filled unelevated v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useQuasar } from "quasar";
import { useField, useForm } from "vee-validate";
import { object, string } from "yup";

const $cathayAxios = inject("$cathayAxios");
const $q = useQuasar();

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
    ...EDIT_READONLY_FIELDS.map(({ key }) => key).filter((key) => key !== "UPDATE_TIME_DISPLAY"),
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
const selectedRecordKey = ref("");
const selectedItemIndex = ref(null);
const showAsyncConfirmation = ref(false);
const asyncConfirmationMessage = ref("");
const showDetail = ref(false);
const detailParams = ref({});
const sortState = reactive({
    field: "",
    descending: false,
});

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
const numberFormatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
});

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

const getRowKey = (row) =>
    JSON.stringify([
        row.TBL_NAME,
        row.SER_NO,
        row.POLICY_NO,
        row.UPDATE_TIME,
        row.INSR_TYPE,
    ]);

const getSourceIndex = (row) => resultList.value.indexOf(row);

const sortedResultList = computed(() => {
    if (!sortState.field) {
        return resultList.value;
    }

    const sortedRows = [...resultList.value].sort((left, right) =>
        String(left[sortState.field] ?? "").localeCompare(
            String(right[sortState.field] ?? ""),
            "zh-Hant",
        ),
    );

    return sortState.descending ? sortedRows.reverse() : sortedRows;
});

const formatNumber = (value) => {
    if (value === null || value === undefined || value === "") {
        return "";
    }

    const number = Number(value);
    return Number.isNaN(number) ? value : numberFormatter.format(number);
};

const notifyMessages = (notifications = []) => {
    notifications.forEach((message) => $q.notify(message));
};

const clearSelection = () => {
    selectedRecordKey.value = "";
    selectedItemIndex.value = null;
    Object.assign(editRecord, createEditRecord());
};

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
    if (selectedItemIndex.value !== null) {
        payload.item = selectedItemIndex.value;
    }

    return payload;
};

const executeAction = async (action) => {
    const res = await $cathayAxios.post(`afy10100/${action}`, buildFormPayload());
    if (res.returnCode !== 0) {
        return;
    }
    applyPageData(res.data);
};

const doQuery = () => executeAction("query");
const doEdit = () => executeAction("edit");
const doDelete = () => executeAction("delete");
const doAsync = () => executeAction("async");

const doAsyncCheck = async () => {
    const { valid } = await validate();
    if (!valid) {
        return;
    }

    const res = await $cathayAxios.post("afy10100/asynccheckid", {
        inputId: inputId.value,
    });
    if (res.returnCode !== 0) {
        return;
    }

    if (res.data.isIdError === "Y") {
        asyncConfirmationMessage.value = `輸入值 ${inputId.value} 不符身份證/統一證號檢核規則，請確認，是否要繼續作業?`;
        showAsyncConfirmation.value = true;
        return;
    }

    await doAsync();
};

const confirmAsync = async () => {
    showAsyncConfirmation.value = false;
    await doAsync();
};

const selectItem = (row) => {
    selectedRecordKey.value = getRowKey(row);
    selectedItemIndex.value = getSourceIndex(row);

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

const openDetail = (row) => {
    detailParams.value = Object.fromEntries(
        DETAIL_PARAMETER_KEYS.map((key) => [key, row[key] ?? ""]),
    );
    showDetail.value = true;
};

const sortResults = (field) => {
    if (sortState.field === field) {
        sortState.descending = !sortState.descending;
        return;
    }

    sortState.field = field;
    sortState.descending = false;
};

const sortIndicator = (field) => {
    if (sortState.field !== field) {
        return "▼";
    }
    return sortState.descending ? "▼" : "▲";
};

const handleHotKey = (event) => {
    const actions = {
        F2: doQuery,
        F8: isAllow.value ? doAsyncCheck : null,
        F9: selectedRecordKey.value ? doEdit : null,
        F10: selectedRecordKey.value ? doDelete : null,
    };
    const action = actions[event.key];
    if (!action) {
        return;
    }

    event.preventDefault();
    action();
};

onMounted(async () => {
    window.addEventListener("keydown", handleHotKey);

    // TODO: OVER_APPROXIMATION - 待複查 inputId、role、status、isReturn、isAllow、dataMap、resultList、INSRMAP、oiuIndDesc、saleChnlDesc 是否皆須由 prompt 端點取得（原始來源為伺服器資料注入）
    const res = await $cathayAxios.post("afy10100/prompt", {});
    if (res.returnCode !== 0) {
        return;
    }
    applyPageData(res.data);
});

onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleHotKey);
});
</script>

<style scoped lang="scss">
.afy10100 {
    min-width: 0;

    &__table-scroll {
        overflow-x: auto;
    }

    &__notes {
        margin: 0;
        padding-left: 1.5rem;

        li + li {
            margin-top: 0.35rem;
        }
    }

    :deep(table) {
        min-width: max-content;
    }

    :deep(th),
    :deep(td) {
        white-space: normal;
        vertical-align: middle;
    }
}
</style>
