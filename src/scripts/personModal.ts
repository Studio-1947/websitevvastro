/**
 * Team member dialog — content read from each .team-card (name/role/photo) +
 * per-person data-attrs (data-work / data-interests / data-about) or a rich
 * .team-bio block. Ported from js/main.js.
 */
export function personModal(): void {
  const modal = document.getElementById('person-modal');
  const cards = document.querySelectorAll<HTMLElement>('.team-card[data-person]');
  if (!modal || !cards.length) return;

  const media = modal.querySelector('[data-pm-media]');
  const nameEl = modal.querySelector('[data-pm-name]');
  const roleEl = modal.querySelector('[data-pm-role]');
  const blocks = modal.querySelector('[data-pm-blocks]');
  if (!media || !nameEl || !roleEl || !blocks) return;
  let lastFocus: HTMLElement | null = null;

  function text(card: HTMLElement, sel: string): string {
    const el = card.querySelector(sel);
    return el ? (el.textContent || '').trim() : '';
  }

  function addBlock(title: string, value: string | null, asTags?: boolean): void {
    if (!value) return;
    const b = document.createElement('div');
    b.className = 'pm-block';
    const h = document.createElement('h4');
    h.textContent = title;
    b.appendChild(h);
    if (asTags) {
      const wrap = document.createElement('div');
      wrap.className = 'pm-tags';
      value.split(',').forEach((t) => {
        t = t.trim();
        if (!t) return;
        const s = document.createElement('span');
        s.textContent = t;
        wrap.appendChild(s);
      });
      b.appendChild(wrap);
    } else {
      const p = document.createElement('p');
      p.textContent = value;
      b.appendChild(p);
    }
    blocks!.appendChild(b);
  }

  function open(card: HTMLElement): void {
    const name = text(card, '.team-card__name');
    nameEl!.textContent = card.getAttribute('data-fullname') || name;
    roleEl!.textContent = text(card, '.team-card__role');

    media!.innerHTML = '';
    const img = card.querySelector<HTMLImageElement>('.team-card__img img');
    if (img) {
      const clone = document.createElement('img');
      clone.src = img.src;
      clone.alt = img.alt || 'Portrait of ' + name;
      media!.appendChild(clone);
    } else {
      const span = document.createElement('span');
      span.className = 'initial';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = name.charAt(0);
      media!.appendChild(span);
    }

    blocks!.innerHTML = '';
    addBlock('Work Area', card.getAttribute('data-work') || text(card, '.team-card__spec'));
    addBlock('Interests', card.getAttribute('data-interests'), true);
    const bio = card.querySelector('.team-bio');
    if (bio) {
      const bb = document.createElement('div');
      bb.className = 'pm-block pm-bio';
      bb.innerHTML = bio.innerHTML;
      blocks!.appendChild(bb);
    } else {
      addBlock('About', card.getAttribute('data-about'));
    }

    lastFocus = document.activeElement as HTMLElement;
    modal!.classList.add('is-open');
    modal!.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const panel = modal!.querySelector<HTMLElement>('.person-modal__panel');
    if (panel) panel.focus();
  }

  function close(): void {
    modal!.classList.remove('is-open');
    modal!.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  cards.forEach((card) => {
    const btn = card.querySelector('.team-card__more');
    if (btn) btn.addEventListener('click', () => open(card));
  });
  modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
}
