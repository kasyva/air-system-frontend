<template>
  <div class="checkout-page">
    <!-- 页面标题 -->
    <!-- 显示已入住房间列表 -->
    <div v-if="occupiedRooms.length > 0" class="room-list">
      <div class="room-row" v-for="(row, rowIndex) in chunkedOccupiedRooms" :key="rowIndex">
        <RoomCard
          v-for="room in row"
          :key="room.roomId"
          :room-id="room.roomId"
          :occupied="true"
          :check-in-time="room.checkInTime"
          :check-out-time="room.checkOutTime"
          @click="showCheckoutDialog(room)"
        />
      </div>
    </div>

    <!-- 没有已入住房间时的提示 -->
    <div v-else class="no-rooms">
      暂无已入住房间。
    </div>

    <!-- 弹窗：显示 CheckoutDetail 组件 -->
    <el-dialog v-model="dialogVisible" title="退房详情" width="60%" top="5vh">
      <component :is="currentComponent" :selected-room="selectedRoom" @close="dialogVisible = false" @confirmCheckout="confirmCheckout"></component>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import RoomCard from '@/components/RoomCard.vue'; // 确保路径正确
import { getRemainingRooms, checkout } from '@/mockData.js'; // 假设 mockData 中包含 checkout 接口
import CheckoutDetail from '@/components/Layout/CheckoutDetail.vue'; // 引入 CheckoutDetail 组件
import { ElMessage } from "element-plus";

export default {
  name: 'FrontDeskCheckout',
  components: {
    RoomCard,
  },
  setup() {
    const remainingRooms = ref([]); // 存储所有房间数据
    const roomsPerRow = 5; // 每行显示5个房间
    const dialogVisible = ref(false); // 控制弹窗显示
    const selectedRoom = ref(null); // 当前选择的房间
    const currentComponent = ref(CheckoutDetail); // 动态组件引用

    // 加载页面时获取房间数据
    const loadRoomData = async () => {
      try {
        const response = await getRemainingRooms(); // 获取房间信息
        remainingRooms.value = response.data;
      } catch (error) {
        console.error('获取房间数据失败:', error);
      }
    };

    onMounted(() => {
      loadRoomData();
    });

    // 过滤出已入住的房间
    const occupiedRooms = computed(() => {
      return remainingRooms.value.filter(room => room.occupied === true);
    });

    // 将已入住的房间按每行指定数量分块
    const chunkedOccupiedRooms = computed(() => {
      const chunks = [];
      for (let i = 0; i < occupiedRooms.value.length; i += roomsPerRow) {
        chunks.push(occupiedRooms.value.slice(i, i + roomsPerRow));
      }
      return chunks;
    });

    // 显示退房弹窗并加载当前房间数据
    const showCheckoutDialog = (room) => {
      selectedRoom.value = { ...room }; // 深拷贝避免修改原始数据
      dialogVisible.value = true;
    };

    // 确认退房逻辑
    const confirmCheckout = async () => {
      if (!selectedRoom.value) return;

      try {
        await checkout({ roomId: selectedRoom.value.roomId }); // 调用退房接口

        // 更新本地状态
        const index = remainingRooms.value.findIndex(
          r => r.roomId === selectedRoom.value.roomId
        );
        if (index !== -1) {
          remainingRooms.value[index].occupied = false;
          remainingRooms.value[index].checkInTime = null;
          remainingRooms.value[index].checkOutTime = null;
        }

        dialogVisible.value = false;
        ElMessage.success(`房间 ${selectedRoom.value.roomId} 退房成功`);
        selectedRoom.value = null;
      } catch (error) {
        console.error("退房失败:", error);
        ElMessage.error("退房失败，请重试");
      }
    };

    return {
      occupiedRooms,
      chunkedOccupiedRooms,
      dialogVisible,
      selectedRoom,
      currentComponent,
      showCheckoutDialog,
      confirmCheckout,
    };
  }
};
</script>

<style scoped>
.checkout-page {
  padding: 20px;
}

.room-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.room-row {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.no-rooms {
  font-size: 16px;
  color: #999;
  text-align: center;
  margin-top: 40px;
}
</style>