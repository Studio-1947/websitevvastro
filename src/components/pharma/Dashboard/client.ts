/*
 * Behaviour for the Pharma ERP dashboard preview (index.astro).
 * Everything works on the sample data in content.ts and resets on reload.
 */
import {
  SHOP, START, QUEUE, DOCTORS, REVENUE, REVENUE_30, REVENUE_90, PERIODS, SAMPLE_BILLS, TRANSFER_LABEL,
  inr, chartLine, chartArea, chartPoints, chartTicks, CHART,
} from './content';

const root = document.querySelector<HTMLElement>('[data-dash]');
if (root) {
  const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const $$ = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
  const scaler = $('[data-scaler]');
  const stage = $('[data-stage]');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const W = 1280, H = 760;

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

  /* ---------- Today's date, and the home chart's first day ---------- */
  const now = new Date();
  const dayLabel = (daysAgo: number) => {
    const d = new Date(now);
    d.setDate(now.getDate() - daysAgo);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };
  $('[data-date]').textContent = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  $$('[data-chart]').forEach((c) => {
    const days = c.dataset.values!.split(',').length;
    c.querySelector('[data-x-start]')!.textContent = dayLabel(days - 1);
  });

  /* ---------- Helpers ---------- */
  const tween = (el: HTMLElement, from: number, to: number, fmt: (n: number) => string, ms = 700) => {
    if (still) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      el.textContent = fmt(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const whole = (n: number) => Math.round(n).toLocaleString('en-IN');
  const lakh = (n: number) => `₹${(n / 100000).toFixed(1)}L`;

  /** Redraw a chart (Chart.astro) for new values. */
  const paint = (chart: HTMLElement, values: number[]) => {
    chart.dataset.values = values.join(',');
    chart.querySelector('[data-line]')!.setAttribute('d', chartLine(values));
    chart.querySelector('[data-area]')!.setAttribute('d', chartArea(values));
    const [x, y] = chartPoints(values).at(-1)!;
    const dot = chart.querySelector<HTMLElement>('[data-dot]')!;
    dot.style.left = `${(x / CHART.w) * 100}%`;
    dot.style.top = `${(y / CHART.h) * 100}%`;
    const ticks = chartTicks(values);
    chart.querySelectorAll('[data-ticks] li').forEach((li, i) => { li.textContent = ticks[i]; });
    chart.querySelector('[data-x-start]')!.textContent = dayLabel(values.length - 1);
  };

  let toastTimer = 0;
  const toast = (text: string) => {
    const t = $('[data-toast]');
    $('[data-toast-text]').textContent = text;
    t.classList.add('is-on');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => t.classList.remove('is-on'), 2600);
  };
  const bump = (key: string) => {
    const card = root.querySelector(`[data-card="${key}"]`);
    if (!card) return;
    card.classList.add('is-bump');
    window.setTimeout(() => card.classList.remove('is-bump'), 600);
  };

  /* ---------- Sales: a saved bill moves every number that counts it ---------- */
  const state = { sales: START.sales, invoices: START.invoices, billNo: START.billNo, revenue: [...REVENUE], branch: 0 };
  const stat = (k: string) => $(`[data-stat="${k}"]`);
  const billings = $('[data-billings]');

  const recordSale = (amount: number, who = 'Walk-in') => {
    const before = { sales: state.sales, invoices: state.invoices };
    state.sales += amount;
    state.invoices += 1;
    state.billNo += 1;
    state.revenue[state.revenue.length - 1] = state.sales;
    tween(stat('sales'), before.sales, state.sales, inr);
    tween(stat('sales-mini'), before.sales, state.sales, inr);
    tween(stat('invoices'), before.invoices, state.invoices, whole, 400);
    stat('invoices-mini').textContent = String(state.invoices);
    stat('invoices-badge').textContent = String(state.invoices);
    $('[data-billno]').textContent = String(state.billNo + 1);
    bump('sales');
    paint($('[data-chart="home"]'), state.revenue);

    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }).toUpperCase();
    const li = document.createElement('li');
    li.innerHTML = `<span class="btoday__avatar">${who[0]}</span><span class="btoday__who"><b>${who}</b><code>MRB-${state.billNo}</code></span><span class="btoday__amt"><b>${inr(amount)}</b><small>${time}</small></span>`;
    billings.prepend(li);

    toast(`Bill #${state.billNo} saved · ${inr(amount)}`);
  };

  /* ---------- Screens ---------- */
  const crumbs: Record<string, string> = JSON.parse(root.dataset.crumbs!);
  const show = (view: string) => {
    $$('[data-view]').forEach((v) => v.classList.toggle('is-active', v.dataset.view === view));
    $$('.side__item[data-go]').forEach((n) => {
      if (n.dataset.go === view) n.setAttribute('aria-current', 'page');
      else n.removeAttribute('aria-current');
    });
    $('[data-crumb]').textContent = crumbs[view];
  };

  /* ---------- Inventory filter ---------- */
  const filter = (f: string) => {
    $$('[data-chip]').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.chip === f)));
    $$('.stk__row[data-status]').forEach((r) => { r.hidden = f !== 'all' && r.dataset.status !== f; });
  };

  /* ---------- Billing ---------- */
  const bill = new Map<string, number>();
  const search = $<HTMLInputElement>('[data-search]');
  const renderBill = () => {
    let total = 0;
    $$('[data-line-item]').forEach((li) => {
      const id = li.dataset.lineItem!;
      const qty = bill.get(id) ?? 0;
      const price = Number(li.dataset.price);
      li.hidden = qty === 0;
      li.querySelector('[data-qty]')!.textContent = `${qty} × ${inr(price)}`;
      li.querySelector('[data-amount]')!.textContent = inr(qty * price);
      total += qty * price;
    });
    $('[data-total]').textContent = inr(total);
    $('[data-empty]').hidden = bill.size > 0;
    $<HTMLButtonElement>('[data-save]').disabled = bill.size === 0;
    return total;
  };
  const runSearch = () => {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    $$('[data-result]').forEach((el) => {
      const hit = !q || el.dataset.name!.includes(q);
      el.hidden = !hit;
      if (hit) shown++;
    });
    $('[data-none]').hidden = shown > 0;
  };
  search.addEventListener('input', runSearch);

  /* ---------- Prescriptions ---------- */
  const rxTab = (key: string) => {
    $$('[data-rx-tab]').forEach((t) => t.classList.toggle('is-on', t.dataset.rxTab === key));
    $$('[data-rx-row]').forEach((r) => { r.hidden = key !== 'all' && r.dataset.rxStatus !== key; });
  };
  const rxCounts = () => {
    const rows = $$('[data-rx-row]');
    $$('[data-rx-count]').forEach((c) => {
      const k = c.dataset.rxCount!;
      c.textContent = String(rows.filter((r) => k === 'all' || r.dataset.rxStatus === k).length);
    });
  };

  /* ---------- Patients ---------- */
  const patientSearch = $<HTMLInputElement>('[data-patient-search]');
  const duesBtn = $('[data-dues]');
  const filterPatients = () => {
    const q = patientSearch.value.trim().toLowerCase();
    const dues = duesBtn.getAttribute('aria-pressed') === 'true';
    let shown = 0;
    $$('[data-patient]').forEach((r) => {
      const hit = (!q || r.dataset.name!.includes(q)) && (!dues || Number(r.dataset.due) > 0);
      r.hidden = !hit;
      if (hit) shown++;
    });
    $('[data-patient-foot]').textContent = `${shown} patient${shown === 1 ? '' : 's'}`;
  };
  patientSearch.addEventListener('input', filterPatients);

  /* ---------- Distribution ---------- */
  const transferCounts = () => {
    (['pending', 'transit', 'delivered'] as const).forEach((s) => {
      $(`[data-t-count="${s}"]`).textContent = String($$(`[data-t-status="${s}"]`).length);
    });
  };
  const setTransfer = (row: HTMLElement, status: 'transit' | 'delivered') => {
    row.dataset.tStatus = status;
    const pill = row.querySelector<HTMLElement>('[data-t-pill]')!;
    pill.textContent = TRANSFER_LABEL[status];
    pill.className = `badge badge--${status === 'transit' ? 'blue' : 'green'}`;
    const act = row.querySelector('.trow__act')!;
    act.innerHTML = status === 'transit'
      ? '<button type="button" class="act act--blue" data-deliver>Mark delivered</button>'
      : '<span class="muted small">Received</span>';
    transferCounts();
  };

  /* ---------- Reports ---------- */
  const setPeriod = (days: string) => {
    $$('[data-period]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.period === days)));
    const p = PERIODS[days];
    $('[data-r="revenue"]').textContent = lakh(p.revenue);
    $('[data-r="invoices"]').textContent = whole(p.invoices);
    $('[data-r="avg"]').textContent = inr(p.revenue / p.invoices);
    $('[data-r="gst"]').textContent = inr(p.gst);
    $('[data-r="range"]').textContent = `Last ${days} days`;
    const n = Number(days);
    paint($('[data-chart="reports"]'), n <= 30 ? REVENUE_30.slice(-n) : REVENUE_90);
  };

  /* ---------- Clinic Queue ---------- */
  const queue = { waiting: QUEUE.waiting, token: QUEUE.token, doctorWaiting: DOCTORS.map((d) => d.waiting) };

  /* ---------- One-line answers for buttons that would open a form ---------- */
  const ACTIONS: Record<string, string> = {
    po: `Purchase order drafted for ${START.lowStock} low-stock items`,
    compare: 'Branch comparison ready in Analytics',
    branches: `${SHOP.branches.length} branches registered`,
    scan: 'Supplier bill read: 12 items ready to add',
    add: 'New medicine form opened',
    history: 'Showing all invoices for today',
    patient: 'New patient form opened',
    'new-rx': 'New prescription form opened',
    supplier: 'New supplier form opened',
    filter: 'Filter: all branches, all roles',
    export: 'Staff list exported',
    staff: 'New staff account form opened',
    transfer: 'New transfer form opened',
    refresh: 'Analytics refreshed',
    excel: 'Sales report downloaded as Excel',
    invite: 'Invite link ready to share',
  };

  /* ---------- Clicks (from the visitor or the demo) ---------- */
  root.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('button');
    if (!t || !root.contains(t)) return;
    const d = t.dataset;

    if (d.go) {
      show(d.go);
      if (d.filter) filter(d.filter);
    }
    if (d.chip) filter(d.chip);
    if (d.add) {
      bill.set(d.add, (bill.get(d.add) ?? 0) + 1);
      renderBill();
    }
    if (d.remove) { bill.delete(d.remove); renderBill(); }
    if (t.hasAttribute('data-save')) {
      const total = renderBill();
      if (total > 0) {
        bill.clear();
        renderBill();
        search.value = '';
        runSearch();
        recordSale(total);
      }
    }
    if (t.hasAttribute('data-branch-switch')) {
      state.branch = (state.branch + 1) % SHOP.branches.length;
      $$('[data-branch-name]').forEach((el) => { el.textContent = SHOP.branches[state.branch]; });
      toast(`Switched to ${SHOP.branches[state.branch]}`);
    }
    if (d.token) {
      // The banner's button gives the token to the first doctor.
      const i = Number(d.token);
      queue.waiting += 1;
      queue.token += 1;
      queue.doctorWaiting[i] += 1;
      $('[data-q="waiting"]').textContent = String(queue.waiting);
      $(`[data-doc-waiting="${i}"]`).textContent = String(queue.doctorWaiting[i]);
      toast(`Token A-${String(queue.token).padStart(3, '0')} issued for ${DOCTORS[i].name}`);
    }
    if (d.rxTab) rxTab(d.rxTab);
    if (t.hasAttribute('data-verify')) {
      const row = t.closest<HTMLElement>('[data-rx-row]')!;
      row.dataset.rxStatus = 'verified';
      const pill = row.querySelector<HTMLElement>('[data-rx-pill]')!;
      pill.textContent = 'Verified';
      pill.className = 'badge badge--green';
      t.replaceWith(Object.assign(document.createElement('span'), { className: 'muted small', textContent: 'Done' }));
      rxCounts();
      toast(`${row.querySelector('code')!.textContent} verified`);
    }
    if (t.hasAttribute('data-dues')) {
      t.setAttribute('aria-pressed', String(t.getAttribute('aria-pressed') !== 'true'));
      filterPatients();
    }
    if (t.hasAttribute('data-collect')) {
      const row = t.closest<HTMLElement>('[data-patient]')!;
      const due = Number(row.dataset.due);
      row.dataset.due = '0';
      row.querySelector('[data-due-pill]')?.remove();
      t.remove();
      filterPatients();
      toast(`${inr(due)} collected from ${row.querySelector('b')!.textContent}`);
    }
    if (d.po) toast(`Purchase order drafted for ${d.po}`);
    if (t.hasAttribute('data-approve')) {
      const row = t.closest<HTMLElement>('[data-transfer]')!;
      setTransfer(row, 'transit');
      toast(`${row.querySelector('code')!.textContent} approved and dispatched`);
    }
    if (t.hasAttribute('data-deliver')) {
      const row = t.closest<HTMLElement>('[data-transfer]')!;
      setTransfer(row, 'delivered');
      toast(`${row.querySelector('code')!.textContent} delivered`);
    }
    if (d.period) setPeriod(d.period);
    if (t.hasAttribute('data-toggle-user')) {
      const row = t.closest<HTMLElement>('[data-user]')!;
      const pill = row.querySelector<HTMLElement>('[data-user-pill]')!;
      const active = pill.textContent === 'Active';
      pill.textContent = active ? 'Inactive' : 'Active';
      pill.className = `badge badge--${active ? 'red' : 'green'}`;
      t.className = `link-btn link-btn--${active ? 'green' : 'red'}`;
      t.querySelector('span')!.textContent = active ? 'Activate' : 'Deactivate';
    }
    if (d.action && ACTIONS[d.action]) toast(ACTIONS[d.action]);
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
    cursor.style.transform = `translate(${x}px, ${y}px)`;
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
    search.value = '';
    runSearch();
    for (const ch of text) {
      search.value += ch;
      runSearch();
      await wait(130);
    }
  };
  const nav = (view: string) => press($(`.side__item[data-go="${view}"]`));
  const fakeBill = () => recordSale(SAMPLE_BILLS[(state.billNo + 3) % SAMPLE_BILLS.length]);

  const tour = async () => {
    root.classList.add('is-touring');
    try {
      for (;;) {
        show('home');
        await wait(2200); fakeBill();
        await wait(3000); fakeBill();
        await wait(2200);
        await press($('[data-view="home"] .view__head [data-go="pos"]'));
        await wait(500);
        await pointAt(search);
        await type('para');
        await wait(350);
        await press($('.addchip[data-add="pcm"]'));
        await wait(300);
        await press($('.addchip[data-add="pcm"]'));
        search.value = '';
        runSearch();
        await wait(300);
        await press($('.addchip--rx[data-add="ors"]'));
        await wait(600);
        await press($('[data-save]'));
        await wait(1800);
        await nav('stock');
        await wait(1200);
        await press($('[data-chip="expiring"]'));
        await wait(2000);
        await press($('[data-chip="all"]'));
        await wait(600);
        await nav('rx');
        await wait(1200);
        const verify = root.querySelector<HTMLElement>('[data-verify]');
        if (verify) { await press(verify); await wait(1600); }
        await nav('queue');
        await wait(1200);
        await press($('.doc__issue[data-token="1"]'));
        await wait(2000);
        await nav('analytics');
        await wait(3200);
        await nav('home');
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
    search.value = '';
    runSearch();
  };
  root.addEventListener('pointerdown', takeOver);
  root.addEventListener('keydown', takeOver);

  let started = false;
  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (visible && !started) {
      started = true;
      if (!still) {
        root.classList.add('is-drawing');
        tween(stat('sales'), 0, state.sales, inr, 1400);
        tween(stat('invoices'), 0, state.invoices, whole, 1400);
        tour();
      }
    }
  }, { threshold: 0.35 }).observe(root);

  renderBill();
}
