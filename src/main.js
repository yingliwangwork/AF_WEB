// plugin
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import FontAwesomeIcon from "@/assets/libs/IconsLib.js";
import quasar from "@/assets/libs/QuasarPlugin.js";
import "@/assets/libs/YupZhTw.js"; // 設置Yup檢核規則的中文訊息
import "@/assets/libs/CathayValidateRules.js"; // 設置國泰的檢核規則

// cathay-plugin
import commonFilter from "@/assets/plugins/CommonFilter.js";
import cathayAxios from "@/assets/plugins/CathayAxios/index.js";

// components-plugin
import notification from "@/assets/plugins/CathayNotification/index.js";
import loader from "@/assets/plugins/CathayLoader/index.js";
import cathayDialog from "@/assets/plugins/CathayDialog.js";

import "@/assets/sass/main.scss";
import "@/assets/scss/hanlink.scss";

// 難字系統
import "@/assets/css/eudc.css";

// Import style for cathaylife internal
import "vue-cathaylife-component/src/assets/scss/cathaylife-internal.scss";
import "vue-cathaylife-component/src/assets/css/cub-lib-view-iconfont.min.css";
import "vue-cathaylife-component/src/assets/css/cxl-lib-view-iconfont.css";
import "vue-cathaylife-component/dist/vue-cathaylife-component.css";
import "@/assets/scss/radio.scss";

const app = createApp(App);
app.component("FontAwesomeIcon", FontAwesomeIcon);
app.use(quasar);

const pinia = createPinia();
app.use(pinia);
app.use(notification);
app.use(loader);
app.use(cathayAxios, {
  showNotifyMsg: true,
});

app.use(commonFilter);
app.use(cathayDialog, { quasar });

app.use(router);
app.mount("#app");
