<template>
  <BaseLayout :sidebarComponent="sidebarComp">
    <div class="air-condition-manager">
      <h2>空调管理员main页面</h2>
      <el-button type="primary" round @click="toggleAirCondition">开启中央空调</el-button>
      <el-button type="primary" round @click="toggleAirCondition">关闭中央空调</el-button>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="roomNumber" label="房间号" width="180"></el-table-column>
        <el-table-column prop="isVentilation" label="是否送风" width="180">
          <template v-slot:default="{ row }">
            <el-switch v-model="row.isVentilation"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="currentTemperature" label="当前温度"></el-table-column>
        <el-table-column prop="targetTemperature" label="目标温度"></el-table-column>
        <el-table-column prop="currentCost" label="当前费用"></el-table-column>
        <el-table-column prop="totalCost" label="总费用"></el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="{ row }">
            <!-- 这里可以添加更多操作 -->
            <el-button size="mini" @click="handleEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </BaseLayout>
</template>

<script>
import BaseLayout from "@/components/Layout/BaseLayout.vue";
import SidebarAirAdmin from "@/components/Layout/SidebarAirAdmin.vue";

export default {
  components: {
    BaseLayout
  },
  data() {
    return {
      sidebarComp: SidebarAirAdmin,
      tableData: [
        {
          roomNumber: '101',
          isVentilation: true,
          currentTemperature: '25°C',
          targetTemperature: '22°C',
          currentCost: '2.5',
          totalCost: '25'
        },
        {
          roomNumber: '102',
          isVentilation: false,
          currentTemperature: '26°C',
          targetTemperature: '23°C',
          currentCost: '2.3',
          totalCost: '23'
        },
        {
          roomNumber: '103',
          isVentilation: true,
          currentTemperature: '25°C',
          targetTemperature: '22°C',
          currentCost: '2.5',
          totalCost: '25'
        },
        {
          roomNumber: '104',
          isVentilation: false,
          currentTemperature: '26°C',
          targetTemperature: '23°C',
          currentCost: '2.3',
          totalCost: '23'
        },
        {
          roomNumber: '105',
          isVentilation: true,
          currentTemperature: '25°C',
          targetTemperature: '22°C',
          currentCost: '2.5',
          totalCost: '25'
        },
        {
          roomNumber: '106',
          isVentilation: false,
          currentTemperature: '26°C',
          targetTemperature: '23°C',
          currentCost: '2.3',
          totalCost: '23'
        }
      ]
    };
  },
  methods: {
    toggleAirCondition() {
      // 实现开关中央空调的逻辑
      console.log('中央空调开关被点击');
    },
    handleEdit(row) {
      // 实现编辑逻辑
      console.log(`编辑行: ${row.roomNumber}`);
    }
  }
};
</script>

<style scoped>
.air-condition-manager {
  text-align: center;
}

.el-button {
  margin-bottom: 20px;
}
</style>