import { createRouter, createWebHistory } from 'vue-router' // 使用 Vue 3 的写法
import AirAdmin from '@/views/AirAdmin.vue'
import FrontDesk from '@/views/FrontDeskCheckin.vue'
import ManagerReport from '@/views/ManagerReport.vue'

const router = createRouter({
  history: createWebHistory(), // 使用新的 history 模式
  routes: [
    {
      path: '/air-admin',
      name: 'AirAdmin',
      component: AirAdmin
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