# Project Log — Khabir Diagnostic Auto Pro

Running record of what has been done and what is next, so a new Claude Code session can resume without re-deriving context. Newest entries last. Read `CLAUDE.md` first.

## Status at a glance

- **Static site** (`khabir-diagnostic-auto-pro/index.html`): done, tested locally and on phone width (375x812), FR/AR(RTL)/EN, scroll-scrub hero, WhatsApp CTA.
- **Next.js rebuild** (`khabir-next/`): Stage 1 scaffolded, **not yet built or tested**. Scrub proof unverified.
- **Knowledge graph** (`graphify-out/`): built 2026-10-11.
- **Blocked on the owner**: real WhatsApp number, exact address, opening hours, real workshop photos (all placeholders today).

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

## Next steps (in order)

1. `cd khabir-next && npm run build` and fix whatever breaks (nothing has been built yet).
2. Verify scroll scrub with the Playwright check (`khabir-next/tests/scrub-check.mjs`) on desktop and mobile contexts.
3. Finish remaining Next.js stages from `docs/nextjs-migration-plan.md` / `docs/claude-code-nextjs-dual-video-prompt.md`.
4. Get from the owner: WhatsApp number, address, opening hours, real workshop photos; replace placeholders.
5. Optional graph cleanups: exclude `.claude/` from graphify (`.graphifyignore`) and rebuild; re-read `index.html` fully; `graphify hook install` for auto-update on commit.

## Conventions

- Query the graph before reading many files: `graphify query "<question>"`, `graphify path "A" "B"`, `graphify explain "X"`.
- After code changes: `graphify update .` (AST only, no LLM).
- Append a dated entry to this file at the end of every work session.
