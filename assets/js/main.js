// Page loader
const loader = document.getElementById('page-loader');
if (loader) {
  const loaderImg = loader.querySelector('img');
  loaderImg.addEventListener('animationend', () => {
    loader.classList.add('fade-out');

    loader.addEventListener('animationend', () => loader.remove(), { once: true });
  }, { once: true });
}

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
    const newW = canvas.offsetWidth;
    const newH = canvas.offsetHeight;
    if(newW === W && newH === H) return;
    W = canvas.width = newW;
    H = canvas.height = newH;
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
if (track) {
  const dots = document.querySelectorAll('.testi-dot');
  const prev = document.getElementById('tPrev');
  const next = document.getElementById('tNext');
  const total = track.children.length;
  let cur = 0;

  function getOffset(n) {
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return n * (wrap.offsetWidth + gap);
  }

  function goTo(n) {
    cur = n;
    track.style.transform = `translateX(-${getOffset(n)}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === cur));
    prev.disabled = cur === 0;
    next.disabled = cur === total - 1;
  }

  prev.addEventListener('click', () => goTo(cur - 1));
  next.addEventListener('click', () => goTo(cur + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  let autoplay = setInterval(() => {
    goTo(cur === total - 1 ? 0 : cur + 1);
  }, 6000);

  [prev, next, ...dots].forEach(el => {
    el.addEventListener('click', () => {
      clearInterval(autoplay);
      autoplay = setInterval(() => goTo(cur === total - 1 ? 0 : cur + 1), 6000);
    });
  });

  // Drag & swipe
  const wrap = track.parentElement;
  let startX = 0, dragOffset = 0, isDragging = false;
  const THRESHOLD = 50;

  wrap.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.clientX;
    dragOffset = 0;
    wrap.classList.add('dragging');
    track.style.transition = 'none';
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    dragOffset = e.clientX - startX;
    track.style.transform = `translateX(${-getOffset(cur) + dragOffset}px)`;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    wrap.classList.remove('dragging');
    track.style.transition = '';
    if (dragOffset < -THRESHOLD && cur < total - 1) goTo(cur + 1);
    else if (dragOffset > THRESHOLD && cur > 0) goTo(cur - 1);
    else goTo(cur);
  });

  wrap.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    dragOffset = 0;
    track.style.transition = 'none';
  }, { passive: true });

  wrap.addEventListener('touchmove', e => {
    dragOffset = e.touches[0].clientX - startX;
    track.style.transform = `translateX(${-getOffset(cur) + dragOffset}px)`;
  }, { passive: true });

  wrap.addEventListener('touchend', () => {
    track.style.transition = '';
    if (dragOffset < -THRESHOLD && cur < total - 1) goTo(cur + 1);
    else if (dragOffset > THRESHOLD && cur > 0) goTo(cur - 1);
    else goTo(cur);
  });
}

// Hamburger menu
const hamburger = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('navMobileMenu');

if (hamburger && mobileMenu) {
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
}

// Floating navbar on scroll
const navEl = document.querySelector('nav');
if (navEl) {
  window.addEventListener('scroll', () => {
    navEl.classList.toggle('floating', window.scrollY > 60);
  }, { passive: true });
}

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
let hasScrolled = false;
window.addEventListener('scroll', () => { hasScrolled = true; }, { once: true, passive: true });
const navObs = new IntersectionObserver(entries => {
  if (!hasScrolled) return;
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${e.target.id}` ? 'var(--text)' : '';
      });
    } else {
      navLinks.forEach(a => {
        if (a.getAttribute('href') === `#${e.target.id}`) a.style.color = '';
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => navObs.observe(s));

// Booking widget
(function(){
  const calDays = document.getElementById('calDays');
  if(!calDays) return;

  const calMonthLabel = document.getElementById('calMonthLabel');
  const calPrev = document.getElementById('calPrev');
  const calNext = document.getElementById('calNext');
  const bookingPlaceholder = document.getElementById('bookingPlaceholder');
  const bookingSlotsWrap = document.getElementById('bookingSlots');
  const slotsList = document.getElementById('slotsList');
  const slotsDateLabel = document.getElementById('slotsDateLabel');
  const bookingFormWrap = document.getElementById('bookingFormWrap');
  const formDateTimeLabel = document.getElementById('formDateTimeLabel');
  const hiddenDateTime = document.getElementById('hiddenDateTime');
  const backToSlots = document.getElementById('backToSlots');
  const bookingForm = document.getElementById('bookingForm');
  const bookingConfirm = document.getElementById('bookingConfirm');

  const SLOTS = ['09:00','10:00','11:00','13:00','14:00','15:00','16:00'];
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  function getTodayAms(){
    const parts = new Intl.DateTimeFormat('en-CA', {timeZone:'Europe/Amsterdam', year:'numeric', month:'2-digit', day:'2-digit'}).formatToParts(new Date());
    return new Date(+parts.find(p=>p.type==='year').value, +parts.find(p=>p.type==='month').value-1, +parts.find(p=>p.type==='day').value);
  }

  function slotUTC(date, slot){
    const [sh,sm]=slot.split(':').map(Number);
    const y=date.getFullYear(), mo=String(date.getMonth()+1).padStart(2,'0'), d=String(date.getDate()).padStart(2,'0');
    const probe=new Date(`${y}-${mo}-${d}T${String(sh).padStart(2,'0')}:${String(sm).padStart(2,'0')}:00Z`);
    const p=new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Amsterdam',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(probe);
    const offsetMs=((sh*60+sm)-(+p.find(x=>x.type==='hour').value*60+ +p.find(x=>x.type==='minute').value))*60000;
    return new Date(probe.getTime()+offsetMs);
  }

  function tooSoon(date, slot){ return slotUTC(date,slot).getTime() - Date.now() < 12*60*60*1000; }
  function dateKey(date){ return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(); }
  function hasOpen(date){ return SLOTS.some(s=>!tooSoon(date,s)); }

  function dateStr(date){
    const dd=String(date.getDate()).padStart(2,'0');
    const mm=String(date.getMonth()+1).padStart(2,'0');
    return `${dd}-${mm}-${date.getFullYear()}`;
  }

  async function fetchBookedSlots(date){
    const snap=await firebase.firestore().collection('bookings')
      .where('date','==',dateStr(date))
      .get();
    const booked=new Set();
    snap.forEach(doc=>booked.add(doc.data().time));
    return booked;
  }

  let today = getTodayAms();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();
  let selectedDate = null;
  let pendingSlot = null;

  function getMaxDate(){
    const m=new Date(today);
    m.setDate(m.getDate()+14);
    return m;
  }

  function renderCalendar(){
    today = getTodayAms();
    const maxDate = getMaxDate();
    calMonthLabel.textContent = MONTHS[viewMonth]+' '+viewYear;
    calDays.innerHTML = '';
    calPrev.disabled = viewYear===today.getFullYear() && viewMonth===today.getMonth();
    calNext.disabled = new Date(viewYear, viewMonth+1, 1) > maxDate;
    const startDow = (new Date(viewYear, viewMonth, 1).getDay()+6)%7;
    const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();
    for(let i=0; i<startDow; i++){
      const el=document.createElement('button'); el.className='cal-day cal-empty'; calDays.appendChild(el);
    }
    for(let d=1; d<=daysInMonth; d++){
      const btn=document.createElement('button');
      btn.className='cal-day';
      btn.textContent=d;
      const date=new Date(viewYear, viewMonth, d);
      const dow=date.getDay();
      const isPast=date<today;
      const isWeekend=dow===0||dow===6;
      const isTooFar=date>maxDate;
      const noSlots=!isPast&&!isWeekend&&!isTooFar&&!hasOpen(date);
      if(isPast||isWeekend||isTooFar||noSlots) btn.classList.add('cal-disabled');
      if(date.getTime()===today.getTime()) btn.classList.add('cal-today');
      if(selectedDate&&date.getTime()===selectedDate.getTime()) btn.classList.add('cal-selected');
      if(!isPast&&!isWeekend&&!isTooFar&&!noSlots) btn.addEventListener('click',()=>selectDate(date));
      calDays.appendChild(btn);
    }
  }

  async function selectDate(date){
    selectedDate=date; pendingSlot=null;
    renderCalendar();
    bookingPlaceholder.classList.add('hidden');
    bookingFormWrap.classList.add('hidden');
    bookingConfirm.classList.add('hidden');
    bookingSlotsWrap.classList.remove('hidden');
    slotsDateLabel.textContent=DAY_NAMES[date.getDay()]+' '+date.getDate()+' '+MONTHS[date.getMonth()];
    slotsList.innerHTML='<p class="text" style="font-size:0.875rem;grid-column:1/-1">Loading...</p>';
    let bookedSlots=new Set();
    try{ bookedSlots=await fetchBookedSlots(date); }catch(err){ console.error(err); }
    slotsList.innerHTML='';
    SLOTS.forEach(slot=>{
      if(bookedSlots.has(slot)||tooSoon(date,slot)) return;
      const btn=document.createElement('button');
      btn.className='slot-btn';
      btn.textContent=slot;
      btn.addEventListener('click',()=>{
        pendingSlot=slot;
        bookingSlotsWrap.classList.add('hidden');
        bookingFormWrap.classList.remove('hidden');
        const label=DAY_NAMES[date.getDay()]+' '+date.getDate()+' '+MONTHS[date.getMonth()]+' at '+slot;
        formDateTimeLabel.textContent=label;
        hiddenDateTime.value=label;
      });
      slotsList.appendChild(btn);
    });
  }

  function autoSelectFirst(){
    const maxDate=getMaxDate();
    const d=new Date(today);
    while(d<=maxDate){
      const dow=d.getDay();
      if(dow!==0&&dow!==6&&hasOpen(d)){ selectDate(new Date(d)); return; }
      d.setDate(d.getDate()+1);
    }
  }

  calPrev.addEventListener('click',()=>{ if(viewMonth===0){viewMonth=11;viewYear--;}else viewMonth--; renderCalendar(); });
  calNext.addEventListener('click',()=>{ if(viewMonth===11){viewMonth=0;viewYear++;}else viewMonth++; renderCalendar(); });
  backToSlots.addEventListener('click',()=>{ bookingFormWrap.classList.add('hidden'); bookingSlotsWrap.classList.remove('hidden'); });

  bookingForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const data=new FormData(bookingForm);
    const submitBtn=bookingForm.querySelector('[type="submit"]');
    submitBtn.disabled=true;
    try{
      const db=firebase.firestore();
      await db.collection('bookings').add({
        name: data.get('Name'),
        email: data.get('Email'),
        message: data.get('Message')||'',
        booked_on: firebase.firestore.FieldValue.serverTimestamp(),
        booked_for: firebase.firestore.Timestamp.fromDate(slotUTC(selectedDate, pendingSlot)),
        date: dateStr(selectedDate),
        time: pendingSlot
      });
      bookingFormWrap.classList.add('hidden');
      bookingConfirm.classList.remove('hidden');
    } catch(err){
      console.error(err);
      alert('Er is iets misgegaan. Probeer het opnieuw.');
      submitBtn.disabled=false;
    }
  });

  renderCalendar();
  autoSelectFirst();
})();
