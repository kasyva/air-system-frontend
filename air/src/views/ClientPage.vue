<template>
  <BaseLayout :sidebarComponent="sidebarComp"
              :class="currentMode === 'cool' ? 'cool-theme' : 'warm-theme'">
    <div class="hotel-ac-control">
      <h2> {{roomNumber}} 波普特廉价酒店欢迎您！</h2>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="box-card">
            <template #header>
              <div class="clearfix">
                <span>当前温度</span>
              </div>
            </template>
            <div class="text item">
              <span class="value-box">{{ currentTemperature +'℃'}}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <template #header>
              <div class="clearfix">
                <span>空调开关</span>
              </div>
            </template>
            <div class="text item">
              <el-switch v-model="airConditionOn" @change="toggleAirCondition"></el-switch>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <template #header>
              <div class="clearfix">
                <span>当前工作模式</span>
              </div>
            </template>
            <div class="text item" style="cursor: pointer; display :flex;justify-content:center;align-item:center;height:50px;" @click="toggleMode">
              <el-tooltip :content="currentMode === 'cool' ? '点击切换为制热' : '点击切换为制冷'" placement="top">
                <span v-if="currentMode === 'cool'" class="mode-icon">
                  <el-icon><IceCreamRound /></el-icon>
                </span>
                <span v-else class="mode-icon">
                  <el-icon><Sunny /></el-icon>
                </span>
              </el-tooltip>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="box-card">
            <template #header>
              <div class="clearfix">
                <span>当前费用（元）</span>
              </div>
            </template>
            <div class="text item">
              <span>{{ currentCost }}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card class="box-card" :class="currentMode === 'cool' ? 'cool-theme' : 'warm-theme'">
            <template #header>
              <div class="clearfix">
                <span>目标温度</span>
              </div>
            </template>
            <div class="text item" style="display: flex; align-items: center; justify-content: space-between;">
              <!-- 减少温度按钮 -->
              <el-button type="primary" circle @click="decreaseTemperature" :class="currentMode === 'cool' ? 'cool-btn' : 'warm-btn'">
                <el-icon><Minus /></el-icon>
              </el-button>
              <!-- 温度显示区域 -->
              <span style="font-size: 24px;" class="value-box">{{ targetTemperature }}℃</span>
              <!-- 增加温度按钮 -->
              <el-button type="primary" circle @click="increaseTemperature" :class="currentMode === 'cool' ? 'cool-btn' : 'warm-btn'">
                <el-icon><Plus /></el-icon>
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="box-card">
            <template #header>
              <div class="clearfix">
                <span>总费用（元）</span>
              </div>
            </template>
            <div class="text item">
              <span>{{ totalCost }}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card class="box-card">
            <template #header>
              <div class="clearfix">
                <span>风速</span>
              </div>
            </template>
            <div class="text item">
              <el-button
                @click="setFanSpeed('low')"
                :type="fanSpeed === 'low' ? (currentMode === 'cool' ? 'primary' : 'warning') : 'default'"
                style="width: 20%; margin-right: 5%"
              >
                低风
              </el-button>

              <el-button
                @click="setFanSpeed('medium')"
                :type="fanSpeed === 'medium' ? (currentMode === 'cool' ? 'primary' : 'warning') : 'default'"
                style="width: 20%; margin-right: 5%"
              >
                中风
              </el-button>

              <el-button
                @click="setFanSpeed('high')"
                :type="fanSpeed === 'high' ? (currentMode === 'cool' ? 'primary' : 'warning') : 'default'"
                style="width: 20%"
              >
                高风
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </BaseLayout>
</template>

<script>
import BaseLayout from "@/components/Layout/BaseLayout.vue";
import SidebarClient from '@/components/Layout/SidebarClient.vue'
import { Sunny, IceCreamRound } from '@element-plus/icons-vue'
import { Minus, Plus } from '@element-plus/icons-vue'

import {
  startAirCondition,
  stopAirCondition,
  getAirConditionStatus,
  fetchBillAndDetails
} from '@/mockData.js'

export default {
  name: 'ClientView',
  components: {
    BaseLayout,
    Sunny,
    IceCreamRound,
    Minus,
    Plus
  },
  computed: {
  numericRoomNumber() {
    return Number(this.roomNumber);
  }
},
  data() {
    return {
      currentTemperature: 27,
      airConditionOn: false,
      currentMode: "cool",
      currentCost: 0,
      targetTemperature: 23.5,
      totalCost: "0元",
      fanSpeed: 'low',
      sidebarComp: SidebarClient , // 用 data 返回一个组件引用
      roomNumber: '' // 新增字段存储房间号
    };
  },
    async mounted() {
      this.roomNumber = this.$route.query.room || '未知房间';
      document.title = `房间 ${this.roomNumber} - 空调控制`;

      try {
        // 获取空调状态
        const statusRes = await getAirConditionStatus(this.roomNumber);
        const status = statusRes.data;

        this.currentTemperature = status.currentTemperature;
        this.targetTemperature = status.targetTemperature;

        if (status.windSpeed === '低风') this.fanSpeed = 'low';
        else if (status.windSpeed === '中风') this.fanSpeed = 'medium';
        else if (status.windSpeed === '高风') this.fanSpeed = 'high';

        this.airConditionOn = true;

        // 使用 fetchBillAndDetails 获取账单信息和详单总费用
        const { billInfo, detailsTotalFee } = await fetchBillAndDetails({ roomId: this.numericRoomNumber });

        console.log("生成账单:", billInfo);
        console.log("详单总费用:", detailsTotalFee);

        // 安全赋值
        this.currentCost = parseFloat((detailsTotalFee || '0').toString().replace('元', '')); // 当前费用（空调费）
        this.totalCost = billInfo.totalFee; // 总费用

      } catch (error) {
        console.error("获取房间信息失败", error.message);
        this.$message.error("无法加载房间空调状态或账单信息");
      }
    },
  methods: {
    setFanSpeed(speed) {
      this.fanSpeed = speed;
    },
    toggleMode() {
      this.currentMode = this.currentMode === 'cool' ? 'warm' : 'cool';
    },
    increaseTemperature() {
      if (this.targetTemperature < 30) {
        this.targetTemperature += 0.5;
      }
    },
    decreaseTemperature() {
      if (this.targetTemperature > 16) {
        this.targetTemperature -= 0.5;
      }
    },
        async toggleAirCondition(value) {
      try {
        if (value) {
          await startAirCondition(this.roomNumber);
          //this.currentCost += 0.01;
        } else {
          await stopAirCondition(this.roomNumber);
        }
      } catch (error) {
        console.error("操作失败", error.message);
        this.airConditionOn = !value;
      }
    }
  }
};
</script>

<style scoped>
.hotel-ac-control {
  text-align: center;
}

.el-switch {
  transform: scale(1.2);
}

.box-card {
  margin-bottom: 20px;
}

.text.item {
  font-size: 24px;
}

.text.item .el-button {
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.text.item .el-button:hover {
  transform: scale(1.05);
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.mode-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease-in-out;
}

.mode-icon:hover {
  transform: scale(1.5);
}

.text.item {
  font-size: 24px;
  cursor: pointer;
  height: 50px;
  padding: 0 20px;
}

.value-box {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 8px;
  background-color: #f0f0f0;
  color: #d35400;
  font-weight: bold;
}

/* 制冷模式下的样式 */
.cool-theme .box-card {
  background: linear-gradient(135deg, #1e90ff, #87CEEB); /* 蓝色渐变 */
  color: white;
  opacity:0.5
}

.cool-theme .value-box {
  background-color: #e0f7ff;
  color: #1e90ff;
}

/* 制热模式下的样式 */
.warm-theme .box-card {
  background: linear-gradient(135deg, #FFA07A, #FFD580); /* 橙色渐变 */
  color: white;
  opacity:0.7
}

.warm-theme .value-box {
  background-color: #fff2e6;
  color: #ffa500;

}

.cool-btn {
  background-color: #1e90ff;
  color: white;
}

.warm-btn {
  background-color: #ffa500;
  color: white;
  border :none
}

.warm-btn:hover {
  background: #efb854;
}


</style>