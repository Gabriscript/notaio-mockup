// Site chrome: mobile menu, nav dropdowns, mobile action bar.
// Everything here is progressive: without JS the nav is visible and <details> work natively.
(() => {
  const desktop = matchMedia('(min-width: 900px)');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  const groups = [...document.querySelectorAll('.nav-group')];
  const behind = [...document.querySelectorAll('main, .site-footer, .mobile-bar')];

  // Mobile menu: full-height panel, content behind it made inert while open.
  const menuOpen = () => toggle && toggle.getAttribute('aria-expanded') === 'true';
  function setMenu(open, returnFocus) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Chiudi' : 'Menu';
    nav.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('menu-open', open);
    behind.forEach((el) => { el.inert = open; });
    if (open) nav.querySelector('a, summary').focus();
    else if (returnFocus) toggle.focus();
  }
  if (toggle) toggle.addEventListener('click', () => setMenu(!menuOpen()));
  desktop.addEventListener('change', () => {
    setMenu(false);
    groups.forEach((g) => { g.open = false; });
  });

  // Desktop dropdowns: one open at a time; close on Esc, click outside, focus leaving.
  groups.forEach((g) => {
    g.addEventListener('toggle', () => {
      if (g.open && desktop.matches) groups.forEach((o) => { if (o !== g) o.open = false; });
    });
    g.addEventListener('focusout', (e) => {
      if (desktop.matches && !g.contains(e.relatedTarget)) g.open = false;
    });
  });
  document.addEventListener('click', (e) => {
    if (desktop.matches) groups.forEach((g) => { if (!g.contains(e.target)) g.open = false; });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = groups.find((g) => g.open);
    if (desktop.matches && open) {
      open.open = false;
      open.querySelector('summary').focus();
    } else if (menuOpen()) {
      setMenu(false, true);
    }
  });

  // Mobile bar steps aside while the page's own primary button is visible,
  // so a screen never shows two primary actions.
  const bar = document.querySelector('.mobile-bar');
  const primaries = document.querySelectorAll('main .btn-primary');
  if (bar && primaries.length && 'IntersectionObserver' in window) {
    const visible = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? visible.add(en.target) : visible.delete(en.target)));
      bar.classList.toggle('is-away', visible.size > 0);
    });
    primaries.forEach((p) => io.observe(p));
  }
})();
