// Native scrolling keeps touch, trackpad and no-JavaScript navigation available.
(() => {
  const track = document.querySelector('.carousel-track');
  if (!track) return;
  const controls = document.querySelector('.carousel-controls');
  const previous = controls.querySelector('[data-carousel-prev]');
  const next = controls.querySelector('[data-carousel-next]');
  const status = controls.querySelector('.carousel-status');
  const slides = [...track.querySelectorAll('.featured-project')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const maxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);
  const positions = () => slides.map(slide => Math.min(maxScroll(), slide.offsetLeft - slides[0].offsetLeft));
  const moveTo = left => track.scrollTo({ left, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  const update = () => {
    const bounds = track.getBoundingClientRect();
    const visible = slides.map((slide, index) => ({ bounds: slide.getBoundingClientRect(), index }))
      .filter(slide => slide.bounds.right > bounds.left + 2 && slide.bounds.left < bounds.right - 2);
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= maxScroll() - 2;
    if (!visible.length) return;
    const first = visible[0].index + 1;
    const last = visible[visible.length - 1].index + 1;
    const text = `${first === last ? first : `${first}–${last}`} / ${slides.length}`;
    if (status.textContent !== text) status.textContent = text;
  };
  const move = direction => {
    const stops = positions();
    const target = direction > 0
      ? stops.find(left => left > track.scrollLeft + 2) ?? maxScroll()
      : stops.reverse().find(left => left < track.scrollLeft - 2) ?? 0;
    moveTo(target);
  };
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') moveTo(0);
    else if (event.key === 'End') moveTo(maxScroll());
    else move(event.key === 'ArrowRight' ? 1 : -1);
  });
  let frame;
  track.addEventListener('scroll', () => {
    if (frame) return;
    frame = requestAnimationFrame(() => { frame = null; update(); });
  }, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(track);
  else window.addEventListener('resize', update);
  controls.hidden = false;
  update();
})();
