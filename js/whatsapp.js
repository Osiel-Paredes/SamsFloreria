/* ==========================================================
   whatsapp.js — construcción de links y mensajes de WhatsApp
   ========================================================== */
window.FL = window.FL || {};

FL.whatsapp = (function () {
  var dom = FL.dom;

  function productUrl(product) {
    var base = (FL.SITE && FL.SITE.baseUrl) || '';
    return base + '/catalogo.html?p=' + product.id;
  }

  function messages(context, payload) {
    payload = payload || {};
    switch (context) {
      case 'product-available':
        return '¡Hola! Me interesa el arreglo "' + payload.name + '" (' +
          FL.format.formatPrice(payload.price) + ') que vi en su página. ' +
          '¿Me pueden dar más información? ' + productUrl(payload);

      case 'product-unavailable':
        return '¡Hola! Vi el arreglo "' + payload.name + '" en su página y aparece ' +
          'como agotado. ¿Tendrán disponibilidad próximamente?';

      case 'hero':
        return '¡Hola! Vi su página y me gustaría información sobre sus arreglos.';

      case 'floating':
        return '¡Hola! Estoy viendo su catálogo y me gustaría información.';

      case 'contact':
        return '¡Hola! Me gustaría hacer un pedido. ¿Me pueden ayudar?';

      case 'no-results':
        return '¡Hola! Busco "' + payload.term + '" y no lo encontré en su catálogo. ¿Lo manejan?';

      default:
        return '¡Hola! Me gustaría más información.';
    }
  }

  function buildUrl(context, payload) {
    var phone = (FL.SITE && FL.SITE.phoneWhatsapp) || '';
    var text = encodeURIComponent(messages(context, payload));
    return 'https://wa.me/' + phone + '?text=' + text;
  }

  /* Aplica href + target + rel a todos los elementos [data-wa-context]
     encontrados en el documento o en un contenedor dado. */
  function wireLinks(scope) {
    dom.$$('[data-wa-context]', scope).forEach(function (link) {
      var ctx = link.dataset.waContext;
      link.setAttribute('href', buildUrl(ctx));
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener');
    });
  }

  return { buildUrl: buildUrl, messages: messages, productUrl: productUrl, wireLinks: wireLinks };
})();
