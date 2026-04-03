// ─── App Constants ───────────────────────────────────────────────────────────

export const APP_NAME = 'APEX Portfolio'
export const APP_URL  = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.theapexweb.com'
/** Logo / favicon / OG / previews: una sola imagen en `public/`. */
export const BRAND_IMAGE_SRC = '/apex-logo.png' as const

// ─── Contact ─────────────────────────────────────────────────────────────────
export const WHATSAPP_NUMBER = '5491124842720'

// ─── Owner / Admin ────────────────────────────────────────────────────────────
export const ADMIN_UUID = '37dad3e9-531c-4657-8db6-ddebbdcfa878'

// ─── Routes ──────────────────────────────────────────────────────────────────
export const ROUTES = {
  home:      '/',
  servicios: '/servicios',
  tecnologias: '/tecnologias',
  about:     '/sobre-mi',
  contact:   '/contacto',
  /** Tras abrir WhatsApp desde un CTA del sitio (misma pestaña). */
  gracias:   '/gracias',
} as const

// ─── Social / External ───────────────────────────────────────────────────────
export const PROJECTS = {
  botlode:       'https://botlode.com',
  botrive:       'https://botrive.com',
  assistify:     'https://assistify.lat',
} as const

// ─── Keyboard Shortcuts ───────────────────────────────────────────────────────
export const SHORTCUTS = [
  { key: 'H', label: 'Ir a Home',                         route: ROUTES.home,                       group: 'nav' as const },
  { key: 'H', label: 'Abrir WhatsApp (contacto)',         action: 'open-whatsapp-contact',           group: 'nav' as const, requiresShift: true },
  { key: 'A', label: 'Ir a Sobre Mí',                     route: ROUTES.about,                      group: 'nav' as const },
  { key: 'S', label: 'Ir a Servicios Web',                route: ROUTES.servicios,                  group: 'nav' as const },
  { key: 'M', label: 'Ir a Servicios Mobile',             route: `${ROUTES.servicios}?tab=mobile`,  group: 'nav' as const },
  { key: 'Y', label: 'Toggle claro / oscuro',             action: 'toggle-theme',                   group: 'action' as const },
  { key: 'R', label: 'Reset tema a Neutral',              action: 'reset-theme',                    group: 'action' as const },
  { key: 'I', label: 'Toggle modo Inspector',             action: 'toggle-inspector',               group: 'action' as const },
  { key: 'K', label: 'Mostrar atajos de teclado',         action: 'show-shortcuts',                 group: 'action' as const },
] as const

// ─── Booking (misma grilla que APEX Flutter: 9–19 h) ─────────────────────────
export const BOOKING_SLOT_HOURS = Array.from({ length: 11 }, (_, i) => 9 + i)

export function formatBookingHour(h: number): string {
  return `${String(h).padStart(2, '0')}:00`
}

/** @deprecated Usar BOOKING_SLOT_HOURS + formatBookingHour */
export const BOOKING_HOURS = BOOKING_SLOT_HOURS.map(formatBookingHour)

export const BLOCKED_WEEKDAYS = [0] // 0 = Sunday
