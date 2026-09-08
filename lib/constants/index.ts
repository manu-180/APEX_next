// ─── App Constants ───────────────────────────────────────────────────────────

export const APP_URL  = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.theapexweb.com'
/** Logo / favicon / OG / previews: una sola imagen en `public/`. */
export const BRAND_IMAGE_SRC = '/apex-logo.png' as const

// ─── Contact ─────────────────────────────────────────────────────────────────
export const WHATSAPP_NUMBER = '5491156327091'
/** Formato E.164 para schema/SEO/clic-to-call (`tel:`). */
export const WHATSAPP_PHONE_DISPLAY = '+54 9 11 5632 7091'

// ─── Owner / Admin ────────────────────────────────────────────────────────────
export const ADMIN_UUID = '37dad3e9-531c-4657-8db6-ddebbdcfa878'

// ─── Trayectoria ─────────────────────────────────────────────────────────────
export const YEARS_EXP = new Date().getFullYear() - 2021

// ─── Routes ──────────────────────────────────────────────────────────────────
export const ROUTES = {
  home:        '/',
  servicios:   '/servicios',
  /** Landing de la intención "precio" — destino del ad group Presupuesto y Precios. */
  cuantoCuesta: '/cuanto-cuesta-una-pagina-web',
  /** Landing de la intención "agencia/diseño" — ad group Web - Diseño y Desarrollo. */
  disenoWeb:   '/diseno-de-paginas-web',
  /**
   * Landings por PRODUCTO. Salieron de los términos de búsqueda reales de la
   * campaña (junio-septiembre 2026): "tienda online" + "ecommerce" +
   * "comercio electrónico" sumaban 134 impresiones y "landing page" 235, todas
   * cayendo en `/servicios`, que responde a las dos con la misma página.
   */
  tiendaOnline: '/tienda-online',
  landingPage:  '/landing-page',
  muestrario:  '/muestrario',
  blog:        '/blog',
  opiniones:   '/opiniones',
  lab:         '/lab',
  tecnologias: '/tecnologias',
  about:       '/sobre-mi',
  contact:     '/contacto',
  /** Tras abrir WhatsApp desde un CTA del sitio (misma pestaña). */
  gracias:     '/gracias',
} as const

// ─── Social / External ───────────────────────────────────────────────────────
export const PROJECTS = {
  handy:         'https://handy.theapexweb.com/',
  byluma:        'https://www.bylumainvita.com/',
  assistify:     'https://assistify.lat',
} as const

/**
 * Perfil de Negocio de Google (verificado 2026-09-07: resuelve al perfil de
 * APEX en Maps). Va en el `sameAs` del schema: es el perfil que más pesa para
 * unir la entidad en búsquedas locales.
 */
export const GOOGLE_BUSINESS_PROFILE_URL = 'https://g.page/r/Cf6x-buXP4ugEBM' as const
/** Link directo al diálogo de reseña del mismo perfil. Compartible. */
export const GOOGLE_REVIEW_URL = `${GOOGLE_BUSINESS_PROFILE_URL}/review` as const

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

export const BLOCKED_WEEKDAYS = [0] // 0 = Sunday
