<template>
  <div id="app">
    <!-- 头部区域 -->
    <header>
      <el-header style="background-color: #409EFF; color: white; text-align: center; line-height: 60px;">
        Hotel Management System
      </el-header>
    </header>

    <!-- 布局区域 -->
    <el-container>
      <!-- Aside (Sidebar) -->
      <el-aside width="200px" style="background-color: #f4f4f4;">
        <el-menu default-active="1" class="el-menu-vertical-demo">
          <el-menu-item index="1" @click="setRole('ac-manager')">空调管理员</el-menu-item>
          <el-menu-item index="2" @click="setRole('front-desk')">前台</el-menu-item>
          <el-menu-item index="3" @click="setRole('manager')">酒店经理</el-menu-item>
          <el-menu-item index="4" @click="setRole('Client')">客户面板</el-menu-item>
          </el-menu>
      </el-aside>

      <!-- Main Content -->
      <el-main>
        <div v-if="role === 'ac-manager'">
          <AirAdmin :roomId="101" />
        </div>
        <div v-if="role === 'front-desk'">
          <FrontDesk />
        </div>
        <div v-if="role === 'manager'">
          <ManagerReport />
        </div>
        <div v-if="role === 'Client'">
          <ClientView />
        </div>
        <div v-if="role === 'front-desk-leave'">
          <FrontDesk_1 />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ElContainer, ElHeader, ElAside, ElMain, ElMenu, ElMenuItem } from 'element-plus'
import AirAdmin from './views/AirAdmin.vue'
import FrontDesk from '@/views/FrontDeskCheckin.vue'
import ManagerReport from '@/views/ManagerReport.vue'
import ClientView from './components/ClientView.vue'
import FrontDesk_1 from '@/views/FrontDeskCheckout.vue'

export default {
  components: {
    ElContainer,
    ElHeader,
    ElAside,
    ElMain,
    ElMenu,
    ElMenuItem,
    AirAdmin,
    FrontDesk,
    ManagerReport,
    ClientView,
    FrontDesk_1
  },
  data() {
    return {
      role: 'ac-manager'  // 默认显示空调管理员
    }
  },
  methods: {
    setRole(role) {
      this.role = role;
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color: #409EFF;
  color: white;
}
.el-aside {
  background-color: #f4f4f4;
}
.el-main {
  padding: 20px;
}
</style>
