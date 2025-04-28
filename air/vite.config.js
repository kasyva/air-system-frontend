import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';  // 引入 vue 插件

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],  // 使用插件
  test: {
    globals: true,
    environment: 'happy-dom'
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  }
});
