# Beginner maintenance guide (khabir-next)

Everything lives in `khabir-next/`. You never need to touch the video engine to change content.

## Two kinds of files
- **Content and settings (safe to edit):** `messages/fr.json`, `ar.json`, `en.json`, `config/site.ts`, `config/hero.ts`, `styles/globals.css`, `app/[locale]/page.tsx`.
- **Engine (leave alone unless needed):** `hooks/useHeroScrub.ts`, `lib/captions.ts`, `components/hero/ScrollHero.tsx`.

## Word list
- **Server component**: runs at build time and produces plain HTML (most files). **Client component** (`"use client"` on line 1): also runs in the browser, used for scrolling, buttons that react.
- **Props**: the values a component receives, like `<Button href="..." >`.
- **Hook**: a function starting with `use`, like `useHeroScrub`.
- **Translation file**: JSON with one text per key, same keys in all three languages.

## Component tree
```
layout.tsx  -> Background, Nav (client), {page}, Footer
page.tsx    -> HeroSection -> ScrollHero (client)
               ProblemSection, MethodSection, DiagnosticDemo (client),
               ServicesSection, PromisesSection, FaqSection, ContactSection, JsonLd
```

## Section -> files
| What you see | Component | Styles | Texts (keys in messages/*.json) |
|---|---|---|---|
| Scrolling video + captions | `components/hero/HeroSection.tsx` | `Hero.module.css` | `b1_*` to `b4_*`, `cue`, `static_sub` |
| "Vous avez déjà payé pour deviner" | `sections/ProblemSection.tsx` | `ProblemSection.module.css` | `pb_*`, `q_1..3` |
| Tester. Prouver. Réparer. | `MethodSection.tsx` | `MethodSection.module.css` | `me_*`, `s1_*..s3_*` |
| Hold-to-scan demo | `DiagnosticDemo.tsx` | `DiagnosticDemo.module.css` | `lab_*`, `r_*`, `hud_title` |
| Services grid | `ServicesSection.tsx` | `ServicesSection.module.css` | `sv_*`, `sv1_*..sv6_*` |
| Promises | `PromisesSection.tsx` | `PromisesSection.module.css` | `pr_*`, `p1_*..p4_*` |
| FAQ | `FaqSection.tsx` | `FaqSection.module.css` | `fq_*`, `fq1_*..fq5_*` |
| Contact | `ContactSection.tsx` | `ContactSection.module.css` | `cta_*`, `i_*` |

## Where do I edit this?
| To change | Edit |
|---|---|
| A heading or any text | the key in all three `messages/*.json` files |
| WhatsApp number | `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local` (digits only, e.g. `2126XXXXXXXX`) |
| Address, opening hours | `streetAddress`, `openingHours` in `config/site.ts` |
| Public site URL | `NEXT_PUBLIC_SITE_URL` in `.env.local` |
| Accent color | `--accent` in `styles/globals.css` |
| Fonts | `app/[locale]/layout.tsx` (loading) and `--display/--body/--mono` in `globals.css` |
| A video | `config/hero.ts` (`src`, `poster`, `endFrame`, `duration`) + files in `public/media/` |
| When a caption appears | `captions` list in `config/hero.ts` (`from`/`to` are scroll progress 0 to 1) |
| How long the scroll is | `scrollDistanceVh` per video in `config/hero.ts` |
| Which part of the frame stays visible | `focalPoint` in `config/hero.ts` |
| Order of sections | the order of lines in `app/[locale]/page.tsx` |

## Examples
**Change a heading in all three languages.** Open the three JSON files, find `"pb_h"`, change the text in each.

**Add a service card.** In `components/sections/ServicesSection.tsx` add an object to the `services` array (copy one: `id`, `title`, `text`, `layout`, `icon`). Add its two texts, for example `sv7_t` and `sv7_p`, to all three JSON files and use `dict.sv7_t` / `dict.sv7_p`.

**Change the accent color.** In `styles/globals.css` change `--accent: #ff6b00;`.

**Replace one video.** Make the file (see `tools/media/encode.sh`: keep a keyframe on every frame so scrubbing is smooth), put it in `public/media/`, then edit that video's block in `config/hero.ts`. Check `duration`, then re-time the captions.

**Add a section.** Create `components/sections/MySection.tsx` (+ `.module.css`) that receives `dict`, add a line `<MySection dict={dict} />` in `app/[locale]/page.tsx`. Nothing in the hero changes.

## Commands (run inside `khabir-next/`)
```
npm install
npm run dev                 # http://localhost:3000, reloads as you edit
npm run build && npm run start -- -p 3001   # production preview
npx tsc --noEmit            # type check
npm run lint
npx playwright test         # full test suite (needs the production build)
```
After a text change: reload and look in all three languages (`/fr`, `/ar`, `/en`). After a video change: scroll the hero slowly up and down on desktop width and phone width. After any change: `npm run build` must succeed.

## Known limits
The current videos are placeholders (watermark, Maserati badge). Real iPhone/Android behavior and Lighthouse scores have not been measured yet.
