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
        <i class="el-icon-sunrise-1"></i> 目标温度
      </el-col>
      <el-col :span="18">
        <el-slider v-model="targetTemperature" :min="16" :max="30" show-input @change="updateTargetTemperature">
        </el-slider>
      </el-col>
    </el-row>

    <el-divider></el-divider>

    <!-- 风速选择 -->
    <el-row :gutter="20" align="middle" style="margin-bottom: 20px;">
      <el-col :span="6" class="label">
        <i class="el-icon-wind-power"></i> 风速选择
      </el-col>
      <el-col :span="18">
        <el-radio-group v-model="selectedWindSpeed" @change="updateWindSpeed">
          <el-radio label="低风" border><i class="el-icon-bottom"></i> 低风</el-radio>
          <el-radio label="中风" border><i class="el-icon-minus"></i> 中风</el-radio>
          <el-radio label="高风" border><i class="el-icon-top"></i> 高风</el-radio>
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
    <div class="fan-decoration">
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
// 引入你定义好的 mock 接口函数
import { getAirConditionStatus, setTargetTemperature, setWindSpeed } from '@/mockData.js'; // 根据你的路径调整

export default {
  name: 'AirAdminDetail',
  props: {
    selectedRoom: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const localSelectedRoom = ref(JSON.parse(JSON.stringify(props.selectedRoom)));
    const currentTemperature = ref(null);
    const targetTemperature = ref(22); // 初始值为22°C
    const selectedWindSpeed = ref('低风'); // 初始值为低风

    // 使用你定义的 getAirConditionStatus 获取空调状态
    const loadAirConditionStatus = async () => {
      try {
        const response = await getAirConditionStatus(localSelectedRoom.value.roomId);
        const status = response.data;

        currentTemperature.value = status.currentTemperature;
        targetTemperature.value = status.targetTemperature;
        selectedWindSpeed.value = status.windSpeed;
      } catch (error) {
        console.error('获取空调状态失败:', error);
        // 设置默认值或提示用户重试
        currentTemperature.value = 25;
        targetTemperature.value = 22;
        selectedWindSpeed.value = '低风';
      }
    };

    // 更新目标温度
    const updateTargetTemperature = async (newTemp) => {
    //console.log(`Attempting to set target temperature to ${newTemp}`);
      try {
        await setTargetTemperature(localSelectedRoom.value.roomId, newTemp);
        //console.log(`Successfully updated target temperature to ${newTemp}`);
        targetTemperature.value = newTemp; // 更新本地状态
      } catch (error) {
        console.error('更新目标温度失败:', error);
      }
    };

    // 更新风速
    const updateWindSpeed = async (newSpeed) => {
      try {
        console.log('正在调用 setWindSpeed 接口...');
        await setWindSpeed(localSelectedRoom.value.roomId, newSpeed);
        console.log('✅ 接口调用成功，更新本地状态');
        selectedWindSpeed.value = newSpeed; // 更新本地状态
        console.log('📌 当前本地风速已更新为:', selectedWindSpeed.value);
      } catch (error) {
        console.error('❌ 更新风速失败:', error.message || error);
      }
    };



    // 监听 selectedRoom 的变化，当 roomId 变化时重新加载空调状态
    watch(
      () => props.selectedRoom,
      (newVal) => {
        localSelectedRoom.value = JSON.parse(JSON.stringify(newVal));
        loadAirConditionStatus();
      },
      { immediate: true, deep: true }
    );

    // 初次加载
    loadAirConditionStatus();

    return {
      localSelectedRoom,
      currentTemperature,
      targetTemperature,
      selectedWindSpeed,
      updateTargetTemperature,
      updateWindSpeed
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

.fan-decoration {
  position: absolute;
  bottom: 0px;
  right: 100px;
  opacity: 0.15;
  transition: transform 0.5s ease-in-out;
  z-index: 10; /* 确保图标不被其他元素遮盖 */
}
.fan-decoration svg {
  width: 64px; /* 根据需要调整大小 */
  height: 64px; /* 根据需要调整大小 */
}

.fan-decoration:hover {
  transform: rotate(360deg);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.fan-icon {

}

</style>