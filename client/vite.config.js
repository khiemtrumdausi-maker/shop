import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Khi bạn gọi fetch('/api/...') ở frontend
      // Vite sẽ tự động chuyển hướng sang http://localhost:3000/api/...
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})