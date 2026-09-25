/* ==========================================================
   lib/dom.js — helpers mínimos de DOM (sin dependencias)
   ========================================================== */
window.FL = window.FL || {};

FL.dom = (function () {

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  /* Crea un elemento con atributos y texto/hijos.
     el('span', { class: 'foo' }, 'texto') */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (key) {
      if (attrs[key] === undefined || attrs[key] === null) return;
      if (key === 'class') node.className = attrs[key];
      else if (key === 'dataset') {
        Object.keys(attrs[key]).forEach(function (dKey) {
          node.dataset[dKey] = attrs[key][dKey];
        });
      } else {
        node.setAttribute(key, attrs[key]);
      }
    });

    if (typeof children === 'string') {
      node.textContent = children;
    } else if (Array.isArray(children)) {
      children.forEach(function (child) {
        if (child) node.appendChild(child);
      });
    } else if (children instanceof Node) {
      node.appendChild(children);
    }
    return node;
  }

  function on(target, event, handler, opts) {
    target.addEventListener(event, handler, opts);
  }

  function debounce(fn, wait) {
    var timer = null;
    return function () {
      var args = arguments;
      var ctx = this;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  }

  return { $: $, $$: $$, el: el, on: on, debounce: debounce };
})();
