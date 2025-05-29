<template>
  <BaseLayout :sidebarComponent="sidebarComp">
    <div class="manager-panel">
      <el-card class="chart-panel" shadow="always">
        <div class="filter-row">
          <!-- 图表类型选择 -->
          <el-select v-model="chartType" placeholder="图表类型" @change="handleChartTypeChange" style="width: 180px">
            <el-option label="折线图" value="line"/>
            <el-option label="饼图" value="pie"/>
          </el-select>

          <!-- 折线图筛选 -->
          <template v-if="chartType === 'line'">
            <el-select v-model="lineTime" placeholder="时间范围" @change="fetchLineChartData" style="width: 180px">
              <el-option label="今日数据" value="day"/>
              <el-option label="过去一周" value="week"/>
            </el-select>
            <el-select v-model="lineRoom" placeholder="房间选择" clearable @change="fetchLineChartData"
                       style="width: 180px">
              <el-option label="所有房间" value="all"/>
              <el-option v-for="room in rooms" :key="room" :label="room" :value="room"/>
            </el-select>
          </template>

          <!-- 饼图筛选 -->
          <template v-else-if="chartType === 'pie'">
            <el-select v-model="pieMetric" placeholder="统计内容" @change="fetchPieChartData" style="width: 180px">
              <el-option label="风速时长占比" value="fan"/>
              <el-option label="费用占比" value="fee"/>
            </el-select>
            <el-select v-model="pieTime" placeholder="时间范围" @change="fetchPieChartData" style="width: 180px">
              <el-option label="今日数据" value="day"/>
              <el-option label="过去一周" value="week"/>
            </el-select>
            <el-select v-model="pieRoom" placeholder="房间选择" clearable @change="fetchPieChartData"
                       style="width: 180px">
              <el-option label="所有房间" value="all"/>
              <el-option v-for="room in rooms" :key="room" :label="room" :value="room"/>
            </el-select>
          </template>
        </div>

        <!-- 图表区域 -->
        <ECharts v-if="chartType === 'line'" :option="lineChartOption" style="height: 400px; width: 100%"/>
        <ECharts v-else-if="chartType === 'pie'" :option="pieChartOption" style="height: 400px"/>
      </el-card>
    </div>
  </BaseLayout>
</template>

<script>
import {ref, onMounted} from 'vue'
import ECharts from 'vue-echarts'
import axios from 'axios'
import dayjs from 'dayjs'
import BaseLayout from "@/components/Layout/BaseLayout.vue";
import SidebarManager from "@/components/Layout/SidebarManager.vue";

export default {
  components: {
    BaseLayout,
    ECharts
  },
  setup() {
    const chartType = ref('line')

    const rooms = [...Array(10).keys()].map(i => (101 + i).toString())
        .concat([...Array(10).keys()].map(i => (201 + i).toString()))

    // 折线图参数
    const lineTime = ref('day')
    const lineRoom = ref('all')
    const lineMetric = ref('ac')
    const lineChartOption = ref({})

    // 饼图参数
    const pieMetric = ref('fan')
    const pieRoom = ref('all')
    const pieTime = ref('day')
    const pieChartOption = ref({})

    const fetchLineChartData = async () => {
      const today = dayjs()
      let start, end
      if (lineTime.value === 'day') {
        start = end = today
      } else {
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
        const res = await axios.get('/api/manager/report', {params})
        const data = res.data

        const startStr = start.format('YYYY-MM-DD')
        const endStr = end.format('YYYY-MM-DD')
        const roomStr = pieRoom.value === 'all' ? '所有房间' : `房间${pieRoom.value}`

        const metricMap = {
          ac: {
            field: data.acCostTrend,
            label: '空调费用（元）',
            unit: '元'
          },
          fan: {
            title: '送风时长趋势图',
            field: data.fanSpeedDurationTrend || {}, // 替换为真实字段
            label: '送风时长（分钟）',
            unit: '分钟'
          }
        }

        const metric = metricMap[lineMetric.value]
        const trendData = metric.field
        // 初始化每小时的聚合值为 0
        const hourlySum = Array(24).fill(0)

        // 遍历 trendData 中的所有时间键，如 "2025-05-26 22"
        for (const [key, value] of Object.entries(trendData)) {
          const hour = parseInt(key.split(' ')[1])  // 提取 "22" -> 22
          if (!isNaN(hour) && hour >= 0 && hour <= 23) {
            hourlySum[hour] += parseFloat(value)
          }
        }

        // 折线图用的 seriesData
        const seriesData = hourlySum

        // 最大值处理
        const maxY = Math.max(...seriesData)
        let unit = 1
        if (maxY > 10) unit = 5
        else if (maxY > 5) unit = 2

        // 限制最大值为刚好上一个单位倍数
        let yMax = Math.ceil(maxY / unit) * unit
        if (yMax - maxY > unit)
          yMax = maxY + unit
        yMax = Math.ceil(yMax)  // 防止浮点

        lineChartOption.value = {
          title: {
            text: `{titleText|空调费用趋势 - ${roomStr}}\n\n{dateText|${startStr} ～ ${endStr}}`,
            left: 'center',
            textStyle: {
              rich: {
                titleText: {
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#333'
                },
                dateText: {
                  fontSize: 14,
                  color: '#666'
                }
              }
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: params => {
              const hour = params[0].axisValueLabel
              const value = params[0].data
              return `${hour}<br/>${metric.label}：${value} ${metric.unit}`
            }
          },
          legend: {
            data: [metric.label],
            top: 70,
            textStyle: {
              fontSize: 13.5
            }
          },
          grid: {
            top: 130,
            bottom: 30,
            left: 60,
            right: 30
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            name: '时间',
            nameLocation: 'middle',
            nameGap: 35,
            axisTick: {
              show: true,
              alignWithLabel: false
            },
            axisLabel: {
              formatter: (val, index) => {
                // 在奇数 index 显示标签，例如 01:00、03:00、…23:00
                return index % 2 === 1 ? val : ''
              }
            },
            data: Array.from({length: 24}, (_, i) => `${String(i).padStart(2, '0')}:00`)  // 00:00 ~ 23:00
          },
          yAxis: {
            type: 'value',
            name: metric.unit,
            nameLocation: 'end',
            nameGap: 15,
            max: yMax
          },
          series: [
            {
              name: metric.label,
              type: 'line',
              data: seriesData,
              smooth: true,
              symbol: 'circle',
              symbolSize: 6,
              lineStyle: {
                width: 2
              }
            }
          ]
        }
      } catch (e) {
        console.error('获取折线图数据失败', e)
      }
    }

    const fetchPieChartData = async () => {
      const today = dayjs()
      let start, end
      if (pieTime.value === 'day') {
        start = end = today
      } else {
        start = today.subtract(6, 'day')
        end = today
      }

      const params = {
        start: start.format('YYYY-MM-DD'),
        end: end.format('YYYY-MM-DD')
      }
      if (pieRoom.value !== 'all') {
        params.roomId = parseInt(pieRoom.value)
      }

      try {
        const res = await axios.get('/api/manager/report', {params})
        const data = res.data
        const startStr = start.format('YYYY-MM-DD')
        const endStr = end.format('YYYY-MM-DD')
        const roomStr = pieRoom.value === 'all' ? '所有房间' : `房间${pieRoom.value}`

        if (pieMetric.value === 'fee') {
          pieChartOption.value = {
            title: {
              text: `{titleText|费用占比 - ${roomStr}}\n\n{dateText|${startStr} ～ ${endStr}}`,
              left: 'center',
              textStyle: {
                rich: {
                  titleText: {
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#333'
                  },
                  dateText: {
                    fontSize: 14,
                    color: '#666'
                  }
                }
              }
            },
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
        } else {
          pieChartOption.value = {
            title: {
              text: `{titleText|风速时长占比 - ${roomStr}}\n\n{dateText|${startStr} ～ ${endStr}}`,
              left: 'center',
              textStyle: {
                rich: {
                  titleText: {
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#333'
                  },
                  dateText: {
                    fontSize: 14,
                    color: '#666'
                  }
                }
              }
            },
            tooltip: {trigger: 'item'},
            legend: {bottom: 0, left: 'center'},
            series: [
              {
                type: 'pie',
                radius: '50%',
                data: Object.entries(data.fanSpeedRatio).map(([key, value]) => {
                  const labelMap = {HIGH: '高风', MEDIUM: '中风', LOW: '低风'}
                  return {name: labelMap[key] || key, value}
                })
              }
            ]
          }
        }
      } catch (e) {
        console.error('获取饼图数据失败', e)
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
      lineMetric,
      lineChartOption,
      fetchLineChartData,
      // 饼图绑定
      pieMetric,
      pieRoom,
      pieTime,
      pieChartOption,
      fetchPieChartData,
      handleChartTypeChange
    }
  }
}
</script>

<style scoped>
.manager-panel {
  margin: 20px 30px 25px 30px;
  height: calc(100% - 45px);
  width: calc(100% - 60px);
  display: flex;
  justify-content: center;
}

.chart-panel {
  width: 100%;
}

.filter-row {
  display: flex;
  gap: 10px;
  margin: 15px 0 30px 0;
  justify-content: center;
}
</style>
