# Auditoría final — campaña ↔ sitio · 2026-08-23

Cuenta `4869983637` · campaña `23721057489` "Apex search" · ARS
Auditoría de **solo lectura**. Nada se escribió en Google Ads ni en el repo (salvo este archivo).

Todo lo de abajo se verificó **releyendo** la API con `scripts/google-ads/_client.py`
y **curl contra producción**, nunca por la respuesta de un mutate.

---

## 1. Estado de los 13 cambios

| # | Cambio | Estado | Evidencia |
|---|---|---|---|
| 1 | `PAGE_VIEW` y `SUBMIT_LEAD_FORM` fuera de la puja | **A MEDIAS** | Campaña OK: `CONTACT` biddable=True; `PAGE_VIEW`, `SUBMIT_LEAD_FORM`, `PURCHASE` = False. Pero `customer_conversion_goal` sigue con **PAGE_VIEW y SUBMIT_LEAD_FORM biddable=True** — el arreglo es un override por campaña, no el default de la cuenta |
| 2 | 3 acciones fuera de la columna Conversiones | **OK** | `include_in_conversions_metric=False` en *Scroll 50pct*, *Hero CTA Click* y *ceramicaapp-9abd8 (web) conversion*. Ver §3 por el choque con CLAUDE.md |
| 3 | `TARGET_SPEND` → `MAXIMIZE_CONVERSIONS` | **OK, con riesgo** | `campaign.bidding_strategy_type = MAXIMIZE_CONVERSIONS`, `target_cpa_micros = 0`. Volumen real: 14 conv / 90 d ≈ **4,7 por mes**, muy por debajo de lo que la estrategia necesita |
| 4 | Desktop 0.30 → 1.0 | **OK** | `campaign_criterion.device DESKTOP bid_modifier = 1.00` |
| 5 | `APEX - Lead Calificado (offline)` | **OK, con reparo** | id `7730576763`, `UPLOAD_CLICKS`, `PURCHASE`, `primary_for_goal=False`. Pero `include_in_conversions_metric=False` → los leads subidos **nunca** van a verse en la columna Conversiones; `default_value = 1.0` ARS |
| 6 | Keywords pausadas / reactivadas | **OK** | `cuanto se cobra por hacer una pagina web` PAUSED · `hacer una pagina web` (EXACT+PHRASE) ENABLED · `cuanto sale una pagina web` (EXACT) ENABLED |
| 7 | Negativas `web me`, `tarifario`, `3d` eliminadas | **OK** | Sondeo normalizado sobre las 462 negativas: las tres ausentes |
| 8 | "30 días"→"15 días"; app pago único → fee mensual | **OK** | Los 7 anuncios revisados: cero `$1.2M`, cero `$1.200.000`, cero "30 días". Coincide con `lib/types/services.ts` (`app_mvp: price 580000, billing 'month'`) |
| 9 | Sitelinks y callouts corregidos | **OK** | "menos de 1 hora" (id 411535566313) · "+15 proyectos" reemplazado por "Quién está detrás de APEX" (411607091493) · variantes sin `www` en REMOVED · "Sin Formularios Eternos" ENABLED / "Sin Formularios" REMOVED |
| 10 | Final URLs | **OK (anuncios)** | 806775371905 → `/servicios#pricing`; 806775371902 y 806854817249 → `/servicios`. Todas 200 sin redirect. **Pero** el sitelink "Ver Precios" sigue en `/servicios` (§2.6) |
| 11 | Embudo WhatsApp (`lib/whatsapp-navigate.ts`) | **MAL — no está en producción** | §2.1 |
| 12 | `/gracias` sin doble decode + allowlist de host | **MAL — no está en producción** | §2.1 |
| 13 | H1 y metadatos de `/servicios` | **MAL — no está en producción** | §2.1 |

---

## 2. Inconsistencias vivas, por plata en riesgo

### 2.1 · P0 — Los tres arreglos del sitio no están desplegados

Los puntos 11, 12 y 13 están **commiteados en la rama `claude/google-ads-environment-design-e1257d`
y no mergeados a `main`**. Producción sirve todavía el código viejo.

```
$ git log --oneline main..HEAD
5525448 chore(ads): el verificador esperaba pausadas dos keywords que se reactivaron
7adf7e9 fix(ads): caza de negativas que matan busquedas de compra
5648084 fix(seo): la landing paga hablaba de "software" y la gente busca "pagina web"
3796d87 fix(embudo): los clics pagos a WhatsApp nunca llegaban a WhatsApp
75c70ca docs(ads): conversiones avanzadas para leads va APAGADO, no era un pendiente
e19cc77 fix(ads): reparacion completa de la campana Apex search
```

Prueba en vivo:

```
$ curl -s https://www.theapexweb.com/servicios | grep -o '<title>[^<]*</title>'
<title>Desarrollo de software Argentina | Precios | Manuel Navarro</title>

$ ... | grep -o '<h1[^>]*>.\{0,120\}'
<h1 ...><span ...>Software a medida,</span><strong ...>con precio publicado.</strong></h1>
```

O sea: el H1 y el title que se "arreglaron" siguen siendo los viejos para todo el
tráfico pago que está entrando ahora mismo.

**Lo grave no es el H1, son los otros dos.** `git show main:lib/whatsapp-navigate.ts`
devuelve la versión vieja: dispara `trackGoogleAdsWhatsAppClick()`, hace
`window.open`, y si el handle no es `null` hace `router.push('/gracias')`
**sin ninguna confirmación de traspaso**. Es exactamente el bug de la ventana
fantasma. Y al mismo tiempo se acaba de pasar la campaña a `MAXIMIZE_CONVERSIONS`
optimizando sobre `APEX - WhatsApp Click`, que es justamente la conversión que
ese código dispara de más. **La puja automática está aprendiendo con una señal
que en navegadores in-app se cuenta sin que el usuario llegue nunca a WhatsApp.**

Además `git show main:app/gracias/content.tsx` línea 71:

```js
const waHref = waParam ? decodeURIComponent(waParam) : FALLBACK_WA
```

Sin `isTrustedWhatsAppUrl`. En producción `/gracias?wa=<cualquier-url>` pinta el
botón "Ir a WhatsApp ahora" apuntando a donde sea: **redirect abierto en una
página donde aterriza tráfico pago**.

**Se arregla del lado del sitio:** mergear y desplegar. Hasta que eso pase, los
puntos 11, 12 y 13 no existen para el usuario.

### 2.2 · P1 — Una negativa mata las tres keywords homónimas del grupo que sí gasta

`presupuesto sitio web` está cargada como **negativa BROAD de campaña** y a la vez
como keyword activa tres veces en el grupo **"Presupuesto y Precios" (ENABLED)**:

```
BLOQUEA  neg[BROAD] 'presupuesto sitio web'  ->  kw[BROAD]  'presupuesto sitio web'
BLOQUEA  neg[BROAD] 'presupuesto sitio web'  ->  kw[EXACT]  'presupuesto sitio web'
BLOQUEA  neg[BROAD] 'presupuesto sitio web'  ->  kw[PHRASE] 'presupuesto sitio web'
```

El grupo de presupuesto no puede aparecer para su término más literal.
**Se arregla en Ads:** borrar la negativa.

### 2.3 · P1 — Más negativas del tipo `web me`, todas sobre grupos que hoy sirven

| Negativa | Keyword activa que mata | Grupo |
|---|---|---|
| `buscamos` (BROAD) | `buscamos desarrollador web` (PHRASE) | Web - Diseño y Desarrollo (ENABLED) |
| `buscamos desarrollador` (BROAD) | `buscamos desarrollador web` (PHRASE) | Web - Diseño y Desarrollo (ENABLED) |
| `freelance` (BROAD) | `programador web freelance Buenos Aires` (PHRASE) | Web - Diseño y Desarrollo (ENABLED) |
| `turnos` (BROAD) | `sistema de turnos medicos`, `turnos online para consultorio` | Web para Médicos (PAUSED) |

`turnos` es especialmente feo: el anuncio de médicos titula **"Turnos Online 24/7"**.
Si se reactiva ese grupo, nace muerto.

**Nota buena:** ningún término de búsqueda que haya convertido está bloqueado hoy.
Los 5 que convirtieron en 90 d — `busco alguien que me haga una página web`,
`diseño web`, `hacer pagina web online`, `estudios de diseño web`,
`tarifario diseño web argentina` — pasan todos el filtro. Los arreglos de `web me`
y `tarifario` se confirman correctos: ambos términos convirtieron.

### 2.4 · P1 — Hay una landing de abogados viva, sin grupo y bloqueada por negativa

`https://www.theapexweb.com/web-para-abogados` → **200**.
`lib/data/verticals.ts`: `slug: 'web-para-abogados'`, `priceFrom: 600_000`, `timeline: '15-30 días'`.
El plan Landing del sitio lista textualmente "coaches, **abogados**, contadores y consultores"
como público objetivo.

La campaña tiene **`abogados` como negativa BROAD**: ninguna búsqueda que contenga
la palabra puede entrar. Y no existe grupo de anuncios para esa vertical
(sí hay para contadores y médicos, ambos pausados).

**Se arregla en Ads:** sacar la negativa y armar el grupo, o asumir que la página no se pauta.

### 2.5 · P2 — Dos anuncios activos prometen tiempos distintos, y el callout un tercero

- ad **806775371899** (sirviendo): "Respuesta en Menos de 1h" · "Presupuesto Gratis Hoy"
- ad **806775371905** (sirviendo): "Presupuesto en 24 Horas" · "Consultanos y cotizamos en 24h" · "Te lo damos en 24h"
- callout activo: **"Respuesta en 1 Hora"**

El callout y el headline de 24 h pueden salir **en la misma impresión**.
El sitio dice "Te respondo en menos de 1 hora" (12 lugares) y "Boceto gratis en 24-48 h".
"Presupuesto en 24 Horas" además queda por debajo del propio piso del sitio, que es 24-48 h.

**Se arregla en Ads:** unificar en 1 h para la respuesta y 24-48 h para el boceto.

### 2.6 · P2 — El sitelink "Ver Precios" no va a la tabla de precios

```
[ENABLED] SITELINK id=343513150616
      text = 'Ver Precios'
      d1   = 'Desde ARS 300.000 precio fijo'
      d2   = '3 cuotas sin interes'
      url  = ['https://www.theapexweb.com/servicios']      ← sin #pricing
```

El punto 10 movió el **anuncio** a `/servicios#pricing` pero dejó el sitelink que
literalmente se llama "Ver Precios" cayendo arriba de todo. Mismo caso "Qué ofrecés".
Además hay **tres sitelinks activos apuntando a la misma URL** `/servicios`
("Ver Precios", "Apps móviles", "Qué ofrecés").

Detalle menor del mismo asset: "sin interes" y "produccion" van sin tilde.

### 2.7 · P2 — El precio de app que promete el anuncio no está en el HTML de la landing

```
$ curl -s https://www.theapexweb.com/servicios | grep -c '580'
0
$ ... | grep -o '300\.000\|600\.000\|900\.000' | sort | uniq -c
      7 300.000
      6 600.000
      6 900.000
```

El anuncio **806775371905 (sirviendo)** titula "Web $300K — **App $580.000/mes**"
y describe "Apps con fee mensual desde $580.000", y aterriza en `/servicios#pricing`,
que hace scroll a una tabla con los **precios web**. El número $580.000 vive detrás
de la pestaña "Aplicación Móvil", que se renderiza recién al hacer click.

Riesgo doble: quiebre de scent y política de Google (el precio del anuncio tiene que
ser verificable en el aterrizaje).

### 2.8 · P2 — Todo el mensaje de apps del anuncio de precios es tráfico que no existe

Keywords de precio de app: **todas pausadas** (`cuanto cuesta hacer una app`,
`cuanto cuesta una app`, `precio desarrollo de app`, `presupuesto app movil`).
Grupo "Apps - Mobile": **pausado**.
Negativas activas que rematan el tema: `cuanto cuesta una app`, `cuanto cuesta crear una app`,
`cuanto sale una app`, `cuanto sale crear una app`, `presupuestos app`, `programador de app`.

Pero el anuncio que sí sirve conserva 3 headlines y 1 descripción de apps
("¿Cuánto Sale Hacer una App?", "Apps y Webs Precio Claro", "Web $300K — App $580.000/mes").
Le quita espacio de rotación a los activos de web, que son los únicos que pueden convertir.

### 2.9 · P3 — Los anuncios de las verticales prometen algo que su landing no dice

Los ads **813351520953** (contadores) y **813458481275** (médicos) tienen headline
"Desde $900.000 · **3 Cuotas**" / "Desde $600.000 · **3 Cuotas**" y
"**Boceto Gratis en 48 Horas**".

En las páginas en vivo:
- **"3 cuotas" no aparece nunca** — ni en `/web-para-contadores` ni en `/web-para-medicos`.
  `lib/data/verticals.ts` no menciona cuotas; los de-riskers de cuotas viven sólo en `/servicios`.
- "Boceto gratis en 48 h" aparece **sólo dentro de un `<meta>`** heredado de `app/layout.tsx`,
  no en el cuerpo visible de la página.

Precio y plazo sí coinciden (badges `Desde {priceFrom}` y `{timeline}`).
Ambos grupos están pausados, así que hoy no quema plata — pero está roto para cuando se enciendan.

### 2.10 · P3 — Negativas que contradicen la oferta o el geo

- **Ciudades argentinas bloqueadas** (`cordoba`, `rosario`, `mendoza`, `tucuman`, `salta`,
  `neuquen`, `santa fe`, **`gba`**) con geo = Argentina entera
  (`geoTargetConstants/2032`, `PRESENCE`), anuncios que dicen "Crear App Móvil Argentina"
  y sitio que dice "Clientes en toda Argentina". `gba` mata intención local de compra.
- **`mantenimiento`** bloqueado, mientras el sitio vende "Hosting + 3 meses de mantenimiento
  incluidos" y hay callout "3 Meses de Soporte".
- **`hosting`** bloqueado, con headline activo "Diseño + Hosting + Soporte".
- **`honorarios`** y **`tarifas`** siguen bloqueando intención de precio, justo después de
  haber sacado `tarifario` por sobre-bloquear — y `tarifario diseño web argentina` fue uno
  de los 5 términos que convirtieron.

### 2.11 · P3 — Callouts casi duplicados

`100% a Medida` y `Proyectos a Medida`, los dos activos.

### 2.12 · P3 — `verify.py` miente

Sigue esperando pausadas `hacer una pagina web` y `cuanto sale una pagina web`,
que el punto 6 **reactivó a propósito**. Reporta 2 FALLAS falsas:

```
FALLA  keyword pausada: hacer una pagina web  ENABLED
FALLA  keyword pausada: cuanto sale una pagina web  ENABLED
```

Un verificador que da falsos negativos es peor que no tenerlo: la próxima tanda de
cambios se va a leer con ruido de fondo.

---

## 3. Medición

**La columna Conversiones quedó limpia.** 90 días, dentro de la campaña:

| Acción | conversions | all_conversions |
|---|---|---|
| APEX - WhatsApp Click (CONTACT) | 14.00 | 14.00 |
| APEX - Hero CTA Click (SUBMIT_LEAD_FORM) | 0.00 | 4.00 |

`ceramicaapp-9abd8 (web) conversion` aportó **0 conversiones a esta campaña en 90 días**.
No hay doble conteo. No volvió ningún objetivo de puja basura a nivel campaña.

**Sobre el choque con CLAUDE.md:** el punto 2 sacó `ceramicaapp-9abd8 (web) conversion`
de la columna Conversiones, y tanto el CLAUDE.md global como el del proyecto dicen
explícitamente *"NO excluir esta conversion action como 'otro proyecto'"*. La regla existe
para que no se descarten sus eventos por creerlos de otro proyecto; el cambio de hoy fue
por higiene anti-doble-conteo (es CONTACT, igual que WhatsApp Click). Con 0 eventos
atribuidos en 90 días la decisión no cuesta nada medible hoy — pero **conviene que Manuel
la confirme**, porque contradice una regla escrita, y si el evento vuelve a dispararse
va a quedar fuera de la columna sin que nadie lo note.

**Números de contexto** (90 d): 12.484 impresiones · 628 clicks · **310.236 ARS** ·
14 conv · CPC medio 494 ARS · **CPA 22.160 ARS**.
Últimos 14 días: 2 conversiones sobre ~71.300 ARS → **CPA 35.650 ARS**, empeorando.
Presupuesto 5.000 ARS/día. Redes: sólo búsqueda de Google (partners y display en False) ✔.

**Riesgo de la estrategia nueva:** `MAXIMIZE_CONVERSIONS` sin CPA objetivo
(`target_cpa_micros = 0`) con ~4,7 conversiones/mes está muy por debajo del volumen que la
estrategia necesita para estabilizarse. Sumado a desktop volviendo de −70 % a 0 %, hay que
esperar reaprendizaje con tráfico más caro. Es defendible, pero no es gratis y conviene
mirarlo de cerca las próximas dos semanas.

---

## 4. Qué se verificó y cómo

| Qué | Cómo |
|---|---|
| Objetivos de puja campaña y cuenta | GAQL `campaign_conversion_goal` + `customer_conversion_goal` |
| Conversion actions (37) | GAQL `conversion_action`: status, type, category, `include_in_conversions_metric`, `primary_for_goal`, counting, value |
| Estrategia, presupuesto, redes, geo | GAQL `campaign` + `campaign_criterion` (DEVICE, LOCATION) |
| 7 anuncios (headlines, descripciones, URLs, estado, aprobación) | GAQL `ad_group_ad` |
| Assets | GAQL `campaign_asset`, `ad_group_asset`, `customer_asset` |
| Keywords (128) y negativas (462) | GAQL `ad_group_criterion` + `campaign_criterion` + `campaign_shared_set`/`shared_criterion` |
| Bloqueo negativa↔keyword y negativa↔término | Script propio: normalización sin tildes + semántica real de BROAD (subconjunto), PHRASE (subsecuencia contigua), EXACT |
| Términos de búsqueda 90 d | GAQL `search_term_view` con `metrics.clicks > 0` |
| Conversiones por acción | GAQL `campaign` segmentado por `segments.conversion_action_name` |
| URLs (9) | `curl -s -o /dev/null -w "%{http_code} %{redirect_url}"` — todas 200; sólo `theapexweb.com` sin `www` da 308, y ya no lo usa ningún asset activo |
| Contenido en vivo vs anuncios | `curl` + grep sobre el HTML servido de `/servicios`, `/`, `/web-para-contadores`, `/web-para-medicos` |
| Estado de despliegue | `git log main..HEAD`, `git diff --stat main..HEAD`, `git show main:<archivo>` |

Scripts de un solo uso en el scratchpad de la sesión, no en el repo.

## 5. Qué no se pudo verificar

1. **Si el override de objetivos por campaña realmente tapa el default de cuenta.**
   La API no expone un flag legible de "usar objetivos específicos de campaña".
   Reporto los dos estados; el riesgo de §2.1/punto 1 es real igual, porque si alguien
   vuelve la campaña a "objetivos de la cuenta" desde la UI, PAGE_VIEW y SUBMIT_LEAD_FORM
   vuelven a ser biddable al instante.
2. **Comportamiento real del embudo de WhatsApp en un navegador in-app.**
   No usé el Browser pane (pedido explícito). Lo verifiqué por diff de código contra `main`,
   que alcanza para probar que el arreglo **no está desplegado**, no para medir el bug en vivo.
3. **Si la pestaña "Aplicación Móvil" muestra $580.000 después del click.**
   Sólo inspeccioné el HTML servido, donde el número no está. El render en cliente no se probó.
4. **Quality Score por keyword.** No se consultó.
5. **El MCP `google-ads` colgó** (sin respuesta a los 1800 s) en dos llamadas.
   Todo se resolvió con el cliente Python local (`scripts/google-ads/_client.py`),
   mismas credenciales.
