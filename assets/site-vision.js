(function () {
  var header = document.querySelector('.site-header');
  var menuToggle = document.querySelector('.menu-toggle');
  var navLinks = document.querySelectorAll('.nav-links a');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function syncHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }

  function closeMenu() {
    if (!header || !menuToggle) return;
    header.classList.remove('menu-open');
    document.body.classList.remove('menu-locked');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', '打开导航');
  }

  if (menuToggle && header) {
    menuToggle.addEventListener('click', function () {
      var isOpen = header.classList.toggle('menu-open');
      document.body.classList.toggle('menu-locked', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? '关闭导航' : '打开导航');
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) closeMenu();
  });

  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();

  var revealItems = document.querySelectorAll('.reveal');
  if (!revealItems.length) return;

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  revealItems.forEach(function (item) { observer.observe(item); });
})();
