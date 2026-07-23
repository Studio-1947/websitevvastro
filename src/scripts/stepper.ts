/**
 * "Our Approach" vertical stepper.
 *
 * Originally auto-advanced every 4.2s. That was removed deliberately: the rows
 * are now pluckable strings that play a note (see approachStrings.ts), and a
 * step advancing on a timer would either fire audio nobody asked for or leave
 * the panel out of step with the sound. Advancing is user-driven only — click,
 * pluck, or keyboard via the existing <button>.
 */
export function approachStepper(): void {
  const root = document.querySelector('[data-approach] .astep');
  if (!root) return;
  const items = Array.prototype.slice.call(
    root.querySelectorAll('.astep__item'),
  ) as HTMLElement[];
  if (!items.length) return;

  function activate(n: number): void {
    const i = (n + items.length) % items.length;
    items.forEach((it, idx) => {
      const on = idx === i;
      it.classList.toggle('is-active', on);
      const row = it.querySelector('.astep__row');
      if (row) row.setAttribute('aria-expanded', String(on));
    });
  }

  items.forEach((it, idx) => {
    const row = it.querySelector('.astep__row');
    if (!row) return;
    // The panels are disclosure widgets — say so for assistive tech.
    const panel = it.querySelector('.astep__panel');
    if (panel) {
      panel.id = panel.id || `astep-panel-${idx}`;
      row.setAttribute('aria-controls', panel.id);
    }
    row.addEventListener('click', () => activate(idx));
  });

  activate(0);
}
