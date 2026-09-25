/* ==========================================================
   ui.js — comportamiento global de la interfaz:
   header con scroll, menú móvil, botón flotante de WhatsApp,
   toast y relleno de datos de contacto (footer, etc.)
   ========================================================== */
window.FL = window.FL || {};

FL.ui = (function () {
  var dom = FL.dom;

  function initHeaderScroll() {
    /* Cuando GSAP está activo, motion.js maneja este estado con un
       ScrollTrigger compartido. Esto queda solo como fallback. */
    if (FL.motion && FL.motion.isEnabled()) return;
    var header = dom.$('.header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    dom.on(window, 'scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Menú de teléfono: un botón que despliega los tres enlaces debajo.
     La animación es CSS (ver .nav-drop en layout.css); aquí solo se
     alterna la clase y el estado accesible. No bloquea el scroll ni
     atrapa el foco porque no es un panel a pantalla completa: se cierra
     al elegir un enlace, al tocar fuera o con Escape. */
  function initMobileMenu() {
    var wrap = dom.$('.nav-mobile');
    if (!wrap) return;
    var toggle = dom.$('.nav-burger', wrap);
    var drop = dom.$('.nav-drop', wrap);
    if (!toggle || !drop) return;

    function abierto() {
      return wrap.classList.contains('is-open');
    }

    function abrir() {
      wrap.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    }

    function cerrar() {
      if (!abierto()) return;
      wrap.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    dom.on(toggle, 'click', function (e) {
      e.stopPropagation();
      if (abierto()) { cerrar(); } else { abrir(); }
    });

    dom.$$('.nav-drop__link', drop).forEach(function (link) {
      dom.on(link, 'click', cerrar);
    });

    /* Fuera del menú o Escape lo cierran. */
    dom.on(document, 'click', function (e) {
      if (abierto() && !wrap.contains(e.target)) cerrar();
    });
    dom.on(document, 'keydown', function (e) {
      if (e.key === 'Escape' && abierto()) {
        cerrar();
        toggle.focus();
      }
    });
    /* Al pasar a escritorio la barra muestra los enlaces: sobra abierto. */
    dom.on(window, 'resize', function () {
      if (window.innerWidth >= 768) cerrar();
    });
  }

  function initFloatingWhatsApp() {
    var btn = dom.$('.float-wa');
    if (!btn) return;
    var contactSection = dom.$('[data-hide-float]');

    function update() {
      var pastThreshold = window.scrollY > 500;
      var overContact = false;
      if (contactSection) {
        var rect = contactSection.getBoundingClientRect();
        overContact = rect.top < window.innerHeight && rect.bottom > 0;
      }
      var modalOpen = document.body.classList.contains('is-locked') &&
        dom.$('.product-dialog[open]');
      btn.classList.toggle('is-visible', pastThreshold && !overContact && !modalOpen);
    }

    dom.on(window, 'scroll', update, { passive: true });
    dom.on(window, 'resize', update);
    update();
    /* Se expone para que product-modal.js pueda forzar un refresco
       al abrir/cerrar el modal. */
    FL.ui._refreshFloat = update;
  }

  function showToast(message) {
    var toast = dom.$('.toast');
    if (!toast) {
      toast = dom.el('div', { class: 'toast', role: 'status' });
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2500);
  }

  /* Rellena elementos [data-site="campo"] con valores de FL.SITE.
     Permite mantener el HTML estático sincronizado con config.js
     sin duplicar el dato a mano en cada página. */
  function fillSiteData(scope) {
    var site = FL.SITE;
    if (!site) return;
    dom.$$('[data-site="phoneDisplay"]', scope).forEach(function (n) { n.textContent = site.phoneDisplay; });
    dom.$$('[data-site="phoneTel"]', scope).forEach(function (n) { n.setAttribute('href', 'tel:+' + site.phoneWhatsapp); });
    dom.$$('[data-site="address"]', scope).forEach(function (n) { n.textContent = site.address; });
    dom.$$('[data-site="mapsUrl"]', scope).forEach(function (n) { n.setAttribute('href', site.mapsUrl); });
    dom.$$('[data-site="instagram"]', scope).forEach(function (n) { n.setAttribute('href', site.instagram); });
    dom.$$('[data-site="facebook"]', scope).forEach(function (n) { n.setAttribute('href', site.facebook); });
    dom.$$('[data-site="deliveryNote"]', scope).forEach(function (n) { n.textContent = site.deliveryNote; });
    dom.$$('[data-site="name"]', scope).forEach(function (n) { n.textContent = site.name; });
    dom.$$('[data-site="city"]', scope).forEach(function (n) { n.textContent = site.city; });

    var hoursList = dom.$('[data-site="hours"]', scope);
    if (hoursList && site.hours) {
      hoursList.innerHTML = '';
      site.hours.forEach(function (h) {
        var row = dom.el('tr', {}, [
          dom.el('td', {}, h.day),
          dom.el('td', {}, h.time)
        ]);
        hoursList.appendChild(row);
      });
    }
  }

  function init() {
    fillSiteData(document);
    initHeaderScroll();
    initMobileMenu();
    initFloatingWhatsApp();
    if (FL.whatsapp) FL.whatsapp.wireLinks(document);
  }

  return { init: init, showToast: showToast, fillSiteData: fillSiteData };
})();

document.addEventListener('DOMContentLoaded', FL.ui.init);
