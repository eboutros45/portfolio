import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { contentPlugin } from './plugins/content'
import { seoPages } from './plugins/seo'

export default defineConfig({
  plugins: [contentPlugin(), react(), tailwindcss(), seoPages()],
  build: {
    outDir: 'dist',
    target: 'es2022',
    sourcemap: false,
  },
})
