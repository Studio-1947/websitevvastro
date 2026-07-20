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
    /** SEO-only (not used for rendering — the markup lives in `html`). */
    heading: z.string().optional(),
    author: z.string().optional(),
    date: z.string().optional(),
    cover: z.string().optional(),
    section: z.string().optional(),
  }),
});

export const collections = {
  blog,
  work: structured('./src/content/work'),
  products: structured('./src/content/products'),
  solutions: structured('./src/content/solutions'),
  careers: structured('./src/content/careers'),
};
