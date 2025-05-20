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
      lineChartOption.value = await getLineChartMockData(lineTime.value, lineRoom.value)
    }

    const fetchPieChartData = async () => {
      pieChartOption.value = await getPieChartMockData(pieMetric.value, pieRoom.value)
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
