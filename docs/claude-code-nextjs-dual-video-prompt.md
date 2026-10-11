# Claude Code Prompt: Plan and Rebuild Khabir with Next.js, Two Videos, and Design Skills

Open the project in Claude Code, then copy the text between **BEGIN PROMPT** and **END PROMPT**. Fill in the two video paths if you know them. Select your preferred model from those available in your account; this prompt does not depend on a particular model name or version.

## Set up ECC in Claude Code

If the ECC plugin is not installed, run these commands inside Claude Code:

```text
/plugin marketplace add https://github.com/affaan-m/ECC
/plugin install ecc@ecc
```

If it is already installed, inspect the existing installation:

```text
/plugin list ecc@ecc
```

Use one installation method only. Do not combine the plugin installation with a full manual installation. Check the commands available in your installed version, since aliases may differ. ECC provides workflows for the coding assistant; it is not a runtime dependency of the published website.

Source: [ECC repository documentation](https://github.com/affaan-m/ECC).

## Set up the design and animation skills

Use the current installation instructions in each repository. The following commands are documented entry points; run terminal commands from the project root and select Claude Code with project-level scope where the installer offers that choice:

```text
npx skills@latest add emilkowalski/skills
npx impeccable install
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

Select the relevant web skills from Emil's repository, rather than every platform-specific skill. After installing Impeccable, its documented setup command inside Claude Code is:

```text
/impeccable init
```

Inspect existing installations first and avoid duplicate copies. Installation is separate from using the prompt: a repository URL in a prompt does not automatically install or activate its skills. Confirm the actual installed skill names and read their `SKILL.md` files before applying them. If an installation needs user input or permission, explain the concrete requirement.

References:

- [Emil Kowalski: installation and skill catalog](https://github.com/emilkowalski/skills).
- [Impeccable: installation and command catalog](https://github.com/pbakaus/impeccable).
- [Taste Skill: installation and skill catalog](https://github.com/Leonxlnx/taste-skill).

---

## BEGIN PROMPT

Act as an experienced Next.js engineer and design engineer. Rebuild the **Khabir Diagnostic Auto Pro** website using **Next.js and TypeScript**. First inspect the files, analyze the requirements, and write a concrete plan; then implement, test, and document the project in stages. Do not stop at a plan or prototype. Communicate in English and use clear English identifiers in the code.

I am a beginner in frontend development and Next.js. Optimize the code organization and documentation so I can understand the project and change it later. Prefer explicit, readable code and conventional patterns. Explain important architectural decisions briefly, and keep routine implementation moving.

### 1. Project context and objective

Working directory:

```text
D:\dev\model_business\10k-website-car
```

The current website promotes a specialist electronic diagnostics workshop for German cars in Beni Mellal, Morocco. Preserve its dark visual identity and orange accent, along with its business purpose: explain the service and encourage visitors to contact the workshop through WhatsApp.

First, read the applicable project instructions and these files:

- `khabir-diagnostic-auto-pro/index.html`: the reference for existing content, interactions, and translations.
- `docs/design-package.md`: the brand and design reference.
- `docs/nextjs-migration-plan.md`: an earlier plan to reuse and update according to this request.
- `tools/baseline/capture.mjs`: existing tooling for capturing visual and behavioral baselines.

Create the application inside `khabir-next/`. If that directory already exists, inspect it and continue without overwriting user changes. Preserve the original website for comparison. Build maintainable React components; do not wrap the entire old HTML file in a single component or inject it through `dangerouslySetInnerHTML`.

### 2. Use ECC and the three design skill repositories

Inspect the available ECC skills and use those appropriate to this task: planning, architecture, frontend and Next.js patterns, TypeScript standards, browser testing, and code review. Consult the installed version's documentation instead of guessing command names.

Read the installed skills from these repositories as well:

| Source | Role in this project |
| --- | --- |
| https://github.com/affaan-m/ECC | Implementation planning, architecture, code quality, verification, and final code review. |
| https://github.com/emilkowalski/skills | Motion design and interaction quality. Prioritize relevant skills such as `emil-design-eng`, `animate`, `review-animations`, and `mobile-native`, if present in the installed version. |
| https://github.com/pbakaus/impeccable | Product context, UX/UI planning, responsive layout, accessibility, internationalization edge cases, performance auditing, and final visual polish. |
| https://github.com/Leonxlnx/taste-skill | Visual direction, typography, spacing, composition, and avoiding generic template output. Use the installed `design-taste-frontend` skill; inspect its version and recommendations. |

Assign each source a specific role. Apply the relevant guidance at the appropriate stage rather than loading every skill or forcing every aesthetic recommendation into the site. These skills are development guidance, not packages to ship to visitors.

My requirements, existing brand identity, accessibility, mobile scrubbing, maintainability, and measured performance take priority over a skill's defaults. If skills recommend conflicting libraries, animation styles, or layouts, choose one coherent approach and document the decision. A skill's library preference alone is not a reason to install it. Preserve the dark and orange workshop identity.

Inspect the current Impeccable command names. Where available, use `init` for product context, `shape` for UI planning, and targeted `audit`, `harden`, `adapt`, `optimize`, and `polish` passes for relevant concerns. Reuse business information already established in the project instead of asking me to repeat it. Preserve and update existing product or design documentation instead of replacing it blindly.

If any requested skill is unavailable, state which one and explain the necessary setup step; continue independent inspection while it is resolved. Do not invent commands or claim to have used tools or skills you did not actually run. At delivery, record which skills you used and the concrete improvements they informed.

### 2A. Mandatory workflow: read, analyze, plan, then build

Complete these stages in order. Publish the plan before modifying application code, then proceed with implementation under this request. Only pause for genuinely missing information that blocks the next dependent step or a permission requirement; do not ask for approval after every routine stage.

**Stage 1: inspect the existing project.** Read applicable `AGENTS.md` and `CLAUDE.md` instructions, the reference files above, and any existing Next.js app and configuration. Inspect the actual project state, dependencies, asset paths, translations, and interactions. Summarize what exists, what can be reused, and which previous assumptions must change. Treat the old plan as a reference, not proof of the current state.

**Stage 2: analyze assets and design.** Inspect both videos and their scene timings. Establish the visitor journey, section order, caption placement, desktop/mobile layouts, fallback behavior, and Arabic typography. Use the design skills to refine these decisions. Record missing facts explicitly.

**Stage 3: write the implementation plan.** Create `docs/nextjs-rebuild-plan.md` with an ordered checklist. For each phase, list its objective, files or components involved, dependencies, and a concrete verification gate. Include a proposed component tree, Server/Client boundaries, video loading and seeking strategy, i18n approach, design tokens, and testing plan. Explain the architecture in plain language and state why it will be easy for a beginner to modify. Analyze tradeoffs and publish decisions without exposing private chain-of-thought.

**Stage 4: prove the riskiest behavior.** Scaffold the app and validate both real videos with a minimal scroll-scrubbing component, including mobile source selection, reverse seeking, reduced motion, and failure handling. Fix problems here before layering the full design onto the video engine. If the assets are missing, scaffold independent parts but leave this gate explicitly incomplete.

**Stage 5: build incrementally.** Establish tokens and layouts, then build each section in its proper file, followed by translations, contact configuration, interactions, and SEO. Run the verification gate for each phase before marking it complete. Keep the plan checklist current and give brief progress updates after meaningful milestones.

**Stage 6: review and refine.** Run functional checks and production verification. Inspect actual rendered pages and screenshots in the three languages. Apply animation review, Impeccable audits and polish, Taste design guidance, and ECC code review to the relevant parts. Fix actionable findings and rerun affected checks.

**Stage 7: document and hand over.** Provide the beginner maintenance guide, final component map, local preview instructions, and evidence of verification. Do not call untested or incomplete parts finished.

### 3. Build the experience around two videos

Required assets:

- **Desktop:** the video named `Audi S8 Engineering Film desktop`. Inspect its actual dimensions and aspect ratio.
- **Mobile:** the video named `Audi S8 Engineering Film mobile`, with a target aspect ratio of **9:16**.
- **Desktop video path:** [INSERT PATH IF KNOWN].
- **Mobile video path:** [INSERT PATH IF KNOWN].

Look inside the project or the asset directory I provide. A screenshot showing the filenames is not a substitute for the video files. Do not assume the existing `assets/hero-scrub.mp4` is one of these assets. If either video is missing, ask for its path and continue only with work that does not depend on it. Do not declare the video experience complete using placeholder assets.

Inspect each video's duration, dimensions, frame rate, codec, file size, and keyframe distribution. Examine actual frames from the beginning, middle, end, and important scenes. Design text placement and timing around the footage. Do not assume both videos have the same duration or matching scene timings.

Keep the source files unchanged. Create optimized web derivatives and poster images where needed, and document the conversion commands and settings. Balance keyframe density against file size and image quality; do not produce an excessively large encode just to simplify seeking.

### 4. Required scrolling behavior

- Use the desktop video on wide screens and the mobile video on small screens, with layouts and scene timings appropriate to each.
- **Scroll-controlled video must work on mobile too.** Override the old migration plan's assumption that every phone or touch device automatically receives a static hero.
- Map scroll progress within a defined section to video time, both forward and backward. Implement actual video scrubbing, not merely autoplay when the video enters the viewport.
- Use a pinned scene through `position: sticky` or an equivalent solution, with separately configurable scroll distances for desktop and mobile. Preserve native page scrolling; do not hijack wheel or touch input.
- Load only the appropriate video on initial page load. Do not download both videos and hide one with CSS. On resize or orientation changes, switch sources only when the selected variant actually changes. Preserve normalized progress and cancel obsolete work.
- Keep caption timings and focal points separate for each video. Avoid cropping the car or obscuring important details with text. Account for Arabic RTL, safe areas, and mobile browser chrome.
- Use a bounded animation loop and ref-based updates. Do not update React state on every frame. Coordinate seek requests so they do not accumulate, and handle unavailable metadata, invalid durations, and start/end boundaries.
- Stop unnecessary work when the animation settles, the scene leaves the viewport, or the tab becomes hidden. Clean up listeners, observers, timers, fetches, and object URLs on unmount or source changes. Ensure correct behavior under React Strict Mode.
- Provide a poster, a clear loading state, and recovery for network or decoding failures. Under `prefers-reduced-motion`, provide a useful static alternative while keeping content and contact actions accessible.
- Test `muted`, `playsInline`, and seeking behavior on mobile browsers. Avoid requiring a user tap or continuous playback unless testing demonstrates that it is necessary.

First prove that both videos scrub correctly in a small component within the app, before connecting the rest of the sections to the animation. Choose the simplest animation engine that performs smoothly in tests. If you use GSAP/ScrollTrigger or another library, explain why it is needed and confine it to the client interaction boundary. Do not add overlapping animation libraries. Do not convert the videos into thousands of images unless measurements justify that approach.

### 5. Next.js architecture

Use a compatible stable version of **Next.js with App Router and strict TypeScript**, and lock dependencies in the package lockfile. Check documentation for the installed versions before using version-sensitive APIs.

Use **Server Components by default** for static content, with small **Client Component boundaries** for interaction and animation. Do not mark the entire page or layout with `use client` without justification. The page should compose sections rather than contain animation logic or translation dictionaries.

Suggested structure; improve it where useful while preserving separation of responsibilities:

```text
khabir-next/
  app/[locale]/layout.tsx
  app/[locale]/page.tsx
  components/layout/       # Header, Footer, LanguageSwitcher
  components/hero/         # HeroSection, ScrollVideo, HeroCaptions, VideoFallback
  components/sections/     # Problem, Method, DiagnosticDemo, Services, Promises, FAQ, Contact
  components/ui/           # Button, Container, SectionHeading
  hooks/                   # Video scrubbing and preference logic where needed
  config/site.ts           # Business and contact details
  config/hero.ts           # Sources, scene timings, focal points, scroll distances
  lib/                     # Focused, testable utility functions
  i18n/
  messages/                # fr.json, ar.json, en.json
  styles/                  # Design tokens and global styles
  public/media/            # Optimized assets
  tests/
```

Place each major section in its own file, with typed props and a clear responsibility. Avoid excessive fragmentation into tiny files that add no useful abstraction. Make `ScrollVideo` reusable through typed configuration, without embedding business details in its implementation.

For beginner-friendly maintenance:

- Keep each section's styles alongside its component, using predictable filenames such as `ServicesSection.tsx` and `ServicesSection.module.css`.
- Keep section data in a clear `content/` directory or the translation files as appropriate. Avoid duplicating the same content in multiple places. Repeated service cards should come from typed data with stable IDs.
- Keep `page.tsx` short and readable, showing the section order directly. Changing the order should not require editing the video engine.
- Keep complex seeking and lifecycle logic in a focused hook or module. Avoid mixing it into the navigation, contact section, or translation switcher.
- Use one clear source of truth for business details, design tokens, and each video's configuration. Include short comments where timing values or browser workarounds need explanation.
- Avoid unnecessary state managers, backend services, generic component factories, and layers of indirection. Use descriptive exports and predictable imports.
- Explain Server Components, Client Components, props, hooks, and translation files in the maintenance guide using examples from the actual implementation.

Use **CSS Modules** for component styles and shared design tokens for colors, typography, and spacing. Keep necessary global styles only after reviewing their scope, and isolate legacy behavior that depends on broad selectors. Do not add Tailwind simply because it is a scaffold default.

### 6. Content and languages

- Preserve **French as the default language, Arabic with RTL, and English**, using `/fr`, `/ar`, and `/en` routes and an appropriate internationalization solution such as next-intl.
- Separate copy from components. Make language switching keyboard-accessible and persist the visitor's preference without hydration errors or an initial flash of the wrong direction.
- Preserve Arabic letter joining. Do not apply Latin-style character splitting to Arabic text animations.
- Preserve services, commitments, FAQs, and contact information. The interactive diagnostic demonstration is an illustrative simulation, not an actual connection to a vehicle.
- Do not associate the Audi footage with unsupported diagnostic claims or fabricated measurements. Adapt the hero's narrative to the two videos while preserving the brand's meaning.
- Centralize the WhatsApp number, address, and opening hours. Do not invent missing business details or make a generic WhatsApp link appear to book directly with the workshop when its number is not configured.
- Add per-locale metadata, canonical URLs, hreflang, sitemap, robots, and structured data based only on verified business facts. Document the site URL environment variable required for deployment.

### 7. Verification and acceptance criteria

Run and verify the production build, TypeScript checks, lint, and meaningful functional tests. Adapt the existing Playwright tooling or add appropriate tests. Do not carry over its assumption that mobile always displays a static hero.

Verify at least:

1. Desktop, mobile, and tablet layouts; portrait and landscape orientations; and all three languages, with no horizontal overflow.
2. Only the correct video source downloading initially, with forward and backward scrubbing at 0%, 25%, 50%, 75%, and 100%.
3. Different video durations, resizing, language changes, navigation, and remounting, without accumulated listeners or unnecessary duplicate downloads.
4. Slow networks, video failures, and reduced motion, while content and calls to action remain accessible.
5. No console or hydration errors, with working keyboard navigation, focus states, FAQs, and contact links.
6. Measured performance and media sizes, plus visual inspection of animation smoothness. Do not claim 60 fps or a particular Lighthouse score without measuring it.

Desktop browser tests with mobile emulation do not, by themselves, prove video behavior on physical iPhones or Android devices. Clearly report what you actually tested and what still requires a real device.

Save screenshots and verification results, and fix issues uncovered by testing. Review the code using the appropriate ECC capabilities before delivery. Creating the components alone does not complete the task.

### 8. Delivery and maintenance documentation

Add a README explaining:

- Installation, development, build, and test commands.
- Where to edit copy, translations, colors, fonts, and WhatsApp details.
- How to replace either video and adjust its focal point, caption timings, and scroll distance independently.
- How to add a section without changing the video engine.
- Why the animation engine was selected and how the media was optimized.
- Missing business data, deployment environment variables, and limitations established through testing.

Update the migration plan to reflect the final implementation. In your final report, state what you completed, the exact checks you ran and their actual results, and anything unfinished with its reason. Start a local preview if the environment supports it. Public deployment is outside the scope of this request.

Also create `docs/beginner-maintenance-guide.md`. Write it for someone new to Next.js and include:

1. A labeled component tree and a table mapping each visible section to its component, styles, and content files.
2. A "Where do I edit this?" table for headings, service cards, WhatsApp details, colors, fonts, videos, scene timing, scroll distance, language strings, and section order.
3. Small examples based on the final code: change a heading in all three languages, add a service card, change the accent color, replace one video, and add a section.
4. The exact commands for local development and checks, plus what to look for after making each kind of change.
5. A simple explanation of which files manage content versus the more advanced animation internals.

Use real final filenames and configuration keys in these examples, not hypothetical snippets that do not match the delivered app. Add a short skills usage record to the plan or handover notes, identifying which requested skills were used during each phase. Finish by listing the completed phases, remaining gaps, and how I can start the website locally.

## END PROMPT

---

Reference for Server and Client Component boundaries: [Next.js documentation](https://nextjs.org/docs/app/getting-started/server-and-client-components).
