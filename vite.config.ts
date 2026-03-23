import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('/three/examples/jsm/loaders/GLTFLoader')) return 'vendor-three-gltf-loader'
          if (id.includes('/@react-three/fiber/')) return 'vendor-react-three-fiber'
          if (id.includes('/three/')) return 'vendor-three-core'
          return undefined
        },
      },
    },
  },
})
