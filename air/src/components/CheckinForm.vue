<template>
  <div class="overlay">
    <div class="checkin-form-wrapper">
      <el-card class="checkin-form" :shadow="'hover'">
        <div class="close-button" @click="closeForm">×</div>
        <el-form :model="form" label-width="95px" class="form">
          <el-form-item label="姓名">
            <el-input v-model="form.customerName" placeholder="请输入姓名" style="width: 200px;"/>
          </el-form-item>

          <el-form-item label="身份证号">
            <el-input v-model="form.idCard" placeholder="请输入身份证号" style="width: 200px;"/>
          </el-form-item>

          <el-form-item label="电话">
            <el-input v-model="form.phone" placeholder="请输入电话" style="width: 200px;"/>
          </el-form-item>
        </el-form>

        <div style="margin-top: 50px; text-align: center;">
          <el-button type="primary" :disabled="!form.roomId" @click="submitCheckin">确认入住</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {ref} from 'vue'
import axios from 'axios'
// import {checkin} from '@/mockData.js'

export default {
  name: 'CheckinForm',
  props: {
    roomId: {
      type: [String, Number],
      required: true
    }
  },
  emits: ['success', 'fail'],
  setup(props, {emit}) {
    const form = ref({
      customerName: '',
      idCard: '',
      phone: '',
      roomId: props.roomId
    })

    const closeForm = () => {
      emit('close')
    }

    const submitCheckin = async () => {
      try {
        const checkinData = {
          roomId: props.roomId,
          customerName: form.value.customerName,
          idCard: form.value.idCard,
          phone: form.value.phone,
          checkinDate: ""
        }
        console.log('checkindata: ', checkinData)

        const res = await axios.post('/api/checkin', checkinData)
        if (res.data === '入住成功')
          emit('success', res.data)

      } catch (error) {
        console.error('入住失败', error)
        emit('fail')
      }
    }

    return {
      form,
      submitCheckin,
      closeForm
    }
  }
}
</script>

<style scoped>
.checkin-form {
  padding: 20px;
}

.checkin-form-wrapper {
  position: fixed;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  width: 550px;
}


.checkin-form {
  padding: 20px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3); /* 半透明黑色背景 */
  backdrop-filter: blur(4px); /* 背景模糊效果 */
  z-index: 1999;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10%;
}


.checkin-form {
  width: 100%;
  padding: 20px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  transition: color 0.3s;
}

.close-button:hover {
  color: #333;
}

</style>
