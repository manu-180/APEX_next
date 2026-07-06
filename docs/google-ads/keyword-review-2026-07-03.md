# Revisión completa Apex search — 2026-07-03

_Sesión "revisión completa + refinar lo más posible". Se usó el MCP de Google Ads (datos + escritura) y el MCP de Chrome DevTools (auditoría de landing en mobile con Lighthouse). Budget y bidding NO se tocaron. Copy de RSAs en `copy-pack-ui-2026-07-03.md`._

## Titular: convierte de forma sostenida, el freno es Quality Score (no la plata, no la landing)

**Datos 30 días (03-jun → 03-jul):** 3.658 impr · 131 clicks · **$57.199 ARS** · **5 conv (WhatsApp)** · CPC $437 · CTR 3,58% · **costo/contacto ≈ $11.440**.
Conversiones: 23, 27, 28, 29 y **30-jun** (racha 27-28-29-30). Gasto real ≈ **$1.907/día** vs techo $5.000 → **hay headroom, el budget no es el límite.**

**Impression Share:** search IS **9,99%** · **rank-lost 66%** · budget-lost 24,6%.
→ El cuello de botella es **Ad Rank / Quality Score** (QS de las keywords que sirven = **1-3**). Si sube a 5-7: CPC −30/50% **y** más impresiones ganadas, todo dentro del mismo $5k.

### 🔑 Hallazgo nuevo — Device: el 100% de las conversiones son MOBILE
| Device | Impr | Clicks | Gasto | Conv | CTR |
|--------|------|--------|-------|------|-----|
| Mobile | 2.588 | 104 | $44.766 | **5** | 4,0% |
| Desktop | 1.037 | 25 | **$11.803** | **0** | 2,4% |
| Tablet | 33 | 2 | $630 | 0 | 6,1% |

Desktop se lleva ~21% del presupuesto y no genera un solo contacto (la conversión es un click a WhatsApp = comportamiento de celular). **Palanca inmediata: ajuste de puja Desktop −60% (o −100%) en UI.** El MCP no hace bid adjustments por device.

### 🔑 El QS bajo NO es la landing — auditada por Chrome DevTools (mobile)
Lighthouse mobile de `theapexweb.com`: **Accessibility 96 · Best Practices 100 · SEO 100.** Precio visible en el hero ($300.000), WhatsApp por todos lados, rápida (Next/Vercel). La landing es de primer nivel. El QS bajo es **ad-side**:
1. Todos los ads apuntan a la **home**; los de intención de precio deberían ir a **/servicios** (tabla $300k/$600k/$900k).
2. RSAs poco relevantes al keyword del grupo (falta headline que espeje la búsqueda, pineado).
3. Cuenta nueva sin historial de CTR + match types anchos que ensucian la CTR.

### Grupos (30 días)
| Grupo | Impr | Clicks | Gasto | Conv | Veredicto |
|-------|------|--------|-------|------|-----------|
| Presupuesto y Precios | 1.653 | 71 | $30.474 | **2** | ✅ Caballo de batalla |
| Web - Diseño y Desarrollo | 1.584 | 48 | $20.810 | **3** | ✅ Ganador |
| Web para Médicos | 380 | 11 | $5.542 | 0 | 🔴 PAUSADO (ok) |
| Web para Contadores | 41 | 1 | $374 | 0 | 🟡 muerto (QS 0) — relanzar o pausar |

### Keywords que convirtieron (los 5 — cosechados a EXACT hoy)
1. **"diseño de sitios web"** (Web-Diseño)
2. **"presupuesto sitio web"** (Precios)
3. **"creacion de paginas web"** (Web-Diseño, QS 2)
4. **"cuanto sale una pagina web"** (Precios)
5. **"hacer una pagina web"** (Web-Diseño) + search term "hacer pagina web online" (convirtió)

## Cambios aplicados hoy (vía API / MCP)

1. **+31 negativas BROAD** (nivel campaña):
   - **Pacientes/gobierno:** `turnos`, `gob`, `gov` (mata el ruido "…gov.ar…turnos", ~$3k).
   - **DIY / aprendices / gratis:** `gratis`, `curso`, `cursos`, `tutorial`, `plantilla`, `plantillas`, `template`, `templates`, `inspirarse`, `inspiracion`, `como hacer`, `como crear`, `como abrir`, `modelo landing page`, `modelos de paginas web`.
   - **Empleo:** `sueldo`, `salario`, `empleo`.
   - **Foráneo / marca:** `website`, `web design`, `tiendanegocio`.
   - **Precio-de-app (quirúrgicas, multi-palabra):** `cuanto cuesta una app`, `precio desarrollo de app`, `presupuesto app movil`, `cuanto sale una app`, `cuanto sale crear una app`, `cuanto cuesta hacer una app`, `precio de una app`. Frenan ~$5.400/mes de shoppers de apps que caían sin landing de apps (apps = a medida).
   - **NO se agregó** `negocio` (rompería la keyword "página web para mi negocio") ni `landing page` (APEX vende landings) — necesitan negativa EXACT en UI.
2. **+4 keywords EXACT** a "Web - Diseño y Desarrollo" (`196839024158`): `[diseño de sitios web]`, `[creacion de paginas web]`, `[hacer una pagina web]`, `[hacer pagina web online]`. Cosecha de convertidores a exact = mejor control + potencial de QS más alto.
3. **+2 keywords EXACT** a "Presupuesto y Precios" (`196839024238`): `[presupuesto sitio web]` (era BROAD), `[cuanto sale una pagina web]`.

**NO se tocó:** budget ($5k = techo hasta 1ª venta real; las 5 conv son clicks a WhatsApp, no ventas) ni bidding (Maximize Clicks / TARGET_SPEND; migrar a Maximize Conversions con 15-30 conv/mes).

## Pendiente para Manuel (UI/landing — no se puede por API), por impacto
1. **🔥 Ajuste de puja Desktop −60%/−100%** (Configuración → Dispositivos). El de mayor ROI y 1 minuto.
2. **Ads de "Presupuesto y Precios" → final URL /servicios.** Ataca el rank-lost del grupo que más gasta.
3. **RSAs nuevos por grupo** con headline = keyword del grupo, pineado a pos.1 (copy listo en `copy-pack-ui-2026-07-03.md`).
4. **Limpiar keywords de app-price** en Precios (ya neutralizados por negativa; quitarlos evita el aviso de conflicto).
5. **Contadores:** relanzar con landing propia + RSA, o pausar.
6. **Bidding:** seguir en Maximize Clicks hasta 15-30 conv/mes.

---
_Próxima revisión ~08-jul: leer search terms nuevos, verificar que las EXACT nuevas traigan tráfico y que las 31 negativas no hayan cortado nada bueno. Cuando entre la 1ª venta real → escalar budget +15%/10 días._
