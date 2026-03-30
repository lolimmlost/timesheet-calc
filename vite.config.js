import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    allowedHosts: ["dev1.appahouse.com", "localhost"],
    cors: {
      origin: [
        "http://localhost:3000",
        "https://schedule.appahouse.com"
      ],
      credentials: true,
    },
    // WebSocket configuration for Cloudflare tunnel
    hmr: {
      port: 4174,
      host: "schedule.appahouse.com", // Connect through the tunnel
      protocol: "wss", // Use secure WebSocket for HTTPS
      timeout: 30000, // Increase timeout for WebSocket connection
      overlay: true, // Enable HMR overlay for better debugging
    },
    // Ensure WebSocket server is accessible
    watch: {
      usePolling: false, // Disable polling as it can cause conflicts
      interval: 1000,
    },
  },
})
