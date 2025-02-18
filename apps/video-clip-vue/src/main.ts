import { createApp } from 'vue'
import router from '@/router/index.ts'
import './style.less'
import App from './App.vue'

createApp(App).use(router).mount('#app')
