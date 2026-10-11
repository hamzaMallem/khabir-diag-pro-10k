# Next.js rebuild: plan, decisions and status

App: `khabir-next/` (Next.js 16.4, App Router, strict TypeScript, CSS Modules). The original single-file site in `khabir-diagnostic-auto-pro/` is untouched for comparison. This replaces the older `nextjs-migration-plan.md` on three points: **two videos**, **scrubbing on phones too**, **CSS Modules instead of one global stylesheet**.

## Inspection summary
- Source videos (in `review/`, git-ignored): desktop 1280x720 and mobile 720x1280, both 24 fps, 15.04 s, **HEVC with only 3 keyframes**. HEVC is not web-safe and 3 keyframes make seeking slow.
- Both videos carry a **"Dola AI" watermark** and the mobile one shows a **Maserati badge**. They are **placeholder footage** and must be regenerated before launch.
- Reused from the old site: copy (FR/AR/EN), colors, fonts, section order, press-and-hold demo logic, scrub easing.

## Decisions
| Topic | Decision | Why |
|---|---|---|
| Media | `tools/media/encode.sh`: H.264, every frame a keyframe, no audio, `+faststart`. Desktop 7.1 MB, mobile 6.1 MB | GOP 1/2/4 compared; all-intra is the smoothest to scrub and still within budget (GOP 2 = 10 MB) |
| Video choice | `matchMedia("(max-width:720px), (orientation:portrait)")` selects mobile; `video.src` is set by script | Only one file is ever downloaded (verified) |
| Engine | No animation library. Native scroll, one `requestAnimationFrame` loop, one in-flight seek, loop stops when settled / offscreen / tab hidden | Simplest thing that scrubs smoothly in tests |
| Mobile | Scrubbing stays on for phones (`svh` heights, per-variant scroll distance) | Requirement overrides old "static hero on phones" rule |
| Reduced motion | CSS shows a still hero before scripts run; engine is off and no video is fetched | No flash, no wasted download |
| i18n | Plain dictionaries (`messages/*.json`) + `proxy.ts` redirect (cookie, then browser language, then French). No i18n library | Follows the Next.js 16 docs; fewest moving parts for a beginner |
| Server/Client | Everything is a Server Component except: `ScrollHero`, `Nav`, `Reveal`, `DiagnosticDemo` | Interaction only where needed |
| Hero story | Problem, scan, engine bay, "real fault found" + CTA. **No fake measurements over the footage**; the P20EE fault only appears in the clearly labeled demo simulation | Do not tie unsupported claims to the video |

## Component tree
```
app/[locale]/layout.tsx  (fonts, <html lang dir>, metadata, Nav, Footer, Background)
app/[locale]/page.tsx    (section order)
  HeroSection (server) -> ScrollHero (client) -> useHeroScrub -> lib/captions
  ProblemSection · MethodSection · DiagnosticDemo (client) · ServicesSection
  PromisesSection · FaqSection (native <details>) · ContactSection · JsonLd
```

## Checklist and gates
- [x] 1 Inspect old site, assets, instructions
- [x] 2 Analyze footage (frames at 0/25/50/75/100%), caption bands set in `config/hero.ts`
- [x] 3 This plan
- [x] 4 Prove scrubbing: both videos, forward and backward at 0/25/50/75/100% (`tests/site.spec.ts`)
- [x] 5 Build: tokens, layout, all 8 sections, FR/AR/EN, SEO (metadata, hreflang, sitemap, robots, JSON-LD)
- [x] 6 Verify: build + TypeScript + lint clean; **30 Playwright tests pass** (3 languages x 4 viewports, no overflow, no console errors, one video per screen, source swap on resize, failed video, reduced motion, demo by mouse and keyboard, FAQ, language switch, redirects)
- [ ] 6b Not done: Lighthouse/performance trace numbers; real iPhone/Android test (desktop emulation does not prove mobile Safari seeking); Impeccable/Emil/Taste review passes (skills installed in `.claude/skills` but not run in this session)
- [x] 7 Docs: `khabir-next/README.md`, `docs/beginner-maintenance-guide.md`

## Skills usage record
Installed (project scope): emil-design-eng, animate, review-animations, break-ui, design-taste-frontend, impeccable. **Not yet applied**; design decisions here follow the existing brand package (`docs/design-package.md`). Applying them is the next improvement pass.

## Missing business data
WhatsApp number (`NEXT_PUBLIC_WHATSAPP_NUMBER`), street address and opening hours (`config/site.ts`), real site URL (`NEXT_PUBLIC_SITE_URL`), real workshop footage and photos.
