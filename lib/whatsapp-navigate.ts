'use client'

import { ROUTES } from '@/lib/constants'

/** Misma ruta que usan los CTAs al abrir WhatsApp desde la web. */
export const WHATSAPP_THANK_YOU_ROUTE = ROUTES.gracias

const SKIP_GRACIAS_AUTO_WA_KEY = 'apex-skip-gracias-wa-auto'

type AppRouterPush = { push: (href: string, options?: { scroll?: boolean }) => void }

/**
 * True si el CTA ya abrió wa.me en otra pestaña; limpia la marca al leer.
 * Evita abrir WhatsApp dos veces (clic + cuenta regresiva en /gracias).
 */
export function consumeSkipGraciasWhatsAppAutoOpen(): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (sessionStorage.getItem(SKIP_GRACIAS_AUTO_WA_KEY) !== '1') return false
    sessionStorage.removeItem(SKIP_GRACIAS_AUTO_WA_KEY)
    return true
  } catch {
    return false
  }
}

/**
 * Abre wa.me en una pestaña nueva y lleva la actual a /gracias (confirmación).
 * Nunca reemplaza la pestaña del sitio por WhatsApp.
 */
export function openWhatsAppWithThankYouPage(
  waHref: string,
  router: AppRouterPush,
): void {
  if (typeof window !== 'undefined') {
    const win = window.open(waHref, '_blank', 'noopener,noreferrer')
    if (win) {
      try {
        sessionStorage.setItem(SKIP_GRACIAS_AUTO_WA_KEY, '1')
      } catch {
        /* ignore quota / private mode */
      }
    }
  }
  const target = `${WHATSAPP_THANK_YOU_ROUTE}?wa=${encodeURIComponent(waHref)}`
  router.push(target, { scroll: true })
}
