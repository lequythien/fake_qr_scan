import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Cho phép các thiết bị trong mạng LAN truy cập
    port: 5173,       // Hoặc 5174 nếu bạn muốn tách admin
    strictPort: true, // Không đổi port nếu bị trùng
    cors: true        // Cho phép CORS nếu cần
  }
})
