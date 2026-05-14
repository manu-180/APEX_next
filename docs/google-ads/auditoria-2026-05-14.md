# Auditoría Google Ads APEX — 14 de mayo de 2026

> Customer ID: **4869983637** · Cuenta: APEX · Currency: ARS · Timezone: America/Buenos_Aires
> Conversion tracking ID: 18041789644 · Auto-tagging: ON

---

## TL;DR — Por qué sentiste que empeoró

El cambio del **12 de mayo** bajó el budget de la campaña Search dramáticamente, pero el problema principal NO era el budget. Eran tres cosas al mismo tiempo:

1. **Conversiones contaminadas**: "Scroll 50% de página" estaba marcada como conversión **primaria**, así que Google estaba optimizando para gente que scrollea, no para gente que contacta. 55 de las 295 conversiones de PMax eran scrolls inútiles.
2. **Bidding strategy obsoleta** en Search (Maximize Clicks / TARGET_SPEND), no usa señales de conversión.
3. **Geo targeting demasiado amplio**: configurado como "Presence OR interest" — gastabas en gente fuera de Argentina con interés tangencial.
4. **Search Impression Share del 10%** — perdiendo 90% de las oportunidades por bajo rank y budget bajo.

---

## Cambios aplicados automáticamente hoy

| # | Cambio | Antes | Después |
|---|--------|-------|---------|
| 1 | Budget **APEX (PMax)** | $4.500/día | **$2.500/día** |
| 2 | Budget **Apex search** | $250/día | **$500/día** |
| 3 | Negativas en **APEX (PMax)** | 11 | **122** (+111) |
| 4 | Negativas en **Apex search** | 140 | **218** (+78) |

**Negativas agregadas** cubren:
- **Geo no-target**: cordoba, mendoza, rosario, salta, mar del plata, neuquen, santa fe, tucuman
- **Empleo**: trabajar de, salario, sueldo, jobs, junior, trainee, vacante, pasante, becas, sin experiencia, buscamos desarrollador
- **DIY/Tutoriales**: como crear, como hacer, desde cero, sin saber, paso a paso, ejemplo, ejemplos, qué es, definición, como funciona, video tutorial
- **Builders/Competidores SaaS**: wix, wordpress, shopify, tienda nube, godaddy, framer, webflow, squarespace, weebly, magento, prestashop, ionos, zyro, lovable, emergent, thunkable, kodular, adalo, bubble, flutterflow, appy pie, 10web, appcreator24, weblium, ucraft, duda
- **Estudiantes**: udemy, platzi, coursera, freecodecamp, youtube, facultad, universidad, estudiar, para estudiantes, para principiantes
- **Tecnologías DIY**: html, css, javascript, python, react, vue, angular, github, android studio, play store, descargar, instalar
- **Verticales no foco**: abogados, inmobiliarias, para vender productos, para vender online
- **Ruido**: arquitectura, footer, header, responsive, manual, guía, significado, para empezar

---

## ⚠️ ACCIONES MANUALES PENDIENTES (no se pueden hacer vía API)

### 1. CRÍTICO — Quitar "APEX - Scroll 50pct" como conversión primaria
**Por qué importa**: Esto envenena el bidding. PMax está optimizando para gente que scrollea (basura) en vez de gente que contacta.

**Cómo**:
1. Ir a **Herramientas y configuración → Conversiones**.
2. Buscar **"APEX - Scroll 50pct"**.
3. Cambiar **"Acción principal"** → **"Acción secundaria"** (NO la elimines; solo cambia el tipo).
4. Hacer lo mismo verificando que estén como **primaria** solo:
   - `ceramicaapp-9abd8 (web) conversion` (CONTACT)
   - `APEX - WhatsApp Click` (CONTACT)
   - `APEX - Hero CTA Click` (LEAD_FORM)

### 2. CRÍTICO — Cambiar bidding strategy de Apex search
**Por qué importa**: TARGET_SPEND (Maximize Clicks) no usa señales de conversión. Con 34 conversiones en 30 días ya hay volumen para smart bidding.

**Cómo**:
1. Abrir campaña **"Apex search"**.
2. **Configuración → Ofertas → Cambiar estrategia de ofertas**.
3. Elegir **"Maximizar conversiones"**.
4. **NO** establecer un Target CPA ceiling todavía (dejar que aprenda 2 semanas).
5. *(El MCP de Google Ads tiene un bug que no permite hacer este cambio vía API — por eso queda manual)*.

### 3. ALTO — Restringir geo targeting a "Presence" solo
**Por qué importa**: "Presence or interest" hace que se gaste en personas fuera de Argentina (turistas, expatriados, etc.) que solo *buscaron* algo argentino. Quemás budget sin sentido.

**Cómo**:
1. Abrir cada campaña → **Configuración → Ubicaciones → Opciones de ubicación**.
2. Cambiar **"Presence or interest"** → **"Presence: People in or regularly in your targeted locations"**.
3. Aplicar a **APEX** y **Apex search** por separado.

### 4. MEDIO — Eliminar duplicados
- **Budget huérfano "Campaign #1"** ($0,01/día, sin asignar): borrar en **Campañas → Presupuestos compartidos**.
- **Ad duplicado en Apps - Mobile**: hay 2 RSAs casi idénticos (IDs `806775371902` y `806854817249`). Pausar el más débil (Average) y dejar solo el mejor.
- **Ad group "Apex search recursos"** ya está pausado pero es duplicado de otros 3. Confirmar que sigue pausado.

### 5. BAJO — Mejorar Quality Score
Casi todas las keywords tienen **Quality Score 0**. Solo 1 keyword tiene QS=6. Razones:
- Bidding strategy actual (TARGET_SPEND) no calcula bien QS.
- Bajo histórico (90% impression share lost por rank).
- Después de cambiar a Maximize Conversions, dejar correr 2 semanas y volver a auditar.

---

## Diagnóstico detallado (últimos 30 días)

### Performance por campaña

| Métrica | APEX (PMax) | Apex search |
|---------|-------------|-------------|
| Impresiones | 518.629 | 3.492 |
| Clicks | 10.843 | 152 |
| CTR | 2,09% | 4,35% |
| CPC promedio | $14 | **$886** ⚠️ |
| Costo total (30d) | $151.915 | $134.694 |
| Conversiones | 295 | 34 |
| CPA promedio | $515 | $3.962 |
| Search Impression Share | 9,99% | 9,99% |
| Lost IS — budget | 7,95% | **43,1%** ⚠️ |
| Lost IS — rank | **85,8%** ⚠️ | 47,6% |

### Breakdown de conversiones (30 días) — qué realmente cuenta

| Conversion action | Tipo | APEX (PMax) | Apex search | ¿Real? |
|-------------------|------|-------------|-------------|--------|
| `ceramicaapp-9abd8 (web) conversion` | CONTACT | 203 | 32 | ✅ Sí — contactos WhatsApp |
| `APEX - Hero CTA Click` | LEAD_FORM | 29 | 1 | ✅ Sí — clics CTA principal |
| `APEX - WhatsApp Click` | CONTACT | 8 | 0 | ✅ Sí — pero tracking nuevo, pocos datos |
| **`APEX - Scroll 50pct`** | PAGE_VIEW | **55** | 1 | ❌ **BASURA — está envenenando el bidding** |

> **El 19% de las conversiones de PMax son scrolls inútiles.** Eso explica por qué el bidding parece bueno por número pero no genera contactos reales.

### Search terms con costo alto y CERO conversiones (top 15)

| Query | Costo | Comentario |
|-------|-------|-----------|
| busco alguien que me haga una pagina web | $2.754 | (positivo en intent, pero 0 conv) |
| diseño web cordoba | $2.027 | Geo no-target → negativizado |
| diseñador de paginas web | $1.287 | OK pero sin conversión |
| cuanto cobrar por un ecommerce en wordpress | $1.179 | Búsqueda de OTRO dev → negativizado |
| como crear una tienda nube | $1.091 | DIY → negativizado |
| como crear una app desde cero | $1.085 | DIY → negativizado |
| como hacer una app para android | $1.016 | DIY → negativizado |
| como crear una app de juegos | $970 | DIY → negativizado |
| crear tu sitio web con wordpress en 10 pasos | $883 | DIY → negativizado |
| como crear una aplicación sin saber programar | $709 | DIY → negativizado |
| android studio crear app | $750 | Devs estudiando → negativizado |
| trabajar de desarrollador web | $452 | Empleo → negativizado |
| diseño web para abogados | $491 | Genérico → negativizado |

**Total derroche estimado** (queries sin conversión que ahora están negativizadas): **~$25.000 ARS / mes**.

### Cambios del 12 de mayo (lo que vos hiciste antes)
- 1 update de `CAMPAIGN_BUDGET` (probablemente bajar Apex search)
- 45 keywords negativas agregadas (bueno)
- Esos cambios estuvieron bien orientados, pero quedaron incompletos porque no se tocó bidding, scroll-as-conversion, ni geo targeting.

---

## Estructura actual de la cuenta

### Campañas
| Nombre | ID | Tipo | Status | Bidding | Budget |
|--------|-----|------|--------|---------|--------|
| APEX | 23692206380 | Performance Max | ENABLED | MAXIMIZE_CONVERSIONS (target CPA $1.500) | **$2.500/d** |
| Apex search | 23721057489 | Search | ENABLED | TARGET_SPEND (Maximize Clicks) ⚠️ | **$500/d** |

### Ad Groups (Search)
| Nombre | ID | Status | Keywords |
|--------|-----|--------|----------|
| Web - Diseño y Desarrollo | 196839024158 | ENABLED | 13 |
| Apps - Mobile | 196839024198 | ENABLED | 8 |
| Presupuesto y Precios | 196839024238 | ENABLED | 7 |
| Apex search recursos | 197972840311 | PAUSED | 12 (duplicados) |

### Ads
- Web - Diseño y Desarrollo: 1 RSA (`806775371899`) ad_strength=**GOOD**
- Apps - Mobile: 2 RSA casi idénticos (`806775371902` AVERAGE, `806854817249` AVERAGE) ⚠️ duplicado
- Presupuesto y Precios: 1 RSA (`806775371905`) ad_strength=**GOOD**
- Apex search recursos (PAUSED): 1 RSA (`803981039227`) AVERAGE

### Asset Group de PMax
- "Recuros APEX" — ID 6692951901, ad_strength=**EXCELLENT** ✅

### Conversion Actions activas (Primary)
- `ceramicaapp-9abd8 (web) conversion` — CONTACT — ✅ correcto
- `APEX - Hero CTA Click` — SUBMIT_LEAD_FORM — ✅ correcto
- `APEX - WhatsApp Click` — CONTACT — ✅ correcto
- `APEX - Scroll 50pct` — PAGE_VIEW — ❌ **debe ser Secondary**

---

## Plan de próximos 14 días

### Día 0 (hoy) ✅
- [x] Auditoría completa
- [x] Negativas masivas agregadas
- [x] Budgets reequilibrados ($2.500 PMax + $500 Search)

### Día 0-1 (TU TURNO en UI)
- [ ] Marcar "Scroll 50pct" como Secondary (5 min)
- [ ] Cambiar bidding Apex search a Maximize Conversions (2 min)
- [ ] Geo targeting a "Presence" solo (3 min)
- [ ] Pausar el ad duplicado en Apps - Mobile (2 min)
- [ ] Eliminar budget huérfano "Campaign #1" (1 min)

### Día 2-7
- No tocar nada. Dejar que aprenda.
- Revisar el sábado siguiente (21 de mayo): que las conversiones reales (CONTACT/LEAD_FORM) suban relativamente vs Scroll.

### Día 8-14
- Si CPA real < $1.500 en Search → bajar a Target CPA $1.200.
- Si Search IS sigue <30% por budget → subir a $750/día.
- Si PMax sigue dominando contactos → mantener $2.500/d; si Search crece → balancear.

### Cuando entren los $300K
- Subir Apex search a $1.000-1.500/día.
- Subir PMax a $3.500-4.500/día.
- Total ~$5.000/día = $150K/mes (sustainable durante 2 meses con los $300K).

---

## Métricas objetivo (post-cambios)

| Métrica | Estado actual | Objetivo 30 días |
|---------|---------------|------------------|
| Conversiones reales (CONTACT) / mes | ~235 | **>300** |
| % conversiones de Scroll | 19% | **0%** (después de cambiar a Secondary) |
| CPA real | $515 (contaminado) | **<$800 real** |
| Search Impression Share | 10% | **>30%** |
| Lost IS por budget (Search) | 43% | **<20%** |
| Quality Score promedio | 0 | **>5** |

---

## Lecciones para no repetir

1. **NUNCA usar acciones de tracking pasivo (scroll, page view, session start) como conversión primaria.** Solo intención real (formulario, WhatsApp click, llamada, compra).
2. **Smart bidding necesita ≥30 conversiones/mes** — Apex search ya las tiene, no hay razón para seguir en Maximize Clicks.
3. **Geo "Presence" salvo que vendas turismo** — "Presence or interest" arruina presupuestos pequeños.
4. **Match types**: las BROAD necesitan smart bidding + monitoreo semanal de search terms. Si no hay tiempo, mantener todo en PHRASE.
5. **PMax con bajo budget necesita asset signals fuertes** — el asset group "Recuros APEX" ya tiene strength=EXCELLENT, eso ayuda.

---

*Última actualización: 2026-05-14*
*Próxima revisión sugerida: 2026-05-21 (7 días)*
