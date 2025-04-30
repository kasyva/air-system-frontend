<template>
  <div class="hotel-ac-control">
    <h2>301 波普特廉价酒店欢迎您！</h2>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <template #header>
            <div class="clearfix">
              <span>当前温度 ℃</span>
            </div>
          </template>
          <div class="text item">
            <span>{{ currentTemperature }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <template #header>
            <div class="clearfix">
              <span>空调开关</span>
            </div>
          </template>
          <div class="text item">
            <el-switch v-model="airConditionOn"></el-switch>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <template #header>
            <div class="clearfix">
              <span>当前工作模式</span>
            </div>
          </template>
          <div class="text item">
            <span>{{ currentMode }}</span>

          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <template #header>
            <div class="clearfix">
              <span>当前费用 元</span>
            </div>
          </template>
          <div class="text item">
            <span>{{ currentCost }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="box-card">
          <template #header>
            <div class="clearfix">
              <span>目标温度</span>
              <span style="font-size: 24px">{{ targetTemperature }}</span>
            </div>
          </template>
          <div class="text item">
            <el-slider v-model="targetTemperature" :min="16" :max="30"></el-slider>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <template #header>
            <div class="clearfix">
              <span>总费用 元</span>
            </div>
          </template>
          <div class="text item">
            <span>{{ totalCost }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="box-card">
          <template #header>
            <div class="clearfix">
              <span>风速</span>
            </div>
          </template>
          <div class="text item">
            <el-button @click="setFanSpeed('low')">低</el-button>
            <el-button @click="setFanSpeed('medium')">中</el-button>
            <el-button @click="setFanSpeed('high')">高</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ClientView', // 修改组件名称为多词形式
  data() {
    return {
      currentTemperature: 27,
      airConditionOn: false,
      currentMode: "sun",
      currentCost: 0.38,
      targetTemperature: 23.5,
      totalCost: 12.6,
      fanSpeed: 'low'
    };
  },
  methods: {
    setFanSpeed(speed) {
      this.fanSpeed = speed;
    }
  }
};
</script>

<style scoped>
.hotel-ac-control {
  text-align: center;
}
.box-card {
  margin-bottom: 20px;
}
.text.item {
  font-size: 24px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>