<template>
  <div class="login-layout">
    <el-container>
      <!-- 顶部导航 -->
      <el-header class="header">
        <el-dropdown @command="handleRoleSwitch">
          <span class="el-dropdown-link">
            {{ currentRole }}
            <el-icon class="el-icon--right">
              <arrow-down/>
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="客户">客户</el-dropdown-item>
              <el-dropdown-item command="酒店管理人员">酒店管理人员</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>

      <!-- 主体 -->
      <el-main class="main">
        <!-- 客户视图 -->
        <div v-if="currentRole === '客户'">
          <el-button type="primary" size="large" @click="showLoginForm = true">客户登录</el-button>
          <el-dialog v-model="showLoginForm" title="客户登录" width="30%">
            <LoginForm @login-success="handleClientLoginSuccess"/>
          </el-dialog>
        </div>

        <!-- 管理员视图 -->
        <div v-else class="admin-buttons">
          <el-button type="primary" @click="openAdminForm('前台')">前台</el-button>
          <el-button type="primary" @click="openAdminForm('空调管理员')">空调管理员</el-button>
          <el-button type="primary" @click="openAdminForm('酒店经理')">酒店经理</el-button>
          <el-dialog v-model="showAdminForm" :title="selectedAdminRole + ' 登录'" width="30%">
            <el-form :model="adminForm" :rules="adminRules" ref="adminFormRef" label-width="80px">
              <el-form-item label="密码" prop="password">
                <el-input v-model="adminForm.password" show-password placeholder="请输入密码"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitAdminLogin">确认</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
import LoginForm from '@/components/LoginForm.vue'
import {ArrowDown} from '@element-plus/icons-vue'

export default {
  components: {
    LoginForm,
    ArrowDown
  },
  setup() {
    const router = useRouter()

    const currentRole = ref('客户')
    const showLoginForm = ref(false)

    const showAdminForm = ref(false)
    const selectedAdminRole = ref('')
    const adminFormRef = ref(null)
    const adminForm = ref({
      password: ''
    })

    const adminRules = {
      password: [
        {required: true, message: '请输入密码', trigger: 'blur'}
      ]
    }

    const handleRoleSwitch = (role) => {
      currentRole.value = role
      showLoginForm.value = false
      showAdminForm.value = false
      adminForm.value.password = ''
    }

    const handleClientLoginSuccess = () => {
      router.push('/client-page')
    }

    const openAdminForm = (role) => {
      selectedAdminRole.value = role
      showAdminForm.value = true
    }

    const submitAdminLogin = () => {
      adminFormRef.value.validate((valid) => {
        if (!valid) return
        const pwd = adminForm.value.password
        if (pwd === '123456') {
          ElMessage.success(`${selectedAdminRole.value} 登录成功`)
          showAdminForm.value = false
          switch (selectedAdminRole.value) {
            case '前台':
              router.push('/frontdesk-page')
              break
            case '空调管理员':
              router.push('/airadmin-page')
              break
            case '酒店经理':
              router.push('/manager-page')
              break
          }
        } else {
          ElMessage.error('密码错误')
        }
      })
    }

    return {
      currentRole,
      showLoginForm,
      showAdminForm,
      selectedAdminRole,
      adminForm,
      adminFormRef,
      adminRules,
      handleRoleSwitch,
      handleClientLoginSuccess,
      openAdminForm,
      submitAdminLogin
    }
  }
}
</script>

<style scoped>
.login-layout {
  height: 100vh;
  background-color: #ffffff;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  padding: 20px;

  box-shadow: var(--el-box-shadow-light);
  margin-bottom: 20px;
  background: url('@/assets/login-bg.jpg') no-repeat center center;
  background-size: cover;
}

.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 580px;
  padding: 20px;
  box-shadow: var(--el-box-shadow-light);
  background: url('@/assets/login-bg.jpg') no-repeat center center;
  background-size: cover;
}

.admin-buttons {
  display: flex;
  gap: 20px;
}
</style>
