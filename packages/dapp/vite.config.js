import { defineConfig } from 'vite'
import react from 'vite-preset-react'
import svgrPlugin from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true
  },
  plugins: [
    react(),
    svgrPlugin({
      svgrOptions: {
        icon: true
      }
    })
  ],
})
