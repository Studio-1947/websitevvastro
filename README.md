# Studio 1947 — Astro site

Modular Astro migration of the Studio 1947 portfolio site (pixel/behaviour-perfect
clone of the original static site at the repo root). See
[`../MIGRATION_AUDIT.md`](../MIGRATION_AUDIT.md) and
[`../MIGRATION_REPORT.md`](../MIGRATION_REPORT.md) for the full migration record.

## Stack
Astro 5 · TypeScript (strict) · Tailwind CSS 3 (tokens only; the design system is
ported CSS) · GSAP 3.12.5 + ScrollTrigger · Lenis · Astro Content Collections ·
`@astrojs/sitemap` · Playwright (visual diff harness).

## Commands
```bash
npm install
npm run dev        # dev server (http://localhost:4321)
npm run build      # static build → dist/
npm run preview    # serve the build
```

## Project layout
```
src/
  components/
    layout/   Header · Footer · BaseHead
    sections/ HomeHero · StatsSection · Commitment · Approach · Testimonials · Faq
    ContactModal.astro
  content/
    blog/ work/ products/ solutions/ careers/   # collection entries (JSON)
    ../content.config.ts                          # schemas
  layouts/    BaseLayout · StructuredLayout
  pages/      index + [slug] routes + standalone pages
  scripts/    one TS module per interaction (main.ts orchestrates)
  styles/     global.css (Tailwind layers + ported design system)
  lib/        seo.ts (meta + JSON-LD)
public/assets/   images/fonts/video — byte-identical to the original site
```

---

## How to add a **blog post**

Add `src/content/blog/<slug>.json`. It becomes live at `/blog/<slug>/`.

```jsonc
{
  "title": "My Post Title | Studio 1947",   // used for <title>
  "description": "One-sentence summary for search + social.",
  "ogType": "article",
  "heading": "My Post Title",                // article <h1>
  "author": "Author Name",
  "section": "Category",                     // used in Article JSON-LD
  "cover": "/assets/img/blog/my-slug/cover.webp",
  "bodyClass": "page-post",
  "styles": ".page-post .post-body p { line-height: 1.85; } /* optional per-post CSS */",
  "html": "<main class=\"page-post\">…full article markup…</main>"
}
```

`html` is the page's full `<main>` (rendered verbatim via `set:html`), so any markup
works. `styles` is injected `is:global` in `<head>`. The header, footer, contact modal
and Article JSON-LD are added automatically by the layout.

> Prefer authoring in Markdown? Point the `blog` collection's loader at `*.md` and give
> `BlogPostLayout` a `<Content/>` slot — the migration used JSON because the imported
> posts came in three inconsistent HTML dialects and full-`<main>` capture guaranteed
> byte-fidelity. New posts can standardise on whichever you prefer.

## How to add a **work / product / solution / career** entry

Same pattern — drop a `<slug>.json` in the matching `src/content/<collection>/` folder:

```jsonc
{
  "title": "Project Name — Studio 1947",
  "description": "…",
  "bodyClass": "page-case",          // page-case | pdp | page-products | page-solcat | page-career
  "styles": "…per-entry scoped CSS…", // omit for products/solutions (shared CSS lives in the layout)
  "html": "<main>…section markup…</main>"
}
```

- **work** → renders Service JSON-LD.
- **products** → renders Product JSON-LD; the 5 ERP pages share `styles/product.css` (kept empty per entry). The ERP pages also need `"fontHref"` set to their exact Google Fonts URL (Google Sans weight 400 only) — copy it from a sibling entry.
- **solutions** → renders Service JSON-LD; shares `styles/solution-category.css`.
- **careers** → per-entry `styles`.

The route files (`src/pages/<collection>/[slug].astro`) pick up new entries automatically —
no code changes needed.

## How to add a **standalone page**

Create `src/pages/<path>/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---
<BaseLayout title="…" description="…" bodyClass="page-x">
  <style slot="head" is:global>{/* page-scoped CSS */}</style>
  <main class="page-x"> … </main>
</BaseLayout>
```

---

## Animation pattern (how to add an animated section)

Interactivity lives in `src/scripts/*` as **null-guarded** modules and is wired once in
`src/scripts/main.ts` (loaded globally, bundled, deferred). Content is **visible by
default**; scripts only *add* reveal classes — a stalled script never hides content.

To add a new animated section:

1. **Markup** — add the hook classes/attributes to your section:
   - `class="reveal"` — fade-up on scroll (CSS handles the transition; JS adds `.is-in`).
   - `data-stagger` on a container — its children fade up in sequence (130 ms step).
   - `[data-count="65"]` (+ optional `data-suffix`, `data-pad`) — count-up number.
2. **New behaviour** — write `src/scripts/myThing.ts` exporting an init function that
   **returns early if its markup is absent** (so it's safe on every page):
   ```ts
   export function myThing() {
     const root = document.querySelector('[data-my-thing]');
     if (!root) return;
     // …
   }
   ```
3. **Register** it in `src/scripts/main.ts` (import + call inside `init()`).
4. **GSAP/ScrollTrigger** — import from `./animations` patterns; `ScrollTrigger` is
   registered lazily and synced to Lenis via `smoothScroll.ts`. Respect
   `prefers-reduced-motion` (snap to the end state), as the existing modules do.

Rule of thumb: **CSS for entrance/hover, JS only for real interactivity** (nav, modals,
carousels, canvas, live data). Keep it in the single global bundle unless a section is
heavy enough to warrant a `client:visible` island.

---

## Visual-parity harness (regression testing)

```bash
# serve both sites, then:
python -m http.server 8000            # (repo root) original static site
python -m http.server 8001            # (astro-site/dist) the build
node tests/diff.mjs desktop           # or tablet | mobile  → diff-out/<vp>/{orig,astro,diff}
node tests/lh.mjs                     # Lighthouse on key templates
```
`diff.mjs` neutralizes animation and pixel-diffs every route old-vs-new; keep diffs at
sub-pixel noise only.
