import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
  },
  server: {
    port: 3000,
    allowedHosts: true,   // ← Added this line (allows Cloudflare tunnel)
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/ws-notifications': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true,
      }
    }
  }
});