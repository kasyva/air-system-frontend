<template>
  <BaseLayout :sidebarComponent="SidebarLogin" :sidebarProps="sidebarProps" :show-logout-button="false">
    <div class="login-main">
      <!-- 用户登录区域 -->
      <div v-if="activeTab === '1'" class="login-card">
        <h2>用户登录</h2>
        <LoginForm  />
      </div>

      <!-- 系统登录区域 -->
      <div v-else class="login-card">
        <h2>系统登录</h2>
        <LoginFormSys />
      </div>
    </div>
  </BaseLayout>
</template>

<script>
import { ref } from 'vue'
import BaseLayout from '@/components/Layout/BaseLayout.vue'
import SidebarLogin from '@/components/Layout/SidebarLogin.vue'
import LoginForm from '@/components/LoginFormUser.vue'
import LoginFormSys from '@/components/LoginFormSys.vue'

export default {
  name: 'LoginPage',
  computed: {
    SidebarLogin() {
      return SidebarLogin
    }
  },
  components: {
    BaseLayout,
    SidebarLogin,
    LoginForm,
    LoginFormSys
  },
  setup() {
    const activeTab = ref('1') // 默认用户登录

    const sidebarProps = {
      activeIndex: activeTab.value,
      onSelect: (key) => {
        activeTab.value = key
      }
    }


    return {
      activeTab,
      sidebarProps
    }
  }
}
</script>

<style scoped>
.login-main {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.login-card {
  width: 400px;
  background: white;
  padding: 30px;
  box-shadow: var(--el-box-shadow-light);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
