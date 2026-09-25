/* ==========================================================
   catalog.js — catálogo: filtrado, orden, render del grid,
   sincronización con la URL y estados vacíos.
   Solo se ejecuta si existe #catalog-grid en la página.
   ========================================================== */
window.FL = window.FL || {};

FL.catalog = (function () {
  var dom = FL.dom;
  var fmt = FL.format;

  var state = { cat: 'todos', q: '' };
  var grid, chipRow, searchInput, searchClear, countEl, emptyState;

  function makeIcon(iconId) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconId);
    svg.appendChild(use);
    return svg;
  }

  function productImage(product, size) {
    /* Temporal: todos los productos usan la misma imagen de muestra
       hasta que se agreguen las fotos reales en assets/img/productos/. */
    if (product.image === 'placeholder') {
      return 'assets/img/placeholder.svg';
    }
    return 'assets/img/productos/' + product.image + (size ? '-' + size : '-600') + '.webp';
  }

  function matchesQuery(product, query) {
    if (!query) return true;
    var category = FL.CATEGORIES.find(function (c) { return c.id === product.category; });
    var haystack = [
      product.name,
      category ? category.name : '',
      product.description,
      (product.occasions || []).join(' ')
    ].join(' ');
    return fmt.normalize(haystack).indexOf(fmt.normalize(query)) !== -1;
  }

  function getFilteredProducts() {
    return FL.PRODUCTS.filter(function (p) {
      var matchesCat = state.cat === 'todos' || p.category === state.cat;
      return matchesCat && matchesQuery(p, state.q);
    });
  }

  function sortProducts(products) {
    return products.slice().sort(function (a, b) {
      if (a.available !== b.available) return a.available ? -1 : 1;
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return 0;
    });
  }

  function categoryName(product) {
    var category = FL.CATEGORIES.find(function (c) { return c.id === product.category; });
    return category ? category.name : '';
  }

  /* La tarjeta es un contenedor, no un enlace: dentro lleva el enlace al
     detalle (foto + meta + nombre + precio) y, aparte, el botón de pedido.
     Un <button> o <a> anidado dentro de otro <a> no es HTML válido, de ahí
     la separación. El modal se abre desde [data-product-id] (ver
     product-modal.js), que va en el enlace, no en el botón de WhatsApp. */
  function buildCard(product) {
    var card = dom.el('article', {
      class: 'card' + (product.available ? '' : ' is-unavailable')
    });

    var catName = categoryName(product);

    var link = dom.el('a', {
      class: 'card__link',
      href: '?' + buildQueryString({ p: product.id }),
      dataset: { productId: product.id }
    });

    var media = dom.el('div', { class: 'card__media' });
    var img = dom.el('img', {
      src: productImage(product),
      srcset: productImage(product, 600) + ' 600w, ' + productImage(product, 1200) + ' 1200w',
      sizes: '(min-width: 1024px) 23vw, (min-width: 768px) 30vw, 45vw',
      alt: product.alt,
      width: '600',
      height: '750',
      loading: 'lazy',
      decoding: 'async'
    });
    media.appendChild(img);

    if (product.available) {
      var hint = dom.el('span', { class: 'card__hint' }, [document.createTextNode('Ver detalle')]);
      hint.appendChild(makeIcon('icon-arrow'));
      media.appendChild(hint);
      if (product.featured) {
        /* Píldora "TEMPORADA" translúcida sobre la foto, con ícono. */
        var tag = dom.el('span', { class: 'card__tag' });
        tag.appendChild(makeIcon('icon-leaf'));
        tag.appendChild(dom.el('span', {}, 'Temporada'));
        media.appendChild(tag);
      }
    } else {
      media.appendChild(dom.el('span', { class: 'badge badge--sold' }, 'Agotado'));
    }

    /* Eyebrow: "CATEGORÍA · TEMPORADA" (la parte de temporada solo si es
       destacado). El CSS lo pone en mayúsculas y espaciado. */
    var eyebrowText = catName;
    if (product.featured) eyebrowText += ' · Temporada';

    var priceValue = fmt.formatPrice(product.price);
    var priceNode;
    if (priceValue) {
      priceNode = dom.el('p', { class: 'card__price' }, [
        document.createTextNode(priceValue),
        dom.el('span', { class: 'card__price-cur' }, 'MXN')
      ]);
    } else {
      priceNode = dom.el('p', { class: 'card__price card__price--ask' }, 'Consultar precio');
    }

    var body = dom.el('div', { class: 'card__body' }, [
      dom.el('p', { class: 'card__eyebrow' }, eyebrowText),
      dom.el('p', { class: 'card__name' }, product.name),
      priceNode
    ]);

    link.appendChild(media);
    link.appendChild(body);
    card.appendChild(link);

    /* Acción principal del catálogo: pedir sin pasar por el detalle.
       Estructura de la referencia: logo en círculo + texto + flecha.
       Dos etiquetas: en móvil se muestra la corta ("Solicitar") para que el
       botón no crezca de alto al partir el texto largo en dos líneas; desde
       768px el CSS muestra la larga. La oculta con display:none no la leen
       los lectores de pantalla, así que no se anuncia dos veces.
       No lleva btn--block: al ser hijo de una tarjeta flex ya se estira
       solo, y width:100% con márgenes laterales la desbordaría. */
    var waIcon = dom.el('span', { class: 'card__wa-badge' }, [makeIcon('icon-whatsapp')]);
    var waBtn = dom.el('a', {
      class: 'btn btn--primary card__wa',
      href: FL.whatsapp.buildUrl(
        product.available ? 'product-available' : 'product-unavailable', product),
      target: '_blank',
      rel: 'noopener'
    }, [
      waIcon,
      dom.el('span', { class: 'card__wa-text' }, [
        dom.el('span', { class: 'card__wa-short' },
          product.available ? 'Solicitar' : 'Consultar'),
        dom.el('span', { class: 'card__wa-long' },
          product.available ? 'Pedir por WhatsApp' : 'Consultar disponibilidad')
      ]),
      makeIcon('icon-arrow')
    ]);
    card.appendChild(waBtn);

    return card;
  }

  function renderChips() {
    if (!chipRow) return;
    var activeCats = {};
    FL.PRODUCTS.forEach(function (p) { activeCats[p.category] = true; });

    var chips = [{ id: 'todos', name: 'Todos' }].concat(
      FL.CATEGORIES.filter(function (c) { return activeCats[c.id]; })
    );

    /* Se quitan solo los chips: la píldora indicadora que inserta motion.js
       debe sobrevivir al repintado para poder animar su desplazamiento. */
    dom.$$('.chip', chipRow).forEach(function (el) { el.remove(); });
    chips.forEach(function (cat) {
      var chip = dom.el('button', {
        class: 'chip',
        type: 'button',
        'aria-pressed': String(cat.id === state.cat),
        dataset: { cat: cat.id }
      }, cat.name);
      chipRow.appendChild(chip);
    });
  }

  function renderEmptyState(reason) {
    grid.innerHTML = '';
    var content;
    if (reason === 'catalog-empty') {
      content = {
        title: 'Estamos preparando el catálogo',
        text: 'Escríbenos por WhatsApp y te mostramos lo que tenemos disponible hoy.',
        cta: 'Escribir por WhatsApp',
        waContext: 'floating'
      };
    } else if (reason === 'category-empty') {
      content = {
        title: 'No hay arreglos en esta categoría por ahora',
        text: 'Prueba otra categoría o mira el catálogo completo.',
        cta: 'Ver todo el catálogo',
        href: 'catalogo.html'
      };
    } else {
      content = {
        title: 'No encontramos “' + state.q + '”',
        text: 'Quizá lo tengamos aunque no esté en el catálogo todavía.',
        cta: 'Preguntar por WhatsApp',
        waContext: 'no-results'
      };
    }

    var actions = [];
    if (content.href) {
      actions.push(dom.el('a', { class: 'btn btn--outline', href: content.href }, content.cta));
    }
    if (content.waContext) {
      var link = dom.el('a', { class: 'btn btn--primary', dataset: { waContext: content.waContext } }, content.cta);
      actions.push(link);
    }
    if (reason === 'no-results') {
      actions.push(dom.el('button', { class: 'btn btn--outline', type: 'button', id: 'clear-search-btn' }, 'Limpiar búsqueda'));
    }

    var block = dom.el('div', { class: 'empty-state' }, [
      makeIcon('icon-leaf'),
      dom.el('p', { class: 'empty-state__title' }, content.title),
      dom.el('p', { class: 'empty-state__text' }, content.text),
      dom.el('div', { class: 'cta-group', style: 'justify-content:center' }, actions)
    ]);
    grid.appendChild(dom.el('li', {}, block));

    if (FL.whatsapp) FL.whatsapp.wireLinks(grid);
    if (FL.motion) FL.motion.magneticButtons(grid);
    var clearBtn = dom.$('#clear-search-btn', grid);
    if (clearBtn) dom.on(clearBtn, 'click', function () { setState({ q: '' }); });
  }

  function render() {
    var products = sortProducts(getFilteredProducts());

    if (!FL.PRODUCTS.length) {
      renderEmptyState('catalog-empty');
    } else if (!products.length && state.q) {
      renderEmptyState('no-results');
    } else if (!products.length) {
      renderEmptyState('category-empty');
    } else {
      var fragment = document.createDocumentFragment();
      products.forEach(function (p) {
        fragment.appendChild(dom.el('li', {}, buildCard(p)));
      });
      grid.innerHTML = '';
      grid.appendChild(fragment);
      /* Las tarjetas se crean en cada render, así que la animación de
         entrada se dispara aquí y no en el init de motion.js. */
      if (FL.motion) FL.motion.gridIn(grid);
    }

    if (countEl) {
      var count = products.length;
      countEl.textContent = count + (count === 1 ? ' arreglo encontrado' : ' arreglos encontrados');
    }
    renderChips();
    highlightActiveChip();
    if (FL.motion) {
      FL.motion.placeChip(true);
      FL.motion.refresh();
    }
  }

  function highlightActiveChip() {
    if (!chipRow) return;
    dom.$$('.chip', chipRow).forEach(function (chip) {
      chip.setAttribute('aria-pressed', String(chip.dataset.cat === state.cat));
    });
    var active = dom.$('.chip[aria-pressed="true"]', chipRow);
    if (active) {
      active.scrollIntoView({ behavior: 'instant', inline: 'center', block: 'nearest' });
    }
  }

  function buildQueryString(overrides) {
    var params = new URLSearchParams();
    var cat = overrides.cat !== undefined ? overrides.cat : state.cat;
    var q = overrides.q !== undefined ? overrides.q : state.q;
    var p = overrides.p !== undefined ? overrides.p : null;
    if (cat && cat !== 'todos') params.set('cat', cat);
    if (q) params.set('q', q);
    if (p) params.set('p', p);
    return params.toString();
  }

  function setState(partial, opts) {
    opts = opts || {};
    state = Object.assign({}, state, partial);
    var params = new URLSearchParams(window.location.search);
    var p = params.get('p'); // conservar el modal si está abierto
    var qs = buildQueryString(p ? { p: p } : {});
    var url = window.location.pathname + (qs ? '?' + qs : '');
    if (opts.replace) {
      history.replaceState(null, '', url);
    } else {
      history.pushState(null, '', url);
    }
    render();
  }

  function readStateFromUrl() {
    var params = new URLSearchParams(window.location.search);
    state.cat = params.get('cat') || 'todos';
    state.q = params.get('q') || '';
    if (searchInput) searchInput.value = state.q;
    if (searchClear) searchClear.hidden = !state.q;
  }

  function init() {
    grid = dom.$('#catalog-grid');
    if (!grid) return;

    chipRow = dom.$('#category-chips');
    searchInput = dom.$('#catalog-search');
    searchClear = dom.$('#catalog-search-clear');
    countEl = dom.$('#catalog-count');

    readStateFromUrl();
    render();

    if (chipRow) {
      dom.on(chipRow, 'click', function (e) {
        var chip = e.target.closest('.chip');
        if (!chip) return;
        setState({ cat: chip.dataset.cat });
      });
    }

    if (searchInput) {
      var debounced = dom.debounce(function () {
        setState({ q: searchInput.value.trim() });
        if (searchClear) searchClear.hidden = !searchInput.value;
      }, 200);
      dom.on(searchInput, 'input', debounced);
    }

    if (searchClear) {
      dom.on(searchClear, 'click', function () {
        searchInput.value = '';
        searchClear.hidden = true;
        setState({ q: '' });
        searchInput.focus();
      });
    }

    dom.on(window, 'popstate', function () {
      readStateFromUrl();
      render();
    });
  }

  return {
    init: init,
    render: render,
    getFilteredProducts: getFilteredProducts,
    productImage: productImage
  };
})();

document.addEventListener('DOMContentLoaded', FL.catalog.init);
