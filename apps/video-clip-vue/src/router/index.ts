import { createMemoryHistory, createRouter } from 'vue-router'
import HomeView from '@/views/editor/index.vue'

const routes = [
  { path: '/', component: HomeView },
]

export default createRouter({
  history: createMemoryHistory(),
  routes,
})

