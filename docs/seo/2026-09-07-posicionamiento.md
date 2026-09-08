# SEO — trabajo del 2026-09-07

Auditoría completa del sitio + implementación. Lo que sigue es el **registro de
decisiones**: qué se cambió, por qué, y qué NO hay que revertir sin entender el
motivo. Los números salen de medición, no de estimación.

---

## De dónde salieron las decisiones

No de intuición: de los **términos de búsqueda reales** de la campaña Apex
search (cuenta `4869983637`, ventana 2026-06-10 → 2026-09-07, leídos por API).
Esa lista es la única fuente de demanda medida que tiene el proyecto, porque no
hay Search Console conectado.

Clusters con demanda probada y **sin página propia** antes de este trabajo:

| Cluster | Impresiones | Mejor CTR | Estado previo |
|---|---|---|---|
| tienda online / ecommerce / comercio electrónico | ~430 | — | caía en `/servicios` |
| landing page (+ "cuanto sale una landing page en argentina") | ~295 | 28,6 % | caía en `/servicios` |
| tarifario web / tarifario diseño web | ~39 | 20 % | ya cubierto por el FAQ de `/cuanto-cuesta-una-pagina-web` |
| crear página web (crear/creación/creador) | ~90 | 25 % | parcialmente en `/diseno-de-paginas-web` |

`/servicios` respondía a las dos primeras intenciones con la **misma** página.
Eso es exactamente lo que produce `post_click_quality_score = BELOW_AVERAGE`
(ver `APEX/CLAUDE.md` § Google Ads).

---

## 1. Enlazado interno — el hallazgo más grande

El footer y el navbar aparecen en **todas** las páginas: son la palanca de
enlace interno más fuerte del sitio. Estaban desperdiciados.

Enlaces entrantes contando las 24 páginas del sitemap, **antes → después**:

| Página | Antes | Después |
|---|---:|---:|
| `/blog` (8 guías de ~5.000 palabras) | 8 | **56** |
| `/cuanto-cuesta-una-pagina-web` (7.938 palabras) | 2 | **29** |
| `/diseno-de-paginas-web` (7.434 palabras) | 1 | **26** |
| `/muestrario` | 25 | 53 |
| verticales (`/web-para-*`) | 10-11 | 34-35 |
| `/tienda-online` (nueva) | — | 28 |
| `/landing-page` (nueva) | — | 26 |
| `/sobre-mi` (sin keyword comercial) | 45 | 49 |

Tres de los cinco links de "Servicios" del footer apuntaban a la **misma** URL
(`/servicios?tab=web`, que para un crawler es `/servicios`).

**Invariante:** cada entrada de `SERVICIOS_LINKS` apunta a una URL distinta y
real. Un `?tab=` no crea una URL nueva. Si un servicio merece su propio link en
el footer, merece su propia página.

---

## 2. Títulos — el sufijo de marca costaba 17 caracteres en cada SERP

El template era `%s | Manuel Navarro`. El presupuesto real de un `<title>` es
~60 caracteres (Google trunca por ancho en píxeles), así que la marca se comía
casi un tercio — en un término que **nadie busca**. La marca ownable es
"APEX" ("apex web", "apex argentina").

Ejemplos de lo que se truncaba:

- `Cuánto cuesta una página web en Argentina | $300.000 a $900.000 | APEX | Manuel Navarro` → 87 caracteres, con la marca repetida.
- `Cuánto cuesta hacer una app móvil en Argentina (Flutter vs React Native vs nativo) | Manuel Navarro` → 99.

Después: **ninguna página pasa de 62 caracteres** (verificado sobre las 24 URLs
del sitemap). El template pasó a `%s | APEX`, y las páginas cuyo título ya usa
el presupuesto entero llevan `title.absolute` (sin sufijo).

Los posts del blog tienen un campo nuevo `seoTitle`: el H1 largo se queda como
está —es el que gana la long tail— y el SERP recibe la versión corta.

---

## 3. Páginas nuevas

`/tienda-online` y `/landing-page`. ~8.000 palabras renderizadas cada una,
contenido propio, sin solapamiento de keywords con las páginas existentes
(verificado: la única colisión, `cuanto cuesta una tienda online`, se resolvió
dejándosela a `/cuanto-cuesta-una-pagina-web`).

Arquitectura: contenido en `lib/data/product-landings.ts`, render compartido en
`components/sections/product-landing.tsx`, SEO en
`components/seo/product-landing-seo.tsx`.

Las dos incluyen una **comparación honesta** que dice cuándo la alternativa
gana ("si recién arrancás, una plataforma con abono es la decisión correcta").
Eso no es modestia: una comparación que nunca pierde no le sirve a nadie, y
E-E-A-T premia lo contrario.

**Invariante al agregar un producto:** si no hay 1.000 palabras que NO aparecen
en otra página, no es una landing nueva — es una sección. Dos páginas que dicen
lo mismo se canibalizan y pierden las dos.

---

## 4. Datos estructurados

- **Breadcrumbs**: estaban solo en las landings y el blog. Faltaban en las 6
  páginas del menú principal. Ahora 23 de 24 páginas los tienen (la home no
  lleva, correctamente).
- **Grafo de entidades unificado**: el `BlogPosting` redeclaraba `author` y
  `publisher` inline, así que Google leía una Person y una Organization
  **distintas** de las del resto del sitio y la autoridad se repartía entre
  ambas. Ahora referencian los mismos `@id` (`PERSON_ID`, `ORG_ID`,
  `WEBSITE_ID`, exportados desde `components/seo/json-ld.tsx`).
- **Precios derivados de `WEB_PLANS`**: `ServiceJsonLd` los tenía escritos a
  mano (300000 / 600000 / 900000). Un cambio de precio en `services.ts` dejaba
  al schema declarando el número viejo — invisible en pantalla, y Google lo lee.
- **Organization enriquecida**: `logo` como `ImageObject` (requisito del panel
  de conocimiento), `hasOfferCatalog` con los planes, `foundingDate`,
  `paymentAccepted`, `currenciesAccepted`, y el Perfil de Negocio de Google en
  `sameAs`.
- **`name: 'APEX'`** en el `ProfessionalService`, literal como figura en el
  Perfil de Negocio. Las variantes largas van en `alternateName`.
- **`BlogPosting`**: se le agregó `image` (requisito de Google para el rich
  result de artículo — sin él el post queda como resultado azul común),
  `wordCount` calculado del contenido real, `timeRequired` e `isPartOf`.

Verificado: **150 bloques JSON-LD en 24 páginas, 0 inválidos, 0 referencias
`@id` huérfanas.**

---

## 5. Lo que NO se tocó, y por qué

**Core Web Vitals.** El sitio está en 90/100 de rendimiento con `CLS 0` y
`TBT 0 ms` — perfectos. El rojo es el CSS que bloquea el render, y no tiene
una salida barata:

- Los dos CSS **cargan en paralelo**, no encadenados: el segundo (1,1 KB, el de
  `@font-face` que emite `next/font`) no está en el camino crítico. Sacarlo
  ahorra ~0 ms de LCP, no los 150 ms que sugiere PageSpeed.
- El grande son 123 KB sin comprimir. Los 7 temas son solo el **3 %**: el resto
  son utilidades de Tailwind ya purgadas. No hay grasa evidente para sacar.
- El costo real es `elementRenderDelay: 2370 ms` sobre un LCP de 3,2 s, con
  TTFB 0 y TBT 0. Eso es parseo de CSS y layout en una CPU lenta emulada.

La sesión del 2026-09-07 ya midió y **descartó** el truco de `cv-boot`
(commit `de6021b`): −1 ms de FCP y +33 ms de TBT en contra, en A/B pareado de
4 rondas. No repetir ese camino sin una hipótesis nueva.

**Polyfills de JavaScript antiguo (12,1 KiB).** Son legítimos: el
`browserslist` incluye Safari 14, que no soporta `Array.prototype.at`. Subir el
target a Safari 15.4 los elimina, a costa de romper Safari 14/15. Es una
decisión de negocio sobre share de iOS, no de ingeniería.

---

## 6. Pendiente — necesita a Manuel

Dos inconsistencias entre el sitio y el **Perfil de Negocio de Google**
(verificadas el 2026-09-07 abriendo el perfil). La consistencia de estos datos
pesa directo en búsqueda local, y el perfil solo lo edita él.

1. **El teléfono del perfil es `011 3427-2488`** — el celular personal, que
   `APEX/CLAUDE.md` marca explícitamente como "ya no es el del negocio". El
   sitio, el schema y el `llms.txt` dicen `+54 9 11 5632 7091`. Hay que
   cambiarlo en el perfil.

2. **El horario del perfil dice 9:00 a 22:00**; el schema declara 24 horas, con
   un comentario que afirmaba que eso era "consistente con el Perfil de
   Negocio". Ya no lo es. Si la atención real es 24/7 hay que arreglar el
   perfil; si es 9-22 hay que arreglar
   `LocalBusinessJsonLd.openingHoursSpecification`. No se tocó a propósito: es
   una decisión de negocio. El comentario del código quedó marcado con ⚠️.

---

## Cómo verificar que esto sigue en pie

Con el server de producción corriendo (`npm run build && npm run start`):

```bash
curl -s http://localhost:3000/sitemap.xml | grep -o '<loc>[^<]*</loc>' | sed 's/<[^>]*>//g'
```

Y sobre esas URLs, los cuatro chequeos que se corrieron acá: un solo `<h1>` por
página, `<title>` ≤ 62 caracteres, todos los bloques JSON-LD parseables, y cero
referencias `@id` que no resuelvan a un nodo declarado en la misma página.
