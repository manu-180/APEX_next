# Relanzamiento campaña Search "Apex search" — 2026-06-12

Ejecutado vía MCP de Google Ads tras investigación multi-agente con verificación adversarial.
Contexto/relevamiento previo: `contexto-search-2026-06-10.md` · Copy para UI: `copy-pack-ui-2026-06-12.md`

## ✅ Cambios EJECUTADOS por API (2026-06-12)

### Campaña
- **"Apex search" (23721057489) → ENABLED** (estaba pausada desde ~20 de mayo)
- **Presupuesto: $500 → $2.000 ARS/día** (con CPC real de $250-500, $500/día compraba 1 click/día; $2.000 ≈ 4-8 clicks/día)
- Bidding queda en TARGET_SPEND (Maximize Clicks) — correcto para <30 conv/mes
- PMax "APEX" (23692206380): **REMOVED por Manuel desde la UI** el 2026-06-12 00:08 (no fue el MCP). Es permanente.

### Keywords agregadas (42, todas verificadas contra las 316 negativas)

**Web - Diseño y Desarrollo (196839024158)**
- EXACT: diseño pagina web empresa · desarrollo de paginas web ⚠️vigilar · empresa de desarrollo web · agencia de desarrollo web · desarrollo de software a medida
- PHRASE: desarrollo de paginas web argentina · diseño de paginas web para empresas · empresa de diseño web · agencia de paginas web · hacer pagina web para mi empresa · pagina web para pymes · tienda online a medida · desarrollo ecommerce argentina · empresa de desarrollo de software argentina · sistemas a medida para empresas

**Apps - Mobile (196839024198)**
- EXACT: desarrollo de apps · programadores de app · empresa desarrollo de apps · contratar desarrollador de apps · hacer una app para mi negocio · desarrollo de apps argentina · crear una app para mi negocio
- PHRASE: desarrollo de aplicaciones moviles argentina · desarrollo de apps a medida · desarrollo de apps para empresas · empresa desarrollo de aplicaciones · agencia de desarrollo de apps · hacer una app para mi empresa · desarrollo de apps ios y android

**Presupuesto y Precios (196839024238)**
- EXACT: precio de paginas web argentina · cuanto cuesta una pagina web · cuanto cuesta una pagina web en argentina · cuanto cuesta una app · presupuesto pagina web · cuanto sale una pagina web · precio pagina web
- PHRASE: precio pagina web argentina · presupuesto desarrollo web · cuanto cuesta hacer una app · precio desarrollo de app · presupuesto app movil · cuanto cuesta una tienda online

### Negativas agregadas (88 → total ~315 en campaña)
Job-portales/laboral: bumeran, zonajobs, glassdoor, cv, curriculum, sueldos, se busca, postularse, laboral, sin experiencia, cuanto gana, cuanto ganan
Builders/no-code/IA: tiendanube, hostinger, jimdo, mobirise, carrd, base44, replit, v0, cursor, vibe, vibecoding, donweb, elementor, woocommerce, canva, google sites, app builder, chatgpt, no code, nocode, sin codigo, sin código
Educación: curso, cursos, bootcamp, diplomatura, tecnicatura, certificacion, certificación, examen, coderhouse
Informacional: pdf, historia, ventajas, desventajas, caracteristicas, características, tipos, partes, estructura, diferencia, diferencias, sirve, importancia, wikipedia, tesis
Low-cost: economica, economico, barato, barata, low cost, sin costo, gratuita
Software ajeno: sap, odoo, genexus, drupal, moodle, roblox, tango gestion, power bi
Otros países (geo es presence-or-interest): españa, mexico, méxico, chile, peru, perú, colombia, uruguay, paraguay, bolivia, ecuador, venezuela, madrid, montevideo, santiago

Exclusiones deliberadas (NO se negativizaron, son leads): mercadolibre/mercado libre (vendedor ML que quiere tienda propia = lead de ecommerce $900K) · clases/capacitacion/academia (institutos = lead + afinidad Assistify) · crm ("crm a medida" ES el servicio) · hosting/excel/access (rechazadas por el verificador: bloqueaban compradores tipo "web con hosting incluido" o "sistema a medida para reemplazar excel")

## 📋 PENDIENTE — Solo se puede hacer en la UI de Google Ads

### Alto impacto (hacer ya)
1. **Geo targeting → "Presencia"** (hoy: presence-or-interest): Campaña → Configuración → Ubicaciones → Opciones de ubicación → "Presencia: personas en tus ubicaciones segmentadas". Las negativas de países tapan el agujero parcialmente, pero esto lo cierra de raíz.
2. **Conversión "APEX - Scroll 50pct" → Secondary** (hoy Primary, mete ruido al algoritmo): Herramientas → Conversiones → APEX - Scroll 50pct → editar → "Acción secundaria".
3. **Sitelink "Ver Presios" → typo** ("Precios"). Borrar sitelinks duplicados y los 2 de "proyectos" (la página /proyectos fue ocultada del sitio). Aplicar pack de 6 sitelinks de `copy-pack-ui-2026-06-12.md`.
4. **Negativas dañinas a sacar** (Palabras clave → Negativas):
   - "para android" / "para ios" → bloquean compradores reales ("hacer app para android" convirtió 2 veces)
   - "para vender online" / "para vender productos" → matan al comprador e-commerce de $900K
   - "buscamos desarrollador" → anula la keyword propia "buscamos desarrollador web" (que convirtió)
   - "abogados" → bloquea la vertical /web-para-abogados
   - "inmobiliarias", "arquitectura" → verticales premium potenciales
   - "responsive" → la usan clientes semi-informados reales
   - "freelance"/"freelancer" → o se sacan, o pausar la keyword "programador web freelance Buenos Aires" (hoy muerta)

### Impacto medio
5. **RSAs nuevos** por ad group (no se pueden editar los existentes; crear nuevos con el pack y pausar los viejos a mano). Apps tiene strength AVERAGE — el pack lo sube.
6. **Callouts duplicados** → limpiar (Presupuesto Gratis ×3, etc.) y aplicar pack.
7. **Ad groups nuevos** (el verdadero salto premium, copy completo en el pack):
   - "Software a Medida" → homepage
   - "Web para Médicos" → https://www.theapexweb.com/web-para-medicos
   - "Web para Contadores" → https://www.theapexweb.com/web-para-contadores
   - "Web para Abogados" → https://www.theapexweb.com/web-para-abogados (PRIMERO sacar negativa "abogados")
   - ⚠️ Si se crea el grupo de médicos: la negativa nueva "historia" bloquearía "web medicos historia clinica" — sacarla en ese momento.
8. **Tope de CPC en Maximize Clicks** (ej. $600 ARS): Configuración → Ofertas → "Límite de oferta de CPC máx."
9. **Price assets** con los precios reales (pack).
10. Eliminar budget huérfano "Campaign #1" (15458880228) y ahora también el de la PMax eliminada (15453993749).

## 📊 Monitoreo (primeras 2 semanas)
- Search terms report a los 7 y 14 días: vigilar especialmente [desarrollo de paginas web] EXACT (borderline, intent mixto) y "tienda online a medida" PHRASE.
- Si el gasto se va arriba sin conversiones → bajar budget o poner tope de CPC.
- Cuando haya ≥30 conversiones/mes reales (sin scroll): pasar a Maximize Conversions o tCPA (en UI — el MCP tiene el bug conocido en update_bidding_strategy).

## Datos de referencia
- Customer: 4869983637 · Campaña: 23721057489 · Budget ID: 15488956966
- Performance pre-pausa (mar-jun): 191 clicks, CTR 4,2%, 35 contactos GA4 reales
- Conversion actions primarias OK: ceramicaapp-9abd8 (web) conversion = contactos APEX reales (slug legado)
