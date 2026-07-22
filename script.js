/**
 * DO EAT RESTAURANT — script.js
 * Manchester, UK · Premium Restaurant Website
 * Vanilla JS · No dependencies beyond CDN libs
 */

'use strict';

/* ═══════════════════════════════════════════════
   1. LOADER
   ═══════════════════════════════════════════════ */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2000);
  });

  // Prevent scroll while loading
  document.body.style.overflow = 'hidden';
})();

/* ═══════════════════════════════════════════════
   2. SCROLL PROGRESS BAR
   ═══════════════════════════════════════════════ */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop    = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width    = (scrollTop / scrollHeight * 100) + '%';
  }, { passive: true });
})();

/* ═══════════════════════════════════════════════
   3. NAVBAR — scroll behaviour + active link
   ═══════════════════════════════════════════════ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const toggle    = document.getElementById('navToggle');
  const menu      = document.getElementById('navMenu');
  const navLinks  = document.querySelectorAll('.nav-link');

  if (!navbar) return;

  // Scroll: add .scrolled class
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveLink();
    updateBackToTop();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile toggle
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle && toggle.classList.remove('open');
      toggle && toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Active link on scroll
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id], div[id="home"]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
})();

/* ═══════════════════════════════════════════════
   4. BACK TO TOP
   ═══════════════════════════════════════════════ */
function updateBackToTop() {
  const btn = document.getElementById('backToTop');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);
}

(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ═══════════════════════════════════════════════
   5. DARK / LIGHT MODE
   ═══════════════════════════════════════════════ */
(function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const body = document.body;

  const saved = localStorage.getItem('doeat-theme') || 'light';
  applyTheme(saved);

  btn && btn.addEventListener('click', () => {
    const next = body.classList.contains('light-mode') ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('doeat-theme', next);
  });

  function applyTheme(mode) {
    body.classList.toggle('light-mode', mode === 'light');
    if (icon) {
      icon.classList.toggle('fa-moon', mode === 'light');
      icon.classList.toggle('fa-sun',  mode === 'dark');
    }
  }
})();

/* ═══════════════════════════════════════════════
   6. RIPPLE EFFECT
   ═══════════════════════════════════════════════ */
(function initRipple() {
  document.querySelectorAll('.ripple').forEach(el => {
    el.addEventListener('click', function(e) {
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const wave   = document.createElement('span');
      wave.className = 'ripple-wave';
      wave.style.cssText = `
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top  - size/2}px;
      `;
      this.appendChild(wave);
      wave.addEventListener('animationend', () => wave.remove());
    });
  });
})();

/* ═══════════════════════════════════════════════
   7. COUNTER ANIMATION
   ═══════════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.target;
      const dur    = 1800;
      const step   = 16;
      const steps  = dur / step;
      const inc    = target / steps;
      let current  = 0;

      const timer = setInterval(() => {
        current += inc;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current);
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ═══════════════════════════════════════════════
   8. MENU — SEARCH & FILTER
   ═══════════════════════════════════════════════ */
(function initMenu() {
  const searchInput = document.getElementById('menuSearch');
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const allCards    = document.querySelectorAll('.menu-card');

  let activeFilter = 'all';
  let searchQuery  = '';

  function filterCards() {
    allCards.forEach((card, i) => {
      const cat  = card.dataset.category || '';
      const name = card.dataset.name     || '';
      const matchFilter = activeFilter === 'all' || cat === activeFilter;
      const matchSearch = name.includes(searchQuery) || cat.includes(searchQuery);

      if (matchFilter && matchSearch) {
        card.classList.remove('hidden');
        card.style.animationDelay = (i * 0.04) + 's';
        card.style.animation = 'none';
        void card.offsetWidth; // trigger reflow
        card.style.animation = '';
      } else {
        card.classList.add('hidden');
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      activeFilter = btn.dataset.filter;
      filterCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.toLowerCase().trim();
      filterCards();
    });
  }
})();

/* ═══════════════════════════════════════════════
   9. GALLERY LIGHTBOX
   ═══════════════════════════════════════════════ */
(function initGallery() {
  const lightbox  = document.getElementById('lightbox');
  const closeBtn  = document.getElementById('lightboxClose');
  const imgWrap   = document.getElementById('lightboxImg');
  const caption   = document.getElementById('lightboxCaption');
  const items     = document.querySelectorAll('.gallery-item');

  if (!lightbox) return;

  function openLightbox(item) {
    const placeholder = item.querySelector('.gallery-placeholder');
    const overlay     = item.querySelector('.gallery-overlay span');
    const text        = overlay ? overlay.textContent : 'Image';

    // Clone the placeholder content into lightbox
    if (imgWrap && placeholder) {
      imgWrap.innerHTML = '';
      const clone = placeholder.cloneNode(true);
      clone.style.cssText = 'min-width:300px;min-height:220px;width:100%;border-radius:12px;font-size:1rem;';
      clone.querySelector('i') && (clone.querySelector('i').style.fontSize = '5rem');
      imgWrap.appendChild(clone);
    }
    if (caption) caption.textContent = text;
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  items.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(item); }
    });
  });

  closeBtn && closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
})();

/* ═══════════════════════════════════════════════
   10. CONTACT FORM VALIDATION
   ═══════════════════════════════════════════════ */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  const rules = {
    contactName:    { required: true, minLen: 2,  msg: 'Please enter your full name (min 2 characters).' },
    contactEmail:   { required: true, email: true, msg: 'Please enter a valid email address.' },
    contactMessage: { required: true, minLen: 10, msg: 'Please enter a message (min 10 characters).' },
  };

  function showError(id, msg) {
    const errEl = document.getElementById(id + 'Error');
    if (errEl) errEl.textContent = msg;
    const input = document.getElementById(id);
    if (input) input.closest('.input-wrap').style.borderColor = '#e74c3c';
  }

  function clearError(id) {
    const errEl = document.getElementById(id + 'Error');
    if (errEl) errEl.textContent = '';
    const input = document.getElementById(id);
    if (input) input.closest('.input-wrap').style.borderColor = '';
  }

  function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function validate() {
    let valid = true;

    Object.entries(rules).forEach(([id, rule]) => {
      const el  = document.getElementById(id);
      const val = el ? el.value.trim() : '';

      clearError(id);

      if (rule.required && !val) { showError(id, rule.msg); valid = false; return; }
      if (rule.email && !validateEmail(val)) { showError(id, rule.msg); valid = false; return; }
      if (rule.minLen && val.length < rule.minLen) { showError(id, rule.msg); valid = false; }
    });

    return valid;
  }

  // Live validation
  Object.keys(rules).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('blur', () => validate());
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;

    // Simulate submit success (no backend)
    const btn = form.querySelector('.submit-btn');
    if (btn) {
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled  = true;
    }

    setTimeout(() => {
      form.style.display   = 'none';
      success.removeAttribute('hidden');
    }, 1200);
  });
})();

/* ═══════════════════════════════════════════════
   11. FOOTER YEAR
   ═══════════════════════════════════════════════ */
(function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ═══════════════════════════════════════════════
   12. AOS INIT
   ═══════════════════════════════════════════════ */
(function initAOS() {
  if (typeof AOS === 'undefined') return;
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
    delay: 0,
  });
})();

/* ═══════════════════════════════════════════════
   13. SWIPER — REVIEWS
   ═══════════════════════════════════════════════ */
(function initSwiper() {
  if (typeof Swiper === 'undefined') return;
  new Swiper('.reviews-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    keyboard:   { enabled: true },
    a11y: { enabled: true },
    breakpoints: {
      640:  { slidesPerView: 1 },
      900:  { slidesPerView: 2 },
      1200: { slidesPerView: 3 },
    },
  });
})();

/* ═══════════════════════════════════════════════
   14. GSAP HERO ANIMATIONS
   ═══════════════════════════════════════════════ */
(function initGSAP() {
  if (typeof gsap === 'undefined') return;

  // Register ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero entrance timeline
  const tl = gsap.timeline({ delay: 2.2 });
  tl.from('.hero-badge',   { y: -30, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' })
    .from('.title-line-1', { y: 30,  opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2')
    .from('.title-line-2', { y: 30,  opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
    .from('.title-do',     { y: 50,  opacity: 0, duration: 0.7, ease: 'power3.out', scale: 0.9 }, '-=0.3')
    .from('.hero-sub',     { y: 20,  opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2')
    .from('.hero-actions > *', { y: 20, opacity: 0, duration: 0.4, ease: 'power3.out', stagger: 0.15 }, '-=0.2')
    .from('.hero-info',    { y: 15,  opacity: 0, duration: 0.4, ease: 'power3.out' }, '-=0.1')
    .from('.parallax-shape', { scale: 0, opacity: 0, duration: 1.2, ease: 'power3.out', stagger: 0.2 }, '-=0.8');

  // Parallax on mouse move
  document.addEventListener('mousemove', e => {
    const xPos = (e.clientX / window.innerWidth  - 0.5) * 40;
    const yPos = (e.clientY / window.innerHeight - 0.5) * 30;
    gsap.to('.parallax-shape', {
      x: xPos, y: yPos,
      duration: 1.5,
      ease: 'power2.out',
      stagger: 0.08,
    });
    gsap.to('.food-float', {
      x: xPos * 0.3, y: yPos * 0.3,
      duration: 2,
      ease: 'power2.out',
      stagger: 0.05,
    });
  });

  // Scroll-triggered section animations
  if (typeof ScrollTrigger !== 'undefined') {
    // Stats numbers pulse
    ScrollTrigger.create({
      trigger: '.stats-row',
      start: 'top 80%',
      onEnter: () => {
        gsap.from('.stat-item', {
          y: 30, opacity: 0, duration: 0.6,
          ease: 'power3.out', stagger: 0.1,
        });
      },
    });

    // Menu cards stagger
    ScrollTrigger.create({
      trigger: '#menuGrid',
      start: 'top 80%',
      onEnter: () => {
        gsap.from('#menuGrid .menu-card', {
          y: 40, opacity: 0, duration: 0.5,
          ease: 'power3.out', stagger: 0.08,
        });
      },
    });

    // Why us cards
    ScrollTrigger.create({
      trigger: '.whyus-grid',
      start: 'top 80%',
      onEnter: () => {
        gsap.from('.why-card', {
          y: 30, opacity: 0, duration: 0.5,
          ease: 'power3.out', stagger: 0.1,
        });
      },
    });

    // Specials
    ScrollTrigger.create({
      trigger: '.specials-grid',
      start: 'top 80%',
      onEnter: () => {
        gsap.from('.special-card', {
          y: 40, opacity: 0, scale: 0.95, duration: 0.6,
          ease: 'back.out(1.5)', stagger: 0.12,
        });
      },
    });
  }
})();

/* ═══════════════════════════════════════════════
   15. PARTICLES.JS
   ═══════════════════════════════════════════════ */
(function initParticles() {
  if (typeof particlesJS === 'undefined') return;

  particlesJS('particles-js', {
    particles: {
      number:  { value: 35, density: { enable: true, value_area: 900 } },
      color:   { value: ['#e8702a', '#d4a853', '#4caf76'] },
      shape:   { type: 'circle' },
      opacity: { value: 0.18, random: true, anim: { enable: true, speed: 0.5, opacity_min: 0.05 } },
      size:    { value: 3, random: true, anim: { enable: true, speed: 1, size_min: 0.5 } },
      line_linked: { enable: true, distance: 160, color: '#e8702a', opacity: 0.06, width: 1 },
      move: {
        enable: true, speed: 0.8, direction: 'none', random: true,
        straight: false, out_mode: 'out', bounce: false,
      },
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: false } },
      modes:  { repulse: { distance: 80, duration: 0.4 } },
    },
    retina_detect: true,
  });
})();

/* ═══════════════════════════════════════════════
   16. SMOOTH SCROLL for anchor links
   ═══════════════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const offset = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });
})();

/* ═══════════════════════════════════════════════
   17. LAZY LOADING for images
   ═══════════════════════════════════════════════ */
(function initLazyLoad() {
  if (!('IntersectionObserver' in window)) return;
  const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
  const imgObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        imgObserver.unobserve(img);
      }
    });
  });
  lazyImgs.forEach(img => imgObserver.observe(img));
})();

/* ═══════════════════════════════════════════════
   18. KEYBOARD NAVIGATION for gallery
   ═══════════════════════════════════════════════ */
(function initKeyboardNav() {
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  galleryItems.forEach((item, i) => {
    item.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' && galleryItems[i + 1]) galleryItems[i + 1].focus();
      if (e.key === 'ArrowLeft'  && galleryItems[i - 1]) galleryItems[i - 1].focus();
    });
  });
})();

/* ═══════════════════════════════════════════════
   19. ANNOUNCE BAR — pause on hover
   ═══════════════════════════════════════════════ */
(function initAnnouncebar() {
  const track = document.querySelector('.announce-track');
  if (!track) return;
  const bar   = track.closest('.announce-bar');
  if (!bar) return;
  bar.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  bar.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
})();

// Run initial scroll state in case page loads partway down
window.dispatchEvent(new Event('scroll'));
