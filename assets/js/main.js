// Fade-in on scroll
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// Testimonial carousel
const track = document.getElementById('tTrack');
const dots = document.querySelectorAll('.testi-dot');
const prev = document.getElementById('tPrev');
const next = document.getElementById('tNext');
const total = track.children.length;
let cur = 0;

function goTo(n) {
  cur = n;
  track.style.transform = `translateX(-${cur * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === cur));
  prev.disabled = cur === 0;
  next.disabled = cur === total - 1;
}

prev.addEventListener('click', () => goTo(cur - 1));
next.addEventListener('click', () => goTo(cur + 1));
dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

// Auto-advance testimonials every 6s
let autoplay = setInterval(() => {
  goTo(cur === total - 1 ? 0 : cur + 1);
}, 6000);

[prev, next, ...dots].forEach(el => {
  el.addEventListener('click', () => {
    clearInterval(autoplay);
    autoplay = setInterval(() => goTo(cur === total - 1 ? 0 : cur + 1), 6000);
  });
});

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${e.target.id}` ? 'var(--text)' : '';
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => navObs.observe(s));
