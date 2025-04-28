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
        <el-col :span="12">
          <el-card class="item">
            <span>房型</span>
            <span>单人房</span>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="item">
            <span>房号</span>
            <span>301</span>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="item">
            <span>入住日期</span>
            <span>24.04.18</span>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="item">
            <span>已住天数</span>
            <span>3</span>
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
        <el-col :span="12">
          <el-card class="item">
            <span>房费总额</span>
            <span>660.00元</span>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="item">
            <span>空调费</span>
            <span>21.30元</span>
          </el-card>
        </el-col>
        <el-col :span="24">
          <el-card class="item">
            <span>总计</span>
            <span>681.30元</span>
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
  height: 300px;
}
</style>