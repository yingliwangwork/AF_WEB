<template>
    <div class="dsa21000 q-pa-sm q-gutter-sm">
        <!-- TODO: UNKNOWN_SYNTAX - <fmt:setBundle basename="TextResource" /> -->
        <q-toolbar>
            <q-toolbar-title>● 核貸作業</q-toolbar-title>
            <q-space />
            <span>畫面編號：DSA21000</span>
        </q-toolbar>

        <q-card flat bordered>
            <q-card-section class="tbBox2">
                ● 簽件作業分頁畫面
            </q-card-section>

            <q-card-section>
                <q-markup-table separator="cell" dense flat bordered>
                    <tbody>
                        <tr>
                            <td class="dsa21000__label tbYellow">受理編號</td>
                            <td class="tbYellow2">
                                <q-input
                                    ref="applyIdInput"
                                    v-model="applyId"
                                    name="APPLY_ID"
                                    maxlength="11"
                                    :error="!!errors.applyId"
                                    :error-message="errors.applyId"
                                    dense
                                    outlined
                                />
                            </td>
                            <td class="dsa21000__action tbYellow2">
                                <q-btn
                                    label="查詢"
                                    color="primary"
                                    dense
                                    filled
                                    unelevated
                                    @click="onQuery"
                                />
                            </td>
                        </tr>
                    </tbody>
                </q-markup-table>
            </q-card-section>

            <template v-if="tabs.length">
                <q-tabs :model-value="activeTab" dense @update:model-value="onTabChange">
                    <q-tab
                        v-for="tab in tabs"
                        :key="tab.funcId"
                        :name="tab.funcId"
                        :label="tab.title"
                    />
                </q-tabs>

                <q-tab-panels v-model="activeTab" class="dsa21000__tab-panels">
                    <q-tab-panel
                        v-for="tab in tabs"
                        :key="tab.funcId"
                        :name="tab.funcId"
                        class="q-pa-none"
                    >
                        <template v-if="tab.funcId === 'DSA21001'">
                            <!-- TODO: PENDING_CONVERSION - DSA21001 -->
                            <!-- <DSA21001 :apply-id="tab.applyId" link-from="DSA21000" title-not-display="Y" /> -->
                        </template>
                        <template v-else-if="tab.funcId === 'DSA21002'">
                            <!-- TODO: PENDING_CONVERSION - DSA21002 -->
                            <!-- <DSA21002 :apply-id="tab.applyId" link-from="DSA21000" title-not-display="Y" :case-type="tab.caseType" /> -->
                        </template>
                        <template v-else-if="tab.funcId === 'DSA21003'">
                            <!-- TODO: PENDING_CONVERSION - DSA21003 -->
                            <!-- <DSA21003 :apply-id="tab.applyId" link-from="DSA21000" title-not-display="Y" /> -->
                        </template>
                        <template v-else-if="tab.funcId === 'DSA21009'">
                            <!-- TODO: PENDING_CONVERSION - DSA21009 -->
                            <!-- <DSA21009 :apply-id="tab.applyId" link-from="DSA21000" title-not-display="Y" /> -->
                        </template>
                        <template v-else-if="tab.funcId === 'DSA21005'">
                            <!-- TODO: PENDING_CONVERSION - DSA21005 -->
                            <!-- <DSA21005 :apply-id="tab.applyId" link-from="DSA21000" title-not-display="Y" /> -->
                        </template>
                        <template v-else-if="tab.funcId === 'DSA20200'">
                            <!-- TODO: PENDING_CONVERSION - DSA20200 -->
                            <!-- <DSA20200 :apply-id="tab.applyId" link-from="DSA21000" title-not-display="Y" type="A" :value="tab.applyId" /> -->
                        </template>
                        <template v-else-if="tab.funcId === 'DSA20901'">
                            <!-- TODO: PENDING_CONVERSION - DSA20901 -->
                            <!-- <DSA20901 :apply-id="tab.applyId" link-from="DSA21000" title-not-display="Y" /> -->
                        </template>
                        <template v-else-if="tab.funcId === 'DSA20902'">
                            <!-- TODO: PENDING_CONVERSION - DSA20902 -->
                            <!-- <DSA20902 :apply-id="tab.applyId" link-from="DSA21000" title-not-display="Y" /> -->
                        </template>
                        <template v-else-if="tab.funcId === 'DSA20600'">
                            <!-- TODO: PENDING_CONVERSION - DSA20600 -->
                            <!-- <DSA20600 :apply-id="tab.applyId" link-from="DSA21000" title-not-display="Y" /> -->
                        </template>
                        <template v-else-if="tab.funcId === 'DSA21006'">
                            <!-- TODO: PENDING_CONVERSION - DSA21006 -->
                            <!-- <DSA21006 :apply-id="tab.applyId" link-from="DSA21000" title-not-display="Y" /> -->
                        </template>
                        <template v-else-if="tab.funcId === 'DSA30500'">
                            <!-- TODO: PENDING_CONVERSION - DSA30500 -->
                            <!-- <DSA30500 :apply-id="tab.applyId" link-from="DSA21000" title-not-display="Y" /> -->
                        </template>
                        <template v-else-if="tab.funcId === 'DSA21007'">
                            <!-- TODO: PENDING_CONVERSION - DSA21007 -->
                            <!-- <DSA21007 :apply-id="tab.applyId" link-from="DSA21000" title-not-display="Y" /> -->
                        </template>
                        <template v-else-if="tab.funcId === 'DSA20410'">
                            <!-- TODO: PENDING_CONVERSION - DSA20410 -->
                            <!-- <DSA20410 :apply-id="tab.applyId" link-from="DSA21000" title-not-display="Y" /> -->
                        </template>
                        <template v-else-if="tab.funcId === 'DSA10900'">
                            <!-- TODO: PENDING_CONVERSION - DSA10900 -->
                            <!-- <DSA10900 :apply-id="tab.applyId" link-from="DSA21000" title-not-display="Y" /> -->
                        </template>
                        <template v-else-if="tab.funcId === 'DSA20800'">
                            <!-- TODO: PENDING_CONVERSION - DSA20800 -->
                            <!-- <DSA20800 :apply-id="tab.applyId" link-from="DSA21000" title-not-display="Y" /> -->
                        </template>
                        <template v-else-if="tab.funcId === 'DSA20701'">
                            <!-- TODO: PENDING_CONVERSION - DSA20701 -->
                            <!-- <DSA20701 :apply-id="tab.applyId" link-from="DSA21000" title-not-display="Y" /> -->
                        </template>
                        <template v-else-if="tab.funcId === 'DSA20500'">
                            <!-- TODO: PENDING_CONVERSION - DSA20500 -->
                            <!-- <DSA20500 :apply-id="tab.applyId" link-from="DSA21000" title-not-display="Y" /> -->
                        </template>
                        <template v-else-if="tab.funcId === 'DSA20301'">
                            <!-- TODO: PENDING_CONVERSION - DSA20301 -->
                            <!-- <DSA20301 :apply-id="tab.applyId" link-from="DSA21000" title-not-display="Y" /> -->
                        </template>
                        <template v-else-if="tab.funcId === 'DSH01400'">
                            <!-- TODO: PENDING_CONVERSION - DSH01400 -->
                            <!-- <DSH01400 :apply-id="tab.applyId" link-from="DSA21000" title-not-display="Y" :person-id="tab.personId" /> -->
                        </template>
                    </q-tab-panel>
                </q-tab-panels>
            </template>
        </q-card>

        <q-dialog v-model="showLeaveConfirmation" persistent>
            <q-card>
                <q-card-section>
                    模型回饋尚未修改，請確認是否已完成!
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn label="取消" color="primary" dense outlined unelevated @click="cancelTabChange" />
                    <q-btn label="確定" color="primary" dense filled unelevated @click="confirmTabChange" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="showControlConfirmation" persistent>
            <q-card>
                <q-card-section class="dsa21000__message">
                    {{ controlMessage }}
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn label="取消" color="primary" dense outlined unelevated v-close-popup />
                    <q-btn label="確定" color="primary" dense filled unelevated @click="openControlHistory" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="showControlHistory">
            <q-card class="dsa21000__control-dialog">
                <q-card-section class="scroll">
                    <!-- TODO: PENDING_CONVERSION - DSC83100 -->
                    <!-- <DSC83100 :loan-id="controlHistoryParams.loanId" control-type="U" control-source="2-8" /> -->
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn label="關閉" color="primary" dense filled unelevated v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup>
import { inject, nextTick, onMounted, ref } from "vue";
import { useField, useForm } from "vee-validate";
import { object, string } from "yup";
import { useRouter } from "vue-router";

const $cathayAxios = inject("$cathayAxios");
const router = useRouter();

const validationSchema = object({
    applyId: string().label("受理編號").required(),
});
const queryForm = useForm({
    validationSchema,
    initialValues: {
        applyId: "",
    },
    validateOnMount: false,
});
const { errors, validate, setValues } = queryForm;
const { value: applyId } = useField("applyId", undefined, { form: queryForm });

const applyIdInput = ref(null);
const tabs = ref([]);
const activeTab = ref(null);
const pendingTab = ref(null);
const showLeaveConfirmation = ref(false);
const dsa20902HasPendingFeedback = ref(false);
const showControlConfirmation = ref(false);
const controlMessage = ref("");
const showControlHistory = ref(false);
const controlHistoryParams = ref({
    loanId: "",
});

const normalizeTabs = (tabList) => tabList.map((tab) => ({
    funcId: tab.FUNC_ID,
    applyId: tab.APPLY_ID,
    personId: tab.PERSON_ID,
    caseType: tab.CASE_TYPE,
    title: tab.TITLE,
}));

const setActiveTab = (tabName) => {
    activeTab.value = tabName;
};

const onTabChange = (tabName) => {
    if (activeTab.value === "DSA20902" && tabName !== "DSA20902" && dsa20902HasPendingFeedback.value) {
        pendingTab.value = tabName;
        showLeaveConfirmation.value = true;
        return;
    }

    setActiveTab(tabName);
};

const cancelTabChange = () => {
    pendingTab.value = null;
    showLeaveConfirmation.value = false;
};

const confirmTabChange = () => {
    const nextTab = pendingTab.value;
    dsa20902HasPendingFeedback.value = false;
    pendingTab.value = null;
    showLeaveConfirmation.value = false;

    if (nextTab) {
        setActiveTab(nextTab);
    }
};

const setControlConfirmation = (data) => {
    const prefix = data.CONTROL_CODE === "ERR"
        ? "本件有「特殊管控」注意事項。"
        : "本件有「特殊提醒」注意事項。";
    const department = data.isInternal === "N"
        ? `\r\n詳細內容請洽${data.CONTROL_DEPT_GROUP_NM}。`
        : "";

    controlMessage.value = `${prefix}${department}\r\n若要查詢特殊件控管變更紀錄請按『確定』鍵?`;
    controlHistoryParams.value = {
        loanId: data.BORROW_ID,
    };
    showControlConfirmation.value = true;
};

const openControlHistory = () => {
    showControlConfirmation.value = false;
    showControlHistory.value = true;
};

const onQuery = async () => {
    const { valid } = await validate();
    if (!valid) return;

    applyId.value = applyId.value.toUpperCase();
    tabs.value = [];
    activeTab.value = null;

    // TODO: OVER_APPROXIMATION - 待複查跨頁保留的受理編號是否可改以 Vue Router state 傳遞
    await router.replace({
        name: "DSA21000",
        state: {
            ...router.currentRoute.value.state,
            applyId: applyId.value,
        },
    });

    const res = await $cathayAxios.post("dsa21000/query", {
        APPLY_ID: applyId.value,
    });
    if (res.returnCode !== 0) return;

    tabs.value = normalizeTabs(res.data.Tab_List);
    activeTab.value = tabs.value[0]?.funcId ?? null;

    if (res.data.CONTROL_CODE) {
        setControlConfirmation(res.data);
    }
};

onMounted(async () => {
    // TODO: OVER_APPROXIMATION - 待複查既有跨頁保留參數是否可由 Vue Router state 還原
    setValues({
        applyId: router.currentRoute.value.state?.applyId ?? "",
    });

    // TODO: TECHNICAL_GAP - 顯示進入頁面時由伺服器請求攜帶的回傳訊息
    // TODO: TECHNICAL_GAP - 接收債信評等分頁的模型回饋異動狀態
    // TODO: TECHNICAL_GAP - 重新進入債信評等、核貸照會與照會回覆分頁時重新載入內容
    await nextTick();
    applyIdInput.value?.focus();
});
</script>

<style scoped lang="scss">
.dsa21000 {
    min-height: 100%;
    background-color: #f0fbc6;

    &__label {
        width: 20%;
    }

    &__action {
        width: 12%;
        text-align: center;
    }

    &__tab-panels {
        min-height: calc(100vh - 220px);
    }

    &__message {
        white-space: pre-line;
    }

    &__control-dialog {
        width: 600px;
        height: 350px;
        max-width: 90vw;
    }
}
</style>
