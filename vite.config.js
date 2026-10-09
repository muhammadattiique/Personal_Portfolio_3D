import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          'motion': ['framer-motion'],
          'three-core': ['three'],
          'three-fiber': ['@react-three/fiber', '@react-three/drei'],
          'utils': ['lenis', '@emailjs/browser', 'lucide-react', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})