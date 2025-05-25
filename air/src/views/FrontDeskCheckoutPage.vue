<template>
  <div class="checkout-page">
    <el-card shadow="always" class="main-card">
      <template #header>
        <div class="card-header">
          <span>已入住房间列表</span>
        </div>
      </template>

      <!-- 显示已入住房间列表 -->
      <div v-if="filteredOccupiedRooms.length > 0" class="room-list">
        <div class="room-row" v-for="(chunk, rowIndex) in chunkedOccupiedRooms" :key="rowIndex">
          <RoomCard
            v-for="room in chunk"
            :key="room.roomId"
            :room-id="room.roomId"
            :occupied="room.occupied"
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
    </el-card>

    <!-- 退房弹窗 -->
    <el-dialog v-model="dialogVisible" title="退房详情" width="80%" top="0vh">
      <CheckoutDetail
        :selected-room="selectedRoom"
        @close="handleDialogClose"
        @confirm-checkout="handleCheckoutConfirm"
      />
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElCard } from 'element-plus';
import RoomCard from '@/components/RoomCard.vue';
import CheckoutDetail from '@/components/CheckoutDetail.vue';
import axios from 'axios';

// 创建 axios 实例（可复用公共服务）
const service = axios.create({
  baseURL: '/', // 后端 API 基础路径
  timeout: 10000
});

export default {
  name: 'FrontDeskCheckout',
  components: {
    RoomCard,
    ElCard,
    CheckoutDetail
  },

  setup() {
    const allRooms = ref([]); // 存储所有房间数据（来自 remaining-room 接口）
    const dialogVisible = ref(false);
    const selectedRoom = ref(null);
    const roomsPerRow = 5; // 每行显示房间数

    // 计算属性：筛选出 occupied 为 true 的房间
    const filteredOccupiedRooms = computed(() => {
      return allRooms.value.filter(room => room.occupied === true);
    });

    // 计算属性：分块处理房间列表
    const chunkedOccupiedRooms = computed(() => {
      const chunks = [];
      for (let i = 0; i < filteredOccupiedRooms.value.length; i += roomsPerRow) {
        chunks.push(filteredOccupiedRooms.value.slice(i, i + roomsPerRow));
      }
      return chunks;
    });

    // 获取所有房间数据（调用 remaining-room 接口）
    const fetchAllRooms = async () => {
      try {
        const response = await service.get('/api/remaining-room'); // 接口路径需与后端一致
        allRooms.value = response.data;
        console.log('所有房间数据:', allRooms.value);
      } catch (error) {
        console.error('获取房间数据失败:', error);
        ElMessage.error('加载房间数据失败，请重试');
      }
    };

    // 显示退房弹窗
    const showCheckoutDialog = (room) => {
      selectedRoom.value = { ...room }; // 深拷贝避免响应式污染
      dialogVisible.value = true;
    };

    // 处理退房确认（示例：调用退房 API）
    const handleCheckoutConfirm = async (roomId) => {
      dialogVisible.value = false;
      try {
        // 调用退房接口（需根据后端逻辑调整）
        await service.post(`/api/rooms/${roomId}/checkout`);
        ElMessage.success(`房间 ${roomId} 退房成功`);
        // 刷新房间数据
        await fetchAllRooms();
        selectedRoom.value = null;
      } catch (error) {
        ElMessage.error('退房失败，请联系管理员');
        console.error('退房请求失败:', error);
      }
    };

    // 关闭弹窗
    const handleDialogClose = () => {
      selectedRoom.value = null;
    };

    onMounted(() => {
      fetchAllRooms(); // 初始化加载数据
    });

    return {
      allRooms,
      filteredOccupiedRooms,
      chunkedOccupiedRooms,
      dialogVisible,
      selectedRoom,
      showCheckoutDialog,
      handleCheckoutConfirm,
      handleDialogClose
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