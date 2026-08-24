import { createApp } from "vue";
import vueDialog from "@/components/common/CathayDialog.vue";

export default {
  install(app, appOptions = {}) {
    const div = document.createElement("div");
    const vueDialogApp = createApp(vueDialog);
    vueDialogApp.use(appOptions.quasar);
    const dialogComponent = vueDialogApp.mount(div);

    const publicAlertMethod = {
      success: (message, title, options) => {
        dialogComponent.openAlert(message, title, "success", options);
      },
      info: (message, title, options) => {
        dialogComponent.openAlert(message, title, "info", options);
      },
      error: (message, title, options) => {
        dialogComponent.openAlert(message, title, "error", options);
      },
    };
    app.provide("$alert", publicAlertMethod);

    app.provide("$confirm", (message, title, options) =>
      dialogComponent.openConfirm(message, title, options),
    );
  },
};
