import { SHOWCASE_TIERS, type ShowcaseSite } from '@/lib/data/showcase'

export const PAGE_PATH = '/diseno-de-paginas-web'

export interface WorkItem extends ShowcaseSite {
  /** Qué prueba este trabajo en el contexto "diseño y desarrollo", no el precio. */
  proof: string
}

const ALL_SITES = SHOWCASE_TIERS.flatMap((t) => t.sites)

function site(slug: string, proof: string): WorkItem {
  const found = ALL_SITES.find((s) => s.slug === slug)
  if (!found) throw new Error(`showcase site inexistente: ${slug}`)
  return { ...found, proof }
}

/**
 * Orden pensado para la intención "agencia": primero el trabajo con más
 * complejidad visible (panel propio), no el más barato. El precio no ordena
 * esta página — de eso habla /cuanto-cuesta-una-pagina-web.
 */
export const WORK: WorkItem[] = [
  site('taller-marcelo', 'Sitio de empresa con panel propio: arman presupuestos adentro y los bajan en PDF.'),
  site('apostillas', 'Servicio profesional explicado en 4 pasos, con la consulta cerrando por WhatsApp.'),
  site('luma-invita', 'Seis estilos de diseño distintos, cada uno con su propio motion.'),
  site('moda', 'Tienda completa: catálogo, checkout, pagos y envíos dentro del sitio.'),
  site('handy', 'Sitio de servicios con identidad fuerte y todo empujando a la consulta.'),
]

export const INCLUDED = [
  {
    title: 'Diseño a medida, cero plantillas',
    body: 'No compro un tema y le cambio los colores. Cada sitio arranca en una hoja en blanco: tu tipografía, tu paleta, las secciones que tu negocio necesita y ninguna que no.',
  },
  {
    title: 'Hablás con quien programa',
    body: 'Sin vendedor ni gerente de cuenta en el medio. El que te contesta el WhatsApp es el que diseña y escribe el código.',
  },
  {
    title: 'Código propio, no WordPress',
    body: 'Next.js y Supabase: el mismo stack de las apps que usás todos los días. Sin plugins que se rompen ni licencias mensuales para que el sitio siga en pie.',
  },
  {
    title: 'Velocidad que Google mide',
    body: 'Cada sitio se entrega optimizado para Core Web Vitals. Carga en menos de dos segundos en el celular, que es desde donde te va a ver la mayoría.',
  },
  {
    title: 'SEO técnico desde el día uno',
    body: 'Estructura, metadatos, datos estructurados y sitemap. Para que te encuentren en Google sin pagar por cada clic.',
  },
  {
    title: 'Hosting y 3 meses de soporte',
    body: 'Dominio y hosting configurados, y los primeros tres meses de ajustes y correcciones incluidos después de lanzar.',
  },
] as const

export const PROCESS = [
  {
    step: '01',
    title: 'Charlamos 15 minutos',
    body: 'Por WhatsApp o videollamada. Me contás qué hace tu empresa, a quién le vendés y qué querés que la página consiga.',
    meta: 'Hoy mismo',
  },
  {
    step: '02',
    title: 'Te muestro un boceto, gratis',
    body: 'Ves el diseño de tu home con tu contenido adentro, antes de pagar un peso. Recién ahí decidís si seguimos.',
    meta: '24 a 48 h',
  },
  {
    step: '03',
    title: 'Diseño y desarrollo',
    body: 'Armo el sitio completo con avances visibles. Ajustamos sobre la pantalla real, no sobre una descripción en un documento.',
    meta: '15 días',
  },
  {
    step: '04',
    title: 'Lanzamiento y soporte',
    body: 'Dominio, hosting y medición configurados. Los tres meses siguientes, las correcciones corren por mi cuenta.',
    meta: '+3 meses',
  },
] as const

export const FIT_YES = [
  'Empresas y PyMEs argentinas que ya venden y necesitan que el sitio esté a la altura de lo que ofrecen.',
  'Profesionales y estudios que hoy dependen de Instagram o del boca en boca para que los encuentren.',
  'Negocios que quieren un sitio propio, con panel para actualizarlo, y dejar de pagar una suscripción para siempre.',
  'Gente a la que el diseño le importa: si te da igual cómo se ve, hay opciones más baratas que yo.',
] as const

export const FIT_NO = [
  'Si lo necesitás para pasado mañana. El boceto tarda 48 h y el sitio, 15 días.',
  'Si buscás lo más barato del mercado. Hay quien te arma una página por monedas; no compito ahí.',
  'Si querés que además te lleve las redes o las campañas. Diseño y programo sitios: eso es lo que hago.',
] as const

export const FAQ = [
  {
    q: '¿Qué incluye el diseño de una página web?',
    a: 'El diseño a medida de cada pantalla (no una plantilla), el desarrollo del sitio en código propio, la carga de tus textos e imágenes, el SEO técnico para que Google te encuentre, el dominio y el hosting configurados, y tres meses de soporte después del lanzamiento. Entrás con una idea y salís con el sitio funcionando.',
  },
  {
    q: '¿Trabajás con empresas de Buenos Aires y del interior del país?',
    a: 'Sí. Estoy en Buenos Aires y trabajo con empresas de toda la Argentina. Todo el proceso es por WhatsApp y videollamada, así que la distancia no cambia nada. Si estás en CABA o Gran Buenos Aires y preferís que nos veamos en persona, también se puede.',
  },
  {
    q: '¿Cuánto tarda el diseño y desarrollo de un sitio web?',
    a: 'El boceto lo ves en 24 a 48 horas. El sitio completo se entrega en 15 días desde que aprobás el diseño y me pasás el contenido. Si el proyecto es más grande —una tienda online o un sistema a medida— te doy la fecha real antes de arrancar y queda por escrito.',
  },
  {
    q: '¿Qué diferencia hay entre un diseño a medida y una plantilla de WordPress o Wix?',
    a: 'Una plantilla la tienen otros mil negocios y viene con todo lo que no necesitás cargado adentro: por eso pesa, carga lento y se rompe cuando se actualiza un plugin. Un sitio a medida se escribe para vos: solo tiene lo tuyo, carga en menos de dos segundos y no dependés de una suscripción mensual para que siga online.',
  },
  {
    q: '¿Puedo actualizar la página yo después?',
    a: 'Sí. Los sitios con contenido que cambia seguido —productos, turnos, precios— salen con un panel propio para que lo edites vos, sin tocar código. Si es un sitio institucional que casi no cambia, los ajustes puntuales entran en los tres meses de soporte.',
  },
  {
    q: '¿Cuánto cuesta el diseño de una página web?',
    a: 'Un sitio institucional arranca en $300.000 ARS, con el precio cerrado por escrito antes de empezar. Los tres niveles de sitio y qué incluye cada uno están detallados en la guía de precios.',
  },
  {
    q: '¿Y si no me gusta el diseño?',
    a: 'Por eso el primer paso es un boceto gratis: si no te convence, no seguimos y no pagaste nada. Cuando arrancamos, el diseño se ajusta sobre la pantalla real hasta que quede como lo querés.',
  },
] as const
