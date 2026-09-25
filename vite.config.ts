import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const variablesPath = fileURLToPath(new URL('./src/styles/variables.scss', import.meta.url)).replaceAll('\\', '/')

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "${variablesPath}" as *;\n`,
      },
    },
  },
})
