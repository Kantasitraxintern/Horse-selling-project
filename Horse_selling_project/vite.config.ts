import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/characters': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
