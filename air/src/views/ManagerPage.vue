<template>
  <BaseLayout :sidebarComponent="sidebarComp">
    <div class="manager-panel">
      <el-card class="chart-panel" shadow="always">
        <div class="filter-row">
          <!-- 图表类型选择 -->
          <el-select v-model="chartType" placeholder="图表类型" @change="handleChartTypeChange" style="width: 200px">
            <el-option label="折线图" value="line"/>
            <el-option label="饼图" value="pie"/>
          </el-select>

          <!-- 动态展示的两个过滤器 -->
          <template v-if="chartType === 'line'">
            <el-select v-model="lineTime" placeholder="时间范围" @change="fetchLineChartData" style="width: 200px">
              <el-option label="今日数据" value="day"/>
              <el-option label="过去一周" value="week"/>
            </el-select>
            <el-select v-model="lineRoom" placeholder="房间选择" clearable @change="fetchLineChartData"
                       style="width: 200px">
              <el-option label="所有房间" value="all"/>
              <el-option v-for="room in rooms" :key="room" :label="room" :value="room"/>
            </el-select>
          </template>

          <template v-else-if="chartType === 'pie'">
            <el-select v-model="pieMetric" placeholder="统计内容" @change="fetchPieChartData" style="width: 200px">
              <el-option label="风速时长占比" value="fan"/>
              <el-option label="费用占比" value="fee"/>
            </el-select>
            <el-select v-model="pieRoom" placeholder="房间选择" clearable @change="fetchPieChartData"
                       style="width: 200px">
              <el-option label="所有房间" value="all"/>
              <el-option v-for="room in rooms" :key="room" :label="room" :value="room"/>
            </el-select>
          </template>
        </div>

        <!-- 图表区域 -->
        <ECharts
            v-if="chartType === 'line'"
            :option="lineChartOption"
            style="height: 400px"/>
        <ECharts
            v-else-if="chartType === 'pie'"
            :option="pieChartOption"
            style="height: 400px"/>
      </el-card>
    </div>
  </BaseLayout>
</template>

<script>
import {ref, onMounted} from 'vue'
import ECharts from 'vue-echarts'
import {getLineChartMockData, getPieChartMockData} from '@/mockDataManager.js'
import BaseLayout from "@/components/Layout/BaseLayout.vue";
import SidebarManager from "@/components/Layout/SidebarManager.vue";
import axios from 'axios'
import dayjs from 'dayjs' // 用于计算日期范围


export default {
  components: {
    BaseLayout,
    ECharts
  },
  setup() {

    const chartType = ref('line') // 默认折线图

    const rooms = [...Array(10).keys()].map(i => (101 + i).toString())
        .concat([...Array(10).keys()].map(i => (201 + i).toString()))

    // 折线图参数
    const lineTime = ref('day')
    const lineRoom = ref('all')
    const lineChartOption = ref({})

    // 饼图参数
    const pieMetric = ref('fan')
    const pieRoom = ref('all')
    const pieChartOption = ref({})

    const fetchLineChartData = async () => {
      const today = dayjs()
      let start, end

      if (lineTime.value === 'day') {
        start = end = today
      } else if (lineTime.value === 'week') {
        start = today.subtract(6, 'day')
        end = today
      }

      const params = {
        start: start.format('YYYY-MM-DD'),
        end: end.format('YYYY-MM-DD')
      }

      if (lineRoom.value !== 'all') {
        params.roomId = parseInt(lineRoom.value)
      }

      try {
        console.log(params)
        const res = await axios.get('/api/manager/report', {params})
        console.log(res.data)
        const data = res.data

        lineChartOption.value = {
          title: {text: '费用趋势图'},
          tooltip: {trigger: 'axis'},
          legend: {data: ['住宿费用', '空调费用']},
          xAxis: {type: 'category', data: Object.keys(data.stayCostTrend)},
          yAxis: {type: 'value'},
          series: [
            {
              name: '住宿费用',
              type: 'line',
              data: Object.values(data.stayCostTrend)
            },
            {
              name: '空调费用',
              type: 'line',
              data: Object.values(data.acCostTrend)
            }
          ]
        }
      } catch (e) {
        console.error('获取折线图数据失败', e)
        lineChartOption.value = await getLineChartMockData(lineTime.value, lineRoom.value)
      }
    }

    const fetchPieChartData = async () => {
      const today = dayjs()
      const params = {
        start: today.format('YYYY-MM-DD'),
        end: today.format('YYYY-MM-DD')
      }

      if (pieRoom.value !== 'all') {
        params.roomId = parseInt(pieRoom.value)
      }

      try {
        console.log('请求参数：', params)
        const res = await axios.get('/api/manager/report', {params})
        console.log('后端返回：', res.data)
        const data = res.data

        if (pieMetric.value === 'fee') {
          pieChartOption.value = {
            title: {text: '费用占比', left: 'center'},
            tooltip: {trigger: 'item'},
            legend: {bottom: 0, left: 'center'},
            series: [
              {
                type: 'pie',
                radius: '50%',
                data: [
                  {name: '住宿费', value: data.costRatio.StayCost},
                  {name: '空调费', value: data.costRatio.ACCost}
                ]
              }
            ]
          }
        } else if (pieMetric.value === 'fan') {
          pieChartOption.value = {
            title: {text: '风速时长占比', left: 'center'},
            tooltip: {trigger: 'item'},
            legend: {bottom: 0, left: 'center'},
            series: [
              {
                type: 'pie',
                radius: '50%',
                data: Object.entries(data.fanSpeedRatio).map(([key, value]) => {
                  const labelMap = {
                    HIGH: '高风',
                    MEDIUM: '中风',
                    LOW: '低风'
                  }
                  return {
                    name: labelMap[key] || key,
                    value: value
                  }
                })
              }
            ]
          }
        }
      } catch (e) {
        console.error('获取饼图数据失败', e)
        pieChartOption.value = await getPieChartMockData(pieMetric.value, pieRoom.value)
      }
    }


    const handleChartTypeChange = () => {
      if (chartType.value === 'line') {
        fetchLineChartData()
      } else {
        fetchPieChartData()
      }
    }

    onMounted(() => {
      handleChartTypeChange()
    })

    return {
      sidebarComp: SidebarManager,
      chartType,
      rooms,
      // 折线图绑定
      lineTime,
      lineRoom,
      lineChartOption,
      fetchLineChartData,
      // 饼图绑定
      pieMetric,
      pieRoom,
      pieChartOption,
      fetchPieChartData,
      handleChartTypeChange
    }
  }
}
</script>

<style scoped>
.manager-panel {
  margin: 20px 0 25px 0;
  height: calc(100% - 45px);
  width: 100%;
  display: flex;
  justify-content: center;
}

.chart-panel {
  width: 100%;
  max-width: 900px;
}

.filter-row {
  display: flex;
  gap: 10px;
  margin: 15px 0 30px 0;
  justify-content: center;
}
</style>
