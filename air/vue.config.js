const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:8088', // Flask 后端地址
                changeOrigin: true
            }
        }
    }
})
