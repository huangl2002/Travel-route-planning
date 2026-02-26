import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  // GitHub Pages 配置
  base: '/Travel-route-planning/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // 确保静态资源正确引用
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
