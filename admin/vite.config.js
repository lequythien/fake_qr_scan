import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Cho phép các thiết bị trong mạng LAN truy cập
    port: 5174, // Hoặc 5173 nếu bạn muốn tách frontend
    strictPort: true, // Không đổi port nếu bị trùng
    cors: true, // Cho phép CORS nếu cần
  },
});
