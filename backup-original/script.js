(function () {
  const cfg = window.SITE_CONFIG || {};

  const whatsappUrl = `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(cfg.whatsappMessage || '')}`;

  document.querySelectorAll('[data-whatsapp]').forEach((el) => {
    el.setAttribute('href', whatsappUrl);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  document.querySelectorAll('[data-instagram]').forEach((el) => {
    el.setAttribute('href', cfg.instagram || '#');
  });

  document.querySelectorAll('[data-phone-display]').forEach((el) => {
    el.textContent = cfg.phoneDisplay || '';
  });

  document.querySelectorAll('[data-followers]').forEach((el) => {
    el.textContent = cfg.followers || '';
  });

  document.querySelectorAll('[data-posts]').forEach((el) => {
    el.textContent = cfg.posts || '';
  });

  document.querySelectorAll('[data-years]').forEach((el) => {
    el.textContent = cfg.years || '';
  });

  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Reveal-on-scroll. Checks actual position on every scroll tick instead of
  // relying on IntersectionObserver, which can miss elements entirely when
  // the user scrolls in one big jump (fast flick, "End" key, scrollbar drag) —
  // that left whole sections stuck at opacity:0 during testing.
  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
  if (revealEls.length) {
    let ticking = false;
    const checkReveal = () => {
      ticking = false;
      const vh = window.innerHeight;
      revealEls.forEach((el) => {
        if (el.classList.contains('is-visible')) return;
        if (el.getBoundingClientRect().top < vh * 0.95) {
          el.classList.add('is-visible');
        }
      });
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(checkReveal);
      }
    };
    checkReveal();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    // Safety net in case something above misses an element for any reason.
    setTimeout(() => revealEls.forEach((el) => el.classList.add('is-visible')), 2500);
  }

  // Floating WhatsApp button — shown after scrolling past the hero
  const fab = document.querySelector('.fab-whatsapp');
  const heroEl = document.querySelector('.hero');
  if (fab && heroEl) {
    const toggleFab = () => {
      const heroBottom = heroEl.getBoundingClientRect().bottom;
      fab.classList.toggle('is-visible', heroBottom < 0);
    };
    toggleFab();
    window.addEventListener('scroll', toggleFab, { passive: true });
  }
})();
