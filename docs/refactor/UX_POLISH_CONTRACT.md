# UX Polish Contract — Overhaul 2026-06-13

Contrato compartido para todos los agentes de pulido. **Leé esto entero antes de tocar nada.**
Objetivo: elevar la experiencia a nivel premium — feedback visual en cada interacción,
percepción de velocidad, microinteracciones — **sin romper nada** ni cambiar el negocio.

## Principios
1. **Feedback inmediato**: toda acción (click, submit, navegación, carga) debe tener
   respuesta visual en <100 ms (hover/active/press + loading/skeleton si tarda >300 ms).
2. **Percepción de velocidad**: reservá espacio (anti-CLS), usá skeletons en vez de spinners
   largos, animá entrada con stagger 30–50 ms.
3. **Microinteracciones con propósito**: nada decorativo porque sí. Cada animación expresa
   causa→efecto. Salida más rápida que entrada (~60–70%). `transform`/`opacity` only.
4. **Estados completos** por componente interactivo: default · hover · focus-visible · active/press
   · disabled · loading · empty · error. Si falta alguno y aplica, agregalo.
5. **Pulido, no rediseño**: respetá el layout, el copy y la jerarquía actuales. Mejorá el *cómo se siente*.

## Primitivas disponibles (USALAS, no reinventes)
- `Button` (`@/components/ui/button`) — props nuevas `isLoading` + `loadingText`
  (muestra spinner, `aria-busy`, bloquea click). Variants: primary/secondary/ghost/outline.
- `Spinner` (`@/components/ui/spinner`) — SVG `currentColor` + `animate-spin`.
- `Skeleton` (`@/components/ui/skeleton`) — placeholder con barrido (`.skeleton`). Para imágenes
  en drawers/cards y contenido async. Reserva el alto/ancho para evitar saltos.
- `useToast` / `ToastProvider` (`@/components/ui/toast`) — feedback efímero accesible
  (`toast({ title, description?, variant: 'success'|'error'|'info'|'default', duration? })`).
  El provider YA está montado en `app-shell`. Usalo para éxito/error de submit, updates realtime,
  copiar al portapapeles, etc. No roba foco (aria-live).
- `WhatsAppOutboundLink` (`@/components/whatsapp/whatsapp-outbound-link`) — YA acusa el click
  (pulso `.cta-opening` + `aria-busy`). No dupliques ese feedback.

## Tokens y utilidades (NO usar valores arbitrarios)
- Colores SIEMPRE vía CSS vars: `var(--color-primary)`, `rgba(var(--color-primary-rgb), …)`,
  `--color-surface(-low/high/highest/base)`, `--color-on-surface(-variant)`, `--color-online/offline`, `--color-outline`.
- Utilidades existentes en `globals.css` (greppéalas antes de crear nada nuevo): `glass`,
  `glow-card`, `shadow-glow(-sm/-lg)`, `glow-text`, `text-gradient-primary`, `btn-tech` family,
  `editorial-label`, `section-number`, `bento-surface`, `divider-theme`, `heading-display`, `.btn-wa`.
- Espaciado/scale: usá la escala 4/8px existente y los tokens `--space-*`, `--radius-*`, `--z-*`.

## Reglas de animación (de ui-ux-pro-max)
- Duración micro 150–300 ms; nunca >500 ms. Easing entrada `ease-out` (`[0.22,1,0.36,1]`), salida `ease-in`.
- **`prefers-reduced-motion`**: TODA animación Framer con `initial={{opacity:0…}}` necesita el patrón
  `const prefersReducedMotion = useReducedMotion()` y `initial={prefersReducedMotion ? false : {...}}`.
  Mantené ese contrato (ya se usa en todo el repo). Nada se debe quedar invisible con reduced-motion.
- Stagger de listas/grids 30–50 ms por item. `whileTap`/`active:scale-[0.97]` en tappables.

## HARD CONSTRAINTS (no negociable)
- **NO editar `app/globals.css`.** Si necesitás un keyframe/utilidad compartida, usá Tailwind
  (`animate-pulse`, `animate-spin`, `transition`, etc.) o estilos inline. Si realmente hace falta algo
  global, **anotalo en tu reporte** y lo agrega el orquestador. (Evita conflictos entre agentes.)
- **NO tocar** archivos fuera de tu lista asignada. **NO** cambiar APIs públicas/exports de componentes
  (otros agentes dependen de ellas).
- **NO cambiar copy, precios, números canónicos, ni lógica de negocio/tracking.** Verdades canónicas en
  `docs/DESIGN_BRIEF.md` y `docs/refactor/AUDIT_ADDENDUM.md` (respetalas).
- **CTA de dinero = verde WhatsApp sólido** (`#25D366`→`#128C7E`). No lo tematices ni le cambies color.
- **NO** agregar dependencias nuevas. NO migrar Next. Trabajás directo en `main`.
- Mantené `npx tsc --noEmit` verde para tus archivos. Touch targets ≥44px en mobile. `focus-visible` siempre visible.
- Imágenes: `next/image` con `sizes` correcto; `Skeleton`/`placeholder="blur"` para las pesadas en drawers.

## Reporte final (devolvé esto como tu mensaje final)
1. Archivos modificados (lista).
2. Por archivo: 2–5 bullets de qué mejoraste (estado/feedback/microinteracción).
3. Cualquier utilidad/keyframe global que pediste que agregue el orquestador (con el CSS sugerido).
4. Confirmación: reduced-motion respetado · sin cambios de copy/precio/lógica · tsc de tus archivos OK.
