/**
 * Resolve a path under `public/` so it works in dev (`/`) and
 * GitHub Pages (`/MDT-analysis/`).
 */
export function assetUrl(relativePath: string): string {
  const cleaned = relativePath.replace(/^\//, '')
  const base = import.meta.env.BASE_URL
  return `${base}${cleaned}`
}
