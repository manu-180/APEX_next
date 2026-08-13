# Auditoría completa — Apex search — 2026-08-12

Cuenta `4869983637` · Campaña **Apex search** (`23721057489`) · Search, sólo Google
Período analizado: **2026-07-13 → 2026-08-11** (30 días)

> Contexto: Manuel volvió a la versión anterior del sitio (`viejo_apex`). Esta
> auditoría cruza la campaña contra las rutas y anclas que **realmente existen**
> en ese repo, no contra las que la campaña asume.

---

## Números base

| Métrica | Valor |
|---|---|
| Impresiones | 5.026 |
| Clics | 289 |
| Gasto | **$141.391 ARS** |
| Conversiones | 5 |
| **CPA** | **~$28.278 ARS** |
| CPC promedio | ~$489 (clics de hasta $1.087) |
| Optimization score | **52,9%** |
| Presupuesto diario | $5.000 ARS |

Sólo 2 de 6 ad groups están activos y concentran el 100% del gasto:

| Ad group | Estado | Impr. | Clics | Gasto | Conv. |
|---|---|---|---|---|---|
| Presupuesto y Precios | ENABLED | 3.103 | 204 | $99.794 | 2,5 |
| Web - Diseño y Desarrollo | ENABLED | 1.923 | 85 | $41.598 | 2,5 |
| Web para Médicos | PAUSED | 0 | 0 | $0 | 0 |
| Web para Contadores | PAUSED | 0 | 0 | $0 | 0 |
| Apps - Mobile | PAUSED | 0 | 0 | $0 | 0 |
| Apex search recursos | PAUSED | 0 | 0 | $0 | 0 |

---

## 🔴 Hallazgo principal: la landing de los anuncios no existía

Los **dos ad groups activos** tienen como final URL:

```
https://www.theapexweb.com/#precios
```

**`#precios` no existe en el sitio.** Inventario real de anclas del repo:

| Ancla | Dónde vive |
|---|---|
| `#beneficios` | `components/sections/client-benefits.tsx:100` |
| `#casos-reales` | `components/sections/servicios-showcase.tsx:291` |
| `#pricing` | `app/servicios/content.tsx:219` ← **único bloque de precios real** |
| `#proceso` | `app/servicios/static-sections.tsx:245` |
| `#faq` | `app/servicios/static-sections.tsx:771` |
| `#galeria` | `app/muestrario/muestrario-gallery.tsx:152` |
| `#museo` | `app/lab/lab-client.tsx:342` |
| `#calculadora` | `components/sections/budget-calculator.tsx:316` ← **código muerto** |

El home **no tiene sección de precios en absoluto**. `BudgetCalculatorSection`
está definida pero no se importa desde ninguna página.

**Consecuencia:** 289 clics y $141.391 ARS de gente que buscó *"cuánto cuesta una
página web"*, clickeó un anuncio que promete precios, y aterrizó arriba de todo
del home sin un solo precio a la vista. Eso explica a la vez el CPA y el Quality
Score en el piso (Google puntúa la experiencia de la landing).

**Estado: ✅ reparado desde el código** (commit `78f69c6`). `LegacyHashRedirect`
manda `#precios` y `#calculadora` a `/servicios#pricing`. El tráfico pago ya no
se pierde aunque la final URL en Google Ads siga igual.

---

## 🔴 Fuga de conversiones en el tag

`components/analytics/google-analytics-root.tsx` tenía **todo** gtag —bootstrap
incluido— detrás de `lazyOnload` + primera interacción del usuario. El comentario
afirmaba que el bootstrap "encola comandos", pero el bootstrap **era** lazy: no
había cola.

Quien llegaba de un anuncio y clickeaba el CTA en los primeros segundos
encontraba `window.gtag === undefined`, y `lib/analytics/google-ads.ts:24` hacía
`return` en silencio. **El clic se cobraba y la conversión no se registraba** —
justo los visitantes de más intención.

**Estado: ✅ reparado** (commit `78f69c6`). `window.gtag` + `js` + `config` se
definen sincrónicamente al hidratar, sin red. Verificado en dev: un evento de
conversión se encola en `dataLayer` con `gtag.js` todavía sin descargar.

⚠️ **Las 5 conversiones de los últimos 30 días están subcontadas.** No sirven
como línea de base. Hay que remedir con el fix desplegado.

---

## ✅ Ya ejecutado vía MCP

**20 negativas nuevas** (broad, nivel campaña). La lista previa ya tenía ~200
términos; faltaba entera la clase de **intención de proveedor** — gente
averiguando cuánto *cobrar*, no cuánto *pagar*:

`cuanto se cobra` · `cuanto cobrar` · `cuanto cobro` · `cuanto ganan` ·
`cuanto gana` · `tarifario` · `tarifas` · `honorarios` · `buscamos` ·
`postularse` · `site123` · `w3spaces` · `builderall` · `jimdo` · `zonelets` ·
`elfsight` · `vuetify` · `generador de paginas web` · `hostgator` · `carrd`

Distinción aplicada: se bloqueó `cuanto se cobra` / `cuanto cobrar` (vendedor) y
**no** `cuanto cuesta` ni `cuanto cobra` (comprador o ambiguo).

**Efecto colateral buscado:** estas negativas sombrean dos keywords activas que
sólo queman plata — ver tabla de abajo. Conviene pausarlas igual, para dejar la
cuenta limpia.

---

## 🔧 Pendiente — necesita la UI de Google Ads (para Nacho)

El MCP de google-ads sólo expone negativas, budget, estado de campaña/ad group y
estrategia de puja. Todo lo de abajo requiere entrar a la consola.

### 1. Final URLs — prioridad máxima

| Ad group | URL actual | URL correcta |
|---|---|---|
| Presupuesto y Precios | `https://www.theapexweb.com/#precios` | `https://www.theapexweb.com/servicios#pricing` |
| Web - Diseño y Desarrollo | `https://www.theapexweb.com/#precios` | `https://www.theapexweb.com/servicios#pricing` |
| Apex search recursos (pausado) | `http://www.theapexweb.com` | `https://www.theapexweb.com` — hoy es **http**, un hop de redirect |

El redirect del sitio ya cubre el caso, pero corregirlo en Ads evita el salto
extra y mejora la señal de relevancia de landing.

### 2. Techo de CPC — prioridad máxima

`campaign.target_spend.cpc_bid_ceiling_micros = 0` → **Maximizar clics sin
límite**. Es la causa directa del CPC de $489 y de clics de $1.087.

**Poner techo en $250–300 ARS.** No cambiar todavía la estrategia de puja: la
landing recién se arregla ahora y los datos de conversión de los últimos 30 días
están contaminados. Ver punto 6.

### 3. Pausar keywords — $28k sin una sola conversión

| Keyword | Match | Gasto 30d | Clics | Conv | Motivo |
|---|---|---|---|---|---|
| `presupuesto página web` | PHRASE | **$20.649** | 41 | **0** | CPC $503, cero retorno |
| `cuanto sale una pagina web` | EXACT | **$13.099** | 28 | **0** | |
| `hacer una pagina web` | PHRASE | **$11.681** | 23 | **0** | QS 0, muy amplia |
| `cuanto se cobra por hacer una pagina web` | EXACT | **$8.925** | 18 | **0** | Intención de proveedor — ya sombreada por negativa |
| `precio de paginas web argentina` | EXACT | $5.744 | 12 | **0** | |
| `tarifario diseño web` | PHRASE | $2.545 | 6 | **0** | QS 1 — ya sombreada por negativa |
| `buscamos desarrollador web` | PHRASE | $1.299 | 3 | **0** | Busca **empleado**, no agencia — ya sombreada |

**Total: ~$63.942 ARS (45% del gasto) con 0 conversiones.**

### 4. Deduplicar `presupuesto sitio web`

Está cargada **tres veces** en el mismo ad group (BROAD, PHRASE, EXACT). La BROAD
sola se comió **$31.965 (23% del gasto)** con QS 0.

→ Dejar sólo **PHRASE**. Sacar BROAD y EXACT.

### 5. Sitelinks — apuntan a rutas menos específicas de las que existen

| Sitelink | URL actual | URL mejor | Por qué |
|---|---|---|---|
| Ver Precios | `/servicios` | `/servicios#pricing` | Aterriza directo en la tabla |
| Apps móviles | `/servicios` | `/servicios?tab=mobile` | El sitio soporta el param (`app/servicios/content.tsx:66`) |
| Portfolio | `/` (home) | `/muestrario` | Existe una galería dedicada |
| Qué ofrecés | `http://theapexweb.com/servicios` | `https://www.theapexweb.com/servicios` | Hoy sin `www` **y** sin `https` — dos hops |

### 6. Estrategia de puja — recién en ~2 semanas

Hoy: `TARGET_SPEND` (Maximizar clics).

**No tocar ahora.** Cambiar la estrategia el mismo día que se arregla la landing
hace imposible atribuir la mejora. Con el fix desplegado, dejar correr **2
semanas con techo de CPC** y recién ahí evaluar pasar a **Maximizar conversiones**
— siempre que la campaña llegue a ~15 conv/mes reales.

### 7. Limpieza de conversion actions

- **`APEX - Scroll 50pct`** (`yP-_CKrq16ccEMy5_5pD`): ENABLED en Ads pero su label
  **no se dispara desde ningún lado del código**. Nunca va a registrar nada. O se
  cablea o se archiva.
- **`CalculAR - Compra Planilla Comercio`**: está como `primary_for_goal = true` a
  nivel cuenta y es **otro producto**. Verificar que "Apex search" no la tenga
  entre sus objetivos de conversión, o le mete ruido a la optimización.
- **`ceramicaapp-9abd8 (web) conversion`**: ENABLED, secundaria. Recordar que
  **es APEX** (slug legado) — sus eventos son contactos reales, no excluirla.

### 8. Negativas que hoy bloquean verticales propios

Estas están en la lista de negativas y chocan con landings que **sí existen** en
el repo. Si en algún momento se activan los verticales, hay que sacarlas:

| Negativa | Qué bloquea |
|---|---|
| `turnos` | Toda la propuesta de **Web para Médicos** ("Turnos Online 24/7") |
| `abogados` | Cualquier campaña sobre `/web-para-abogados` |
| `inmobiliarias` | El vertical inmobiliario |
| `como` / `cómo` | Clase informacional entera — el review del 30-07 ya la marcó para revisar |

---

## Verticales sin explotar

Landings que existen, funcionan y tienen mejor intención comercial que las
keywords genéricas que hoy se llevan el presupuesto:

| Ruta | Ad group | Estado |
|---|---|---|
| `/web-para-medicos` | Web para Médicos | Pausado, 0 impresiones — negativa `turnos` lo cripplea |
| `/web-para-contadores` | Web para Contadores | Pausado, 0 impresiones |
| `/web-para-abogados` | **no existe** | Landing sin ad group — y `abogados` está como negativa |

**No activarlos todavía.** Primero medir la landing arreglada con el presupuesto
actual; abrir frentes ahora sólo diluye $5.000/día que ya son ajustados.

---

## Orden sugerido

1. ✅ Landing reparada desde código — **hecho**
2. ✅ Fuga de conversiones tapada — **hecho**
3. ✅ Negativas de intención de proveedor — **hecho**
4. ⏳ Techo de CPC $250–300 + final URLs corregidas → **Nacho, esta semana**
5. ⏳ Pausar las 7 keywords sin conversiones + deduplicar `presupuesto sitio web`
6. ⏳ Sitelinks a rutas específicas
7. ⏳ Remedir a 2 semanas con datos limpios → recién ahí, estrategia de puja
8. ⏳ Verticales (médicos / contadores / abogados) → fase 2

---

*Auditoría generada con datos en vivo de la API de Google Ads y verificación
directa contra el código del repo.*
