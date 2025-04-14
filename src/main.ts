import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router/index.js";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './util/rem.js'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
createApp(App).use(ElementPlus,{locale: zhCn,}).use(router).mount('#app')

// @ts-ignore
if (import.meta.hot) {
    // @ts-ignore
    import.meta.hot.accept()
}