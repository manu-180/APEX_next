'use client'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const GOOGLE_ADS_ACCOUNT_ID = 'AW-18041789644'

// Labels de conversión de Google Ads.
// Dónde encontrarlos: Google Ads → Conversiones → [conversión] → Tag setup → campo "send_to"
// El label es la parte después de la barra: AW-18041789644/ESTE_ES_EL_LABEL
// Mientras estén vacíos (''), las conversiones no se disparan.
const GOOGLE_ADS_WHATSAPP_LABEL = 'o7p6CL2CwaccEMy5_5pD'
const GOOGLE_ADS_HERO_CTA_LABEL = 'UoGWCML-wKccEMy5_5pD'

function isPlaceholder(label: string): boolean {
  return label === '' || label.startsWith('TODO_')
}

/**
 * Dispara una conversión de Google Ads.
 *
 * Los casos en los que NO se registra quedan en consola a propósito: una
 * conversión perdida en silencio es plata de campaña que se gasta sin dejar
 * rastro, y es exactamente el tipo de fallo que no se descubre hasta el
 * cierre de mes.
 */
function trackGoogleAdsConversion(label: string, name: string): void {
  if (typeof window === 'undefined') return

  if (isPlaceholder(label)) {
    console.warn(`[apex:ads] la conversión "${name}" no tiene label configurado: no se registra.`)
    return
  }

  if (typeof window.gtag !== 'function') {
    console.warn(
      `[apex:ads] gtag no está disponible todavía: se pierde la conversión "${name}". ` +
        'Revisá NEXT_PUBLIC_GA_MEASUREMENT_ID y que GoogleAnalyticsRoot esté montado.',
    )
    return
  }

  window.gtag('event', 'conversion', {
    send_to: `${GOOGLE_ADS_ACCOUNT_ID}/${label}`,
  })
}

export const trackGoogleAdsWhatsAppClick = () => {
  trackGoogleAdsConversion(GOOGLE_ADS_WHATSAPP_LABEL, 'WhatsApp Click')
}

export const trackGoogleAdsHeroCtaClick = () => {
  trackGoogleAdsConversion(GOOGLE_ADS_HERO_CTA_LABEL, 'Hero CTA')
}

// Reserva confirmada — crear la conversion action en Google Ads (cuenta 4869983637) y pegar el label del send_to
const GOOGLE_ADS_BOOKING_LABEL = ''

export const trackGoogleAdsBookingConfirmed = () => {
  trackGoogleAdsConversion(GOOGLE_ADS_BOOKING_LABEL, 'Booking Confirmed')
}
