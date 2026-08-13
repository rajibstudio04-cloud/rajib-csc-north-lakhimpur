import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures relative asset paths for seamless hosting on any domain / subdirectory / Netlify drop
  server: {
    port: 3000,
    host: true
  },
  define: {
    'import.meta.env.VITE_APP_DOMAIN': JSON.stringify('rajibcsc.rzdigitalstudio.in')
  }
})
