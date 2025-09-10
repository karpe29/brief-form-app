import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/brief-form-app/',
  server: {
    port: 3000
  }
})
