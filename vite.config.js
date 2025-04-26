import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr' // Import the SVGR plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), // Enable React support
    svgr()   // Enable SVGR support (import SVGs as React components)
  ],
  // Optional: If you need to configure a specific port for the dev server
  // server: {
  //   port: 3000,
  // }
})