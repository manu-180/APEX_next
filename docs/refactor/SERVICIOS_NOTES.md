# SERVICIOS NOTES — refactor premium /servicios (finalizado)

> Escrito por el agente finalizador de /servicios. Estado: COMPLETO, `npx tsc --noEmit` = 0.
> Contratos: `docs/refactor/AUDIT_ADDENDUM.md` (ley) + `docs/DESIGN_BRIEF.md` §3 + `FOUNDATION_NOTES.md`.

## Qué quedó hecho (por archivo)

### `app/servicios/page.tsx`
- Orden final (brief §3): Hero → **Pricing** (`ServiciosContent`) → **Calculadora** → Proceso →
  WhyApex (franja) → AFIP → Comparativa única → Verticales → FAQ → CTA final.
- Metadata y JSON-LD FAQPage intactos (consume `SERVICIOS_FAQ_ITEMS` con campos `q`/`a`).
- Numeración de secciones: 02 pricing · 03 calculadora · 04 proceso · 05 comparativa · 06 FAQ · 07 CTA final.

### `app/servicios/content.tsx` (pricing)
- **Sin precios tachados ni "-XX%"**: eliminados de las cards Y del drawer
  (`getServiceDrawerContentProps` ya no pasa `originalPrice`/`discount` — props opcionales de
  `ServiceDrawerContent`, no se tocó ese componente). `originalPrice` sigue en `lib/types/services.ts`
  (no editado, fuera de ownership) pero ya nadie lo renderiza en /servicios.
- **UN solo badge de ancla**: pill "Más elegido" SOLO en `web_interactive` (usa `plan.badge` del data).
  El "Recomendado" con pulse que tenía Tienda Online (via `isFeatured`) se eliminó; el resto muestra
  su categoría en `Badge outline` (Esencial / E-commerce / Producto / Operación / Plataforma).
- **Anclaje visual** desacoplado de `plan.isFeatured` (que en data apunta a web_premium/app_platform):
  `ANCHOR_PLAN_IDS = {web_interactive, app_pro}` → elevación md:-mt-4, glow border, precio en primario 2.75rem.
- **De-riskers VISIBLES** (chips con check bajo el precio): web = "Boceto gratis antes de pagar" /
  "3 cuotas sin interés" / "Entrega en 15 días"; apps = sin permanencia / mejoras mensuales / etc.
  (reemplaza la línea chica `PLAN_DELIVERY`).
- **CTA de dinero**: sólido verde WhatsApp (#25D366→#128C7E, única excepción de hex) con
  `WhatsAppIcon` + `whatsappUrl(waMsgPlan(plan.name))` via `WhatsAppOutboundLink` (tracking centralizado).
  "Ver detalle completo" pasó a ghost (texto + borde solo en hover) y quedó DEBAJO del CTA verde.
- **Fix truncado mobile**: se quitó `line-clamp-2` de la descripción — el texto fluye completo.
- Entregables: se muestran TODAS las features del plan (5-7 concretas por tier, vienen del data)
  bajo label "Qué incluye". Header de sección con `editorial-label` + `heading-display` + `.section-number` 02.
- "Retainer mensual" (jerga) → "Fee mensual: desarrollo activo, soporte y mejoras · IVA aparte".
- **Intacto**: `?tab=mobile` sync (Suspense + `useSearchParams`), scroll-lock al cambiar tab,
  sticky tab toggle mobile, ProjectsSheet/ProjectDrawer/ServicePlanDrawer.

### `app/servicios/static-sections.tsx`
- (Base del agente anterior conservada: hero con panel de decisión, proceso 4 pasos, FAQ asimétrico.)
- **Números canónicos** (addendum manda sobre el "1-4 semanas" del brief §1.4): entrega = **15 días**
  unificado en FAQ ("¿Cuánto tarda...?", "¿Cómo es el proceso...?"), paso 03 del proceso
  ("Tu web en 15 días") y fila "Plazo de entrega" de la comparativa ("15 días, por escrito").
  Antes la misma página decía 15 días en cards y 1-4 semanas en FAQ → contradicción eliminada.
- **ServiciosWhyApex resumido**: la grilla ✕/✓ "Agencia tradicional vs APEX" era la segunda tabla
  comparativa (redundante con la columna Agencia de `ServiciosComparisonTable`). Ahora es una franja
  de valor 2 columnas asimétricas: quote personal + 3 diferenciadores numerados (dev directo, precio
  fijo por escrito, 15 días o devolución). Queda UNA sola tabla comparativa en la página.
- `SERVICIOS_FAQ_ITEMS`: contrato `{ q, a }` `as const` intacto (JSON-LD ok). 14 preguntas en orden
  de objeciones: precio → tiempo → confianza → proceso → ROI → garantía → logística.

### `components/sections/budget-calculator.tsx`
- SOLO estética: header asimétrico (`editorial-label--primary` "Calculadora · 5 preguntas · 90 segundos"
  + `heading-display` + `.section-number` 03), contenedor de pasos → `bento-surface`.
- **`id="calculadora"` agregado a la section** — el panel de decisión del hero linkea `#calculadora`
  y el anchor no existía.
- CTA final "Validar con Manuel por WhatsApp" → sólido verde WhatsApp con ícono.
  `goToWhatsApp`/`openWhatsAppWithThankYouPage` y TODA la lógica de cálculo sin tocar.
- Steps de Framer ahora gateados con `useReducedMotion()` (initial/exit).

### `components/sections/afip-addon.tsx`
- Copy de nicho intacto. `editorial-label--primary` "Addon · Solo Argentina" + chip de precio
  "+$200K-$400K ARS según complejidad" (reemplaza los 3 Badges), `heading-display`.
- CTA → sólido verde WhatsApp con ícono; `handleCtaClick` (tracking centralizado) sin tocar.
- Mock de factura A con CAE conservado (detalle que vende el addon).

### `app/servicios/servicios-final-cta.tsx` (reescrito)
- Cierre estilo /gracias: UNA sola acción dominante verde WhatsApp ("Hablemos por WhatsApp",
  h-14, mensaje prellenado "Hola Manuel, quiero arrancar mi proyecto. ¿Coordinamos 15 min?" —
  coincide con el claim "15 minutos gratis" del sub, regla del addendum).
- De-riskers canónicos debajo: respuesta <1 h · boceto 24-48 h · 3 cuotas.
- `.section-number` 07 como watermark. **Eliminado el prohibido "menos de 2 hs"**.

## Decisiones / gotchas para el orquestador
1. **15 días vs "1-4 semanas"**: el brief §1.4 sugiere "Desarrollo 1-4 semanas" pero el addendum
   (que gana) fija "Entrega 15 días (ya consistente)" y el prompt del finalizador lo confirma.
   Se unificó TODO /servicios a 15 días. Si Manuel quiere plazos por tier, hay que cambiarlo
   en un solo lugar por sección (FAQ x2, PROCESS_STEPS, COMPARISON_ROWS, WHY_APEX_POINTS, PLAN_DERISKERS).
2. `lib/types/services.ts` NO se tocó: `originalPrice` sigue en data pero sin render en /servicios.
   Si el estimador viejo u otra página lo renderiza, es scope de otro agente.
   `getPlanCtaLabel()` ("Consultar retainer mensual") quedó sin usar por jerga — las cards usan
   "Empezar proyecto" / "Consultar por WhatsApp" (plan sin precio).
3. `WA_GRADIENT`/`WA_SHADOW` están duplicados por archivo client (4 archivos) a propósito:
   no hay un módulo compartido sancionado y exportarlos desde `static-sections` (server) acoplaría feo.
   Si la fundación crea `lib/constants/whatsapp-visual.ts`, consolidar ahí.
4. Pendiente transversal (NO hecho acá, es del orquestador per addendum): botón flotante WhatsApp
   tapando el toggle Web/Mobile en mobile /servicios (offset/z-index del botón flotante, fuera de ownership).
5. No se usaron browser tools (regla del prompt); verificación = tsc 0 + revisión estática.
   Falta pasada visual de 7 temas + dark/light (Ctrl+R / Ctrl+Y) por quien tenga el preview.
