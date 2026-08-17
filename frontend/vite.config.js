import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Tells Vite that assets are served from /organic_products/ on GitHub Pages
  base: process.env.NODE_ENV === 'production' ? '/organic_products/' : '/',
  plugins: [react()],
  define: {
    global: 'window',
  },
  server: {
    port: 3000,
    allowedHosts: true,   // Allows Cloudflare tunnel
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