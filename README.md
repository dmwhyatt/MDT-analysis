# MDT-analysis

Collected set of analysis scripts and an interactive dashboard for the 3AFC
melodic discrimination test (MDT).

## Layout

| Path | Purpose |
|------|---------|
| `dashboard/` | Vite + React static site (GitHub Pages) |
| `analysis/` | Python analyses (later); emit into `dashboard/public/data/` |
| `.github/workflows/` | Lint, unit tests, Playwright smoke, Pages deploy |

## Dashboard (empty shell)

```bash
cd dashboard
npm ci
npm run dev
```

Useful scripts:

- `npm run lint` — oxlint
- `npm run test` — Vitest unit tests
- `npm run build` — production build
- `npm run test:e2e` — Playwright smoke (run `npm run build` first)

Fixture data lives in `dashboard/public/data/melodies.json` with MIDI under
`dashboard/public/midi/` (`melody_0001.mid` …).

GitHub Pages builds with `GITHUB_PAGES=true` so the asset base is `/MDT-analysis/`.
