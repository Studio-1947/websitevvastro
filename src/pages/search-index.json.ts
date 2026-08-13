import type { APIRoute } from 'astro';
import { buildSearchIndex } from '../lib/search';

/**
 * The site's search index, generated once at build time. Static output
 * pre-renders this endpoint to /search-index.json, which the nav search
 * overlay fetches lazily on first open and caches for the session.
 */
export const GET: APIRoute = async () => {
  const index = await buildSearchIndex();
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
