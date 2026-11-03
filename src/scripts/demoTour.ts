/**
 * The guided demo for the product dashboards: while a dashboard is on screen
 * and untouched, a pointer moves to controls and clicks them, in a loop, so a
 * visitor sees it working before they try it. The moment they click, tap or
 * type inside it, the demo stops for good and it is theirs (scrolling the
 * page past it does not count).
 * Off screen it pauses. Reduced motion: no demo at all.
 *
 * The same behaviour as the S47 Vyapar and Pharma ERP demos (their own
 * copies live in components/isd and components/pharma), shared here by the
 * Social Flow and Doptor demos. Every dashboard is a fixed 1280 × 760 stage
 * scaled with a `--s` custom property; the pointer lives inside the stage,
 * so it moves in stage pixels. Elements inside a same-origin iframe laid over
 * the stage (the Campus demo) work too: their rects are already in stage pixels.
 */

export interface TourSteps {
  /** Waits, pausing while off screen; stops the tour once the visitor takes over. */
  wait: (ms: number) => Promise<void>;
  /** Moves the pointer onto an element. */
  pointAt: (el: Element | null | undefined) => Promise<void>;
  /** Moves the pointer onto an element and clicks it. */
  press: (el: Element | null | undefined) => Promise<void>;
  /** Moves the pointer onto a <select> and picks a value, as a visitor would. */
  choose: (el: HTMLSelectElement | null | undefined, value: string) => Promise<void>;
}

interface Options {
  /** The frame the visitor sees: watched for visibility and for taking over. */
  root: HTMLElement;
  /** The fixed-size stage that holds the pointer (scaled by `--s`). */
  stage: HTMLElement;
  /** One round of the tour; it is run again and again. */
  round: (t: TourSteps) => Promise<void>;
  /** Extra documents whose input also counts as taking over (a demo's iframe). */
  docs?: () => Document[];
  /** Starts only once this resolves (e.g. an iframe has loaded). */
  ready?: Promise<unknown>;
}

const STOP = Symbol('stop');
let styled = false;

function addStyles() {
  if (styled) return;
  styled = true;
  const css = document.createElement('style');
  css.textContent = `
    .demo-cursor {
      position: absolute; left: 0; top: 0; z-index: 60; pointer-events: none;
      opacity: 0; translate: 700px 460px; transform-origin: 21% 12%;
      transition: translate .75s cubic-bezier(.45, 0, .2, 1), opacity .3s ease;
      filter: drop-shadow(0 2px 3px rgba(0, 0, 0, .25));
    }
    .demo-touring .demo-cursor { opacity: 1; }
    .demo-cursor.is-click { animation: demo-click .25s ease; }
    @keyframes demo-click { 50% { scale: .8; } }
  `;
  document.head.appendChild(css);
}

export function startTour({ root, stage, round, docs, ready }: Options): void {
  if (typeof window === 'undefined') return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  addStyles();

  const svgNs = 'http://www.w3.org/2000/svg';
  const cursor = document.createElementNS(svgNs, 'svg');
  cursor.setAttribute('class', 'demo-cursor');
  cursor.setAttribute('width', '22');
  cursor.setAttribute('height', '22');
  cursor.setAttribute('viewBox', '0 0 24 24');
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<path d="M5 3l14 8-6 1.6L10 19z" fill="#0D0D0D" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>';
  stage.appendChild(cursor);

  let visible = false;
  let touched = false;
  const scale = () => Number(getComputedStyle(stage).getPropertyValue('--s')) || stage.getBoundingClientRect().width / stage.offsetWidth || 1;

  const wait = (ms: number) => new Promise<void>((resolve, reject) => {
    let left = ms;
    const tick = () => {
      if (touched) return reject(STOP);
      if (!visible) return window.setTimeout(tick, 250);
      if (left <= 0) return resolve();
      left -= 50;
      window.setTimeout(tick, 50);
    };
    tick();
  });

  const pointAt = async (el: Element | null | undefined) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    let x: number, y: number;
    if (el.ownerDocument !== document) {
      // Inside the demo's iframe: its own pixels are stage pixels.
      x = r.left + r.width * 0.55;
      y = r.top + r.height * 0.55;
    } else {
      const s = stage.getBoundingClientRect();
      const k = scale();
      x = (r.left - s.left + r.width * 0.55) / k;
      y = (r.top - s.top + r.height * 0.55) / k;
    }
    cursor.style.translate = `${x}px ${y}px`;
    await wait(800);
  };

  const pulse = (el: Element) => {
    cursor.classList.remove('is-click');
    void cursor.getBoundingClientRect();
    cursor.classList.add('is-click');
    (el as HTMLElement).animate?.([{ transform: 'scale(1)' }, { transform: 'scale(.95)' }, { transform: 'scale(1)' }], { duration: 220, easing: 'ease-out' });
  };

  const press = async (el: Element | null | undefined) => {
    if (!el) return;
    await pointAt(el);
    pulse(el);
    await wait(160);
    (el as HTMLElement).click();
  };

  const choose = async (el: HTMLSelectElement | null | undefined, value: string) => {
    if (!el) return;
    await pointAt(el);
    pulse(el);
    await wait(200);
    el.value = value;
    el.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const takeOver = (e: Event) => {
    if (!e.isTrusted || touched) return;
    touched = true;
    root.classList.remove('demo-touring');
  };
  const listen = (target: EventTarget) => {
    for (const type of ['pointerdown', 'keydown']) target.addEventListener(type, takeOver, { passive: true });
  };
  listen(root);

  const run = async () => {
    await ready;
    docs?.().forEach(listen);
    root.classList.add('demo-touring');
    try {
      for (;;) await round({ wait, pointAt, press, choose });
    } catch {
      root.classList.remove('demo-touring');
    }
  };

  let started = false;
  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (visible && !started) {
      started = true;
      run();
    }
  }, { threshold: 0.35 }).observe(root);
}
