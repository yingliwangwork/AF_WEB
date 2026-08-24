import notify from "@/assets/plugins/CathayNotification/notify.js";

export default {
  install(app, options = {}) {
    app.provide("$notify", notify);
    app.config.globalProperties.$notify = notify;
  },
};
