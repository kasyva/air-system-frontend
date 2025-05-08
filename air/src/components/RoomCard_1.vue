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

      <div class="corner bottom-right">
        <el-switch
          :width="50"
          v-model="isAirConditioningOn"
          @change="toggleAirConditioning"
          @click.stop
        />
      </div>
    </div>
  </el-card>
</template>

<script>
import { computed, ref, watch } from 'vue';

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
    },
    isAirConditioningEnabled: {
      type: Boolean,
      default: false // 新增属性，表示空调是否开启
    }
  },
  emits: ['click', 'toggleAirConditioning'],
  setup(props, { emit }) {
    const backgroundImageUrl = computed(() => {
      return props.occupied ? require('@/assets/occupied-room.jpg') : require('@/assets/available-room.jpg');
    });

    const statusText = computed(() => {
      return props.occupied ? '入住中' : '未入住';
    });

    // 使用 ref 存储本地空调状态
    const isAirConditioningOn = ref(props.isAirConditioningEnabled);

    // 当父组件更新 isAirConditioningEnabled 时，同步到本地 ref
    watch(
      () => props.isAirConditioningEnabled,
      (newVal) => {
        isAirConditioningOn.value = newVal;
      }
    );

    // 当用户点击开关时触发事件
    const toggleAirConditioning = (newValue) => {
      emit('toggleAirConditioning', { roomId: props.roomId, newValue });
    };

    const handleClick = () => {
      emit('click', props.roomId);
    };

    return {
      backgroundImageUrl,
      statusText,
      isAirConditioningOn,
      toggleAirConditioning,
      handleClick
    };
  }
};
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
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 2px;
  color: #ffffff;
  font-weight: bold;
  font-size: 18px;
  padding: 8px;
  box-sizing: border-box;
}

.corner {
  position: absolute;
  padding: 4px 6px;
  border-radius: 5px;
  font-size: 18px;
  background: none;
  font-weight: normal;
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
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(0.9); /* 可选：缩小一点 */
}

.top-left, .top-right {
  font-size: 18px;
  font-weight: 500;
}

.bottom-left, .bottom-right {
  font-size: 16px;
  font-weight: 400;
}

/* 调整开关样式 */
.bottom-right .el-switch {
  margin: 0;
}
</style>