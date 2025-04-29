<template>
  <div class="front-desk-main">
    <el-row :gutter="20">
      <el-col :span="6">
        <!-- 替换为 popover 弹出房间选择面板 -->
        <el-popover
          placement="bottom"
          width="220"
          trigger="click"
          v-model:visible="popoverVisible">

          <!-- 弹出内容 -->
          <div style="padding: 10px;">
            <el-row :gutter="10" style="margin-bottom: 10px;">
              <el-col :span="6" v-for="room in rooms" :key="room">
                <el-button
                  size="mini"
                  @click="selectRoomNumber(room)"
                  :class="{ active: selectedRoom === room }"
                  style="width: 45px; padding: 8px 0;"
                  plain>
                  {{ room }}
                </el-button>
              </el-col>
            </el-row>

            <div style="text-align: right; margin-top: 10px;">
              <el-button size="mini" @click="cancelSelection">取消</el-button>
              <el-button size="mini" type="primary" @click="confirmSelection">确定</el-button>
            </div>
          </div>

          <!-- 触发按钮 -->
          <template #reference>
            <el-button type="primary">选择房间号</el-button>
          </template>
        </el-popover>
      </el-col>
      <el-col :span="12">
        <h2>前台main页面</h2>
      </el-col>
    </el-row>

    <!-- 其他结构保持不变 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <span>顾客入住信息</span>
          </template>
          <el-row :gutter="20">
            <el-col :span="24" v-for="(info, index) in checkInInfo" :key="index" style="margin-bottom: 10px;">
              <el-card class="item">
                <span>{{ info.label }}：</span>
                <span>{{ info.value }}</span>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <span>账单/详单</span>
          </template>
          <el-row :gutter="20">
            <el-col :span="24" v-for="(bill, index) in billInfo" :key="index" style="margin-bottom: 10px;">
              <el-card class="item">
                <span>{{ bill.label }}：</span>
                <span>{{ bill.value }}</span>
              </el-card>
            </el-col>
          </el-row>
          <el-button type="primary" style="margin-top: 20px;" @click="switchToDetails">切换到详单</el-button>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px; text-align: right;">
      <el-col :span="24">
        <el-button type="primary" round @click="printBill">打印账单/详单</el-button>
        <el-button type="primary" round @click="confirmCheckout">确认退房</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 房间号列表（1-20）
      rooms: Array.from({ length: 20 }, (_, i) => i + 1),

      selectedRoom: null,     // 当前选中房间号
      popoverVisible: false,  // 控制 popover 显示状态

      checkInInfo: [
        { label: '房型', value: '单人房' },
        { label: '房号', value: '301' },
        { label: '入住日期', value: '24.04.18' },
        { label: '已住天数', value: '3' }
      ],
      billInfo: [
        { label: '房费总额', value: '660.00元' },
        { label: '空调费', value: '21.30元' },
        { label: '总计', value: '681.30元' }
      ]
    };
  },
  methods: {
    selectRoomNumber(room) {
      this.selectedRoom = room;
    },
    confirmSelection() {
      if (this.selectedRoom) {
        const roomField = this.checkInInfo.find(info => info.label === '房号');
        if (roomField) {
          roomField.value = this.selectedRoom;
        }

        // 输出所选房间号对应的数据信息
        console.log('所选房间号:', this.selectedRoom);
        console.log('房型:', this.checkInInfo[0].value);
        console.log('入住日期:', this.checkInInfo[2].value);
        console.log('已住天数:', this.checkInInfo[3].value);
        console.log('房费总额:', this.billInfo[0].value);
        console.log('空调费:', this.billInfo[1].value);
        console.log('总计:', this.billInfo[2].value);

        // 关闭弹出框
        this.popoverVisible = false; // 确保这里设置为 false
      }
    },
    cancelSelection() {
      this.selectedRoom = null;
      this.popoverVisible = false; // 确保这里设置为 false
    },
    switchToCheckIn() {
      console.log('切换到入住');
    },
    switchToDetails() {
      console.log('切换到详单');
    },
    printBill() {
      console.log('打印账单/详单');
    },
    confirmCheckout() {
      console.log('确认退房');
    }
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