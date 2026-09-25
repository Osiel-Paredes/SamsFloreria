/* ==========================================================
   home.js — render de categorías y filas de producto en la
   página de inicio. Solo se ejecuta si existen los
   contenedores correspondientes.

   Las filas se declaran en el HTML, no aquí:

     <div class="product-row"
          data-home-row="ramos"      <- id de categoría o "featured"
          data-home-limit="4"></div>

   Si una fila se queda sin productos, se oculta su sección
   entera para no dejar un bloque vacío.
   ========================================================== */
window.FL = window.FL || {};

FL.home = (function () {
  var dom = FL.dom;
  var fmt = FL.format;

  /* Ancho al que se mostrará la foto en cada contexto. Sirve para que el
     navegador baje el archivo de 600px y no el de 1200px cuando no hace
     falta. */
  var SIZES = {
    row: '(min-width: 1024px) 23vw, (min-width: 768px) 30vw, 45vw',
    pick: '(min-width: 900px) 15vw, 30vw'
  };

  function makeIcon(iconId, extraClass) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'icon' + (extraClass ? ' ' + extraClass : ''));
    svg.setAttribute('aria-hidden', 'true');
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconId);
    svg.appendChild(use);
    return svg;
  }

  function categoryImage(cat) {
    if (cat.image === 'placeholder') return 'assets/img/placeholder.svg';
    return 'assets/img/categorias/' + cat.image + '.webp';
  }

  function productImage(product, size) {
    if (FL.catalog) return FL.catalog.productImage(product, size);
    return 'assets/img/placeholder.svg';
  }

  /* <img> de producto con las dos resoluciones disponibles (600 y 1200).
     Las de la primera pantalla se piden de inmediato: con lazy llegaban
     tarde y aparecían de golpe al recargar. */
  function productImg(product, sizes, eager) {
    var img = dom.el('img', {
      src: productImage(product, 600),
      alt: product.alt,
      width: '600',
      height: '750',
      loading: eager ? 'eager' : 'lazy',
      fetchpriority: eager ? 'high' : null,
      decoding: 'async'
    });
    if (product.image !== 'placeholder') {
      img.setAttribute('srcset',
        productImage(product, 600) + ' 600w, ' + productImage(product, 1200) + ' 1200w');
      img.setAttribute('sizes', sizes);
    }
    return img;
  }

  /* ---------- Tarjetas ---------- */

  function buildCard(product) {
    var media = dom.el('div', { class: 'card__media' }, [productImg(product, SIZES.row)]);

    if (product.available) {
      var hint = dom.el('span', { class: 'card__hint' }, [document.createTextNode('Ver detalle')]);
      hint.appendChild(makeIcon('icon-arrow'));
      media.appendChild(hint);
    } else {
      media.appendChild(dom.el('span', { class: 'badge badge--sold' }, 'Agotado'));
    }

    var priceText = fmt.formatPrice(product.price);
    var price = dom.el('p', { class: 'card__price' }, [
      priceText ? document.createTextNode(priceText) : null,
      product.priceNote
        ? dom.el('span', { class: 'card__price-note' }, (priceText ? ' ' : '') + product.priceNote)
        : null
    ].filter(Boolean));

    return dom.el('a', {
      class: 'card' + (product.available ? '' : ' is-unavailable'),
      href: 'catalogo.html?p=' + product.id
    }, [
      media,
      dom.el('div', { class: 'card__body' }, [
        dom.el('p', { class: 'card__name' }, product.name),
        price
      ])
    ]);
  }

  /* Miniatura del hero: solo foto, el nombre va para lectores de pantalla. */
  function buildPick(product) {
    return dom.el('a', {
      class: 'hero-pick',
      href: 'catalogo.html?p=' + product.id
    }, [
      productImg(product, SIZES.pick, true),
      dom.el('span', { class: 'sr-only' }, product.name)
    ]);
  }

  /* ---------- Filas declaradas en el HTML ---------- */

  function pickProducts(key, limit) {
    var list = FL.PRODUCTS.filter(function (p) {
      if (!p.available) return false;
      if (key === 'featured') return !!p.featured;
      if (key === 'todos') return true;
      return p.category === key;
    });
    return list.slice(0, limit);
  }

  /* Sustituye los huecos de reserva por el contenido real. Hay que borrar
     la marca de "ya revelado": motion.js la puso al arrancar (los .skel ya
     contaban como hijos) y sin esto la segunda pasada de reveals() saltaría
     el grupo y las tarjetas nuevas se quedarían invisibles. */
  function swap(container, fragment) {
    container.innerHTML = '';
    container.appendChild(fragment);
    container._flRevealed = false;
  }

  function renderRows() {
    dom.$$('[data-home-row]').forEach(function (container) {
      var variant = container.dataset.homeVariant || 'card';
      var limit = parseInt(container.dataset.homeLimit || '4', 10);
      var items = pickProducts(container.dataset.homeRow, limit);
      var section = container.closest('section');

      if (!items.length) {
        if (section) section.hidden = true;
        return;
      }
      if (section) section.hidden = false;

      var fragment = document.createDocumentFragment();
      items.forEach(function (p) {
        fragment.appendChild(variant === 'pick' ? buildPick(p) : buildCard(p));
      });
      swap(container, fragment);
    });
  }

  /* ---------- Categorías ---------- */

  function renderCategories() {
    var container = dom.$('#home-categories');
    if (!container) return;

    var activeCats = {};
    FL.PRODUCTS.forEach(function (p) { activeCats[p.category] = true; });

    var fragment = document.createDocumentFragment();
    FL.CATEGORIES.filter(function (c) { return activeCats[c.id]; }).forEach(function (cat) {
      var arrow = dom.el('span', { class: 'cat-card__arrow' });
      arrow.appendChild(makeIcon('icon-arrow'));

      var card = dom.el('a', {
        class: 'cat-card',
        href: 'catalogo.html?cat=' + cat.id
      }, [
        dom.el('img', {
          src: categoryImage(cat),
          alt: cat.name,
          width: '800',
          height: '800',
          sizes: '(min-width: 768px) 30vw, 45vw',
          loading: 'lazy',
          decoding: 'async'
        }),
        dom.el('span', { class: 'cat-card__label' }, [
          dom.el('span', {}, cat.name),
          arrow
        ])
      ]);
      fragment.appendChild(card);
    });
    swap(container, fragment);
  }

  function init() {
    renderCategories();
    renderRows();
    /* Las tarjetas se crean aquí, después del init de motion.js: hay que
       registrar sus reveals y recalcular los triggers. */
    if (FL.motion) {
      FL.motion.reveals(document);
      FL.motion.refresh();
    }
  }

  return { init: init };
})();

document.addEventListener('DOMContentLoaded', FL.home.init);
