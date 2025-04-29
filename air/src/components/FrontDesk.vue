<template>
  <div class="front-desk">
    <!-- 左侧用户信息填写 -->
    <div class="form-container">
      <el-form :model="form" label-width="120px" class="form">
        <el-form-item label="姓名">
          <el-input v-model="form.customerName" placeholder="请输入姓名"></el-input>
        </el-form-item>

        <el-form-item label="身份证号">
          <el-input v-model="form.idCard" placeholder="请输入身份证号"></el-input>
        </el-form-item>

        <el-form-item label="电话">
          <el-input v-model="form.phone" placeholder="请输入电话"></el-input>
        </el-form-item>

        <el-form-item label="入住时间">
          <el-col :span="11">
            <el-date-picker v-model="form.checkinDate" type="date" placeholder="请选择入住日期" style="width: 100%" />
          </el-col>
          <el-col class="text-center" :span="1" style="margin: 0 0.5rem">-</el-col>
          <el-col :span="11">
            <el-time-picker v-model="form.checkinTime" placeholder="请选择入住时间" style="width: 100%" />
          </el-col>
        </el-form-item>

        <el-form-item label="退房时间">
          <el-col :span="11">
            <el-date-picker v-model="form.checkoutDate" type="date" placeholder="请选择退房日期" style="width: 100%;" />
          </el-col>
          <el-col class="text-center" :span="1" style="margin: 0 0.5rem">-</el-col>
          <el-col :span="11">
            <!-- 时间选择器，禁用用户修改，设置默认值为12:00 -->
            <el-time-picker v-model="form.checkoutTime" placeholder="12:00:00" :disabled="true" style="width: 100%;" default-time="12:00:00" />
          </el-col>
        </el-form-item>
      </el-form>
    </div>

    <!-- 右侧空余房间选择 -->
    <div class="room-selection">
      <el-button
        type="primary"
        @click="getRemainingRoomsData"
        :style="{ borderStyle: showRooms ? 'solid' : 'dashed', borderColor: showRooms ? 'black' : 'gray', borderRadius: '50px', padding: '10px 20px' }">
        查询空余房间
      </el-button>

      <h3>选择房间</h3>
      <div class="room-list">
        <div v-for="i in 4" :key="i" class="room-row">
          <el-button
            v-for="roomId in getRoomRange(i)"
            :key="roomId"
            :disabled="isRoomOccupied(roomId)"
            :type="getRoomButtonType(roomId)"
            @click="selectRoom(roomId)"
            class="room-btn"
            round
          >
            {{ roomId }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 确认入住按钮 -->
    <el-button type="primary" :disabled="!selectedRoom" @click="confirmCheckin">确认入住</el-button>

    <!-- 弹出悬浮窗口 -->
    <el-dialog v-model:visible="dialogVisible" width="80%" @close="clearForm">
      <span>入住成功！</span>
    </el-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import { getRemainingRooms, checkin } from '@/mockData.js'; // 引入 mockData

export default {
  name: 'FrontDesk',
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

    const remainingRooms = ref([]); // 剩余房间
    const selectedRoom = ref(null);  // 选中的房间
    const dialogVisible = ref(false); // 是否显示弹窗
    const showRooms = ref(false); // 控制是否显示房间数据

    // 获取剩余房间信息
    const getRemainingRoomsData = async () => {
      try {
        const response = await getRemainingRooms(); // 使用 mock 数据
        remainingRooms.value = response.data;
        showRooms.value = true;
      } catch (error) {
        console.error("获取房间信息失败", error);
      }
    };

    // 选择房间
    const selectRoom = (roomId) => {
      selectedRoom.value = roomId;
    };

    // 确认入住
    const confirmCheckin = async () => {
      if (!selectedRoom.value) {
        return alert("请先选择空余房间");
      }

      const checkoutDate = new Date(form.value.checkinDate);
      checkoutDate.setDate(checkoutDate.getDate() + form.value.days);

      const checkinRequest = {
        roomId: selectedRoom.value,
        customerName: form.value.customerName,
        idCard: form.value.idCard,
        phone: form.value.phone,
        checkinDate: form.value.checkinDate,
        checkoutDate: checkoutDate.toISOString(),
      };

      try {
        await checkin(checkinRequest); // 使用 mock 数据
        dialogVisible.value = true;
        remainingRooms.value = remainingRooms.value.filter(
            (room) => room.roomId !== selectedRoom.value
        );
      } catch (error) {
        console.error("入住失败", error);
      }
    };

    // 获取房间范围
    const getRoomRange = (row) => {
      const start = (row - 1) * 10 + 1;
      return Array.from({length: 10}, (_, index) => start + index);
    };

    // 判断房间是否被占用
    const isRoomOccupied = (roomId) => {
      return remainingRooms.value.some((room) => room.roomId === roomId && room.status === 'occupied');
    };

    // 获取按钮类型
    const getRoomButtonType = (roomId) => {
      const room = remainingRooms.value.find((r) => r.roomId === roomId);
      if (!room) return 'default';
      if (room.status === 'occupied') return 'danger';
      if (roomId === selectedRoom.value) return 'success';
      return 'default';
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
      showRooms,
      getRemainingRoomsData,
      selectRoom,
      confirmCheckin,
      getRoomRange,
      isRoomOccupied,
      getRoomButtonType,
      clearForm
    };
  }
};
</script>

<style scoped>
.front-desk {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.form-container {
  width: 60%;
  background-color: #e0f7fa; /* 浅蓝色背景 */
  padding: 20px;
  border-radius: 8px;
}

.room-selection {
  width: 40%;
}

.room-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.room-row {
  display: flex;
  gap: 10px;
}

.room-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 16px;
  text-align: center;
}

.el-button[disabled] {
  background-color: #f44336; /* 红色叉 */
  color: white;
}

.el-button.success {
  border-color: green;
  background-color: #4caf50; /* 绿色对勾 */
  color: white;
}

.el-button.default {
  border-color: black;
}

.el-button.danger {
  border-color: red;
  background-color: red;
  color: white;
}

.el-button {
  font-size: 14px;
}
</style>
