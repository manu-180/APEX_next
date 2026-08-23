# Experiencia de la página de destino — diagnóstico medido

**Fecha:** 2026-08-23
**Alcance:** `https://www.theapexweb.com/servicios` y `/servicios#pricing` (landings de la campaña "Apex search", cuenta 4869983637)
**Motivo:** 26 de 30 keywords con "experiencia en la página de destino" POR DEBAJO DEL PROMEDIO. 23 con QS ≤ 4. CPC promedio $501 ARS.
**Naturaleza del documento:** diagnóstico. No se editó ningún archivo del sitio.

> Todo número de este informe salió de una medición ejecutada el 2026-08-23 contra el sitio productivo o contra el build de producción. Los comandos exactos están en la sección 4. Lo que no pude medir está en la sección 5, sin estimaciones que lo tapen.

---

## 0. Resumen ejecutable

El sitio **no está roto de velocidad**. Lighthouse mobile da 87/100 y CLS 0. La velocidad contribuye pero no explica 26 de 30.

Lo que sí está roto es el **primer factor que Google evalúa: la correspondencia entre lo que la persona buscó y lo que la página dice**. Se compran clics de "presupuesto sitio web" y "cuanto cuesta crear una pagina web", y la primera pantalla en mobile dice *"Software a medida"* sin un solo precio a la vista.

| Causa | Métrica que la respalda |
|---|---|
| 1. Mismatch de vocabulario consulta ↔ landing | `"diseño de sitios web"`, `"sitios web"`, `"diseño web"`, `"desarrollo web"`, `"creación de páginas web"` = **0 apariciones**. `"página web"` = 1 aparición, en el **82,9%** del documento |
| 2. La primera pantalla no responde la pregunta | **0 de 7 precios** visibles sin scrollear a 375 px. Primer precio a 759 px, fold a 667 px |
| 3. Velocidad mobile en banda "necesita mejorar" + página desproporcionada | LCP **3,2 s**, FCP **2,3 s**, Speed Index **4,7 s**, main-thread **2,3 s**, página de **17.981 px = 27 pantallas** |

---

## 1. Las 3 causas más probables

### Causa 1 — El contenido no habla el idioma de la búsqueda

Esto es el factor de mayor peso en "relevancia y originalidad del contenido respecto de la búsqueda", y es el que está peor.

**Lo que dice la página hoy:**

| Elemento | Contenido literal |
|---|---|
| `<title>` | `Desarrollo de software Argentina \| Precios \| Manuel Navarro` |
| `<h1>` | `Software a medida, con precio publicado.` |
| Primera palabra clave del texto visible | `software`, en el **char 88 de 10.832** (0,8% del documento) |

**Presencia de las keywords que efectivamente pagan los clics** (sobre las 1.820 palabras visibles de la página renderizada):

| Keyword | Apariciones | Primera aparición |
|---|---|---|
| `diseño de sitios web` | **0** | — |
| `sitios web` | **0** | — |
| `diseño web` | **0** | — |
| `desarrollo web` | **0** | — |
| `creación de páginas web` | **0** | — |
| `cuanto cuesta` (sin tilde, como se busca) | **0** | — |
| `presupuesto sitio web` | **0** | — |
| `presupuesto página web` | **0** | — |
| `página web` | 1 | char 8.983 → **82,9% del documento** (dentro de la FAQ) |
| `cuánto cuesta` | 1 | char 8.965 → **82,8% del documento** |
| `sitio web` | 2 | char 822 → 7,6% |
| `presupuesto` | 2 | char 4.294 → 39,6% |
| `software` | 2 | char 88 → **0,8%** |

Los seis H2 de la página tampoco contienen ninguna de esas keywords:

```
h2[0] Encontrá el plan que hace crecer tu negocio.
h2[1] No te pido que confíes en una promesa. Mirá lo que recibís a cada precio.
h2[2] De la idea al lanzamiento, sin sorpresas en el camino.
h2[3] Integración fiscal AFIP / ARCA
h2[4] Las dudas de siempre, respondidas sin vueltas.
h2[5] ¿Arrancamos con tu proyecto?
```

**Nota justa sobre originalidad:** el contenido *no* es genérico ni de plantilla. Es específico y argentino (AFIP/ARCA, cuotas sin interés, precios en ARS por escrito, comparativa contra WordPress/Wix/Tiendanube, muestrario con 7 sitios reales linkeados). La originalidad no es el problema; **la correspondencia con la consulta sí lo es**. La página está escrita para alguien que ya sabe que quiere "software a medida", no para alguien que googleó "cuanto cuesta una pagina web".

---

### Causa 2 — La primera pantalla en mobile no muestra un precio

Medido con Chrome headless real a 375×667 (iPhone SE / 13 mini, DPR 2, UA mobile), no estimado.

| Métrica | 375 px (fold 667 px) | 412 px (fold 823 px) |
|---|---|---|
| Alto total de la página | **17.981 px** = 27 pantallas | 17.192 px = 20,9 pantallas |
| `#pricing` empieza en | **1.120 px** (1,7 pantallas) | 1.079 px |
| Primer precio del DOM (14 px de tamaño) | **759 px** | 718 px |
| **Precios visibles sin scrollear** | **0 de 7** | 2 de 7 |
| Primer precio en tamaño legible (30 px, `ARS 300.000`) | **4.915 px = 7,4 pantallas** | 4.640 px aprox |
| Nodos DOM | 1.338 | 1.335 |

**Texto que ve realmente un usuario mobile de 375 px al aterrizar en `/servicios`, sin scrollear** (extraído del DOM renderizado, filtrando por `opacity`, `visibility` y bounding box dentro del viewport):

```
Servicios y precios
Software a medida,
con precio publicado.
Tres planes de web y planes de app, con precio publicado. El…
No sé qué necesito, escribime
Ver planes
Te respondo en menos de 1 h
Boceto gratis en 24-48 h
3 cuotas sin interés
```

Cero precios. Cero mención de "página web" o "sitio web". Cero mención de "presupuesto". El único número que se ve es "24-48 h" y "1 h".

**El ancla `#pricing` sí funciona y sí arregla esto.** Aterrizando en `/servicios#pricing` el navegador queda en `scrollY = 1024` y lo visible pasa a ser:

```
Precios transparentes
Encontrá el plan que hace crecer tu negocio.
Precios en ARS, pactados por escrito antes de arrancar. Prim…
Sitio Web | App a medida
Esencial · Landing Page · ARS 300.000
```

Confirmado: el commit `74d13db fix(ads): el trafico pago de #precios aterriza en la tabla de precios` hace lo que promete. **El problema es que la campaña sigue teniendo `/servicios` sin ancla como landing en anuncios activos**, y esa variante muestra 0 precios.

> **Discrepancia con el dato de entrada:** me pasaron que `#pricing` arranca a 2.430 px del tope. No pude reproducirlo: mido **1.120 px a 375 px** y **1.079 px a 412 px**, sobre el HTML productivo actual (`X-Vercel-Cache: HIT`, `Age: 592437` = 6,86 días). El dato de 2.430 px puede ser de un viewport de escritorio, de un deploy anterior, o de otra sección. Vale la pena reconciliarlo antes de tomar decisiones sobre él.

---

### Causa 3 — Velocidad mobile en la banda "necesita mejorar", con causas concretas

**Lighthouse 12.8.2, form-factor mobile, throttling simulado (Slow 4G + 4× CPU), contra producción:**

| Métrica | Valor | Score | Banda |
|---|---|---|---|
| Performance | **87 / 100** | — | — |
| First Contentful Paint | **2,3 s** | 0.73 | necesita mejorar |
| **Largest Contentful Paint** | **3,2 s** | 0.74 | **necesita mejorar (2,5–4 s)** |
| Speed Index | **4,7 s** | 0.70 | necesita mejorar |
| Total Blocking Time | 110 ms | 0.98 | bien |
| **Cumulative Layout Shift** | **0** | 1.00 | perfecto |
| Time to Interactive | 3,2 s | 0.95 | bien |
| Server response time | 60 ms | 1.00 | perfecto |

*(Referencia: la misma URL en desktop da Performance 100 y LCP 0,7 s. El problema es exclusivamente mobile, que es el 100% del tráfico.)*

**Elemento LCP:** no es una imagen, es **texto** — el párrafo subtítulo del hero.

```
selector: div > div.grid > div.max-w-2xl > p.text-pretty
boundingRect: top 288, height 104
texto: "Tres planes de web y planes de app, con precio publicado. Elegís, me escribís p…"
tiempo: 3.150 ms
```

Que el LCP sea texto y aun así tarde 3,2 s significa que **el render está bloqueado por CSS y JS, no por descargar una imagen pesada**. Las causas medidas:

**3a. Un CSS render-blocking de 130 KB**

```
/_next/static/css/ff7678e32297de3f.css
  300 ms de bloqueo (audit render-blocking-resources)
  22.826 bytes brotli / 130.869 bytes sin comprimir
```

Composición de esos 130.869 bytes:

| Cosa | Cantidad |
|---|---|
| Reglas CSS (aprox) | 1.655 |
| Bloques `[data-theme=…]` (los 7 temas) | 19, el primero empieza en el **byte 64.493** |
| Selectores `.dark` | 42 |
| `@keyframes` | 29 |
| Custom properties `--color-*` | 74 |
| `@media` | 21 |

`app/globals.css` pesa **66.217 bytes** por sí solo — la mitad del CSS servido es un archivo escrito a mano con el sistema de 7 temas del portfolio, y se importa en `app/layout.tsx`, o sea que **se descarga y parsea de forma bloqueante en todas las rutas**, incluida la landing paga. Quien buscó "presupuesto sitio web" descarga los 7 temas del portfolio antes de ver la primera letra.

**3b. `experimental.optimizeCss: true` está configurado pero no surte efecto en esta ruta**

`next.config.mjs` tiene `experimental.optimizeCss: true` y `critters@0.0.23` está en `dependencies`. Según la implementación de Next.js ([`packages/next/src/server/post-process.ts`](https://github.com/vercel/next.js/blob/canary/packages/next/src/server/post-process.ts), consultada vía context7), `optimizeCss` instancia critters con `ssrMode: true` y `preload: 'media'`, lo que debería producir (a) CSS crítico inline en un `<style>` y (b) los `<link rel="stylesheet">` convertidos a carga diferida.

Lo que hay realmente en el HTML servido:

```
<style> inline: 0 bytes (0,0% del documento)
<link rel="stylesheet" href="/_next/static/css/ff7678e32297de3f.css" data-precedence="next"/>
<link rel="stylesheet" href="/_next/static/css/4114d3d50aa40a23.css" data-precedence="next"/>
```

Dos `<link>` bloqueantes planos, sin `media="print" onload`, y cero CSS inline. **La optimización está declarada pero no está ocurriendo.** Es un bug de configuración, no una decisión.

**3c. El JS: 371 KB transferidos, 2,3 s de main thread**

Desglose de recursos según Lighthouse mobile:

| Tipo | Requests | Transferido |
|---|---|---|
| **Total** | **33** | **371 KB** |
| Script | 27 | 296 KB |
| Document | 1 | 30 KB |
| Stylesheet | 2 | 23 KB |
| Font | 1 | 12 KB |
| Image | 1 | 1 KB |
| Third-party | **0** | **0 KB** |

Trabajo en el hilo principal — **2,3 s en total**:

| Categoría | Tiempo |
|---|---|
| Script Evaluation | 849 ms |
| Other | 620 ms |
| Style & Layout | 594 ms |
| Rendering | 127 ms |
| Script Parsing & Compilation | 85 ms |
| Parse HTML & CSS | 45 ms |

Los scripts más caros, con su contenido identificado por firma de librería:

| Chunk | Bootup | CPU | Bytes (brotli / raw) | Qué contiene |
|---|---|---|---|---|
| `2117-4ac3505f739e9f47.js` | 556 ms | **539 ms** | 33.082 / 124.727 | react-dom + app-router (núcleo de Next, no removible) |
| `7679-6e13cee4c8099097.js` | **460 ms** | 94 ms | 42.509 / **127.566** | **framer-motion** |
| `9498.28e86309cb74b0f5.js` | 254 ms | 52 ms | ~18 KB | carga diferida (no está en el HTML inicial) |
| `app/servicios/page-…js` | — | — | 34.392 / **132.823** | código de la página |
| `fd9d1056-…js` | 66 ms | 15 ms | 55.083 / 172.837 | framework react-dom |
| `app/layout-…js` | 69 ms | 62 ms | 13.343 / 40.873 | layout raíz |

**Peso total del first load medido con curl (brotli, que es lo que baja un Chrome mobile moderno):**

```
HTML                          29.930 B brotli /   256.803 B sin comprimir
22 JS + 2 CSS                306.747 B brotli / 1.010.879 B sin comprimir
  menos polyfills (nomodule,
  no lo baja un browser moderno)
                             -41.343 B brotli /  -112.594 B
────────────────────────────────────────────────────────────
TOTAL                       ~295.000 B brotli / ~1.155.000 B a parsear
```

Del `next build` (evidencia de primera mano, tamaños gzip):

```
Route (app)                    Size      First Load JS
○ /                            8.62 kB         120 kB
○ /servicios                  37.2 kB         208 kB   ← 2ª ruta más pesada del sitio
○ /contacto                   73.8 kB         223 kB
○ /sobre-mi                   13.9 kB         177 kB
+ First Load JS shared by all                 88.2 kB
```

**Por qué `/servicios` pesa tanto:** los 5 archivos de `app/servicios/` son componentes cliente, y los 5 lo son **por framer-motion**:

```
app/servicios/content.tsx            'use client'  → motion, AnimatePresence, useReducedMotion, Variants
app/servicios/faq-accordion.tsx      'use client'  → AnimatePresence, motion, useReducedMotion
app/servicios/servicios-final-cta.tsx 'use client' → motion, useMotionValue, useReducedMotion, useSpring
app/servicios/servicios-hero-shell.tsx 'use client'→ motion, useScroll, useTransform
app/servicios/static-sections.tsx    'use client'  → motion, Variants
components/sections/afip-addon.tsx   'use client'  → motion, useReducedMotion
```

`app/servicios/content.tsx` son 794 líneas / 35.090 bytes; `static-sections.tsx` son 815 líneas / 36.477 bytes. En todo el repo hay **74 componentes cliente** y **39 archivos que importan framer-motion**.

**Nota de honestidad — el HTML de 256 KB no es tan malo como parece.** De los 256.803 bytes sin comprimir, 55.460 son `<script>` inline (de los cuales 38.001 son el payload RSC de React) y 201.343 son markup real. Comprimido son 29.930 bytes, y el DOM resultante son 1.338 nodos. Lighthouse marca "Avoid an excessive DOM size" con score 0.5 (1.273 elementos en su medición), o sea es una advertencia, no una catástrofe. El HTML no es la causa principal.

**Nota — lo que NO es un problema, aunque parezca:**
- `polyfills-42372ed130431b0a.js` pesa 41.343 B brotli, pero se sirve con `noModule=""` y **no lo descarga ningún browser moderno**. No cuenta.
- CLS = 0. No hay saltos de layout.
- No hay scroll horizontal de página: `scrollWidth == clientWidth == 375`.
- TTFB de servidor: 60 ms. El CDN de Vercel responde desde `gru1` (São Paulo), el POP correcto para Argentina. `X-Vercel-Cache: HIT`. La infraestructura está bien.
- Third-party requests: **0**. GA4/Google Ads se inyecta a propósito recién tras la primera interacción del usuario (o 25 s de failsafe) — está documentado en `components/analytics/google-analytics-root.tsx`. Es una decisión deliberada de performance, no un bug. (Ver nota en §6.)

---

## 2. Problemas de mobile y transparencia (medidos, contribuyen pero no lideran)

### Tipografía por debajo del mínimo

**81 elementos de texto con font-size menor a 12 px.** Distribución completa a 375 px:

```
 7px:  1     8px:  5     9px:  7    10px: 34    11px: 34
12px:109    14px: 99    16px: 26    18px:  5    20px:  8
24px:  2    30px:  8    36px:  4    44px:  1    48px:  1    144px: 1
```

Ejemplos reales de texto a 11 px: `Esencial`, `Más elegido`, `E-commerce`, `Calculadora · 60 seg`, `Boceto gratis antes de pagar`, `3 cuotas sin interés`, `Entrega en 15 días`. Son justamente los diferenciadores comerciales, en el tamaño más chico de la página.

### Targets táctiles

**19 de 72 elementos clickeables tienen menos de 44 px en alguna dimensión.** Muestra:

| Elemento | Tamaño | Texto |
|---|---|---|
| `<a>` | 32×32 | (logo) |
| `<button>` | 110×**40** | `Sitio Web` |
| `<button>` | 137×**40** | `App a medida` |
| `<a>` | 161×**16** | `Ver qué incluye este plan` (×3) |
| `<a>` | 174×**16** | `Ver el muestrario completo` |
| `<a>` | 142×**16** | `Verlos flotando en 3D` |
| `<a>` | 262×**32** | `¿Otra duda? Escribime directo` |
| `<a>` | 159×**20** | `+54 9 11 3427 2488` |

Los CTAs principales sí están bien (48 px de alto) y las filas del panel de decisión también (65 px). El problema son los links secundarios de 16 px de alto — incluido **el número de teléfono**, que es exactamente el elemento de transparencia que Google mira.

### Tabla comparativa con scroll horizontal anidado

```
ancho de la <table>:            640 px
ancho del contenedor:          275 px  (overflow-x-auto rounded-xl)
primera columna sticky:        142 px
espacio útil restante:         133 px
```

**El 57% de la tabla está fuera de vista** y hay que hacer scroll horizontal dentro de ella. La tabla arranca en el px 12.411 (pantalla 18,6), así que impacta poco en volumen, pero es un problema real de "facilidad de navegación".

### Contraste — 6 fallos WCAG AA

| Contraste medido | Colores | Elemento |
|---|---|---|
| **2,53:1** | `#505052` sobre `#050508` | `footer#site-footer … p.text-xs` |
| **2,53:1** | `#505052` sobre `#050508` | `div.flex > span` |
| **3,02:1** | `#64748b` sobre `#262939` | `button.relative > span.relative` |
| **4,27:1** | `#64748b` sobre `#050508` | `p.editorial-label` |
| **4,27:1** | `#64748b` sobre `#050508` | `span.font-semibold` (×2) |

Mínimo AA para texto normal: 4,5:1. Ninguno llega. Accesibilidad global de la página: 96/100.

### Elemento flotante

Un solo elemento flotante detectado (el botón de WhatsApp), no dos:

```
position: fixed, z-index: 60, 58×56 px
posición a 375 px: x=293..351, y=587..643
margen derecho: 24 px | margen inferior del fold: 24 px
apilamiento debajo: svg → span → button → ul.flex → div.max-w-2xl
```

Se apoya sobre `ul.flex`, que es la strip de confianza del hero (`Te respondo en menos de 1 h · Boceto gratis en 24-48 h · 3 cuotas sin interés`). Tapa parte de esa línea en la primera pantalla. Es menor: no tapa ningún CTA ni ningún precio. No detecté un chatbot montado en `/servicios`.

### Mapa completo de la página a 375 px

```
pant.  top(px)  alto   id              encabezado
  0.1      56   1064                   Software a medida, con precio publicado.
  1.7    1120   3360   pricing         Encontrá el plan que hace crecer tu negocio.
  6.7    4480   5160   casos-reales    No te pido que confíes en una promesa…
 14.5    9640   1168   proceso         De la idea al lanzamiento, sin sorpresas…
 16.3   10856    619                   Sin agencia en el medio, directo con el dev…
 17.3   11523    840                   Integración fiscal AFIP / ARCA
 18.6   12411   1121                   APEX vs WordPress vs Wix vs Tiendanube…
 20.4   13580    501                   ¿Sos médico, abogado o contador?
 21.2   14129   2295   faq             Las dudas de siempre, respondidas sin vueltas.
 24.7   16488    554                   Ya viste precios y proceso. Falta tu proyecto.
 25.6   17106    875   site-footer     ¿Arrancamos con tu proyecto?
```

**27 pantallas de scroll.** Todo lo que está más allá de la pantalla 14 (proceso, comparativa, verticales, FAQ, CTA final) es, en la práctica, contenido que un visitante pago nunca ve — pero sí lo descarga, lo parsea y lo renderiza.

---

## 3. Plan ordenado por impacto / esfuerzo

Ordenado por lo que más mueve el CPC de $501 por unidad de trabajo. Los tres primeros son todos de esfuerzo bajo y atacan la causa #1 y #2, que es donde está el problema.

### P1 · Reescribir el hero y el `<title>` para que contengan la palabra que se busca
**Impacto: alto · Esfuerzo: bajo (2–4 h de copy + deploy)**

| Archivo | Qué tocar |
|---|---|
| `app/servicios/page.tsx` | `metadata.title` (hoy `Desarrollo de software Argentina \| Precios`) y `metadata.description` |
| `app/servicios/static-sections.tsx` | El `<h1>` de `ServiciosHero` (hoy `Software a medida,` / `con precio publicado.`) y el párrafo LCP debajo |

El H1 y el título tienen que contener **"página web"** o **"sitio web"** y, preferentemente, un precio. Hoy la única palabra que el usuario buscó aparece recién en el 82,9% del documento.

**Aguja esperada:** es el factor de mayor peso en la evaluación de Google. Movimiento plausible de "por debajo del promedio" a "promedio" en el subconjunto de keywords de páginas web, que es la mayoría del gasto. No puedo prometer un número de CPC — Google no publica la función.

**Precaución:** el copy es orientado al usuario y define la marca. No delegar; usar las skills `ux-writing` / `copywriting` / `copy-editing`.

---

### P2 · Subir el panel de precios arriba del fold en mobile
**Impacto: alto · Esfuerzo: bajo (~1 h)**

| Archivo | Qué tocar |
|---|---|
| `app/servicios/static-sections.tsx` | El grid de `ServiciosHero`: `grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]` |

Hoy el panel de decisión (con los 3 precios) vive en la segunda columna del grid, así que en mobile cae **debajo** de todo el bloque de texto + CTAs. Resultado medido: primer precio a 759 px con fold en 667 px — **faltan 92 px**.

Reordenar solo en mobile (`order-first lg:order-none` en el panel, o mover el panel antes del bloque de texto en el DOM y reordenar en desktop) pone los 3 precios en la primera pantalla sin cambiar nada del desktop.

**Aguja esperada:** de 0 a 3 precios visibles sin scrollear a 375 px. Ataca directo "el contenido responde la consulta".

---

### P3 · Que **todos** los anuncios apunten a `/servicios#pricing`
**Impacto: medio-alto · Esfuerzo: minutos — no es código, es Google Ads (Nacho)**

Medición comparada, mismo dispositivo, misma sesión:

| Landing | scrollY al terminar de cargar | Precios visibles |
|---|---|---|
| `/servicios` | 0 | **0** |
| `/servicios#pricing` | **1.024** | **sí** (`Esencial · Landing Page · ARS 300.000`) |

El ancla ya funciona bien. Es gasto tirado tener anuncios activos apuntando a la variante sin ancla. Esto es un parche mientras P1 y P2 no estén desplegados; una vez que estén, revisar si el ancla sigue haciendo falta.

---

### P4 · Arreglar el CSS render-blocking de 130 KB
**Impacto: medio · Esfuerzo: medio (3–6 h)**

| Archivo | Qué tocar |
|---|---|
| `next.config.mjs` | `experimental.optimizeCss: true` está puesto pero produce **0 bytes** de `<style>` inline. Hay que averiguar por qué critters no corre en esta ruta (¿el `runtime = 'edge'` de `app/opengraph-image.tsx` interfiere? ¿es una limitación de App Router?) o quitarlo si es inefectivo y resolver por otro lado |
| `app/globals.css` | 66.217 bytes escritos a mano. El bloque de los 7 temas arranca en el byte 64.493 del CSS servido. Candidato claro a moverse a un import diferido o a cargarse solo donde el theme switcher existe |
| `tailwind.config.ts` | Revisar si los 74 custom properties `--color-*` × 19 bloques `[data-theme]` × 42 `.dark` se pueden generar más compacto |

**Aguja esperada:** el audit `render-blocking-resources` cuantifica **300 ms** de ahorro. LCP pasaría de ~3,2 s a ~2,9 s — cruza hacia el borde de "bueno" pero no lo alcanza solo con esto.

---

### P5 · Sacar framer-motion del critical path de `/servicios`
**Impacto: medio · Esfuerzo: alto (1–2 días)**

| Archivo | Qué tocar |
|---|---|
| `app/servicios/static-sections.tsx` (815 líneas) | Es `'use client'` **solo** por `motion` + `Variants`. Los reveals por scroll se resuelven con IntersectionObserver + clases CSS, o con `animation-timeline: view()` donde haya soporte |
| `app/servicios/content.tsx` (794 líneas) | Idem — es el componente cliente más grande de la ruta |
| `app/servicios/servicios-hero-shell.tsx` | `useScroll` + `useTransform` para el fade del hero. Se puede hacer con `animation-timeline: scroll()` |

**Números que lo justifican:** el chunk de framer-motion (`7679`) son **127.566 bytes sin comprimir / 42.509 brotli** y **460 ms de bootup**. Los 5 archivos de `app/servicios/` son cliente por esta librería. Sacar aunque sea `static-sections.tsx` y `content.tsx` del bundle cliente baja el First Load JS de la ruta (hoy 208 kB) y el Speed Index (hoy 4,7 s).

**Precaución:** hay `useReducedMotion` en 4 archivos. Cualquier reemplazo tiene que preservar `prefers-reduced-motion` — está en las reglas de diseño del proyecto.

---

### P6 · Recortar la página
**Impacto: medio · Esfuerzo: medio (1 día, es decisión de producto)**

**17.981 px = 27 pantallas de scroll.** Todo lo que está después de la pantalla 14 (`proceso` en 9.640 px, comparativa en 12.411 px, verticales en 13.580 px, FAQ en 14.129 px, CTA final en 16.488 px) casi nadie lo ve en una visita paga, pero se descarga, se hidrata y suma a los 1.338 nodos DOM y a los 594 ms de Style & Layout.

Opciones, en orden de preferencia: mover esas secciones a páginas propias enlazadas (mejora también el SEO orgánico), o cargarlas diferidas con `next/dynamic` + IntersectionObserver.

"Facilidad de navegación" es un criterio explícito que Google evalúa. 27 pantallas no ayudan.

---

### P7 · Accesibilidad táctil, tipografía y contraste
**Impacto: bajo-medio · Esfuerzo: bajo (4–8 h)**

- Subir a ≥12 px los **81 elementos** con texto menor (hay uno a 7 px, cinco a 8 px, siete a 9 px, 34 a 10 px, 34 a 11 px). Prioridad: los badges de plan (`Esencial`, `Más elegido`, `E-commerce`) y los claims comerciales (`3 cuotas sin interés`, `Entrega en 15 días`).
- Llevar a ≥44 px de alto los **19 clickeables** que no llegan. Prioridad absoluta: el link del teléfono `+54 9 11 3427 2488` (hoy 159×**20 px**) — es el elemento de transparencia que Google mira.
- Arreglar los **6 fallos de contraste** (mínimo medido 2,53:1, requerido 4,5:1). El culpable recurrente es `#64748b` y `#505052` sobre fondos oscuros.
- Tabla comparativa: 640 px dentro de 275 px. Convertir a tarjetas apiladas en mobile en vez de scroll horizontal anidado.

---

## 4. Qué medí y con qué comando exacto

Todo se ejecutó el 2026-08-23 contra `https://www.theapexweb.com/servicios` en producción, o contra el build de producción local.

### Build de producción (tamaños de bundle por ruta)
```bash
cd <repo> && node --max-old-space-size=8192 node_modules/next/dist/bin/next build
```
→ `/servicios`: 37.2 kB de ruta, **208 kB First Load JS**; shared 88.2 kB; 31 páginas estáticas; exit 0.

### Headers, TTFB y tamaño del HTML
```bash
curl -sS -D - -o servicios.html \
  -A "Mozilla/5.0 (Linux; Android 13; Pixel 7) ... Mobile Safari/537.36" \
  -w "TTFB:%{time_starttransfer} total:%{time_total} size:%{size_download}\n" \
  https://www.theapexweb.com/servicios
```
→ 200 OK · `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` · `X-Vercel-Cache: HIT` · `Age: 592437` (6,86 días) · `X-Vercel-Id: gru1` · TTFB 0,457 s (incl. 0,082 DNS + 0,101 connect + 0,353 TLS) · **256.803 bytes**.

### Tamaño comprimido
```bash
curl -sS -H "Accept-Encoding: br" -o /dev/null -w "%{size_download}\n" \
  https://www.theapexweb.com/servicios
```
→ **29.930 bytes brotli**.

### Peso de cada chunk que baja la ruta
```bash
for u in $(grep -o 'src="/_next/static/[^"]*"' servicios.html | sed 's/src="//;s/"$//' | sort -u) \
         $(grep -o 'href="/_next/static/css/[^"]*"' servicios.html | sed 's/href="//;s/"$//' | sort -u); do
  B=$(curl -sS -H "Accept-Encoding: br" -o /dev/null -w "%{size_download}" "https://www.theapexweb.com$u")
  R=$(curl -sS                          -o /dev/null -w "%{size_download}" "https://www.theapexweb.com$u")
  echo "$u,$B,$R"
done
```
→ 22 JS + 2 CSS = **306.747 bytes brotli / 1.010.879 bytes raw**. Tabla completa en §1 causa 3c.

### Desglose del HTML (markup vs payload RSC vs CSS inline)
Script Node sobre `servicios.html`: separa `<script>`, `<style>` y `self.__next_f.push`.
→ 38.001 B de payload RSC · 55.460 B de `<script>` inline total · **0 B de `<style>` inline** · 201.343 B de markup · 1.291 tags de apertura.

### Composición del CSS
```bash
curl -sS -o main.css https://www.theapexweb.com/_next/static/css/ff7678e32297de3f.css
```
→ 130.869 B · 1.655 reglas · 19 bloques `[data-theme=` (el primero en el byte 64.493) · 42 `.dark` · 29 `@keyframes` · 74 `--color-*` · 21 `@media`. `wc -c app/globals.css` → 66.217 B.

### Lighthouse mobile (throttling simulado Slow 4G + 4× CPU)
```bash
CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe" \
npx lighthouse@12 https://www.theapexweb.com/servicios \
  --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate \
  --only-categories=performance,accessibility,seo --output=json --output-path=lh-mobile.json \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu"
```
→ Performance **87** · Accessibility 96 · SEO 100 · FCP 2,3 s · **LCP 3,2 s** · SI 4,7 s · TBT 110 ms · CLS 0 · server-response 60 ms · main-thread 2,3 s · 33 requests / 371 KB · render-blocking CSS 300 ms · LCP element = `p.text-pretty` del hero · DOM 1.273 elementos.

*(Misma orden con `--preset=desktop` → Performance 100, LCP 0,7 s.)*

### Geometría real en mobile (Chrome headless + puppeteer-core 23)
Script propio (`geo.js`, `anchor.js`, `map.js`) que abre `https://www.theapexweb.com/servicios` con viewport 375×667 y 412×823, DPR 2, `isMobile: true`, `hasTouch: true`, UA de Pixel 7, espera `networkidle2` + 2,5 s, y luego mide en el DOM:
`document.documentElement.scrollHeight/scrollWidth`, `getBoundingClientRect()` de `#pricing`, `TreeWalker` sobre nodos de texto que matcheen `/\$\s?[0-9]{3}\.[0-9]{3}/`, `getComputedStyle().fontSize` de todos los elementos con texto, rects de todos los `a[href], button, [role=button], input, select, textarea`, elementos con `position: fixed|sticky`, y `elementsFromPoint()` sobre el botón flotante.

→ Todos los números de §1 causa 2 y §2.

### Relevancia de keywords
Script Node que extrae el texto visible del `<body>` (elimina `<script>`, `<style>` y tags), lo normaliza a minúsculas y cuenta apariciones y posición de cada keyword.
→ 1.820 palabras visibles; tabla completa en §1 causa 1.

### Third-party y analytics
```bash
# puppeteer: page.on('request') filtrando dominios != theapexweb.com, espera 6 s tras networkidle2
```
→ **0 requests externos**. `typeof window.gtag === 'function'`, `dataLayer.length === 3`, `posthog === undefined`, `fbq === undefined`. Confirmado contra `components/analytics/google-analytics-root.tsx`: es intencional (inyección diferida a la primera interacción o 25 s).

### Documentación consultada
`context7` → `/vercel/next.js/v14.3.0-canary.87`, consulta sobre `experimental.optimizeCss` / critters en App Router. Devolvió la implementación real de `postProcessHTML` en `packages/next/src/server/post-process.ts`, que es la base de la afirmación de §1 causa 3b. *(La versión exacta 14.2.35 no está indexada en context7; usé la canary más cercana, 14.3.0-canary.87.)*

---

## 5. Qué NO pude medir, y por qué

Esto importa tanto como lo que sí medí. Ninguno de estos huecos está tapado con una estimación.

1. **Datos de campo reales (CrUX).** Es lo que Google efectivamente usa, y es el dato que más me habría gustado tener. La API pública de PageSpeed Insights devolvió **HTTP 429 — "Quota exceeded for quota metric 'Queries' ... per day"** (proyecto compartido sin API key propia). No sé el p75 real de LCP / INP / CLS de usuarios argentinos en mobile. **Todos mis números de velocidad son de laboratorio simulado y casi con seguridad son optimistas respecto del campo.** Con una API key de PageSpeed Insights esto se resuelve en un comando.

2. **Métricas de Vercel Observability.** La skill `vercel-optimize` exige `vercel link` + Observability Plus. El CLI está autenticado (`vercel whoami` → `developers-2878`, CLI 59.3.0) pero **este worktree no tiene `.vercel/`**, y linkear habría escrito archivos fuera del único que tengo permitido crear. Tampoco sé si el proyecto tiene Observability Plus contratado. No corrí ninguna parte del pipeline de esa skill; la usé solo como marco de auditoría (bundle / caching / imágenes) aplicado a mis propias mediciones.

3. **INP real.** Lighthouse no lo mide; solo da TBT (110 ms) como proxy de laboratorio. El TBT sugiere que la interactividad está bien, pero **no es lo mismo que INP** y no puedo afirmar que INP esté en verde.

4. **La calificación de Google por keyword.** No tengo la consola de Ads abierta en esta sesión, y la memoria del proyecto registra que el carril UI está bloqueado por identidad. Trabajé con los datos que me pasaron (26/30 por debajo del promedio, desglose de QS) sin poder verificarlos ni cruzarlos contra el término de búsqueda real de cada clic.

5. **Cuáles keywords específicas caen en cuál landing.** Sé que hay anuncios en `/servicios` y en `/servicios#pricing`, pero no pude ver el mapeo keyword → anuncio → landing. Eso cambia la prioridad relativa de P3.

6. **El dato de entrada de 2.430 px para `#pricing`.** No lo pude reproducir en ningún viewport (mido 1.120 px a 375 px, 1.079 px a 412 px). Puede ser de escritorio, de un deploy anterior, o de otra sección. Lo dejo marcado como discrepancia sin resolver, no lo di por bueno.

7. **Imágenes de la sección `casos-reales`.** Los 7 screenshots de proyectos son `loading="lazy"` con `data-nimg="fill"` y arrancan en el px 4.480 (pantalla 6,7). Lighthouse registró **1 sola imagen / 1 KB** en el load medido, porque el lazy loading impidió que se descargaran. **No medí su peso real ni su formato servido.** No están en el critical path, pero tampoco puedo afirmar que estén bien optimizadas.

8. **El impacto numérico de cada arreglo sobre el CPC.** Google no publica la función que convierte "experiencia de la página de destino" en Quality Score ni en CPC. Toda cifra que pusiera ahí sería inventada. Lo que sí puedo afirmar con respaldo es el efecto de cada arreglo sobre la métrica intermedia (300 ms de LCP, 460 ms de bootup, 0→3 precios visibles).

---

## 6. Nota al margen — medición del rebote duro

No es causa del Quality Score, pero conviene tenerlo escrito porque afecta cómo se leen los datos de la campaña.

`components/analytics/google-analytics-root.tsx` inyecta `gtag.js` **solo después** del primer `pointerdown`, `touchstart`, `keydown`, `scroll` o `mousemove`, con un failsafe a los 25 s. Es una decisión deliberada y bien documentada en el propio archivo (saca el medidor del critical path). El bootstrap inline encola `js` + `config` para GA4 y para `AW-18041789644`, así que nada se pierde una vez que el script baja.

**La consecuencia:** una visita que aterriza, mira, y se va en menos de 25 segundos **sin scrollear ni tocar la pantalla** nunca dispara `gtag.js` y por lo tanto nunca se registra. En una landing paga con problema de relevancia, ese perfil es exactamente el que más abunda. Los números de sesiones de GA4 para esta landing están, casi con seguridad, subestimados — y el rebote real es peor de lo que muestra el panel.

No recomiendo revertir la optimización: 0 requests third-party es parte de por qué el TBT es 110 ms. Pero conviene saberlo al leer los reportes.

---

## Apéndice — inventario de mediciones en una tabla

| Qué | Valor medido | Fuente |
|---|---|---|
| Performance mobile | 87 / 100 | Lighthouse 12.8.2 |
| Performance desktop | 100 / 100 | Lighthouse 12.8.2 |
| LCP mobile | 3,2 s (elemento: párrafo del hero) | Lighthouse |
| FCP mobile | 2,3 s | Lighthouse |
| Speed Index mobile | 4,7 s | Lighthouse |
| TBT / CLS | 110 ms / 0 | Lighthouse |
| Server response time | 60 ms (`gru1`, cache HIT) | Lighthouse + curl |
| Main-thread total | 2,3 s | Lighthouse |
| CSS render-blocking | 300 ms · 130.869 B raw | Lighthouse + curl |
| Requests / transferencia | 33 req / 371 KB | Lighthouse |
| First Load JS de `/servicios` | 208 kB (2ª ruta más pesada) | `next build` |
| JS+CSS total del first load | 306.747 B br / 1.010.879 B raw | curl por chunk |
| Chunk framer-motion | 127.566 B raw · 460 ms bootup | curl + Lighthouse |
| HTML | 29.930 B br / 256.803 B raw | curl |
| Alto de la página @375 px | 17.981 px = 27 pantallas | Chrome headless |
| `#pricing` @375 px | 1.120 px | Chrome headless |
| Precios visibles sin scroll @375 px | **0 de 7** | Chrome headless |
| Nodos DOM | 1.338 | Chrome headless |
| Textos < 12 px | **81** | Chrome headless |
| Clickeables < 44 px | **19 de 72** | Chrome headless |
| Fallos de contraste AA | 6 (mínimo 2,53:1) | Lighthouse a11y |
| Scroll horizontal de página | no hay (375 == 375) | Chrome headless |
| Palabras visibles | 1.820 | parser propio |
| `"diseño de sitios web"` / `"sitios web"` / `"desarrollo web"` | **0 apariciones** | parser propio |
| `"página web"` | 1, en el 82,9% del documento | parser propio |
| Componentes cliente en el repo | 74 | grep |
| Archivos con framer-motion | 39 | grep |
