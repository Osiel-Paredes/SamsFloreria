# Florería Sam's — Sitio web

Sitio estático (HTML5 + CSS3 + JavaScript vanilla) para una florería local.
Sin backend, sin base de datos, sin frameworks, sin build step.
La única dependencia es GSAP, auto-hospedada en `assets/vendor/gsap/`.

## Cómo abrir el proyecto

Puedes abrir `index.html` directamente con doble clic en el navegador, o
servirlo con cualquier servidor estático simple, por ejemplo:

```
python3 -m http.server 8000
```

(el servidor local es opcional, solo para probar rutas; el sitio funciona
igual abriendo el archivo directamente).

---

## ⚠️ Pendientes antes de publicar

1. **Datos del negocio.** Revisa `js/config.js`: los campos marcados con
   `[PENDIENTE]` son de ejemplo (número de WhatsApp `442 123 4567`, dirección
   `Av. de las Flores 123`, dominio `floreriasams.com.mx`). **Este es el
   pendiente más urgente**: el número de WhatsApp de ejemplo es el destino de
   todos los botones de pedido del sitio.
2. **Dominio real.** Reemplaza `floreriasams.com.mx` en `js/config.js`,
   en los `<meta>` de cada HTML, en `sitemap.xml` y en `robots.txt`.
3. **Datos de cada producto.** Las 40 fotos reales ya están conectadas, pero
   `name`, `category`, `price`, `description` y `occasions` siguen siendo
   genéricos (`Arreglo 01`, `Consultar precio`...). Edítalos en
   `js/data/products.js`.
4. **Precios reales.** Mientras `price` sea `null`, la tarjeta muestra
   "Consultar precio".
5. **Cifras y testimonios del Home.** Las tres cifras de la banda oscura
   (`data-count` en `index.html`) y los tres testimonios son de ejemplo.
   Cámbialos por datos reales o quita esas secciones.
6. **Imagen de redes sociales.** `assets/img/marca/og-default.jpg` usa la
   imagen de muestra. Reemplázala por una foto real (1200×630) antes de
   publicar; es el preview que se ve al compartir el link.

### Ya resuelto

- **Fuentes.** El sitio usa Fraunces (títulos) e Inter (texto), ambas
  auto-hospedadas en `assets/fonts/` como WOFF2 subset latin y precargadas
  en el `<head>`. Las dos son OFL, uso comercial permitido.
- **Texto que se recomponía en cada carga.** Las fuentes usaban
  `font-display: swap` y el stack de títulos era
  `'Fraunces', 'Libre Baskerville', Georgia…`. Resultado: el navegador
  pintaba con la fuente de sistema, luego descargaba Libre Baskerville y
  luego Fraunces, recomponiendo todo el texto hasta tres veces por carga
  (se percibía como un tirón general, más visible en los textos). Ahora es
  `font-display: optional` y el respaldo es serif del sistema: el texto
  nunca se recompone. Los `libre-baskerville*.woff2` quedan sin usar y
  puedes borrarlos.
- **Movimiento de entrada en cero.** El token `--anim-shift` (en
  `css/base.css`) vale `0px`: el contenido entra con un fundido, sin
  desplazarse. Súbelo si quieres recuperar el deslizamiento.
- **Halo de sección que invadía la anterior.** `.section--glow::before`
  empezaba en `top: -10%` y pintaba una banda de color sobre el final de la
  sección de arriba. Ahora queda dentro de su sección y se difumina con una
  máscara.
- **Hero del Home sin foto de fondo.** Antes el Home abría con
  `assets/img/hero/fondo.png` (1.9 MB) estirado a todo el viewport: se veía
  blando porque se ampliaba muy por encima de su resolución útil, y empujaba
  el catálogo fuera de la primera pantalla. Ahora el fondo es degradado puro
  (`--grad-deep` + dos radiales) y las fotos del hero son tres miniaturas de
  producto de ~150-260 px de ancho servidas desde el archivo de 600 px, así
  que se ven nítidas. Los `fondo-*.webp` y `fondo.png` quedan sin usar:
  puedes borrarlos.
- **Contenido del hero recortado.** `.hero__content` limitaba su ancho con
  `max-width: 20ch`. La unidad `ch` se resuelve con la tipografía del propio
  elemento (Inter 1 rem), no con la del título, así que la columna quedaba en
  ~180 px: el título se cortaba a media palabra y los botones perdían su
  etiqueta. El límite ahora va en `rem`.
- **Hero por debajo del header.** El hero llevaba `margin-top` negativo de la
  altura del header, pensado para un header en flujo. Pero `.header--overlay`
  es `position: fixed`, o sea que no ocupa espacio: el margen recortaba los
  primeros 80 px del hero y su contenido pisaba el logo. La compensación se
  hace solo con `padding-top`.
- **Datos contradictorios.** El JSON-LD decía Querétaro mientras el título
  decía Xicotepec. Todo está unificado en Xicotepec de Juárez, Pue.
- **Scripts inline.** La CSP de `netlify.toml` (`script-src 'self'`) los
  bloqueaba, así que el año del footer nunca se pintaba en producción.
  Ahora vive en `js/boot.js`.

---

## Sistema de diseño

Los tokens están en `css/base.css`, dentro de `:root`. Es el único lugar
donde se cambia color, tipografía, espaciado, radios o sombras.

- **Color.** El morado (`--primary`) es el ancla de marca pero se usa en
  ~10% de la superficie. El resto descansa en neutros cálidos
  (`--bg`, `--surface-warm`). `--surface-deep` y `--grad-deep` son las
  bandas oscuras (footer, sección de cifras).
- **`--primary-light` no se usa nunca en texto pequeño**: no alcanza el
  contraste 4.5:1. Para texto morado sobre claro se usa `--primary-dark`.
- **Tipografía.** Fraunces variable con `font-optical-sizing: auto` para los
  títulos, Inter para el resto.
- **Textura.** `body::after` aplica un grano SVG al 2.8% de opacidad sobre
  todo el sitio para evitar el aspecto de color plano.

## Capa de movimiento

Toda la animación vive en dos archivos: `css/motion.css` (estados iniciales)
y `js/motion.js` (timelines de GSAP). No hay animaciones dispersas en otros
archivos.

**Cómo animar un elemento nuevo:** añade un atributo en el HTML, no escribas
JavaScript.

```html
<div data-anim="fade-up">Entra desde abajo al hacer scroll</div>
<div data-anim="fade-up" data-anim-delay="0.1">Igual, con retardo</div>
<div data-anim-group>Sus hijos entran en cascada uno tras otro</div>
<div data-anim-mask>Imagen que se descubre de abajo hacia arriba</div>
```

Valores de `data-anim`: `fade`, `fade-up`, `fade-down`, `fade-left`,
`fade-right`, `scale`.

**Reglas de seguridad del sistema:**

- Los estados ocultos solo se aplican bajo `html.js-anim`, clase que añade
  `js/boot.js`. Si el JavaScript falla o está bloqueado, **nada queda
  invisible**.
- **Lo que ya se ve al cargar no se desplaza**: solo hace un fundido en su
  sitio. El deslizamiento se reserva para lo que entra al hacer scroll. Sin
  esto, cada recarga movía el contenido visible de golpe y se percibía como
  un tirón.
- **Las rejillas de tarjetas (`data-anim-group`) no se desplazan nunca**:
  entran solo con un fundido en cascada corta. Mover 4-6 tarjetas con sus
  fotos mientras se scrollea hacía que la página pareciera trabarse. El
  desplazamiento corto (14 px) queda para elementos sueltos como los
  títulos de sección.
- **Las imágenes de la primera pantalla van con `loading="eager"`**
  (las tres miniaturas del hero). Con `lazy` llegaban tarde y aparecían de
  golpe al recargar.
- **Un grupo no se marca como revelado hasta que tiene hijos.** Los
  contenedores que rellena `js/home.js` están vacíos cuando arranca
  `motion.js`; si se marcaran antes, la segunda pasada los saltaría y las
  tarjetas se quedarían invisibles para siempre. Al sustituir el contenido de
  un grupo hay que poner `container._flRevealed = false` antes de volver a
  llamar a `FL.motion.reveals()` (lo hace `swap()` en `home.js`).
- **Las filas del Home reservan su altura** con cajas invisibles
  (`<span class="skel">`) que `home.js` sustituye. Sin ellas el documento
  crecía ~2000 px al cargar: el hero se estiraba y empujaba el contenido
  hacia abajo. Si agregas una fila nueva, copia también sus `.skel`.
- Si GSAP no carga, `motion.js` cambia `.js-anim` por `.no-js-anim` y el
  sitio se muestra completo con transiciones CSS.
- Con `prefers-reduced-motion: reduce` no hay reveals, parallax, velo de
  transición ni contadores. El contenido aparece directo en su estado final.
  Por eso las cifras llevan su valor definitivo escrito en el HTML.
- Los efectos de hover (botón magnético) solo se activan bajo
  `(hover: hover) and (pointer: fine)`: en táctil no se registran.

**Plugins de GSAP por página** (cada uno carga solo lo que usa):

| Página | gsap | ScrollTrigger | SplitText | Flip |
|---|---|---|---|---|
| `index.html` | ✓ | ✓ | ✓ (título del hero) | |
| `catalogo.html` | ✓ | ✓ | | ✓ (chips) |
| `contacto.html` | ✓ | ✓ | | |

Para actualizar GSAP, reemplaza los archivos de `assets/vendor/gsap/` por la
versión nueva desde https://cdn.jsdelivr.net/npm/gsap@VERSION/dist/

---

## Mantenimiento del catálogo

El catálogo completo vive en **`js/data/products.js`**. Es el único archivo
que necesitas editar para agregar, quitar o modificar productos. No es
necesario tocar el HTML ni el CSS.

### Agregar un producto nuevo

1. Prepara la foto (ver sección de imágenes abajo) y agrégala en
   `assets/img/productos/`.
2. Copia un bloque de producto existente en `js/data/products.js` y edítalo:

```js
{
  id: 'nombre-unico-del-producto',   // usa el mismo nombre que el archivo de imagen
  name: 'Nombre del Arreglo',
  category: 'ramos',                 // debe existir en FL.CATEGORIES
  price: 650,                        // número, sin signo de pesos ni comas
  description: 'Descripción corta, 1-2 frases.',
  image: 'nombre-unico-del-producto',// sin extensión, sin sufijo de tamaño
  alt: 'Descripción de la foto para personas que no pueden verla',
  available: true,
  featured: false,                   // true = aparece en "Nuestros favoritos" del Home
  occasions: ['cumpleaños', 'amor']   // opcional, ayuda a la búsqueda
}
```

3. Guarda el archivo. No necesitas reiniciar nada: el producto aparece la
   próxima vez que se cargue la página.

### Eliminar un producto

Borra su bloque completo (desde `{` hasta la `}` con su coma) dentro del
arreglo `FL.PRODUCTS`.

### Cambiar el precio

Edita el número en la propiedad `price` de ese producto.
Si el precio varía (por ejemplo, según tamaño), usa además
`priceNote: 'desde'` para mostrar "desde $650" en lugar de un precio fijo.

### Cambiar la imagen de un producto

1. Agrega la nueva imagen en `assets/img/productos/` siguiendo el naming de
   la sección de imágenes.
2. Cambia el valor de `image` en ese producto para que apunte al nuevo nombre
   de archivo (sin extensión).

### Cambiar la categoría de un producto

Cambia el valor de `category` por el `id` de otra categoría existente en
`FL.CATEGORIES` (por ejemplo: `'ramos'`, `'rosas'`, `'girasoles'`).

### Marcar un producto como destacado

Cambia `featured: false` a `featured: true`. Aparecerá en la sección
"Nuestros favoritos" del Home (máximo se muestran 6).

### Desactivar (marcar como agotado) un producto

Cambia `available: true` a `available: false`. El producto no se elimina:
sigue visible en el catálogo, al final, en gris, con la etiqueta "Agotado",
y el botón de WhatsApp cambia a "Consultar disponibilidad".

### Agregar una categoría nueva

Agrega un objeto al arreglo `FL.CATEGORIES` en `js/data/products.js`:

```js
{ id: 'ocasiones-especiales', name: 'Ocasiones especiales', image: 'placeholder' }
```

Aparecerá automáticamente como chip de filtro en el catálogo y como tarjeta
en el Home (una vez que algún producto use esa categoría y tengas la imagen
correspondiente en `assets/img/categorias/`).

### Qué se muestra en el Home

El Home es una vitrina del catálogo: hero corto y, enseguida, filas de
producto. Cada fila se declara en `index.html` con un atributo, y `js/home.js`
la rellena desde `js/data/products.js`:

```html
<!-- 4 productos de la categoría "ramos" -->
<div class="product-row" data-home-row="ramos" data-home-limit="4" data-anim-group></div>

<!-- 4 productos con featured: true -->
<div class="product-row" data-home-row="featured" data-home-limit="4" data-anim-group></div>
```

- `data-home-row`: el `id` de una categoría, o `featured`, o `todos`.
- `data-home-limit`: cuántos productos mostrar (por defecto 4).
- `data-home-variant="pick"`: solo la foto, sin nombre ni precio. Es lo que
  usan las tres miniaturas del hero.

Para agregar otra fila (por ejemplo girasoles), copia una sección completa de
`index.html`, cambia el título y el `data-home-row`. Si una fila se queda sin
productos disponibles, su sección se oculta sola en lugar de quedar vacía.

**Sobre el tamaño de las fotos:** las filas muestran la imagen a un máximo de
~300 px de ancho (2 columnas en móvil, 4 en escritorio) tomándola del archivo
de 600 px. Esa es la razón de no poner fotos a pantalla completa: al ampliar
una foto muy por encima de su resolución útil se ve blanda.

---

## Cómo preparar y agregar la foto real de un producto

1. Toma la foto con fondo claro y neutro, luz natural, el arreglo completo
   y algo de aire alrededor (sin cortar flores).
2. Recorta la imagen en proporción **4:5** (vertical). Por ejemplo 1200×1500 px.
3. Comprime y convierte a **WebP** calidad ~80. Puedes usar
   [Squoosh](https://squoosh.app) (gratis, en el navegador, sin instalar nada).
4. Genera dos tamaños:
   - `nombre-del-producto-1200.webp` (1200×1500) — para el detalle.
   - `nombre-del-producto-600.webp` (600×750) — para la tarjeta del catálogo.
5. Guarda ambos en `assets/img/productos/`.
6. En `js/data/products.js`, cambia `image: 'placeholder'` por
   `image: 'nombre-del-producto'` (sin el sufijo de tamaño ni la extensión).
7. Escribe un `alt` real que describa la foto (no "imagen1.jpg").

Mientras no tengas la foto real, el producto sigue funcionando normalmente
con la imagen de muestra.

## Cómo preparar la foto de una categoría

Igual que arriba, pero 800×800 px (1:1), guardada en
`assets/img/categorias/cat-<id>.webp`. El Home ya no usa foto de hero: su
fondo es degradado y las fotos que aparecen son de producto.

---

## Estructura del proyecto

```
index.html          Página de inicio (vitrina del catálogo)
catalogo.html        Catálogo con filtros, búsqueda y modal de producto
contacto.html         WhatsApp, teléfono, dirección, horarios, mapa
404.html               Página de error

css/base.css           Tokens de diseño (color, tipografía, espaciado), reset
css/layout.css          Header, nav, menú móvil, footer, grids
css/components.css      Botones, tarjetas, chips, buscador, modal, badges, toast
css/pages.css            Estilos específicos de cada página
css/motion.css            Estados iniciales de animación (ver "Capa de movimiento")

js/boot.js                Clase .js-anim y año del footer (sin defer, en el <head>)
js/config.js               Datos del negocio (WhatsApp, dirección, horarios...)
js/data/products.js         Catálogo de productos y categorías (edítalo tú)
js/lib/dom.js                Helpers de DOM (selección, creación de elementos)
js/lib/format.js              Formateo de precio, slugs, normalización de texto
js/whatsapp.js                 Construcción de links y mensajes de WhatsApp
js/motion.js                    Todas las animaciones de GSAP
js/ui.js                         Header con scroll, menú móvil, botón flotante
js/catalog.js                     Filtrado, búsqueda, render del grid
js/product-modal.js                Modal de detalle de producto
js/home.js                          Render de categorías y destacados en el Home

assets/vendor/gsap/                 GSAP 3.13 auto-hospedado (UMD, sin build)
assets/img/placeholder.svg          Imagen de muestra (temporal)
assets/img/productos/                Fotos de producto (600w y 1200w)
assets/img/categorias/                Fotos de categoría (800×800)
assets/img/hero/                       Fotos de hero (WebP + PNG original)
assets/img/marca/                       Logo, imagen OG, mapa estático
assets/icons/icons.svg                   Sprite de iconos (referencia; inyectado inline en cada HTML)
assets/fonts/                             Fuentes WOFF2 (Fraunces, Inter)
```

## Cómo funciona el detalle de producto

El detalle se muestra en un modal (`<dialog>`), no en una página aparte.
La URL cambia a `catalogo.html?p=<id-del-producto>` para que se pueda
compartir el link exacto de un arreglo por WhatsApp. Al cerrar el modal,
la URL y el scroll vuelven a su estado anterior.

## Despliegue

El sitio es 100% estático: se publica subiendo la carpeta completa a
cualquier hosting estático. Recomendado: [Netlify](https://netlify.com)
(plan gratuito), con `publish = "."` y sin build command. El archivo
`netlify.toml` ya incluye headers de seguridad y cache.

Antes de publicar:
- Reemplaza `baseUrl` en `js/config.js` y todas las URLs `https://www.floreriasams.com.mx`
  en los `<meta>` de cada HTML por el dominio real.
- Completa los pendientes listados al inicio de este documento.
