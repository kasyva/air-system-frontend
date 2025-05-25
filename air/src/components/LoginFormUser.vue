<template>
  <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
    <el-form-item label="房间号" prop="roomNumber">
      <el-select v-model="form.roomNumber" placeholder="请选择房间号">
        <el-option
            v-for="room in roomOptions"
            :key="room"
            :label="room"
            :value="room"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="房卡密码" prop="cardPassword">
      <el-input
          v-model="form.cardPassword"
          placeholder="请输入8位数字密码"
          show-password
      />
    </el-form-item>
    <el-form-item label-width="0" class="full-width-item">
      <div class="form-button-wrapper">
        <el-button type="primary" @click="submitForm">登录</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import {ref} from 'vue'
import {ElMessage} from 'element-plus'
import {useRouter} from 'vue-router'
// import { validateRoomCredentials } from '@/mockData.js'
import axios from 'axios'


export default {
  name: 'LoginForm',
  emits: ['login-success'],
  setup() {
    const router = useRouter()
    const formRef = ref(null)

    const form = ref({
      roomNumber: '',
      cardPassword: ''
    })

    const roomOptions = [
      ...Array.from({length: 10}, (_, i) => (101 + i).toString()),
      ...Array.from({length: 10}, (_, i) => (201 + i).toString())
    ]

    const rules = {
      roomNumber: [
        {required: true, message: '请选择房间号', trigger: 'change'}
      ],
      cardPassword: [
        {required: true, message: '请输入房卡密码', trigger: 'blur'},
        {
          pattern: /^\d{8}$/,
          message: '房卡密码必须为8位数字',
          trigger: 'blur'
        }
      ]
    }

    const submitForm = () => {
      formRef.value.validate(async (valid) => {
        if (valid) {
          try {
            const res = await axios.post('/api/login/room', {
              roomNumber: parseInt(form.value.roomNumber),
              cardPassword: form.value.cardPassword
            })

            ElMessage.success(res.data || '登录成功')

            // 登录成功后跳转到 client 页面，并带上房间号
            router.push({
              path: '/client-page',
              query: {
                room: form.value.roomNumber
              }
            })

          } catch (error) {
            if (error.response && error.response.status === 401) {
              ElMessage.error(error.response.data || '房间号或房卡密码错误')
            } else {
              ElMessage.error('登录失败，请稍后重试')
              console.error(error)
            }
          }
        }
      })
    }

    return {
      formRef,
      form,
      roomOptions,
      rules,
      submitForm
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