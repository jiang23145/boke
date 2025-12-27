import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// sockclient.js 需要的全局
if (typeof global === 'undefined') {
    window.global = window;
}

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
// 注册全部的icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router).use(ElementPlus).use(pinia).mount('#app')
