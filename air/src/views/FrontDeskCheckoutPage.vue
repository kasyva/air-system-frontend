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
    <el-dialog v-model="dialogVisible" title="退房详情" width="80%" top="0vh">
      <component :is="currentComponent" :selected-room="selectedRoom" @close="dialogVisible = false" @confirmCheckout="confirmCheckout"></component>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import RoomCard from '@/components/RoomCard.vue'; // 确保路径正确
import { getRemainingRooms} from '@/mockData.js'; // 假设 mockData 中包含 checkout 接口
import CheckoutDetail from '@/components/CheckoutDetail.vue'; // 引入 CheckoutDetail 组件
import { ElMessage } from "element-plus";
//import { mapState, mapActions, mapGetters } from 'vuex'
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
        console.log("加载的房间数据:", response.data);
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
      console.log("展示退房弹窗，房间信息为：", room); // 打印 room 数据
      selectedRoom.value = { ...room }; // 深拷贝避免修改原始数据
      dialogVisible.value = true;
    };


    const confirmCheckout = (roomId) => {
      dialogVisible.value = false;
      ElMessage.success(`房间 ${roomId} 已提交退房请求`);
      selectedRoom.value = null; // 清空选择的房间

      // 移除已退房的房间
      remainingRooms.value = remainingRooms.value.filter(room => room.roomId !== roomId);
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