<template>
  <BaseLayout :sidebarComponent="sidebarComp" :class="currentMode === 'warm' ? 'warm-theme' : 'cool-theme'">
    <div class="hotel-ac-control">
      <el-card shadow="always" class="main-card">
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
                <div class="clearfix" >
                  <span>空调开关</span>
                </div>
              </template>
              <div class="text item">
                <el-switch v-model="airConditionOn" @change="toggleAirCondition" :class="currentMode === 'cool' ? 'cool-swi' : 'warm-swi'"></el-switch>
                <div class="air-status" v-show="airConditionOn">
                  {{ serving ? '正在送风' : '请求送风中' }}
                </div>
                <div class="update-time" v-show="lastUpdateTime">
                  上次更新: {{ lastUpdateTime }}
                </div>
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
              <div class="text item"
                   style="display:flex;justify-content:center;align-items:center;height:50px;">

                <el-tooltip :content="modeTooltip" placement="top">


                <span v-if="modeIcon.name === 'IceCreamRound'" class="mode-icon">
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
                <span>{{ billingDetail.totalCost !== undefined ? formatCurrency(billingDetail.totalCost) : '加载中...' }}</span>
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
                <el-button type="primary" circle @click="decreaseTemperature" :class="currentMode === 'cool' ? 'cool-btn' : 'warm-btn'">
                  <el-icon><Minus /></el-icon>
                </el-button>
                <span style="font-size: 24px;" class="value-box">{{ targetTemperature }}℃</span>
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
                <span>{{ billingInfo.totalCost !== undefined ? formatCurrency(billingInfo.totalCost) : formatCurrency(localBillingData.totalCost) }}</span>
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
                  @click="setFanSpeed('LOW')"
                  :type="fanSpeed === 'LOW' ? (currentMode === 'cool' ? 'primary' : 'warning') : 'default'"
                  style="width: 20%; margin-right: 5%"
                >
                  低风
                </el-button>

                <el-button
                  @click="setFanSpeed('MEDIUM')"
                  :type="fanSpeed === 'MEDIUM' ? (currentMode === 'cool' ? 'primary' : 'warning') : 'default'"
                  style="width: 20%; margin-right: 5%"
                >
                中风
                </el-button>

                <el-button
                  @click="setFanSpeed('HIGH')"
                  :type="fanSpeed === 'HIGH' ? (currentMode === 'cool' ? 'primary' : 'warning') : 'default'"
                  style="width: 20%"
                >
                  高风
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </BaseLayout>
</template>

<script>
import BaseLayout from "@/components/Layout/BaseLayout.vue";
import SidebarClient from '@/components/Layout/SidebarClient.vue';
import { Sunny, IceCreamRound, Minus, Plus, Refresh } from '@element-plus/icons-vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
  name: 'ClientView',
  components: {
    BaseLayout,
    Sunny,
    IceCreamRound,
    Minus,
    Plus,
    Refresh
  },
  computed: {
    numericRoomNumber() {
      return Number(this.roomNumber);
    },
    // 自动计算当前模式
    currentMode() {
      return this.targetTemperature > this.currentTemperature ? 'warm' : 'cool';
    },
    // 动态图标组件
    modeIcon() {
      const icon = this.currentMode === 'warm' ? Sunny : IceCreamRound;
    console.log('modeIcon的值:', icon.name);
    return icon;

    },
    // 模式提示信息
    modeTooltip() {
      return this.currentMode === 'warm' ? '当前为制热模式（目标温度高于当前温度）' : '当前为制冷模式（目标温度低于当前温度）';
    }
  },
  data() {
    return {
      currentTemperature: 27,
      airConditionOn: false,
      targetTemperature: 23.5,
      fanSpeed: 'LOW',
      sidebarComp: SidebarClient,
      roomNumber: '',
      loading: true,
      errorMsg: null,
      billingInfo: {}, // 账单信息
      billingDetail: {}, // 详单信息
      loadingBilling: false, // 账单加载状态
      loadingDetail: false, // 详单加载状态
      serving: false,
      localBillingData: {
        totalCost: 128.50,
        checkInTime: '2025-05-20 14:30',
        checkOutTime: '未退房',
        stayCost: 100.00,
        acCost: 28.50
      },
      refreshTimer: null,
      lastUpdateTime: null,
      isPeriodicRefresh: false
    };
  },
  async mounted() {
    this.roomNumber = this.$route.query.room || '未知房间';
    document.title = `房间 ${this.roomNumber} - 空调控制`;

    await Promise.all([
      this.loadRoomStatus(),
      this.refreshDetail(),
      this.refreshBilling()
    ]);

    this.startPeriodicRefresh();
  },
  beforeUnmount() {
    this.stopPeriodicRefresh();
  },
  methods: {
    mapWindSpeed(speed) {
      if (!speed) return null;
      const mapping = {
        "LOW": "low",
        "MEDIUM": "medium",
        "HIGH": "high"
      };
      return mapping[speed.toUpperCase()] || speed.toLowerCase();
    },

    async loadRoomStatus() {
      try {
        this.loading = true;
        const response = await axios.get(`/api/room/${this.roomNumber}/status`);
        const status = response.data;

        this.currentTemperature = status.currentTemp || 27;
        this.targetTemperature = status.targetTemp || 23.5;
        this.airConditionOn = status.acOn || false;
        this.fanSpeed = status.fanSpeed || 'LOW';
        this.serving = status.serving || false;

        console.log("房间状态已加载:", status);
        ElMessage.success('房间信息加载成功');
      } catch (error) {
        console.error("获取房间状态失败:", error);
        this.errorMsg = `获取房间信息失败: ${error.message}`;
        ElMessage.error(this.errorMsg);
      } finally {
        this.loading = false;
      }
    },

    async refreshDetail() {
      this.loadingDetail = true;

      try {
        const response = await axios.get(`/api/room/${this.roomNumber}/billing/detail`);
        this.billingDetail = response.data;
        console.log("详单信息已加载:", this.billingDetail);
      } catch (error) {
        console.error("获取详单失败:", error);
        if (!this.isPeriodicRefresh) {
          ElMessage.error('获取详单失败');
        }
      } finally {
        this.loadingDetail = false;
      }
    },

    async refreshBilling() {
      this.loadingBilling = true;

      try {
        const response = await axios.get(`/api/room/${this.roomNumber}/billing`);

        if (response.status === 200) {
          this.billingInfo = response.data;
          console.log("账单信息已加载:", this.billingInfo);
        } else {
          throw new Error(`获取账单失败: ${response.status}`);
        }
      } catch (error) {
        console.error("获取账单失败:", error);
        if (!this.isPeriodicRefresh) {
          ElMessage.warning('账单信息加载失败，使用本地模拟数据');
        }
        this.billingInfo = this.localBillingData;
      } finally {
        this.loadingBilling = false;
      }
    },

    formatCurrency(value) {
      if (value === undefined || value === null || isNaN(value)) return '0.00';
      return parseFloat(value).toFixed(2);
    },

    async setFanSpeed(speed) {
      try {
        await axios.post(`/api/room/${this.roomNumber}/ac/set-speed`, null, {
          params: { speed }
        });

        this.fanSpeed = speed;
        ElMessage.success(`风速已设置为${speed === 'LOW' ? '低风' : speed === 'MEDIUM' ? '中风' : '高风'}`);
      } catch (error) {
        console.error("设置风速失败:", error);
        ElMessage.error('设置风速失败');
      }
    },

    async increaseTemperature() {
      if (this.targetTemperature < 30) {
        try {
          const newTemp = this.targetTemperature + 0.5;
          await axios.post(`/api/room/${this.roomNumber}/ac/set-temp`, null, {
            params: { temp: newTemp }
          });

          this.targetTemperature = newTemp;
          ElMessage.success(`目标温度已设置为${newTemp}℃`);
        } catch (error) {
          console.error("设置温度失败:", error);
          ElMessage.error('设置温度失败');
        }
      }
    },

    async decreaseTemperature() {
      if (this.targetTemperature > 16) {
        try {
          const newTemp = this.targetTemperature - 0.5;
          await axios.post(`/api/room/${this.roomNumber}/ac/set-temp`, null, {
            params: { temp: newTemp }
          });

          this.targetTemperature = newTemp;
          ElMessage.success(`目标温度已设置为${newTemp}℃`);
        } catch (error) {
          console.error("设置温度失败:", error);
          ElMessage.error('设置温度失败');
        }
      }
    },

    async toggleAirCondition(value) {
      try {
        if (value) {
          await axios.post(`/api/room/${this.roomNumber}/ac/start`);
          ElMessage.success('空调已开启');
        } else {
          await axios.post(`/api/room/${this.roomNumber}/ac/stop`);
          ElMessage.success('空调已关闭');
        }
      } catch (error) {
        console.error("操作失败", error.message);
        this.airConditionOn = !value;
        ElMessage.error('操作失败');
      }
    },

    startPeriodicRefresh() {
      this.stopPeriodicRefresh();

      this.refreshTimer = setInterval(async () => {
        this.isPeriodicRefresh = true;
        try {
          await Promise.all([
            this.refreshDetail(),
            this.updateServingStatus()
          ]);

          this.lastUpdateTime = new Date().toLocaleTimeString();
          console.log('数据已定时刷新');
        } catch (error) {
          console.error('定时刷新失败:', error);
        } finally {
          this.isPeriodicRefresh = false;
        }
      }, 5000);

      console.log('已启动定时刷新，间隔5秒');
    },

    stopPeriodicRefresh() {
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer);
        this.refreshTimer = null;
        console.log('已停止定时刷新');
      }
    },

    async updateServingStatus() {
      try {
        const response = await axios.get(`/api/room/${this.roomNumber}/status`);
        const status = response.data;
        this.serving = status.serving || false;
      } catch (error) {
        console.error("获取serving状态失败:", error);
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

.main-card {
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: var(--el-box-shadow-light);
  margin: 10px 15px 0 10px;
  flex: 1;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.mode-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease-in-out;
  color: white;
  width: 30px; /* 添加宽度 */
  height: 30px; /* 添加高度 */
  z-index:999;
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
  background: #0678f2;
  color: white;
  opacity:0.5
}

.cool-theme .value-box {
  background-color: #e0f7ff;
  color: #1e90ff;
}

/* 制热模式下的样式 */
.warm-theme .box-card {
  background:#f29606;
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

/* 新增送风状态样式 */
.air-status {
  font-size: 14px;
  color: #ffffff;
  margin-top: 8px;
  opacity: 0.8;
}

/* 新增更新时间样式 */
.update-time {
  font-size: 12px;
  color: #f0f0f0;
  margin-top: 5px;
  opacity: 0.6;
}

</style>