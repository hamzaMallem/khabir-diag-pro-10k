# Khabir Diagnostic Auto Pro (Next.js)

Website for a specialist electronic-diagnostics workshop for German cars in Beni Mellal. Next.js 16 (App Router), TypeScript, CSS Modules. Three languages (`/fr` default, `/ar` right-to-left, `/en`) and a hero video that plays as you scroll (separate 16:9 desktop and 9:16 mobile videos).

New to Next.js? Start with [`../docs/beginner-maintenance-guide.md`](../docs/beginner-maintenance-guide.md). Plan and decisions: [`../docs/nextjs-rebuild-plan.md`](../docs/nextjs-rebuild-plan.md).

## Run it
```bash
npm install
npm run dev          # development: http://localhost:3000
npm run build && npm run start -- -p 3001   # production preview
npx playwright install chromium             # once, for the tests
npx playwright test                         # needs the production build
```

## Configure (see `.env.example`)
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | digits only, e.g. `2126XXXXXXXX`. While empty, contact buttons scroll to the contact section and show "to be added" |
| `NEXT_PUBLIC_SITE_URL` | public URL, used for canonical links, hreflang, sitemap |

Address and opening hours: `config/site.ts`.

## Live site and deployment
- Live: **https://khabirdiag.com** (`www.khabirdiag.com` redirects to it with a 308). Fallback URL: `khabir-diag-pro-10k.vercel.app`.
- Hosting: Vercel (Hobby plan), project `khabir-diag-pro-10k`. Every push to `main` deploys to production; other branches get preview deployments.
- Domain: registered at Cloudflare. DNS records point to Vercel and are set to **DNS only** (grey cloud), because Vercel must see the domain directly to issue the HTTPS certificate.
- Set `NEXT_PUBLIC_SITE_URL=https://khabirdiag.com` in Vercel (Settings, Environment Variables) so canonical links, hreflang and the sitemap use the real domain.

## Where to edit
Texts `messages/*.json` · colors `styles/globals.css` · videos, caption timing, scroll length `config/hero.ts` · section order `app/[locale]/page.tsx`. Full table in the maintenance guide.

## Replace a video
Encode with `../tools/media/encode.sh` (H.264, a keyframe on every frame, no audio). Put the files in `public/media/`, update that video's entry in `config/hero.ts`, re-time its captions. The two videos are configured independently.

## Why this animation approach
Native scrolling plus one `requestAnimationFrame` loop that seeks the video; no animation library. It stops when the hero is offscreen, the tab is hidden or the motion has settled. Only the video that matches the screen is downloaded. All-intra encoding is what makes backward and forward seeking smooth (the originals had 3 keyframes in 15 s). Sizes: desktop 7.1 MB, mobile 6.1 MB.

## Tested
`npx playwright test` (30 tests): redirects and cookie, RTL, metadata, translation key parity, scrub accuracy at 0/25/50/75/100% in both directions on both videos, one video per screen, source swap on resize, failed video fallback, reduced motion, loop idles, no overflow or console errors in 3 languages x 4 viewports, demo (mouse and keyboard), FAQ, skip link.

## Known limits
- **The current videos are placeholders:** "Dola AI" watermark, and the mobile clip shows a Maserati badge. Replace before launch.
- Not measured: Lighthouse scores, real iPhone/Android seeking (desktop emulation is not proof).
- Business data: the real site URL is now https://khabirdiag.com. Contact details and workshop photos were added later; see `../docs/PROJECT_LOG.md` for what is still missing.
