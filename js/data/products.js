/* ==========================================================
   products.js — catálogo del negocio.
   Único archivo que debes editar para agregar, quitar o
   modificar productos. Ver README.md → "Mantenimiento del
   catálogo" para instrucciones paso a paso.

   AVISO IMPORTANTE (datos de ejemplo):
   Las fotos reales ya están conectadas (assets/img/productos/
   arreglo-NN-600.webp y -1200.webp). Sin embargo, los nombres,
   precios y descripciones que aparecen a continuación son
   INVENTADOS a modo de ejemplo, solo para mostrar cómo se ve el
   sitio con contenido. El dueño del negocio DEBE revisarlos y
   ajustarlos (nombre, precio, descripción, ocasiones y alt) para
   que correspondan al producto real antes de publicar.
   ========================================================== */
window.FL = window.FL || {};

/* ---------- Categorías ---------- */
FL.CATEGORIES = [
  { id: 'ramos',     name: 'Ramos',                image: 'cat-ramos' },
  { id: 'arreglos',  name: 'Arreglos florales',     image: 'cat-arreglos' },
  { id: 'rosas',     name: 'Rosas',                 image: 'cat-rosas' },
  { id: 'girasoles', name: 'Girasoles',             image: 'cat-girasoles' },
  { id: 'plantas',   name: 'Plantas y suculentas',  image: 'cat-plantas' },
  { id: 'detalles',  name: 'Detalles y regalos',    image: 'cat-detalles' }
];

/* ---------- Productos ---------- */
FL.PRODUCTS = [
  {
    id: 'arreglo-01',
    name: 'Ramo Primavera',
    category: 'ramos',
    price: 420,
    description: 'Ramo fresco de flores de temporada en tonos suaves, ideal para alegrar el día a alguien especial o dar la bienvenida.',
    image: 'arreglo-01',
    alt: 'Ramo de flores variadas en tonos pastel envuelto en papel claro',
    available: true,
    featured: true,
    occasions: ['cumpleaños', 'amistad', 'bienvenida']
  },
  {
    id: 'arreglo-02',
    name: 'Arreglo Ternura',
    category: 'arreglos',
    price: 690,
    description: 'Arreglo en base baja con flores mixtas y follaje verde, pensado para llevar calidez a una mesa o a una oficina.',
    image: 'arreglo-02',
    alt: 'Arreglo floral mixto en base baja sobre superficie de madera',
    available: true,
    featured: true,
    occasions: ['agradecimiento', 'cumpleaños', 'amistad']
  },
  {
    id: 'arreglo-03',
    name: 'Docena de rosas rojas',
    category: 'rosas',
    price: 560,
    description: 'Doce rosas rojas de tallo largo cuidadosamente seleccionadas, el clásico de siempre para decir te quiero.',
    image: 'arreglo-03',
    alt: 'Doce rosas rojas de tallo largo agrupadas en un ramo',
    available: true,
    featured: true,
    occasions: ['amor', 'aniversario', 'disculpa']
  },
  {
    id: 'arreglo-04',
    name: 'Girasoles de temporada',
    category: 'girasoles',
    price: 380,
    description: 'Girasoles grandes y luminosos que llenan cualquier espacio de energía, perfectos para felicitar y contagiar alegría.',
    image: 'arreglo-04',
    alt: 'Ramo de girasoles amarillos con follaje verde sobre fondo claro',
    available: true,
    featured: true,
    occasions: ['cumpleaños', 'amistad', 'graduación']
  },
  {
    id: 'arreglo-05',
    name: 'Suculentas en barro',
    category: 'plantas',
    price: 320,
    description: 'Trío de suculentas plantadas en macetas de barro natural, un detalle duradero y de muy fácil cuidado.',
    image: 'arreglo-05',
    alt: 'Tres suculentas pequeñas en macetas de barro alineadas',
    available: true,
    featured: true,
    occasions: ['bienvenida', 'agradecimiento', 'amistad']
  },
  {
    id: 'arreglo-06',
    name: 'Caja con rosas y chocolates',
    category: 'detalles',
    price: 420,
    description: 'Caja de regalo con rosas frescas y chocolates surtidos, un detalle completo para sorprender en una fecha importante.',
    image: 'arreglo-06',
    alt: 'Caja de regalo con rosas y chocolates envueltos en papel dorado',
    available: true,
    featured: true,
    occasions: ['amor', 'aniversario', 'cumpleaños']
  },
  {
    id: 'arreglo-07',
    name: 'Ramo Amanecer',
    category: 'ramos',
    price: 540,
    description: 'Ramo cálido con flores en tonos naranjas y amarillos que evoca la luz de la mañana, para empezar bien cualquier día.',
    image: 'arreglo-07',
    alt: 'Ramo de flores en tonos naranja y amarillo envuelto en papel kraft',
    available: true,
    featured: false,
    occasions: ['cumpleaños', 'agradecimiento', 'amistad']
  },
  {
    id: 'arreglo-08',
    name: 'Arreglo Campestre',
    category: 'arreglos',
    price: 780,
    description: 'Arreglo de estilo campirano con flores silvestres y espigas, ideal para quien disfruta lo natural y sencillo.',
    image: 'arreglo-08',
    alt: 'Arreglo de flores silvestres y espigas en canasta de mimbre',
    available: true,
    featured: false,
    occasions: ['bienvenida', 'agradecimiento', 'amistad']
  },
  {
    id: 'arreglo-09',
    name: 'Rosas rosas y lisianthus',
    category: 'rosas',
    price: 620,
    description: 'Combinación delicada de rosas rosadas y lisianthus, un ramo elegante para expresar cariño con suavidad.',
    image: 'arreglo-09',
    alt: 'Ramo de rosas rosadas y lisianthus sobre fondo neutro',
    available: true,
    featured: false,
    occasions: ['amor', 'aniversario', 'día de las madres']
  },
  {
    id: 'arreglo-10',
    name: 'Girasoles y margaritas',
    category: 'girasoles',
    price: 460,
    description: 'Mezcla alegre de girasoles y margaritas blancas que transmite frescura, pensada para celebrar buenos momentos.',
    image: 'arreglo-10',
    alt: 'Ramo de girasoles y margaritas blancas con follaje verde',
    available: true,
    featured: false,
    occasions: ['cumpleaños', 'graduación', 'amistad']
  },
  {
    id: 'arreglo-11',
    name: 'Cactus en maceta',
    category: 'plantas',
    price: 260,
    description: 'Cactus resistente en maceta de cerámica, un regalo con personalidad que dura mucho tiempo y casi no necesita cuidados.',
    image: 'arreglo-11',
    alt: 'Cactus pequeño en maceta de cerámica blanca',
    available: true,
    featured: false,
    occasions: ['bienvenida', 'amistad', 'agradecimiento']
  },
  {
    id: 'arreglo-12',
    name: 'Globo con flores',
    category: 'detalles',
    price: 290,
    description: 'Pequeño arreglo de flores acompañado de un globo de felicitación, un detalle sencillo que saca una sonrisa.',
    image: 'arreglo-12',
    alt: 'Arreglo pequeño de flores con globo metálico de felicitación',
    available: true,
    featured: false,
    occasions: ['cumpleaños', 'amistad', 'graduación']
  },
  {
    id: 'arreglo-13',
    name: 'Ramo Serenidad',
    category: 'ramos',
    price: 480,
    description: 'Ramo en tonos blancos y verdes que transmite calma, adecuado para acompañar en momentos de recogimiento.',
    image: 'arreglo-13',
    alt: 'Ramo de flores blancas con follaje verde envuelto en papel claro',
    available: true,
    featured: false,
    occasions: ['condolencias', 'agradecimiento', 'amistad']
  },
  {
    id: 'arreglo-14',
    name: 'Arreglo Elegancia',
    category: 'arreglos',
    price: 950,
    description: 'Arreglo alto y vistoso con flores premium y follaje fino, indicado para ocasiones que piden algo especial.',
    image: 'arreglo-14',
    alt: 'Arreglo floral alto y elegante en jarrón de vidrio',
    available: true,
    featured: false,
    occasions: ['aniversario', 'amor', 'graduación']
  },
  {
    id: 'arreglo-15',
    name: 'Media docena de rosas',
    category: 'rosas',
    price: 390,
    description: 'Seis rosas frescas envueltas con esmero, la opción justa para un detalle bonito sin necesidad de un ramo grande.',
    image: 'arreglo-15',
    alt: 'Seis rosas envueltas en papel sobre fondo claro',
    available: true,
    featured: false,
    occasions: ['amor', 'disculpa', 'aniversario']
  },
  {
    id: 'arreglo-16',
    name: 'Girasol solitario',
    category: 'girasoles',
    price: 300,
    description: 'Un girasol grande presentado con follaje y papel de regalo, un detalle económico que ilumina el día.',
    image: 'arreglo-16',
    alt: 'Un solo girasol grande envuelto en papel con follaje',
    available: true,
    featured: false,
    occasions: ['amistad', 'cumpleaños', 'bienvenida']
  },
  {
    id: 'arreglo-17',
    name: 'Planta de interior',
    category: 'plantas',
    price: 420,
    description: 'Planta verde de follaje frondoso en maceta, ideal para decorar la casa o la oficina y regalar algo que perdura.',
    image: 'arreglo-17',
    alt: 'Planta verde de interior en maceta sobre superficie clara',
    available: true,
    featured: false,
    occasions: ['bienvenida', 'agradecimiento', 'graduación']
  },
  {
    id: 'arreglo-18',
    name: 'Canasta de dulces',
    category: 'detalles',
    price: 350,
    description: 'Canasta con dulces surtidos y un toque floral, un obsequio dulce para consentir a quien más quieres.',
    image: 'arreglo-18',
    alt: 'Canasta con dulces surtidos y flores pequeñas',
    available: true,
    featured: false,
    occasions: ['cumpleaños', 'amistad', 'agradecimiento']
  },
  {
    id: 'arreglo-19',
    name: 'Ramo Confeti',
    category: 'ramos',
    price: 460,
    description: 'Ramo colorido y variado que combina varios tonos para una celebración llena de vida y buen ánimo.',
    image: 'arreglo-19',
    alt: 'Ramo multicolor de flores variadas envuelto en papel',
    available: true,
    featured: false,
    occasions: ['cumpleaños', 'graduación', 'amistad']
  },
  {
    id: 'arreglo-20',
    name: 'Arreglo Aurora',
    category: 'arreglos',
    price: 620,
    description: 'Arreglo en tonos rosados y durazno con follaje suave, pensado para expresar cariño en fechas entrañables.',
    image: 'arreglo-20',
    alt: 'Arreglo floral en tonos rosa y durazno en base redonda',
    available: true,
    featured: false,
    occasions: ['día de las madres', 'aniversario', 'amor']
  },
  {
    id: 'arreglo-21',
    name: 'Rosas blancas',
    category: 'rosas',
    price: 580,
    description: 'Ramo de rosas blancas de aspecto puro y sereno, apropiado para expresar respeto o acompañar en el duelo.',
    image: 'arreglo-21',
    alt: 'Ramo de rosas blancas de tallo largo sobre fondo claro',
    available: true,
    featured: false,
    occasions: ['condolencias', 'agradecimiento', 'aniversario']
  },
  {
    id: 'arreglo-22',
    name: 'Girasoles con rosas',
    category: 'girasoles',
    price: 540,
    description: 'Girasoles combinados con rosas de acento, un ramo lleno de contraste y energía para felicitar con estilo.',
    image: 'arreglo-22',
    alt: 'Ramo de girasoles combinados con rosas y follaje verde',
    available: true,
    featured: false,
    occasions: ['cumpleaños', 'aniversario', 'amistad']
  },
  {
    id: 'arreglo-23',
    name: 'Terrario de suculentas',
    category: 'plantas',
    price: 480,
    description: 'Composición de suculentas en recipiente de vidrio con arena y piedras, un detalle decorativo y muy resistente.',
    image: 'arreglo-23',
    alt: 'Terrario de vidrio con suculentas, arena y piedras decorativas',
    available: true,
    featured: false,
    occasions: ['bienvenida', 'graduación', 'agradecimiento']
  },
  {
    id: 'arreglo-24',
    name: 'Peluche con flores',
    category: 'detalles',
    price: 390,
    description: 'Ramo pequeño acompañado de un peluche suave, un detalle tierno para consentir a alguien en su día.',
    image: 'arreglo-24',
    alt: 'Ramo pequeño de flores junto a un peluche de felpa',
    available: true,
    featured: false,
    occasions: ['cumpleaños', 'amor', 'bienvenida']
  },
  {
    id: 'arreglo-25',
    name: 'Ramo Silvestre',
    category: 'ramos',
    price: 380,
    description: 'Ramo de aire natural con flores de campo y hierbas aromáticas, ideal para quien prefiere lo espontáneo y fresco.',
    image: 'arreglo-25',
    alt: 'Ramo de flores de campo y hierbas atado con cordel',
    available: true,
    featured: false,
    occasions: ['amistad', 'agradecimiento', 'bienvenida']
  },
  {
    id: 'arreglo-26',
    name: 'Arreglo Jardín',
    category: 'arreglos',
    price: 720,
    description: 'Arreglo abundante que recrea un pequeño jardín con flores variadas y verdor, perfecto para un regalo generoso.',
    image: 'arreglo-26',
    alt: 'Arreglo floral abundante con flores variadas y mucho follaje',
    available: true,
    featured: false,
    occasions: ['día de las madres', 'cumpleaños', 'agradecimiento']
  },
  {
    id: 'arreglo-27',
    name: 'Rosas y gerberas',
    category: 'rosas',
    price: 640,
    description: 'Rosas combinadas con gerberas de colores vivos, un ramo alegre que equilibra lo romántico con lo festivo.',
    image: 'arreglo-27',
    alt: 'Ramo de rosas y gerberas de colores sobre fondo neutro',
    available: true,
    featured: false,
    occasions: ['amor', 'cumpleaños', 'aniversario']
  },
  {
    id: 'arreglo-28',
    name: 'Girasoles en canasta',
    category: 'girasoles',
    price: 590,
    description: 'Canasta rústica llena de girasoles frescos, una presentación cálida y campirana para regalar con cariño.',
    image: 'arreglo-28',
    alt: 'Canasta de mimbre con girasoles amarillos y follaje',
    available: true,
    featured: false,
    occasions: ['cumpleaños', 'agradecimiento', 'amistad']
  },
  {
    id: 'arreglo-29',
    name: 'Orquídea en maceta',
    category: 'plantas',
    price: 620,
    description: 'Orquídea elegante en maceta decorativa, un regalo sofisticado y duradero para una persona muy especial.',
    image: 'arreglo-29',
    alt: 'Orquídea blanca en maceta decorativa sobre superficie clara',
    available: true,
    featured: false,
    occasions: ['aniversario', 'día de las madres', 'agradecimiento']
  },
  {
    id: 'arreglo-30',
    name: 'Tarjeta y flor',
    category: 'detalles',
    price: 180,
    description: 'Detalle mínimo con una flor y una tarjeta personalizada, ideal para acompañar un obsequio o dar las gracias.',
    image: 'arreglo-30',
    alt: 'Una flor individual junto a una tarjeta escrita a mano',
    available: true,
    featured: false,
    occasions: ['agradecimiento', 'amistad', 'disculpa']
  },
  {
    id: 'arreglo-31',
    name: 'Ramo Pasión',
    category: 'ramos',
    price: 620,
    description: 'Ramo en tonos rojos intensos con follaje oscuro, pensado para declaraciones de amor y fechas de aniversario.',
    image: 'arreglo-31',
    alt: 'Ramo de flores rojas con follaje oscuro envuelto en papel',
    available: true,
    featured: false,
    occasions: ['amor', 'aniversario', 'disculpa']
  },
  {
    id: 'arreglo-32',
    name: 'Arreglo Fiesta',
    category: 'arreglos',
    price: 850,
    description: 'Arreglo vistoso y colorido para celebraciones, con flores llamativas que se roban las miradas en cualquier mesa.',
    image: 'arreglo-32',
    alt: 'Arreglo floral colorido y llamativo en base decorativa',
    available: true,
    featured: false,
    occasions: ['cumpleaños', 'graduación', 'amistad']
  },
  {
    id: 'arreglo-33',
    name: 'Rosas en caja',
    category: 'rosas',
    price: 780,
    description: 'Rosas frescas acomodadas en caja de regalo, una presentación moderna y muy cuidada para sorprender de verdad.',
    image: 'arreglo-33',
    alt: 'Rosas rojas acomodadas dentro de una caja de regalo',
    available: true,
    featured: false,
    occasions: ['amor', 'aniversario', 'cumpleaños']
  },
  {
    id: 'arreglo-34',
    name: 'Girasoles con follaje',
    category: 'girasoles',
    price: 340,
    description: 'Girasoles sencillos con abundante follaje verde, una opción fresca y accesible para alegrar cualquier rincón.',
    image: 'arreglo-34',
    alt: 'Ramo sencillo de girasoles con abundante follaje verde',
    available: true,
    featured: false,
    occasions: ['amistad', 'bienvenida', 'cumpleaños']
  },
  {
    id: 'arreglo-35',
    name: 'Bonsái pequeño',
    category: 'plantas',
    price: 560,
    description: 'Bonsái de porte pequeño en maceta artesanal, un regalo con encanto para quien disfruta cuidar plantas con paciencia.',
    image: 'arreglo-35',
    alt: 'Pequeño bonsái en maceta artesanal sobre mesa de madera',
    available: true,
    featured: false,
    occasions: ['graduación', 'agradecimiento', 'bienvenida']
  },
  {
    id: 'arreglo-36',
    name: 'Vela y flores secas',
    category: 'detalles',
    price: 320,
    description: 'Set de vela aromática con flores secas, un detalle acogedor para regalar calma y buen aroma en el hogar.',
    image: 'arreglo-36',
    alt: 'Vela aromática acompañada de un pequeño ramo de flores secas',
    available: true,
    featured: false,
    occasions: ['agradecimiento', 'amistad', 'bienvenida']
  },
  {
    id: 'arreglo-37',
    name: 'Ramo Nube',
    category: 'ramos',
    price: 350,
    description: 'Ramo ligero de flores blancas y gypsophila que parece una nube, delicado para felicitaciones y detalles tiernos.',
    image: 'arreglo-37',
    alt: 'Ramo de flores blancas y gypsophila envuelto en papel claro',
    available: true,
    featured: false,
    occasions: ['amistad', 'graduación', 'bienvenida']
  },
  {
    id: 'arreglo-38',
    name: 'Arreglo Majestuoso',
    category: 'arreglos',
    price: 1250,
    description: 'Arreglo grande y espectacular con flores selectas para grandes ocasiones, cuando quieres causar una impresión inolvidable.',
    image: 'arreglo-38',
    alt: 'Arreglo floral grande y espectacular en jarrón alto',
    available: true,
    featured: false,
    occasions: ['aniversario', 'amor', 'graduación']
  },
  {
    id: 'arreglo-39',
    name: 'Rosas de colores',
    category: 'rosas',
    price: 490,
    description: 'Ramo de rosas en distintos colores para transmitir alegría y variedad, ideal para un cumpleaños o una amistad querida.',
    image: 'arreglo-39',
    alt: 'Ramo de rosas de varios colores sobre fondo claro',
    available: true,
    featured: false,
    occasions: ['cumpleaños', 'amistad', 'agradecimiento']
  },
  {
    id: 'arreglo-40',
    name: 'Girasoles a granel',
    category: 'girasoles',
    price: 640,
    description: 'Ramo generoso repleto de girasoles frescos, una explosión de color y energía para celebrar a lo grande.',
    image: 'arreglo-40',
    alt: 'Ramo grande y abundante de girasoles amarillos',
    available: true,
    featured: false,
    occasions: ['cumpleaños', 'graduación', 'amistad']
  }
];

/* ---------- Validación de datos (solo consola, no bloquea la UI) ---------- */
(function validateCatalog(){
  var ids = {};
  var catIds = FL.CATEGORIES.map(function(c){ return c.id; });
  FL.PRODUCTS.forEach(function(p){
    if (ids[p.id]) console.warn('[FL] id de producto duplicado:', p.id);
    ids[p.id] = true;
    if (catIds.indexOf(p.category) === -1) console.warn('[FL] categoría inexistente en producto "' + p.id + '":', p.category);
    if (!p.alt) console.warn('[FL] falta "alt" en producto:', p.id);
    if (p.price !== null && typeof p.price !== 'number') console.warn('[FL] precio inválido en producto:', p.id);
  });
})();
