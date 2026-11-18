/**
 * A shelf of product packs. Filter chips narrow the shelf by type; each pack
 * flips over to its tasting notes and brewing card, and the cup on the back
 * fills with that tea's liquor colour. On phones the shelf becomes a
 * swipeable rail of cards.
 */
import { useState } from 'react';
import './FlipShelf.css';

interface Tea {
  slug: string;
  name: string;
  type: string;
  src: string;
  alt: string;
  blurb?: string;
  notes?: string[];
  temp?: string;
  time?: string;
  steeps?: string;
  leaf?: string;
  /** Colour of the brewed cup. */
  liquor?: string;
  soon?: boolean;
}
interface Props {
  items: Tea[];
  allLabel?: string;
  hint?: string;
  soonLabel?: string;
}

export default function FlipShelf({ items, allLabel = 'All', hint = 'Tap a pack to turn it over', soonLabel = 'Coming soon' }: Props) {
  const types = [allLabel, ...Array.from(new Set(items.map((t) => t.type)))];
  const [filter, setFilter] = useState(allLabel);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const shown = items.filter((t) => filter === allLabel || t.type === filter);

  const toggle = (slug: string) => setFlipped((f) => ({ ...f, [slug]: !f[slug] }));

  return (
    <div className="cw-shelf">
      <div className="cw-shelf__bar">
        <div className="cw-shelf__chips" role="group" aria-label="Filter by type">
          {types.map((t) => (
            <button key={t} type="button" aria-pressed={filter === t} onClick={() => setFilter(t)}>
              {t}
              <span>{t === allLabel ? items.length : items.filter((i) => i.type === t).length}</span>
            </button>
          ))}
        </div>
        <p className="cw-shelf__hint">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" />
            <path d="M18 3v4h-4M6 21v-4h4" />
          </svg>
          {hint}
        </p>
      </div>

      <ul className="cw-shelf__grid" key={filter}>
        {shown.map((t, i) => {
          const on = !!flipped[t.slug];
          return (
            <li key={t.slug} className="cw-tea" style={{ ['--i' as any]: i }}>
              <div className={`cw-tea__card${on ? ' is-flipped' : ''}`}>
                <div className="cw-tea__face cw-tea__front" aria-hidden={on}>
                  <img src={t.src} alt={t.alt} loading="lazy" decoding="async" />
                  {t.soon && <span className="cw-tea__badge">{soonLabel}</span>}
                  <div className="cw-tea__foot">
                    <span className="cw-tea__type">{t.type}</span>
                    <span className="cw-tea__name">{t.name}</span>
                  </div>
                </div>

                <div className="cw-tea__face cw-tea__back" aria-hidden={!on} style={{ ['--liquor' as any]: t.liquor ?? '#c8913a' }}>
                  <span className="cw-tea__type">{t.type}</span>
                  <span className="cw-tea__name">{t.name}</span>
                  {t.blurb && <p className="cw-tea__blurb">{t.blurb}</p>}
                  {t.notes && (
                    <ul className="cw-tea__notes" aria-label="Tasting notes">
                      {t.notes.map((n) => <li key={n}>{n}</li>)}
                    </ul>
                  )}
                  <dl className="cw-tea__brew">
                    {t.temp && (<div><dt>Water</dt><dd>{t.temp.split(' / ')[0]}</dd></div>)}
                    {t.time && (<div><dt>Steep</dt><dd>{t.time.replace(' minutes', ' min')}</dd></div>)}
                    {t.leaf && (<div><dt>Leaf</dt><dd>{t.leaf.replace(' per 8 oz', '')}</dd></div>)}
                    {t.steeps && (<div><dt>Steeps</dt><dd>{t.steeps}</dd></div>)}
                  </dl>
                  <svg className="cw-tea__cup" viewBox="0 0 64 64" aria-hidden="true">
                    <defs>
                      <clipPath id={`cup-${t.slug}`}>
                        <path d="M12 24h34l-3 26a6 6 0 0 1-6 5H21a6 6 0 0 1-6-5z" />
                      </clipPath>
                    </defs>
                    <g clipPath={`url(#cup-${t.slug})`}>
                      <rect className="cw-tea__liquor" x="8" y="22" width="44" height="36" />
                    </g>
                    <path d="M12 24h34l-3 26a6 6 0 0 1-6 5H21a6 6 0 0 1-6-5z" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M46 30h4a5 5 0 0 1 0 10h-5" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path className="cw-tea__steam" d="M22 18c-3-4 3-6 0-10M30 18c-3-4 3-6 0-10M38 18c-3-4 3-6 0-10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>

                <button
                  type="button"
                  className="cw-tea__flip"
                  aria-pressed={on}
                  aria-label={on ? `${t.name}: show the pack` : `${t.name}: show tasting notes and brewing guide`}
                  onClick={() => toggle(t.slug)}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
