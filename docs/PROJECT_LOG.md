# Project Log — Khabir Diagnostic Auto Pro

Running record of what has been done and what is next, so a new Claude Code session can resume without re-deriving context. Newest entries last. Read `CLAUDE.md` first.

## Status at a glance

- **Static site** (`khabir-diagnostic-auto-pro/index.html`): done, tested locally and on phone width (375x812), FR/AR(RTL)/EN, scroll-scrub hero, WhatsApp CTA.
- **Next.js rebuild** (`khabir-next/`): builds (20 static pages), 30/30 Playwright tests pass. Pages: home, services, blog (MDX), about. Arabic copy in Moroccan Darija.
- **Knowledge graph** (`graphify-out/`): built 2026-10-11.
- **Contact details**: WhatsApp, phones, address, map and hours are real (2026-10-14). **Still missing from the owner**: real workshop photos.

## Timeline

### 2026-10-07 — static site
- Started with the 10K Websites skill (`10k-websites/`); installed ffmpeg.
- Researched owner pain points; concept: "Diagnose, don't guess".
- Start-frame v2 (red backlight) approved; Seedance 2.5 hero video generated, QA passed (static camera).
- Added `hero-scrub.mp4`, poster and ending assets to `khabir-diagnostic-auto-pro/assets`.
- Wrote `index.html`; tested locally and in Chrome (scroll-seek video, press-hold scan).
- Phone layout verified, 0 console errors; Arabic RTL fault card fixed.
- A safety hook blocked deleting `scratch-frames/`; left in place (git-ignored).

### 2026-10-08 — Next.js decision
- Mapped assets: desktop scroll-scrub hero video + poster; phone static ending image.
- Recommended Next.js over plain React. Migration plan started (`docs/nextjs-migration-plan.md`).

### 2026-10-11 — Next.js Stage 1 + tooling
- Plan approved: Next.js dual-video site per `docs/claude-code-nextjs-dual-video-prompt.md`.
- Installed skills `emil-design-eng` and `impeccable` (project-local in `.claude/skills`).
- Added `tools/media/encode.sh`; chose all-intra CRF 30 (desktop 7.1 MB, mobile 6.1 MB).
- Scaffolded `khabir-next` (Next.js 16.4, App Router, TypeScript, Playwright, no next-intl). i18n is a plain dictionary routed via `proxy.ts`.
- Wrote `next.config.ts`, `config/hero.ts`, `lib/captions.ts`, `hooks/useHeroScrub.ts`, `styles/globals.css`, `components/ui/{Reveal,Button}` from the static site as reference. Encoded hero videos live in `khabir-next/public/media/`.
- **Graphify installed** from https://github.com/Graphify-Labs/graphify (pipx, v0.9.85, replacing an older PyPI `graphifyy` 0.9.48). Skill registered in `~/.claude/skills/graphify`.
- **Knowledge graph built**: 975 nodes, 2,750 edges, 49 communities in `graphify-out/` (`graph.html`, `graph.json`, `GRAPH_REPORT.md`).
  - AST on all 51 code files; LLM extraction on 8 project docs + 9 unique images (4 agents).
  - Not LLM-read: third-party skill docs (`.claude/skills`, `10k-websites`), duplicate images, the 3 hero videos.
  - `index.html` was only read to line 400 (CSS/head) by the docs agent; markup/JS not in the semantic layer.
  - ~40 of 49 communities are the Impeccable skill's `live-browser` scripts (tooling noise).
  - Health check: 17 dangling-endpoint edges, 19 self-loops.
- **Pushed to GitHub**: https://github.com/hamzaMallem/khabir-diag-pro-10k.git (branch `main`).

### 2026-10-14 — skills, Darija copy, new pages
- Product scope agreed with the user: landing + WhatsApp + workshop location + services + articles every 3 days + about. Arabic copy in **Moroccan Darija**. No new guarantees (owner has confirmed none).
- Installed Vercel skills (project-local): `vercel-react-best-practices`, `web-design-guidelines` (`npx skills add vercel-labs/agent-skills ...`). Skipped the others (react-native, deploy, optimize, writing, view-transitions, composition).
- `npm run build` run for the first time: passed with no fixes needed.
- `messages/ar.json` rewritten in Darija; new keys (nav, location, services page, about, blog) added to ar/fr/en (141 keys each). FR copy unchanged except new keys and `[année]` in the WhatsApp message.
- New pages: `/[locale]/services`, `/[locale]/about`, `/[locale]/blog`, `/[locale]/blog/[slug]`. Shared parts in `components/pages/`, per-page metadata via `lib/pageMetadata.ts`.
- Blog = MDX files in `khabir-next/content/blog/<locale>/<slug>.mdx` with `export const metadata = { title, description, date: "YYYY-MM-DD", tags }` (`@next/mdx`, `lib/blog.ts`). Two Arabic articles: `adblue-light`, `code-comes-back`. FR/EN blog shows an empty state pointing to Arabic.
- `LocationSection` on the home page: shows the Google Maps embed only once `site.streetAddress` is set in `config/site.ts`; placeholder until then.
- Nav: page links (second scrolling row under 1080px), language switch keeps the current page, WhatsApp fallback link works from inner pages. Footer lists the pages. Sitemap includes all pages and articles.
- Verified: build OK, 30/30 Playwright tests, `/ar/*` pages checked at 375px (RTL OK, no overflow, no console errors).
- Added `khabir-next` (`npm run start`, port 3000) to `.claude/launch.json`.

### 2026-10-14 (later) — real contact details
- From the user and the Google Maps listing (https://maps.app.goo.gl/hEALPzvM1aEfoSbr5), now in `khabir-next/config/site.ts`:
  - WhatsApp (all CTAs) = Saidi `+212 6 32 89 92 18`; second number = Youssef (the expert) `+212 6 71 76 58 96`. Both shown as tap-to-call (`components/ui/PhoneLinks.tsx`).
  - Address: proche Pharmacie Hay Redouane, Quartier Hay Redouane, Beni-Mellal 23000; geo 32.3415409, -6.3638183 (map embed by coordinates).
  - Hours: Mon–Thu and Sat 08:30–19:00, Fri 09:00–19:00, Sun closed. Translated text in `i_hours`.
- New service: travel anywhere in Beni Mellal province (mountains, far from the workshop), at night, every day, **no price mentioned** (user's choice). `RoadsideCallout` under the map (home) and on /services.
- About page: story + team: Youssef, the expert, 25 years of experience; Saidi, 5 years. Workshop photos still "to be added".
- JSON-LD now includes telephone, openingHours, geo, postalCode, areaServed = province. Test updated accordingly. Nav solid background raised to 0.92 opacity (taller bar with page links).
- Verified: build OK, 30/30 Playwright tests, `/ar` and `/ar/about` at 375px (map pin loads, tel/wa.me links correct, no overflow).

### 2026-10-14 (later) — security hardening + Vercel
- Security headers for every route in `khabir-next/next.config.ts`: CSP (self-hosted assets only, Google Maps frames, `object-src 'none'`, `frame-ancestors 'none'`), HSTS (2 years), nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy, COOP; `poweredByHeader: false`. `'unsafe-inline'` scripts kept on purpose: nonces would force dynamic rendering of every page.
- Google Maps iframe sandboxed (`allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox`).
- New Playwright test: security headers on every page type (31 tests total, all pass).
- `npm audit`: 0 runtime vulnerabilities; 5 "high" findings are dev-only (`eslint-config-next` → `braces`), fix requires a breaking downgrade, left as is.
- **Vercel**: project `khabir-diag-pro-10k` (team `mallemdevs-9140s-projects`) is linked to the GitHub repo and deploys `main` automatically on every push. Production: https://khabir-diag-pro-10k.vercel.app (headers verified live).
- `site.url` now falls back to Vercel's `VERCEL_PROJECT_PRODUCTION_URL`, so canonical/sitemap/Open Graph use the production domain without any env var (the Vercel connector had no permission to create env vars: 403). Set `NEXT_PUBLIC_SITE_URL` in the Vercel dashboard once a custom domain exists.

### 2026-10-15 — nav hardening, watermark removal, conversion copy
- **Watermark**: the generator's "Dola AI" stamp (bottom-right of both hero videos and both `*-end.jpg`) removed with ffmpeg `delogo`. `tools/media/encode.sh` now applies it per variant (boxes in `LOGO`); videos re-encoded from `review/` with `encode.sh 1 30`; end images patched in place. If the source videos are ever replaced, re-check the boxes.
- **Nav**: could not reproduce the "stacked links with bullets" report on the live site (CSS applied correctly), so the bar was hardened instead: explicit row layout and `list-style: none` on `li` + `::marker`; brand shrinks first at 560–1080px so the bar is two rows at most (it was three at ~640px). New short nav button label `nav_cta` (it reused the long hero CTA before).
- **Copy** (ar/fr/en, 155 keys each): primary CTA is now benefit-led ("Find my fault on WhatsApp" / "Trouver ma panne sur WhatsApp" / "عرف العطب الحقيقي فواتساب"); contact heading "Send the symptom. Get a clear price."; final hero caption states the real-cause promise; services, demo, location, blog headings and meta descriptions reworded. No new guarantees added (only existing promises: written quote before work, no part without proof).
- Tests: 34 pass (new: top-bar-is-one-row at desktop/tablet/phone; CTA text updated). tsc, lint, build clean.
- **Brand Ticker**: Replaced static brand text in `ServicesSection` with an infinite moving marquee (`BrandTicker.tsx`, `BrandLogos.tsx`) displaying custom vector logos and names for Mercedes-Benz, BMW, Audi, Volkswagen, Porsche, MINI, Škoda, and SEAT. Smooth GPU animation with pause-on-hover, glassmorphism badges, edge gradient masks, zero horizontal overflow, and full RTL compatibility. 34/34 Playwright tests pass.
- Not done: nothing committed or pushed; real workshop photos still missing.

### 2026-10-15 (later) — faster hero video, quality untouched
- Apple-like type system (Inter + IBM Plex Sans Arabic, light tracking, 28px radii, frosted nav); quote cards lost their orange side bar.
- **Video loading** (no re-encode, quality unchanged): an inline script in `HeroSection` (`lib/heroVideo.ts`) starts downloading the right variant while HTML parses; `useHeroScrub` plays it from a blob URL, so scrubbing seeks in memory instead of making range requests. Falls back to normal streaming if the fetch fails; skips the video (still frames) on Data Saver / 2G.
- **Cache**: `/media/*?v=N` is `max-age=1y, immutable`; `step-*` images 1 day + SWR. Hero URLs come from `config/hero.ts` (`MEDIA_VERSION`): **bump it whenever a file in `public/media` is replaced.** CSP now has `media-src 'self' blob:`.
- Verified: build clean, 35 Playwright tests pass (new: cache + CSP header test); in the browser the video is one request, `video.src` is a `blob:` URL, and a second visit transfers 0 bytes.
- Not measured: Lighthouse on a throttled real device; worth doing on the live site after deploy.

### 2026-10-15 (evening) — mobile nav + brand ticker
- **Mobile nav** (`components/layout/Nav.tsx`, breakpoint 960px, `WIDE_QUERY` must match `Nav.module.css`): below 961px the bar is one row (logo, contact button, menu button). Pages and the language switch live in a full-screen sheet (`role="dialog"`, Esc closes, Tab stays inside, page scroll locked, closes on navigation). The contact button used to be hidden under 560px; it is now always in the bar. New keys `nav_menu` / `nav_close` (157 keys per language).
- **BrandTicker** (written in Antigravity, reviewed and accepted): moved from the services section to the end of the problem section, right after "German cars talk…". Fixes: screen readers heard brand names twice, reduced-motion scrolled the wrong element, zero-offset glow removed, and on phones the strip collapsed to zero height (`flex: 1` in a column).
- **Not committed on purpose**: 9 unused images dropped in `khabir-next/public/` (Mercedes E63 render, iStock files, `cvsimo-photo`, `bgWebsite`, `service*.png`, a WhatsApp photo of a heater core). Nothing references them, they weigh ~9 MB, and some look like third-party/stock images (licence unknown). Decide which ones are real workshop photos before adding them (optimised, under `public/media`).
- Tests: 37 pass (new: mobile menu on phone/tablet, language switch in sheet, ticker visible on phones).

## Next steps (in order)

1. Get from the owner: real workshop photos (about page + hero alternatives).
2. Optional: buy/connect a custom domain in Vercel, then set `NEXT_PUBLIC_SITE_URL` to it.
3. Submit `https://khabir-diag-pro-10k.vercel.app/sitemap.xml` to Google Search Console; create/claim the Google Business Profile link to the site.
2. Publish an article every 3 days: add `content/blog/ar/<slug>.mdx`. Next topics: DSG/7G-Tronic faults, battery draining overnight, NOx sensor before replacing the catalyst. Optional: a scheduled task that drafts (not publishes) the next article for review.
3. Optional: add Playwright tests for the new pages; review with the `web-design-guidelines` and `vercel-react-best-practices` skills.
4. Deploy (Vercel or other) and set `NEXT_PUBLIC_SITE_URL`.
5. Optional graph cleanups: exclude `.claude/` from graphify (`.graphifyignore`) and rebuild; `graphify label` to rename communities; re-read `index.html` fully.

## Conventions

- Query the graph before reading many files: `graphify query "<question>"`, `graphify path "A" "B"`, `graphify explain "X"`.
- After code changes: `graphify update .` (AST only, no LLM).
- Append a dated entry to this file at the end of every work session.
