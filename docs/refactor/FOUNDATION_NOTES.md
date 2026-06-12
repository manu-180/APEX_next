# FOUNDATION NOTES — Refactor premium APEX

> Escrito por el agente de fundación visual. Los agentes de páginas leen esto ANTES de tocar secciones.
> Contrato general: `docs/DESIGN_BRIEF.md`. Reglas duras: `CLAUDE.md`.

---

## 1. Utilidades CSS nuevas (`app/globals.css`, sección "PREMIUM EDITORIAL UTILITIES")

Todas usan SOLO vars del tema (`--color-primary`, `--color-primary-rgb`, superficies).
Se ven bien con los 7 temas y en dark + light. Están como CSS plano (fuera de `@layer`),
igual que `.btn-tech`, así que siempre compilan — no dependen del content-scan de Tailwind.

### `.editorial-label` (+ modificador `.editorial-label--primary`)

Eyebrow editorial: uppercase, tracking 0.22em, con línea de acento del tema a la izquierda (gradiente primario → fade).

- Base: texto en `--color-on-surface-variant`.
- `--primary`: texto en color primario del tema.

```tsx
<p className="editorial-label mb-6">Proceso</p>
<p className="editorial-label editorial-label--primary mb-6">Contacto directo</p>
```

### `.section-number`

Número de sección gigante outline (01 / 02 / 03). Fill transparente + `-webkit-text-stroke`
con el primario del tema. `user-select: none` y `pointer-events: none` incluidos.
**Siempre `aria-hidden="true"`** (es decorativo).

- Tamaño default: `clamp(4.5rem, 12vw, 9rem)` — override con `fontSize` inline o text-* arbitrario.
- Intensidad del stroke configurable vía custom property `--sn-stroke-alpha` (default `0.22`).
- Sirve también como watermark de marca (ver footer: "APEX" con alpha `0.07`).

```tsx
<span aria-hidden="true" className="section-number">01</span>

{/* watermark sutil */}
<div
  aria-hidden="true"
  className="section-number absolute -bottom-8 right-0"
  style={{ '--sn-stroke-alpha': '0.07', fontSize: 'clamp(9rem, 16vw, 14rem)' } as CSSProperties}
>
  APEX
</div>
```

### `.bento-surface`

Superficie para celdas de bento grid: fondo `--color-surface-low` con tinte sutil del primario
(gradiente 165°), borde `--glass-border`, radius `--radius-xl` (16px) integrado,
hover = borde primario 0.35 + glow del tema. Transición solo de border/shadow
(si querés lift, combiná con `.hover-lift` existente).

```tsx
<article className="bento-surface p-6">…</article>
<article className="bento-surface hover-lift p-8 lg:col-span-2">…</article>
```

Nota: el radius viene de la clase — no usar `rounded-*` encima (la clase gana por orden de cascada).

### `.divider-theme`

Divisor horizontal 1px con gradiente del tema (transparente → primario 0.3 → transparente).
Funciona en `<div>` y `<hr>` (resetea `border: 0`).

```tsx
<div className="divider-theme my-16" aria-hidden="true" />
```

### `.heading-display`

Heading con contraste extremo de peso de Oxanium: base **200 (thin)**, y `<strong>`/`<b>`
anidados en **800 (extrabold)**. Solo define tipografía (familia, pesos, leading 1.15,
tracking -0.01em) — **el color y el tamaño se componen con Tailwind**, así cada sección
decide su jerarquía cromática.

```tsx
<h2 className="heading-display text-4xl sm:text-5xl">
  <span className="block text-[var(--color-on-surface-variant)]">Tenés la idea.</span>
  <strong className="block text-[var(--color-on-surface)]">Yo la construyo.</strong>
</h2>
```

### Ya existían (reusar, no duplicar)

`glass`, `glass-card`, `glow-border(-active)`, `shadow-glow(-sm/-lg)`, `glow-text`,
`text-gradient-primary`, `cyber-border-t/b`, `btn-tech` + `btn-primary-tech` / `btn-outline-tech`,
`cta-tech-card` + órbitas/beams/corners, `hover-lift`, `stat-card-shine`,
`bg-primary-8/12/20`, `text-thin` / `text-xbold`, `footer-heading` / `footer-link`, `kbd-key`.

---

## 2. Navbar (`components/layout/navbar.tsx`)

- **Glass real**: el fondo pasó de `--color-surface-low` sólido a `var(--nav-bg)`
  (var ya existente, 80% alpha dark / 88% light) + `backdrop-filter: blur(16px) saturate(140%)`.
  El borde inferior `--glass-border` se mantiene.
- **CTA "Hablemos"**: subió de jerarquía — de `btn-outline-tech` a `btn-primary-tech`
  + `WhatsAppIcon` (de `components/ui/icons`, hereda `currentColor`). Ahora matchea el CTA
  del mobile drawer (que ya era primary).
- **Sin cambios funcionales**: underline animado de ruta activa, toggle dark/light,
  inspector (Ctrl+I), atajos (Ctrl+K), presence badge (`onlineCount` opcional),
  mobile drawer — interfaces y props intactas.

## 3. Footer (`components/layout/footer.tsx`)

Editorial, asimétrico (`2fr 1fr 1fr`), sin columnas grises. Sigue siendo Server Component.

- **CTA WhatsApp prominente**: `editorial-label--primary` ("Contacto directo") +
  `heading-display` thin/extrabold + sub con claim real ("te respondo en menos de 1 hora") +
  botón `btn-primary-tech` con mensaje prellenado (`WA_MSG_FOOTER_LINK`).
- **Contacto visible**: `WHATSAPP_PHONE_DISPLAY` (`+54 9 11 6804 9457`, de `lib/constants`)
  como link WhatsApp con ícono en verde oficial `#25D366` (única excepción de hex del brief).
- **Links secundarios discretos**: columnas "Servicios" y "Explorar" con `footer-link`
  (el link "WhatsApp" duplicado se quitó — el canal ya domina la columna izquierda).
- **Detalle de marca**: logo + APEX + tagline ("Web y apps a medida — Buenos Aires") + año
  + watermark "APEX" outline gigante (`.section-number`, alpha 0.07, solo `lg:`).
- Separadores ad-hoc reemplazados por `.divider-theme`.

## 4. Reglas para los agentes de páginas (recordatorio corto)

1. **WhatsApp**: SIEMPRE `whatsappUrl()` de `@/lib/whatsapp` + `WhatsAppOutboundLink` de
   `@/components/whatsapp/whatsapp-outbound-link`. El tracking vive centralizado en
   `openWhatsAppWithThankYouPage` — **jamás** agregar `trackGoogleAdsWhatsAppClick` /
   `trackMetaLead` manuales en callers (se cuenta doble).
2. **Color**: nada de hex de marca hardcodeado — solo vars del tema. Excepción única:
   `#25D366` en elementos WhatsApp.
3. **Motion**: `useReducedMotion()` de framer-motion en todo lo nuevo. El CSS global ya
   anula animaciones/transiciones con `prefers-reduced-motion: reduce`, pero los
   `initial={{ opacity: 0 }}` de Framer necesitan el hook.
4. **Probar los 7 temas** (Ctrl+R resetea a neutral) y dark + light (Ctrl+Y) en cada sección nueva.
5. Tipografía: `heading-display` (o `font-heading` + `text-thin`/`text-xbold`) para títulos.
   No agregar fuentes nuevas.
