// ===================== NAVBAR =====================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 60 ? '0 4px 30px rgba(255,0,25,0.18)' : 'none';
});
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  navToggle.classList.toggle('active');
});
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// ===================== ACTIVE NAV ON SCROLL =====================
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id'); });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
});

// ===================== TECH TABS =====================
document.addEventListener('DOMContentLoaded', function () {
  const techTabs = document.querySelectorAll('.tech-tab');
  const techPanels = document.querySelectorAll('.tech-logos-wrap');

  techTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      // Remove active from all tabs
      techTabs.forEach(function (t) {
        t.classList.remove('active');
      });
      // Hide all panels
      techPanels.forEach(function (p) {
        p.classList.remove('active');
      });
      // Activate clicked tab
      tab.classList.add('active');
      // Show matching panel
      const target = tab.getAttribute('data-tab');
      const panel = document.querySelector('.tech-logos-wrap[data-tab="' + target + '"]');
      if (panel) {
        panel.classList.add('active');
      }
    });
  });

  const serviceCards = document.querySelectorAll('.bservice-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => c.classList.remove('featured'));
      card.classList.add('featured');
    });
  });
});



// ===================== SCROLL REVEAL =====================
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// ===================== COUNTER ANIMATION =====================
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix');
  const steps = 60;
  const increment = Math.ceil(target / steps);
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current + suffix;
  }, 2000 / steps);
}
window.addEventListener('load', () => {
  const counterEls = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animateCounter(entry.target); counterObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  counterEls.forEach(el => counterObserver.observe(el));
});

// ===================== MODAL =====================
const bookCallModal = document.getElementById('bookCallModal');
const modalClose = document.getElementById('modalClose');
if (modalClose) modalClose.addEventListener('click', () => { bookCallModal.classList.remove('active'); document.body.style.overflow = ''; });
if (bookCallModal) bookCallModal.addEventListener('click', e => { if (e.target === bookCallModal) { bookCallModal.classList.remove('active'); document.body.style.overflow = ''; } });

// ===================== CONTACT FORM (EmailJS) =====================
window.addEventListener('load', () => {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const requirement = document.getElementById('requirement');
    const pageUrl = document.getElementById('gamedevpageUrl');
    const submitBtn = document.querySelector('.fcf-submit-btn');
    if (pageUrl) pageUrl.value = window.location.href;
    [fullName, email, phone, requirement].forEach(i => i.style.borderColor = '#ddd');
    let isValid = true;
    if (fullName.value.trim().length < 3) { isValid = false; fullName.style.borderColor = 'red'; }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) { email.style.borderColor = 'red'; alert('Please enter a valid email address.'); return; }
    const phonePattern = /^(\+|0)?[\d\s\-()]{7,20}$/;
    if (!phonePattern.test(phone.value.trim())) { isValid = false; phone.style.borderColor = 'red'; } else { phone.style.borderColor = ''; }
    if (requirement.value.trim().length < 10) { isValid = false; requirement.style.borderColor = 'red'; }
    if (!isValid) { alert('Please fill all required fields correctly.'); return; }
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Book A Free Consultation';
    const templateParams = { name: fullName.value.trim(), email: email.value.trim(), phone: phone.value.trim(), message: requirement.value.trim(), page_url: pageUrl ? pageUrl.value : window.location.href, time: new Date().toLocaleString() };
    try {
      const response = await emailjs.send('service_h38sdpk', 'template_lbjyykk', templateParams);
      if (response.status === 200) {
        document.getElementById('contactForm').reset();
        setTimeout(() => { window.location.href = 'https://sdlccorp.com/thank-you/'; }, 100);
      } else { throw new Error('Email failed'); }
    } catch (error) {
      console.error(error);
      alert('Unable to send message. Please try again later.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Book A Free Consultation';
    }
  });
});

// ===================== PAGE SHOW =====================
window.addEventListener('pageshow', function (e) {
  if (e.persisted) window.location.reload();
});

// ===================== BOOK FORM VALIDATION =====================
function validateAndSubmitBookForm() {
  const fields = [
    { id: 'bookFullName', check: v => v.trim().length >= 3, msg: 'Full name must be at least 3 characters.' },
    { id: 'bookEmail', check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Please enter a valid email address.' },
    { id: 'bookPhone', check: v => /^[+\d\s\-()]{7,15}$/.test(v.trim()), msg: 'Please enter a valid phone number.' },
    { id: 'bookCompany', check: v => v.trim().length >= 2, msg: 'Please enter your company or studio name.' },
    { id: 'bookProjectType', check: v => v !== '', msg: 'Please select a project type.' },
    { id: 'bookBudget', check: v => v !== '', msg: 'Please select a budget range.' },
    { id: 'bookMessage', check: v => v.trim().length >= 20, msg: 'Please describe your project (min 20 characters).' }
  ];
  let isValid = true;
  fields.forEach(({ id, check, msg }) => {
    const el = document.getElementById(id);
    const errEl = document.getElementById('err-' + id);
    if (!check(el.value)) { el.style.borderColor = '#ff4d4d'; errEl.textContent = msg; isValid = false; }
    else { el.style.borderColor = ''; errEl.textContent = ''; }
    el.addEventListener('input', () => { if (check(el.value)) { el.style.borderColor = ''; errEl.textContent = ''; } });
  });
  if (!isValid) return;
  window.location.href = 'https://sdlccorp.com/thank-you/';
}

// ===================== CONSULT FORM VALIDATION =====================
function validateAndSubmitConsult() {
  const fields = [
    { id: 'consultName', check: v => v.trim().length >= 3, msg: 'Full name must be at least 3 characters.' },
    { id: 'consultEmail', check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Please enter a valid email address.' },
    { id: 'consultPhone', check: v => /^[+\d\s\-()]{7,15}$/.test(v.trim()), msg: 'Please enter a valid phone number.' },
    { id: 'consultRequirement', check: v => v.trim().length >= 10, msg: 'Please describe your requirements (min 10 characters).' }
  ];
  let isValid = true;
  fields.forEach(({ id, check, msg }) => {
    const el = document.getElementById(id);
    const errEl = document.getElementById('err-' + id);
    if (!check(el.value)) { el.style.borderColor = 'red'; errEl.textContent = msg; isValid = false; }
    else { el.style.borderColor = ''; errEl.textContent = ''; }
    el.addEventListener('input', () => { if (check(el.value)) { el.style.borderColor = ''; errEl.textContent = ''; } });
  });
  if (!isValid) return;
  document.getElementById('consultForm').reset();
  window.location.href = 'https://sdlccorp.com/thank-you/';
}

// Portfolio responsive switcher
// ===================== PORTFOLIO VIEW SWITCHER =====================
function handlePortfolioView() {
  const desktopGrid = document.querySelector('.bportfolio-grid.desktop-only');
  const mobileScroll = document.querySelector('.bportfolio-scroll.mobile-only');
  if (!desktopGrid || !mobileScroll) return;

  if (window.innerWidth <= 900) {
    desktopGrid.style.display = 'none';
    mobileScroll.style.display = 'flex';   // ← was incorrectly 'grid' before
  } else {
    desktopGrid.style.display = 'flex';   // ← was 'grid', now 'flex'
    mobileScroll.style.display = 'none';
  }
}
handlePortfolioView();
window.addEventListener('resize', handlePortfolioView);

// ===================== PORTFOLIO CONTINUOUS SCROLL =====================
(function () {
  const desktopGrid = document.querySelector('.bportfolio-grid');
  const mobileScroll = document.querySelector('.bportfolio-scroll');
  const dots = document.querySelectorAll('.bportfolio-dot');

  let isPaused = false;
  let rafId = null;
  const SPEED = 1.6; // px per frame

  // ── Use innerWidth — most reliable for mobile ─────────────
  function getScroller() {
    return window.innerWidth <= 900 ? mobileScroll : desktopGrid;
  }

  function setActiveDot(index) {
    dots.forEach(d => d.classList.remove('active'));
    if (dots[index]) dots[index].classList.add('active');
  }

  function syncDot(scroller) {
    const items = Array.from(scroller.querySelectorAll('.bportfolio-item'));
    const rect = scroller.getBoundingClientRect();
    let closestIndex = 0, closestDist = Infinity;
    items.forEach((item, i) => {
      const dist = Math.abs(item.getBoundingClientRect().left - rect.left);
      if (dist < closestDist) { closestDist = dist; closestIndex = i; }
    });
    setActiveDot(closestIndex);
  }

  // ── Continuous RAF loop ───────────────────────────────────
  function autoScroll() {
    const scroller = getScroller();
    if (scroller && !isPaused) {
      if (scroller.scrollLeft >= scroller.scrollWidth - scroller.clientWidth - 1) {
        scroller.scrollLeft = 0;
      } else {
        scroller.scrollLeft += SPEED;
      }
      syncDot(scroller);
    }
    rafId = requestAnimationFrame(autoScroll);
  }

  function pause() { isPaused = true; }
  function resume() { isPaused = false; }

  function attachPause(el) {
    if (!el) return;
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', () => setTimeout(resume, 2000), { passive: true });
  }

  // ── Dot click ────────────────────────────────────────────
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const scroller = getScroller();
      const items = Array.from(scroller.querySelectorAll('.bportfolio-item'));
      const index = parseInt(dot.dataset.index);
      if (!items[index]) return;
      isPaused = true;
      const rect = scroller.getBoundingClientRect();
      scroller.scrollTo({
        left: scroller.scrollLeft + (items[index].getBoundingClientRect().left - rect.left),
        behavior: 'smooth'
      });
      setActiveDot(index);
      setTimeout(resume, 3000);
    });
  });

  // ── Reset on resize ───────────────────────────────────────
  window.addEventListener('resize', () => {
    const scroller = getScroller();
    if (scroller) scroller.scrollLeft = 0;
  });

  attachPause(desktopGrid);
  attachPause(mobileScroll);

  window.addEventListener('load', () => {
    setTimeout(() => { rafId = requestAnimationFrame(autoScroll); }, 1000);
  });

})();


