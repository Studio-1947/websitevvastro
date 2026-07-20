/**
 * Footer live Darjeeling conditions + current year. Ported from js/main.js.
 * Time is computed locally (Asia/Kolkata) so it works offline; temp & AQI come
 * from Open-Meteo (keyless, CORS) and each row reveals only on success.
 */
export function darjeelingLive(): void {
  const root = document.querySelector<HTMLElement>('[data-live]');
  if (!root) return;
  const LAT = 27.041,
    LON = 88.2663;

  const timeEl = root.querySelector<HTMLElement>('[data-live-time]');
  const timeWrap = root.querySelector<HTMLElement>('[data-live-time-wrap]');
  function tick(): void {
    try {
      const now = new Date();
      if (timeEl) {
        timeEl.textContent =
          new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).format(now) + ' IST';
        timeEl.setAttribute('datetime', now.toISOString());
      }
      root!.hidden = false;
      if (timeWrap) timeWrap.hidden = false;
    } catch {
      /* Intl/timeZone unsupported — leave the row hidden */
    }
  }
  tick();
  setInterval(tick, 30000);

  function show(el: HTMLElement | null, wrap: HTMLElement | null, text: string): void {
    if (!el) return;
    el.textContent = text;
    if (wrap) wrap.hidden = false;
  }

  if (!window.fetch) return;

  fetch(
    'https://api.open-meteo.com/v1/forecast?latitude=' +
      LAT +
      '&longitude=' +
      LON +
      '&current=temperature_2m&timezone=Asia%2FKolkata'
  )
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      const t = d && d.current && d.current.temperature_2m;
      if (typeof t === 'number') {
        show(
          root!.querySelector('[data-live-temp]'),
          root!.querySelector('[data-live-temp-wrap]'),
          Math.round(t) + '°C'
        );
      }
    })
    .catch(() => {});

  fetch(
    'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=' +
      LAT +
      '&longitude=' +
      LON +
      '&current=us_aqi&timezone=Asia%2FKolkata'
  )
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      const a = d && d.current && d.current.us_aqi;
      if (typeof a === 'number') {
        show(
          root!.querySelector('[data-live-aqi]'),
          root!.querySelector('[data-live-aqi-wrap]'),
          'AQI ' + Math.round(a)
        );
      }
    })
    .catch(() => {});
}

export function hydrateYear(): void {
  const y = document.querySelector('[data-year]');
  if (y) y.textContent = String(new Date().getFullYear());
}
