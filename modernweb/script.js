// ModernWeb template JS – dynamic rendering, UX polish, and theming

(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Basic analytics hook
  window.trackEvent = function (name, payload) {
    console.log("Event:", name, payload || {});
  };

  // Notification helper
  function notify(message, type = 'info', timeout = 4000) {
    const el = document.createElement('div');
    el.className = `notification notification-${type}`;
    el.textContent = message;
    document.body.appendChild(el);
    // force paint then show
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => { el.classList.remove('show'); el.addEventListener('transitionend', () => el.remove(), { once: true }); }, timeout);
  }

  // Theme + color presets
  const THEME_KEY = 'mw:theme';
  const COLOR_KEY = 'mw:color';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // Ensure Tailwind dark: styles apply as well
    document.documentElement.classList.toggle('dark', theme === 'dark');
    const toggles = [$('#theme-toggle i'), $('#theme-toggle-mobile i')].filter(Boolean);
    toggles.forEach(i => {
      i.classList.remove('fa-moon', 'fa-sun');
      i.classList.add(theme === 'dark' ? 'fa-sun' : 'fa-moon');
    });
  }

  function applyColorPreset(preset) {
    document.documentElement.setAttribute('data-color', preset);
    const selects = [$('#color-preset'), $('#color-preset-mobile')].filter(Boolean);
    selects.forEach(s => { if (s) s.value = preset; });
  }

  function initThemeControls() {
    const storedTheme = localStorage.getItem(THEME_KEY) || 'light';
    const storedColor = localStorage.getItem(COLOR_KEY) || 'blue';
    applyTheme(storedTheme);
    applyColorPreset(storedColor);
    const toggleBtns = [$('#theme-toggle'), $('#theme-toggle-mobile')].filter(Boolean);
    toggleBtns.forEach(btn => btn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
      trackEvent('theme_toggle', { theme: next });
    }));
    const selects = [$('#color-preset'), $('#color-preset-mobile')].filter(Boolean);
    selects.forEach(sel => sel.addEventListener('change', (e) => {
      applyColorPreset(e.target.value);
      localStorage.setItem(COLOR_KEY, e.target.value);
      trackEvent('color_preset', { preset: e.target.value });
    }));
  }

  // Smooth scroll + active section
  function initNavigation() {
    // mobile menu
    const btn = $('.mobile-menu-btn');
    const menu = $('.mobile-menu');
    if (btn && menu) {
      btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
        btn.querySelector('i')?.classList.toggle('fa-times');
        btn.querySelector('i')?.classList.toggle('fa-bars');
      });
      // close on link click
      $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
        menu.classList.add('hidden');
        btn.querySelector('i')?.classList.remove('fa-times');
        btn.querySelector('i')?.classList.add('fa-bars');
      }));
    }

    // smooth anchor scroll
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }));

    // scrolled navbar effect
    const navbar = $('.navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
    });

    // active nav link based on section
    const sections = ['#home', '#features', '#pricing', '#testimonials', '#contact'].map(id => $(id)).filter(Boolean);
    const navLinks = [...$$('.nav-link')];
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = `#${entry.target.id}`;
          navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
        }
      });
    }, { threshold: 0.55 });
    sections.forEach(s => io.observe(s));
  }

  // Intersection reveal
  function initReveals() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'));
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    // Card-level fades
    $$('.feature-card, .testimonial-card, .pricing-card').forEach(el => { el.classList.add('fade-in'); obs.observe(el); });
    // Section-level reveals
    $$('.reveal').forEach(el => { obs.observe(el); });
  }

  // Scroll-to-top
  function initScrollTop() {
    const btn = $('#scrollTop'); if (!btn) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) btn.classList.add('show'); else btn.classList.remove('show');
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // CTA ripple
  function initRipple() {
    $$('.btn-primary, .btn-secondary').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (btn.querySelector('.ripple')) btn.querySelector('.ripple').remove();
        const ripple = document.createElement('span'); ripple.className = 'ripple';
        const rect = btn.getBoundingClientRect();
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        btn.appendChild(ripple);
        trackEvent('cta_click', { text: btn.textContent?.trim() });
      });
    });
  }

  // Testimonials auto-slider (pause on hover)
  function initTestimonialsSlider() {
    const grid = $('#testimonials-grid');
    if (!grid) return;
    let idx = 0; let timer = null;
    function tick() {
      const cards = $$('.testimonial-card', grid);
      if (cards.length === 0) return;
      cards.forEach((c, i) => { c.style.opacity = i === idx ? '1' : '0.8'; c.style.transform = i === idx ? 'scale(1.02)' : 'scale(1)'; });
      idx = (idx + 1) % cards.length;
    }
    function start() { if (!timer) timer = setInterval(tick, 4500); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    grid.addEventListener('mouseenter', stop);
    grid.addEventListener('mouseleave', start);
    start();
  }

  // Render helpers
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function renderStars(rating = 5) {
    return new Array(5).fill(0).map((_, i) => `<i class=\"fa-star ${i < rating ? 'fa-solid text-accent' : 'fa-regular text-muted'}\"></i>`).join('');
  }

  function sanitizeIcon(icon) {
    // support fa-rocket, fa-mobile, etc. default to solid
    const base = icon.replace(/^fa[srl]-/, 'fa-');
    return `fa-solid ${base}`;
  }

  // Config loading (fetch with fallback to inline JSON)
  async function loadConfig() {
    // try network first unless file://
    if (location.protocol !== 'file:') {
      try {
        const res = await fetch('config.json', { cache: 'no-store' });
        if (res.ok) return await res.json();
        throw new Error(`HTTP ${res.status}`);
      } catch (err) {
        console.warn('Failed to fetch config.json, falling back to inline JSON', err);
      }
    }
    const inline = $('#config-inline');
    if (inline) {
      try { return JSON.parse(inline.textContent || '{}'); } catch (e) { console.warn('Inline config parse error', e); }
    }
    // last resort default
    return {
      brand: 'ModernWeb',
      tagline: 'Build Something Amazing Today',
      description: 'Create stunning websites with our modern, responsive template.',
      features: [], pricing: [], testimonials: []
    };
  }

  function render(data) {
    // Title & brand
    document.title = `${data.brand} — ${data.tagline}`;
    ['#brand-name', '#brand-name-footer', '#brand-name-copy'].forEach(id => { const n = $(id); if (n) n.textContent = data.brand; });
    $('#hero-title') && ($('#hero-title').innerHTML = `${data.tagline.replace('Amazing', '<span class=\"gradient-text\">Amazing</span>')}`);
    $('#hero-description') && ($('#hero-description').textContent = data.description);
    $('#year') && ($('#year').textContent = new Date().getFullYear());

    // Features
    const fWrap = $('#features-grid');
    if (fWrap) {
      fWrap.innerHTML = '';
      (data.features || []).forEach(f => {
        const card = el('div', 'feature-card');
        card.innerHTML = `
          <div class=\"flex items-start gap-3\">
            <div class=\"w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white text-lg\">
              <i class=\"${sanitizeIcon(f.icon || 'fa-circle-dot')}\"></i>
            </div>
            <div>
              <h3 class=\"font-semibold text-lg mb-1\">${f.title}</h3>
              <p class=\"text-sm text-muted\">${f.text}</p>
            </div>
          </div>`;
        fWrap.appendChild(card);
      });
    }

    // Pricing
    const pWrap = $('#pricing-grid');
    if (pWrap) {
      pWrap.innerHTML = '';
      (data.pricing || []).forEach(p => {
        const card = el('div', 'pricing-card relative');
        card.innerHTML = `
          ${p.popular ? '<span class=\"badge-popular\">Most Popular</span>' : ''}
          <div class=\"text-center\">
            <h3 class=\"text-2xl font-bold mb-2\">${p.plan}</h3>
            <div class=\"mb-5\"><span class=\"text-4xl font-extrabold\">$${p.price}</span><span class=\"text-muted\">/month</span></div>
            <ul class=\"text-left space-y-2 mb-6\">
              ${(p.features || []).map(x => `<li class=\"flex items-center\"><i class=\"fa-solid fa-check text-green-500 mr-2\"></i><span>${x}</span></li>`).join('')}
            </ul>
            <button class=\"btn-primary gradient-bg w-full\">Choose ${p.plan}</button>
          </div>`;
        pWrap.appendChild(card);
      });
    }

    // Testimonials
    const tWrap = $('#testimonials-grid');
    if (tWrap) {
      tWrap.innerHTML = '';
      (data.testimonials || []).forEach(t => {
        const initials = t.name?.split(' ').map(p => p[0]).join('').slice(0, 2) || 'U';
        const avatar = t.avatar ? `<img loading=\"lazy\" src=\"${t.avatar}\" alt=\"${t.name}\" class=\"w-12 h-12 rounded-full object-cover\"/>` : `<div class=\"w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold\">${initials}</div>`;
        const card = el('div', 'testimonial-card');
        card.innerHTML = `
          <div class=\"flex items-start gap-3\">
            ${avatar}
            <div>
              <div class=\"font-semibold\">${t.name}</div>
              <div class=\"text-xs text-muted mb-2\">${t.role || ''}</div>
              <div class=\"text-sm mb-2\">“${t.text}”</div>
              <div class=\"flex gap-1\">${renderStars(t.rating)}</div>
            </div>
          </div>`;
        tWrap.appendChild(card);
      });
    }

    // Re-init reveals for newly created cards
    initReveals();
    initTestimonialsSlider();
  }

  // Init
  document.addEventListener('DOMContentLoaded', async () => {
    initThemeControls();
    initNavigation();
    initScrollTop();
    initRipple();
    try {
      const cfg = await loadConfig();
      render(cfg);
    } catch (e) {
      console.error('Config load/render error', e);
      notify('Failed to load site content. Using defaults.', 'error');
    }
    // page loaded marker
    window.addEventListener('load', () => document.body.classList.add('loaded'));
  });
})();

// Contact form handler (minimal)
document.getElementById('contactForm')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('formStatus');
  status.textContent = 'Sending...';
  status.style.color = '#64748b';

  // Replace this with your own Formspree endpoint (free)
  const endpoint = 'https://formspree.io/f/your_form_id';

  const data = Object.fromEntries(new FormData(form).entries());
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });
    if(res.ok){
      status.textContent = '✅ Message sent successfully!';
      status.style.color = '#10b981';
      form.reset();
    } else {
      throw new Error('Request failed');
    }
  } catch(err){
    console.error(err);
    status.textContent = '❌ Something went wrong. Try again later.';
    status.style.color = '#ef4444';
  }
});
