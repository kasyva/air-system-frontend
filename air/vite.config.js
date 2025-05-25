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
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8088',  // Spring Boot 后端地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')  // 可选：去掉前缀
      }
    }
  }
});
