<template>
  <CxlBreadcrumbs
    :breadcrumbs="navCollection"
    :routerPath="$route.path"
    :rootPath="rootPath"
  />

  <div class="cxl-title-h1 q-mt-md">簽件作業</div>

  <form class="q-mt-md" @submit.prevent="handleQuery">
    <q-markup-table
      class="cxl-table cxl-table-horizontal"
      square
      flat
      bordered
    >
      <thead>
        <tr>
          <th colspan="2" class="cxl-table-header">簽件作業分頁畫面</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>
            <span class="cxl-text-danger">*</span>
            受理編號
          </th>
          <td>
            <div class="row items-start q-gutter-sm">
              <CxlInput
                v-model="applyId"
                autofocus
                maxlength="11"
                placeholder="請輸入受理編號"
                :error="!!errors.applyId"
                :error-message="errors.applyId"
                @blur="normalizeApplyId"
              />
              <CxlButton
                label="查詢"
                type="submit"
                :loading="isQuerying"
                :disabled="isQuerying"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </form>

  <CxlTabs
    v-if="tabs.length"
    v-model:currentTab="activeTab"
    class="q-mt-md"
    :tabs="tabs"
    @buttonClick="handleTabClick"
  >
    <q-tab-panel
      v-for="tab in tabs"
      :key="tab.name"
      :name="tab.name"
      class="q-pa-none"
    >
      <iframe
        :ref="(element) => setIframeRef(tab.name, element)"
        :title="tab.label"
        :src="tabSources[tab.name]"
        :height="iframeHeight"
        class="full-width"
        frameborder="0"
        @load="handleIframeLoad(tab.name)"
      />
    </q-tab-panel>
  </CxlTabs>

  <CxlModal
    v-model="confirmation.isOpen"
    :title="confirmation.title"
    cancelText="取消"
    confirmText="確定"
    persistent
    @before-hide="handleConfirmationHide"
    @confirm="resolveConfirmation(true)"
    @cancel="resolveConfirmation(false)"
  >
    <p
      v-for="line in confirmation.message.split('\n')"
      :key="line"
      class="cxl-font-18"
    >
      {{ line }}
    </p>
  </CxlModal>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useField, useForm } from 'vee-validate'
import { object, string } from 'yup'
import {
  CxlBreadcrumbs,
  CxlButton,
  CxlInput,
  CxlModal,
  CxlTabs,
} from 'vue-cathaylife-component'
import navCollection from '@/service/NavCollection.js'
import dsa21000Service from '@/service/DSA21000Service.js'

const STORAGE_KEY = 'DSA21000_APPLY_ID'
const DSA20902_TAB = 'DSA20902'
const ALWAYS_RELOAD_TABS = new Set(['DSA21006', 'DSA21007'])
const SUPPORTED_TAB_IDS = new Set([
  'DSA21001',
  'DSA21002',
  'DSA21003',
  'DSA21009',
  'DSA21005',
  'DSA20200',
  'DSA20901',
  'DSA20902',
  'DSA20600',
  'DSA21006',
  'DSA30500',
  'DSA21007',
  'DSA20410',
  'DSA10900',
  'DSA20800',
  'DSA20701',
  'DSA20500',
  'DSA20301',
  'DSH01400',
])

const $route = useRoute()
const $cathayAxios = inject('$cathayAxios')
const $alert = inject('$alert')
const $notify = inject('$notify')
const rootPath = { label: '首頁', url: '/' }
const apiBaseUrl = new URL(
  import.meta.env.VITE_API_HOST || '/',
  window.location.origin,
).toString()

const validationSchema = object({
  applyId: string()
    .trim()
    .max(11, '受理編號不可超過 11 碼')
    .required('請輸入受理編號'),
})

const { errors, validate } = useForm({
  validationSchema,
  initialValues: {
    applyId: sessionStorage.getItem(STORAGE_KEY) || '',
  },
  validateOnMount: false,
})
const { value: applyId } = useField('applyId')

const tabs = ref([])
const activeTab = ref('')
const previousTab = ref('')
const tabSources = reactive({})
const iframeRefs = reactive({})
const iframeHeight = ref(480)
const dsa20902HasPendingUpdate = ref(false)
const dsa20902StatusKnown = ref(false)
const isQuerying = ref(false)
const confirmation = reactive({
  isOpen: false,
  title: '',
  message: '',
})
let confirmationResolver

/**
 * 將 endpoint 轉換為使用目前 API host 的完整網址。
 *
 * @param {string} path - 後端 endpoint
 * @returns {string} 完整網址
 */
const buildLegacyUrl = (path) => new URL(path, apiBaseUrl).toString()

/**
 * 將受理編號正規化為大寫並移除前後空白。
 *
 * @returns {void}
 */
const normalizeApplyId = () => {
  applyId.value = applyId.value.trim().toUpperCase()
}

/**
 * 依 legacy 功能代號建立子作業網址。
 *
 * @param {object} tab - 查詢回傳的頁籤資料
 * @param {string} tab.FUNC_ID - 功能代號
 * @param {string} tab.APPLY_ID - 受理編號
 * @param {string} [tab.PERSON_ID] - 人員識別碼
 * @param {string} [tab.CASE_TYPE] - 案件類型
 * @returns {string} 子作業完整網址
 */
const buildTabUrl = (tab) => {
  const functionId = tab.FUNC_ID
  const path = `/${functionId.slice(0, 4)}_${functionId.slice(4, 8)}/prompt`
  const url = new URL(path, apiBaseUrl)
  url.searchParams.set('APPLY_ID', tab.APPLY_ID)
  url.searchParams.set('LINK_FROM', 'DSA21000')
  url.searchParams.set('titleNotDisplay', 'Y')

  if (functionId === 'DSA20200') {
    url.searchParams.set('TYPE', 'A')
    url.searchParams.set('VALUE', tab.APPLY_ID)
  }
  if (functionId === 'DSH01400') {
    url.searchParams.set('PERSON_ID', tab.PERSON_ID || '')
  }
  if (functionId === 'DSA21002') {
    url.searchParams.set('CASE_TYPE', tab.CASE_TYPE || '')
  }

  return url.toString()
}

/**
 * 將 production legacy 封包正規化為 CathayAxios 標準回應。
 *
 * @param {object} response - API 回應
 * @returns {{ returnCode: number, data: object|undefined }} 標準回應
 */
const normalizeApiResponse = (response) => {
  if (response?.returnCode !== undefined) {
    return response
  }

  return {
    returnCode: Number(response?.ErrMsg?.returnCode),
    data: response?.jsonData,
  }
}

/**
 * 清除既有頁籤及 iframe 狀態。
 *
 * @returns {void}
 */
const resetTabs = () => {
  tabs.value = []
  activeTab.value = ''
  previousTab.value = ''
  dsa20902HasPendingUpdate.value = false
  dsa20902StatusKnown.value = false
  Object.keys(tabSources).forEach((key) => delete tabSources[key])
  Object.keys(iframeRefs).forEach((key) => delete iframeRefs[key])
}

/**
 * 將查詢回傳資料轉換為 CxlTabs 格式。
 *
 * @param {object[]} tabList - legacy API 頁籤清單
 * @returns {void}
 */
const createTabs = (tabList) => {
  const supportedTabs = tabList.filter((tab) => SUPPORTED_TAB_IDS.has(tab.FUNC_ID))
  if (supportedTabs.length !== tabList.length) {
    $notify.warning('查詢結果包含尚未支援的作業頁籤，已略過該頁籤')
  }

  tabs.value = supportedTabs.map((tab) => ({
    name: tab.FUNC_ID,
    label: tab.TITLE,
    source: buildTabUrl(tab),
  }))

  const firstTab = tabs.value[0]
  if (firstTab) {
    activeTab.value = firstTab.name
    previousTab.value = firstTab.name
    tabSources[firstTab.name] = firstTab.source
  }
}

/**
 * 執行受理編號查詢並建立動態頁籤。
 *
 * @returns {Promise<void>} 無回傳值
 */
const handleQuery = async () => {
  if (isQuerying.value) {
    return
  }

  isQuerying.value = true
  normalizeApplyId()
  const { valid } = await validate()
  if (!valid) {
    isQuerying.value = false
    return
  }

  resetTabs()
  sessionStorage.setItem(STORAGE_KEY, applyId.value)
  const rawResponse = await $cathayAxios.post(dsa21000Service.query, {
    APPLY_ID: applyId.value,
  })
  const response = normalizeApiResponse(rawResponse)
  if (response.returnCode !== 0) {
    isQuerying.value = false
    return
  }
  if (!response.data || typeof response.data !== 'object') {
    isQuerying.value = false
    $alert.error('查詢回應缺少資料，請稍後再試。', '查詢失敗')
    return
  }

  const responseData = response.data
  const tabList = Array.isArray(responseData.Tab_List) ? responseData.Tab_List : []
  createTabs(tabList)
  await showControlNotice(responseData)
  isQuerying.value = false
}

/**
 * 顯示可明確完成或取消的頁面確認視窗。
 *
 * @param {string} message - 確認內容
 * @param {string} [title='確認提示'] - 視窗標題
 * @returns {Promise<boolean>} 使用者是否確認
 */
const requestConfirmation = (message, title = '確認提示') => {
  confirmation.title = title
  confirmation.message = message
  confirmation.isOpen = true
  return new Promise((resolve) => {
    confirmationResolver = resolve
  })
}

/**
 * 完成目前確認視窗的 Promise。
 *
 * @param {boolean} confirmed - 是否按下確認
 * @returns {void}
 */
const resolveConfirmation = (confirmed) => {
  confirmation.isOpen = false
  if (confirmationResolver) {
    confirmationResolver(confirmed)
    confirmationResolver = undefined
  }
}

/**
 * 將非按鈕方式關閉的確認視窗視為取消，避免 Promise 未完成。
 *
 * @returns {void}
 */
const handleConfirmationHide = () => {
  resolveConfirmation(false)
}

/**
 * 顯示特殊管控或提醒訊息，確認後開啟控管紀錄。
 *
 * @param {object} responseData - 查詢結果
 * @returns {Promise<void>} 無回傳值
 */
const showControlNotice = async (responseData) => {
  if (!responseData.CONTROL_CODE) {
    return
  }

  const noticeType = responseData.CONTROL_CODE === 'ERR' ? '特殊管控' : '特殊提醒'
  const departmentMessage = responseData.isInternal === 'N'
    ? `\n詳細內容請洽${responseData.CONTROL_DEPT_GROUP_NM || ''}。`
    : ''
  const confirmed = await requestConfirmation(
    `本件有「${noticeType}」注意事項。${departmentMessage}\n若要查詢特殊件控管變更紀錄請按「確定」鍵。`,
  )
  if (confirmed) {
    openControlHistory(responseData.BORROW_ID)
  }
}

/**
 * 以 legacy 所需的 POST 表單開啟特殊件控管紀錄。
 *
 * @param {string} borrowId - 借款識別碼
 * @returns {void}
 */
const openControlHistory = (borrowId) => {
  const targetName = `DSA21000ControlHistory-${Date.now()}`
  const popup = window.open('', targetName, 'width=600,height=350,scrollbars=yes')
  if (!popup) {
    $alert.error('瀏覽器已封鎖彈出視窗，請允許彈出視窗後重試。', '無法開啟控管紀錄')
    return
  }

  const form = document.createElement('form')
  form.method = 'POST'
  form.action = buildLegacyUrl(dsa21000Service.controlHistory)
  form.target = targetName

  const parameters = {
    LOAN_ID: borrowId || '',
    CONTROL_TYPE: 'U',
    CONTROL_SOURCE: '2-8',
  }
  Object.entries(parameters).forEach(([name, value]) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.appendChild(input)
  })

  document.body.appendChild(form)
  form.submit()
  form.remove()
}

/**
 * 取得指定頁籤的來源網址。
 *
 * @param {string} tabName - 頁籤代號
 * @returns {string} 頁籤來源網址
 */
const getTabSource = (tabName) => tabs.value.find((tab) => tab.name === tabName)?.source || ''

/**
 * 切換頁籤並套用 legacy 重新載入與未完成確認規則。
 *
 * @param {string} tabName - 目標頁籤代號
 * @returns {Promise<void>} 無回傳值
 */
const handleTabClick = async (tabName) => {
  const fromTab = previousTab.value
  if (fromTab === tabName) {
    if (ALWAYS_RELOAD_TABS.has(tabName)) {
      reloadTab(tabName)
    }
    return
  }

  if (fromTab === DSA20902_TAB) {
    const statusKnown = refreshDsa20902PendingStatus()
    if (!statusKnown || dsa20902HasPendingUpdate.value) {
      const message = statusKnown
        ? '模型回饋尚未修改，請確認是否已完成！'
        : '無法取得模型回饋的修改狀態，請確認是否已完成！'
      const confirmed = await requestConfirmation(message)
      if (!confirmed) {
        activeTab.value = fromTab
        return
      }
      dsa20902HasPendingUpdate.value = false
    }
  }

  previousTab.value = tabName
  if (tabName === DSA20902_TAB || ALWAYS_RELOAD_TABS.has(tabName)) {
    reloadTab(tabName)
    return
  }
  if (!tabSources[tabName]) {
    tabSources[tabName] = getTabSource(tabName)
  }
}

/**
 * 重新載入指定頁籤。
 *
 * @param {string} tabName - 頁籤代號
 * @returns {void}
 */
const reloadTab = (tabName) => {
  if (tabName === DSA20902_TAB) {
    dsa20902StatusKnown.value = false
  }
  tabSources[tabName] = ''
  requestAnimationFrame(() => {
    tabSources[tabName] = getTabSource(tabName)
  })
}

/**
 * 保存動態 iframe 元素參照。
 *
 * @param {string} tabName - 頁籤代號
 * @param {HTMLIFrameElement|null} element - iframe 元素
 * @returns {void}
 */
const setIframeRef = (tabName, element) => {
  if (element) {
    iframeRefs[tabName] = element
  } else {
    delete iframeRefs[tabName]
  }
}

/**
 * iframe 載入完成時同步 DSA20902 的異動狀態。
 *
 * @param {string} tabName - 頁籤代號
 * @returns {void}
 */
const handleIframeLoad = (tabName) => {
  if (tabName === DSA20902_TAB) {
    refreshDsa20902PendingStatus()
  }
}

/**
 * 同源時直接讀取 DSA20902 異動欄位；跨來源時由 postMessage 更新。
 *
 * @returns {boolean} 是否已取得可靠的異動狀態
 */
const refreshDsa20902PendingStatus = () => {
  const iframe = iframeRefs[DSA20902_TAB]
  const source = tabSources[DSA20902_TAB]
  if (!iframe || !source) {
    return false
  }
  if (new URL(source).origin !== window.location.origin) {
    return dsa20902StatusKnown.value
  }

  const statusElement = iframe.contentDocument?.getElementById('updateStatus_DSA20902')
  dsa20902StatusKnown.value = statusElement !== null
  dsa20902HasPendingUpdate.value = statusElement?.value === 'Y'
  return dsa20902StatusKnown.value
}

/**
 * 接收跨來源 DSA20902 子頁回報的異動狀態。
 *
 * @param {MessageEvent} event - iframe postMessage 事件
 * @returns {void}
 */
const handleIframeMessage = (event) => {
  const source = getTabSource(DSA20902_TAB)
  const iframe = iframeRefs[DSA20902_TAB]
  if (
    !source
    || !iframe
    || event.origin !== new URL(source).origin
    || event.source !== iframe.contentWindow
  ) {
    return
  }
  if (event.data?.type === 'DSA20902_UPDATE_STATUS') {
    dsa20902StatusKnown.value = true
    dsa20902HasPendingUpdate.value = event.data.value === 'Y'
  }
}

/**
 * 依可視高度調整 iframe，並保留最低操作空間。
 *
 * @returns {void}
 */
const updateIframeHeight = () => {
  iframeHeight.value = Math.max(window.innerHeight - 280, 400)
}

onMounted(() => {
  updateIframeHeight()
  window.addEventListener('resize', updateIframeHeight)
  window.addEventListener('message', handleIframeMessage)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIframeHeight)
  window.removeEventListener('message', handleIframeMessage)
  resolveConfirmation(false)
})
</script>
