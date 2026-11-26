// Animate a chapter once it enters view; no hidden content or scroll listeners.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const chapters = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('bio-reveal');
      chapters.unobserve(entry.target);
    }
  }, { threshold: 0.08 });
  document.querySelectorAll('.bio-chapter, .bio-leap-inner, .bio-infra-heading, .bio-beyond-intro, .bio-closing').forEach(chapter => chapters.observe(chapter));
}
