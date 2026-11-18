/**
 * A year at a glance: rows of month ranges (a harvest, a busy season, a
 * campaign calendar) on a 12-column track. Rows marked `plan` are what the
 * work adds: the "Before / With the plan" toggle draws them in, and the
 * counter shows how many months then have a reason to buy. Tapping a month
 * lists everything that happens in it.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import './SeasonCalendar.css';

interface Item {
  from: number;
  to: number;
  label: string;
  /** Shorter label for narrow screens. */
  short?: string;
}
interface Row {
  label: string;
  /** Bar fill and its text colour. */
  color: string;
  ink?: string;
  /** Months in this row count as months with a reason to buy. */
  sells?: boolean;
  /** Drawn only with the plan switched on. */
  plan?: boolean;
  items: Item[];
}
interface Props {
  rows: Row[];
  beforeLabel?: string;
  afterLabel?: string;
  countLabel?: string;
  quietLabel?: string;
  defaultMonth?: number;
}

const SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function SeasonCalendar({
  rows,
  beforeLabel = 'Before',
  afterLabel = 'With the plan',
  countLabel = 'of 12 months with a reason to buy',
  quietLabel = 'A quiet month',
  defaultMonth = 10,
}: Props) {
  const [plan, setPlan] = useState(false);
  const [month, setMonth] = useState(defaultMonth);
  const touched = useRef(false);
  const root = useRef<HTMLDivElement>(null);

  // Draw the plan in once, the first time the calendar is properly in view,
  // unless the reader has already used the toggle.
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let t: number | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !touched.current) {
          t = window.setTimeout(() => !touched.current && setPlan(true), 1400);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  const live = rows.filter((r) => plan || !r.plan);
  const selling = useMemo(() => {
    const s = new Set<number>();
    live.filter((r) => r.sells).forEach((r) => r.items.forEach((it) => { for (let m = it.from; m <= it.to; m++) s.add(m); }));
    return s.size;
  }, [plan, rows]);
  const happening = live.flatMap((r) =>
    r.items.filter((it) => month >= it.from && month <= it.to).map((it) => ({ row: r.label, label: it.label, color: r.color })),
  );

  const choose = (p: boolean) => {
    touched.current = true;
    setPlan(p);
  };

  return (
    <div className="cw-cal" ref={root}>
      <div className="cw-cal__top">
        <div className="cw-cal__toggle" role="group" aria-label="Calendar view">
          <button type="button" aria-pressed={!plan} onClick={() => choose(false)}>{beforeLabel}</button>
          <button type="button" aria-pressed={plan} onClick={() => choose(true)}>{afterLabel}</button>
          <span className="cw-cal__thumb" data-on={plan} aria-hidden="true" />
        </div>
        <p className="cw-cal__count" aria-live="polite">
          <strong key={selling}>{selling}</strong> {countLabel}
        </p>
      </div>

      <div
        className="cw-cal__grid"
        style={{ ['--sel' as any]: month, gridTemplateRows: `auto repeat(${rows.length}, auto)` }}
      >
        <span className="cw-cal__sel" aria-hidden="true" />
        <span className="cw-cal__corner" aria-hidden="true" />
        {SHORT.map((m, i) => (
          <button
            key={m}
            type="button"
            className="cw-cal__month"
            style={{ ['--c' as any]: i + 1 }}
            aria-pressed={month === i + 1}
            aria-label={FULL[i]}
            onClick={() => setMonth(i + 1)}
          >
            <span className="cw-cal__m-long">{m}</span>
            <span className="cw-cal__m-short" aria-hidden="true">{m[0]}</span>
          </button>
        ))}
        {rows.map((r, ri) => (
          <div key={r.label} style={{ gridRow: ri + 2 }} className={`cw-cal__row${r.plan ? ' cw-cal__row--plan' : ''}${r.plan && !plan ? ' is-off' : ''}`}>
            <span className="cw-cal__label">
              <i style={{ background: r.color }} aria-hidden="true" />
              {r.label}
            </span>
            {r.items.map((it, k) => (
              <button
                key={it.label}
                type="button"
                className={`cw-cal__bar${it.to - it.from >= 1 ? ' is-wide' : ''}`}
                style={{
                  ['--f' as any]: it.from,
                  ['--t' as any]: it.to + 1,
                  ['--d' as any]: `${k * 90}ms`,
                  background: r.color,
                  color: r.ink ?? '#fff',
                }}
                tabIndex={r.plan && !plan ? -1 : 0}
                onClick={() => setMonth(it.from)}
                title={it.label}
              >
                <span className="cw-cal__bar-long">{it.label}</span>
                <span className="cw-cal__bar-short" aria-hidden="true">{it.short ?? it.label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="cw-cal__detail" aria-live="polite">
        <span className="cw-cal__detail-month">{FULL[month - 1]}</span>
        {happening.length ? (
          <ul>
            {happening.map((h) => (
              <li key={h.row + h.label}>
                <i style={{ background: h.color }} aria-hidden="true" />
                <span className="cw-cal__detail-row">{h.row}</span> {h.label}
              </li>
            ))}
          </ul>
        ) : (
          <p>{quietLabel}</p>
        )}
      </div>
    </div>
  );
}
