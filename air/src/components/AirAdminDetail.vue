<template>
  <el-card class="air-admin-detail-card">
    <template #header>
      <div class="card-header">
        <i class="el-icon-office-building"></i>
        <span>房间号：{{ localSelectedRoom.roomId }}</span>
        <div class="temperature-indicator" :class="{ 'on': isACOn }">
          <i class="el-icon-thermometer"></i> {{ currentTemperature }}℃
        </div>
      </div>
    </template>

    <!-- 当前温度 -->
    <el-row :gutter="20" align="middle" style="margin-bottom: 20px;">
      <el-col :span="6" class="label">
        <i class="el-icon-thermometer"></i> 当前温度
      </el-col>
      <el-col :span="18">
        <el-input v-model="currentTemperature" disabled>
          <template #append>℃</template>
        </el-input>
      </el-col>
    </el-row>

    <el-divider></el-divider>

    <!-- 目标温度 -->
    <el-row :gutter="20" align="middle" style="margin-bottom: 20px;">
      <el-col :span="6" class="label">
        <i class="el-icon-thermometer"></i> 目标温度
      </el-col>
      <el-col :span="18">
        <el-input v-model="targetTemperature" disabled>
          <template #append>℃</template>
        </el-input>
      </el-col>
    </el-row>

    <el-divider></el-divider>

    <!-- 风速选择（单选框样式，禁用状态） -->
    <el-row :gutter="20" align="middle" style="margin-bottom: 20px;">
      <el-col :span="6" class="label">
        <i class="el-icon-wind-power"></i> 风速选择
      </el-col>
      <el-col :span="18">
        <el-radio-group v-model="selectedWindSpeed" disabled>
          <el-radio label="LOW" border><i class="el-icon-bottom"></i> 低风</el-radio>
          <el-radio label="MEDIUM" border><i class="el-icon-minus"></i> 中风</el-radio>
          <el-radio label="HIGH" border><i class="el-icon-top"></i> 高风</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>

    <!-- 关闭按钮 -->
    <el-row type="flex" justify="end">
      <el-button type="primary" @click="$emit('close')">
        <i class="el-icon-close"></i> 关闭
      </el-button>
    </el-row>

    <!-- 装饰小风扇图标 -->
    <div class="fan-decoration" :class="{ rotating: isServingOn }">
      <svg viewBox="0 0 48 48" width="48" height="48">
        <circle cx="24" cy="24" r="5" fill="#409EFF"/>
        <line x1="24" y1="5" x2="24" y2="12" stroke="#409EFF" stroke-width="2"/>
        <line x1="24" y1="36" x2="24" y2="43" stroke="#409EFF" stroke-width="2"/>
        <line x1="5" y1="24" x2="12" y2="24" stroke="#409EFF" stroke-width="2"/>
        <line x1="36" y1="24" x2="43" y2="24" stroke="#409EFF" stroke-width="2"/>
        <line x1="10" y1="10" x2="17" y2="17" stroke="#409EFF" stroke-width="2"/>
        <line x1="31" y1="31" x2="38" y2="38" stroke="#409EFF" stroke-width="2"/>
        <line x1="10" y1="38" x2="17" y2="31" stroke="#409EFF" stroke-width="2"/>
        <line x1="31" y1="10" x2="38" y2="17" stroke="#409EFF" stroke-width="2"/>
      </svg>
    </div>
  </el-card>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'AirAdminDetail',
  props: {
    selectedRoom: {
      type: Object,
      required: true
    },
    monitoringData: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const localSelectedRoom = ref(JSON.parse(JSON.stringify(props.selectedRoom)));
    const currentTemperature = ref(null);
    const targetTemperature = ref(null);
    const selectedWindSpeed = ref('LOW'); // 初始值设为低风
    const isACOn = ref(false);
    const isServingOn = ref(false);

    // 从监控数据中更新房间状态
    const updateRoomStatus = () => {
      if (!props.monitoringData || !localSelectedRoom.value.roomId) return;

      const roomData = props.monitoringData.find(
        room => room.roomId === localSelectedRoom.value.roomId
      );

      if (roomData) {
        currentTemperature.value = roomData.currentTemp;
        targetTemperature.value = roomData.targetTemp;
        selectedWindSpeed.value = roomData.fanSpeed || 'LOW'; // 确保有默认值
        isACOn.value = roomData.acOn;
        isServingOn.value = roomData.serving;
      }
    };

    // 监听房间变化
    watch(
      () => props.selectedRoom,
      (newVal) => {
        localSelectedRoom.value = JSON.parse(JSON.stringify(newVal));
        updateRoomStatus();
      },
      { immediate: true }
    );

    // 监听监控数据变化
    watch(
      () => props.monitoringData,
      updateRoomStatus,
      { immediate: true }
    );

    return {
      localSelectedRoom,
      currentTemperature,
      targetTemperature,
      selectedWindSpeed,
      isACOn,
      isServingOn
    };
  }
};
</script>

<style scoped>
.air-admin-detail-card {
  max-width: 620px;
  margin: 40px auto;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  background: linear-gradient(to bottom right, #f8fbff, #ffffff);
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.5s ease-in-out;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.temperature-indicator {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 14px;
  background-color: #eef2ff;
  color: #409EFF;
  transition: all 0.3s ease;
}

.temperature-indicator.on {
  background-color: #d7ebff;
  color: #1a73e8;
  font-weight: bold;
}

.label {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
}

.el-divider {
  margin: 20px 0;
}

.el-radio-group .el-radio {
  margin-right: 10px;
}

.el-radio__label {
  display: flex;
  align-items: center;
}

.el-radio__label i {
  margin-right: 4px;
}

.fan-decoration {
  position: absolute;
  bottom: 0px;
  right: 100px;
  opacity: 0.15;
  z-index: 10;
}

.fan-decoration svg {
  width: 64px;
  height: 64px;
}

/* 空调开启时风扇旋转 */
.fan-decoration.rotating svg {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>