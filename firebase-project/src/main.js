import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { auth } from "./firebase/config.js";
import "../src/style.css";

auth.onAuthStateChanged(() => {
  const app = createApp(App);
  app.use(router);
  app.use(store);
  app.mount("#app");
});
