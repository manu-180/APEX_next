# ABOUT_TECH_NOTES — /sobre-mi y /tecnologias (cierre)

> Agente finalizador de Sobre-mí/Tecnologías. Complementa `AUDIT_ADDENDUM.md` (ley),
> `DESIGN_BRIEF.md` §3 y `FOUNDATION_NOTES.md`. Estado: checklist del addendum COMPLETA.

## Archivos tocados (ownership exclusivo)

- `app/sobre-mi/page.tsx` — chequeo estático de `public/manuel.jpg` (metadata SEO intacta)
- `app/sobre-mi/content.tsx` — fixes del addendum sobre la base del agente anterior
- `app/tecnologias/content.tsx` — fixes de copy + CTA verde
- `app/tecnologias/tech-cards-section.tsx` — callout del theme-switcher más visible

## /sobre-mi — qué quedó

1. **Hero asimétrico** (ya venía del agente anterior, preservado): grid `1.15fr/0.85fr`,
   narrativa + ficha técnica con `section-number` "01" rompiendo el eje.
2. **Slot de foto real**: `page.tsx` hace `existsSync(public/manuel.jpg)` en server/build y
   pasa `hasFounderPhoto` al cliente. `FounderAvatar` (en `content.tsx`) renderiza `next/image`
   (`fill`, `sizes="80px"`, 80px rounded-2xl) con las iniciales "MN" SIEMPRE debajo +
   `onError` como segunda red. Sin foto → avatar elegante, cero broken image, build nunca rompe.
   **TODO Manuel: subir `public/manuel.jpg` (cuadrada, ~640px).** La foto aparece sola al
   siguiente build/deploy (en dev, al recargar).
3. **CTA WhatsApp**: ahora hay uno **en el primer viewport** (hero, bajo el intro) y otro en el
   CTA final — ambos **sólidos verde WhatsApp** (`#25D366→#128C7E`, patrón /gracias) via
   `WA_BTN_CLASS`/`WA_BTN_STYLE` locales al archivo. Siempre `WhatsAppOutboundLink` +
   `whatsappUrl()` — cero tracking manual. Mensaje contextual personal (`WA_MSG_SOBRE_MI`).
   Secundario en CTA final: link ghost "Agendá 15 minutos, gratis" → `ROUTES.contact`.
4. **Copy oro restaurado** (la versión intermedia lo había perdido):
   - Manifesto "¿Pagaste cientos de dólares por un sitio que no vende?… Por eso existe APEX."
     → lead-in de la sección 02, con remate en color primario.
   - "Si hay un bug a las 11 de la noche, lo arreglo yo." → beneficio 03 ("Hablás con quien construye").
   - Pills `PRINCIPIOS` al pie de la sección 02: "Tu código. Tuyo. Para siempre." + fecha pactada
     + WhatsApp directo + "Primero el problema. Luego el código."
   - Escasez "Trabajo con 1-2 clientes a la vez" (CTA final) + ficha "1-2 proyectos por vez".
5. **Números canónicos**: se eliminó `150+ proyectos` (prohibido) → `8+ productos y sitios en
   producción`. Ficha: fila "Garantía …o devolución" (claim inventado) → "Entrega: Fecha
   pactada = fecha entregada". Claims `<1 h` y "15 minutos, gratis" presentes.

## /tecnologias — qué quedó

1. Headline: `es una decisión.` / `No un capricho.` (mayúscula tras punto — fix del addendum).
2. Stat canónico exacto: `8+ productos y sitios en producción`.
3. **Callout theme-switcher** (LA feature): pill más grande (`px-5 py-3.5 / sm:px-6 sm:py-4`),
   copy a `text-base/lg`: "**Tocá una card** — el sitio entero cambia de tema. En vivo, sin
   recargar." con "Tocá una card" extrabold + `glow-text` en primario. Dot pulsante preservado.
4. CTA final: botón WhatsApp pasó de `btn-primary-tech` a **sólido verde** (mismo patrón);
   "Ver planes y precios" queda outline del tema (jerarquía addendum). Microcopy "<1 hora"
   agregado. `data-inspector-desc` actualizado para no mentir sobre los estilos.
5. Glassmorphism/glow de las cards y copy de beneficio de negocio: intactos (ya estaban bien).

## Decisiones / gotchas

- **Verde WhatsApp**: NO existe utilidad CSS global (`globals.css` no tiene clase wa); cada
  página replica el patrón inline de /gracias (hex permitido como única excepción). Si el
  orquestador quiere, puede extraerse a `.btn-wa` en globals.css en la pasada transversal —
  hoy hay 3 copias (gracias, sobre-mi ×2 via const, tecnologias).
- `FounderAvatar`: el fallback "MN" queda montado debajo de la foto a propósito (sin estado de
  "loading") — si la imagen tarda o falla post-build, nunca hay hueco.
- Reduced motion: sin animaciones nuevas; todo lo agregado es estático dentro de `Reveal`/
  `SectionReveal` existentes (que ya usan `useReducedMotion()`).
- 7 temas: todo lo nuevo usa vars (`--color-primary(-rgb)`, superficies, `--color-online`);
  únicos hex: los verdes WhatsApp permitidos.

## Verificación

- `npx tsc --noEmit`: **0 errores en `app/sobre-mi/**` y `app/tecnologias/**`**.
  ÚNICO error del programa: `app/servicios/content.tsx(294)` — prop `deriskers` vs
  `deliveryInfo`, archivo del agente de /servicios EN VUELO (se modificó durante esta sesión).
  No se tocó por ownership. El orquestador debe re-correr `tsc` cuando ese agente cierre.
