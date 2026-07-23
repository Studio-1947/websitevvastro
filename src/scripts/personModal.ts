/**
 * Team member dialog — content read from each .team-card (name/role/photo) +
 * per-person data-attrs (data-work / data-interests / data-about) or a rich
 * .team-bio block. Ported from js/main.js.
 *
 * Members whose card carries `data-audio` also get a track that starts with the
 * dialog and a pause control (see `audioFor`).
 */
import { lockScroll, unlockScroll } from './scrollLock';

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

  const panel = modal.querySelector<HTMLElement>('.person-modal__panel');
  const scroller = modal.querySelector<HTMLElement>('.person-modal__scroll');

  /** Drives the bottom fade: only while there is more bio below the fold. */
  function syncScrollState(): void {
    if (!panel || !scroller) return;
    const scrollable = scroller.scrollHeight - scroller.clientHeight > 4;
    panel.classList.toggle('is-scrollable', scrollable);
    panel.classList.toggle(
      'is-scroll-end',
      scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 4
    );
  }
  scroller?.addEventListener('scroll', syncScrollState, { passive: true });
  window.addEventListener('resize', syncScrollState);

  const audioWrap = modal.querySelector<HTMLElement>('[data-pm-audio]');
  const audioToggle = modal.querySelector<HTMLButtonElement>('[data-pm-audio-toggle]');
  const audioLabel = modal.querySelector<HTMLElement>('[data-pm-audio-label]');
  const audioNote = modal.querySelector<HTMLElement>('[data-pm-audio-note]');
  let audio: HTMLAudioElement | null = null;

  function setPlaying(on: boolean): void {
    if (!audioToggle) return;
    audioToggle.setAttribute('aria-pressed', String(on));
    audioToggle.classList.toggle('is-playing', on);
    // The visible label is the track name; the action lives in the a11y name so
    // screen readers announce "Pause"/"Play" rather than just the title.
    const track = audioLabel ? audioLabel.textContent || 'track' : 'track';
    audioToggle.setAttribute('aria-label', (on ? 'Pause ' : 'Play ') + track);
  }

  /** Wire (or tear down) the player for one card. */
  function audioFor(card: HTMLElement): void {
    stopAudio();
    const src = card.getAttribute('data-audio');
    if (!audioWrap || !audioToggle) return;
    if (!src) {
      audioWrap.hidden = true;
      return;
    }
    audioWrap.hidden = false;
    if (audioLabel) audioLabel.textContent = card.getAttribute('data-audio-label') || 'Listen';
    const note = card.getAttribute('data-audio-note');
    if (audioNote) {
      audioNote.textContent = note || '';
      audioNote.hidden = !note;
    }

    audio = new Audio(src);
    audio.loop = true;
    audio.addEventListener('play', () => setPlaying(true));
    audio.addEventListener('pause', () => setPlaying(false));
    setPlaying(false);

    // Autoplay is permitted here because we are inside the click that opened the
    // dialog. It can still be refused (iOS Low Power Mode, site sound blocked) —
    // leaving the control in its paused state is the correct outcome, not an error.
    audio.play().catch(() => setPlaying(false));
  }

  function stopAudio(): void {
    if (!audio) return;
    audio.pause();
    audio.src = '';
    audio = null;
    setPlaying(false);
  }

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      if (!audio) return;
      if (audio.paused) audio.play().catch(() => setPlaying(false));
      else audio.pause();
    });
  }

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

    audioFor(card);

    lastFocus = document.activeElement as HTMLElement;
    modal!.classList.add('is-open');
    modal!.setAttribute('aria-hidden', 'false');
    lockScroll();
    // Each open starts at the top of the new person's bio, not where the last
    // one was left, and the fade is measured against the fresh content.
    if (scroller) scroller.scrollTop = 0;
    syncScrollState();
    if (panel) panel.focus();
  }

  function close(): void {
    modal!.classList.remove('is-open');
    modal!.setAttribute('aria-hidden', 'true');
    unlockScroll();
    stopAudio();
    if (lastFocus) lastFocus.focus();
  }

  cards.forEach((card) => {
    // The whole card is the target, not just the arrow. Bound on the card so
    // the arrow's own click bubbles up to exactly one handler — binding both
    // would open, then immediately re-open, on every arrow press.
    card.classList.add('is-clickable');
    card.addEventListener('click', (e) => {
      // Never swallow a real link or control that happens to sit in a card.
      if ((e.target as HTMLElement).closest('a, button:not(.team-card__more)')) return;
      open(card);
    });
    // Keyboard parity: the arrow is still the focusable control, so Enter and
    // Space keep working through its native button behaviour.
  });
  modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
}
