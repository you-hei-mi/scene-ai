/**
 * Vue 应用入口
 * @description 初始化 Vue 3 应用并挂载路由
 */

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./styles/index.css";

const app = createApp(App);
app.use(router);
app.mount("#root");
