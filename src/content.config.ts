import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Shared SEO fields every entry can override. */
const seo = {
  title: z.string(),
  description: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogType: z.enum(['website', 'article', 'product']).optional(),
};

/**
 * Structured collections whose bodies are section markup: blog posts, work case
 * studies, product detail, solution categories, career roles. Each stores the
 * page's full <main>…</main> HTML plus meta and (where per-page) scoped CSS,
 * rendered via `set:html`. The blog posts in particular use three different
 * markup dialects in the source (post-cover div / <figure> / BEM post__*), so
 * capturing the full main + per-post CSS wholesale is the only byte-faithful
 * option. Products/solutions share identical scoped CSS which lives in their
 * layout, so their per-entry `styles` is empty.
 */
const structured = (base: string) =>
  defineCollection({
    loader: glob({ pattern: '**/*.json', base }),
    schema: z.object({
      ...seo,
      bodyClass: z.string().optional(),
      /** Exact per-page Google Fonts href (matches the original). */
      fontHref: z.string().optional(),
      /** Per-entry scoped CSS injected is:global (empty when the layout owns it). */
      styles: z.string().optional(),
      /** Keep out of search results + sitemap (unfinished pages). */
      noindex: z.boolean().default(false),
      /** The page's full <main>…</main> HTML (+ any sibling markup). */
      html: z.string(),
    }),
  });

/** Blog = structured markup + a few optional SEO-only fields for Article JSON-LD. */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/blog' }),
  schema: z.object({
    ...seo,
    bodyClass: z.string().optional(),
    fontHref: z.string().optional(),
    styles: z.string().optional(),
    html: z.string(),
    /**
     * Position in the blog index grid. The index is hand-ordered (not by
     * date), so this is what previous/next walks — the reader moves through
     * the list they came from.
     */
    order: z.number().int(),
    /** SEO-only (not used for rendering — the markup lives in `html`). */
    heading: z.string().optional(),
    author: z.string().optional(),
    /** ISO date (YYYY-MM-DD). Emitted as Article datePublished + sitemap
     * lastmod, and substituted for the ported "Jun 4" placeholder in the
     * visible meta. Required so a new post can't silently drop its date. */
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    cover: z.string().optional(),
    section: z.string().optional(),
  }),
});

/**
 * A single case-study block. Deliberately one shape rather than a discriminated
 * union: every section in the source pages is some combination of heading +
 * label + prose + media, so one permissive shape keeps the JSON readable and
 * the component tree flat. `layout` selects how `media` is arranged.
 */
const caseSection = z.object({
  /** Section heading (Syne, site scale). Omit for continuation blocks. */
  heading: z.string().optional(),
  /**
   * Brand-coloured sub-heading (source's <SubHeading>). Because a source
   * section can interleave several subheading/prose pairs, each pair becomes
   * its own block with `divider: false` rather than nesting.
   */
  subheading: z.string().optional(),
  /** Small brand-tinted pill above the prose (source's <SectionLabel>). */
  label: z.string().optional(),
  /** Paragraphs; inline HTML (<strong>, <em>, <a>) is allowed and rendered. */
  body: z.array(z.string()).default([]),
  media: z
    .array(
      z.object({
        src: z.string(),
        alt: z.string(),
        caption: z.string().optional(),
        /** Click-to-zoom via the shared lightbox. Default true. */
        zoom: z.boolean().default(true),
        /** Inset the image on a tinted panel (source's --pad figures). */
        pad: z.boolean().default(false),
        /** Multiply white-ground line art into the page instead of boxing it. */
        blend: z.boolean().default(false),
        /**
         * Fixed aspect ratio, e.g. "4/3". The source pins a ratio on figures
         * that sit side by side (`aspect-[5/4]`, `aspect-[4/3]`) so the pair
         * stays equal-height; without it a grid row goes ragged when the two
         * assets have different intrinsic shapes. Crops with object-fit: cover.
         */
        ratio: z
          .string()
          .regex(/^\d+\/\d+$/)
          .optional(),
        /**
         * Cap this figure's rendered width (px), centred in its slot. Opt-in,
         * per image — for assets that read best at a modest size (a tall
         * social poster, a card loop) without shrinking the source file the
         * lightbox zooms into. Absent → the layout's normal sizing.
         */
        maxWidth: z.number().int().positive().optional(),
        /**
         * Video figures only: play as a silent autoplaying loop (a moving
         * image) instead of a framed player with controls.
         */
        loop: z.boolean().default(false),
        /**
         * Full-resolution source the lightbox zooms to, when the displayed
         * file is a presentation variant (rotated, composited). Absent → the
         * displayed file zooms as-is.
         */
        full: z.string().optional(),
      }),
    )
    .default([]),
  /**
   * Bulleted list with brand-coloured markers. The legacy case studies use
   * these throughout ("The Result", "Client Impact"), and flattening them into
   * paragraphs loses the scannability that is the whole point of a list.
   * Items may carry inline HTML.
   */
  list: z.array(z.string()).default([]),
  /**
   * Bordered card grid. The source pages lean on these heavily (7 of 8 use a
   * grid-cols-2/3 of bordered panels — "Emotional Warmth / Clinical Authority /
   * Cultural Familiarity" and similar). Without a primitive they flatten into
   * prose and the designed rhythm is lost. Arranged by the section's `layout`.
   */
  cards: z
    .array(
      z.object({
        /** Optional ordinal or short kicker shown above the title ("01"). */
        num: z.string().optional(),
        /** Line icon drawn above the title ("leaf", "star"…). See CaseIcon. */
        icon: z.string().optional(),
        title: z.string(),
        body: z.string().optional(),
      }),
    )
    .default([]),
  /**
   * Colour palette chips. The source draws these in CSS (not as images), so a
   * literal port loses them entirely — they had been flattened into prose like
   * "Primary — #293C53, Dark Cyan", which reads as a spec rather than showing
   * the colour. Rendered as actual swatches.
   */
  swatches: z
    .array(
      z.object({
        hex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
        name: z.string(),
        /** Optional role/usage line under the name ("Primary"). */
        role: z.string().optional(),
        note: z.string().optional(),
      }),
    )
    .default([]),
  /**
   * Headline figures for growth cases. Rendered oversized and counted up from
   * zero as the band scrolls into view, because on those cases the number IS
   * the story ("0 online bookings" to "1.5 lakh").
   */
  stats: z
    .array(
      z.object({
        /** Numeric target the counter animates to. */
        value: z.number(),
        /** Symbol shown before the digits ("\u20b9"). */
        prefix: z.string().optional(),
        /** Unit shown after the digits ("+", " days", " lakh"). */
        suffix: z.string().optional(),
        /** Decimal places held while counting (1.5). */
        decimals: z.number().int().min(0).max(2).optional(),
        /** "in" for Indian digit grouping (1,50,000). */
        group: z.enum(['in', 'en']).optional(),
        label: z.string(),
        /** Optional second line of context under the label. */
        note: z.string().optional(),
      }),
    )
    .default([]),
  /** Footnote under a stats band (source of the numbers, period covered). */
  statsCaption: z.string().optional(),
  /** Responsive 16:9 embed (YouTube). Only local-futures uses one. */
  embed: z
    .object({ src: z.string().url(), title: z.string() })
    .optional(),
  /**
   * Playable track list (the Sundargaan case — a field-recorded song archive).
   * Rendered as a small audio player with play/pause + progress; missing files
   * fall back to a graceful "recording arriving soon" state, so the section
   * ships before the final recordings land.
   */
  audio: z
    .array(
      z.object({
        title: z.string(),
        artist: z.string().optional(),
        /** Village / block where the recording was made ("Kalitala"). */
        origin: z.string().optional(),
        /** Genre ("Bhatiyali", "Baul"…). */
        genre: z.string().optional(),
        /** Display duration ("4:32") — shown when known. */
        duration: z.string().optional(),
        src: z.string(),
      }),
    )
    .default([]),
  layout: z.enum(['stack', 'split', 'grid-2', 'grid-3', 'row']).default('stack'),
  /**
   * Opt-in, per section: paint this section's background edge to edge in the
   * given colour and flip its type light. Absent → the page wash as usual.
   */
  band: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  /**
   * Opt-in, per section: an image floated huge and soft behind the section's
   * content (partially visible, clipped by the section). Absent → nothing.
   */
  backdrop: z.string().optional(),
  /** 'none' butts this section's figures together with no gap between them. */
  gap: z.enum(['default', 'none']).default('default'),
  /** Photograph shown behind the swatch grid: the source of the palette. */
  swatchBackdrop: z.string().optional(),
  /** Draw the hairline divider above this section. Default true. */
  divider: z.boolean().default(true),
  /**
   * Opt-in, per section: run this section's media edge-to-edge even on a
   * `mediaStyle: 'contained'` case. Absent → the page's mediaStyle applies as usual.
   */
  bleed: z.boolean().default(false),
});

/**
 * Work = case studies. Entries are in one of two states during the portfolio
 * migration: legacy entries carry raw `html` (rendered by StructuredLayout),
 * migrated entries carry `sections` (rendered by CaseLayout). `[slug].astro`
 * branches on which is present, so both can coexist and the build stays green
 * while pages are converted one at a time.
 */
const work = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/work' }),
  schema: z.object({
    ...seo,
    bodyClass: z.string().optional(),
    fontHref: z.string().optional(),
    styles: z.string().optional(),
    /** Legacy path — full <main> markup. Mutually exclusive with `sections`. */
    html: z.string().optional(),

    // ── Modular path ──────────────────────────────────────────────────────
    /** Per-brand accent, drives --brand. Falls back to the site red. */
    brand: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    client: z.string().optional(),
    location: z.string().optional(),
    year: z.string().optional(),
    tags: z.array(z.string()).default([]),
    /**
     * Which solution categories this case study is proof for. Solution pages
     * carry a "Selected work" grid, and until now that association lived only
     * as hand-written links inside each solution's markup — so a case study had
     * no idea which solutions it belonged to, and the two could drift apart.
     * Slugs match src/content/solutions/*.
     */
    solutions: z
      .array(
        z.enum([
          'capacity-building',
          'communication-campaign',
          'data-design-tech',
          'research-survey',
        ]),
      )
      .default([]),
    /**
     * False hides this case study from listing grids (/our-work, solution
     * pages) while leaving its page live — used where the real card artwork is
     * still missing and a placeholder would otherwise ship.
     */
    active: z.boolean().default(true),
    /**
     * How this case presents its stacked media: 'full' bleeds each figure
     * edge to edge (the nest-homes treatment), 'contained' keeps figures
     * inside the 1400px text shell — for cases whose screenshots and diagrams
     * were not shot for a full-viewport stage. Grids and splits sit in the
     * shell either way.
     */
    mediaStyle: z.enum(['full', 'contained']).default('full'),
    hero: z
      .object({
        src: z.string(),
        alt: z.string(),
        /**
         * 'photo' — full-bleed, dark scrim, title overlaid in white.
         * 'logo'  — brand lockup contained on a tinted panel with the title
         *           set below it. Several brands ship a logo rather than a
         *           photograph, and scrimming those turns them muddy grey.
         */
        style: z.enum(['photo', 'logo']).default('photo'),
        /**
         * Overlay colour for 'photo' heroes, applied as a flat tint over the
         * whole image (the site's own hero treatment — e.g. JSSES uses its
         * deep indigo #03003c at 80%). Absent → the default black gradient
         * scrim (dark at the base where the title sits, fading to clear).
         */
        scrim: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
        /** Strength of that tint, 0 to 1. Defaults to 0.8. */
        scrimOpacity: z.number().min(0).max(1).optional(),
        /**
         * Logo-hero surface: 'brand' (default) renders the lockup on the
         * brand-fill panel; 'light' renders it on a clean light panel. A few
         * lockups read muddy against their own fill, and their source sites
         * present them on white — 'light' reproduces that without disturbing
         * the other logo heroes. Ignored for 'photo' style.
         */
        background: z.enum(['brand', 'light']).default('brand'),
        /**
         * Still frame for a video hero (an .mp4/.webm `src`). It paints while
         * the film loads and stays put wherever autoplay is blocked, so the
         * hero is never an empty rectangle.
         */
        poster: z.string().optional(),
      })
      .optional(),
    sections: z.array(caseSection).optional(),
    credits: z
      .array(z.object({ role: z.string(), members: z.string() }))
      .default([]),
    /** The client's own point of contact on the project. */
    coordinator: z
      .object({ name: z.string(), role: z.string().optional() })
      .optional(),

  }),
});

export const collections = {
  blog,
  work,
  products: structured('./src/content/products'),
  solutions: structured('./src/content/solutions'),
  careers: structured('./src/content/careers'),
};
