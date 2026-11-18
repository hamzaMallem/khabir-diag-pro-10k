# Prompt for Claude (cloud) — khabirdiag.com launch work

Copy everything below the line into Claude on the web, with this repo (`hamzaMallem/khabir-diag-pro-10k`) selected.

---

You are working on the website of **Khabir Diagnostic Auto Pro**, a specialist electronic-diagnostics workshop for German and French cars in Beni Mellal, Morocco. The site is in `khabir-next/` (Next.js 16 App Router, TypeScript, CSS Modules, three languages: `/fr` default, `/ar` right-to-left, `/en`).

Reply to me in **Arabic**. Write code, commit messages, PR titles and docs in **English**.

## 0. Read first, in this order

1. `CLAUDE.md` (project rules) and `docs/PROJECT_LOG.md` (what is done, what is next).
2. `khabir-next/AGENTS.md`: this Next.js version has breaking changes. Read the relevant guide in `khabir-next/node_modules/next/dist/docs/` before writing Next.js code. Run `npm install` in `khabir-next/` first.
3. `khabir-next/README.md`, `config/site.ts`, `config/social.ts`, `components/sections/JsonLd.tsx`, `app/sitemap.ts`, `app/robots.ts`, `lib/pageMetadata.ts`.
4. If `graphify-out/GRAPH_REPORT.md` exists, query the graph before grepping many files.

## 1. Current state (facts, do not re-derive)

- **Live site:** https://khabirdiag.com. `www.khabirdiag.com` redirects to it (308). Old URL `khabir-diag-pro-10k.vercel.app` still works.
- **Hosting:** Vercel, Hobby plan, project `khabir-diag-pro-10k`. Pushes to `main` deploy to production; other branches get preview deployments. DNS is at Cloudflare (DNS only, grey cloud). You cannot change Vercel or Cloudflare settings; do not try.
- **Branches:** `main` is production. Draft PR #1 (`feat/social-profile-links`) adds a localized footer with seven owner-approved social profile links and AutoRepair JSON-LD `sameAs` for the six workshop profiles. It is **not merged**. The same branch carries a docs commit for the domain.
- **The repo is public.** Never commit secrets, personal data, or internal business plans.
- `NEXT_PUBLIC_SITE_URL` should be `https://khabirdiag.com` in Vercel. I will set it myself; make the code correct for both cases (variable set, variable missing).
- Local Turbopack MDX workers failed to start earlier while the webpack production build worked; check `docs/PROJECT_LOG.md` and `package.json` for the build command that works, and use that for verification.

## 2. Hard rules

- **Never invent** phone numbers, addresses, opening hours, prices, offers, statistics, reviews, certifications or customer names. Read business data only from `config/site.ts` and `messages/*.json`. If something is missing, leave a clearly marked TODO and list it in your final report.
- **Never push to `main` and never merge a PR.** Work on feature branches and open **draft PRs**. One topic per PR.
- No force-push. No history rewriting. Do not delete my files; list cleanup candidates in a doc instead.
- Ask me before adding any new dependency or analytics script.
- Do not commit the unused images in `khabir-next/public/` (`17765997941731.png`, `4a123fc2-...png`, `bgWebsite.png`, `cvsimo-photo.jpeg`, `iStock-*.jpg`, `service.png`, `service-4.png`, the WhatsApp image) or regenerated `graphify-out/` output.
- Arabic copy is **Moroccan Darija in Arabic letters**, written naturally. Keep the existing tone of `messages/ar.json`. Photos used on the site must be real workshop photos.
- Keep accessibility: keyboard focus, 44px touch targets, visible link names, `lang`/`dir` correct per locale.
- After code changes run `graphify update .` if graphify is available, and append a dated entry to `docs/PROJECT_LOG.md` (done / next / blocked) in every PR.

## 3. Work to do (in this order, one PR each)

### PR A — Make PR #1 mergeable
- Check out `feat/social-profile-links`, run lint, `tsc`, the production build and the Playwright tests (`npx playwright install chromium` once). Fix failures that this branch caused. Report anything pre-existing separately.
- Do not merge. Summarize in Arabic what the PR changes and whether it is safe for me to merge.

### PR B — Canonical domain everywhere
- Search the whole repo (code, docs, MDX, JSON-LD, tests) for `vercel.app` and old URLs. Replace hard-coded production URLs with the value derived from `config/site.ts`. Keep `localhost` and preview behavior working.
- Verify canonical links, `hreflang` alternates, Open Graph/Twitter URLs, `sitemap.xml` and the `Sitemap:` line in `robots.txt` all use `https://khabirdiag.com` when `NEXT_PUBLIC_SITE_URL` is set.
- Add a Playwright test that checks these with the variable set.

### PR C — Search and AI visibility
- Add `llms.txt` (served at `/llms.txt`): short factual summary of the workshop, services, location, languages, contact route (WhatsApp) and key page URLs. Data comes from config only.
- JSON-LD improvements in `components/sections/JsonLd.tsx` and page components: keep the existing `AutoRepair` block (url = site URL, `sameAs` = workshop profiles only, address/phone/hours from config, `geo` and `hasMap` if the map URL exists in config); add `FAQPage` on the services page and on articles that have a FAQ; add `Article` + `BreadcrumbList` for blog posts.
- Confirm `robots.ts` allows search and AI crawlers (GPTBot, Google-Extended, PerplexityBot, ClaudeBot) and points to the sitemap.
- Validate the structured data in tests (parse the `<script type="application/ld+json">` output and assert required fields).

### PR D — Local SEO and Google Maps support in the site
- In `LocationSection` and the footer, make sure the Google Maps link, directions link and a "leave a review" link are supported through `config/site.ts` (add the review link field as optional; hide the button if empty). Do not invent the review URL.
- Make sure name, address and phone (NAP) are rendered identically on the page, in JSON-LD and in the metadata.
- Add a short note in `README.md` explaining how to set the review link.

### PR E — Content (Darija articles)
- Read the two existing posts in `content/blog/ar/` and copy their frontmatter and structure exactly.
- Write **3 new articles** (900–1300 words each), each answering a real search question: (1) check engine light on, what to do; (2) DSG / 7G-Tronic gearbox faults and warning signs; (3) NOx sensor: test before replacing the catalytic converter. First paragraph = direct answer; include an FAQ block (4 questions), one internal link to two other pages, and a WhatsApp call to action using the existing component. No prices, no statistics, no promises of results.
- Add a short SEO title (about 60 characters), meta description (about 155 characters) and an English slug for each.
- Make sure the sitemap and blog index pick them up and the build still passes.

### PR F — Launch documents (no secrets)
Create these files in `docs/`:
- `launch-checklist.md`: the owner's manual tasks, each with exact steps and the exact values to paste (name, address, phone, hours, website URL, categories) pulled from `config/site.ts`. Sections: Google Business Profile (claim, verify, categories "Auto repair shop" / "Car diagnostic", services list, 20 real photos, weekly posts, reply to every review within 24 hours, review QR sign, target +10 reviews per month, never buy reviews); Google Search Console (add `https://khabirdiag.com`, submit `/sitemap.xml`); Bing Webmaster Tools and Bing Places; Apple Business Connect; Waze; Facebook page (type "Auto Repair Shop", WhatsApp button), Instagram Business, YouTube, TikTok, Pinterest, Reddit, LinkedIn.
- `link-cheatsheet.md`: the exact link to put in each social profile bio, with UTM parameters, e.g. `https://khabirdiag.com/?utm_source=facebook&utm_medium=social` (and the same for instagram, youtube, tiktok, pinterest, reddit, linkedin, google maps with `utm_medium=maps`).
- `content-calendar.md`: a 4-week plan (one main piece of content per day, one shoot reused for Reel, Short, TikTok, Facebook post, Pin and Google Post), pillars with percentages (real case 30%, tip 25%, Q&A 15%, behind the scenes 15%, customer review 10%, offer 5%), and 30 post ideas in Darija. Faces of staff and customer plates are never shown without consent. No invented offers or prices.
- `cleanup-candidates.md`: list unused files in `khabir-next/public/` (grep for references first), large tracked files, and `graphify-out/` noise, with the size of each and a recommendation. Do not delete anything.

## 4. Verification before every PR

1. `npm run lint`, TypeScript check, production build (the command that works), `npx playwright test`.
2. For visible changes, check FR, AR (RTL) and EN at mobile (375px) and desktop widths and report what you saw.
3. Check JSON-LD output is valid JSON and has no empty fields.

## 5. Final report (in Arabic)

For each PR: link, what changed, what you verified, what failed or was skipped, and what I must do by hand. At the end give one list of **owner actions that only I can do** (set `NEXT_PUBLIC_SITE_URL` in Vercel, make the repo Private, claim Google Business Profile, submit the sitemap, merge PRs in order A to F), and one list of **missing business data** you found.
