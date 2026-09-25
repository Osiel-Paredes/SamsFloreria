/* ==========================================================
   boot.js — arranque mínimo, se carga SIN defer en el <head>.

   Por qué existe: netlify.toml define `script-src 'self'`, que bloquea
   cualquier <script> inline. Todo lo que antes iba inline vive aquí.

   1) Marca el documento como animable antes del primer pintado, para que
      los estados iniciales de motion.css puedan aplicarse sin parpadeo.
      Si este archivo no carga, nada queda oculto: el sitio sigue legible.
   2) Rellena el año del footer (lo usa también 404.html, que no carga ui.js).
   ========================================================== */
(function () {
  document.documentElement.classList.add('js-anim');

  document.addEventListener('DOMContentLoaded', function () {
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  });
})();
