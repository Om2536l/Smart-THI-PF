# SMART-THI Dashboard

A five-index transformer health monitoring and closed-loop protection dashboard —
built as an installable PWA, ahead of the primary hardware node coming online.

Live indices per unit: **TSI** (stability), **THS** (cumulative health), **DRI**
(dynamic risk), **RUL** (remaining useful life, IEEE C57.91), **APS** (recommended
action). Currently running on mock data — see `src/data/units.js`.

## Highlights

- **Health signature** — a five-axis radar (also the logo mark) that visibly
  collapses toward the center as a unit's condition worsens.
- **Priority queue** — units needing attention are pinned at the top, sorted
  worst-first, so triage doesn't require scanning every card.
- **Operator / Engineer toggle** — plain-language recommendations by default;
  full technical indices, phase currents, and radar one tap away.
- **Unit detail** — RUL trend, three-phase current bars, the Sense → Understand →
  Decide → Act → Learn signal-flow diagram, and an autonomous-action event log.
- **Methodology page** — AHP vs. empirical weight comparison and consistency
  ratio, straight from the project's weight-derivation methodology.
- **PWA** — installable, offline app-shell caching, light/dark themes.

## Local development

```bash
npm install
npm run dev     # watch mode, writes to dist/
npm run build   # production build to dist/
```

Serve `dist/` with any static server to preview, e.g. `npx serve dist`.

## Deploying to GitHub Pages

This repo includes `.github/workflows/deploy.yml`, which builds and deploys
`dist/` automatically on every push to `main`.

1. Push this repo to GitHub.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main` — the site will be live at
   `https://<username>.github.io/<repo>/` a minute or two later.

All asset paths are relative (`./bundle.js`, `./manifest.json`, ...), so the
app works correctly when hosted under a project subpath like
`/Smart-THI/`, not just at a domain root.

## Wiring up real hardware later

Replace `fetchUnits()` in `src/data/units.js` with a real fetch/MQTT bridge
to the ESP32 primary node — every component already consumes the same
shape (`{ id, feeder, state, tsi, ths, dri, rul, aps, phase, rulTrend,
events }`), so no UI changes are required, only the data source.

## Structure

```
src/
  components/   Header, PriorityQueue, HealthSignature, PhaseBars, TrendChart, ...
  pages/        FleetPage, UnitDetailPage, MethodologyPage
  data/units.js Mock fleet data (swap for real data later)
  styles/       tokens.css (design system), base.css
public/         manifest.json, service-worker.js, icons/, index.html (template)
scripts/build.mjs   esbuild bundler → dist/
```
