import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Directives from './directives/index.js'

createApp(App).use(router).use(Directives).mount('#app')
