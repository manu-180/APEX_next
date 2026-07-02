# APEX Design Language v2

# APEX Design Language v2 — "Instrumento aeroespacial, voz editorial"

Una sola voz visual para todo el sitio: **panel de instrumento de precisión** (dark-first, aerospace/cyberpunk suave) con **calidez editorial rioplatense**. Todo lo que sigue es LEY para cada paquete de implementación. Si una auditoría propuso un valor distinto al de este spec, gana el spec.

---

## 1. Motion — curva firma y tokens

**Curva firma única del sitio: `cubic-bezier(0.22, 1, 0.36, 1)`** (ease-out expresivo con settle largo). Es la curva que ya domina el código; se promueve a token y se elimina toda divergencia — incluida la `[0.16, 1, 0.3, 1]` que usa /servicios hoy: toda animación nueva o tocada migra a la firma.

Tokens en `:root` de globals.css (los define foundation, NADIE los redefine):

```css
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);      /* firma — default universal */
--ease-in-out-custom: cubic-bezier(0.65, 0, 0.35, 1); /* solo cross-fades simétricos */
--dur-fast: 150ms;   /* micro: color, opacity de links, focus */
--dur-base: 300ms;   /* hover de cards, botones, iconos cinéticos */
--dur-slow: 600ms;   /* transiciones de superficie (navbar morph usa 500ms explícito) */
--dur-reveal: 800ms; /* entradas de sección */
```

En tailwind.config.ts: `transitionTimingFunction: { DEFAULT: 'var(--ease-out)', out: 'var(--ease-out)' }` — así `ease-out` de Tailwind apunta a la firma en todo el sitio.

En `lib/motion.ts` (fuente única para Framer/GSAP):

```ts
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const SPRING_TILT  = { stiffness: 88,  damping: 19, mass: 0.82 }; // tilt 3D de cards
export const SPRING_SNAP  = { stiffness: 320, damping: 22 };             // hover-lift, UI snap, drawer
export const SPRING_FOCUS = { stiffness: 400, damping: 28 };             // micro-focus de inputs
export const STAGGER_TIGHT = 0.03;  // filas densas (modal shortcuts)
export const STAGGER_BASE  = 0.06;  // grillas de cards (45–80ms rango legal)
export const STAGGER_LOOSE = 0.12;  // pasos narrativos secuenciales (proceso, beneficios)
export const DELAY_AFTER_PANEL = 0.12; // contenido que entra después del spring de un panel
```

**Reglas duras de motion:**
- Solo `transform` y `opacity` animables por default. `filter: blur()` permitido SOLO en entradas one-shot (reveals), nunca en loops ni hover continuo.
- PROHIBIDO: `transition-all`, `hover:brightness-*`, animar `height` (usar opacity o grid-rows), easings string genéricos (`ease`, `easeOut`, `ease-in-out`) en interacciones.
- Loops infinitos: solo CSS compositado (`@property` + animation), nunca rAF/Framer `repeat: Infinity` en main thread. Idle = quieto; el shimmer/scan es recompensa de hover, no ruido permanente.
- `ease: 'linear'` permitido ÚNICAMENTE en marquees continuos.

## 2. Reveal firma (entrada estándar de secciones y cards)

```
initial:  { opacity: 0, y: 24–32, filter: 'blur(6px)' }
animate:  { opacity: 1, y: 0, filter: 'blur(0px)' }
transition: { duration: 0.8, ease: EASE_OUT }
viewport: { once: true }
```

Implementado UNA vez en `SectionReveal` v2 (con prop `stagger` para cascadas). Las áreas lo consumen; no reinventan reveals ad-hoc. **Excepción LCP sagrada:** el h1 del hero de la home jamás anima opacity ni blur — su entrada es transform-only (`translateY`), servido visible en el primer frame.

## 3. Elevación y double-bezel

Escala de elevación (dark como referencia; light ya tiene su sistema navy):

- **E0 — plano:** border 1px `var(--glass-border)`, sin sombra. Metadatos, listas.
- **E1 — card:** border + `inset 0 1px 0 rgba(255,255,255,0.04)` + `0 8px 24px -16px rgba(var(--shadow-tint-rgb), 0.5)`.
- **E2 — panel glass:** glass v2 (ver §4).
- **E3 — héroe/bezel:** double-bezel + noise + sombra primaria tintada `0 16px 40px -20px rgba(var(--color-primary-rgb), 0.12–0.35)`. Reservado a 1–2 superficies por página (card ancla de pricing, retrato founder, featured del blog, paneles de decisión de contacto, PreviewCard).

**Double-bezel (shell + core, radios concéntricos SIEMPRE calculados):**

```css
--radius-shell: 1.25rem;
--bezel-pad: 0.375rem; /* 6px */
--radius-core: calc(var(--radius-shell) - var(--bezel-pad));

.bezel-shell { border-radius: var(--radius-shell); padding: var(--bezel-pad);
  background: var(--color-surface-low); border: 1px solid var(--color-outline); }
.bezel-core  { border-radius: var(--radius-core); background: var(--color-surface);
  border: 1px solid rgba(255,255,255,0.04);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.05); }
```

Más la variante `.bento-surface--framed` (mismo sistema aplicado sobre `.bento-surface`, shell con `rgba(var(--color-primary-rgb), 0.03–0.08)`). Regla de oro: radio interior = radio exterior − padding, sin excepciones.

## 4. Glass v2

Glass = blur + borde + **filo de luz**. En dark, `.glass-card` gana:

```css
box-shadow: inset 0 1px 0 rgba(255,255,255,0.06),
            inset 0 -1px 0 rgba(255,255,255,0.02),
            0 8px 32px -12px rgba(var(--shadow-tint-rgb), 0.5);
```

Todo panel glass del chrome (navbar, drawer, footer) y de páginas hereda este vocabulario: highlight interior superior white/6 + drop tintada. Hairline decorativa opcional: gradient horizontal `via-[rgba(var(--color-primary-rgb),0.4)]` de 1px en el borde superior de paneles héroe.

## 5. Sombras — SIEMPRE tintadas, nunca negro puro

```css
:root / .dark { --shadow-tint-rgb: 2, 6, 23; }   /* slate-950 azulado, coherente con #050508 */
.light        { --shadow-tint-rgb: 24, 32, 60; } /* navy existente */
```

Todo `rgba(0,0,0,x)` de sombras se reemplaza por `rgba(var(--shadow-tint-rgb), x)`. Sombra hover estándar de card (token nuevo `--shadow-card-hover`): `0 14px 40px -20px rgba(var(--color-primary-rgb), 0.4)`. Glows SIEMPRE vía `rgba(var(--color-primary-rgb), 0.20–0.35)` — la colisión `.shadow-glow-*` se resuelve borrando las entradas del tailwind.config (gana la versión rgba de globals.css).

## 6. Noise / grain

Un solo asset (SVG feTurbulence `fractalNoise`, baseFrequency 0.8, numOctaves 3, tile 160px, data-URI en token `--noise-url`), dos niveles:

1. **Global:** `body::after` fijo, `opacity: 0.02` dark / `0.015` light, `mix-blend-mode: overlay`, `pointer-events: none`, `z-index: 1` (contenido de secciones ya vive en z-10; verificar que quede bajo navbar/modales). Mata el banding de los radial-gradients de fondo.
2. **Por superficie:** utility única `.noise-overlay` (`::after` con inset 0, `opacity: 0.03` dark / `0.015` light, `border-radius: inherit`) SOLO para superficies E3. No se aplica a cards chicas ni sobre screenshots.

Estático, cero animación, cero requests. Nombres `.noise`, `.surface-noise` de las auditorías quedan unificados en `.noise-overlay`.

## 7. Spotlight

Patrón único: radial-gradient que sigue el cursor vía CSS vars `--mx`/`--my` seteadas con `style.setProperty` en onMouseMove (NUNCA useState — cero re-renders). Radio 240–300px, `rgba(var(--color-primary-rgb), 0.35–0.45)` fundiendo a `var(--glass-border)` al 70%. Para spotlight-border: shell `p-px` con el gradient como background. GlowCard v2 lo implementa con `useMotionTemplate`; PreviewCard lo replica.

## 8. Vocabulario de hover (jerarquía cerrada — no inventar niveles)

1. **Links/texto:** color + underline deslizante, `--dur-fast`, curva firma.
2. **Card estándar:** `hover:-translate-y-1` + border `rgba(primary, 0.4)` + `--shadow-card-hover`, `--dur-base`, `transition-[transform,box-shadow,border-color]`, `active:translate-y-0 active:scale-[0.985]`, `motion-reduce:hover:translate-y-0`.
3. **Card premium (museo):** tilt 3D `SPRING_TILT`, máx 4–6°, `transformPerspective: 800–1000`, contenido con `translateZ(28px)` (preserve-3d con profundidad real) + spotlight §7.
4. **Botones:** `active:scale-[0.97–0.98]` en TODAS las variantes (ghost incluido); icono cinético `group-hover:translate-x-1` con `--dur-base` y curva firma (Button lleva `group` en su base).
5. **CTA de dinero (button-in-button):** ícono WhatsApp en chip interior `bg-white/15 → group-hover:bg-white/25 + translate-x-0.5`, label con micro-slide, scan de `.btn-tech` intacto, verde sagrado intacto.
6. **Magnetic (máx. 1 por página):** solo CTAs de cierre, ±3–4px con `useMotionValue`+`useSpring`, desktop only, gated por `useReducedMotion`.

## 9. Staggers

Escala fija (ver tokens §1): 30ms filas densas · 60ms grillas de cards (rango legal 45–80ms) · 120ms pasos narrativos. Delay base tras el spring de un panel contenedor: 120ms. Cascadas declarativas vía `SectionReveal stagger={...}` o `staggerChildren` con los tokens — nunca delays mágicos inventados.

## 10. Tipografía

- **Display:** Syne 700/800 vía `--font-heading` (ver font_decision). Solo en `.heading-display`/`.font-heading` — nunca body.
- **Body/técnico:** Oxanium 200–800. El peso 200 SE CARGA (hoy falta): el contraste **200 vs 800 en el mismo heading** es la firma tipográfica del sitio y debe ser real, no sintetizado.
- **Tracking display:** `.heading-display` pasa a `letter-spacing: clamp(-0.035em, -0.5vw, -0.015em)` + `text-wrap: balance`. Variante `.heading-display--tight` (−0.025em) para h1/h2 ≥5xl.
- **Labels técnicos:** `editorial-label`/font-mono con tracking amplio (0.25em) para readouts, numeración editorial, telemetría.
- **Lectura larga (blog):** measure 68ch (`max-w-[42rem]`), body a `on-surface/85` (token `--color-on-surface-reading`), variant SOLO para metadatos.
- **Numeración editorial** (section-number outline) es identidad del sitio: series SIN agujeros ni duplicados, siempre secuenciales por página.

## 11. Reduced motion — regla de 3 capas

1. Nuke CSS global existente (cubre CSS animations/transitions).
2. **El nuke NO cubre Framer inline:** todo componente con Framer usa `useReducedMotion()` y degrada a fade simple u estado final (o `<MotionConfig reducedMotion="user">` por página).
3. GSAP: `gsap.matchMedia` con `prefers-reduced-motion`.
Grain/noise queda exento (estático). Toda PR que agregue motion declara su rama reduced.

## 12. Excepciones sagradas (no tocar)

Verde WhatsApp #25D366/#128C7E solo en CTAs de WhatsApp (fuente única: `lib/constants/whatsapp-ui.ts`) · IDs de los 10 data-themes y todas las CSS vars leídas por getComputedStyle (`--particle-rgb-*`) · atajos Ctrl+H/A/C/S/M/T/R/W/I/K · data-hover/data-inspector-* · tracking de conversión (WhatsAppOutboundLink, openWhatsAppWithThankYouPage, gtag de /gracias) · precios desde WEB_PLANS/APP_PLANS/formatARS · LCP strategy del hero · copy rioplatense y claims canónicos · force-static/ISR/JSON-LD · pausa cooperativa de ParticleField.

---

## Decision tipografica

**SÍ — se agrega Syne como display font en pairing con Oxanium.** Es la tarea pendiente anotada en globals.css (líneas 26-35) y cierra el gap más barato del sitio: hoy `--font-heading` es un no-op (resuelve a Oxanium), así que headings y body son la misma fuente y toda la infraestructura display existente no hace nada.

**Por qué Syne:** geometría ancha y ligeramente extraña que lee "aerospace" sin perder legibilidad — contrasta perfecto contra el cuerpo técnico condensado de Oxanium (display geométrico-ancho vs body técnico). Es un pairing con pedigree Awwwards y cumple la regla del CLAUDE.md ("SIEMPRE fuentes con personalidad: ...Syne...").

**Cómo se carga (en app/layout.tsx, paquete foundation):**

```ts
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['700', '800'],
  display: 'optional',        // igual que Oxanium — LCP-safe, cero layout shift
  adjustFontFallback: true,
});
// agregar ${syne.variable} al className del <html>
```

Y en globals.css: `--font-heading: var(--font-syne), var(--font-oxanium), <fallback actual>;`

**Decisiones de detalle:**
1. `display: 'optional'` y NO 'swap': el h1 del hero usa `.heading-display` → recibiría Syne, y es el elemento LCP. Con 'optional' no hay FOUT ni reflow; trade-off aceptado: en la primera visita con red lenta puede renderizar Oxanium y Syne aparece desde la segunda vista (cacheada). Preferible a regresionar el primer paint.
2. Solo pesos 700/800 (~2 subsets woff2): Syne es exclusivamente display. El contraste de peso extremo dentro de un heading se logra con **Oxanium 200 + Syne 800** o Syne 700/800 solo, según la pieza.
3. **Complemento obligatorio en el mismo commit:** agregar `'200'` al array de weights de Oxanium (hoy `['300','400','600','700','800']`) — sin esto, `--weight-thin`, `.text-thin` y `.heading-display` sintetizan un falso thin y la promesa 200/800 sigue rota en producción.
4. Verificación de cierre: comparar visualmente 200 vs 800 en `.heading-display` en los 10 temas × dark/light, y correr Lighthouse en la home para confirmar que LCP no regresiona (target ≥90).

---

## Riesgos globales

- ORDEN DE EJECUCIÓN: foundation es bloqueante. Los 6 paquetes de prioridad 2 consumen tokens (--ease-out, --shadow-tint-rgb, --noise-url), utilities (.noise-overlay, .bezel-shell/.bezel-core, .heading-display--tight), componentes nuevos (BrowserChrome, TiltCtaCard, lib/motion.ts, whatsapp-ui.ts) y las versiones v2 de SectionReveal/GlowCard/Button. Si corren en paralelo con foundation, referencian cosas que no existen. Foundation mergea y verifica ANTES de lanzar el resto.
- LCP DEL HERO: tres cambios lo tocan a la vez (Syne en el h1 vía --font-heading, coreografía de entrada del hero, weight 200 de Oxanium). Reglas: h1 transform-only (nunca opacity/blur inicial), fuentes display:'optional', y medir Lighthouse/LCP en la home antes y después del merge de foundation y del de home.
- PRIMITIVAS CON MUCHOS CONSUMIDORES: SectionReveal v2, GlowCard v2 y Button (group + h-14) se usan en todas las páginas. API pública debe quedar idéntica (props sin cambios breaking); smoke test visual de home, servicios, tecnologías, muestrario, contacto, sobre-mi, blog y verticales tras el merge de foundation.
- FRAMER MOTION IGNORA EL NUKE CSS DE REDUCED-MOTION: toda animación inline nueva necesita useReducedMotion() propio. /gracias ya viola esto hoy (pulso infinito) y SectionReveal actual también depende del nuke que no le aplica — ambos se corrigen, pero cada paquete debe auditar sus animaciones Framer nuevas contra la regla de 3 capas del spec.
- COLISIÓN .shadow-glow-*: al borrar las entradas del tailwind.config el render puede cambiar según qué versión estaba ganando por orden de capas. Verificar visualmente toast.tsx (shadow-glow-sm) y todo consumidor de shadow-glow/glow-lg en dark Y light tras el fix.
- NAVBAR FLOATING PILL cambia la geometría del chrome: compensar pt del main en app-shell (3.5rem mobile / 4rem desktop + padding del wrapper scrolled), verificar la barra del inspector (+2.25rem), los anchors con scroll-margin (#pricing, #calculadora, #proceso, #faq) y el sticky tab toggle mobile de /servicios.
- VERIFICACIÓN MATRICIAL DE TEMAS: los tokens nuevos (--shadow-tint-rgb, --color-on-surface-variant-rgb, --color-ink-strong, --color-on-surface-reading, --noise-url) deben definirse para dark Y light; toda superficie tocada se verifica en los 10 data-themes × dark/light. Nunca hex nuevos fuera de la excepción WhatsApp.
- FUNCIONALIDAD SAGRADA: data-hover/data-inspector-* (X-Ray Ctrl+I), atajos de teclado, tracking de conversión WhatsApp (no reemplazar WhatsAppOutboundLink/openWhatsAppWithThankYouPage por <a> planos), precios desde lib/types/services, JSON-LD (SERVICIOS_FAQ_ITEMS, FAQPage de blog/verticales), force-static/revalidate/generateStaticParams, focus traps y aria existentes. Cada paquete relee el must_not_break de su auditoría antes de codear.
- PERFORMANCE: no introducir nuevos loops rAF/Framer infinitos (el spec los prohíbe); el shimmer de ProjectCardPremium migra a CSS pausado. Vigilar que blur() solo aparezca en entradas one-shot. ParticleField y su pausa cooperativa no se tocan.
- ENTORNO WINDOWS (memoria del proyecto): reiniciar el preview server tras editar; usar Playwright MCP en vez de Claude_Preview para verificar next/image lazy. Gate de cierre por paquete: npx tsc --noEmit + npm run lint + build verde, commit directo a main (regla del repo) con commits chicos por paquete para poder revertir aislado.
