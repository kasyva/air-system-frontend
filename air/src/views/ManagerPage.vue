<template>
  <BaseLayout :sidebarComponent="sidebarComp">
    <div class="manager-panel">
      <!-- 左侧：折线图卡片 -->
      <el-card class="chart-panel" shadow="always">
        <div class="filter-row">
          <el-select v-model="lineTime" placeholder="时间范围" @change="fetchLineChartData" style="width: 200px">
            <el-option label="今日数据" value="day"/>
            <el-option label="过去一周" value="week"/>
          </el-select>
          <el-select v-model="lineRoom" placeholder="房间选择" clearable @change="fetchLineChartData"
                     style="width: 200px">
            <el-option label="所有房间" value="all"/>
            <el-option v-for="room in rooms" :key="room" :label="room" :value="room"/>
          </el-select>
        </div>
        <ECharts :option="lineChartOption" style="height: 300px"/>
      </el-card>

      <!-- 右侧：饼图卡片 -->
      <el-card class="chart-panel" shadow="always">
        <div class="filter-row">
          <el-select v-model="pieMetric" placeholder="统计内容" @change="fetchPieChartData" style="width: 200px">
            <el-option label="风速时长占比" value="fan"/>
            <el-option label="费用占比" value="fee"/>
          </el-select>
          <el-select v-model="pieRoom" placeholder="房间选择" clearable @change="fetchPieChartData"
                     style="width: 200px">
            <el-option label="所有房间" value="all"/>
            <el-option v-for="room in rooms" :key="room" :label="room" :value="room"/>
          </el-select>
        </div>
        <ECharts :option="pieChartOption" style="height: 300px"/>
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
    // 房间号列表
    const rooms = [...Array(10).keys()].map(i => (101 + i).toString())
        .concat([...Array(10).keys()].map(i => (201 + i).toString()))

    // 折线图选项
    const lineTime = ref('day')         // 默认展示今日数据
    const lineRoom = ref('all')             // 默认“所有房间”
    const lineChartOption = ref({})

    // 饼图选项
    const pieMetric = ref('fan')         // 默认展示风速占比
    const pieRoom = ref('all')              // 默认“所有房间”
    const pieChartOption = ref({})

    // 初始化图表数据
    onMounted(() => {
      fetchLineChartData()
      fetchPieChartData()
    })

    const fetchLineChartData = async () => {
      lineChartOption.value = await getLineChartMockData(lineTime.value, lineRoom.value)
    }

    const fetchPieChartData = async () => {
      pieChartOption.value = await getPieChartMockData(pieMetric.value, pieRoom.value)
    }

    return {
      rooms,
      lineTime,
      lineRoom,
      lineChartOption,
      pieMetric,
      pieRoom,
      pieChartOption,
      fetchLineChartData,
      fetchPieChartData
    }
  },
  data() {
    return {
      sidebarComp: SidebarManager
    };
  }
}
</script>

<style scoped>
.manager-panel {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  padding: 20px;
}

.chart-panel {
  width: 48%;
}

.filter-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  justify-content: center; /* 居中 */
}

</style>
