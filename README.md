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

## What v1.2 added over v1.1

- Canvas-based share image generator: 1080x1080 PNG with the user's real
  hourly wage, delta, real work week, and brand mark. Lives in
  `src/components/ShareImage.tsx`.
- Download and clipboard-copy actions. On browsers that support it, "Copy to
  clipboard" lets users paste the image directly into Twitter/WhatsApp/etc.
  without saving to disk.
- Matches site aesthetic (cream, serif, blood-red accent) so branding is
  consistent from feed to landing page.

## What v1.5 added over v1.4

- Privacy Policy page at `/privacy` covering AdSense, Analytics, PIPEDA,
  CCPA/CPRA, GDPR, children, cookies.
- Terms & Conditions page at `/terms` with liability disclaimers, no-advice
  clause, acceptable use, Ontario/Canada governing law.
- Shared `SiteFooter.astro` component linking all subpages. Makes privacy
  and terms discoverable from every page.
- Homepage footer updated with Privacy and Terms links.

**Important:** The Privacy Policy and Terms are template-quality, not
lawyer-reviewed. Before heavy traffic or real revenue, have a lawyer
review these. They cover the obvious bases but are not a substitute for
legal counsel.

## What v1.4 added over v1.3

- Social sharing buttons on the purchase-cost widget. Types a purchase,
  gets the hours-of-your-life result, can now share directly to Twitter/X,
  Reddit, LinkedIn, WhatsApp, or copy-paste — each with the actual result
  text pre-populated.
- Mobile shows a single "Share" button that invokes the native share sheet
  (`navigator.share`), giving access to every app on the phone.
- Desktop shows compact icon buttons for the main platforms.
- All icons are inline SVG — no external icon library dependency.

## What v1.3 added over v1.2

- SEO-expanded homepage: keyword-aware body copy below the calculator, plus an
  8-question FAQ section. Keywords include "real hourly wage calculator,"
  "true hourly wage calculator," "take-home pay calculator," "salary to
  hourly calculator after taxes," "affordability," and "hidden cost of
  working."
- JSON-LD structured data: `WebApplication` schema tells Google what the tool
  is; `FAQPage` schema enables rich snippets in search results.
- Upgraded meta tags on all three pages with keyword-targeted titles and
  descriptions.
- `og:image` tag references `/og-image.png` (see below — you need to create
  this before launch).
- Fixed AdSense URL (was pointing at wrong hostname in v1.0-v1.2).

## Before launch checklist

- [ ] Create `/public/og-image.png` at 1200×630. This is the preview card
      that shows when the URL is pasted into Twitter, Slack, iMessage, etc.
      Without it, links unfurl without an image. Easy to design in Figma or
      generate from the share image component.
- [ ] Decide on domain, update `astro.config.mjs` site URL, update hardcoded
      "WHATSMYTIMEWORTH.COM" references in `ShareImage.tsx` (appears 3x) and
      in the `copyShareText` function in `Calculator.tsx`.
- [ ] Verify in Google Search Console after deploy.
- [ ] Submit sitemap at `/sitemap.xml` (Astro can generate this — run
      `npx astro add sitemap` if you want it).

## Still to do

- **Open Graph preview image.** When someone pastes the site URL into
  Twitter/Facebook, they currently see no preview image. You want a generic
  1200x630 PNG at `/public/og-image.png` referenced from `Base.astro`. Can
  be generated once with a headless browser or designed in Figma; it's not
  user-specific so it's not computed at runtime.
- **Self-hosted fonts.** Currently loads Fraunces/Newsreader/JetBrains Mono
  from Google Fonts. Self-host for performance and GDPR cleanliness.
- **"Compare with a friend" mode.** Second salary input on the result page,
  side-by-side numbers.

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
