# Khabir Diagnostic Auto Pro — project guide for Claude Code

Car-diagnostic workshop landing site (FR / AR-RTL / EN) with a scroll-scrubbed hero video and a WhatsApp CTA.

## Start every session by

1. Reading `docs/PROJECT_LOG.md` — what is done, what is next, what is blocked.
2. Using the knowledge graph before grepping: `graphify query "<question>"` (graph is in `graphify-out/`, report in `graphify-out/GRAPH_REPORT.md`).

## Layout

- `khabir-diagnostic-auto-pro/` — finished static site (`index.html`, `assets/`). Reference implementation.
- `khabir-next/` — Next.js 16 App Router rebuild (in progress; not yet built/tested).
- `docs/` — design package, prompts, `nextjs-migration-plan.md`, `claude-code-nextjs-dual-video-prompt.md`.
- `tools/media/encode.sh` — hero video encoding (all-intra CRF 30).
- `10k-websites/` — the skill/reference pack the site was generated with.
- `.claude/skills`, `.claude/agents` — project-local skills (impeccable, emil-design-eng, etc.).

## Rules

- Do not invent the WhatsApp number, address or opening hours — they are placeholders until the owner supplies them.
- Keep graph current: run `graphify update .` after code changes.
- Before finishing a session, append a dated entry to `docs/PROJECT_LOG.md` (done / next / blocked).
- `graphify-out/cache/` and `.graphify_*` files are local-only and git-ignored.
- Remote: https://github.com/hamzaMallem/khabir-diag-pro-10k.git (`main`). Commit/push only when the user asks.
