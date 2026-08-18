/**
 * The closing wheel strip (see components/work/FooterStrip.astro).
 *
 * The words are set as ordinary type, not as a particle field: the wheel wipes
 * each one in as it rolls past, they hold, then they fade back out and the
 * loop restarts. Drawn on one canvas so the whole strip is a single element.
 *
 * Timing, geometry and easing match the authored piece exactly:
 *   Run 7s (the roll), Hold 3.5s (settled), Scatter 1.5s (back to particles).
 */

const W = 1920;
const H = 360;
const M = 80;
const LIGHT = '#f3f2f2';
const ACCENT = '#ec3013';

const WORDS = ['Data', 'Design', 'Technology', 'Communication', 'Research', 'AI-ML Integration'];
// Google Sans bold, in ordinary sentence case. Google Sans is not served
// publicly, so Google Sans Flex at the same weight stands behind it and the
// strip stays in the site's own voice either way.
const FACE = '700 %spx "Google Sans", "Google Sans Flex", Arial, sans-serif';
const FS = 36;
const DOT_GAP = 56;
const R = 40;
const RULE_Y = 248;
const BASE_Y = RULE_Y - 26;
const LEAD = 50;
const SPAN = 260;

const RUN = 7;
const HOLD = 3.5;
const OUT = 1.5;
const TOTAL = RUN + HOLD + OUT;

const LOGO_D =
  'M37.9887 0.0130083C48.4086 -0.251525 58.2824 3.52577 65.8539 10.6829C73.4105 17.8254 77.721 27.4963 77.9867 37.8724C78.2523 48.2483 74.4733 58.1101 67.2856 65.6497C60.1125 73.189 50.4305 77.4808 40.0102 77.7454C29.5903 78.0099 19.7164 74.2328 12.1449 67.0755C4.5882 59.9327 0.278763 50.2619 0.0131101 39.8861C-0.252527 29.5099 3.52554 19.6482 10.7133 12.1087C17.8863 4.56922 27.5833 0.277551 37.9887 0.0130083ZM41.811 26.4388C40.8074 26.1891 39.7446 26.086 38.6674 26.1155C37.59 26.1448 36.5272 26.3356 35.5385 26.5999L35.0219 6.80305C28.4541 7.59673 22.5057 10.3452 17.768 14.4603L32.1733 28.0989C30.3875 29.2306 28.8968 30.804 27.849 32.6409L13.4438 19.0023C9.57694 23.9257 7.14164 30.0099 6.66936 36.5794L26.5209 36.0648C26.2699 37.0788 26.1662 38.1374 26.1957 39.2103C26.2252 40.2831 26.4174 41.3271 26.683 42.3265L6.83147 42.8402C7.64322 49.3948 10.418 55.3325 14.5209 60.0501L28.1879 45.6917C29.3245 47.4701 30.9046 48.9538 32.7494 49.9974L19.0824 64.3421C24.0267 68.2072 30.1221 70.6327 36.7045 71.1029L36.1879 51.306C37.1914 51.5559 38.2541 51.6584 39.3315 51.6292C40.4086 51.5997 41.4715 51.4084 42.4604 51.1439L42.977 70.9407C49.5449 70.1472 55.4932 67.3841 60.2309 63.2835L45.8256 49.6448C47.6114 48.5132 49.1028 46.941 50.1508 45.1038L64.5551 58.7425C68.422 53.8191 70.858 47.7346 71.3305 41.1654L51.4789 41.679C51.7298 40.6651 51.8326 39.6071 51.8032 38.5345C51.7736 37.4617 51.5817 36.4177 51.3158 35.4183L71.1674 34.9036C70.3557 28.349 67.5959 22.4112 63.478 17.6937L49.811 32.053C48.6744 30.2747 47.0953 28.79 45.2504 27.7464L58.9174 13.388H58.9321C53.9875 9.53744 47.8918 7.09759 41.2944 6.62727L41.811 26.4388ZM38.7426 28.9212C44.2626 28.7888 48.8528 33.124 49.0004 38.6351C49.1333 44.1465 44.7793 48.7323 39.2592 48.8646C33.7393 48.997 29.149 44.6612 29.0014 39.1497C28.8685 33.6385 33.2227 29.0534 38.7426 28.9212Z';

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t: number) => t * t * t;
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

interface Word { text: string; w: number }

export function footerStrip(): void {
  const hosts = document.querySelectorAll<HTMLElement>('[data-footer-strip]');
  hosts.forEach((host) => {
    const canvas = host.querySelector('canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const logo = typeof Path2D === 'function' ? new Path2D(LOGO_D) : null;

    let words: Word[] = [];
    let xs: number[] = [];
    let scale = 1;
    let raf = 0;
    let start = 0;
    let running = false;

    const size = (): void => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = host.clientWidth || W;
      const cssH = (cssW * H) / W;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.height = `${cssH}px`;
      scale = (cssW * dpr) / W;
    };

    const build = (): void => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.font = FACE.replace('%s', String(FS));
      words = WORDS.map((text) => ({ text, w: ctx.measureText(text).width }));
      xs = [];
      let x = M;
      for (const d of words) {
        xs.push(x);
        x += d.w + DOT_GAP;
      }
    };

    const frame = (t: number): void => {
      // The authored piece carries an 80px margin inside its own frame. The
      // strip sits in the colophon's text column, which already has that
      // margin, so the drawing is shifted left by it and the rule and the
      // first word line up with "Project credits" above them.
      ctx.setTransform(scale, 0, 0, scale, -M * scale, 0);
      ctx.clearRect(M, 0, W, H);

      // the roll, and the rule it rolls along
      const p = clamp((t - 0.2) / (RUN - 0.2), 0, 1);
      const wx = -140 + (W + 280) * easeInOutSine(p);
      const ruleGrow = easeOutCubic(clamp(t / 0.8, 0, 1));
      const out = t >= RUN + HOLD ? clamp((t - RUN - HOLD) / 1.1, 0, 1) : 0;

      ctx.globalAlpha = out > 0 ? 1 - out : 1;
      ctx.fillStyle = LIGHT;
      ctx.fillRect(M, RULE_Y, (W - 2 * M) * ruleGrow, 2);

      ctx.font = FACE.replace('%s', String(FS));
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = LIGHT;

      for (let i = 0; i < words.length; i++) {
        const d = words[i];
        const x0 = xs[i];

        if (out > 0) {
          // fading back out, each word a beat behind the one before it, so the
          // strip clears in the same direction the wheel travelled
          const e = easeInCubic(clamp(out - i * 0.06, 0, 1));
          if (e >= 1) continue;
          ctx.globalAlpha = 1 - e;
          ctx.fillText(d.text, x0, BASE_Y - e * 10);
          continue;
        }

        // the wheel's leading edge wipes the word in, left to right
        const pr = clamp((wx - x0 + LEAD) / (d.w + SPAN * 0.5), 0, 1);
        if (pr <= 0) continue;
        const e = easeOutCubic(pr);
        ctx.save();
        ctx.beginPath();
        ctx.rect(x0 - 2, BASE_Y - FS * 1.2, (d.w + 4) * e, FS * 1.7);
        ctx.clip();
        ctx.globalAlpha = clamp(e * 1.6, 0, 1);
        ctx.fillText(d.text, x0, BASE_Y);
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      // the wheel itself, rotating at the rate it is travelling
      if (logo && wx > -139 && wx < W + 139) {
        const k = (R * 2) / 78;
        const rot = ((wx + 140) / R);
        ctx.globalAlpha = 1;
        ctx.save();
        ctx.translate(wx - 39 * k, RULE_Y - 1 - 78 * k);
        ctx.scale(k, k);
        ctx.translate(39, 39);
        ctx.rotate(rot);
        ctx.translate(-39, -39);
        ctx.fillStyle = ACCENT;
        ctx.fill(logo, 'evenodd');
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number): void => {
      if (!start) start = now;
      frame(((now - start) / 1000) % TOTAL);
      raf = requestAnimationFrame(loop);
    };

    const play = (): void => {
      if (running || still) return;
      running = true;
      start = 0;
      raf = requestAnimationFrame(loop);
    };
    const pause = (): void => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const init = (): void => {
      size();
      build();
      // settled state first, so the strip is never blank before it plays
      frame(RUN + 0.5);
      if ('IntersectionObserver' in window && !still) {
        new IntersectionObserver(
          (entries) => entries.forEach((e) => (e.isIntersecting ? play() : pause())),
          { rootMargin: '120px' },
        ).observe(host);
      } else if (!still) {
        play();
      }
      window.addEventListener('resize', () => {
        size();
        if (!running) frame(RUN + 0.5);
      });
    };

    // Measuring before the face lands would size the words to the fallback,
    // so the layout is built once the real font is in.
    if (document.fonts?.load) {
      document.fonts
        .load(`700 ${FS}px "Google Sans Flex"`)
        .then(() => document.fonts.ready)
        .then(init)
        .catch(init);
    } else {
      init();
    }
  });
}
