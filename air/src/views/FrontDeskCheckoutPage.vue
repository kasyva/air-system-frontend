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
import { ElMessage } from 'element-plus';
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
    CheckoutDetail
  },

  setup() {
    const allRooms = ref([]); // 存储所有房间数据
    const dialogVisible = ref(false);
    const selectedRoom = ref(null);
    const roomsPerRow = 5; // 每行显示房间数
    const isProcessing = ref(false); // 新增：处理状态标志

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

    // 获取所有房间数据
    const fetchAllRooms = async () => {
      try {
        const response = await service.get('/api/remaining-room');
        allRooms.value = response.data || []; // 确保数据为数组
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

    // 关闭弹窗
    const handleDialogClose = () => {
      selectedRoom.value = null;
      // 重新加载房间数据
      dialogVisible.value = false;
      fetchAllRooms();
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
      handleDialogClose,
      isProcessing // 用于模板中显示加载状态
    };
  }
};
</script>

<style scoped>
.main-card {
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: var(--el-box-shadow-light);
  margin: 10px 15px 0 10px;
  flex: 1;
  height: 560px;
  min-height: 0;
  display: flex;
  flex-direction: column;
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