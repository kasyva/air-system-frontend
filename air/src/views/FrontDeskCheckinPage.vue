<template>
  <div class="outer-wrapper">
    <el-container class="page-container">
      <!-- Header 菜单 -->
      <el-header class="card-header">
        <el-card shadow="always" class="header-card">
          <el-menu :default-active="activeTab" mode="horizontal" @select="handleTabSelect" class="menu-bar">
            <el-menu-item index="checkin">入住</el-menu-item>
            <el-menu-item index="checkout">退房</el-menu-item>
          </el-menu>
        </el-card>
      </el-header>

      <!-- Main 主体内容 -->
      <el-main class="card-main">
        <el-card shadow="always" class="main-card">
          <!-- 入住界面 -->
          <div v-if="activeTab === 'checkin'" class="room-selection">
            <CheckinForm
              v-if="showCheckinForm"
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

          <!-- 退房界面 -->
          <FrontDeskCheckout v-else />
        </el-card>
      </el-main>
    </el-container>

    <!-- 成功弹窗 -->
    <el-dialog v-model:visible="dialogVisible" width="80%" @close="clearForm">
      <span>入住成功！</span>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import RoomCard from '@/components/RoomCard.vue'
import CheckinForm from '@/components/CheckinForm.vue'
import FrontDeskCheckout from '@/views/FrontDeskCheckoutPage.vue'
import { getRemainingRooms, checkin } from '@/mockData.js'
import { ElMessage } from 'element-plus'

export default {
  name: 'FrontDesk',
  components: {
    RoomCard,
    CheckinForm,
    FrontDeskCheckout
  },
  setup() {
    const form = ref({})
    const roomsPerRow = 5
    const remainingRooms = ref([])
    const selectedRoom = ref(null)
    const dialogVisible = ref(false)
    const activeTab = ref('checkin')
    const showCheckinForm = ref(false)

    const chunkedRooms = computed(() => {
      const chunks = []
      for (let i = 0; i < remainingRooms.value.length; i += roomsPerRow) {
        chunks.push(remainingRooms.value.slice(i, i + roomsPerRow))
      }
      return chunks
    })

    const getRemainingRoomsData = async () => {
      try {
        const response = await getRemainingRooms()
        remainingRooms.value = response.data
      } catch (error) {
        console.error('获取房间信息失败', error)
      }
    }

    const selectRoom = (roomId) => {
      selectedRoom.value = roomId
      showCheckinForm.value = true
    }

    const confirmCheckin = async () => {
      const checkinRequest = {
        roomId: selectedRoom.value,
        ...form.value
      }
      try {
        await checkin(checkinRequest)
        dialogVisible.value = true
      } catch (error) {
        console.error('入住失败', error)
      }
    }

    const handleTabSelect = (key) => {
      activeTab.value = key
    }

    const handleCheckinSuccess = () => {
      ElMessage.success('入住成功！')
      showCheckinForm.value = false
      getRemainingRoomsData()
    }

    const handleCheckinFail = () => {
      ElMessage.error('入住失败，请重试')
    }

    const clearForm = () => {
      selectedRoom.value = null
      form.value = {}
    }

    onMounted(() => {
      getRemainingRoomsData()
    })

    return {
      form,
      remainingRooms,
      selectedRoom,
      dialogVisible,
      activeTab,
      chunkedRooms,
      showCheckinForm,
      getRemainingRoomsData,
      selectRoom,
      confirmCheckin,
      handleTabSelect,
      handleCheckinSuccess,
      handleCheckinFail,
      clearForm
    }
  }
}
</script>

<style scoped>
.outer-wrapper {
  background-color: #f3f3f3;
  min-height: 100vh;
  padding: 20px;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header,
.card-main {
  margin-bottom: 20px;
}

.header-card,
.main-card {
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: var(--el-box-shadow-light);
  padding: 10px 20px;
}

.menu-bar {
  border-bottom: none;
}

.room-selection {
  padding-top: 20px;
}

.room-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.room-row {
  display: flex;
  gap: 10px;
}
</style>
