<template>
  <BaseLayout :sidebarComponent="sidebarComp">
    <div class="air-condition-manager">
    <el-card shadow="always" class="main-card">
      <template #header>
            <div class="card-header">
              <span>空调管理员监控界面</span>
            </div>
          <!-- 中央空调控制按钮 -->
          <div class="central-air-controls" style="margin: 20px;">
            <el-button type="primary" @click="startSystem" :loading="isStarting">开启空调系统</el-button>
            <el-button type="info" @click="stopSystem" :loading="isStopping">关闭空调系统</el-button>
            <el-tag v-if="systemStatus">{{ systemStatus }}</el-tag>
          </div>
      </template>
      <div class="room-list">
        <div class="room-row" v-for="(row, rowIndex) in chunkedAllRooms" :key="rowIndex">
          <RoomCard_1
            v-for="room in row"
            :key="room.roomId"
            :roomId="room.roomId"
            :occupied="room.occupied"
            :checkInTime="room.checkInTime"
            :checkOutTime="room.checkOutTime"
            :monitoring-data="roomMonitoringData"
            :is-air-conditioning-enabled="room.acOn"
            @toggle-air-conditioning="handleUpdateACStatus"
            @click="showDetailDialog(room)"
          />
        </div>
      </div>
    </el-card>
      <!-- 房间详情界面 -->
    <div v-if="selectedRoom" class="room-detail-container">
      <div class="room-detail">
        <component
          :is="currentComponent"
          :selected-room="selectedRoom"
          :monitoring-data="roomMonitoringData"
          @update:ac="handleUpdateACStatus"
          @close="closeDetail"
        />
      </div>
    </div>
    </div>
  </BaseLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import RoomCard_1 from '@/components/RoomCard_1.vue';
import AirAdminDetail from '@/components/AirAdminDetail.vue';
import BaseLayout from "@/components/Layout/BaseLayout.vue";
import SidebarAirAdmin from '@/components/Layout/SidebarAirAdmin.vue';
import { ElMessage } from 'element-plus';

// 创建axios实例
const service = axios.create({
  baseURL: '/', // 后端API基础路径
  timeout: 10000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response; // 直接返回原始响应，便于处理不同结构
  },
  error => {
    console.error('响应错误:', error);
    return Promise.reject(error);
  }
);

export default {
  name: 'AirAdminPage',
  components: {
    RoomCard_1,
    BaseLayout,
    AirAdminDetail
  },
  setup() {
    const remainingRooms = ref([]);
    const roomsPerRow = 5;
    const selectedRoom = ref(null);
    const currentComponent = ref(AirAdminDetail);
    const isStarting = ref(false);
    const isStopping = ref(false);
    const systemStatus = ref('');
    const roomMonitoringData = ref([]); // 存储监控数据

    // 获取监控数据的方法
    const fetchMonitoringData = async () => {
      try {
        const response = await service.get('/api/admin/monitoring');
        roomMonitoringData.value = response.data || []; // 确保是数组
        console.log('【空调监控数据】', roomMonitoringData.value);
      } catch (error) {
        console.error('获取监控数据失败:', error);
        ElMessage.error('监控数据获取失败');
      }
    };

    // 关闭房间详情
    const closeDetail = () => {
      selectedRoom.value = null;
    };

    // 获取房间数据的方法（优化后）
    const getRemainingRoomsData = async () => {
      try {
        const response = await service.get('/api/remaining-room');
        // 处理接口可能返回的两种格式：{data: []} 或直接返回数组
        const data = response.data || response;
        if (Array.isArray(data)) {
          remainingRooms.value = data;
          console.log('【房间数据】', remainingRooms.value);
        } else {
          console.error('接口返回数据格式错误，需为数组');
          ElMessage.error('房间数据格式错误');
        }
      } catch (error) {
        console.error('获取房间数据失败:', error);
        ElMessage.error('获取房间数据失败，请重试');
      }
    };

    // 加载房间数据（含初始化状态）
    const loadRoomData = async () => {
      await getRemainingRoomsData();
      // 确保数据存在且为数组后再处理
      if (Array.isArray(remainingRooms.value)) {
        remainingRooms.value = remainingRooms.value.map(room => ({
          ...room,
          isAirConditioningOn: room.acOn || false // 使用接口中的acOn状态（如果有）
        }));
      }
    };

    // 获取系统状态
    const fetchSystemStatus = async () => {
      try {
        const response = await service.get('/api/admin/system/status');
        systemStatus.value = response.data || '状态未知';
      } catch (error) {
        console.error('获取系统状态失败:', error);
        systemStatus.value = '状态未知';
      }
    };

    // 开启中央空调系统
    const startSystem = async () => {
      if (isStarting.value) return;
      isStarting.value = true;
      try {
        await service.post('/api/admin/system/start');
        await fetchSystemStatus();
        ElMessage.success('中央空调系统已成功开启');
      } catch (error) {
        console.error('开启系统失败:', error);
        ElMessage.error('开启中央空调系统失败');
      } finally {
        isStarting.value = false;
      }
    };

    // 关闭中央空调系统
    const stopSystem = async () => {
      if (isStopping.value) return;
      isStopping.value = true;
      try {
        await service.post('/api/admin/system/stop');
        await fetchSystemStatus();
        ElMessage.success('中央空调系统已成功关闭');
      } catch (error) {
        console.error('关闭系统失败:', error);
        ElMessage.error('关闭中央空调系统失败');
      } finally {
        isStopping.value = false;
      }
    };

    onMounted(() => {
      loadRoomData();
      fetchSystemStatus();
      fetchMonitoringData();

      // 定时刷新数据（示例）
      const systemStatusInterval = setInterval(fetchSystemStatus, 5000);
      const monitoringInterval = setInterval(fetchMonitoringData, 10000);

      return () => {
        clearInterval(systemStatusInterval);
        clearInterval(monitoringInterval);
      };
    });

    // 计算属性（增强空值处理）
    const allRooms = computed(() => {
      return remainingRooms.value || [];
    });

    const chunkedAllRooms = computed(() => {
      const rooms = allRooms.value || [];
      const chunks = [];
      for (let i = 0; i < rooms.length; i += roomsPerRow) {
        chunks.push(rooms.slice(i, i + roomsPerRow));
      }
      return chunks;
    });

    // 显示房间详情
    const showDetailDialog = (room) => {
      selectedRoom.value = { ...room }; // 深拷贝避免响应式污染
    };

    // 处理空调状态更新
    const handleUpdateACStatus = ({ roomId, newValue }) => {
      const room = remainingRooms.value.find(r => r.roomId === roomId);
      if (room) {
        room.isAirConditioningOn = newValue;
        // 这里可以添加发送更新到后端的逻辑（如果需要）
        // service.patch(`/api/rooms/${roomId}/ac`, { acOn: newValue });
      }
    };

    return {
      chunkedAllRooms,
      selectedRoom,
      currentComponent,
      showDetailDialog,
      closeDetail,
      sidebarComp: SidebarAirAdmin,
      systemStatus,
      isStarting,
      isStopping,
      handleUpdateACStatus,
      startSystem,
      stopSystem,
      roomMonitoringData
    };
  }
};
</script>

<style scoped>
.central-air-controls {
  display: flex;
  gap: 15px;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
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
.room-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-left: 20px;
  margin-right: 20px;
}

.room-detail-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明遮罩层 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 确保在其他元素之上 */
}

.room-detail {
  background-color: transparent;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  width: 60%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
}


.room-row {
  display: flex;
  gap: 8px;
}
</style>