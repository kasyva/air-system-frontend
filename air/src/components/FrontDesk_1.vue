<template>
  <div class="front-desk-main">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-button type="primary" @click="selectRoom">选择房间号</el-button>
      </el-col>
      <el-col :span="12">
        <h2>前台main页面</h2>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="switchToCheckIn">切换到入住</el-button>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <span>顾客入住信息</span>
          </template>
          <!-- 这里可以添加顾客入住信息的具体内容 -->
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
          <!-- 这里可以添加账单/详单的具体内容 -->
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
    selectRoom() {
      // 处理选择房间号的逻辑
      console.log('选择房间号');
    },
    switchToCheckIn() {
      // 处理切换到入住的逻辑
      console.log('切换到入住');
    },
    switchToDetails() {
      // 处理切换到详单的逻辑
      console.log('切换到详单');
    },
    printBill() {
      // 处理打印账单/详单的逻辑
      console.log('打印账单/详单');
    },
    confirmCheckout() {
      // 处理确认退房的逻辑
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
  height: auto; /* 调整为auto以适应动态内容的高度 */
}
</style>