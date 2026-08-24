import publicAxiosMethod from "@/assets/plugins/CathayAxios/instance.js";

export default {
  install(app, options = {}) {
    app.config.globalProperties.$cathayAxios = publicAxiosMethod;
    app.provide("$cathayAxios", publicAxiosMethod);
  },
};
