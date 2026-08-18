/**
 * Per-project view counter.
 *
 * Each case study keeps its own tally, keyed by slug, so the number under
 * "Project credits" is that project's traffic rather than the site's. The
 * count lives in the project's own Vercel KV store (Upstash REST), and the
 * request is same-origin, so no visitor data leaves the site's own domain and
 * the existing `connect-src 'self'` policy already allows it.
 *
 * GET  /api/views?slug=nest-homes   read the tally
 * POST /api/views?slug=nest-homes   count this visit, return the new tally
 *
 * With no KV store linked the endpoint answers { configured: false } and the
 * page simply does not show a count, rather than showing a made-up one.
 */
const URL_ENV = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN_ENV = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Slugs come from the URL, so they are treated as untrusted input and have to
// match the shape Astro generates before they are used as a key.
const SLUG = /^[a-z0-9][a-z0-9-]{0,80}$/;

async function kv(path) {
  const res = await fetch(`${URL_ENV}/${path}`, {
    headers: { Authorization: `Bearer ${TOKEN_ENV}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`kv ${res.status}`);
  const body = await res.json();
  return body.result;
}

export default async function handler(req, res) {
  const slug = String(req.query.slug || '');
  if (!SLUG.test(slug)) {
    res.status(400).json({ error: 'bad slug' });
    return;
  }

  res.setHeader('Cache-Control', 'no-store');

  if (!URL_ENV || !TOKEN_ENV) {
    res.status(200).json({ configured: false, count: null });
    return;
  }

  const key = `views:work:${slug}`;
  try {
    const result = req.method === 'POST' ? await kv(`incr/${key}`) : await kv(`get/${key}`);
    const count = Number(result) || 0;
    res.status(200).json({ configured: true, count });
  } catch {
    // A counter is never worth breaking a page over.
    res.status(200).json({ configured: true, count: null });
  }
}
