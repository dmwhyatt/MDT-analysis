import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site: https://dmwhyatt.github.io/MDT-analysis/
const base = process.env.GITHUB_PAGES === 'true' ? '/MDT-analysis/' : '/'

export default defineConfig({
  base,
  plugins: [react()],
})
