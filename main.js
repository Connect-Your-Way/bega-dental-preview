/* ============================================================
   Bega Dental — main.js
   Plain vanilla JS. No dependencies.
   ============================================================ */

'use strict';

/* ----------------------------------------------------------
   1. Nav: scroll shadow + mobile toggle
   ---------------------------------------------------------- */
(function initNav() {
  const nav      = document.getElementById('site-nav');
  const hamburger = nav.querySelector('.nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  // Scroll class
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    this.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ----------------------------------------------------------
   2. Hero carousel
   ---------------------------------------------------------- */
(function initHero() {
  const slides    = Array.from(document.querySelectorAll('.hero-slide'));
  const dots      = Array.from(document.querySelectorAll('.hero-dot'));
  const INTERVAL  = 5000;
  let current     = 0;
  let timer       = null;

  function goTo(index) {
    slides[current].classList.remove('active');
    slides[current].setAttribute('aria-hidden', 'true');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    slides[current].setAttribute('aria-hidden', 'false');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(function () {
      goTo(current + 1);
    }, INTERVAL);
  }

  // Dot clicks
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      goTo(i);
      startTimer();
    });
  });

  // Pause on hero hover / focus (accessibility + UX)
  const heroSection = document.getElementById('hero');
  heroSection.addEventListener('mouseenter', function () { clearInterval(timer); });
  heroSection.addEventListener('mouseleave', startTimer);
  heroSection.addEventListener('focusin',    function () { clearInterval(timer); });
  heroSection.addEventListener('focusout',   startTimer);

  // Respect prefers-reduced-motion
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    startTimer();
  }
})();

/* ----------------------------------------------------------
   3. Scroll reveal (IntersectionObserver)
   ---------------------------------------------------------- */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    // Fallback: show all immediately
    elements.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(function (el) { observer.observe(el); });
})();

/* ----------------------------------------------------------
   4. Smooth anchor scroll (with nav offset)
   ---------------------------------------------------------- */
(function initSmoothScroll() {
  const NAV_HEIGHT = 80;

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();

/* ----------------------------------------------------------
   5. Appointment form (client-side demo)
   ---------------------------------------------------------- */
(function initForm() {
  const form    = document.getElementById('appt-form');
  const success = document.getElementById('form-success');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Simple required-field check
    var valid = true;
    form.querySelectorAll('[required]').forEach(function (field) {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#c0392b';
        field.setAttribute('aria-invalid', 'true');
        field.addEventListener('input', function () {
          this.style.borderColor = '';
          this.removeAttribute('aria-invalid');
        }, { once: true });
      }
    });

    if (!valid) return;

    // Demo: hide form, show success
    form.style.display = 'none';
    success.style.display = 'block';
    success.focus();
  });
})();
