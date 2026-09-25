/* ==========================================================
   config.js
   Datos del negocio. Único lugar donde se edita esta info.
   Reemplaza los valores marcados con [ ... ] por los reales.
   ========================================================== */
window.FL = window.FL || {};

FL.SITE = {
  name: 'Florería Sam\'s',
  city: 'Xicotepec de Juárez',
  state: 'Pue.',

  /* Número de WhatsApp en formato internacional SIN signos ni espacios.
     52 (México) + 10 dígitos. Ejemplo: 5214421234567
     [PENDIENTE] Reemplazar por el número real. */
  phoneWhatsapp: '5214421234567',

  /* Número tal como se muestra al usuario. [PENDIENTE] */
  phoneDisplay: '442 123 4567',

  /* [PENDIENTE] Dirección real del local. */
  address: 'Av. de las Flores 123, Centro, 73080 Xicotepec de Juárez, Pue.',

  /* URL directa a Google Maps (buscar el negocio y copiar el link "Compartir") */
  mapsUrl: 'https://maps.google.com/?q=Florer%C3%ADa+Sam%27s+Xicotepec+de+Ju%C3%A1rez',

  hours: [
    { day: 'Lunes a viernes', time: '9:00 am – 7:00 pm' },
    { day: 'Sábado', time: '9:00 am – 5:00 pm' },
    { day: 'Domingo', time: '10:00 am – 2:00 pm' }
  ],

  deliveryNote: 'Entregamos el mismo día dentro de Xicotepec de Juárez. Fuera de la ciudad, consulta disponibilidad por WhatsApp.',

  instagram: 'https://instagram.com/floreriasams',
  facebook: 'https://facebook.com/floreriasams',

  /* URL base del sitio ya publicado, sin slash final. Se usa para los
     links de producto que se envían por WhatsApp. [PENDIENTE] */
  baseUrl: 'https://www.floreriasams.com.mx'
};
