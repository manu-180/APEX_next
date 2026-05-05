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
const GOOGLE_ADS_SCROLL_50_LABEL = 'yP-_CKrq16ccEMy5_5pD'

function isPlaceholder(label: string): boolean {
  return label === '' || label.startsWith('TODO_')
}

function trackGoogleAdsConversion(label: string) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return
  if (isPlaceholder(label)) return

  window.gtag('event', 'conversion', {
    send_to: `${GOOGLE_ADS_ACCOUNT_ID}/${label}`,
  })
}

export const trackGoogleAdsWhatsAppClick = () => {
  trackGoogleAdsConversion(GOOGLE_ADS_WHATSAPP_LABEL)
}

export const trackGoogleAdsHeroCtaClick = () => {
  trackGoogleAdsConversion(GOOGLE_ADS_HERO_CTA_LABEL)
}

export const trackGoogleAdsScroll50 = () => {
  trackGoogleAdsConversion(GOOGLE_ADS_SCROLL_50_LABEL)
}
