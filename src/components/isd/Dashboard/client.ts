/*
 * Behaviour for the sales dashboard preview (index.astro).
 * Everything works on the sample data in content.ts and resets on reload.
 */
import {
  CHANNELS, PERIODS, PRODUCTS, AVG_PRICE, DONUT_R, heat, donut,
  monthly, totals, trend, trendLabels, chartMax, chartTicks, chartLine, chartArea,
  inr, num, short, pct, type Selection, type PeriodId, type Totals, type ChannelId,
} from './content';

const root = document.querySelector<HTMLElement>('[data-dash]');
if (root) {
  const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const $$ = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
  const scaler = $('[data-scaler]');
  const stage = $('[data-stage]');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const W = 1280, H = 760;
  const CIRC = 2 * Math.PI * DONUT_R;

  /* ---------- Fit the fixed-size stage to its box ---------- */
  let scale = 1;
  const fit = () => {
    scale = scaler.clientWidth / W;
    stage.style.setProperty('--s', String(scale));
    scaler.style.height = `${H * scale}px`;
    scaler.style.aspectRatio = 'auto';
  };
  new ResizeObserver(fit).observe(scaler);
  fit();

  /* ---------- Helpers ---------- */
  const tween = (el: HTMLElement, from: number, to: number, fmt: (n: number) => string, ms = 700) => {
    if (still || from === to) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      el.textContent = fmt(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  let toastTimer = 0;
  const toast = (text: string) => {
    const t = $('[data-toast]');
    $('[data-toast-text]').textContent = text;
    t.classList.add('is-on');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => t.classList.remove('is-on'), 2600);
  };
  const bump = () => {
    $$('[data-card]').forEach((c) => c.classList.add('is-bump'));
    window.setTimeout(() => $$('[data-card]').forEach((c) => c.classList.remove('is-bump')), 500);
  };

  /* ---------- State, and every number that follows it ---------- */
  const now = new Date();
  const data = monthly(now);
  const state = { sel: 'all' as Selection, period: 'fytd' as PeriodId, lastYear: false, extraRows: 0 };
  const shown: Record<string, number> = {};
  const label = (sel: Selection) => (sel === 'all' ? 'Total' : CHANNELS.find((c) => c.id === sel)!.label);

  // Headline figures: [element key, value, formatter].
  const figures = (t: Totals): [string, number, (n: number) => string][] => [
    ['net', t.net, inr],
    ['gross', t.gross, inr],
    ['returns', t.returns, inr],
    ['returnsPct', t.returns / t.gross, (n) => pct(n)],
    ['units', t.units, num],
    ['unitsGross', t.unitsGross, num],
    ['unitsReturns', t.unitsGross - t.units, num],
    ['unitsReturnsPct', 1 - t.units / t.unitsGross, (n) => pct(n)],
    ['projected', t.projected, inr],
    ['velocity', t.velocity, inr],
    ['rows', t.rows + state.extraRows, num],
  ];

  const render = (animate = true, from?: number) => {
    const back = state.lastYear ? 12 : 0;
    const t = totals(data, now, state.sel, state.period, back);
    const all = totals(data, now, 'all', state.period, back);

    for (const [k, v, fmt] of figures(t)) {
      const el = root.querySelector<HTMLElement>(`[data-k="${k}"]`);
      if (!el) continue;
      const start = from ?? shown[k] ?? v;
      if (animate) tween(el, start, v, fmt);
      else el.textContent = fmt(v);
      shown[k] = v;
    }

    $('[data-title]').textContent = state.sel === 'all' ? 'Total Sales' : `${label(state.sel)} Sales`;
    const period = PERIODS.find((p) => p.id === state.period)!.label;
    $$('[data-range]').forEach((el) => { el.textContent = `${period} · ${state.lastYear ? 'last year' : 'this year'}`; });

    // Channel share: donut and legend, the picked channel in front.
    const arcs = donut(all.byChannel);
    $$<SVGCircleElement>('[data-seg]').forEach((seg) => {
      const id = seg.dataset.seg as ChannelId;
      seg.setAttribute('stroke-dasharray', `${arcs[id][0].toFixed(1)} ${CIRC.toFixed(1)}`);
      seg.setAttribute('stroke-dashoffset', (-arcs[id][1]).toFixed(1));
      seg.classList.toggle('is-dim', state.sel !== 'all' && state.sel !== id);
    });
    $('[data-donut-total]').textContent = short(t.net);
    $('[data-donut-total]').nextElementSibling!.textContent = state.sel === 'all' ? 'all channels' : label(state.sel);
    $$('[data-bd]').forEach((row) => {
      const id = row.dataset.bd as ChannelId;
      const v = all.byChannel[id];
      row.querySelector('[data-bd-val]')!.textContent = short(v);
      row.querySelector('[data-bd-pct]')!.textContent = pct(v / all.net);
      row.classList.toggle('is-dim', state.sel !== 'all' && state.sel !== id);
    });

    // Trend: twelve months for the picked channel, against the year before.
    const a = trend(data, state.sel, back);
    const b = trend(data, state.sel, back + 12);
    const max = chartMax(a, b);
    $('[data-trend-now]').setAttribute('d', chartLine(a, max));
    $('[data-trend-area]').setAttribute('d', chartArea(a, max));
    $('[data-trend-last]').setAttribute('d', chartLine(b, max));
    chartTicks(max).forEach((tick, i) => { $$('[data-ticks] li')[i].textContent = tick; });
    trendLabels(now, back).forEach((l, i) => { $$('[data-trend-x] span')[i].textContent = l; });

    // Seasonality: each channel's months shaded against its own busiest one.
    const months = heat(data, back);
    const prior = heat(data, back + 12);
    for (const c of CHANNELS) {
      const row = months[c.id];
      const lo = Math.min(...row), top = Math.max(...row);
      row.forEach((v, i) => {
        const cell = root.querySelector<HTMLElement>(`[data-heat="${c.id}-${i}"]`)!;
        cell.style.setProperty('--a', `${Math.round(8 + 92 * ((v - lo) / (top - lo)))}%`);
        cell.title = short(v);
      });
      const g = row.reduce((x, v) => x + v, 0) / prior[c.id].reduce((x, v) => x + v, 0) - 1;
      const badge = $(`[data-heat-g="${c.id}"]`);
      badge.textContent = pct(g, true);
      badge.className = `badge badge--${g >= 0 ? 'green' : 'red'}`;
      const dim = state.sel !== 'all' && state.sel !== c.id;
      $(`[data-heat-row="${c.id}"]`).classList.toggle('is-dim', dim);
      root.querySelectorAll(`[data-heat^="${c.id}-"], [data-heat-g="${c.id}"]`).forEach((el) => el.classList.toggle('is-dim', dim));
    }
    trendLabels(now, back).forEach((l, i) => { $$('[data-heat-m]')[i].textContent = l.split(' ')[0]; });

    // Everything stated as a share of sales: products, people, categories, places.
    $$('[data-share]').forEach((el) => {
      const share = Number(el.dataset.share);
      el.textContent = el.dataset.fmt === 'units'
        ? num((t.net * share) / Number(el.dataset.price ?? AVG_PRICE))
        : short(t.net * share);
    });
  };

  /* ---------- Screens and the sidebar ---------- */
  const show = (view: string) => {
    $$('[data-view]').forEach((v) => v.classList.toggle('is-active', v.dataset.view === view));
  };
  const mark = (item: HTMLElement) => {
    $$('.side__item').forEach((n) => (n === item ? n.setAttribute('aria-current', 'page') : n.removeAttribute('aria-current')));
  };
  const setSel = (sel: Selection) => {
    if (sel === state.sel) return;
    state.sel = sel;
    $$('[data-chip]').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.chip === sel)));
    render();
    bump();
  };
  const setTab = (id: string) => {
    $$('[data-tab]').forEach((x) => x.setAttribute('aria-selected', String(x.dataset.tab === id)));
    $$('[data-pane]').forEach((p) => p.classList.toggle('is-on', p.dataset.pane === id));
  };
  const setGeo = (fmt: string) => {
    $$('[data-geo]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.geo === fmt)));
    $$('[data-geo-val]').forEach((el) => { el.dataset.fmt = fmt; });
    render(false);
  };
  const setPlatform = (id: string) => {
    $$('[data-soc]').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.soc === id)));
  };

  /* ---------- Product search ---------- */
  const search = $<HTMLInputElement>('[data-search]');
  const find = $('[data-find]');
  const runSearch = () => {
    const q = search.value.trim().toLowerCase();
    let hits = 0;
    $$('[data-result]').forEach((el) => {
      // Six at most, so the list stays inside the window.
      const hit = !!q && hits < 6 && el.dataset.name!.includes(q);
      el.hidden = !hit;
      if (hit) hits++;
    });
    $('[data-find-none]').hidden = hits > 0;
    find.hidden = !q;
  };
  const clearSearch = () => { search.value = ''; runSearch(); };
  search.addEventListener('input', runSearch);
  search.addEventListener('keydown', (e) => { if (e.key === 'Escape') clearSearch(); });
  // Keep focus in the box while a result is clicked.
  find.addEventListener('pointerdown', (e) => e.preventDefault());

  /* ---------- Clicks (from the visitor or the demo) ---------- */
  root.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.sc__find')) find.hidden = true;
    const t = target.closest<HTMLElement>('button');
    if (!t || !root.contains(t)) return;
    const d = t.dataset;

    if (d.nav) {
      if (d.off !== undefined) { toast(`${d.nav} is not linked to this dashboard yet`); return; }
      mark(t);
      show(d.go!);
      if (d.sel) setSel(d.sel as Selection);
      if (d.platform) setPlatform(d.platform);
    }
    if (d.chip) {
      setSel(d.chip as Selection);
      const item = root.querySelector<HTMLElement>(`.side__item[data-sel="${d.chip}"]`);
      if (item) mark(item);
    }
    if (d.yr) {
      state.lastYear = d.yr === '1';
      $$('[data-yr]').forEach((b) => b.setAttribute('aria-pressed', String(b === t)));
      render();
    }
    if (d.period) {
      state.period = d.period as PeriodId;
      $$('[data-period]').forEach((b) => b.setAttribute('aria-pressed', String(b === t)));
      render();
    }
    if (d.tab) setTab(d.tab);
    if (t.hasAttribute('data-refresh')) {
      t.classList.remove('is-spin');
      void t.offsetWidth;
      t.classList.add('is-spin');
      const added = 120 + Math.floor(Math.random() * 280);
      state.extraRows += added;
      render();
      toast(`Synced: ${num(added)} new sales rows`);
    }
    if (d.productI) {
      const item = PRODUCTS[Number(d.productI)];
      const units = t.querySelector('[data-fmt="units"]')!.textContent;
      clearSearch();
      search.blur();
      toast(`${item.name}: ${units} units across ${CHANNELS.length} channels`);
    }
    if (d.geo) setGeo(d.geo);
    if (d.soc) setPlatform(d.soc);
    if (d.remind) {
      t.disabled = true;
      t.lastChild!.textContent = 'Reminder sent';
      toast(`Reminder sent to ${d.remind}`);
    }
    if (t.hasAttribute('data-remind-all')) {
      const open = $$<HTMLButtonElement>('[data-remind]:not(:disabled)');
      open.forEach((b) => { b.disabled = true; b.lastChild!.textContent = 'Reminder sent'; });
      toast(open.length ? `Reminders sent to ${open.length} customers` : 'Everyone has a reminder already');
    }
    if (d.action === 'dates') toast('Custom dates open a calendar in the full dashboard');
    if (d.restock) {
      t.disabled = true;
      t.lastChild!.textContent = 'Ordered';
      toast(`Restock ordered: ${d.restock}`);
    }
  });

  /* ---------- The guided demo ---------- */
  const cursor = $<SVGElement>('[data-cursor]');
  let visible = false;
  let touched = false;
  const STOP = Symbol('stop');

  // Waits that pause while off screen and give up once the visitor takes over.
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
  const pointAt = async (el: Element) => {
    const r = el.getBoundingClientRect();
    const s = stage.getBoundingClientRect();
    const x = (r.left - s.left + r.width * 0.55) / scale;
    const y = (r.top - s.top + r.height * 0.55) / scale;
    cursor.style.translate = `${x}px ${y}px`;
    await wait(800);
  };
  const press = async (el: HTMLElement) => {
    await pointAt(el);
    cursor.classList.remove('is-click');
    void cursor.getBoundingClientRect();
    cursor.classList.add('is-click');
    el.classList.add('is-pressed');
    await wait(160);
    el.classList.remove('is-pressed');
    el.click();
  };
  const type = async (text: string) => {
    clearSearch();
    for (const ch of text) {
      search.value += ch;
      runSearch();
      await wait(140);
    }
  };
  const nav = (name: string) => press($(`.side__item[data-nav="${name}"]`));

  const tour = async () => {
    root.classList.add('is-touring');
    try {
      for (;;) {
        await wait(2200);
        await press($('[data-chip="mumbai"]'));
        await wait(2200);
        await press($('[data-period="3m"]'));
        await wait(2000);
        await press($('[data-tab="momentum"]'));
        await wait(2400);
        await press($('[data-tab="leaderboard"]'));
        await wait(2400);
        await press($('[data-tab="baskets"]'));
        await wait(2400);
        await press($('[data-tab="seasonality"]'));
        await wait(2400);
        await press($('[data-tab="snapshot"]'));
        await wait(500);
        await press($('[data-period="fytd"]'));
        await wait(400);
        await press($('[data-chip="all"]'));
        await wait(1600);
        await pointAt(search);
        await type('yoga');
        await wait(900);
        await press($('[data-product-i="8"]'));
        await wait(2000);
        await nav('Geo Insights');
        await wait(1800);
        await press($('[data-geo="units"]'));
        await wait(2000);
        await press($('[data-geo="short"]'));
        await wait(600);
        await nav('Abandoned Carts');
        await wait(1200);
        const remind = root.querySelector<HTMLElement>('[data-remind]:not(:disabled)');
        if (remind) { await press(remind); await wait(1800); }
        await nav('Instagram');
        await wait(2400);
        await nav('Total');
      }
    } catch {
      root.classList.remove('is-touring');
    }
  };

  // The visitor takes over the moment they click or type in it.
  const takeOver = (e: Event) => {
    if (!e.isTrusted || touched) return;
    touched = true;
    root.classList.remove('is-touring');
    clearSearch();
  };
  root.addEventListener('pointerdown', takeOver);
  root.addEventListener('keydown', takeOver);

  // Today's figures (the page was drawn when it was built).
  render(false);

  let started = false;
  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (visible && !started) {
      started = true;
      if (!still) {
        root.classList.add('is-drawing');
        render(true, 0);
        tour();
      }
    }
  }, { threshold: 0.35 }).observe(root);
}
