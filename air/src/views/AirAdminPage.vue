<template>
  <BaseLayout :sidebarComponent="sidebarComp">
    <div class="air-condition-manager">
      <!-- 中央空调控制按钮 -->
      <div class="central-air-controls" style="margin: 20px;">
        <el-button type="primary" @click="startSystem" :loading="isStarting">开启空调系统</el-button>
        <el-button type="info" @click="stopSystem" :loading="isStopping">关闭空调系统</el-button>
        <el-tag v-if="systemStatus">{{ systemStatus }}</el-tag>
      </div>

      <div class="room-list">
        <div class="room-row" v-for="(row, rowIndex) in chunkedAllRooms" :key="rowIndex">
          <RoomCard_1
            v-for="room in row"
            :key="room.roomId"
            :roomId="room.roomId"
            :occupied="room.occupied"
            :checkInTime="room.checkInTime"
            :checkOutTime="room.checkOutTime"
            :is-air-conditioning-enabled="room.isAirConditioningOn"
            @toggle-air-conditioning="handleUpdateACStatus"
            @click="showDetailDialog(room)"
          />
        </div>
      </div>

      <!-- 房间详情界面 -->
    <div v-if="selectedRoom" class="room-detail-container">
      <div class="room-detail">
        <component
          :is="currentComponent"
          :selected-room="selectedRoom"
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
import { getRemainingRooms } from '@/mockData.js'; // 假设这是你获取房间数据的方法
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
    // 可以在此添加请求头，如token
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
    return response.data;
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

    // 新增：监控数据相关变量
    const roomMonitoringData = ref([]); // 存储监控数据

    // 新增：获取监控数据的方法
    const fetchMonitoringData = async () => {
      try {
        const response = await service.get('/api/admin/monitoring');
        roomMonitoringData.value = response; // 保存数据到响应式变量
        console.log('【空调监控数据】', response); // 在控制台输出数据
      } catch (error) {
        console.error('获取监控数据失败:', error);
        ElMessage.error('监控数据获取失败');
      }
    };

    // 新增方法用于关闭房间详情
    const closeDetail = () => {
      selectedRoom.value = null;
    };

    const loadRoomData = async () => {
      try {
        const response = await getRemainingRooms();
        remainingRooms.value = response.data.map(room => ({
          ...room,
          isAirConditioningOn: false // 初始化空调状态
        }));
      } catch (error) {
        console.error('获取房间数据失败:', error);
      }
    };

    // 获取系统状态
    const fetchSystemStatus = async () => {
      try {
        const response = await service.get('/api/admin/system/status');
        systemStatus.value = response;
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
      fetchMonitoringData(); // 初始加载时获取监控数据

      // 定时刷新系统状态和监控数据（示例：每5秒刷新系统状态，每10秒刷新监控数据）
      const systemStatusInterval = setInterval(fetchSystemStatus, 5000);
      const monitoringInterval = setInterval(fetchMonitoringData, 10000);

      // 组件卸载时清除定时器
      return () => {
        clearInterval(systemStatusInterval);
        clearInterval(monitoringInterval);
      };
    });

    const allRooms = computed(() => {
      return remainingRooms.value;
    });

    const chunkedAllRooms = computed(() => {
      const chunks = [];
      for (let i = 0; i < allRooms.value.length; i += roomsPerRow) {
        chunks.push(allRooms.value.slice(i, i + roomsPerRow));
      }
      return chunks;
    });

    const showDetailDialog = (room) => {
      selectedRoom.value = { ...room }; // 深拷贝当前房间对象
    };

    // 处理从弹窗中更新空调状态
    const handleUpdateACStatus = ({ roomId, newValue }) => {
      const room = remainingRooms.value.find(r => r.roomId === roomId);
      if (room) {
        room.isAirConditioningOn = newValue;
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
      roomMonitoringData // 可选：如果需要在模板中展示监控数据
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