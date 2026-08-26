# AGENTS.md

## Cursor Cloud specific instructions

`MDT-analysis` hosts MDT analyses and a static exploration dashboard.

### Layout

- `dashboard/` — Vite + React SPA (TanStack Table, Tom Select, WaveRoll). This is
  the primary runnable app today.
- `analysis/` — reserved for Python analyses; precomputed CSV/JSON should be
  written into `dashboard/public/data/`.
- No live feature recomputation in the browser; values are static artifacts.

### Dashboard commands

Run from `dashboard/` after `npm ci` (also performed by the VM update script):

- Dev server: `npm run dev` (http://localhost:5173)
- Lint: `npm run lint` (oxlint)
- Unit tests: `npm run test` (Vitest)
- Build: `npm run build`
- Preview: `npm run preview`
- E2E smoke: `npm run build && npm run test:e2e` (Playwright Chromium; first time
  run `npm run test:e2e:install`)

Production Pages builds set `GITHUB_PAGES=true` so Vite `base` is `/MDT-analysis/`.
Local/dev/e2e builds leave that unset (`base` = `/`).

### Notes

- Fixture shell uses five MIDI files named `melody_000N.mid` and
  `public/data/melodies.json` (schemaVersion 1).
- Significance filter defaults to **on** (`p < 0.05`) for visible feature columns.
- WaveRoll is loaded as a web component; prefer exercising it in the browser rather
  than unit tests (unit tests cover column filtering logic).
- A Python `.venv` at the repo root may exist for future `analysis/` work; it is
  not required to run the dashboard.
