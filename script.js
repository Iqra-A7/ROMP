/* ===========================
   LOADING SCREEN
   =========================== */
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;
  setTimeout(() => {
    loadingScreen.style.transition = 'opacity 0.6s ease';
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      document.body.style.overflow = '';
      triggerHeroAnimation();
    }, 600);
  }, 500);
});

/* ===========================
   HERO ENTRANCE (Motion One)
   FIX: guard opacity — elements are visible by default,
   JS sets initial opacity then animates in
   =========================== */
function triggerHeroAnimation() {
  if (typeof Motion === 'undefined') return;

  // FIX: use Motion.animate which handles initial state
  Motion.animate('#hero-badge',     { opacity: [0, 1], y: [16, 0] },  { duration: 0.55, delay: 0.05, easing: [0.4,0,0.2,1] });
  Motion.animate('#hero-heading',   { opacity: [0, 1], y: [36, 0] },  { duration: 0.65, delay: 0.18, easing: [0.4,0,0.2,1] });
  Motion.animate('#hero-sub',       { opacity: [0, 1], y: [24, 0] },  { duration: 0.60, delay: 0.32, easing: [0.4,0,0.2,1] });
  Motion.animate('#hero-cta',       { opacity: [0, 1], y: [18, 0] },  { duration: 0.55, delay: 0.46, easing: [0.4,0,0.2,1] });
  Motion.animate('#hero-card',      { opacity: [0, 1], x: [32, 0] },  { duration: 0.65, delay: 0.36, easing: [0.4,0,0.2,1] });
  Motion.animate('#hoodie-container',{ opacity: [0, 1], scale: [0.88, 1] }, { duration: 0.80, delay: 0.14, easing: [0.34,1.56,0.64,1] });
}

/* ===========================
   DOM REFERENCES
   =========================== */
const navbar        = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu    = document.getElementById('mobile-menu');
const mainHoodie    = document.getElementById('main-hoodie');
const hoodieContainer = document.getElementById('hoodie-container');

/* ===========================
   IMAGE PATHS — FIX: correct public/ paths
   =========================== */
const hoodieImages = {
  black: 'hoodie-black.png',
  gray:  'hoodie-gray.png',
  cream: 'hoodie-cream.png',
  chaos: 'hoodie-chaos.png',
};

/* ===========================
   NAVBAR SCROLL
   =========================== */
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const navbarInner = navbar?.querySelector('.navbar-glass');
  if (navbarInner) {
    navbarInner.classList.toggle('navbar-scrolled', scrollY > 60);
  }
  lastScrollY = scrollY;
}, { passive: true });

/* ===========================
   MOBILE MENU — FIX: update aria-expanded
   =========================== */
function toggleMobileMenu() {
  const isOpen = !mobileMenu.classList.contains('hidden');
  const hamburger = mobileMenuBtn.querySelector('.hamburger');

  mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');

  if (isOpen) {
    mobileMenu.style.opacity = '1';
    mobileMenu.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
    mobileMenu.style.opacity = '0';
    mobileMenu.style.transform = 'translateY(-8px)';
    setTimeout(() => {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('menu-open');
    }, 220);
    hamburger?.classList.remove('hamburger-open');
  } else {
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('menu-open');
    mobileMenu.style.opacity = '0';
    mobileMenu.style.transform = 'translateY(-8px)';
    requestAnimationFrame(() => {
      mobileMenu.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
      mobileMenu.style.opacity = '1';
      mobileMenu.style.transform = 'translateY(0)';
    });
    hamburger?.classList.add('hamburger-open');
  }
}

mobileMenuBtn?.addEventListener('click', toggleMobileMenu);

// Close on link click
mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('menu-open');
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    mobileMenuBtn?.querySelector('.hamburger')?.classList.remove('hamburger-open');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (navbar && !navbar.contains(e.target) && !mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('menu-open');
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    mobileMenuBtn?.querySelector('.hamburger')?.classList.remove('hamburger-open');
  }
});

// FIX: close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('menu-open');
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    mobileMenuBtn?.querySelector('.hamburger')?.classList.remove('hamburger-open');
    mobileMenuBtn?.focus();
  }
});

/* ===========================
   HOODIE MOUSE TILT (desktop only)
   =========================== */
function handleHoodieTilt(e) {
  if (!hoodieContainer || !mainHoodie) return;
  const rect = hoodieContainer.getBoundingClientRect();
  const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
  const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
  mainHoodie.style.transform = `perspective(900px) rotateX(${-dy * 7}deg) rotateY(${dx * 7}deg)`;
}
function resetHoodieTilt() {
  if (mainHoodie) {
    mainHoodie.style.transition = 'transform 0.5s ease';
    mainHoodie.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
    setTimeout(() => { mainHoodie.style.transition = ''; }, 500);
  }
}

if (window.matchMedia('(min-width: 1024px) and (hover: hover)').matches) {
  document.addEventListener('mousemove', handleHoodieTilt);
  hoodieContainer?.addEventListener('mouseleave', resetHoodieTilt);
}

/* ===========================
   SCROLL REVEAL
   IntersectionObserver + Motion One
   =========================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = parseFloat(el.dataset.delay || '0');

    if (typeof Motion !== 'undefined') {
      Motion.animate(el,
        { opacity: [0, 1], y: [28, 0] },
        { duration: 0.60, delay, easing: [0.4, 0, 0.2, 1] }
      );
    } else {
      setTimeout(() => el.classList.add('revealed'), delay * 1000);
    }
    revealObserver.unobserve(el);
  });
}, { threshold: 0.10, rootMargin: '0px 0px -50px 0px' });

// Stagger siblings
document.querySelectorAll('.stagger-group').forEach(group => {
  group.querySelectorAll('.reveal-element').forEach((el, i) => {
    el.dataset.delay = (i * 0.09).toFixed(2);
  });
});
document.querySelectorAll('.reveal-element').forEach(el => revealObserver.observe(el));

/* ===========================
   PRODUCT CARD TILT
   =========================== */
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(500px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateZ(6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(500px) rotateY(0) rotateX(0) translateZ(0)';
  });
});

/* ===========================
   CTA BUTTON MICRO-ANIMATIONS
   =========================== */
document.querySelectorAll('.btn-animate').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    if (typeof Motion !== 'undefined') Motion.animate(btn, { scale: [1, 1.03] }, { duration: 0.18 });
  });
  btn.addEventListener('mouseleave', () => {
    if (typeof Motion !== 'undefined') Motion.animate(btn, { scale: [1.03, 1] }, { duration: 0.18 });
  });
  btn.addEventListener('click', () => {
    if (typeof Motion !== 'undefined') Motion.animate(btn, { scale: [1, 0.95, 1] }, { duration: 0.28, easing: [0.34,1.56,0.64,1] });
  });
});

/* ===========================
   SMOOTH SCROLL
   =========================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = (navbar?.offsetHeight || 72) + 16;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    }
  });
});

/* ===========================
   STATS COUNTER
   =========================== */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const dur = 1800;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

/* ===========================
   CUSTOMIZATION FORM
   Formspree integration
   =========================== */
const customForm = document.getElementById('custom-form');

if (customForm) {
  customForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate required fields
    let valid = true;
    customForm.querySelectorAll('[required]').forEach(field => {
      const err = document.getElementById(field.id + '-error');
      const isEmpty = !field.value.trim();
      field.classList.toggle('invalid', isEmpty);
      if (err) err.classList.toggle('show', isEmpty);
      if (isEmpty) valid = false;
    });

    // Email format
    const emailEl = customForm.querySelector('[type="email"]');
    if (emailEl?.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      emailEl.classList.add('invalid');
      const err = document.getElementById(emailEl.id + '-error');
      if (err) { err.textContent = 'Please enter a valid email address.'; err.classList.add('show'); }
      valid = false;
    }

    if (!valid) {
      // FIX: shake the form on invalid submit
      if (typeof Motion !== 'undefined') {
        Motion.animate(customForm, { x: [-5, 5, -4, 4, -2, 2, 0] }, { duration: 0.45 });
      }
      customForm.querySelector('.invalid')?.focus();
      return;
    }

    const submitBtn = customForm.querySelector('.btn-submit');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      // ============================================================
      // FORMSPREE: Replace YOUR_FORM_ID with your form ID.
      // Get it at https://formspree.io — it looks like: xabcdefg
      // Full URL: https://formspree.io/f/xabcdefg
      // ============================================================
      const ENDPOINT = 'https://formspree.io/f/mzdqevyb';

      const res = await fetch(ENDPOINT, {
        method: 'POST',
        body: new FormData(customForm),
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        customForm.style.display = 'none';
        const success = document.getElementById('form-success');
        success.classList.add('show');
        if (typeof Motion !== 'undefined') {
          Motion.animate(success, { opacity: [0,1], y: [16,0], scale: [0.96,1] }, { duration: 0.45, easing: [0.34,1.56,0.64,1] });
        }
      } else {
        document.getElementById('form-error-msg')?.classList.add('show');
      }
    } catch {
      document.getElementById('form-error-msg')?.classList.add('show');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  // Clear errors on input
  customForm.querySelectorAll('.form-input').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('invalid');
      const err = document.getElementById(field.id + '-error');
      if (err) err.classList.remove('show');
      document.getElementById('form-error-msg')?.classList.remove('show');
    });
  });
}

/* ===========================
   NEWSLETTER
   =========================== */
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input[type="email"]');
    const btn   = newsletterForm.querySelector('button[type="submit"]');
    if (!input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      if (typeof Motion !== 'undefined') Motion.animate(input, { x: [-6, 6, -4, 4, 0] }, { duration: 0.38 });
      input.focus();
      return;
    }
    const orig = btn.innerHTML;
    btn.textContent = '✓ Subscribed!';
    btn.disabled = true;
    btn.style.background = '#22c55e';
    input.disabled = true;
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled = false;
      input.disabled = false;
      newsletterForm.reset();
      btn.style.background = '';
    }, 3500);
  });
}

/* ===========================
   ADD TO CART
   =========================== */
document.querySelectorAll('[aria-label^="Add"]').forEach(btn => {
  btn.addEventListener('click', function () {
    if (typeof Motion !== 'undefined') {
      Motion.animate(this, { scale: [1, 0.82, 1.15, 1] }, { duration: 0.4, easing: [0.34,1.56,0.64,1] });
    }
    // Update cart badge
    const badge = navbar?.querySelector('[aria-label*="Cart"] span');
    if (badge) {
      const count = parseInt(badge.textContent || '0', 10) + 1;
      badge.textContent = count;
      badge.closest('button')?.setAttribute('aria-label', `Cart, ${count} item${count !== 1 ? 's' : ''}`);
      if (typeof Motion !== 'undefined') Motion.animate(badge, { scale: [1, 1.5, 1] }, { duration: 0.3, easing: [0.34,1.56,0.64,1] });
    }
  });
});

/* ===========================
   CHATBOT WIDGET
   =========================== */
const chatbotBtn    = document.getElementById('chatbot-btn');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose  = document.getElementById('chatbot-close');
const chatbotSend   = document.getElementById('chatbot-send');
const chatbotInput  = document.getElementById('chatbot-input');
const chatbotMsgs   = document.getElementById('chatbot-messages');

let chatOpen = false;

// Demo replies — replace widget entirely once you connect Chatbase/Tidio/Crisp
const replies = [
  "Hey! 👋 I'm the ROMP style assistant. Ask me anything!",
  "Our hoodie runs true to size. For the oversized look, size up one.",
  "We ship worldwide! Standard: 3–7 days. Express: 1–2 days.",
  "We accept all major cards, PayPal, and Klarna (buy now, pay later).",
  "Custom text orders take 3–5 extra business days to craft.",
  "30-day hassle-free returns on all standard orders.",
  "Limited drops sell out fast — subscribe to the newsletter for first access!",
];
let replyIdx = 0;

function appendMsg(text, type) {
  const msg = document.createElement('div');
  msg.className = `chat-msg ${type}`;
  msg.textContent = text;
  chatbotMsgs.appendChild(msg);
  chatbotMsgs.scrollTop = chatbotMsgs.scrollHeight;
}

// Typing indicator
function showTyping() {
  const typing = document.createElement('div');
  typing.className = 'chat-msg bot typing-indicator';
  typing.id = 'typing-indicator';
  typing.textContent = '…';
  typing.style.opacity = '0.6';
  chatbotMsgs.appendChild(typing);
  chatbotMsgs.scrollTop = chatbotMsgs.scrollHeight;
  return typing;
}

chatbotBtn?.addEventListener('click', () => {
  chatOpen = !chatOpen;
  if (chatOpen) {
    chatbotWindow.classList.add('open');
    chatbotWindow.removeAttribute('style');
    if (chatbotMsgs.children.length === 0) {
      setTimeout(() => appendMsg("Hi! 👋 Welcome to ROMP. How can I help you today?", 'bot'), 350);
    }
    chatbotInput?.focus();
    chatbotBtn.setAttribute('aria-label', 'Close chat support');
  } else {
    chatbotWindow.classList.remove('open');
    setTimeout(() => { chatbotWindow.style.display = 'none'; chatbotWindow.classList.remove('open'); chatbotWindow.removeAttribute('style'); }, 250);
    chatbotBtn.setAttribute('aria-label', 'Open ROMP chat support');
  }
});

chatbotClose?.addEventListener('click', () => {
  chatOpen = false;
  chatbotWindow.classList.remove('open');
  chatbotBtn?.setAttribute('aria-label', 'Open ROMP chat support');
});

function sendChatMessage() {
  const text = chatbotInput?.value.trim();
  if (!text) return;
  appendMsg(text, 'user');
  chatbotInput.value = '';
  const typing = showTyping();
  setTimeout(() => {
    typing.remove();
    appendMsg(replies[replyIdx++ % replies.length], 'bot');
  }, 900);
}

chatbotSend?.addEventListener('click', sendChatMessage);
chatbotInput?.addEventListener('keydown', e => { if (e.key === 'Enter') sendChatMessage(); });

/* ===========================
   RESIZE HANDLER
   =========================== */
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768 && !mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('menu-open');
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    mobileMenuBtn?.querySelector('.hamburger')?.classList.remove('hamburger-open');
  }
}, { passive: true });

/* ===========================
   INIT
   =========================== */
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
  document.body.style.overflow = 'hidden'; // re-enabled after loading screen fades
});


