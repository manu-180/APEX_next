# Revisión + Optimización Apex search — 2026-06-29

_Sesión "analizá y potenciá la campaña". A diferencia de las corridas automáticas (solo negativas), esta vez se hicieron **cambios estructurales** a pedido de Manuel: pausar grupo perdedor, reforzar ganadores, negativas. Budget y bidding NO se tocaron._

## El titular: la campaña arrancó a convertir

El doc del 25-jun reportaba **0 conversiones**. La API ahora muestra **4 conversiones a WhatsApp** y el tracking funciona bien:

| Fecha | Impr | Clicks | Gasto ARS | Conv | CPC ARS |
|-------|------|--------|-----------|------|---------|
| 21-jun | 196 | 7 | $5.162 | 0 | $737 |
| 22-jun | 220 | 8 | $5.188 | 0 | $649 |
| 23-jun | 442 | 12 | $6.237 | **1** | $520 |
| 24-jun | 458 | 11 | $5.299 | 0 | $482 |
| 25-jun | 299 | 10 | $4.881 | 0 | $488 |
| 26-jun | 178 | 12 | $4.737 | 0 | $395 |
| 27-jun | 227 | 10 | $3.538 | **1** | $354 |
| 28-jun | 331 | 17 | $6.266 | **1** | $369 |
| 29-jun | 342 | 12 | $4.316 | **1** | $360 |

Dos señales muy buenas: **racha de conversiones 27-28-29** y **CPC a la mitad** ($737 → $360). El abaratamiento del clic indica que la relevancia/matching está mejorando solo.

## Diagnóstico (ventana 22–29 jun)

- 2.497 impresiones · 92 clicks · $40.462 ARS · **4 conv** · CPC prom. $440
- **Impression Share = 10%.** Reparto de lo que perdemos: **rank-lost 60%** · budget-lost 30%.
- → El cuello de botella **NO es el presupuesto, es el Ad Rank** (Quality Score). Los QS de las top keywords están en **1–3** (deberían ser ≥6). QS bajo = CPC inflado + menos impresiones ganadas.

### Grupos
| Grupo | Impr | Clicks | Gasto | Conv | Veredicto |
|-------|------|--------|-------|------|-----------|
| Presupuesto y Precios | 1.132 | 52 | $23.709 | **2** | ✅ Caballo de batalla |
| Web - Diseño y Desarrollo | 1.158 | 36 | $16.374 | **2** | ✅ Ganador |
| Web para Médicos | 380 | 11 | $5.542 | **0** | 🔴 **PAUSADO** |
| Web para Contadores | 28 | 0 | $0 | 0 | 🟡 $0, sin tracción (vigilar) |

### Keywords que convirtieron (las 4 — a cuidar y reforzar)
1. **"diseño de sitios web"** (PHRASE) — 23 clicks, 1 conv. Rey de volumen del grupo Web-Diseño.
2. **"creacion de paginas web"** (PHRASE) — 8 clicks, 1 conv.
3. **"presupuesto sitio web"** (BROAD) — 10 clicks, 1 conv.
4. **"cuanto sale una pagina web"** (EXACT) — 5 clicks, 1 conv.

Patrón: convierte la intención de **diseño/creación** y **presupuesto**, más que la de "cuánto cuesta" pura (price-curious).

## Cambios aplicados hoy (vía API)

1. **Pausado el grupo "Web para Médicos"** (202781284212). $5.542 gastados, 0 conversiones; la keyword "sistema de turnos medicos" (PHRASE) traía pacientes buscando sacar turno (apps Calu/DrApp, portales gob.ar), no empresas que contraten desarrollo. Libera ~$700-900/día que se redistribuyen a los grupos que SÍ convierten, sin tocar el techo de $5k.
2. **+8 negativas** (broad, a nivel campaña): `tm webs`, `webbily`, `luxoft`, `figma`, `onvio`, `web studio`, `inspirarse`, `websitevice`. Son marcas DIY, software contable, outsourcing IT y búsquedas de inspiración — intención de uso/curiosidad, no de contratar.
3. **+3 keywords PHRASE** a "Web - Diseño y Desarrollo": `hacer una pagina web`, `creador de paginas web`, `diseño de sitios web profesional` (refuerzan los 2 términos que ya convirtieron en el grupo).
4. **+2 keywords PHRASE** a "Presupuesto y Precios": `presupuesto de una pagina web`, `cuanto cuesta crear una pagina web`.

**NO se tocó:** budget ($5k = techo hasta 1ª venta real; las 4 conv son clicks a WhatsApp, no ventas cerradas) ni bidding (Maximize Clicks; migrar a Maximize Conversions recién con ~15-30 conv/mes acumuladas).

## Pendiente para Manuel (mayor impacto, requiere UI/landing — no se puede por API)

El MCP no edita ads, final URLs ni bidding. Estas son las palancas que más moverían la aguja ahora (atacan el 60% rank-lost):

1. **🔥 Final URL por intención (lo más importante).** Hoy todos los ads van a la home `theapexweb.com`. Quien busca "cuanto cuesta una pagina web" y cae en una home genérica → rebota → QS bajo + 0 conv. APEX **ya tiene precios públicos** ($300k / $600k / $900k): apuntar los ads del grupo "Presupuesto y Precios" a una landing que **muestre precios arriba de todo** subiría QS y conversión. Ídem: ads de apps → landing de apps.
2. **RSAs nuevos por grupo** con headlines que **repitan la keyword del grupo** (ej. grupo Precios: "Cuánto Cuesta tu Página Web", "Presupuesto Web en 1 Hora"). Mejora "ad relevance", uno de los 3 factores de QS.
3. **Keywords de apps en "Presupuesto y Precios"** (`cuanto cuesta una app`, `precio desarrollo de app`): gastaron ~$4.100 con 0 conv. La intención es excelente (apps = ticket alto $1.2M+) pero caen en landing de web. Necesitan landing de apps antes de potenciarlas; si no, considerar pausarlas.
4. **Bidding roadmap:** seguir en Maximize Clicks hasta juntar ~15-30 conversiones/mes, ahí migrar a Maximize Conversions (en la UI — el MCP tiene el cambio de bidding roto).

---
_Próxima revisión en ~3-4 días: leer search terms nuevos, cortar basura, vigilar que las 5 keywords agregadas traigan tráfico relevante y que el grupo Médicos pausado no haga falta. Cuando entre la 1ª venta real → escalar budget +15%/10 días._
