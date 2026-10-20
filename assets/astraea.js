document.documentElement.classList.add('js');

const header = document.querySelector('.site-header');
const hero = document.querySelector('.hero');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('#site-nav');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function setHeaderState() {
  if (!header || !hero) return;
  const threshold = Math.max(24, hero.offsetHeight - header.offsetHeight - 24);
  header.classList.toggle('is-scrolled', window.scrollY > threshold);
}

function closeNav() {
  if (!header || !navToggle) return;
  header.classList.remove('nav-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', '打开导航');
}

navToggle?.addEventListener('click', () => {
  const isOpen = header?.classList.toggle('nav-open') ?? false;
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? '关闭导航' : '打开导航');
});

siteNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeNav);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeNav();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 920) closeNav();
  setHeaderState();
});
window.addEventListener('scroll', setHeaderState, { passive: true });
setHeaderState();

const revealItems = document.querySelectorAll('.reveal');
if (reducedMotion.matches || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const dialog = document.querySelector('#contact-dialog');
const dialogTitle = document.querySelector('#contact-dialog-title');
const dialogLead = document.querySelector('#contact-dialog-lead');
const contactForm = document.querySelector('#contact-form');

function openContact(mode) {
  if (!dialog || !dialogTitle || !dialogLead) return;
  const isDemo = mode === 'demo';
  dialogTitle.textContent = isDemo ? '预约演示' : '联系我们';
  dialogLead.textContent = isDemo
    ? '告诉我们你的业务场景，我们会据此准备一次针对性的产品演示。'
    : '留下你的问题与联系方式，我们会从实际业务边界开始沟通。';
  dialog.dataset.state = 'form';
  contactForm?.reset();
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }
  dialog.querySelector('input')?.focus();
}

document.querySelectorAll('[data-contact]').forEach((trigger) => {
  trigger.addEventListener('click', () => openContact(trigger.dataset.contact));
});

document.querySelectorAll('[data-close]').forEach((trigger) => {
  trigger.addEventListener('click', () => dialog?.close());
});

dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!dialog) return;
  dialog.dataset.state = 'success';
  dialog.querySelector('.form-success')?.focus();
});

const year = document.querySelector('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());
