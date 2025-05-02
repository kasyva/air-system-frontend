import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// ECharts 所需引入
import * as echarts from 'echarts/core'
import {
    LineChart,
    PieChart
} from 'echarts/charts'

import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
} from 'echarts/components'

import {CanvasRenderer} from 'echarts/renderers'
import VueECharts from 'vue-echarts'

// 注册所有 ECharts 组件
echarts.use([
    CanvasRenderer,
    LineChart,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
])


const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.component('ECharts', VueECharts) // 注册 ECharts 组件
app.mount('#app')

import * as ElementPlusIconsVue from '@element-plus/icons-vue' // 导入图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) { //注册图标
    app.component(key, component)
}