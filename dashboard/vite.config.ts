import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'

// GitHub Pages project site: https://dmwhyatt.github.io/MDT-analysis/
const base = process.env.GITHUB_PAGES === 'true' ? '/MDT-analysis/' : '/'

// #region agent log
function debugLogPlugin() {
  return {
    name: 'agent-debug-log',
    configureServer(server: { middlewares: { use: (path: string, handler: (req: import('http').IncomingMessage, res: import('http').ServerResponse, next: () => void) => void) => void } }) {
      server.middlewares.use('/__debug_log', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end()
          return
        }
        const chunks: Buffer[] = []
        req.on('data', (c) => chunks.push(c))
        req.on('end', () => {
          try {
            const line = Buffer.concat(chunks).toString('utf8')
            fs.appendFileSync('/opt/cursor/logs/debug.log', line.trim() + '\n')
          } catch {
            /* ignore */
          }
          res.statusCode = 204
          res.end()
        })
      })
    },
  }
}
// #endregion

export default defineConfig({
  base,
  plugins: [react(), debugLogPlugin()],
})
