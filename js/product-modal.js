/* ==========================================================
   product-modal.js — modal de detalle de producto.
   Un único <dialog> reutilizado. URL sincronizada vía ?p=slug.
   ========================================================== */
window.FL = window.FL || {};

FL.productModal = (function () {
  var dom = FL.dom;
  var fmt = FL.format;
  var dialog, lastTrigger, scrollY = 0;

  function makeIcon(iconId) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconId);
    svg.appendChild(use);
    return svg;
  }

  function findProduct(id) {
    return FL.PRODUCTS.find(function (p) { return p.id === id; });
  }

  function buildContent(product) {
    var imgSrc = FL.catalog ? FL.catalog.productImage(product) : 'assets/img/productos/' + product.image + '.svg';
    var catName = (FL.CATEGORIES.find(function (c) { return c.id === product.category; }) || {}).name || '';

    var media = dom.el('div', { class: 'product-sheet__media' }, [
      dom.el('img', {
        src: imgSrc,
        alt: product.alt,
        width: '1200',
        height: '1500',
        decoding: 'async'
      })
    ]);

    var metaText = catName + (product.available ? ' · Disponible' : ' · Agotado');

    var priceNode = dom.el('p', { class: 'product-sheet__price' }, [
      document.createTextNode(fmt.formatPrice(product.price)),
      product.priceNote ? dom.el('span', { class: 'product-sheet__price-note' }, ' ' + product.priceNote) : null
    ].filter(Boolean));

    var bodyChildren = [
      dom.el('p', { class: 'product-sheet__meta' }, metaText),
      dom.el('h2', { class: 'product-sheet__name' }, product.name),
      priceNode,
      dom.el('p', { class: 'product-sheet__desc' }, product.description)
    ];

    if (!product.available) {
      bodyChildren.push(dom.el('p', { class: 'product-sheet__unavailable' }, 'Temporalmente agotado'));
    }

    if (product.occasions && product.occasions.length) {
      var list = dom.el('ul', { class: 'product-sheet__bullets' });
      product.occasions.forEach(function (occ) {
        var li = dom.el('li', {}, [
          makeIcon('icon-check'),
          document.createTextNode('Ideal para ' + occ)
        ]);
        list.appendChild(li);
      });
      bodyChildren.push(list);
    }

    var content = dom.el('div', { class: 'product-sheet__content-wrap' }, [
      dom.el('div', { class: 'product-sheet__content' }, bodyChildren)
    ]);

    var footerBtn = product.available
      ? dom.el('a', { class: 'btn btn--primary', dataset: { waContext: 'product-available' } }, 'Pedir por WhatsApp')
      : dom.el('a', { class: 'btn btn--primary', dataset: { waContext: 'product-unavailable' } }, 'Consultar disponibilidad');

    var shareBtn = null;
    if (navigator.share || navigator.clipboard) {
      shareBtn = dom.el('button', { class: 'btn btn--outline', type: 'button', 'aria-label': 'Compartir este arreglo', id: 'share-product-btn' });
      shareBtn.appendChild(makeIcon('icon-share'));
    }

    var footer = dom.el('div', { class: 'product-sheet__footer' }, [footerBtn, shareBtn].filter(Boolean));

    var scrollWrap = dom.el('div', { class: 'product-sheet__scroll' }, [media, content]);

    dialog.querySelector('.product-sheet').innerHTML = '';
    var handle = dom.el('div', { class: 'product-sheet__handle' }, [dom.el('span', {})]);
    var closeBtn = dom.el('button', {
      class: 'product-sheet__close',
      type: 'button',
      'aria-label': 'Cerrar'
    });
    closeBtn.appendChild(makeIcon('icon-close'));

    dialog.querySelector('.product-sheet').appendChild(handle);
    dialog.querySelector('.product-sheet').appendChild(closeBtn);
    dialog.querySelector('.product-sheet').appendChild(scrollWrap);
    dialog.querySelector('.product-sheet').appendChild(footer);

    dom.on(closeBtn, 'click', close);
    dom.$$('[data-wa-context]', footer).forEach(function (link) {
      var ctx = link.dataset.waContext;
      link.setAttribute('href', FL.whatsapp.buildUrl(ctx, product));
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener');
    });

    if (shareBtn) {
      dom.on(shareBtn, 'click', function () { shareProduct(product); });
    }
  }

  function shareProduct(product) {
    var url = FL.whatsapp.productUrl(product);
    if (navigator.share) {
      navigator.share({ title: product.name, url: url }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () {
        FL.ui.showToast('Link copiado');
      }).catch(function () {});
    }
  }

  function open(productId, opts) {
    opts = opts || {};
    var product = findProduct(productId);
    if (!product) {
      history.replaceState(null, '', stripParam(window.location.search, 'p'));
      if (FL.ui) FL.ui.showToast('Ese arreglo ya no está disponible');
      return;
    }

    buildContent(product);
    lastTrigger = opts.trigger || document.activeElement;
    scrollY = window.scrollY;

    if (!dialog.open) {
      dialog.showModal();
      document.body.classList.add('is-locked');
    }

    if (!opts.skipHistory) {
      var params = new URLSearchParams(window.location.search);
      params.set('p', productId);
      history.pushState({ flModal: true }, '', window.location.pathname + '?' + params.toString());
    }

    var closeBtnEl = dom.$('.product-sheet__close', dialog);
    if (closeBtnEl) closeBtnEl.focus();
    if (FL.motion) {
      FL.motion.sheetIn(dialog.querySelector('.product-sheet'));
      FL.motion.magneticButtons(dialog);
    }
    if (FL.ui && FL.ui._refreshFloat) FL.ui._refreshFloat();
  }

  function close(opts) {
    opts = opts || {};
    var sheet = dialog.querySelector('.product-sheet');

    /* El <dialog> desaparece en el instante en que se llama a close(), así
       que primero animamos la salida y cerramos en el callback. */
    var finish = function () {
      if (dialog.open) dialog.close();
      document.body.classList.remove('is-locked');
      window.scrollTo(0, scrollY);
      if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
      if (FL.ui && FL.ui._refreshFloat) FL.ui._refreshFloat();
    };

    if (FL.motion && FL.motion.isEnabled() && sheet && dialog.open) {
      FL.motion.sheetOut(sheet, finish);
    } else {
      finish();
    }

    if (!opts.skipHistory) {
      var params = new URLSearchParams(window.location.search);
      params.delete('p');
      var qs = params.toString();
      history.pushState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
    }
  }

  function stripParam(search, key) {
    var params = new URLSearchParams(search);
    params.delete(key);
    var qs = params.toString();
    return qs ? '?' + qs : '';
  }

  function checkUrlOnLoad() {
    var params = new URLSearchParams(window.location.search);
    var p = params.get('p');
    if (p) open(p, { skipHistory: true });
  }

  function init() {
    dialog = dom.$('#product-dialog');
    if (!dialog) return;

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-product-id]');
      if (trigger && trigger.tagName === 'A') {
        e.preventDefault();
        open(trigger.dataset.productId, { trigger: trigger });
      }
    });

    dom.on(dialog, 'cancel', function (e) {
      e.preventDefault();
      close();
    });
    dom.on(dialog, 'click', function (e) {
      if (e.target === dialog) close();
    });

    dom.on(window, 'popstate', function () {
      var params = new URLSearchParams(window.location.search);
      var p = params.get('p');
      if (p) {
        open(p, { skipHistory: true });
      } else if (dialog.open) {
        close({ skipHistory: true });
      }
    });

    checkUrlOnLoad();
  }

  return { init: init, open: open, close: close };
})();

document.addEventListener('DOMContentLoaded', FL.productModal.init);
