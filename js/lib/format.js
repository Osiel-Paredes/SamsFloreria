/* ==========================================================
   lib/format.js — formateo de precio, slugs y normalización
   ========================================================== */
window.FL = window.FL || {};

FL.format = (function () {

  function formatPrice(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) return '';
    return '$' + amount.toLocaleString('es-MX', { maximumFractionDigits: 0 });
  }

  /* Quita acentos y pasa a minúsculas, para comparar texto
     sin que "girasón" y "Girason" se traten distinto. */
  function normalize(str) {
    if (!str) return '';
    return str
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function slugify(str) {
    return normalize(str)
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  return { formatPrice: formatPrice, normalize: normalize, slugify: slugify };
})();
