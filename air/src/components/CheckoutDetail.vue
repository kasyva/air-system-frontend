<template>
  <BaseLayout :sidebarComponent="sidebarComp">
    <div class="air-condition-manager">
      <h2>空调管理员界面</h2>

      <!-- 房间列表 -->
      <div class="room-list">
        <div class="room-row" v-for="(room, index) in allRooms" :key="index">
          <RoomCard
            :room-id="room.roomId"
            :occupied="room.occupied"
            :check-in-time="room.checkInTime"
            :check-out-time="room.checkOutTime"
            :handle-click="() => showDetailDialog(room)"
          />
        </div>
      </div>

      <!-- 弹窗：显示 AirAdminDetail -->
      <el-dialog v-model="dialogVisible" title="房间详情" width="60%" top="5vh">
        <component :is="currentComponent" :selected-room="selectedRoom" @close="dialogVisible = false" />
      </el-dialog>
    </div>
  </BaseLayout>
</template>

<script>
import { ref } from 'vue';
import RoomCard from '@/components/RoomCard.vue'; // 房间卡片组件
import AirAdminDetail from '@/components/AirAdminDetail.vue'; // 房间详情弹窗组件
import { getRemainingRooms } from '@/mockData.js'; // 获取房间数据
import BaseLayout from "@/components/Layout/BaseLayout.vue";
import SidebarAirAdmin from '@/components/Layout/SidebarAirAdmin.vue';

export default {
  name: 'AirAdminPage',
  components: {
    RoomCard,
    BaseLayout
  },
  setup() {
    const allRooms = ref([]); // 所有房间列表
    const dialogVisible = ref(false); // 控制弹窗显示
    const selectedRoom = ref(null); // 当前选中的房间
    const currentComponent = ref(AirAdminDetail); // 要加载的弹窗组件

    // 加载房间数据
    const loadRoomData = async () => {
      try {
        const response = await getRemainingRooms();
        allRooms.value = response.data;
      } catch (error) {
        console.error('获取房间数据失败:', error);
      }
    };

    // 点击房间卡打开弹窗
    const showDetailDialog = (room) => {
      selectedRoom.value = { ...room }; // 深拷贝避免污染原始数据
      dialogVisible.value = true;
    };

    // 页面加载时获取房间数据
    loadRoomData();

    return {
      allRooms,            // 所有房间
      dialogVisible,       // 控制弹窗是否显示
      selectedRoom,        // 当前选中房间
      currentComponent,    // 动态组件：AirAdminDetail
      showDetailDialog,    // 点击房间触发的方法
      sidebarComp: SidebarAirAdmin
    };
  }
};
</script>


<style scoped>
.front-desk-main {
  padding: 20px;
}

.box-card {
  height: auto;
}

.active {
  background-color: #409EFF;
  color: white;
}
</style>