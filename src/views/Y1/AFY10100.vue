<template>
    <div class="afy10100 q-pa-sm q-gutter-sm">
        <q-toolbar>
            <q-toolbar-title>● 公會通報查詢</q-toolbar-title>
            <q-space />
            <span>畫面編號：AFY10100</span>
        </q-toolbar>

        <q-card flat bordered>
            <q-card-section class="text-subtitle1">公會通報查詢</q-card-section>
            <q-card-section class="afy10100__query-grid">
                <q-input
                    v-model="inputId"
                    label="身份證字號/統一編號"
                    :error="!!errors.inputId"
                    :error-message="errors.inputId"
                    dense
                    outlined
                />
                <q-field v-if="canReturn" dense borderless>
                    <template #control>
                        <q-option-group
                            v-model="returnSelection"
                            :options="RETURN_OPTIONS"
                            type="checkbox"
                            dense
                            inline
                        />
                    </template>
                </q-field>
                <q-select
                    v-model="role"
                    label="契約角色"
                    :options="ROLE_OPTIONS"
                    emit-value
                    map-options
                    dense
                    outlined
                />
                <q-select
                    v-model="status"
                    label="保單效力"
                    :options="STATUS_OPTIONS"
                    emit-value
                    map-options
                    dense
                    outlined
                />
                <q-btn
                    label="F2查詢"
                    color="primary"
                    dense
                    filled
                    unelevated
                    @click="query"
                />
            </q-card-section>
            <q-card-section class="afy10100__query-grid">
                <q-input :model-value="summary.NAME" label="姓名" readonly dense outlined />
                <q-input :model-value="summary.BIRTHDAY" label="生日" readonly dense outlined />
                <q-input
                    :model-value="summary.LAST_UPDATE_TIME"
                    label="公會資料取回日期"
                    readonly
                    dense
                    outlined
                />
            </q-card-section>
        </q-card>

        <q-card flat bordered>
            <q-card-section class="text-subtitle1">保障項目彙整</q-card-section>
            <q-card-section class="afy10100__table-scroll">
                <q-markup-table separator="cell" dense flat bordered>
                    <thead>
                        <tr>
                            <template v-for="group in COVERAGE_GROUPS" :key="group">
                                <th class="tbBlue2">項目</th>
                                <th class="tbBlue">合計</th>
                                <th class="tbBlue">同業合計</th>
                                <th class="tbBlue">收件</th>
                                <th class="tbBlue">承保</th>
                            </template>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in COVERAGE_ROWS" :key="row.key">
                            <template v-for="item in row.items" :key="item.key">
                                <td class="tbBlue2">{{ item.label }}</td>
                                <td class="tbYellow2 text-right">{{ formatAmount(summary[`${item.key}_Tot`]) }}</td>
                                <td class="tbYellow2 text-right">{{ formatAmount(summary[`${item.key}_TotSame`]) }}</td>
                                <td class="tbYellow2 text-right">{{ formatAmount(summary[`${item.key}_Rr`]) }}</td>
                                <td class="tbYellow2 text-right">{{ formatAmount(summary[`${item.key}_LN`]) }}</td>
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
                            <template v-for="item in PREMIUM_ITEMS" :key="item.key">
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
                            <template v-for="item in PREMIUM_ITEMS" :key="item.key">
                                <td class="tbBlue2">{{ item.label }}</td>
                                <td class="tbYellow2 text-right">{{ formatAmount(summary[`${item.key}_Tot`]) }}</td>
                                <td class="tbYellow2 text-right">{{ formatAmount(summary[`${item.key}_Rr`]) }}</td>
                                <td class="tbYellow2 text-right">{{ formatAmount(summary[`${item.key}_LN`]) }}</td>
                            </template>
                            <td class="tbYellow2">{{ summary.UPDATE_ID }}</td>
                        </tr>
                    </tbody>
                </q-markup-table>
            </q-card-section>
        </q-card>

        <q-card v-if="selectedRows.length" flat bordered>
            <q-card-section class="text-subtitle1">資料編輯區</q-card-section>
            <q-card-section class="afy10100__field-grid">
                <div v-for="field in DISPLAY_FIELDS" :key="field.name" class="afy10100__field">
                    <div class="afy10100__field-label tbYellow">{{ field.label }}</div>
                    <div class="afy10100__field-value tbYellow2">{{ editRecord[field.name] }}</div>
                </div>
            </q-card-section>
            <q-card-section class="afy10100__field-grid">
                <q-input
                    v-for="field in EDITABLE_FIELDS"
                    :key="field.name"
                    v-model="editRecord[field.name]"
                    :label="field.label"
                    dense
                    outlined
                />
                <q-select
                    v-model="editRecord.I_GENDER"
                    label="被保險人性別"
                    :options="GENDER_OPTIONS"
                    emit-value
                    map-options
                    dense
                    outlined
                />
                <q-select
                    v-model="editRecord.PAY_TYPE"
                    label="公、自費件"
                    :options="PAY_TYPE_OPTIONS"
                    emit-value
                    map-options
                    dense
                    outlined
                />
                <q-input :model-value="editRecord.OIU_IND_DESC" label="來源別" readonly dense outlined />
                <q-input :model-value="editRecord.SALE_CHNL_DESC" label="銷售通路" readonly dense outlined />
                <q-input :model-value="editRecord.PROD_CODE" label="商品代碼" readonly dense outlined />
                <q-input :model-value="editRecord.SER_NO" label="公會取回序號" readonly dense outlined />
            </q-card-section>
            <q-card-actions align="center">
                <q-btn label="F9修改" color="primary" dense filled unelevated @click="edit" />
                <q-btn label="F10刪除" color="primary" dense outlined unelevated @click="remove" />
                <q-btn label="取消" color="primary" dense outlined unelevated @click="clearSelection" />
            </q-card-actions>
        </q-card>

        <q-card flat bordered>
            <q-card-section class="text-subtitle1">新制通報資料明細</q-card-section>
            <q-card-section>
                <q-table
                    v-model:selected="selectedRows"
                    :columns="RESULT_COLUMNS"
                    :rows="resultRows"
                    row-key="_rowKey"
                    selection="single"
                    separator="cell"
                    dense
                    flat
                    bordered
                    :pagination="{ rowsPerPage: 0 }"
                    hide-bottom
                    @update:selected="selectRows"
                    @cell-click="openDetailCell"
                />
            </q-card-section>
            <q-card-actions v-if="canAsync" align="center">
                <q-btn
                    label="F8即時取回公會資料"
                    color="primary"
                    dense
                    filled
                    unelevated
                    @click="checkAsync"
                />
            </q-card-actions>
        </q-card>

        <q-card flat bordered>
            <q-card-section>
                <ol class="afy10100__notes">
                    <li>銷售通路：1網路投保；2業務員；3保經、保代；4電話行銷；5機場櫃檯。</li>
                    <li>保單分類：1個人；2團體。</li>
                    <li>險種分類：1人壽保險；2傷害保險；3健康保險；4年金保險。</li>
                    <li>險種：01一般；02特定；03投資型；04日額型；05實支實付型；06日額或實支實付擇一型；07手術型；08重大疾病；09帳戶型；10長期看護型；11喪失工作能力；12防癌；13旅平險；14微型；15微型實支實付；16小額終老保險；17失能扶助保險；18登山綜合保險；19定期人壽保險（不含一年期）；20海域活動綜合保險；21一年期。</li>
                    <li>繳別：1躉繳；2年繳；3半年繳；4季繳；5月繳；6彈性繳；9繳費期滿。</li>
                    <li>保單狀況：收件：01有效；06未承保取消件；07契約註銷；11滿期(契約到期)；12鍵值欄位通報錯誤終止；15通報更正；50一○七條/一○七條之一承保資料；51一○七條理賠資料（未滿14足歲之未成年人）；52一○七條/一○七條之一理賠資料（精神障礙或其他心智缺陷/受監護宣告尚未撤銷）。承保：01有效；02增額；03減額；04展期；05繳清；06契約撤銷；07停效；10解除契約；11滿期(契約到期)；12鍵值欄位通報錯誤終止；20終止1：由要保人提出終止契約效力；21終止2：主被保險人死亡，其他被保險人附同時終止或完全失能或理賠給付後終止附約；30被保險人因自然死身故；31被保險人因意外身故；32被保險人因其他原因故；50一○七條/一○七條之一承保資料；51一○七條理賠資料（未滿14足歲之未成年人）；52一○七條/一○七條之一理賠資料（精神障礙或其他心智缺陷/受監護宣告尚未撤銷）。</li>
                    <li>保障及保費彙整欄位，金額依頁面上的筆數加總，含本公司及產、壽險通報資料。</li>
                    <li>即時捉取公會資料：輸入身份證字號／統一證號，按 F8 即時捉取公會資料鈕。</li>
                </ol>
            </q-card-section>
        </q-card>

        <q-dialog v-model="showInvalidIdDialog">
            <q-card>
                <q-card-section>{{ invalidIdMessage }}</q-card-section>
                <q-card-actions align="right">
                    <q-btn label="取消" color="primary" dense outlined unelevated v-close-popup />
                    <q-btn label="繼續作業" color="primary" dense filled unelevated @click="continueAsync" />
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
import { computed, inject, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import { object, string } from 'yup'

const $cathayAxios = inject('$cathayAxios')

const formatAmount = (value) => {
    if (value === null || value === undefined || value === '') {
        return ''
    }
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)
}

const RETURN_OPTIONS = [{ label: '同步更新公會回檔狀態', value: 'Y' }]
const ROLE_OPTIONS = [
    { label: '被保人', value: 'I' },
    { label: '要保人', value: 'A' },
]
const STATUS_OPTIONS = [
    { label: '有效', value: 'Y' },
    { label: '無效', value: 'N' },
    { label: '全部', value: 'A' },
]
const GENDER_OPTIONS = [
    { label: '男', value: '1' },
    { label: '女', value: '2' },
]
const PAY_TYPE_OPTIONS = [
    { label: '無', value: '0' },
    { label: '公費', value: '1' },
    { label: '自費', value: '2' },
]
const COVERAGE_ITEMS = [
    { key: 'PAY_AMT1', label: '身故' },
    { key: 'PAY_AMT2', label: '完全失能或最高級失能' },
    { key: 'PAY_AMT3', label: '失能扶助金' },
    { key: 'PAY_AMT4', label: '特定事故' },
    { key: 'PAY_AMT5', label: '初次罹患' },
    { key: 'PAY_AMT6', label: '醫療限額' },
    { key: 'PAY_AMT7', label: '醫療限額自負' },
    { key: 'PAY_AMT8', label: '醫療日額' },
    { key: 'PAY_AMT9', label: '住院手術' },
    { key: 'PAY_AMT10', label: '門診手術' },
    { key: 'PAY_AMT11', label: '門診' },
    { key: 'PAY_AMT12', label: '重大疾/傷病' },
    { key: 'PAY_AMT13', label: '重大傷燙傷' },
    { key: 'PAY_AMT14', label: '癌症療養' },
    { key: 'PAY_AMT15', label: '出院療養' },
    { key: 'PAY_AMT16', label: '喪失工作能力' },
    { key: 'PAY_AMT17', label: '喪葬費用' },
    { key: 'PAY_AMT18', label: '銜接原醫療限額之自負額' },
    { key: 'PAY_AMT19', label: '分期給付' },
]
const PREMIUM_ITEMS = [
    { key: 'YEAR_PREM', label: '年繳保費' },
    { key: 'ONCE_PREM', label: '躉繳保費' },
    { key: 'FLEX_PREM', label: '超額(彈性)保險費' },
]
const COVERAGE_GROUPS = [1, 2, 3, 4]
const COVERAGE_ROWS = Array.from(
    { length: Math.ceil(COVERAGE_ITEMS.length / COVERAGE_GROUPS.length) },
    (_, rowIndex) => {
        const items = COVERAGE_ITEMS.slice(
            rowIndex * COVERAGE_GROUPS.length,
            (rowIndex + 1) * COVERAGE_GROUPS.length,
        )
        while (items.length < COVERAGE_GROUPS.length) {
            items.push({ key: `EMPTY_${rowIndex}_${items.length}`, label: '' })
        }
        return {
            key: items.map(({ key }) => key).join('|'),
            items,
        }
    },
)
const DISPLAY_FIELDS = [
    { name: 'INSR_TYPE', label: '通報方式' },
    { name: 'CMNY_CODE', label: '公司別' },
    { name: 'I_ID', label: '被保人ID' },
    { name: 'I_BIRTHDAY', label: '被保人生日' },
    { name: 'POLICY_NO', label: '保單號碼' },
    { name: 'POLICY_CAT', label: '保單分類' },
    { name: 'POLICY_DUTY', label: '險種分類' },
    { name: 'PROD_KIND', label: '險種' },
    { name: 'STATUS', label: '保單狀況' },
    { name: 'LST_CHG_DATE', label: '保單狀況生效日期(受理理賠日、身故日)' },
    { name: 'MAIN_POLICY_NO', label: '主約保單號碼' },
    { name: 'ISSUE_DATE', label: '契約生效日' },
    { name: 'ISSUE_TIME', label: '契約生效時分' },
    { name: 'LPS_DATE', label: '契約滿期日' },
    { name: 'LPS_TIME', label: '契約滿期時分' },
    { name: 'SIGN_DATE', label: '要保書填寫日' },
    { name: 'PREM', label: '保費' },
    { name: 'PAY_FREQ', label: '保費繳別' },
    { name: 'PAY_PERIOD', label: '保費繳費年期' },
    { name: 'LST_CHG_TIME', label: '保單狀況生效時分' },
    { name: 'INPUT_TIME', label: '資料寫入時間' },
]
const EDITABLE_FIELDS = [
    ...COVERAGE_ITEMS.map(({ key, label }) => ({ name: key, label })),
    { name: 'BROKTYPE', label: '保經代分類' },
    { name: 'A_NAME', label: '要保人姓名' },
    { name: 'A_ID', label: '要保人身分證號碼' },
    { name: 'A_BIRTHDAY', label: '要保人出生日期' },
    { name: 'RELATION', label: '要保人與被保險人關係' },
]
const REQUEST_FIELD_NAMES = [
    'TBL_NAME',
    ...DISPLAY_FIELDS.map(({ name }) => name).filter((name) => name !== 'INPUT_TIME'),
    'UPDATE_TIME',
    ...EDITABLE_FIELDS.map(({ name }) => name),
    'I_GENDER',
    'PAY_TYPE',
    'SER_NO',
]
const EDIT_RECORD_FIELD_NAMES = [
    ...REQUEST_FIELD_NAMES,
    'INPUT_TIME',
    'OIU_IND_DESC',
    'SALE_CHNL_DESC',
    'PROD_CODE',
]
const DETAIL_FIELD_NAMES = [
    'INSR_TYPE',
    'CMNY_CODE',
    'I_ID',
    'I_BIRTHDAY',
    'POLICY_NO',
    'POLICY_CAT',
    'POLICY_DUTY',
    'PROD_KIND',
    'STATUS',
    'LST_CHG_DATE',
    'MAIN_POLICY_NO',
    'ISSUE_DATE',
    'ISSUE_TIME',
    'LPS_DATE',
    'LPS_TIME',
    'SIGN_DATE',
    'PREM',
    'PAY_FREQ',
    'PAY_PERIOD',
    'LST_CHG_TIME',
    ...COVERAGE_ITEMS.map(({ key }) => key),
    'BROKTYPE',
    'A_NAME',
    'A_ID',
    'A_BIRTHDAY',
    'RELATION',
    'UPDATE_TIME',
    'SER_NO',
    'I_GENDER',
    'PAY_TYPE',
    'OIU_IND',
    'SALE_CHNL',
    'PROD_CODE',
]
const RESULT_COLUMNS = [
    { name: 'sequence', label: '序號', field: '_sequence', align: 'center' },
    { name: 'insrType', label: '通報方式', field: 'INSR_TYPE_DISPLAY', align: 'left', sortable: true, classes: 'text-primary cursor-pointer' },
    { name: 'companyName', label: '公司別', field: 'COMPANY_NAME', align: 'left', sortable: true },
    { name: 'policyNo', label: '保單號碼', field: 'POLICY_NO', align: 'center', sortable: true },
    { name: 'saleChnl', label: '銷售通路', field: 'SALE_CHNL', align: 'left' },
    { name: 'prodCode', label: '商品代碼', field: 'PROD_CODE', align: 'left' },
    { name: 'policyCat', label: '保單分類', field: 'POLICY_CAT', align: 'left' },
    { name: 'policyDuty', label: '險種分類', field: 'POLICY_DUTY', align: 'left' },
    { name: 'prodKind', label: '險種', field: 'PROD_KIND', align: 'left', sortable: true },
    { name: 'status', label: '保單狀況', field: 'STATUS', align: 'left' },
    { name: 'payAmt1', label: '身故保額', field: 'PAY_AMT1', align: 'right', format: formatAmount },
    { name: 'payAmt6', label: '醫療限額', field: 'PAY_AMT6', align: 'right', format: formatAmount },
    { name: 'payAmt8', label: '醫療日額', field: 'PAY_AMT8', align: 'right', format: formatAmount },
    { name: 'issueDate', label: '契約生效日', field: 'ISSUE_DATE', align: 'left', sortable: true },
    { name: 'lpsDate', label: '契約滿期日', field: 'LPS_DATE', align: 'left' },
    { name: 'applicantName', label: '要保人姓名', field: 'A_NAME', align: 'left' },
    { name: 'updateTime', label: '通報時間', field: 'UPDATE_TIME', align: 'left' },
]

const validationSchema = object({
    inputId: string().required('身份證字號/統一編號：不得為空值'),
})
const { errors, setValues, validate } = useForm({
    validationSchema,
    initialValues: {
        inputId: '',
    },
    validateOnMount: false,
})
const { value: inputId } = useField('inputId')

const role = ref('I')
const status = ref('Y')
const returnSelection = ref([])
const canReturn = ref(false)
const canAsync = ref(false)
const summary = reactive({})
const resultRows = ref([])
const selectedRows = ref([])
const editRecord = reactive(
    Object.fromEntries(EDIT_RECORD_FIELD_NAMES.map((name) => [name, ''])),
)
const insrMap = ref({})
const oiuIndDesc = ref({})
const saleChnlDesc = ref({})
const showInvalidIdDialog = ref(false)
const invalidIdValue = ref('')
const showDetail = ref(false)
const detailParams = ref({})

const invalidIdMessage = computed(
    () => `輸入值 ${invalidIdValue.value} 不符身份證/統一證號檢核規則，請確認，是否要繼續作業?`,
)

const createEmptyRecord = () =>
    Object.fromEntries(EDIT_RECORD_FIELD_NAMES.map((name) => [name, '']))

const normalizeRows = (rows) => {
    return rows.map((row, index) => ({
        ...row,
        _legacyIndex: index,
        _sequence: index + 1,
        _rowKey: [
            row.TBL_NAME,
            row.INSR_TYPE,
            row.CMNY_CODE,
            row.I_ID,
            row.POLICY_NO,
            row.SER_NO,
            row.UPDATE_TIME,
        ].join('|'),
        INSR_TYPE_DISPLAY: `${row.INSR_TYPE ?? ''} ${insrMap.value[row.INSR_TYPE] ?? ''}`.trim(),
        OIU_IND_DESC: oiuIndDesc.value[row.OIU_IND] ?? '',
        SALE_CHNL_DESC: saleChnlDesc.value[row.SALE_CHNL] ?? '',
    }))
}

const clearSelection = () => {
    selectedRows.value = []
    Object.assign(editRecord, createEmptyRecord())
}

const applyPageData = (data) => {
    if (!data || typeof data !== 'object' || !data.dataMap || !Array.isArray(data.resultList)) {
        throw new TypeError('AFY10100 response data is incomplete')
    }

    setValues({ inputId: data.inputId ?? '' })
    role.value = data.role ?? 'I'
    status.value = data.status ?? 'Y'
    returnSelection.value = data.IS_RETURN === 'Y' ? ['Y'] : []
    canReturn.value = Boolean(data.isReturn)
    canAsync.value = Boolean(data.isAllow)
    insrMap.value = data.INSRMAP ?? {}
    oiuIndDesc.value = data.oiuIndDesc ?? {}
    saleChnlDesc.value = data.saleChnlDesc ?? {}

    Object.keys(summary).forEach((key) => delete summary[key])
    Object.assign(summary, data.dataMap)
    resultRows.value = normalizeRows(data.resultList)
    clearSelection()
}

const buildRequest = () => {
    const request = {
        inputId: inputId.value,
        IS_RETURN: returnSelection.value.includes('Y') ? 'Y' : '',
        role: role.value,
        status: status.value,
        item: selectedRows.value[0]?._legacyIndex ?? '',
    }
    REQUEST_FIELD_NAMES.forEach((name) => {
        request[name] = editRecord[name]
    })
    return request
}

const postAction = async (action, request = buildRequest()) => {
    const response = await $cathayAxios.post(`afy10100/${action}`, request)
    if (response.returnCode !== 0) {
        return
    }
    applyPageData(response.data)
}

const fetchPrompt = async () => {
    const response = await $cathayAxios.post('afy10100/prompt', {})
    if (response.returnCode !== 0) {
        return
    }
    applyPageData(response.data)
}

const query = async () => {
    await postAction('query')
}

const edit = async () => {
    await postAction('edit')
}

const remove = async () => {
    await postAction('delete')
}

const checkAsync = async () => {
    const validation = await validate()
    if (!validation.valid) {
        return
    }

    const response = await $cathayAxios.post('afy10100/asynccheckid', {
        inputId: inputId.value,
    })
    if (response.returnCode !== 0) {
        return
    }
    if (response.data.isIdError === 'Y') {
        invalidIdValue.value = inputId.value
        showInvalidIdDialog.value = true
        return
    }
    await postAction('async')
}

const continueAsync = async () => {
    showInvalidIdDialog.value = false
    await postAction('async')
}

const selectRows = (rows) => {
    selectedRows.value = rows
    if (!rows.length) {
        Object.assign(editRecord, createEmptyRecord())
        return
    }

    const row = rows[0]
    EDIT_RECORD_FIELD_NAMES.forEach((name) => {
        editRecord[name] = row[name] ?? ''
    })

    // TODO: UNKNOWN_SYNTAX - parseEUDC();
}

const openDetailCell = (_, row, column) => {
    if (column.name !== 'insrType') {
        return
    }
    detailParams.value = Object.fromEntries(
        DETAIL_FIELD_NAMES.map((name) => [name, row[name] ?? '']),
    )
    showDetail.value = true
}

const handleHotKey = (event) => {
    const actions = {
        F2: query,
        F8: canAsync.value ? checkAsync : undefined,
        F9: selectedRows.value.length ? edit : undefined,
        F10: selectedRows.value.length ? remove : undefined,
    }
    const action = actions[event.key]
    if (!action) {
        return
    }
    event.preventDefault()
    action()
}

// TODO: OVER_APPROXIMATION - 待複查 inputId、isReturn、isAllow、role、status、dataMap、resultList 與代碼對照表是否皆須由 prompt API 取得
onMounted(() => {
    window.addEventListener('keydown', handleHotKey)
    fetchPrompt()
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleHotKey)
})
</script>

<style scoped lang="scss">
.afy10100 {
    min-width: 960px;
    background-color: #f0fbc6;
}

.afy10100__query-grid,
.afy10100__field-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(160px, 1fr));
    gap: 8px;
    align-items: start;
}

.afy10100__field {
    display: grid;
    grid-template-rows: auto minmax(32px, auto);
}

.afy10100__field-label,
.afy10100__field-value {
    padding: 6px;
    border: 1px solid #003366;
}

.afy10100__table-scroll {
    overflow-x: auto;
}

.afy10100__notes {
    margin: 0;
    padding-left: 24px;
}
</style>
