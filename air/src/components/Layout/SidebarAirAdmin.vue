<!--@/components/Layout/SidebarFrontDesk.vue-->
<template>
  <el-menu
    :default-active="activeIndex"
    class="custom-menu"
    background-color="#ffffff"
    text-color="#666"
    active-text-color="#fff"
    :router="false"
    @select="handleSelect"
  >
    <el-menu-item index="1">
      <el-icon><User /></el-icon>
      <span class="menu-text">空调监控</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { User, Setting } from '@element-plus/icons-vue'

export default {
  name: 'SidebarFrontDesk',
  components: {
    User,
    Setting
  },
  props: {
    activeIndex: {
      type: String,
      default: '1'
    }
  },
  emits: ['select'],
  methods: {
    handleSelect(index) {
      this.$emit('select', index)
    }
  }
}
</script>


<style scoped>
.custom-menu {
  border-radius: 10px; /* 整体圆角 */
  overflow: hidden; /* 内部跟随圆角裁切 */
  border: none;
  padding: 10px;
}

/* 菜单项居中排布图标+文字 */
.el-menu-item {
  display: flex;
  align-items: center;
  gap: 10px; /* 图标与文字间距 */
  font-size: 14px;
  padding: 12px 20px;
  transition: 0.3s;
  border-radius: 30px;
  color: #666;
}

/* 鼠标悬停状态 */
.el-menu-item:hover {
  background-color: #f5f5f5;
}

/* 激活项（选中）样式 */
.el-menu-item.is-active {
  background-color: #f77d61;
  color: #fff !important;
}
</style>
