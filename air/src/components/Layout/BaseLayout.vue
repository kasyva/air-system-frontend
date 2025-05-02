<!--@/components/Layout/BaseLayout.vue-->
<template>
  <div class="common-layout">
    <el-container class="card-container">
      <el-header class="header-bar">
        <div class="header-left">
          <el-icon :size="32" color="#ed6351ff" class="hotel-icon">
            <HomeFilled/>
          </el-icon>
          <span class="zhi-mang-xing-regular">波普特大学廉价快捷酒店</span>
        </div>
        <div class="header-right">
          <el-button type="text" @click="logout">
            <el-icon :size="25" color="#ed6351ff">
              <Back/>
            </el-icon>
            <span class="logout-font">登出</span>
          </el-button>
        </div>
      </el-header>

      <el-container style="flex: 1;">
        <el-aside class="aside-bar" width="240px">
          <component :is="sidebarComponent" v-bind="sidebarProps"/>
        </el-aside>
        <el-main class="main-part">
          <slot/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {useRouter} from 'vue-router'
import {HomeFilled, Back} from '@element-plus/icons-vue'
import {ElMessageBox} from "element-plus";

export default {
  name: 'BaseLayout',
  components: {Back, HomeFilled},
  props: {
    sidebarComponent: {
      type: [Object, Function, String],
      required: true
    },
    sidebarProps: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const router = useRouter()
    const logout = () => {
      ElMessageBox.confirm(
          '确定要退出登录吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
      ).then(() => {
        // 确认退出
        router.push('/login-page')
      }).catch(() => {
        // 取消退出，无操作
      })
    }

    return {
      logout,
      HomeFilled,
      Back
    }
  }
}
</script>

<style>
.common-layout {
  padding: 30px 30px 30px 30px;
  background: #fcbfbbff;
  height: 100vh;
  box-sizing: border-box; /* 避免 padding 导致溢出 */
}

.card-container {
  height: calc(100% - 5px);
  box-shadow: var(--el-box-shadow-dark);
  background: #ebebebff;
  border-radius: 2px;
  overflow: hidden;
}

.header-bar {
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between; /* 左右分布 */
  margin-bottom: 5px;
}

.hotel-icon {
  margin-left: 8px;
  margin-right: 8px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zhi-mang-xing-regular {
  font-family: "Zhi Mang Xing", cursive;
  font-weight: 400;
  font-style: normal;
  font-size: 20px;
  color: #ed6351ff;
}

.logout-font {
  font-size: 17px;
  color: #ed6351ff;
  margin-right: 10px;
}

.aside-bar {
  background: #ffffff;
  margin-right: 5px;
}

.main-part {
  --el-main-padding: 0 !important;
  padding: 0 !important;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden; /* 去除滚动条 */
}
</style>
