import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { vuestic } from '@vuestic/compiler/vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    vuestic({
      devtools: true,
      cssLayers: true,
    }),
    vue(),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**'),
    }),
  ],
  server: {
    host: '0.0.0.0', // 允许局域网访问
    port: 5173,      // 默认端口
    proxy: {
      '/api': {
        target: 'http://ec2-54-226-103-67.compute-1.amazonaws.com:8080', // 改为云服务器地址
        changeOrigin: true,
        rewrite: (path) => {
          console.log('Proxy rewrite:', path) // 调试路径
          return path.replace(/^\/api/, '') // 移除 `/api` 前缀
        },
        // 可选：添加超时设置
        timeout: 5000,
      },
    },
  },
})
