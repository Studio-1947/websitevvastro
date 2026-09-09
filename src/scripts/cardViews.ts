/** Portfolio grid: fills each card's view count from its own tally (see
 * scripts/views.ts). A GET only reads the count, it never increments -
 * visiting the listing should not count as a view of every case. Stays
 * hidden until a real number comes back, same as the case page itself. */
export async function cardViews(): Promise<void> {
  const cards = document.querySelectorAll<HTMLElement>('[data-card-views]');
  if (!cards.length) return;

  await Promise.all(
    Array.from(cards).map(async (el) => {
      const slug = el.dataset.cardViews;
      if (!slug) return;
      try {
        const res = await fetch(`/api/views?slug=${encodeURIComponent(slug)}`, {
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) return;
        const { count } = (await res.json()) as { count: number | null };
        if (typeof count !== 'number') return;
        const num = el.querySelector<HTMLElement>('[data-card-views-num]');
        if (!num) return;
        num.textContent = count.toLocaleString('en-IN');
        el.hidden = false;
      } catch {
        // A counter is never worth breaking the grid over.
      }
    }),
  );
}
