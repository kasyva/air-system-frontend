import { createRouter, createWebHistory } from 'vue-router' // 使用 Vue 3 的写法
import HomePage from '@/views/HomePage.vue'
import ACControl from '@/components/ACControl.vue'
import FrontDesk from '@/components/FrontDesk.vue'
import ManagerReport from '@/components/ManagerReport.vue'

const router = createRouter({
  history: createWebHistory(), // 使用新的 history 模式
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/ac-control',
      name: 'ACControl',
      component: ACControl
    },
    {
      path: '/front-desk',
      name: 'FrontDesk',
      component: FrontDesk
    },
    {
      path: '/manager-report',
      name: 'ManagerReport',
      component: ManagerReport
    }
  ]
})

export default router // 导出路由实例