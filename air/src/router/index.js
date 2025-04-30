import {createRouter, createWebHistory} from 'vue-router' // 使用 Vue 3 的写法
import LoginPage from '@/views/LoginPage.vue'
import AirAdminPage from '@/views/AirAdminPage.vue'
import FrontDeskPage from '@/views/FrontDeskCheckinPage.vue'
import ManagerPage from '@/views/ManagerPage.vue'
import ClientPage from '@/views/ClientPage.vue'

const router = createRouter({
    history: createWebHistory(), // 使用新的 history 模式
    routes: [
        {
            path: '/',
            redirect: '/login-page'  // 默认跳转到登录页
        },
        {
            path: '/login-page',
            name: 'LoginPage',
            component: LoginPage
        },
        {
            path: '/airadmin-page',
            name: 'AirAdminPage',
            component: AirAdminPage
        },
        {
            path: '/frontdesk-page',
            name: 'FrontDeskPage',
            component: FrontDeskPage
        },
        {
            path: '/manager-page',
            name: 'ManagerPage',
            component: ManagerPage
        },
        {
            path: '/client-page',
            name: 'ClientPage',
            component: ClientPage
        }
    ]
})

export default router // 导出路由实例