/**
 * Per-project view count in the case-study colophon.
 *
 * Every project carries its own tally, so the figure under "Project credits"
 * is that project's traffic. The visit is counted once per browser session
 * (a reload or a second look does not inflate it), and the number only ever
 * appears once the API has returned a real one: no placeholder, no guess.
 */
const DUR = 1200;

function countTo(el: HTMLElement, target: number): void {
  const fmt = (n: number) => Math.round(n).toLocaleString('en-IN');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = fmt(target);
    return;
  }
  let start: number | null = null;
  const step = (ts: number): void => {
    if (start === null) start = ts;
    const p = Math.min((ts - start) / DUR, 1);
    el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export async function projectViews(): Promise<void> {
  const line = document.querySelector<HTMLElement>('[data-views]');
  if (!line) return;
  const slug = line.dataset.views;
  if (!slug) return;

  const seen = `viewed:${slug}`;
  let counted = false;
  try {
    counted = sessionStorage.getItem(seen) === '1';
  } catch {
    // Private mode with storage disabled: count the visit, skip the memory.
  }

  try {
    const res = await fetch(`/api/views?slug=${encodeURIComponent(slug)}`, {
      method: counted ? 'GET' : 'POST',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return;
    const { count } = (await res.json()) as { count: number | null };
    if (typeof count !== 'number') return;

    try {
      sessionStorage.setItem(seen, '1');
    } catch {
      /* nothing to do */
    }

    const num = line.querySelector<HTMLElement>('[data-views-num]');
    if (!num) return;
    line.hidden = false;
    countTo(num, count);
  } catch {
    // Offline, blocked, or no store linked yet: the line stays hidden.
  }
}
