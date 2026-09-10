(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Preloader */
  var preloader = document.getElementById('preloader');
  var preloaderDone = false;
  function hidePreloader() {
    if (!preloader || preloaderDone) return;
    preloaderDone = true;
    preloader.classList.add('is-done');
    setTimeout(function () { if (preloader.parentNode) preloader.parentNode.removeChild(preloader); }, 800);
  }
  window.addEventListener('load', function () {
    setTimeout(hidePreloader, 450);
  });
  setTimeout(hidePreloader, 3500);

  /* Scroll progress */
  var root = document.documentElement;
  var progressEl = document.getElementById('scrollProgress');
  var navbar = document.getElementById('navbar');
  var toTop = document.getElementById('toTop');

  function onScroll() {
    var max = root.scrollHeight - window.innerHeight;
    var progress = max > 0 ? (window.scrollY / max) * 100 : 0;
    root.style.setProperty('--scroll', progress.toFixed(2) + '%');

    if (navbar) navbar.classList.toggle('is-scrolled', window.scrollY > 30);
    document.body.classList.toggle('is-scrolled', window.scrollY > 30);
    if (toTop) toTop.classList.toggle('is-visible', window.scrollY > 420);
  }
  var scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(function () { onScroll(); scrollTicking = false; });
    }
  }, { passive: true });
  onScroll();

  /* Navbar mobile */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var open = navbar.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        navbar.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target) && navbar.classList.contains('is-open')) {
        navbar.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Active nav link */
  var sections = document.querySelectorAll('main section[id]');
  var menuLinks = document.querySelectorAll('.navbar__menu a');
  if (sections.length && menuLinks.length) {
    var menuObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          menuLinks.forEach(function (link) {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (section) { menuObserver.observe(section); });
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = Array.prototype.filter.call(el.parentNode.children, function (c) {
          return c.classList && c.classList.contains('reveal');
        });
        var idx = siblings.indexOf(el);
        el.style.transitionDelay = Math.min(idx, 6) * 75 + 'ms';
        el.classList.add('is-visible');
        revealObserver.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Animated counters */
  var counters = document.querySelectorAll('[data-count]');
  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var duration = 1600;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(eased * target);
      el.textContent = value.toLocaleString('es-CL');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = parseInt(el.getAttribute('data-count'), 10).toLocaleString('es-CL'); });
  }

  /* Countdown */
  var countdownTargets = [];
  var heroCountdown = document.getElementById('heroCountdown');
  if (heroCountdown) {
    countdownTargets.push({
      root: heroCountdown,
      days: heroCountdown.querySelector('[data-unit="days"]'),
      hours: heroCountdown.querySelector('[data-unit="hours"]'),
      minutes: heroCountdown.querySelector('[data-unit="minutes"]'),
      seconds: heroCountdown.querySelector('[data-unit="seconds"]')
    });
  }
  var topbarTimer = document.querySelector('[data-countdown-value]');
  var targetDate = new Date(
    (heroCountdown && heroCountdown.getAttribute('data-countdown')) || '2026-11-14T09:00:00-03:00'
  ).getTime();

  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function tickCountdown() {
    var diff = Math.max(targetDate - Date.now(), 0);
    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var minutes = Math.floor((diff % 3600000) / 60000);
    var seconds = Math.floor((diff % 60000) / 1000);
    countdownTargets.forEach(function (t) {
      if (t.days) t.days.textContent = pad(days);
      if (t.hours) t.hours.textContent = pad(hours);
      if (t.minutes) t.minutes.textContent = pad(minutes);
      if (t.seconds) t.seconds.textContent = pad(seconds);
    });
    if (topbarTimer) topbarTimer.textContent = days + 'd : ' + pad(hours) + 'h : ' + pad(minutes) + 'm : ' + pad(seconds) + 's';
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* Categorías */
  var catGrid = document.getElementById('categoriasGrid');
  if (catGrid) {
    var cats = ['30+', '35+', '40+', '45+', '50+', '55+', '60+', '65+', '70+', '75+', '80+', '85+'];
    catGrid.innerHTML = cats.map(function (cat) {
      return '<article class="cat-card reveal">' +
        '<span class="cat-card__num">' + cat + '</span>' +
        '<span class="cat-card__years">Años</span>' +
        '<div class="cat-card__badges"><span class="cat-card__badge">Singles</span><span class="cat-card__badge">Dobles</span></div>' +
        '</article>';
    }).join('');
    if ('IntersectionObserver' in window && !reduceMotion) {
      var catObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var idx = Array.prototype.indexOf.call(catGrid.children, el);
          el.style.transitionDelay = Math.min(idx, 8) * 55 + 'ms';
          el.classList.add('is-visible');
          catObserver.unobserve(el);
        });
      }, { threshold: 0.15 });
      catGrid.querySelectorAll('.cat-card').forEach(function (el) { catObserver.observe(el); });
    } else {
      catGrid.querySelectorAll('.cat-card').forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  /* Parallax */
  var parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && !reduceMotion && window.innerWidth > 820) {
    var parallaxTicking = false;
    window.addEventListener('scroll', function () {
      if (parallaxTicking) return;
      parallaxTicking = true;
      requestAnimationFrame(function () {
        parallaxEls.forEach(function (el) {
          var speed = parseFloat(el.getAttribute('data-parallax')) || 0.2;
          el.style.transform = 'translate3d(0,' + (window.scrollY * speed).toFixed(1) + 'px,0)';
        });
        parallaxTicking = false;
      });
    }, { passive: true });
  }

  /* Click ripple */
  if (!reduceMotion && finePointer) {
    document.addEventListener('click', function (e) {
      if (e.target.closest('input, textarea, select, iframe')) return;
      var ripple = document.createElement('span');
      ripple.className = 'click-ripple';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      document.body.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 700);
    });
  }

  /* 3D tilt */
  if (finePointer && !reduceMotion) {
    var tiltEls = document.querySelectorAll('.pilar, .conv, .vis, .tier, .cat-card, .noticia');
    tiltEls.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = 'perspective(800px) rotateY(' + (x * 6).toFixed(2) + 'deg) rotateX(' + (-y * 6).toFixed(2) + 'deg) translateY(-6px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

  /* Formulario */
  var form = document.getElementById('contactForm');
  var formMsg = document.getElementById('formMsg');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      ['nombre', 'email', 'mensaje'].forEach(function (name) {
        var input = form.querySelector('[name="' + name + '"]');
        if (!input) return;
        var field = input.closest('.field');
        var ok = input.value.trim().length > 0;
        if (name === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        field.classList.toggle('has-error', !ok);
        if (!ok) valid = false;
      });
      if (!valid) {
        formMsg.textContent = 'Revisa los campos marcados para continuar.';
        formMsg.className = 'form-msg is-error';
        return;
      }
      formMsg.textContent = '¡Gracias por tu mensaje! Te contactaremos pronto.';
      formMsg.className = 'form-msg is-ok';
      form.reset();
    });
    form.querySelectorAll('input, textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field) field.classList.remove('has-error');
      });
    });
  }

  /* Galería MG */
  var mgMain = document.getElementById('mgMain');
  var mgThumbs = document.querySelectorAll('#mgThumbs img');
  if (mgMain && mgThumbs.length) {
    var MG_INTERVAL = 10000;
    var mgIndex = 0;
    var mgTimer = null;
    var mgImages = [];

    Array.prototype.forEach.call(mgThumbs, function (thumb, i) {
      mgImages.push({
        src: thumb.getAttribute('data-src') || thumb.getAttribute('src'),
        alt: thumb.getAttribute('alt') || ''
      });
      thumb.addEventListener('click', function () { selectMgImage(i); });
      thumb.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectMgImage(i);
        }
      });
    });

    function selectMgImage(i) {
      mgIndex = (i + mgImages.length) % mgImages.length;
      Array.prototype.forEach.call(mgThumbs, function (thumb, k) {
        thumb.classList.toggle('is-active', k === mgIndex);
      });
      mgMain.style.opacity = '0';
      setTimeout(function () {
        mgMain.src = mgImages[mgIndex].src;
        mgMain.alt = mgImages[mgIndex].alt;
        if (mgMain.complete) {
          mgMain.style.opacity = '1';
        } else {
          mgMain.addEventListener('load', function onLoad() {
            mgMain.style.opacity = '1';
            mgMain.removeEventListener('load', onLoad);
          });
        }
      }, 340);
      restartMgTimer();
    }

    function restartMgTimer() {
      if (mgTimer) clearInterval(mgTimer);
      if (!reduceMotion) {
        mgTimer = setInterval(function () {
          selectMgImage(mgIndex + 1);
        }, MG_INTERVAL);
      }
    }

    var mgWrap = document.querySelector('.mg');
    if (mgWrap && 'IntersectionObserver' in window) {
      var mgObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            restartMgTimer();
          } else if (mgTimer) {
            clearInterval(mgTimer);
            mgTimer = null;
          }
        });
      }, { threshold: 0.15 });
      mgObserver.observe(mgWrap);
    } else {
      restartMgTimer();
    }
  }

  /* To top */
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }
})();
