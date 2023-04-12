import Vue from "vue";
import ResizableColumns from "@spacebnd/vuetify-data-table-resizable-columns";
import App from "@/app.vue";
import "@/registerServiceWorker";
import router from "@/router";
import vuetify from "@/plugins/vuetify.js";
import { auth } from "@/firebase.js";

Vue.use(ResizableColumns);
Vue.config.productionTip = false;
let app;
auth.onAuthStateChanged(() => {
  if (!app)
    app = new Vue({
      router,
      vuetify,
      render: h => h(App),
    }).$mount("#app");
});
