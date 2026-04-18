# What's My Time Worth

A single-purpose calculator: your salary is not what your time is worth.
This tool calculates your real hourly wage by subtracting taxes and
job-related costs, then dividing by the actual hours your job consumes.

Based on the "real hourly wage" concept from *Your Money or Your Life*
(Vicki Robin & Joe Dominguez, 1992).

## Stack

- Astro 4 (static site generator)
- React 18 (calculator UI)
- Tailwind 3 (styles)
- TypeScript
- No backend, no database, no analytics by default

All calculations run client-side. Nothing is stored or transmitted.

## Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:4321`.

## Build

```bash
npm run build
```

Outputs static files to `dist/`. Can be deployed to any static host.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to vercel.com and import the GitHub repo.
3. Vercel detects Astro automatically. No config needed.
4. Click Deploy.
5. Optionally add a custom domain in Vercel settings.

## Structure

```
src/
├── components/
│   └── Calculator.tsx      The main interactive wizard + result
├── data/
│   ├── tax.ts              2025 federal/FICA/state tax logic
│   ├── calculator.ts       Real hourly wage, scenarios, best-state, translation
│   └── catalog.ts          Categorized catalog of items (~45 across 7 tabs)
├── layouts/
│   └── Base.astro          HTML scaffolding, meta, OG tags
├── pages/
│   ├── index.astro         Home (hosts the Calculator)
│   ├── methodology.astro   Math & sources (defensive posture)
│   └── about.astro
└── styles/
    └── global.css          Typography, theme, animations
```

## What v1.1 added over v1.0

- Age input, so we can compute years-at-work and % of remaining waking life.
- "And one more thing" section with the years-at-work sentence.
- Tabbed catalog: 7 categories (Everyday, Nice things, Tech, Trips, Big moves,
  The big numbers, Just for fun), ~45 items total.
- "What if you changed something" section with three scenario toggles:
  remote work, packed lunch, moved to the best no-income-tax state.
- Scenario recalculation shows a live revised hourly wage + delta.

## Updating catalog prices

Catalog items and prices live in `src/data/catalog.ts`. Edit in place. No
build-time magic &mdash; just redeploy after editing.

## Updating tax data

Federal brackets and standard deduction live in `src/data/tax.ts`. Update
annually when the IRS publishes the next year's Revenue Procedure.

State tax rates also in `src/data/tax.ts`. Update from Tax Foundation's
annual state income tax brackets publication.

## Adding AdSense

In `src/layouts/Base.astro`, uncomment the AdSense script and add your
publisher ID. Then place `<ins class="adsbygoogle">` tags where you want
ads in the result page.

## License

MIT. Attribute if you fork, but it's not required.
