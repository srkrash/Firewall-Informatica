/* ============================================================
   FIREWALL INFORMÁTICA — script.js
   Particles | Scroll Animations | Counter | Terminal | Navbar
   ============================================================ */

'use strict';

// ─── YEAR ───────────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ─── NAVBAR SCROLL BEHAVIOR ──────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ─── HAMBURGER MENU ──────────────────────────────────────────
const hamburger = document.getElementById('nav-hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ─── INTERSECTION OBSERVER — SCROLL ANIMATIONS ───────────────
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -48px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const delay = parseInt(el.dataset.delay || 0);

    setTimeout(() => {
      el.classList.add('in-view');
      observer.unobserve(el);
    }, delay);
  });
}, observerOptions);

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

// ─── COUNTER ANIMATION ───────────────────────────────────────
const counters = document.querySelectorAll('.stat-value[data-count]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el       = entry.target;
    const target   = parseInt(el.dataset.count);
    const duration = 1600;
    const start    = performance.now();

    const animate = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(animate);
      else el.textContent = target;
    };

    requestAnimationFrame(animate);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// ─── PROGRESS BAR ────────────────────────────────────────────
const progressBar = document.getElementById('progress-bar');
const progressPct = document.getElementById('progress-pct');

const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const target = parseInt(progressBar.dataset.target);

    // Animate number
    const duration = 1800;
    const start    = performance.now();
    const animNum  = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.floor(eased * target);
      progressPct.textContent = current + '%';
      if (progress < 1) requestAnimationFrame(animNum);
      else progressPct.textContent = target + '%';
    };
    requestAnimationFrame(animNum);

    // Animate bar
    setTimeout(() => { progressBar.style.width = target + '%'; }, 100);
    progressObserver.unobserve(entry.target);
  });
}, { threshold: 0.4 });

if (progressBar) progressObserver.observe(progressBar);

// ─── TERMINAL TYPING ANIMATION ───────────────────────────────
(function initTerminal() {
  const cmdEl   = document.querySelector('.cmd[data-text]');
  const cursor  = document.getElementById('terminal-cursor');
  if (!cmdEl) return;

  const outputs = [
    document.getElementById('t-output-1'),
    document.getElementById('t-output-2'),
    document.getElementById('t-output-3'),
    document.getElementById('t-output-4'),
    document.getElementById('t-output-5'),
  ].filter(Boolean);

  const text = cmdEl.dataset.text;
  let charIndex = 0;

  const started = { value: false };

  const terminalObserver = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting || started.value) return;
    started.value = true;

    // Type command
    const typeInterval = setInterval(() => {
      if (charIndex < text.length) {
        cmdEl.textContent += text[charIndex++];
      } else {
        clearInterval(typeInterval);
        // Show outputs sequentially
        outputs.forEach((out, i) => {
          setTimeout(() => {
            out.classList.remove('hidden');
            // Force reflow, then add visible
            requestAnimationFrame(() => {
              requestAnimationFrame(() => out.classList.add('visible'));
            });
          }, 400 + i * 600);
        });

        // Move cursor after last output
        const lastDelay = 400 + (outputs.length - 1) * 600 + 800;
        setTimeout(() => {
          if (cursor) {
            cursor.style.display = 'none';
          }
        }, lastDelay);
      }
    }, 55);
  }, { threshold: 0.3 });

  const terminalEl = document.querySelector('.terminal-window');
  if (terminalEl) terminalObserver.observe(terminalEl);
})();

// ─── PARTICLE CANVAS ─────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', () => { resize(); buildParticles(); }, { passive: true });

  // ─ Particle Class ─
  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x    = Math.random() * W;
      this.y    = initial ? Math.random() * H : H + 10;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = -(Math.random() * 0.4 + 0.1);
      this.opacity = Math.random() * 0.5 + 0.1;
      this.fadeDir = Math.random() > 0.5 ? 1 : -1;
      this.fadeSpeed = Math.random() * 0.003 + 0.001;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity += this.fadeSpeed * this.fadeDir;

      if (this.opacity >= 0.6) { this.fadeDir = -1; }
      if (this.opacity <= 0.05) { this.fadeDir = 1; }
      if (this.y < -10) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      ctx.restore();
    }
  }

  // ─ Build ─
  function buildParticles() {
    const count = Math.min(Math.floor((W * H) / 14000), 90);
    particles = Array.from({ length: count }, () => new Particle());
  }

  buildParticles();

  // ─ Connection lines ─
  function drawConnections() {
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.12;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth   = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  // ─ Loop ─
  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }

  loop();
})();

// ─── SMOOTH ACTIVE NAV LINK ───────────────────────────────────
(function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link:not(.nav-link--cta)');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      links.forEach(link => {
        const href = link.getAttribute('href');
        link.style.color = (href === `#${id}`)
          ? 'var(--clr-text)'
          : '';
      });
    });
  }, { threshold: 0.4, rootMargin: '-60px 0px -40% 0px' });

  sections.forEach(s => sectionObserver.observe(s));
})();

// ─── RIPPLE EFFECT ON BUTTONS ────────────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect   = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size   = Math.max(rect.width, rect.height) * 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top:  ${e.clientY - rect.top  - size / 2}px;
      border-radius: 50%;
      background: rgba(255,255,255,0.18);
      transform: scale(0);
      animation: ripple-anim 0.55s ease-out forwards;
      pointer-events: none;
    `;

    if (!document.getElementById('ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = `
        @keyframes ripple-anim {
          to { transform: scale(1); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});
