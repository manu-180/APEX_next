# Coherencia campaña ↔ sitio — 2026-08-23

Cuenta `4869983637` · campaña `23721057489` "Apex search" · sitio https://www.theapexweb.com
Ventana de datos: **30 días** (la misma que usa `scripts/google-ads/audit.py`). Inversión $146.721 ARS,
293 clics, 5 conversiones.

Diagnóstico solamente: **no se escribió nada en Google Ads ni en el sitio**.

Reparto del gasto, para leer la columna "plata en riesgo":

| Grupo | Estado | Gasto 30d | Clics | Conv |
|---|---|---:|---:|---:|
| `196839024238` Presupuesto y Precios | ENABLED | $98.407 | 198 | 2 |
| `196839024158` Web - Diseño y Desarrollo | ENABLED | $48.314 | 95 | 2 |
| 4 grupos restantes | PAUSED | $0 | 0 | 0 |

---

## 1. Tabla de inconsistencias

Ordenada por plata en riesgo. "Lado" = dónde va el arreglo.

| # | Qué promete la campaña | Qué entrega el sitio | Evidencia | Sev. | Lado |
|---|---|---|---|---|---|
| 1 | 12 keywords activas compran tráfico | Una negativa de campaña bloquea la consulta exacta de esas 12 | `audit2.py` → **$37.362/30d**; incl. `presupuesto sitio web` BROAD `297503551858` bloqueada por la negativa homónima | 🔴 Crítica | Campaña |
| 2 | "Apps desde $1.200.000 ARS. **Precio final** sin sorpresas" · "Web $300K · App $1.2M ARS" | Apps son **retainer mensual**: App Producto **$580.000/mes**, App + Operaciones $1.150.000/mes, **IVA aparte** | ad `806775371905` (ENABLED, grupo de $98.407) · `lib/types/services.ts:141-177` · `app/servicios/content.tsx:558,564` | 🔴 Crítica | Campaña |
| 3 | "Tu Web Lista en **30 Días**" | "Entrega en **15 días**", repetido en 11 lugares del repo | ads `806775371899` (grupo $48.314) y `803981039227` · `app/servicios/faq-data.ts:16` · `app/servicios/content.tsx:108-110` · `app/layout.tsx:57` | 🔴 Crítica | Campaña |
| 4 | "Cotizamos con **desglose detallado**" · "Cotizá tu Proyecto Gratis" | No existe estimador ni desglose en ninguna página. El componente y los 14 módulos con precio están en el repo, **sin renderizar** | ad `806775371905` desc. 3 · `components/sections/budget-calculator.tsx` (0 usos) · `lib/types/services.ts:239-257` `WEB_MODULES`/`APP_MODULES` (0 usos) | 🔴 Crítica | Sitio |
| 5 | Sitelink "Consultá gratis": "Respondemos en **menos de 2 horas**" | "Te respondo en **menos de 1 hora**" — y el callout de la misma campaña dice "Respuesta en 1 Hora" | sitelink `343513150619` vs callout `353659425779` · `app/contacto/content.tsx:213` · `app/servicios/servicios-final-cta.tsx:15` | 🟠 Alta | Campaña |
| 6 | Sitelink "Qué ofrecés" → `https://theapexweb.com/servicios` (sin `www`) | **308** → `https://www.theapexweb.com/servicios`: salto extra en cada clic pago | sitelink `353745228073` · `curl` = `308` | 🟠 Alta | Campaña |
| 7 | "¿Cuánto Sale Hacer una App?" · sitelink "Apps móviles" | `/servicios` y `/servicios#pricing` abren la pestaña **Web** por defecto; los precios de app quedan a un clic más. El sitio soporta `?tab=mobile` y la campaña no lo usa | ad `806775371905` H7 · sitelink `343513150622` · `app/servicios/content.tsx:118` (estado inicial `'web'`) y `:66-69` (sincronización con `?tab=mobile`) | 🟠 Alta | Campaña |
| 8 | Sitelink "Sobre nosotros": "**+15 proyectos** en Argentina" | El sitio no afirma eso en ningún lado. `/muestrario` publica **9** proyectos; `/sobre-mi` dice "1-2 proyectos por vez" | sitelink `343513150625` · `lib/data/showcase.ts` (9 entradas) · `app/sobre-mi/content.tsx:37,929` | 🟠 Alta | Campaña |
| 9 | "**Presupuesto en 24 Horas**" · "cotizamos en 24h" | Los precios ya están publicados (no hay que cotizar); lo que llega en plazo es el **boceto, en 24-48 h** | ad `806775371905` H6 + desc. 1 y 4 · `app/servicios/faq-data.ts:12,24` · `app/layout.tsx:57` ("48 h") | 🟡 Media | Campaña |
| 10 | Sitelink "Ver Precios" → `/servicios` | Cae en el hero; la tabla está ~2.400px más abajo. El anuncio del mismo grupo sí usa `#pricing` | sitelink `343513150616` vs ad `806775371905` · el ancla existe: `app/servicios/content.tsx:219` | 🟡 Media | Campaña |
| 11 | Callout "**Sin Formularios**" | `/contacto` tiene formulario de reserva con inputs y validación de email. El sitio dice "sin formularios **eternos**", que es otra cosa | callout `347071465188` · `app/contacto/content.tsx:64-83,167,300` | 🟡 Media | Campaña |
| 12 | 4 sitelinks + 6 callouts en estado **REMOVED**, todos duplicados textuales de los activos | — | sitelinks `343513150628`, `353745228076/79/82` · callouts `353659425776`, `353659811276/79/82/85/88/91` | 🟡 Media | Campaña |
| 13 | "Tu App Lista en **60 Días**" · "Entrega en 60 días" | El sitio **nunca** menciona 60 días (`grep` vacío en `app/` y `lib/`) | ad `806775371902` H2 + desc. 3 (grupo PAUSED) | 🟡 Media | Campaña |
| 14 | Grupo "Web para Médicos" pausado — su anuncio es el **mejor alineado** de la cuenta | Dos de sus keywords están bloqueadas por la negativa `turnos`: se rompe apenas se reactive | keywords `308565970694`, `2445237589151` · ad `813458481275` ↔ `lib/data/verticals.ts:44-116` | 🟡 Media | Campaña |
| 15 | Keywords "presupuesto/precio página web" (las de mayor gasto del grupo) | `/servicios` titula "Desarrollo de software Argentina \| Precios" — sin "página web" ni "presupuesto" | `app/servicios/page.tsx:18` · keyword `304382785080` ($18.508, lp=BELOW) | 🟡 Media | Sitio |
| 16 | Structured snippet "**E-commerce**" | El plan se llama "**Tienda Online**" | asset `349845694007` · `lib/types/services.ts:102` | 🟢 Baja | Campaña |
| 17 | Sitelink "Portfolio" → home | El portfolio dedicado es `/muestrario` (200 OK); el home sólo tiene un showcase parcial | sitelink `343513150631` · `app/page.tsx` · `app/muestrario/` | 🟢 Baja | Campaña |
| 18 | — | El docstring de `LegacyHashRedirect` afirma que `#precios` "es la final URL de los dos ad groups activos". Desde el 2026-08-22 ya no lo es | `components/seo/legacy-hash-redirect.tsx:10-13` vs final URLs reales | 🟢 Baja | Sitio |

**Rutas: ninguna rota.** Las 11 URLs de anuncios y sitelinks devuelven **200**, salvo las
4 sin `www`, que devuelven **308**. Verificado con `curl` (§4).

---

## 2. Las cinco más graves

### 1. Las negativas de campaña bloquean las keywords que pagan — $37.362/30d
`presupuesto sitio web` (BROAD, `297503551858`) es la mejor keyword de la cuenta: $32.558 y
**2 de las 5 conversiones**. Existe una negativa de campaña con ese mismo texto, así que la consulta
exacta —la de más intención— nunca sirve, mientras la broad sigue comprando variantes flojas
(`paginas web`, `sitios web`, `página web`: ~$12.000 en 30d, 0 conversiones). El mismo patrón
alcanza a `tarifario` (bloquea 2 keywords, una con QS 5 e IS 50%) y a
`busco alguien que me haga una página web`, agregada el **2026-08-22 porque ese término había
convertido**, y bloqueada desde el día uno por la negativa `web me`.

### 2. El anuncio activo vende las apps a un precio y un modelo que el sitio no tiene
El anuncio `806775371905` —el del grupo que se lleva $98.407 de los $146.721— dice
"apps desde **$1.200.000 ARS. Precio final sin sorpresas**". El sitio vende apps como **retainer
mensual**: App Producto **$580.000/mes**, App + Operaciones $1.150.000/mes, y aclara "IVA aparte".
$1.200.000 no es el precio de ningún plan: es el módulo `a1` de un estimador que no se renderiza.
Quien hace clic buscando el precio de una app encuentra otro número, otra unidad y un impuesto extra.

### 3. El anuncio promete 30 días de entrega y el sitio promete 15
"Tu Web Lista en 30 Días" aparece en los anuncios `806775371899` (grupo de $48.314) y
`803981039227`. El sitio dice "entrega en 15 días" en 11 lugares, incluida la garantía de
`faq-data.ts:16` ("si no cumplo la fecha acordada, te devuelvo el depósito"). El anuncio se vende
**peor de lo que el negocio entrega**, y regala el diferenciador más fuerte que tiene contra
la competencia.

### 4. El anuncio ofrece un desglose detallado que no existe en ninguna página
"Cotizamos con desglose detallado" (descripción 3 de `806775371905`). No hay estimador, calculadora
ni desglose en el sitio. Lo llamativo es que **está construido y no se muestra**:
`components/sections/budget-calculator.tsx` tiene 0 referencias, y `WEB_MODULES`/`APP_MODULES`
(`lib/types/services.ts:239-257`, 14 módulos con precio y precio tachado) tienen 0 usos. Es la única
inconsistencia de esta lista que se arregla **agregando** algo, no corrigiendo texto.

### 5. La campaña se contradice a sí misma sobre el tiempo de respuesta, en la misma SERP
El callout `353659425779` dice "Respuesta en 1 Hora". El sitelink `343513150619`, que se muestra en
el mismo anuncio, dice "Respondemos en menos de 2 horas". El sitio dice 1 hora
(`app/contacto/content.tsx:213`, `app/servicios/servicios-final-cta.tsx:15`). El usuario lee las dos
cifras juntas antes de hacer clic.

---

## 3. De qué lado va cada arreglo

**Campaña (15 de 18).** Todo lo que es texto de anuncio, texto de asset o URL de destino: los
hallazgos 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16 y 17. El sitio es la fuente de verdad en
precios, plazos y capacidades — es lo que el cliente termina leyendo, y en los cuatro choques de
números (precio de app, 30 vs 15 días, 24h vs 24-48h, 1h vs 2h) **el dato correcto es el del sitio**.
Ninguno se ejecuta desde acá: van a la consola, que es carril de Nacho.

**Sitio (3 de 18).** Sólo tres:
- **#4** — renderizar el estimador ya construido, o sacar "desglose detallado" del anuncio.
- **#15** — el `<title>` de `/servicios` no contiene la keyword que más gasta; encaja con el
  diagnóstico de landing experience de `reparacion-2026-08-22.md` (26 de 30 keywords con experiencia
  de página de destino por debajo del promedio).
- **#18** — docstring desactualizado en `legacy-hash-redirect.tsx`, sin efecto funcional.

---

## 4. Qué se verificó y cómo

| Frente | Método |
|---|---|
| Anuncios activos y pausados (5), títulos y descripciones | `python scripts/google-ads/audit.py` |
| Conflictos negativa ↔ keyword, duplicados, keywords sin impresiones | `python scripts/google-ads/audit2.py` |
| Sitelinks, callouts, structured snippets, imágenes (incl. REMOVED) | `mcp__google-ads__search` sobre `campaign_asset` + `asset` — `audit.py` corta en esta sección por `EXPECTED_REFERENCED_FIELD_IN_SELECT_CLAUSE` (falta `campaign.id` en el SELECT de la línea 159) |
| Estado HTTP de las 11 URLs de anuncios y sitelinks | `curl -s -o /dev/null -w "%{http_code} %{redirect_url}"` |
| Existencia de cada ruta en `app/` | listado de `app/` + `lib/data/verticals.ts` (3 slugs: `web-para-medicos`, `web-para-abogados`, `web-para-contadores`) |
| Cada promesa de anuncio contra el copy real | `grep` sobre `app/`, `lib/`, `components/` por: 1 hora, 2 horas, 24h, 48h, 15/30/60 días, 3 meses, cuotas, hosting, boceto, IVA, formulario |
| Precios y modelo de cobro | `lib/types/services.ts` (WEB_PLANS, APP_PLANS, WEB_MODULES, APP_MODULES) y `app/servicios/content.tsx` |
| Claims del vertical médicos | `lib/data/verticals.ts:44-116` contra los 15 títulos de `813458481275` |

**Un resultado negativo que vale la pena registrar:** el anuncio de médicos `813458481275` es el
único de la cuenta cuyos 15 títulos se verifican **uno por uno** contra la landing — turnos 24/7,
recordatorio por WhatsApp, señas con MercadoPago, factura AFIP, Ley 25.326, SEO local, agenda
multi-profesional, $600.000, 15-25 días. Cero inconsistencias. Su grupo está pausado.

**Lo que sí coincide** (verificado, para no volver a auditarlo): 3 meses de soporte, 3 cuotas sin
interés, boceto gratis, hosting incluido, precio fijo por escrito, Landing $300.000 / Web Interactiva
$600.000 / Tienda Online $900.000, "Flutter + Next.js", "Sin Intermediarios", "Entrega en Plazo".
