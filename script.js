// ---------- Scroll progress bar + header shadow + active link ----------
const progress = document.getElementById('scrollProgress');
const header = document.getElementById('siteHeader');
const toTop = document.getElementById('toTop');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = ['top','features','services','contact'].map(id => document.getElementById(id)).filter(Boolean);

function onScroll(){
  const h = document.documentElement;
  const scrollTop = h.scrollTop || document.body.scrollTop;
  const scrollHeight = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
  const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  progress.style.width = pct + '%';

  header.classList.toggle('scrolled', scrollTop > 12);
  toTop.classList.toggle('show', scrollTop > 500);

  let current = sections[0];
  sections.forEach(sec => {
    if (scrollTop >= sec.offsetTop - 140) current = sec;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current.id);
  });
}
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- Mobile menu toggle ----------
const burger = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');

burger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
});

// ---------- Mobile dropdown toggle ----------
const servicesDD = document.getElementById('servicesDD');
const ddToggle = servicesDD.querySelector('.dropdown-toggle');

ddToggle.addEventListener('click', (e) => {
  if (window.innerWidth <= 760) {
    e.preventDefault();
    const open = servicesDD.classList.toggle('dd-open');
    ddToggle.setAttribute('aria-expanded', open);
  }
});

document.querySelectorAll('#navMenu a:not(.dropdown-toggle)').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 760) {
      navMenu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
    }
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 760) {
    navMenu.classList.remove('open');
    burger.classList.remove('open');
    servicesDD.classList.remove('dd-open');
  }
});

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// ---------- Count-up numbers ----------
const counters = document.querySelectorAll('[data-count]');
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1200;
    const start = performance.now();
    function step(now){
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    countIO.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => countIO.observe(c));
