<template>
  <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
    <el-form-item label="登录角色" prop="role">
      <el-select v-model="form.role" placeholder="请选择登录角色">
        <el-option label="前台" value="frontdesk"/>
        <el-option label="空调管理员" value="airadmin"/>
        <el-option label="酒店经理" value="manager"/>
      </el-select>
    </el-form-item>

    <el-form-item label="系统密码" prop="password">
      <el-input v-model="form.password" show-password placeholder="请输入密码"/>
    </el-form-item>

    <el-form-item label-width="0" class="full-width-item">
      <div class="form-button-wrapper">
        <el-button type="primary" @click="submit">登录</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import {ref} from 'vue'
import {ElMessage} from 'element-plus'
import {useRouter} from 'vue-router'
import axios from "axios";

export default {
  name: 'LoginFormSys',
  setup() {
    const router = useRouter()
    const formRef = ref(null)
    const form = ref({
      role: '',
      password: ''
    })

    const rules = {
      role: [{required: true, message: '请选择角色', trigger: 'change'}],
      password: [{required: true, message: '请输入密码', trigger: 'blur'}]
    }

    const submit = () => {
      formRef.value.validate(async (valid) => {
        if (!valid) return
        try {
          const res = await axios.post('/api/login/system', {
            role: form.value.role,
            password: form.value.password
          })

          ElMessage.success(res.data || '登录成功')

          switch (form.value.role) {
            case 'frontdesk':
              router.push('/frontdesk-page')
              break
            case 'airadmin':
              router.push('/airadmin-page')
              break
            case 'manager':
              router.push('/manager-page')
              break
          }
          console.log('成功调用后端接口')

        } catch (error) {
          if (error.response && error.response.status === 401) {
            ElMessage.error(error.response.data || '密码错误')
          } else {
            ElMessage.error('登录失败，请稍后重试')
            console.error(error)
          }
        }

      })
    }

    return {
      formRef,
      form,
      rules,
      submit
    }
  }
}
</script>

<style scoped>
.full-width-item {
  width: 100%;
}

.form-button-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
