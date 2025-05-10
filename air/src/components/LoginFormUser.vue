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
        <el-button type="primary" @click="submitForm">确认</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { validateRoomCredentials } from '@/mockData.js'

export default {
  name: 'LoginForm',
  emits: ['login-success'],
  setup(_, { emit }) {
    const router = useRouter()
    const formRef = ref(null)

    const form = ref({
      roomNumber: '',
      cardPassword: ''
    })

    const roomOptions = [
      ...Array.from({ length: 10 }, (_, i) => (101 + i).toString()),
      ...Array.from({ length: 10 }, (_, i) => (201 + i).toString())
    ]

    const rules = {
      roomNumber: [
        { required: true, message: '请选择房间号', trigger: 'change' }
      ],
      cardPassword: [
        { required: true, message: '请输入房卡密码', trigger: 'blur' },
        {
          pattern: /^\d{8}$/,
          message: '房卡密码必须为8位数字',
          trigger: 'blur'
        }
      ]
    }

    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          const isValid = validateRoomCredentials(form.value.roomNumber, form.value.cardPassword)
          if (isValid) {
            ElMessage.success('登录成功')

            // 登录成功后跳转到 client 页面，并带上房间号作为 query 参数
            router.push({
              path: '/client-page',
              query: {
                room: form.value.roomNumber
              }
            })

            emit('login-success')
          } else {
            ElMessage.error('房间号或房卡密码错误')
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