import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/launchPage',
    name: 'Launch',
    component: ()=> import('../pages/launchPage.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/dashboard.vue')
  },
  {
    path: '/suspend',
    name: 'suspend',
    component: () => import('@/pages/suspend.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
