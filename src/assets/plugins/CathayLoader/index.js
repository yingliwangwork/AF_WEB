import defaultLoader from "@/assets/plugins/CathayLoader/defaultLoader.js";

export default {
  install(app, appOptions = {}) {
    app.provide("$loader", defaultLoader);
    app.config.globalProperties.$loader = defaultLoader;
  },
};
