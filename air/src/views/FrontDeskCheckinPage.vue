<!--@/views/FrontDeskCheckinPage.vue-->
<template>
  <BaseLayout :sidebarComponent="sidebarComp" :sidebarProps="sidebarProps">
    <div v-if="activeTab === '1'">
      <el-card shadow="always" class="main-card">
        <!-- 入住界面 -->
        <template #header>
          <div class="card-header">
            <span>今日房态</span>
          </div>
        </template>
        <div class="room-selection">
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


      </el-card>
      <!-- 成功弹窗 -->
      <el-dialog v-model:visible="dialogVisible" width="80%" @close="clearForm">
        <span>入住成功！</span>
      </el-dialog>
    </div>
    <!-- 退房界面 -->
    <FrontDeskCheckout v-else/>


  </BaseLayout>
</template>

<script>
import {ref, computed, onMounted} from 'vue'
import {ElMessage} from 'element-plus'

import RoomCard from '@/components/RoomCard.vue'
import CheckinForm from '@/components/CheckinForm.vue'
import BaseLayout from '@/components/Layout/BaseLayout.vue'
import SidebarFrontDesk from "@/components/Layout/SidebarFrontDesk.vue";

import FrontDeskCheckout from '@/views/FrontDeskCheckoutPage.vue'

import {getRemainingRooms} from '@/mockData.js'
import axios from 'axios'

export default {
  name: 'FrontDesk',
  components: {
    RoomCard,
    CheckinForm,
    FrontDeskCheckout,
    BaseLayout
  },
  setup() {
    const form = ref({})
    const roomsPerRow = 5
    const remainingRooms = ref([])
    const selectedRoom = ref(null)
    const dialogVisible = ref(false)
    const activeTab = ref('1') // 默认选中
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
        const response = await axios.get('/api/remaining-room')
        remainingRooms.value = response.data
        // console.log(response.data)
      } catch (error) {
        console.error('获取房间信息失败', error)
        const response = await getRemainingRooms()
        remainingRooms.value = response.data
      }
    }

    const selectRoom = (roomId) => {
      selectedRoom.value = roomId
      showCheckinForm.value = true
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

    const sidebarProps = {
      activeIndex: activeTab.value,
      onSelect: (key) => {
        activeTab.value = key
      }
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
      handleCheckinSuccess,
      handleCheckinFail,
      clearForm,
      sidebarComp: SidebarFrontDesk,
      sidebarProps
    }
  }
}
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

.room-selection {
  padding-top: 10px;
}

.room-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-left: 20px;
  margin-right: 20px;
}

.room-row {
  display: flex;
  gap: 8px;
}
</style>
