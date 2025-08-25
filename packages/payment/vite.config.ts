import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@izion/shared': resolve(__dirname, '../../utils/shared'),
      '@izion/security': resolve(__dirname, '../../utils/security'),
      '@izion/api': resolve(__dirname, '../../utils/api'),
      '@izion/ui': resolve(__dirname, '../../utils/ui'),
    }
  },
  server: {
    port: 3001,
    host: true,
    open: true
  },
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PaymentSDK',
      fileName: 'payment-sdk'
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})
