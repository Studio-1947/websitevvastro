# Studio 1947 website (Astro)

## Portfolio case studies: scope rule

**When working on one portfolio case study, do not affect the others unless
explicitly asked.** Every case study shares one rendering pipeline, so this
takes deliberate care:

- Each case is one JSON file in `src/content/work/<slug>.json`, with its
  images in `public/assets/img/work/<slug>/`. Changes for a single case
  belong in those two places, plus its card in
  `src/generated/our-work/main.html` and thumbnail in
  `public/assets/img/our-work/`.
- `src/styles/work-case.css`, `src/layouts/CaseLayout.astro`, and
  `src/components/work/*` are **shared by all case studies**. Editing them to
  restyle one case restyles every case. Do not touch them for a single
  portfolio's look unless the user explicitly asks for a global change.
- The correct way to give one case its own look is a **per-case knob in its
  JSON**: `brand` (accent colour), `mediaStyle` (`"full"` = edge-to-edge
  imagery like nest-homes; `"contained"` = images stay in the text column at
  intrinsic size), per-section `layout` / `gap`, per-image `pad` / `blend` /
  `ratio` / `zoom`, hero `style` / `scrim` / `background`. If no existing
  knob fits, add a new **opt-in** field to the work schema in
  `src/content.config.ts` (defaulting to current behaviour) rather than
  changing a shared default.
- If a shared file genuinely must change, say so, and spot-check other case
  pages before finishing (nest-homes and walking-project are designed
  full-bleed; the other 16 are `"mediaStyle": "contained"`).

History has shown why this matters: a past restyle of one case
(edge-to-edge media) silently broke the lightbox, reel frames, split
layouts, and image sizing on every other portfolio.

## Verifying changes

- `npm run build` must pass; the site is fully static (output in `dist/`).
- To see a page: `npm run preview`, then screenshot with Playwright (already
  in node_modules, chromium installed).

## Other notes

- Listing pages (`/our-work/`, `/about-us/`) are generated HTML in
  `src/generated/`, imported raw — edit those files directly.
- Team member credits link via `src/lib/team.ts`; add new members there so
  case credits link to their About profile.
- Images ship as webp; convert with sharp (in node_modules).
