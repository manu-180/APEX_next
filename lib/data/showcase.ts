/**
 * Showcase "Prueba real" — sitios reales en vivo, agrupados por nivel de inversión.
 *
 * Objetivo: cuando hablamos de precio (300k / 600k / 900k), el cliente no ve una
 * promesa sino sitios funcionando HOY que puede abrir y tocar. Es la prueba más
 * fuerte que tenemos para cerrar deals web.
 *
 * Reglas:
 * - El precio NO se hardcodea: cada tier referencia un `planId` de WEB_PLANS y el
 *   componente lo formatea con `formatARS`. Si el precio cambia en services.ts,
 *   esta sección se actualiza sola.
 * - `blurb` y `note` están REESCRITOS con criterio UX (no son las notas crudas).
 * - `image` apunta a /public/projects/showcase/<slug>.webp. Si el archivo falta o
 *   falla la carga, la card degrada a un frame con marca + dominio (ver componente).
 * - `domain` es lo que se muestra en la barra del browser (sin protocolo ni www).
 */
import type { ThemeId } from '@/lib/types/theme'

export type ShowcaseKind = 'product' | 'client'

export interface ShowcaseSite {
  slug: string
  name: string
  /** URL real a abrir (tal cual, con www si corresponde). */
  url: string
  /** Dominio limpio para la barra del browser frame. */
  domain: string
  /** Una línea: qué es / qué hace. Reescrita, no la nota cruda. */
  blurb: string
  /** Hasta 3 capacidades concretas (chips). */
  highlights: string[]
  /** Producto propio de APEX vs sitio de cliente real. */
  kind: ShowcaseKind
  /** Override del screenshot. Por defecto se deriva: /projects/showcase/<slug>.webp */
  image?: string
  /** Tema de marca para el fallback (acento + icono) cuando no hay screenshot. */
  themeId?: ThemeId
}

export interface ShowcaseTier {
  /** id del plan en WEB_PLANS — de acá sale el precio (nunca hardcodeado). */
  planId: string
  /** Numeral romano del nivel. */
  numeral: string
  /** Nombre corto del nivel. */
  label: string
  /** Qué define a este nivel, en una frase. */
  essence: string
  /** Nota opcional para educar al cliente (preempta una objeción). */
  note?: string
  sites: ShowcaseSite[]
}

const SHOT = (slug: string) => `/projects/showcase/${slug}.webp`

export const SHOWCASE_TIERS: ShowcaseTier[] = [
  {
    planId: 'web_basic',
    numeral: 'I',
    label: 'Sitio Web',
    essence:
      'Tu carta de presentación que vende sola: diseño a medida, carga instantánea y todo el foco puesto en que te escriban.',
    note: '¿Ves planes y precios en alguno de estos? Sigue siendo este nivel: la compra se cierra por WhatsApp, no con un checkout dentro del sitio.',
    sites: [
      {
        slug: 'handy',
        name: 'Handy',
        url: 'https://handy.theapexweb.com/',
        domain: 'handy.theapexweb.com',
        blurb: 'Sitio de servicios con identidad fuerte y cada sección empujando a la consulta.',
        highlights: ['Diseño a medida', 'SEO técnico', 'CTA directo'],
        kind: 'product',
      },
      {
        slug: 'luma-invita',
        name: 'Luma Invita',
        url: 'https://www.bylumainvita.com/',
        domain: 'bylumainvita.com',
        blurb: 'Invitaciones digitales de alta gama: 6 estilos con motion propio, RSVP y preview perfecta al compartir.',
        highlights: ['6 plantillas', 'RSVP', 'OG dinámico'],
        kind: 'product',
        themeId: 'luma-invita',
      },
      {
        slug: 'assistify',
        name: 'Assistify',
        url: 'https://assistify.lat/',
        domain: 'assistify.lat',
        blurb: 'App de gestión para profes con planes y reservas, donde el contacto cierra por WhatsApp.',
        highlights: ['Muestra planes', 'Reservas', 'Cierra por WhatsApp'],
        kind: 'product',
        themeId: 'assistify',
      },
    ],
  },
  {
    planId: 'web_interactive',
    numeral: 'II',
    label: 'Web Interactiva',
    essence:
      'El sitio deja de ser folleto y empieza a trabajar: lógica propia, paneles internos y experiencias que reaccionan al usuario.',
    sites: [
      {
        slug: 'taller-marcelo',
        name: 'Taller Marcelo',
        url: 'https://www.tallermarcelo.com/',
        domain: 'tallermarcelo.com',
        blurb: 'Sitio con panel interno que arma presupuestos y los descarga como un PDF con diseño premium.',
        highlights: ['Panel admin', 'Presupuestos', 'PDF a medida'],
        kind: 'client',
      },
      {
        slug: 'botlode',
        name: 'BotLode',
        url: 'https://www.botlode.com',
        domain: 'botlode.com',
        blurb: 'Web inmersiva con un chatbot de IA que cambia de emoción según la charla: vendedor, técnico, y más.',
        highlights: ['Chatbot IA', '5 estados de ánimo', 'Experiencia inmersiva'],
        kind: 'product',
        themeId: 'botlode',
      },
    ],
  },
  {
    planId: 'web_premium',
    numeral: 'III',
    label: 'Tienda Online',
    essence:
      'La compra pasa dentro del sitio: catálogo, pasarela de pagos y envíos. Tu plataforma cobra sola, sin comisiones de intermediarios.',
    sites: [
      {
        slug: 'moda',
        name: 'Moda',
        url: 'https://moda.theapexweb.com/',
        domain: 'moda.theapexweb.com',
        blurb: 'Tienda online completa con catálogo, checkout, pasarela de pagos y cálculo de envíos.',
        highlights: ['Checkout propio', 'Pasarela de pago', 'Envíos'],
        kind: 'product',
      },
      {
        slug: 'poncho-spanish',
        name: 'Poncho Spanish',
        url: 'https://www.ponchospanish.com/',
        domain: 'ponchospanish.com',
        blurb: 'Plataforma de cursos: los alumnos compran y acceden a su contenido, con pagos vía PayPal.',
        highlights: ['Venta de cursos', 'PayPal', 'Área de alumno'],
        kind: 'client',
      },
    ],
  },
]

/** Helper: dominio limpio desde una URL (por si se quiere derivar en runtime). */
export function cleanDomain(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
}

export { SHOT as showcaseShot }
