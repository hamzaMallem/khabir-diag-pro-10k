# Next.js migration plan — Khabir Diagnostic Auto Pro

Source of truth: `khabir-diagnostic-auto-pro/index.html` (CSS 19-385, markup 387-681, JS 683-1154).
Target: `khabir-next/` (Next.js App Router, TypeScript). The original folder stays untouched for side-by-side comparison.

## Corrections to the original brief
- The page has **3 languages**: `fr` (default, lines 829/1148), `ar` (RTL), `en`. Buttons 414-416; dictionaries fr 696-736, ar 738-778, en 780-820.
- Language choice is remembered in `localStorage['khabir-lang']` (877, 1147); browser language is never read.
- `docs/design-package.md` differs (FAQ). `index.html` wins.

## Key decisions
| Topic | Decision | Why |
|---|---|---|
| Styling | Copy CSS 20-384 verbatim into one `styles/globals.css`. No Tailwind, no CSS Modules. | Design runs on custom-property maths, `html[lang=ar]`/`[dir=rtl]` ancestor selectors, cascade order (reduced-motion block last), and JS-toggled global classes. |
| CSS edits allowed | (1) font families → next/font vars (lines 25, 30, 69, 70, 75, 310, 374, 375); (2) line 174 `url('/assets/hero-ending.jpg')`; (3) `.loader[data-mode="cue"] svg{display:none}` + `.loader:not([data-mode="cue"]) .cue{display:none}` (replaces innerHTML swap in `showCue`). | Minimal regression surface. |
| i18n | next-intl v4, routes `/fr` `/ar` `/en`, `defaultLocale:'fr'`, `localePrefix:'always'`, `localeDetection:false`. Switcher writes `khabir-lang` cookie; `proxy.ts` redirects `/` to cookie locale or `/fr`. | Crawlers can index AR/EN, hreflang possible, server-rendered `lang`/`dir` (no French flash for Arabic visitors). |
| Rendering | All markup = server components (SSG ×3). 6 small client islands mutate DOM via refs. No React state on any per-frame path. | Same perf as original. |
| Fonts | `next/font/google`: Saira Condensed 600/700, Alexandria 600/700 (arabic+latin), Readex Pro 300/400/500 (arabic+latin), IBM Plex Mono 400/500. Variables on `<html>`. | Self-hosted, no render-blocking Google CSS. |
| Assets | Byte-identical copies in `public/assets/`. Video fetched as blob like today. Hero layers stay CSS backgrounds set at runtime (phones never download them). Step/lab images stay `<img>` in phase 1. | Keep mobile savings and exact behavior. |
| Deploy | Vercel, standard Next (SSG + proxy). Static-export variant optional (P11). | |

## Folder tree
```
khabir-next/
  app/
    layout.tsx                 passthrough root
    icon.svg                   favicon from line 15
    robots.ts  sitemap.ts
    [locale]/
      layout.tsx               <html lang dir data-scroll-behavior="smooth">, fonts, metadata, hreflang, generateStaticParams
      page.tsx                 all sections + JSON-LD
      opengraph-image.jpg      1200x630 crop of hero-ending.jpg
      not-found.tsx
  components/
    Background (S) 390-405 · Nav (C) 407-420, 1052-1055, 1145 · SplitText (S) 831-856
    Hero (S) · HeroScrub (C) · StaticHero (S) 491-500
    Problem (S) 503-521 · Method (S) 523-551 · StepImage (C)
    Lab (C) 553-593 + 1081-1142 · Services (S) 595-629 · Promises (S) 631-642
    Faq (S) 644-656 · FinalCta (S) 658-672 · Dust (S) 1078-1079 · Footer (S) 675-681 · Year (C)
    PageEffects (C) 1057-1076 · JsonLd (S) · icons (S)
  hooks/useHeroScrub.ts        884-1050, one useEffect
  lib/ site.ts (686-692) · motion.ts (825-827) · gates.ts (1023-1029) · heroRuntime.ts · videoCache.ts · wa.ts (859-862)
  i18n/ routing.ts request.ts navigation.ts
  messages/ fr.json ar.json en.json
  proxy.ts
  public/assets/
  styles/globals.css
  tests/ visual.spec.ts i18n.spec.ts gates.spec.ts playwright.config.ts
```
(S) = server, (C) = client.

## Markup porting rules
- JSX attribute names (`className`, `tabIndex`, `playsInline`, `strokeWidth`, `stopColor`, `preserveAspectRatio`, `pathLength`…).
- Keep every id, class, `aria-*`, `data-live`, band `data-a/b/ramp/spread`. Drop `data-i18n`.
- CSS vars in style props cast as `React.CSSProperties`.
- `a.wa` hrefs rendered server-side with final `wa.me` link, `target="_blank" rel="noopener"`.
- Cue text and lab initial strings server-rendered per locale.

## Hero scrub port (highest risk)
- `Hero.tsx` (server) renders all stage children; passes them to `<HeroScrub>` (client) which renders `section.hero#top` with a ref and calls `useHeroScrub(ref)`.
- HeroScrub has no state → never re-renders → React never overwrites imperative writes.
- One `useEffect(..., [])`; all mutable state in closure locals; `AbortController` for the fetch; `disposed` guard; full cleanup (observers, mql listeners, resize, timers, object URL revoke, classes reset).
- Must keep exactly:
  - Lerp `shown += (target-shown)*(1-Math.pow(0.84, dt/16.667))`, dt capped 100 ms; settle 0.0005; loop stops when settled and `loadK>=1`.
  - Load ramp: cubic ease-out 1300 ms only if progress < 0.02 at enable.
  - Single in-flight seek, latest pending, skip if < 1 ms.
  - Delta-gated writes: opacity 1e-3, `--k` > 0.008 or 0/1, `--endop`/`--cueop` 0.01, readout 100 ms.
  - HUD state machine `s=floor(clamp((p-.5)/.26)*9)`, `.hud.open` when `s>=5`, className `'sub '`.
  - `--endop = smoothstep(p,.7,.86)` while `!videoReady`; `placeFault()` on enable/resize.
  - `fetch(…,{priority:'low'})`, 20 s re-arming watchdog, `VIDEO_BYTES` fallback, `video.muted = true`.
- Gates: CSS media query decides first paint; `matchMedia` only inside the effect (no hydration mismatch). `gates.spec.ts` asserts CSS list == `GATES.join(', ')`.
- `videoCache.ts` keeps the finished Blob so locale switches don't re-download 3.7 MB.
- Nav reads `heroRuntime.scrubOn`.

## SEO
- Per-locale `generateMetadata`: title, description (AR/EN descriptions must be written and approved), canonical, hreflang fr/ar/en/x-default, OG (`fr_MA`/`ar_MA`/`en_US`), twitter large image, `metadataBase` from `NEXT_PUBLIC_SITE_URL`.
- `viewport.themeColor = '#0E1518'`.
- JSON-LD `AutoRepair`: only known facts (name, alternateName, url, image, description, areaServed Beni Mellal, address locality/country, services). Phone/address/hours added when the owner provides them.
- `sitemap.ts` (3 URLs + alternates), `robots.ts`.

## Phases (each ends with a verification gate)
| # | Phase | Effort | Gate |
|---|---|---|---|
| P0 | Baselines from original (:8080): Playwright screenshots at 1440×900, 375×812, 768×1024, 844×390 coarse, reduced-motion; hero at p = 0/.1/.33/.6/.9/1; all sections; fr/ar/en; lab done; FAQ open. Lighthouse + perf trace. | 0.5 d | Baselines saved in `tests/baseline/` |
| P1 | Scaffold, copy assets, launch.json, next.config | 0.25 d | dev + build OK |
| P2 | globals.css, fonts, layout shell, Background, static Nav, Footer | 0.5 d | Matches baseline, no hydration warnings |
| P3 | i18n + routing + proxy + tests | 0.5 d | `/`→`/fr`, cookie redirect, `/ar` rtl, 3 SSG routes |
| P4 | Static sections + PageEffects | 1 d | Pixel diff ≤ 0.1%, reveals/FAQ/paused work, RTL OK |
| P5 | SplitText + StaticHero (deterministic rng order, Arabic whole-word rule, seed `len*97+13`) | 0.5 d | SplitText output == original outerHTML for b1-b4 ×3 locales |
| P6 | useHeroScrub | 1 d | 6 progress screenshots match; live gate switching; one mp4 fetch in prod; loader→cue; failure path; no React commits while scrolling; rAF stops when idle |
| P7 | Lab | 0.5 d | Hold ≈3.4 s, ease back, keyboard, reduced-motion pinned, aria-live |
| P8 | Nav behavior + language switcher | 0.25 d | `.solid` thresholds; switch keeps scroll, uses video cache |
| P9 | SEO | 0.5 d | Correct head per locale; JSON-LD validates; sitemap/robots |
| P10 | Prod comparison + Vercel preview | 0.5 d | SEO 100, a11y ≥ baseline, perf within 5 pts; real iPhone/Android check |
| P11 | Optional static export | 0.25 d | `out/` works under http-server |

Total ≈ 6 developer-days.

## Risks
1. CSS cascade drift → verbatim single file + screenshot diffs.
2. next/font rendering → compare after `document.fonts.ready`; `adjustFontFallback:false` if needed.
3. Hydration mismatch → seeded SplitText/Dust, browser APIs only in effects, `suppressHydrationWarning` on `<html>` and year only.
4. React overwriting imperative DOM → no state in hero/lab/nav; cue swap via data attribute.
5. Strict Mode double effects → full cleanup + `disposed` guard.
6. Locale switch remounts page (lab resets) → accepted, documented; blob cache; `scroll:false`.
7. ICU parsing alters strings → raw-vs-`t()` parity test; `t.raw()` fallback.
8. Next 16 API differences (`proxy.ts`, async `params`) → check installed version.
9. Bigger JS bundle → small islands, no client messages; measure in P10.
10. Business data incomplete (`WA_NUMBER`, address, hours, OG URL) → `lib/site.ts` + env; launch checklist.

## Commands
```powershell
npx.cmd create-next-app@latest khabir-next --ts --app --eslint --no-tailwind --no-src-dir --import-alias "@/*" --use-npm --turbopack --no-react-compiler
cd khabir-next
npm.cmd install next-intl@^4
npm.cmd install -D @playwright/test sharp
npx.cmd playwright install chromium
New-Item -ItemType Directory -Force public\assets
Copy-Item ..\khabir-diagnostic-auto-pro\assets\* public\assets\
```
`.env.local`: `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

`.claude/launch.json` additions:
```json
{ "name": "khabir-next", "runtimeExecutable": "npm.cmd", "runtimeArgs": ["--prefix", "khabir-next", "run", "dev", "--", "-p", "3000"], "port": 3000 },
{ "name": "khabir-next-prod", "runtimeExecutable": "npm.cmd", "runtimeArgs": ["--prefix", "khabir-next", "run", "start", "--", "-p", "3001"], "port": 3001 }
```
