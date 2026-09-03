/**
 * Click-to-play YouTube embeds. A [data-yt-play="<video id>"] button swaps
 * its thumbnail for a playing iframe on click, instead of navigating away.
 */
export function ytInlinePlay(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-yt-play]');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.ytPlay;
      const media = btn.querySelector<HTMLElement>('.ld-video__media, .ws-video__media, .fw-video__media');
      if (!id || !media) return;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      iframe.title = btn.querySelector('.ld-video__title, .ws-video__title, .fw-video__title')?.textContent || 'YouTube video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';
      media.replaceChildren(iframe);
      btn.disabled = false;
    }, { once: true });
  });
}
