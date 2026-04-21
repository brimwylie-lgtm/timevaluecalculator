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

## What v2.2.2 fixed over v2.2.1

- Corrected both Child Care Aware links (methodology body + data sources
  list) from the wrong research-page URL to the correct state-by-state
  resource map at `https://www.childcareaware.org/resources/state-by-state-resource-map/`.

## What v2.2.1 fixed over v2.2

- Corrected all five Your Money or Your Life book links from the wrong
  `yourmoneyoryourlife.com/book/` URL to Vicki Robin's canonical page at
  `https://vickirobin.com/your-money-or-your-life/`. Affects methodology
  (2 instances), about (1), and FAQ (2 linked answers).

## What v2.2 added over v2.1.1

**External source links and internal linking for SEO authority signals.**

External links added:
- IRS Revenue Procedure 2024-40 (federal tax brackets)
- Social Security Administration wage base
- Tax Foundation state income tax data
- Bureau of Labor Statistics (BLS) wage statistics
- Kelley Blue Book (catalog vehicle prices)
- The Knot wedding cost report
- Child Care Aware (childcare cost data)
- Your Money or Your Life book (publisher page, not Amazon)

Locations:
- Methodology: 4 inline links in body copy plus full linked sources list
  at the bottom (8 sources total, all rel=noopener)
- About: book and methodology linked inline
- FAQ: 5 of 8 answers got linked variants (book, methodology, privacy)

Internal linking improvements:
- "Related" sections added to methodology, about, privacy, terms — each
  linking to 3 sibling pages with descriptive anchor text. Wikipedia-style
  internal linking that Google rewards for crawl-graph signals.
- Homepage Related section expanded from 2 to 4 links (added contact and
  privacy).
- About page now inline-links to methodology and privacy where natural.
- Methodology corrections link fixed — was pointing to "the contact link
  on the about page" (indirect); now links directly to /contact.

FAQ data structure:
- New optional `linkedAnswer` field on `FaqItem` carries HTML version
  with inline links. The plain `answer` field stays text-only because
  it's used in the JSON-LD FAQPage schema, which doesn't render HTML.
- Homepage FAQ render uses `set:html` with `linkedAnswer` when present,
  falls back to plain answer otherwise.

Last-updated dates:
- Methodology: April 20, 2026 (with comment to bump on substantive changes)
- About: April 20, 2026

All external links use `target="_blank"` with `rel="noopener noreferrer"`.
No `nofollow` — passing link equity to authoritative sources is part of
the legitimacy signal.

## What v2.1.1 fixed over v2.1

- **Header contrast bug.** Initial v2.1 used `text-ink-soft` and
  `text-cream/80` for header nav links, which rendered nearly invisible
  against the cream background. Bumped to full `text-ink` with
  `font-medium` weight for readable contrast at the small nav size.
- **Homepage header theme corrected.** The homepage intro uses a cream
  background, not the ink-dark background I'd assumed. Switched homepage
  header from `theme="dark"` to `theme="light"` to match. The `dark` theme
  option is preserved in the component for any future dark-backgrounded
  pages or sections.
- **Logo size in header bumped** from 28 to 32 for better readability.

## What v2.1 added over v2.0.1

**Site header and social footer.**

- New `SiteHeader.astro` component — minimal transparent header with the
  compact logo on the left and three nav links on the right (Methodology,
  About, Contact). Absolute positioned so it overlays the hero on the
  homepage without displacing content. Scrolls away naturally, not sticky.
- `theme` prop on the header: `dark` for the homepage (cream text over the
  dark hero) and `light` for all subpages (ink text over the cream
  background).
- Inline logo at the top of every subpage (methodology, about, privacy,
  terms, contact) removed — the new header handles brand placement
  consistently. Top padding on subpage `<main>` adjusted from `py-16
  md:py-24` to `pt-28 pb-16 md:pt-32 md:pb-24` to make room for the
  header.
- Social media links added to both footers (SiteFooter component + bespoke
  homepage footer): Instagram, Threads, TikTok, YouTube, X. Rendered as
  uppercase mono text in a row alongside the copyright line. All open in
  new tabs with `rel="noopener noreferrer"`.

**Social handles:**
- Instagram: https://www.instagram.com/afterwagecalc/
- Threads: https://www.threads.com/@afterwagecalc
- TikTok: https://www.tiktok.com/@afterwage
- YouTube: https://www.youtube.com/@AfterWage
- X: https://twitter.com/afterwage

## What v2.0.1 added over v2.0

- **Fixed Vercel build error.** `@astrojs/sitemap` 3.7.x has a known bug
  ([withastro/astro#15894](https://github.com/withastro/astro/issues/15894))
  that crashes the build with "Cannot read properties of undefined (reading
  'reduce')". Pinned to exact version `3.2.1` (no caret) to prevent npm from
  auto-upgrading to the broken release.
- Simplified sitemap config — removed the custom `serialize` function with
  per-page priority hints. Google largely ignores sitemap priority values,
  and the simpler config reduces future bug surface.

## What v2.0 added over v1.9

**Analytics instrumentation and copyright.**

- New `src/lib/track.ts` — typed wrapper around `gtag()` with a `EventName`
  union that forces consistency and catches typos at build time. Safe to
  call during SSR or with ad blockers active (no-op in both cases).
- `calc_started` event fires when the user clicks "Find out" on the intro.
- `calc_completed` event fires via `useEffect` when the result view first
  renders. Fires again on revisions (user hit Edit, changed inputs, returned
  to result) — intentional, since each completion is a real engagement.
- `share_clicked` event fires from all six share paths in
  `PurchaseShareButtons`: twitter, reddit, linkedin, whatsapp, copy, native.
  Each includes `platform` and `context: 'purchase'` parameters.
- Copyright notice added to both footers: "&copy; 2026 AfterWage. All rights
  reserved." Homepage footer uses a dedicated bottom section separated by a
  hairline rule; subpage SiteFooter uses a single line below the nav.

**GA4 setup required after deploy:**

1. In DebugView, verify events are firing (install the GA Debugger Chrome
   extension, enable it on the deployed site, step through the calculator).
2. Admin → Custom definitions → Create custom dimensions:
   - `Share Platform` (parameter: `platform`, scope: Event)
   - `Share Context` (parameter: `context`, scope: Event)
3. Admin → Events → Mark `calc_completed` as key event. Optionally
   `share_clicked` too.
4. Explore → Funnel exploration → build page_view → calc_started →
   calc_completed funnel.

Custom dimensions only capture data from creation forward; register them
immediately after first deploy to avoid losing early data.

## What v1.9 added over v1.8.1

- **Sitemap integration pre-installed.** `@astrojs/sitemap` added to
  `package.json` dependencies and registered in `astro.config.mjs` with
  per-page priority hints (homepage 1.0, content pages 0.8, compliance
  pages 0.3). Running `npm install` then `npm run build` now automatically
  produces `dist/sitemap-index.xml` and `dist/sitemap-0.xml`.
- No need to run `npx astro add sitemap` manually.

## What v1.8.1 added over v1.8

- Fixed `robots.txt` sitemap URL from `/sitemap.xml` to `/sitemap-index.xml`
  (correct path that Astro's sitemap integration generates).
- Added `Mediapartners-Google` crawler directive to `robots.txt` so AdSense
  can crawl pages to determine ad relevance.

## What v1.8 added over v1.7

- **Logo fixes.** The full variant's viewBox was too narrow, causing "Wage"
  to be clipped. Also rebuilt both variants using a single flowing `<text>`
  element with `<tspan>` children instead of absolutely-positioned separate
  text elements — much more robust. Viewbox widened from 600x220 to 800x280.
  The full variant now also includes masthead rules top and bottom and an
  "A CALCULATOR / VOL. 01" eyebrow, matching the OG image aesthetic.
- **Google Analytics.** GA4 tracking (measurement ID G-EHFLML0P50) added to
  `Base.astro` immediately after the `<head>` tag per Google's instructions.
  Uses Astro's `is:inline` directive on the inline script so it's output
  verbatim without bundler interference. Loads on every page automatically.

## What v1.7 added over v1.6

**The AfterWage rebrand.** The whole project is now branded as **AfterWage**
(afterwage.com), with "what's my time worth?" as the tagline.

Changes:
- New `Logo.astro` component in `[After] Wage` bracket treatment — Fraunces
  serif body + JetBrains Mono brackets. Variants: full (lockup with tagline),
  compact (inline), mark ([a] favicon).
- New favicon in `public/favicon.svg` using the `[a]` bracket mark.
- Homepage footer rebuilt around the full AfterWage lockup (replaces old
  text-only "What's My Time Worth" brand line).
- Compact logo added to the top of every subpage: methodology, about,
  privacy, terms, contact. Every page now has brand presence.
- `SiteFooter` rebuilt with compact logo as the home-link anchor.
- Share image (`ShareImage.tsx`) updated: top-right watermark now
  AFTERWAGE.COM; bottom-right URL now afterwage.com; bottom tagline changed
  to "Your wage, after everything."
- New `public/og-image.png` (1200x630 @ 2x density) — matches the masthead
  logo aesthetic. Used for all social-platform link previews.
- All meta titles updated to lead with AfterWage brand: "AfterWage — Real
  Hourly Wage Calculator", "Privacy Policy — AfterWage", etc.
- Homepage schema includes `alternateName: "What's My Time Worth"` to
  preserve entity continuity if the old name accrued any early mentions.
- Every hardcoded URL reference updated: astro.config.mjs, Base.astro meta
  fallback, robots.txt sitemap, ShareImage watermarks, PurchaseShareButtons
  default siteUrl, Calculator copyShareText.
- Site-wide brand keyword "afterwage" added to homepage meta keywords.

**To regenerate the OG image** after visual tweaks, the render script
lives at `/home/claude/render-og.js` (requires Playwright).

## What v1.6 added over v1.5

- `/contact` page with a Tally-hosted popup form (form ID `ja90KQ`). Spam
  protection via Tally's built-in Cloudflare Turnstile. Modal layout with
  waving-emoji trigger.
- Contact link added to both the homepage footer and the shared
  `SiteFooter` on all subpages.
- All four `mailto:hello@whatsmytimeworth.com` references removed from
  Privacy, Terms, and About pages — replaced with links to the contact
  form. No email addresses exposed anywhere on the site.
- Tally widget script loads only on `/contact` (not globally), keeping
  other pages free of third-party script weight.

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
