import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import googleAnalytics from "./googleAnalytics.js";

const app = createApp(App);
app.use(googleAnalytics);
app.use(createPinia());
app.use(router);

app.mount("#app");
