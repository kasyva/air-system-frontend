<template>
  <div class="front-desk">

    <!-- 顶部菜单 -->
    <el-menu :default-active="activeTab" mode="horizontal" @select="handleTabSelect" class="menu-bar">
      <el-menu-item index="checkin">入住</el-menu-item>
      <el-menu-item index="checkout">退房</el-menu-item>
    </el-menu>

    <!-- 右侧空余房间选择 -->
    <div v-if="activeTab === 'checkin'" class="room-selection">
      <CheckinForm
          v-if="activeTab === 'checkin' && showCheckinForm"
          :room-id="selectedRoom"
          @success="handleCheckinSuccess"
          @fail="handleCheckinFail"
          @close="showCheckinForm = false"
      />

      <div class="room-list">
        <div class="room-row" v-for="(chunk, rowIndex) in chunkedRooms" :key="rowIndex">
          <RoomCard
              v-for="room in chunk"
              :key="room.roomId"
              :room-id="room.roomId"
              :occupied="room.occupied"
              :check-in-time="room.checkInTime"
              :check-out-time="room.checkOutTime"
              :selected="room.roomId === selectedRoom"
              @click="selectRoom"
          />
        </div>
      </div>
    </div>
    <!-- 如果是退房模式，直接显示 Checkout 页面 -->
    <FrontDeskCheckout
        v-else-if="activeTab === 'checkout'"
    />
    <!-- 弹出悬浮窗口 -->
    <el-dialog v-model:visible="dialogVisible" width="80%" @close="clearForm">
      <span>入住成功！</span>
    </el-dialog>
  </div>
</template>

<script>
import {ref, onMounted, computed} from 'vue'
import RoomCard from '@/components/RoomCard.vue'
import CheckinForm from '@/components/CheckinForm.vue'
import FrontDeskCheckout from '@/views/FrontDeskCheckout.vue'
import {getRemainingRooms, checkin} from '@/mockData.js';
import {ElMessage} from "element-plus"; // 引入 mockData

export default {
  name: 'FrontDesk',
  components: {
    RoomCard,
    CheckinForm,
    FrontDeskCheckout
  },
  setup() {
    const form = ref({
      customerName: '',
      idCard: '',
      phone: '',
      checkinDate: '',
      checkinTime: '',
      checkoutDate: '',
      checkoutTime: ''
    });

    const roomsPerRow = 5; // 每行5个房间
    const remainingRooms = ref([]); // 剩余房间
    const selectedRoom = ref(null);  // 选中的房间
    const dialogVisible = ref(false); // 是否显示弹窗
    const activeTab = ref('checkin') // 上面的菜单默认显示
    const showCheckinForm = ref(false) // 控制是否显示表单


    // 加载页面时
    onMounted(() => {
      getRemainingRoomsData(); // 查询剩余房间
    });

    const handleTabSelect = (key) => {
      activeTab.value = key
    }

    const chunkedRooms = computed(() => {
      const chunks = [];
      for (let i = 0; i < remainingRooms.value.length; i += roomsPerRow) {
        chunks.push(remainingRooms.value.slice(i, i + roomsPerRow));
      }
      return chunks;
    });

    // 获取剩余房间信息
    const getRemainingRoomsData = async () => {
      try {
        const response = await getRemainingRooms(); // 使用 mock 数据
        remainingRooms.value = response.data;
      } catch (error) {
        console.error("获取房间信息失败", error);
      }
    };

    // 选择房间
    const selectRoom = (roomId) => {
      selectedRoom.value = roomId
      showCheckinForm.value = true
    }


    // 确认入住
    const confirmCheckin = async () => {
      if (!selectedRoom.value) {
        return alert("请先选择空余房间");
      }

      const checkoutDate = new Date(form.value.checkinDate);
      checkoutDate.setDate(checkoutDate.getDate() + (form.value.days || 1)); // 确保days有默认值

      const checkinRequest = {
        roomId: selectedRoom.value,
        customerName: form.value.customerName,
        idCard: form.value.idCard,
        phone: form.value.phone,
        checkinDate: form.value.checkinDate,
        checkoutDate: checkoutDate.toISOString(),
      };

      try {
        await checkin(checkinRequest);
        dialogVisible.value = true;

        const room = remainingRooms.value.find((r) => r.roomId === selectedRoom.value);
        if (room) {
          room.occupied = true;
          room.checkInTime = form.value.checkinDate;
          room.checkOutTime = checkoutDate.toISOString();
        }

      } catch (error) {
        console.error("入住失败", error);
      }
    };

    const handleCheckinSuccess = () => {
      ElMessage.success('入住成功！')
      showCheckinForm.value = false
      getRemainingRoomsData() // 重新拉取房间状态
    }

    const handleCheckinFail = () => {
      ElMessage.error('入住失败，请重试')
    }


    // 获取房间范围
    const getRoomRange = (row) => {
      const start = (row - 1) * 5 + 1;
      return Array.from({length: 5}, (_, index) => start + index);
    };


    // 判断房间是否被占用
    const isRoomOccupied = (roomId) => {
      const room = remainingRooms.value.find((room) => room.roomId === roomId);
      return room?.occupied === true;
    };


    // 清空表单
    const clearForm = () => {
      form.value = {
        customerName: '',
        idCard: '',
        phone: '',
        checkinDate: '',
        checkinTime: '',
        days: 1
      };
      selectedRoom.value = null;
    };

    return {
      form,
      remainingRooms,
      selectedRoom,
      dialogVisible,
      activeTab,
      handleTabSelect,
      getRemainingRoomsData,
      selectRoom,
      confirmCheckin,
      getRoomRange,
      isRoomOccupied,
      clearForm,
      chunkedRooms,
      handleCheckinSuccess,
      handleCheckinFail,
      showCheckinForm

    };
  }
};
</script>

<style scoped>
.front-desk {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

.form-container {
  width: 45%;
  --el-box-shadow: var(--el-box-shadow-light);
  box-shadow: var(--el-box-shadow);
  padding: 10px 20px 20px 0px; /* 上右下左 */
  border-radius: 8px;
  background-color: #ffffff; /* el-card 默认背景色 */
}


.room-selection {
  padding: 30px 0px 20px 0px;
  width: 100%;
}

.room-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.room-row {
  display: flex;
  gap: 10px;
  margin-bottom: 15px; /* 每一排卡片底下加20px空隙 */
}

.menu-bar {
  width: 100%;
  justify-content: left;
  padding-left: -5px;
}

</style>
