/* ============================================================
   ambient.js — Cursor · Sounds · Scroll Reveals · Film Grain
   Józsa Dávid personal site
   ============================================================ */

(function () {
  'use strict';

  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  /* ══════════════════════════════════════════════════════════
     CUSTOM CURSOR
     Two-part: a sharp dot (direct) + a soft ring (lerped)
     mix-blend-mode: difference → works on both dark & light pages
  ══════════════════════════════════════════════════════════ */
  if (!isTouch) {
    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.className  = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    let mx = -100, my = -100;
    let rx = -100, ry = -100;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      // Dot follows instantly
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    // Ring follows with lerp
    let raf;
    function animateRing() {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover state
    function bindHover(el) {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('is-hover');
        ring.classList.add('is-hover');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('is-hover');
        ring.classList.remove('is-hover');
      });
    }

    // Bind all interactive elements
    const INTERACTIVE = 'a, button, [role="button"], input, textarea, .portal, .photo-cell, .cgi-cell, .vol-entry, .service, .stat';
    document.querySelectorAll(INTERACTIVE).forEach(bindHover);

    // Re-bind after dynamic content (optional future use)
    window.__bindCursorHover = bindHover;

    // Click
    document.addEventListener('mousedown', () => {
      dot.classList.add('is-click');
      ring.classList.add('is-click');
    });
    document.addEventListener('mouseup', () => {
      dot.classList.remove('is-click');
      ring.classList.remove('is-click');
    });

    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    });
  }

  /* ══════════════════════════════════════════════════════════
     SOUND SYSTEM
     Procedural tones via Web Audio API.
     No samples, no files — all synthesized.
     AudioContext is created lazily after first interaction.
  ══════════════════════════════════════════════════════════ */
  let audioCtx = null;
  let soundEnabled = true;

  function getAudio() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        soundEnabled = false;
      }
    }
    return audioCtx;
  }

  function playTone({ freq = 440, endFreq, duration = 0.04, type = 'sine', vol = 0.06, delay = 0 } = {}) {
    if (!soundEnabled) return;
    try {
      const ctx  = getAudio();
      if (!ctx) return;

      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();

      // Soft bandpass to remove harsh edges
      const filter = ctx.createBiquadFilter();
      filter.type            = 'lowpass';
      filter.frequency.value = 4000;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      const t = ctx.currentTime + delay;
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      if (endFreq) {
        osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration);
      }

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.start(t);
      osc.stop(t + duration + 0.01);
    } catch (e) {}
  }

  // Hover: very high, very short — barely a whisper
  function playHover() {
    playTone({ freq: 2200, endFreq: 1400, duration: 0.022, type: 'sine', vol: 0.025 });
  }

  // Click: a soft wooden knock
  function playClick() {
    playTone({ freq: 380, endFreq: 180, duration: 0.055, type: 'sine', vol: 0.08 });
    playTone({ freq: 760, endFreq: 360, duration: 0.03,  type: 'sine', vol: 0.035, delay: 0.005 });
  }

  // Portal enter: low, resonant — a door opening
  function playPortalEnter() {
    playTone({ freq: 180, endFreq: 140, duration: 0.12, type: 'sine', vol: 0.06 });
    playTone({ freq: 360, endFreq: 280, duration: 0.08, type: 'sine', vol: 0.025, delay: 0.02 });
  }

  // Expose for HTML-level use if needed
  window.snd = { hover: playHover, click: playClick, portal: playPortalEnter };

  // Wire all interactive elements
  if (!isTouch) {
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', playHover);
      el.addEventListener('mousedown',  playClick);
    });

    // Portal hover: different sound
    document.querySelectorAll('.portal').forEach(el => {
      el.addEventListener('mouseenter', playPortalEnter);
    });
  }

  /* ══════════════════════════════════════════════════════════
     SCROLL REVEALS
     Add data-reveal to any element to animate it in.
     data-reveal="up"    → slides + fades from below (default)
     data-reveal="left"  → slides from left
     data-reveal="scale" → scales up slightly
     data-reveal-delay="200" → delay in ms
  ══════════════════════════════════════════════════════════ */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el    = entry.target;
          const delay = el.dataset.revealDelay || 0;
          setTimeout(() => el.classList.add('is-revealed'), +delay);
          revealObs.unobserve(el);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach(el => revealObs.observe(el));
  }

  /* ══════════════════════════════════════════════════════════
     FILM GRAIN OVERLAY
     Procedural noise texture rendered to a Canvas,
     tiled as a fixed overlay — adds depth to flat dark BGs.
     Only applied on dark/black theme pages.
  ══════════════════════════════════════════════════════════ */
  const isLightPage = document.body.classList.contains('theme-nolka');

  if (!isLightPage) {
    const SIZE  = 256;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = SIZE;
    const ctx2 = canvas.getContext('2d');
    const img  = ctx2.createImageData(SIZE, SIZE);

    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255 | 0;
      img.data[i]     = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = Math.random() * 14 + 3 | 0; // 3–17 alpha
    }
    ctx2.putImageData(img, 0, 0);

    const grain      = document.createElement('div');
    grain.className  = 'film-grain';
    grain.style.backgroundImage = `url(${canvas.toDataURL()})`;
    document.body.appendChild(grain);
  }

  /* ══════════════════════════════════════════════════════════
     NAV SCROLL STATE (shared utility — removes duplication)
  ══════════════════════════════════════════════════════════ */
  const nav = document.getElementById('site-nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Mobile menu toggle */
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

})();
