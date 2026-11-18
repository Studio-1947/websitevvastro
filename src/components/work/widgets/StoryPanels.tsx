/**
 * Expanding photo panels: one chapter open at a time. On a wide screen the
 * panels sit side by side and the open one widens (hover or tap); on a phone
 * they stack and the open one grows taller.
 */
import { useId, useState } from 'react';
import './StoryPanels.css';

interface Item {
  kicker?: string;
  title: string;
  body: string;
  src: string;
  alt: string;
}
interface Props {
  items: Item[];
}

export default function StoryPanels({ items }: Props) {
  const [active, setActive] = useState(0);
  const id = useId();
  const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (min-width: 768px)').matches;

  return (
    <div className="cw-story">
      {items.map((it, i) => {
        const open = i === active;
        return (
          <article
            key={it.title}
            className={`cw-story__panel${open ? ' is-open' : ''}`}
            onMouseEnter={() => canHover() && setActive(i)}
          >
            <img src={it.src} alt={it.alt} loading="lazy" decoding="async" />
            <span className="cw-story__shade" aria-hidden="true" />
            <h3 className="cw-story__head">
              <button
                type="button"
                className="cw-story__trigger"
                aria-expanded={open}
                aria-controls={`${id}-${i}`}
                onClick={() => setActive(i)}
              >
                <span className="cw-story__num">{it.kicker ?? String(i + 1).padStart(2, '0')}</span>
                <span className="cw-story__title">{it.title}</span>
                <span className="cw-story__plus" aria-hidden="true" />
              </button>
            </h3>
            <div className="cw-story__body" id={`${id}-${i}`} aria-hidden={!open}>
              <p>{it.body}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
