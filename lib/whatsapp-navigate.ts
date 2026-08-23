'use client'

import { ROUTES } from '@/lib/constants'
import { trackGoogleAdsWhatsAppClick } from '@/lib/analytics/google-ads'
import { trackMetaLead } from '@/components/analytics/meta-pixel'
import { isTrustedWhatsAppUrl } from '@/lib/whatsapp'

/** Misma ruta que usan los CTAs al abrir WhatsApp desde la web. */
export const WHATSAPP_THANK_YOU_ROUTE = ROUTES.gracias

/**
 * Cuánto esperamos para confirmar que el navegador se llevó al usuario a
 * WhatsApp. Si en ese lapso la pestaña nunca perdió foco ni visibilidad, la
 * "pestaña nueva" fue un fantasma y navegamos en la actual.
 */
const HANDOFF_CHECK_MS = 900

/** Dos disparos del mismo gesto (double-tap móvil) no son dos leads. */
const DUPLICATE_CLICK_MS = 800

let lastClickAt = 0

type AppRouterPush = { push: (href: string, options?: { scroll?: boolean }) => void }

function warn(message: string, detail?: unknown): void {
  if (detail === undefined) console.warn(`[apex:whatsapp] ${message}`)
  else console.warn(`[apex:whatsapp] ${message}`, detail)
}

/**
 * Navegación top-level en la pestaña actual: el único camino a WhatsApp que
 * ningún navegador bloquea. Es el piso de garantía de todo este módulo.
 */
function navigateThisTab(waHref: string, reason: string): void {
  warn(`abriendo WhatsApp en la pestaña actual (${reason})`)
  window.location.assign(waHref)
}

/**
 * El valor de retorno de `window.open` NO alcanza para saber si WhatsApp se
 * abrió: los WebView de Android, las Chrome Custom Tabs y los navegadores
 * in-app (Instagram, Facebook, Google App) devuelven una ventana viva que
 * nunca navega a ningún lado. Acá sólo descartamos el caso honesto (null o
 * ventana ya cerrada); la confirmación real la hace `confirmHandoff`.
 */
function isPopupHandleUsable(popup: Window | null): boolean {
  if (!popup) return false
  try {
    return popup.closed === false
  } catch (error) {
    // Leer `closed` cross-origin está permitido; si falla, algo raro pasa con
    // la ventana, pero existe. Lo dejamos anotado y seguimos con la verificación.
    warn('no se pudo leer el estado de la pestaña de WhatsApp', error)
    return true
  }
}

/**
 * Confirma el traspaso a WhatsApp mirando la señal que sí es confiable: que
 * esta pestaña pierda foco o visibilidad. Si eso ocurre, el usuario está en
 * WhatsApp y dejamos la pestaña en /gracias. Si no ocurre, la pestaña nueva
 * fue un fantasma y forzamos la navegación en la actual.
 *
 * Importante: el latch por eventos (no sólo el timer) evita el bucle en móvil
 * — cuando la app de WhatsApp pasa a primer plano el `setTimeout` se
 * estrangula, y al volver el usuario el chequeo tardío lo mandaría de nuevo
 * a WhatsApp. Con el latch, ese caso ya quedó resuelto como handoff exitoso.
 */
function confirmHandoff(waHref: string, popup: Window | null, router: AppRouterPush): void {
  const thankYouHref = `${WHATSAPP_THANK_YOU_ROUTE}?wa=${encodeURIComponent(waHref)}`
  let settled = false
  let timer = 0

  const cleanup = (): void => {
    window.clearTimeout(timer)
    window.removeEventListener('blur', onAway)
    window.removeEventListener('pagehide', onAway)
    document.removeEventListener('visibilitychange', onVisibility)
  }

  const goToThankYou = (): void => {
    if (settled) return
    settled = true
    cleanup()
    router.push(thankYouHref, { scroll: true })
  }

  function onAway(): void {
    goToThankYou()
  }

  function onVisibility(): void {
    if (document.visibilityState === 'hidden') goToThankYou()
  }

  window.addEventListener('blur', onAway)
  window.addEventListener('pagehide', onAway)
  document.addEventListener('visibilitychange', onVisibility)

  timer = window.setTimeout(() => {
    if (settled) return
    settled = true
    cleanup()

    // La señal fuerte es la visibilidad: si algo se llevó al usuario (pestaña
    // nueva o la app de WhatsApp), esta página dejó de estar visible o perdió
    // el foco. Si sigue visible Y enfocada, no se abrió nada.
    const seguimosAca = document.visibilityState === 'visible' && document.hasFocus()
    if (!seguimosAca) {
      router.push(thankYouHref, { scroll: true })
      return
    }
    navigateThisTab(waHref, 'la pestaña de WhatsApp nunca tomó el foco')
  }, HANDOFF_CHECK_MS)
}

/**
 * Abre WhatsApp y deja la pestaña actual en /gracias.
 *
 * Tracking centralizado acá (Google Ads + Meta Lead): los callers NO deben
 * volver a dispararlo o la conversión se cuenta doble.
 *
 * Garantía de entrega: si la pestaña nueva no se abre —popup bloqueado o
 * ventana fantasma de un navegador in-app— la misma pestaña navega a wa.me.
 * El camino a WhatsApp nunca depende de que `window.open` funcione.
 */
export function openWhatsAppWithThankYouPage(
  waHref: string,
  router: AppRouterPush,
): void {
  if (typeof window === 'undefined') return

  if (!isTrustedWhatsAppUrl(waHref)) {
    warn('se canceló la apertura: la URL no es de WhatsApp', waHref)
    return
  }

  // Rebote del mismo gesto (double-tap): ni doble conversión ni doble navegación.
  const now = Date.now()
  if (now - lastClickAt < DUPLICATE_CLICK_MS) return
  lastClickAt = now

  trackGoogleAdsWhatsAppClick()
  trackMetaLead()

  let popup: Window | null = null
  try {
    // Sin 'noopener' en los features: con noopener el spec obliga a devolver
    // null y perderíamos la señal temprana de bloqueo. Tampoco anulamos
    // `popup.opener` — wa.me es dominio de Meta y necesitamos conservar el
    // handle para detectar la pestaña fantasma.
    popup = window.open(waHref, '_blank')
  } catch (error) {
    warn('window.open lanzó una excepción', error)
    popup = null
  }

  if (!isPopupHandleUsable(popup)) {
    navigateThisTab(waHref, 'popup bloqueado')
    return
  }

  confirmHandoff(waHref, popup, router)
}
