import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  base: mode === 'production' ? '/static/' : '/',
  
  build: {
    outDir: '../Backend/static_frontend',
    emptyOutDir: true,
  },
}))