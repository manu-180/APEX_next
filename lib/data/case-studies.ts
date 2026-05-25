/**
 * Case studies — narrativa profunda por proyecto.
 *
 * Cada caso sigue el patrón problema → enfoque → stack → resultado para
 * convertir visitantes high-intent en consultas calificadas. Es lo que más
 * mueve la aguja en deals $300K-$2M ARS.
 *
 * Convenciones:
 * - `metrics` son HECHOS verificables (no % inventados). Si no podés probar
 *   un número, no lo pongas. Mejor "0 bugs en producción" que "+47% ventas".
 * - `quote` se enlaza al review correspondiente en `lib/data/reviews.ts`.
 * - `themeId` debe coincidir con un theme válido (color dinámico al abrir).
 */
import type { ThemeId } from '@/lib/types/theme'

export interface CaseStudy {
  slug: string
  themeId: ThemeId
  title: string
  tagline: string
  client: {
    name: string
    industry: string
    size?: string
  }
  /** "App móvil iOS + Android" / "Plataforma SaaS" / "E-commerce" / etc. */
  type: string
  /** "Septiembre 2024" – "Marzo 2025" formato libre. */
  duration: string
  url?: string
  /** Hero summary — 1-2 frases punchy para arriba del fold. */
  summary: string
  /** Problema concreto que tenía el cliente antes. 2-3 párrafos cortos. */
  problem: string
  /** Cómo lo abordamos. Decisiones técnicas explicadas. 3-4 puntos. */
  approach: {
    title: string
    body: string
  }[]
  /** Stack técnico. Detallado, sirve para SEO + AEO. */
  stack: {
    category: 'mobile' | 'web' | 'backend' | 'devops' | 'design'
    items: string[]
  }[]
  /** Resultados verificables. Hechos, no proyecciones. */
  metrics: {
    value: string
    label: string
    /** Categoria: tiempo, costo, alcance, calidad, otros */
    kind: 'time' | 'cost' | 'reach' | 'quality' | 'scale'
  }[]
  /** Feature highlights del producto entregado. */
  features: {
    title: string
    body: string
  }[]
  /** ID del review en lib/data/reviews.ts que corresponde a este caso. */
  reviewId?: number
  /** Cover image en /public — usá screenshot real. */
  coverImage?: string
  /** Lista de screenshots adicionales para galería. */
  gallery?: { src: string; alt: string }[]
  /** Tags para filtros / SEO. */
  tags: string[]
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'botlode',
    themeId: 'botlode',
    title: 'BotLode',
    tagline: 'Ecosistema de bots IA listo para vender desde el día uno',
    client: {
      name: 'BotLode',
      industry: 'SaaS · AI',
      size: 'Producto propio',
    },
    type: 'Plataforma multi-tenant + Player embebible',
    duration: '6 meses',
    url: 'https://botlode.com',
    summary:
      'Construimos una fábrica de bots con IA, panel de gestión multi-tenant y un player embebible en cualquier sitio. De idea a producto vendible sin levantar capital.',
    problem:
      'El proyecto arrancó como una idea: "quiero vender chatbots IA para PyMEs sin armar uno desde cero por cliente". El obstáculo no era técnico, era de modelo: los bots tenían que ser personalizables al instante (sin que el creador toque código), embebibles en cualquier sitio web sin fricción, y monetizables sin levantar capital. Los SaaS competidores cobraban setup de $1K+ USD y mantenimiento mensual. Había que vencer ese benchmark mientras manteniendo IA real (no scripts hardcoded) y entregando un dashboard que el dueño del bot pudiera operar sin training.',
    approach: [
      {
        title: 'Multi-tenant desde la base de datos',
        body: 'Row-Level Security en Supabase desde el día 1 para que un cliente nunca pueda ver datos de otro. Cada tenant tiene su propio set de bots, conversaciones y métricas, sin tocar código de la app.',
      },
      {
        title: 'Player como artefacto independiente',
        body: 'El widget del bot vive en una app Flutter Web separada (botlode-player), distribuida como iframe + script. Cualquier sitio HTML puede pegarlo en 2 líneas. La separación garantiza que un sitio cliente nunca rompa el estado del bot.',
      },
      {
        title: 'Personalidades pre-armadas + tuning post-deploy',
        body: '6 arquetipos (vendedor, soporte técnico, neutral, etc.) con prompts curados como punto de partida. El owner puede ajustar el system prompt sin código desde el panel. Reduce el time-to-first-bot de horas a minutos.',
      },
      {
        title: 'Conversation tracking + lead routing',
        body: 'Cada conversación queda persistida; cuando un bot detecta intención de compra, dispara email + entrada en el Command Center con tags. El dueño del bot nunca pierde un lead caliente.',
      },
    ],
    stack: [
      {
        category: 'web',
        items: ['Next.js 14 App Router', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      },
      {
        category: 'mobile',
        items: ['Flutter Web (botlode-player)', 'Riverpod'],
      },
      {
        category: 'backend',
        items: ['Supabase Postgres', 'Supabase Auth (Google OAuth)', 'Edge Functions', 'Row-Level Security'],
      },
      {
        category: 'devops',
        items: ['Vercel', 'GitHub Actions CI/CD', 'Sentry'],
      },
    ],
    metrics: [
      { value: '< 2 min', label: 'Setup de un bot nuevo', kind: 'time' },
      { value: '2 líneas', label: 'Para embeber en cualquier web', kind: 'scale' },
      { value: '6', label: 'Personalidades de bot', kind: 'scale' },
      { value: 'Cero', label: 'Inversión externa (bootstrapped)', kind: 'cost' },
    ],
    features: [
      {
        title: 'BotLode Factory',
        body: 'Creación de bots sin código con personalización de marca completa.',
      },
      {
        title: 'Cat Bot IA',
        body: '6 personalidades pre-entrenadas: vendedor, técnico, neutral, mentor, atención y conversacional.',
      },
      {
        title: 'Command Center',
        body: 'Tracking de leads, alertas por email cuando el bot detecta compra, calendario integrado.',
      },
      {
        title: 'Inversión Cero',
        body: 'Producto listo para vender desde el día uno, sin levantar capital ni equipo.',
      },
    ],
    reviewId: 5,
    tags: ['SaaS', 'IA', 'Multi-tenant', 'Producto propio', 'Flutter Web', 'Next.js', 'Supabase'],
  },

  {
    slug: 'assistify',
    themeId: 'assistify',
    title: 'Assistify',
    tagline: 'App de gestión para profesores que blinda los ingresos del mes',
    client: {
      name: 'Assistify',
      industry: 'EdTech · Apps móviles',
      size: 'Producto propio · usuarios reales en producción',
    },
    type: 'App nativa iOS + Android + dashboard web',
    duration: '8 meses',
    url: 'https://assistify.lat',
    summary:
      'Profesores particulares pierden plata cuando los alumnos cancelan tarde. Construimos una app que pasa esa pérdida a lista de espera automática.',
    problem:
      'Los profesores particulares (yoga, música, idiomas, gym) viven de la asistencia. Un alumno que cancela 2 horas antes = lugar vacío = ingreso perdido. Los profes manejaban esto con WhatsApp + Excel: caos. Y peor: cuando un alumno quería reprogramar, el profe tenía que coordinar manualmente con la lista de espera, perdiendo tiempo y a veces el slot mismo. El objetivo: que el profesor no pierda un solo turno por cancelaciones tardías, sin tener que estar pegado al teléfono.',
    approach: [
      {
        title: 'Sistema de créditos en vez de plata directa',
        body: 'El alumno paga clases en bloque (créditos) que se descuentan al asistir. Si cancela, el crédito vuelve. El profe cobró por adelantado y no negocia devoluciones.',
      },
      {
        title: 'Lista de espera con auto-fill',
        body: 'Cuando un alumno cancela dentro de la ventana de gracia, la app notifica automáticamente a la lista de espera por WhatsApp + push. El primero en confirmar toma el lugar. El profe no interviene.',
      },
      {
        title: 'Autogestión total del alumno',
        body: 'El alumno reserva, cancela, reprograma y compra créditos desde su celular. El profe sólo aparece en el dashboard cuando hay algo que aprobar.',
      },
      {
        title: 'iOS + Android desde día 1 con Flutter',
        body: 'Una sola base de código en Dart, dos apps publicadas en stores, mismo set de features. Hot reload acelera el ciclo de iteración con feedback real de profes beta.',
      },
    ],
    stack: [
      {
        category: 'mobile',
        items: ['Flutter 3.x', 'Dart', 'Riverpod 2.x', 'flutter_local_notifications'],
      },
      {
        category: 'backend',
        items: ['Supabase Postgres', 'Supabase Auth', 'Realtime subscriptions', 'Edge Functions'],
      },
      {
        category: 'devops',
        items: ['App Store + Play Store', 'GitHub Actions (build + sign)', 'Sentry mobile'],
      },
    ],
    metrics: [
      { value: 'iOS + Android', label: 'Publicada en ambas stores', kind: 'reach' },
      { value: 'Realtime', label: 'Sincronización entre profe y alumno', kind: 'quality' },
      { value: 'Auto-fill', label: 'De cupos cancelados sin intervención manual', kind: 'time' },
      { value: '0', label: 'Bugs críticos en producción al lanzar', kind: 'quality' },
    ],
    features: [
      {
        title: 'Autogestión Total',
        body: 'Alumnos autogestionan cancelaciones y reprogramaciones, sin pedir permiso.',
      },
      {
        title: 'Ingresos Blindados',
        body: 'Sistema de créditos + lista de espera auto-llena huecos al instante.',
      },
      {
        title: 'Cero Fricción',
        body: 'Notificaciones WhatsApp sin que el alumno tenga que abrir la app.',
      },
      {
        title: 'Control Operativo',
        body: 'Crear clases, ajustar cupos, gestionar alumnos y ver métricas en tiempo real.',
      },
    ],
    reviewId: 1,
    tags: ['App móvil', 'iOS', 'Android', 'Flutter', 'Riverpod', 'Supabase', 'EdTech', 'Realtime'],
  },

  {
    slug: 'contact-engine',
    themeId: 'contact-engine',
    title: 'Contact Engine',
    tagline: 'Prospección automática que convierte conversaciones en ventas',
    client: {
      name: 'Contact Engine',
      industry: 'B2B SaaS · Ventas outbound',
      size: 'Producto propio · multi-tenant',
    },
    type: 'Plataforma SaaS multi-tenant',
    duration: '4 meses',
    summary:
      'Un equipo de ventas pequeño no puede prospectar 24/7. Construimos un engine que detecta negocios, prepara contactos y combina email + WhatsApp con conversación centralizada.',
    problem:
      'Las PyMEs B2B prospectan a mano: buscan empresas en Google, copian datos a un Excel, mandan emails templated uno por uno, y olvidan el follow-up. Las herramientas existentes (Apollo, Lemlist) cuestan en USD y están pensadas para SDRs de SF — no para un equipo argentino que necesita combinar WhatsApp con email. El reto: armar un sistema que detecte negocios automáticamente, los califique, mande la outreach por el canal correcto, y centralice todas las conversaciones para que el operador humano sólo intervenga cuando hay match.',
    approach: [
      {
        title: 'Detección automática de negocios',
        body: 'El engine corre 24/7 buscando empresas según criterios definidos (rubro, ubicación, tamaño). Prepara la ficha del contacto sin intervención humana.',
      },
      {
        title: 'Email + WhatsApp combinados',
        body: 'Algunos prospects responden mejor a email, otros sólo a WhatsApp. El engine prueba ambos canales con A/B implícito y deja el winner para escalar.',
      },
      {
        title: 'Centro de comando con estado',
        body: 'Todas las conversaciones quedan en un dashboard con tags (nuevo, respondió, calificado, agendado, perdido). El operador ve sólo lo que requiere atención humana.',
      },
      {
        title: 'Multi-tenant: usalo vos o revendelo',
        body: 'La arquitectura permite separar tenants. Podés usarlo para tu propia marca o licenciarlo como servicio white-label a otra agencia.',
      },
    ],
    stack: [
      {
        category: 'web',
        items: ['Next.js', 'TypeScript', 'Tailwind CSS'],
      },
      {
        category: 'backend',
        items: ['Supabase Postgres', 'Edge Functions', 'WhatsApp Business API', 'Resend (email)'],
      },
      {
        category: 'devops',
        items: ['Vercel', 'Sentry', 'PostHog (analytics + flags)'],
      },
    ],
    metrics: [
      { value: '24/7', label: 'Operación sin intervención humana', kind: 'time' },
      { value: 'Email + WA', label: 'Canales combinados por prospect', kind: 'scale' },
      { value: 'Multi-tenant', label: 'Cada cliente con datos aislados (RLS)', kind: 'quality' },
      { value: 'Centralizado', label: 'Todas las conversaciones en un solo lugar', kind: 'scale' },
    ],
    features: [
      {
        title: 'Prospección 24/7',
        body: 'Detecta negocios y prepara contactos incluso fuera de horario.',
      },
      {
        title: 'Canal Correcto',
        body: 'Combinación Email + WhatsApp optimizada para máxima respuesta.',
      },
      {
        title: 'Operación Bajo Control',
        body: 'Dashboard con estados, volumen de envíos, conversaciones centralizadas.',
      },
      {
        title: 'Modelo Escalable',
        body: 'Multi-tenant: usalo en tu marca o revendelo como servicio.',
      },
    ],
    tags: ['SaaS', 'B2B', 'Multi-tenant', 'WhatsApp API', 'Email', 'Outbound', 'Next.js', 'Supabase'],
  },

  {
    slug: 'luma-invita',
    themeId: 'luma-invita',
    title: 'Luma Invita',
    tagline: 'Plataforma de invitaciones digitales de alta gama',
    client: {
      name: 'Luma Invita',
      industry: 'Eventos · D2C',
      size: 'Producto propio',
    },
    type: 'Plataforma web full-stack con admin + dashboard cliente',
    duration: '5 meses',
    url: 'https://www.bylumainvita.com',
    summary:
      'Construimos una plataforma para invitaciones digitales premium con URLs únicas, RSVP, 6 plantillas radicalmente distintas y animaciones de nivel senior.',
    problem:
      'Las invitaciones digitales en Argentina son un océano de templates idénticos: mismo layout, misma tipografía, mismas animaciones genéricas, sólo cambia el color. El target premium (bodas y eventos de alta gama) no encontraba opciones que estén a la altura de un wedding planner serio. Había que crear una plataforma donde cada plantilla SE SIENTA distinta (no sólo se vea), donde el dueño del evento tenga su propio dashboard, donde los invitados puedan confirmar asistencia y ver galería, y donde el preview en WhatsApp sea perfecto (OG dinámico).',
    approach: [
      {
        title: 'Seis identidades visuales completas',
        body: 'No es "el mismo template con otro color". Cada plantilla tiene tipografía, layout, paleta y motion design propios. Es como tener 6 sub-productos dentro del mismo SaaS.',
      },
      {
        title: 'Triple sistema de roles',
        body: 'Admin (el equipo de Luma) gestiona toda la operación. Dueño del evento entra con un token único a su dashboard. Invitado entra a la URL pública con RSVP. Cero confusión de permisos.',
      },
      {
        title: 'Preview perfecto en WhatsApp',
        body: 'OG image dinámica generada al vuelo con los datos del evento. Cuando el invitado comparte el link, el preview muestra nombre + fecha + foto, no el favicon del sitio.',
      },
      {
        title: 'Stack production-ready desde día 1',
        body: 'Supabase con Row-Level Security, Mapbox para ubicación, Spotify embed para playlist, formularios con Zod. Listo para escalar sin reescribir.',
      },
    ],
    stack: [
      {
        category: 'web',
        items: ['Next.js 14 App Router', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Zod'],
      },
      {
        category: 'backend',
        items: ['Supabase Postgres', 'Row-Level Security', 'Storage para galerías', 'Edge Functions'],
      },
      {
        category: 'design',
        items: ['Mapbox GL', 'Spotify embed', 'OG image dinámica (next/og)'],
      },
      {
        category: 'devops',
        items: ['Vercel', 'GitHub Actions', 'Sentry'],
      },
    ],
    metrics: [
      { value: '6', label: 'Plantillas con motion propio', kind: 'scale' },
      { value: '3', label: 'Roles con permisos aislados (admin / dueño / invitado)', kind: 'scale' },
      { value: 'Dinámico', label: 'OG image generada al vuelo por evento', kind: 'quality' },
      { value: 'WCAG AA', label: 'Cumple accesibilidad en todas las plantillas', kind: 'quality' },
    ],
    features: [
      {
        title: 'Seis identidades visuales',
        body: 'Plantillas que no son sólo otro color: tipografía, layout y motion propios por estilo.',
      },
      {
        title: 'Admin + dueño + invitado',
        body: 'Panel para vos, dashboard con token para el cliente, e invitación pública con RSVP.',
      },
      {
        title: 'Compartir que vende',
        body: 'OG dinámico, preview perfecta en WhatsApp, countdown y galería con lightbox.',
      },
      {
        title: 'Stack production-ready',
        body: 'Supabase con RLS, Mapbox, Spotify embed, formularios con Zod — listo para escalar.',
      },
    ],
    tags: ['Eventos', 'D2C', 'Next.js', 'Supabase', 'Framer Motion', 'OG dinámico', 'Mapbox', 'Multi-rol'],
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug)
}

export function getCaseStudySlugs(): string[] {
  return CASE_STUDIES.map((c) => c.slug)
}

/** Otros casos para mostrar al final de uno (sugerencias / "next"). */
export function getOtherCaseStudies(currentSlug: string, limit = 3): CaseStudy[] {
  return CASE_STUDIES.filter((c) => c.slug !== currentSlug).slice(0, limit)
}
