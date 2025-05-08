<template>
  <BaseLayout :sidebarComponent="sidebarComp">
    <div class="air-condition-manager">
      <!-- 中央空调控制按钮 -->
      <div class="central-air-controls" style="margin: 20px;">
        <el-button type="primary" @click="turnOnAllRoomsAC">开启中央空调</el-button>
        <el-button type="info" @click="turnOffAllRoomsAC">关闭中央空调</el-button>
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
import RoomCard_1 from '@/components/RoomCard_1.vue';
import AirAdminDetail from '@/components/AirAdminDetail.vue';
import { getRemainingRooms } from '@/mockData.js'; // 假设这是你获取房间数据的方法
import BaseLayout from "@/components/Layout/BaseLayout.vue";
import SidebarAirAdmin from '@/components/Layout/SidebarAirAdmin.vue';

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
    const dialogVisible = ref(false);
    const selectedRoom = ref(null);
    const currentComponent = ref(AirAdminDetail);
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

    onMounted(() => {
      loadRoomData();
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
      //dialogVisible.value = true;
    };

    // 处理从弹窗中更新空调状态
    const handleUpdateACStatus = ({ roomId, newValue }) => {
      const room = remainingRooms.value.find(r => r.roomId === roomId);
      if (room) {
        room.isAirConditioningOn = newValue;
      }
    };

    // 开启中央空调
    const turnOnAllRoomsAC = () => {
      remainingRooms.value.forEach(room => {
        room.isAirConditioningOn = true;
      });
    };

    // 关闭中央空调
    const turnOffAllRoomsAC = () => {
      remainingRooms.value.forEach(room => {
        room.isAirConditioningOn = false;
      });
    };

    return {
      chunkedAllRooms,
      dialogVisible,
      selectedRoom,
      currentComponent,
      showDetailDialog,
      closeDetail,
      sidebarComp: SidebarAirAdmin,

      // 方法
      handleUpdateACStatus,
      turnOnAllRoomsAC,
      turnOffAllRoomsAC
    };
  }
};
</script>

<style scoped>
.central-air-controls {
  display: flex;
  gap: 15px;
  justify-content: center; /* 水平居中 */
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