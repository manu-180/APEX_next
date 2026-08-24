/**
 * Constantes compartidas entre content.tsx (chunk inicial), booking-calendar.tsx
 * y reviews-section.tsx (chunks dinámicos, ver content.tsx). Viven en un módulo
 * aparte — sin 'use client' porque son solo strings, sin hooks/JSX — para que
 * ninguno de los dos chunks dinámicos tenga que importar del otro ni de
 * content.tsx (eso arrastraría todo lo demás del chunk inicial al dinámico).
 */

/** Mensaje prellenado contextual de /contacto (decisión: arrancar ahora).
 *  Usado en el CTA primario (WhatsAppNowPanel) y en el estado vacío de reviews. */
export const WA_MSG_CONTACT_NOW =
  'Hola Manuel, tengo un proyecto y quiero arrancar. ¿Lo charlamos?'

/** Anillo de foco estándar — compartido por CTAs y controles en los 3 archivos. */
export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]'
