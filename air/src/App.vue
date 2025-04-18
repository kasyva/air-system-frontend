<template>
  <div id="app">
    <!-- 头部区域 -->
    <header>
      <h1>Hotel Management System</h1>
      <!-- 导航链接 -->
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/front-desk">Front Desk</router-link> |
        <router-link to="/manager-report">Manager Report</router-link>
      </nav>
    </header>

    <!-- 路由视图区域 -->
    <main>
      <router-view></router-view> <!-- 动态加载路由组件 -->
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
/* 全局样式，调整布局 */
#app {
  font-family: 'Arial', sans-serif;
  text-align: center;
}

header {
  background-color: #f8f8f8;
  padding: 10px 0;
  margin-bottom: 20px;
}

nav {
  margin: 20px 0;
}

main {
  padding: 20px;
}
</style>
