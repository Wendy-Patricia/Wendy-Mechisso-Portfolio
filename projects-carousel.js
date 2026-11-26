// Native scrolling keeps touch, trackpad and no-JavaScript navigation available.
(() => {
  const track = document.querySelector('.carousel-track');
  if (!track) return;
  const controls = document.querySelector('.carousel-controls');
  const previous = controls.querySelector('[data-carousel-prev]');
  const next = controls.querySelector('[data-carousel-next]');
  const status = controls.querySelector('.carousel-status');
  const autoplay = controls.querySelector('[data-carousel-autoplay]');
  const pauseLabel = autoplay.querySelector('[data-carousel-pause]');
  const resumeLabel = autoplay.querySelector('[data-carousel-resume]');
  const section = track.closest('section');
  const slides = [...track.querySelectorAll('.featured-project')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  let hovering = false;
  let focused = false;
  let touching = false;
  let inView = !('IntersectionObserver' in window);
  let timer;
  const syncAutoplay = () => {
    clearTimeout(timer);
    pauseLabel.hidden = paused;
    resumeLabel.hidden = !paused;
    const running = !paused && !hovering && !focused && !touching && inView && !document.hidden && maxScroll() > 2;
    status.setAttribute('aria-live', running ? 'off' : 'polite');
    if (!running) return;
    timer = setTimeout(() => {
      if (track.scrollLeft >= maxScroll() - 2) moveTo(0);
      else move(1);
      syncAutoplay();
    }, 4500);
  };
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
  previous.addEventListener('click', () => { move(-1); syncAutoplay(); });
  next.addEventListener('click', () => { move(1); syncAutoplay(); });
  autoplay.addEventListener('click', () => { paused = !paused; syncAutoplay(); });
  track.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse') return;
    hovering = true;
    syncAutoplay();
  });
  track.addEventListener('pointerleave', () => { hovering = false; syncAutoplay(); });
  track.addEventListener('pointerdown', () => { touching = true; syncAutoplay(); });
  const releasePointer = () => { touching = false; syncAutoplay(); };
  window.addEventListener('pointerup', releasePointer);
  window.addEventListener('pointercancel', releasePointer);
  section.addEventListener('focusin', event => {
    focused = event.target !== autoplay;
    syncAutoplay();
  });
  section.addEventListener('focusout', event => {
    focused = section.contains(event.relatedTarget) && event.relatedTarget !== autoplay;
    syncAutoplay();
  });
  document.addEventListener('visibilitychange', syncAutoplay);
  reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; syncAutoplay(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.15;
      syncAutoplay();
    }, { threshold: 0.15 }).observe(track);
  }
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
    frame = requestAnimationFrame(() => { frame = null; update(); syncAutoplay(); });
  }, { passive: true });
  const resize = () => { update(); syncAutoplay(); };
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(track);
  else window.addEventListener('resize', resize);
  controls.hidden = false;
  update();
  syncAutoplay();
})();
