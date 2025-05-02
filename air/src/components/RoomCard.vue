<template>
  <el-card
      class="room-card"
      shadow="always"

      :class="{ selected: selected }"
      @click="handleClick"
  >

    <div
        class="overlay"
        :style="{ backgroundImage: `url(${backgroundImageUrl})` }"
    >
      <div class="corner top-left">{{ roomId }}</div>
      <div class="corner top-right">标准间</div>
      <div class="corner bottom-left">{{ statusText }}</div>
      <div class="corner bottom-right">{{ displayText }}</div>
    </div>
  </el-card>
</template>

<script>
import {computed} from 'vue'
import dayjs from 'dayjs'

export default {
  name: 'RoomCard',
  props: {
    roomId: {
      type: [String, Number],
      required: true
    },
    occupied: {
      type: Boolean,
      default: false
    },
    checkInTime: {
      type: String,
      default: ''
    },
    checkOutTime: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      default: 200
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props, {emit}) {
    const backgroundImageUrl = computed(() => {
      if (props.occupied) {
        return require('@/assets/occupied-room.jpg')
      } else {
        return require('@/assets/available-room.jpg')
      }
    })


    const statusText = computed(() => {
      return props.occupied ? '入住中' : '可入住'
    })

    const displayText = computed(() => {
      if (!props.occupied) {
        return `${props.price}¥`
      } else {
        const now = dayjs()
        const checkout = dayjs(props.checkOutTime)
        const diffHours = checkout.diff(now, 'hour')
        const days = Math.floor(diffHours / 24)
        const hours = diffHours % 24
        if (diffHours <= 0) {
          return '即将退房'
        }
        return `剩${days}天${hours}小时`
      }
    })

    const handleClick = () => {
      emit('click', props.roomId)
    }

    return {
      backgroundImageUrl,
      statusText,
      displayText,
      handleClick
    }
  }
}
</script>

<style scoped>
.room-card {
  border-radius: 2px;
  cursor: pointer;
  width: 180px;
  height: 85px;
  margin: 0 auto;
  --el-box-shadow: var(--el-box-shadow-dark);
}

.room-card >>> .el-card__body {
  padding: 0 !important;
  height: 100%;
}

.overlay {
  width: 100%;
  height: 100%;
  position: relative;
  background-size: cover; /* 关键：拉伸背景图铺满整个div */
  background-position: center; /* 背景居中 */
  background-repeat: no-repeat; /* 背景不要平铺重复 */
  border-radius: 2px;
  color: #ffffff;
  font-weight: bold;
  font-size: 18px;
  padding: 8px;
  box-sizing: border-box;
}


.corner {
  position: absolute;
  padding: 4px 6px; /* 适当padding */
  border-radius: 5px;
  font-size: 18px; /* 角落字体统一大一点 */
  background: none; /* 去掉原来灰色背景 */
  font-weight: normal; /* 字体细一点，不要bold */
}


.top-left {
  top: 5px;
  left: 5px;
}

.top-right {
  top: 5px;
  right: 5px;
}

.bottom-left {
  bottom: 5px;
  left: 5px;
}

.bottom-right {
  bottom: 5px;
  right: 5px;
}

.top-left, .top-right {
  font-size: 18px; /* 上面两个房号/标准间大一点 */
  font-weight: 500; /* 微微加粗，不是默认bold */
}

.bottom-left, .bottom-right {
  font-size: 16px; /* 下面两个可入住/剩余时间小一点 */
  font-weight: 400; /* 正常细字体 */
}

</style>
