// ─── App Constants ───────────────────────────────────────────────────────────

export const APP_NAME = 'APEX Portfolio'
export const APP_URL  = process.env.NEXT_PUBLIC_APP_URL ?? 'https://apexportfolio.com'

// ─── Contact ─────────────────────────────────────────────────────────────────
export const WHATSAPP_NUMBER  = '5491134272488'
export const WHATSAPP_DEFAULT = `https://wa.me/${WHATSAPP_NUMBER}`
export const WHATSAPP_KEYBOARD_MSG = encodeURIComponent('Hola, vengo desde los atajos de teclado 🚀')

// ─── Owner / Admin ────────────────────────────────────────────────────────────
export const ADMIN_UUID = '37dad3e9-531c-4657-8db6-ddebbdcfa878'

// ─── Routes ──────────────────────────────────────────────────────────────────
export const ROUTES = {
  home:      '/',
  servicios: '/servicios',
  about:     '/sobre-mi',
  contact:   '/contacto',
} as const

// ─── Social / External ───────────────────────────────────────────────────────
export const PROJECTS = {
  botlode:       'https://botlode.com',
  botrive:       'https://botrive.com',
  assistify:     'https://assistify.lat',
} as const

// ─── Keyboard Shortcuts ───────────────────────────────────────────────────────
export const SHORTCUTS = [
  { key: 'H', label: 'Ir a Home',                         route: ROUTES.home },
  { key: 'A', label: 'Ir a Sobre Mí',                     route: ROUTES.about },
  { key: 'C', label: 'Ir a Contacto',                     route: ROUTES.contact },
  { key: 'S', label: 'Ir a Servicios Web',                route: ROUTES.servicios },
  { key: 'M', label: 'Ir a Servicios Mobile',             route: `${ROUTES.servicios}?tab=mobile` },
  { key: 'T', label: 'Toggle claro / oscuro',             action: 'toggle-theme' },
  { key: 'R', label: 'Reset tema a Neutral',              action: 'reset-theme' },
  { key: 'W', label: 'Abrir WhatsApp',                    action: 'open-whatsapp' },
  { key: 'I', label: 'Toggle modo Inspector',             action: 'toggle-inspector' },
  { key: 'K', label: 'Mostrar atajos de teclado',         action: 'show-shortcuts' },
] as const

// ─── Booking ──────────────────────────────────────────────────────────────────
export const BOOKING_HOURS = [
  '08:00', '09:00', '10:00', '11:00',
  '14:00', '15:00', '16:00', '17:00',
]
export const BLOCKED_WEEKDAYS = [0] // 0 = Sunday
