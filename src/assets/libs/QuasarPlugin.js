import { Quasar, Loading, Notify, Dialog } from "quasar";
import quasarLang from "quasar/lang/zh-TW.js";
// Import Quasar css
import "quasar/src/css/index.sass";
// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";

export default {
  install(app, options = {}) {
    app.use(Quasar, {
      plugins: { Loading, Notify, Dialog }, // import Quasar plugins and add here
      lang: quasarLang,
    });
  },
};
