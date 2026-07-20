/** Duplicate each marquee track for a seamless loop. Ported from js/main.js. */
export function duplicateMarquees(): void {
  document.querySelectorAll('.marquee__track').forEach((track) => {
    track.innerHTML += track.innerHTML;
  });
}
