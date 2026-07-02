/**
 * Verde oficial WhatsApp — ÚNICA excepción de hex de marca del sitio
 * (APEX Design Language v2 §12 / DESIGN_BRIEF §2).
 *
 * Fuente única de la identidad visual de los CTAs de dinero: NO redefinir
 * estos valores en componentes. Complementos CSS: `.btn-wa` y
 * `.wa-float-pill` en globals.css.
 *
 * Nota: el teal de sombra `rgba(18,140,126,…)` (WA teal #128C7E en rgb)
 * forma parte de la misma excepción documentada.
 */

/** Hex oficial del verde WhatsApp (para focus rings puntuales). */
export const WA_GREEN = '#25D366'

/** Hex oficial del teal WhatsApp (extremo oscuro del gradiente). */
export const WA_TEAL = '#128C7E'

/** Gradiente sólido del CTA de dinero (idéntico a `.btn-wa`). */
export const WA_GRADIENT = 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)'

/**
 * Sombra estándar del CTA WhatsApp (clases Tailwind):
 * apoyo navy + teal profundo en light, glow verde en dark.
 */
export const WA_SHADOW_CLASS =
  'shadow-[0_2px_5px_rgba(24,32,60,0.08),0_10px_26px_-10px_rgba(18,140,126,0.42)] dark:shadow-[0_10px_28px_-10px_rgba(37,211,102,0.45)]'

/** Variante para CTAs grandes o de cierre (footer, final CTA). */
export const WA_SHADOW_CLASS_LG =
  'shadow-[0_3px_7px_rgba(24,32,60,0.09),0_14px_32px_-10px_rgba(18,140,126,0.50)] dark:shadow-[0_12px_32px_-10px_rgba(37,211,102,0.55)]'
