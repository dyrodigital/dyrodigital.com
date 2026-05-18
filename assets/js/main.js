// Hero particle network
(function(){
  const canvas = document.getElementById('heroCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const COUNT = 60;
  const MAX_DIST = 140;
  const COLOR = '255,105,1';
  let particles = [];
  let W, H;

  function resize(){
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function rand(min, max){ return Math.random()*(max-min)+min; }

  function init(){
    resize();
    particles = Array.from({length:COUNT}, () => ({
      x: rand(0, W), y: rand(0, H),
      vx: rand(-0.4, 0.4), vy: rand(-0.4, 0.4),
      r: rand(1.5, 2.8)
    }));
  }

  function draw(){
    ctx.clearRect(0, 0, W, H);
    for(let i=0; i<particles.length; i++){
      const p = particles[i];

      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > W) p.vx *= -1;
      if(p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${COLOR},0.45)`;
      ctx.fill();

      for(let j=i+1; j<particles.length; j++){
        const q = particles[j];
        const dx = p.x-q.x, dy = p.y-q.y;
        const d = Math.sqrt(dx*dx+dy*dy);
        if(d < MAX_DIST){
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${COLOR},${(1 - d/MAX_DIST) * 0.18})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  init();
  draw();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 150);
  });
})();

// Stats count-up animation
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    statsObs.unobserve(entry.target);
    const vals = entry.target.querySelectorAll('.stat-val');
    vals.forEach((el, i) => {
      setTimeout(() => {
        const target = +el.dataset.target;
        const format = el.dataset.format || '';
        const duration = 1200;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(ease * target) + format;
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target + format;
        }
        requestAnimationFrame(tick);
      }, i * 120);
    });
  });
}, { threshold: 0.3 });
const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) statsObs.observe(statsGrid);

// Fade-in on scroll
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const answer = item.querySelector('.faq-a');
    const inner = item.querySelector('.faq-a-inner');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-a').style.maxHeight = '0';
    });

    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = inner.scrollHeight + 'px';
    }
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

// Hamburger menu
const hamburger = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('navMobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('open');
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = isOpen ? '' : 'hidden';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Floating navbar on scroll
const navEl = document.querySelector('nav');
window.addEventListener('scroll', () => {
  navEl.classList.toggle('floating', window.scrollY > 60);
}, { passive: true });

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
