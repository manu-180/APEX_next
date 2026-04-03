'use client'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const GOOGLE_ADS_ACCOUNT_ID = 'AW-18041789644'

// TODO: Reemplazar con el label real de la conversión "WhatsApp Click" en Google Ads.
const GOOGLE_ADS_WHATSAPP_LABEL = 'TODO_WHATSAPP_LABEL'
// TODO: Reemplazar con el label real de la conversión "CTA Hero Click" en Google Ads.
const GOOGLE_ADS_HERO_CTA_LABEL = 'TODO_HERO_CTA_LABEL'
// TODO: Reemplazar con el label real de la conversión "Scroll 50%" en Google Ads.
const GOOGLE_ADS_SCROLL_50_LABEL = 'TODO_SCROLL_50_LABEL'

function isPlaceholder(label: string): boolean {
  return label.startsWith('TODO_')
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
