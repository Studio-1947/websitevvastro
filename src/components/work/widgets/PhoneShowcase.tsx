/**
 * A phone that walks through a product's screens. Each screen has a tab
 * (title + one line) whose bar fills while that screen is up; the phone moves
 * on by itself while it is on screen, and pauses on hover, focus, a tap, or
 * for reduced motion. On touch the phone can be swiped.
 */
import { useEffect, useRef, useState } from 'react';
import './PhoneShowcase.css';

interface Screen {
  src: string;
  alt: string;
  title: string;
  body: string;
}
interface Props {
  screens: Screen[];
  /** Milliseconds each screen stays up. */
  interval?: number;
}

export default function PhoneShowcase({ screens, interval = 5200 }: Props) {
  const [index, setIndex] = useState(0);
  const [hold, setHold] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const n = screens.length;
  const running = inView && !hold && !reduced;

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % n), interval);
    return () => window.clearTimeout(t);
  }, [running, index, interval, n]);

  const go = (i: number) => setIndex(((i % n) + n) % n);

  return (
    <div
      className="cw-phone"
      ref={root}
      style={{ ['--dur' as any]: `${interval}ms` }}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setHold(false)}
    >
      <div className="cw-phone__stage">
        <span className="cw-phone__glow" aria-hidden="true" />
        <div
          className="cw-phone__device"
          onPointerDown={(e) => (startX.current = e.clientX)}
          onPointerUp={(e) => {
            if (startX.current === null) return;
            const dx = e.clientX - startX.current;
            startX.current = null;
            if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
          }}
        >
          <span className="cw-phone__island" aria-hidden="true" />
          <div className="cw-phone__screen">
            <span className="cw-phone__status" aria-hidden="true">
              <b>9:41</b>
              <i />
            </span>
            <div className="cw-phone__view">
            {screens.map((s, i) => (
              <img
                key={s.src}
                src={s.src}
                alt={i === index ? s.alt : ''}
                aria-hidden={i !== index}
                className={i === index ? 'is-on' : i === (index - 1 + n) % n ? 'is-prev' : ''}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            ))}
            </div>
          </div>
        </div>
        <div className="cw-phone__arrows">
          <button type="button" aria-label="Previous screen" onClick={() => go(index - 1)}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <button type="button" aria-label="Next screen" onClick={() => go(index + 1)}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>

      <ol className="cw-phone__tabs">
        {screens.map((s, i) => (
          <li key={s.src}>
            <button
              type="button"
              className={i === index ? 'is-on' : ''}
              aria-current={i === index ? 'step' : undefined}
              onClick={() => go(i)}
            >
              <span className="cw-phone__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="cw-phone__title">{s.title}</span>
              <span className="cw-phone__body"><span>{s.body}</span></span>
              <span className="cw-phone__bar" aria-hidden="true">
                {/* Restarts with the timer, so the bar and the move stay in step. */}
                {i === index && <i key={`${index}-${running}`} className={running ? '' : 'is-held'} />}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
