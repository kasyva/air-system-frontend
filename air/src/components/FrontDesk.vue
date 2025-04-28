<template>
  <div class="front-desk">
    <!-- 左侧用户信息填写 -->
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
          <el-date-picker v-model="form.checkinDate" type="date" placeholder="请选择入住日期" style="width: 100%"/>
        </el-col>
        <el-col class="text-center" :span="1" style="margin: 0 0.5rem">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.checkinTime" placeholder="请选择入住时间" style="width: 100%"/>
        </el-col>
      </el-form-item>

      <el-form-item label="退房时间">
        <el-col :span="11">
          <el-date-picker v-model="form.checkoutDate" type="date" placeholder="请选择退房日期" style="width: 100%;"/>
        </el-col>
        <el-col class="text-center" :span="1" style="margin: 0 0.5rem">-</el-col>
        <el-col :span="11">
          <!-- 时间选择器，禁用用户修改，设置默认值为12:00 -->
          <el-time-picker v-model="form.checkoutTime" placeholder="12:00:00" :disabled="true" style="width: 100%;"
                          default-time="12:00:00"/>
        </el-col>
      </el-form-item>
    </el-form>

    <!-- 右侧空余房间选择 -->
    <div v-if="remainingRooms.length > 0" class="room-selection">
      <el-button type="primary" @click="getRemainingRooms">查询空余房间</el-button>
      <h3>选择房间</h3>
      <div class="room-list">
        <el-button
            v-for="room in remainingRooms"
            :key="room.roomId"
            :disabled="room.status === 'occupied'"
            :type="room.status === 'available' ? 'success' : 'default'"
            @click="selectRoom(room.roomId)"
        >
          {{ room.roomId }}
        </el-button>
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
import {ref} from 'vue'
import axios from 'axios'

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
    })

    const remainingRooms = ref([]) // 剩余房间
    const selectedRoom = ref(null)  // 选中的房间
    const dialogVisible = ref(false) // 是否显示弹窗

    // 获取剩余房间信息
    const getRemainingRooms = async () => {
      try {
        const response = await axios.get('/api/remaining-room')
        remainingRooms.value = response.data
      } catch (error) {
        console.error("获取房间信息失败", error)
      }
    }

    // 选择房间
    const selectRoom = (roomId) => {
      selectedRoom.value = roomId
    }

    // 确认入住
    const confirmCheckin = async () => {
      if (!selectedRoom.value) {
        return alert("请先选择空余房间")
      }

      const checkoutDate = new Date(form.value.checkinDate)
      checkoutDate.setDate(checkoutDate.getDate() + form.value.days)

      const checkinRequest = {
        roomId: selectedRoom.value,
        customerName: form.value.customerName,
        idCard: form.value.idCard,
        phone: form.value.phone,
        checkinDate: form.value.checkinDate,
        checkoutDate: checkoutDate.toISOString()
      }

      try {
        await axios.post('/api/checkin', checkinRequest)
        dialogVisible.value = true // 显示悬浮窗口
        remainingRooms.value = remainingRooms.value.filter(room => room.roomId !== selectedRoom.value) // 移除已入住的房间
      } catch (error) {
        console.error("入住失败", error)
      }
    }

    // 清空表单
    const clearForm = () => {
      form.value = {
        customerName: '',
        idCard: '',
        phone: '',
        checkinDate: '',
        checkinTime: '',
        days: 1
      }
      selectedRoom.value = null
    }

    return {
      form,
      remainingRooms,
      selectedRoom,
      dialogVisible,
      getRemainingRooms,
      selectRoom,
      confirmCheckin,
      clearForm
    }
  }
}
</script>

<style scoped>
.front-desk {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.form {
  width: 45%;
}

.room-selection {
  width: 45%;
}

.room-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.room-list .el-button {
  width: 60px;
  height: 60px;
}

.el-dialog {
  padding: 20px;
  text-align: center;
}
</style>
