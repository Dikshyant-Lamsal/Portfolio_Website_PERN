// vite.config.js
// Configures Vite for React + proxy to backend dev server
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // Proxy API calls to Express during development
  // so "/api/test" → "http://localhost:5000/api/test"
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})