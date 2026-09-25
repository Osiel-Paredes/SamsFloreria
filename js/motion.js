/* ==========================================================
   motion.js — capa de movimiento con GSAP
   Único punto de entrada para animaciones. Si GSAP no carga, el sitio
   funciona igual: se quita .js-anim y todo queda en su estado final.

   Depende de: assets/vendor/gsap/gsap.min.js + ScrollTrigger
   Opcionales: SplitText (título del hero), Flip (chips del catálogo)
   ========================================================== */
window.FL = window.FL || {};

FL.motion = (function () {
  var root = document.documentElement;
  var enabled = false;

  /* ---------- Utilidades ---------- */

  function $(sel, scope) { return (scope || document).querySelector(sel); }
  function $$(sel, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(sel));
  }

  /* Degradación: sin GSAP no dejamos nada oculto. */
  function disable() {
    root.classList.remove('js-anim');
    root.classList.add('no-js-anim');
  }

  /* ---------- Intro del hero ----------
     El título se parte en líneas y cada una sube desde su propia máscara.
     Si SplitText no está disponible, el título entra como un bloque. */

  function splitTitleLines(el) {
    if (!el || typeof window.SplitText === 'undefined') return null;
    try {
      return new SplitText(el, {
        type: 'lines',
        linesClass: 'split-line',
        mask: 'lines'
      });
    } catch (err) {
      return null;
    }
  }

  function heroIntro() {
    var hero = $('.hero');
    if (!hero) return;

    var title = $('.hero__title', hero);
    var lead = $('.hero__lead', hero);
    var eyebrow = $('.hero__eyebrow', hero);
    var ctas = $('.hero__ctas', hero);
    var img = $('.hero__media img', hero);
    var cue = $('.scroll-cue', hero);

    var split = splitTitleLines(title);
    var titleTargets = split && split.lines.length ? split.lines : title;

    var tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      onComplete: function () {
        /* Liberamos will-change y los wrappers de SplitText para no
           dejar capas de composición vivas de más. */
        if (split) gsap.set(split.lines, { clearProps: 'willChange' });
      }
    });

    if (img) {
      tl.fromTo(img,
        { scale: 1.22, opacity: 0 },
        { scale: 1.12, opacity: 1, duration: 1.6, ease: 'power2.out' }, 0);
    }
    if (eyebrow) {
      tl.to(eyebrow, { opacity: 1, y: 0, duration: .7 }, .25);
    }
    tl.fromTo(titleTargets,
      { yPercent: 115 },
      { yPercent: 0, duration: 1.1, stagger: .09 }, .35);
    /* El h1 lleva opacity:0 desde motion.css; con SplitText las líneas ya
       son visibles, así que revelamos el contenedor sin animarlo. */
    tl.set(title, { opacity: 1 }, .35);
    if (lead) {
      tl.to(lead, { opacity: 1, y: 0, duration: .9 }, .7);
    }
    if (ctas) {
      tl.to(ctas, { opacity: 1, y: 0, duration: .9 }, .85);
    }
    if (cue) {
      tl.fromTo(cue, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: .8 }, 1.1);
      /* Latido continuo del pulgar del indicador. */
      gsap.fromTo($('.scroll-cue__thumb', cue),
        { yPercent: -110 },
        { yPercent: 260, duration: 1.8, ease: 'power1.inOut', repeat: -1 });
    }

    return tl;
  }

  /* ---------- Parallax del hero ---------- */

  function heroParallax() {
    var img = $('.hero__media img');
    var hero = $('.hero');
    if (!img || !hero) return;

    gsap.to(img, {
      yPercent: 14,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  /* ---------- Reveals al hacer scroll ----------
     Cubre tres casos declarativos en el HTML:
       [data-anim]        elemento suelto
       [data-anim-group]  contenedor cuyos hijos entran en stagger
       [data-anim-mask]   imagen que se descubre con clip-path
     Se puede llamar de nuevo sobre un scope recién renderizado. */

  /* ¿Ya está a la vista en este momento? Lo que se ve al cargar la página
     NO se desplaza: solo hace un fundido en su sitio. Si se animara su
     posición, cada recarga movería el contenido de golpe y se percibe como
     un tirón. El deslizamiento se reserva para lo que entra al scrollear. */
  function isOnScreen(el) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight * .92 && r.bottom > 0;
  }

  function fadeInPlace(targets, stagger) {
    gsap.set(targets, { x: 0, y: 0, scale: 1, clearProps: 'transform' });
    gsap.to(targets, {
      opacity: 1,
      duration: .5,
      ease: 'power2.out',
      stagger: stagger || 0,
      clearProps: 'willChange'
    });
  }

  function reveals(scope) {
    $$('[data-anim]', scope).forEach(function (el) {
      if (el._flRevealed) return;
      el._flRevealed = true;
      if (isOnScreen(el)) {
        fadeInPlace(el);
        return;
      }
      gsap.to(el, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: .7,
        ease: 'power3.out',
        delay: parseFloat(el.dataset.animDelay || 0),
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        clearProps: 'willChange,transform'
      });
    });

    $$('[data-anim-group]', scope).forEach(function (group) {
      if (group._flRevealed) return;
      /* OJO con el orden: el grupo NO se marca hasta que tiene hijos. Los
         contenedores que rellena home.js están vacíos cuando motion.js
         arranca; si se marcaran aquí, la segunda pasada (la que hace
         home.js tras renderizar) los saltaría y sus tarjetas se quedarían
         invisibles con el opacity:0 de motion.css. */
      var children = Array.prototype.slice.call(group.children);
      if (!children.length) return;
      group._flRevealed = true;
      if (isOnScreen(group)) {
        fadeInPlace(children, .05);
        return;
      }
      gsap.to(children, {
        opacity: 1,
        duration: .55,
        ease: 'power2.out',
        stagger: .06,
        /* 'top 92%': entra en cuanto asoma, no a medio viewport. Así no se
           ve la animación a medias mientras se scrollea. */
        scrollTrigger: { trigger: group, start: 'top 92%', once: true },
        clearProps: 'willChange'
      });
    });

    $$('[data-anim-mask]', scope).forEach(function (el) {
      if (el._flRevealed) return;
      el._flRevealed = true;
      gsap.to(el, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        clearProps: 'willChange'
      });
    });
  }

  /* ---------- Header ----------
     Sustituye el listener de scroll de ui.js por un ScrollTrigger:
     un solo observador compartido, sin cálculos en cada frame. */

  function header() {
    var el = $('.header');
    if (!el) return;
    ScrollTrigger.create({
      start: 'top -8',
      end: 99999,
      onUpdate: function (self) {
        el.classList.toggle('is-scrolled', self.scroll() > 8);
      },
      onToggle: function (self) {
        el.classList.toggle('is-scrolled', self.isActive);
      }
    });
    el.classList.toggle('is-scrolled', window.scrollY > 8);
  }

  /* ---------- Botones magnéticos (Fase 4) ----------
     El botón sigue al cursor con amortiguación y su contenido se desplaza
     un poco más, lo que da la sensación de profundidad. Se usa quickTo(),
     que reutiliza un mismo tween en lugar de crear uno por mousemove. */

  function magnetize(btn) {
    if (btn._flMagnetic) return;
    btn._flMagnetic = true;
    btn.classList.add('is-magnetic');

    /* Envolvemos el contenido para poder moverlo por separado. */
    var label = document.createElement('span');
    label.className = 'btn__label';
    while (btn.firstChild) label.appendChild(btn.firstChild);
    btn.appendChild(label);

    var opts = { duration: .5, ease: 'power3' };
    var bx = gsap.quickTo(btn, 'x', opts);
    var by = gsap.quickTo(btn, 'y', opts);
    var lx = gsap.quickTo(label, 'x', opts);
    var ly = gsap.quickTo(label, 'y', opts);

    btn.addEventListener('mousemove', function (e) {
      var r = btn.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2);
      var dy = e.clientY - (r.top + r.height / 2);
      bx(dx * 0.22); by(dy * 0.35);
      lx(dx * 0.10); ly(dy * 0.16);
    });

    btn.addEventListener('mouseenter', function () {
      gsap.to(btn, { scale: 1.035, duration: .35, ease: 'power2.out' });
      var arrow = btn.querySelector('.icon--arrow');
      if (arrow) gsap.to(arrow, { x: 5, duration: .45, ease: 'back.out(3)' });
    });

    btn.addEventListener('mouseleave', function () {
      bx(0); by(0); lx(0); ly(0);
      gsap.to(btn, { scale: 1, duration: .5, ease: 'elastic.out(1, .5)' });
      var arrow = btn.querySelector('.icon--arrow');
      if (arrow) gsap.to(arrow, { x: 0, duration: .4, ease: 'power2.out' });
    });

    /* Rebote al pulsar, con la misma curva en todos los botones. */
    btn.addEventListener('pointerdown', function () {
      gsap.to(btn, { scale: .96, duration: .12, ease: 'power2.out' });
    });
    btn.addEventListener('pointerup', function () {
      gsap.to(btn, { scale: 1.035, duration: .3, ease: 'back.out(3)' });
    });
  }

  function magneticButtons(scope) {
    /* Solo con ratón fino: en táctil el efecto no aporta y estorba. */
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    $$('.btn--primary, .btn--dark, .btn--ghost', scope).forEach(magnetize);
  }

  /* ---------- Marquee infinito ---------- */

  function marquee() {
    $$('.marquee__track').forEach(function (track) {
      if (track._flMarquee) return;
      track._flMarquee = true;
      /* Duplicamos el contenido para que el bucle no muestre huecos. */
      track.appendChild(track.firstElementChild.cloneNode(true));
      var tween = gsap.to(track, {
        xPercent: -50,
        duration: 26,
        ease: 'none',
        repeat: -1
      });
      /* Se pausa al pasar el cursor, para poder leerlo. */
      track.parentElement.addEventListener('mouseenter', function () { tween.timeScale(.25); });
      track.parentElement.addEventListener('mouseleave', function () { tween.timeScale(1); });
    });
  }

  /* ---------- Contadores ----------
     El HTML ya contiene la cifra final, así que aquí la ponemos en 0 y la
     recontamos. Si esta función no corre (movimiento reducido o sin GSAP),
     el usuario ve el número correcto de todas formas. */

  function counters() {
    $$('[data-count]').forEach(function (el) {
      if (el._flCounted) return;
      el._flCounted = true;
      var target = parseFloat(el.dataset.count);
      var suffix = el.dataset.countSuffix || '';
      var obj = { v: 0 };
      el.textContent = '0' + suffix;
      gsap.to(obj, {
        v: target,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: function () {
          el.textContent = Math.round(obj.v).toLocaleString('es-MX') + suffix;
        }
      });
    });
  }

  /* ---------- Línea del proceso ---------- */

  function processLine() {
    var wrap = $('.process');
    if (!wrap || $('.process-line', wrap)) return;

    var line = document.createElement('div');
    line.className = 'process-line';
    line.setAttribute('aria-hidden', 'true');
    var fill = document.createElement('div');
    fill.className = 'process-line__fill';
    line.appendChild(fill);
    wrap.insertBefore(line, wrap.firstChild);

    gsap.to(fill, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: wrap,
        start: 'top 72%',
        end: 'bottom 60%',
        scrub: .6
      }
    });
  }

  /* ---------- Galería horizontal con pin (solo escritorio ancho) ---------- */

  function pinGallery(mm) {
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', function () {
      var gallery = $('.pin-gallery');
      if (!gallery) return;
      var track = $('.pin-gallery__track', gallery);
      if (!track) return;

      gallery.classList.add('is-pinned');
      var distance = track.scrollWidth - gallery.offsetWidth;
      if (distance <= 0) {
        gallery.classList.remove('is-pinned');
        return;
      }

      var tween = gsap.to(track, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: gallery,
          start: 'center center',
          end: '+=' + distance,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      /* Cleanup al salir del breakpoint: devolvemos el scroll nativo. */
      return function () {
        tween.scrollTrigger && tween.scrollTrigger.kill();
        tween.kill();
        gsap.set(track, { clearProps: 'x' });
        gallery.classList.remove('is-pinned');
      };
    });
  }

  /* ---------- Halo del botón flotante ---------- */

  function floatPulse() {
    var btn = $('.float-wa');
    if (!btn || $('.float-wa__pulse', btn)) return;
    var pulse = document.createElement('span');
    pulse.className = 'float-wa__pulse';
    pulse.setAttribute('aria-hidden', 'true');
    btn.appendChild(pulse);
    gsap.fromTo(pulse,
      { scale: 1, opacity: .7 },
      { scale: 1.5, opacity: 0, duration: 2, ease: 'power2.out', repeat: -1, repeatDelay: 1.6 });
  }

  /* ---------- Modal de producto ----------
     Con @keyframes no se podía animar el cierre (el <dialog> desaparece de
     golpe). Con GSAP controlamos ambas direcciones y avisamos por callback
     cuándo es seguro llamar a dialog.close(). */

  function sheetIn(sheet) {
    if (!enabled || !sheet) return;
    var isDesktop = window.matchMedia('(min-width: 768px)').matches;
    gsap.killTweensOf(sheet);
    gsap.fromTo(sheet,
      isDesktop ? { opacity: 0, scale: .96, y: 16 } : { opacity: 0, y: '18%' },
      isDesktop
        ? { opacity: 1, scale: 1, y: 0, duration: .5, ease: 'expo.out', clearProps: 'transform' }
        : { opacity: 1, y: '0%', duration: .45, ease: 'expo.out', clearProps: 'transform' });

    var content = sheet.querySelector('.product-sheet__content');
    if (content) {
      gsap.fromTo(Array.prototype.slice.call(content.children),
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: .5, ease: 'expo.out', stagger: .05, delay: .12, clearProps: 'all' });
    }
  }

  function sheetOut(sheet, done) {
    if (!enabled || !sheet) { done(); return; }
    var isDesktop = window.matchMedia('(min-width: 768px)').matches;
    gsap.killTweensOf(sheet);
    gsap.to(sheet, {
      opacity: 0,
      scale: isDesktop ? .97 : 1,
      y: isDesktop ? 12 : '16%',
      duration: .26,
      ease: 'power2.in',
      onComplete: function () {
        gsap.set(sheet, { clearProps: 'all' });
        done();
      }
    });
  }

  /* ---------- Transición entre páginas ----------
     Velo que cubre la pantalla antes de navegar. Si algo falla, un
     temporizador de seguridad navega igual: nunca deja al usuario atrapado. */

  function pageVeil() {
    var veil = document.createElement('div');
    veil.className = 'page-veil';
    veil.setAttribute('aria-hidden', 'true');
    document.body.appendChild(veil);

    /* Entrada: el velo se retira al cargar. */
    gsap.set(veil, { opacity: 1, visibility: 'visible' });
    gsap.to(veil, {
      opacity: 0,
      duration: .5,
      ease: 'power2.out',
      onComplete: function () { gsap.set(veil, { visibility: 'hidden' }); }
    });

    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (!link) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (link.target === '_blank' || link.hasAttribute('download')) return;
      if (link.dataset.productId || link.dataset.waContext) return;

      var url;
      try { url = new URL(link.href); } catch (err) { return; }
      if (url.origin !== window.location.origin) return;
      /* Mismo documento (anclas, cambios de query del catálogo): sin velo. */
      if (url.pathname === window.location.pathname) return;

      e.preventDefault();
      var navigated = false;
      var go = function () {
        if (navigated) return;
        navigated = true;
        window.location.href = link.href;
      };
      veil.classList.add('is-active');
      gsap.to(veil, { opacity: 1, duration: .32, ease: 'power2.in', onComplete: go });
      setTimeout(go, 700); // red de seguridad
    });

    /* Al volver con el botón atrás (incluido bfcache) el velo debe estar fuera. */
    window.addEventListener('pageshow', function () {
      veil.classList.remove('is-active');
      gsap.set(veil, { opacity: 0, visibility: 'hidden' });
    });
  }

  /* ---------- Init ---------- */

  function init() {
    if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
      disable();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    if (typeof window.Flip !== 'undefined') gsap.registerPlugin(Flip);
    if (typeof window.SplitText !== 'undefined') gsap.registerPlugin(SplitText);

    enabled = true;
    gsap.defaults({ ease: 'power3.out', duration: .6 });

    /* El header es sticky: ScrollTrigger necesita saberlo para no
       recalcular posiciones de forma incorrecta al fijar elementos. */
    ScrollTrigger.config({ ignoreMobileResize: true });

    /* El header y los chips funcionan igual con o sin movimiento reducido. */
    header();
    chipIndicator();

    var mm = gsap.matchMedia();

    /* Movimiento completo. */
    mm.add('(prefers-reduced-motion: no-preference)', function () {
      /* Los elementos del hero los controla la timeline de intro, no
         los reveals por scroll: los marcamos para que reveals() los ignore. */
      $$('.hero [data-anim]').forEach(function (el) { el._flRevealed = true; });

      heroIntro();
      heroParallax();
      reveals();
      magneticButtons();
      marquee();
      counters();
      processLine();
      floatPulse();
      pageVeil();
    });

    /* Movimiento reducido: sin reveals ni parallax. motion.css ya deja
       todo en su estado final, así que aquí no hace falta nada más. */
    mm.add('(prefers-reduced-motion: reduce)', function () {
      gsap.set('[data-anim], [data-anim-group] > *', { clearProps: 'all' });
    });

    pinGallery(mm);

    /* Las imágenes con lazy loading cambian la altura del documento: hay que
       recalcular los triggers cuando terminan de cargar. */
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  /* ---------- Chips del catálogo con Flip ----------
     La píldora activa se desliza al chip nuevo en lugar de saltar. */

  function chipIndicator() {
    var row = document.getElementById('category-chips');
    if (!row || typeof window.Flip === 'undefined') return;

    var indicator = document.createElement('span');
    indicator.className = 'chip-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    row.appendChild(indicator);

    function place(animate) {
      var active = row.querySelector('.chip[aria-pressed="true"]');
      if (!active) { indicator.classList.remove('is-ready'); return; }
      /* catalog.js repinta los chips con innerHTML = '', lo que borra la
         píldora. Si quedó fuera del DOM la reinsertamos antes de medir. */
      if (indicator.parentElement !== row) {
        row.appendChild(indicator);
        animate = false;
      }
      var state = animate ? Flip.getState(indicator) : null;
      Flip.fit(indicator, active, { absolute: true });
      indicator.classList.add('is-ready');
      if (state) {
        Flip.from(state, { duration: .45, ease: 'expo.out', absolute: true });
      }
    }

    /* Reposicionamos después de que catalog.js repinte los chips. */
    FL.motion._placeChip = place;
    requestAnimationFrame(function () { place(false); });
    window.addEventListener('resize', function () { place(false); });
  }

  /* ---------- API pública ---------- */

  return {
    init: init,
    reveals: reveals,
    magneticButtons: magneticButtons,
    sheetIn: sheetIn,
    sheetOut: sheetOut,
    isEnabled: function () { return enabled; },
    /* Entrada en cascada del grid del catálogo tras cada re-render. */
    gridIn: function (grid) {
      if (!enabled || !grid) return;
      var items = Array.prototype.slice.call(grid.children);
      if (!items.length) return;
      gsap.killTweensOf(items);
      gsap.fromTo(items,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: .6, ease: 'expo.out',
          stagger: .04, clearProps: 'all', overwrite: true
        });
    },
    refresh: function () {
      if (enabled && typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    },
    placeChip: function (animate) {
      if (FL.motion._placeChip) FL.motion._placeChip(animate);
    }
  };
})();

document.addEventListener('DOMContentLoaded', FL.motion.init);
