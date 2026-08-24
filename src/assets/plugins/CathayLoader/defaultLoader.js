import { createApp } from "vue";
import {CxlLoadingForPlugin}  from "vue-cathaylife-component"; 

const div = document.createElement("div");
const vueLoadingApp = createApp(CxlLoadingForPlugin);
const loadingComponent = vueLoadingApp.mount(div);

export default {
  open: (options) => {
    loadingComponent.open(options);
  },
  close: () => {
    loadingComponent.close();
  },
};
