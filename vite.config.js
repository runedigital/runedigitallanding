import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: '',
  resolve: {
    dedupe: ['react', 'react-dom', 'three', '@react-three/fiber']
  },
  server: {
    mime: {
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.html': 'text/html'
    },
    fs: {
      strict: false
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        showroom: resolve(__dirname, 'showroom.html')
      },
      external: []
    }
  }
})