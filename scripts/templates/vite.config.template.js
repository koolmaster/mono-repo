import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@izion/shared': resolve(__dirname, '../../packages/shared/src'),
      '@izion/security': resolve(__dirname, '../../packages/security/src'),
      '@izion/api': resolve(__dirname, '../../packages/api/src'),
      '@izion/ui': resolve(__dirname, '../../packages/ui/src'),
    }
  },
  server: {
    port: PORT_PLACEHOLDER,
    host: true,
    open: true
  },
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NAME_PLACEHOLDER',
      fileName: 'FILENAME_PLACEHOLDER'
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
