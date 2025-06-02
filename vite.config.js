import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), // Enable React support
    svgr()   // Enable SVGR support (import SVGs as React components)
  ],
  server: {
    proxy: {
      '/api/garden': {
        target: 'https://gardenpi.duckdns.org',
        changeOrigin: true,
        secure: false, // ADD THIS LINE to skip HTTPS cert issues
        rewrite: (path) => '' // <- REMOVE everything, point directly to root
      }
    }
  }
})
