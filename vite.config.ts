import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/estado-da-arte-portal/',
  plugins: [react()],
  server: {
    port: 5174,
    open: true
  }
})
