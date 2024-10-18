import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), eslintPlugin({
    include: ['src/**/*.ts', 'src/**/*.vue', 'src/*.ts', 'src/*.vue']
	  // exclude: ['/virtual:/**', '/node_modules/**', '/dist/**']
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'webav': path.resolve(__dirname, '../../third-parties/web-av')
    }
  }
})
