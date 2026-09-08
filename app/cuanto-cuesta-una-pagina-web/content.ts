import { arsInline, WEB_PLANS } from '@/lib/types/services'

export interface PriceTier {
  id: string
  name: string
  price: number
  eyebrow: string
  /** Una línea: para quién es. Se lee de un vistazo en la comparación. */
  forWho: string
  /** Qué suma respecto del plan anterior (patrón "Todo lo de X, más:"). */
  inheritsFrom?: string
  includes: string[]
  featured?: boolean
}

const plan = (id: string) => {
  const p = WEB_PLANS.find((x) => x.id === id)
  if (!p || p.price == null) throw new Error(`Plan web sin precio: ${id}`)
  return p
}

const landing = plan('web_basic')
const interactiva = plan('web_interactive')
const tienda = plan('web_premium')

export const PRICE_TIERS: PriceTier[] = [
  {
    id: landing.id,
    name: landing.name,
    price: landing.price as number,
    eyebrow: 'Para mostrar y que te contacten',
    forWho: landing.targetAudience,
    includes: landing.features,
  },
  {
    id: interactiva.id,
    name: interactiva.name,
    price: interactiva.price as number,
    eyebrow: 'Para que el cliente haga algo solo',
    forWho: interactiva.targetAudience,
    inheritsFrom: landing.name,
    includes: interactiva.features.filter((f) => !f.toLowerCase().startsWith('todo lo del plan')),
    featured: true,
  },
  {
    id: tienda.id,
    name: tienda.name,
    price: tienda.price as number,
    eyebrow: 'Para vender online sin comisiones',
    forWho: tienda.targetAudience,
    includes: tienda.features,
  },
]

export const PRICE_MIN = Math.min(...PRICE_TIERS.map((t) => t.price))
export const PRICE_MAX = Math.max(...PRICE_TIERS.map((t) => t.price))

/**
 * La pregunta que realmente trae al visitante después de ver el número.
 * Cada factor dice hacia dónde mueve el precio, sin cifras inventadas.
 */
export const PRICE_FACTORS: Array<{ title: string; body: string; moves: 'sube' | 'neutro' }> = [
  {
    title: 'Cuántas pantallas tiene',
    body: 'Una página de una sola pantalla y un sitio de ocho secciones no cuestan lo mismo. Es el factor que más pesa dentro de un mismo plan.',
    moves: 'sube',
  },
  {
    title: 'Si el visitante sólo lee, o además hace algo',
    body: 'Leer y escribirte por WhatsApp entra en Landing Page. Reservar un turno, cotizar solo o pagar una seña ya es Web Interactiva.',
    moves: 'sube',
  },
  {
    title: 'Si vendés productos',
    body: 'Catálogo, carrito, stock y checkout son un sistema, no una sección. Ahí el proyecto es Tienda Online.',
    moves: 'sube',
  },
  {
    title: 'Si los textos y las fotos ya existen',
    body: 'Si tenés el contenido listo, arrancamos el primer día. Si hay que producirlo, suma tiempo y se acuerda aparte antes de empezar.',
    moves: 'sube',
  },
  {
    title: 'Con qué se tiene que conectar',
    body: 'MercadoPago, Google Calendar, WhatsApp o tu sistema de facturación: cada integración se define en el presupuesto, nunca después.',
    moves: 'sube',
  },
  {
    title: 'El diseño no es un extra',
    body: 'No cobro aparte por “diseño premium”. Los tres planes son 100% a medida: no hay una versión barata con plantilla.',
    moves: 'neutro',
  },
]

/** Lo que otros cobran aparte y acá viene en los tres planes. */
export const ALWAYS_INCLUDED: string[] = [
  'Diseño 100% a medida, sin plantillas',
  'SEO técnico para que Google te encuentre',
  'Hosting + 3 meses de mantenimiento',
  'Boceto gratis antes de que pagues nada',
  '3 cuotas sin interés',
  'Entrega en 15 días, por escrito',
]

export const PROCESS_STEPS: Array<{ num: string; title: string; body: string }> = [
  {
    num: '01',
    title: 'Te paso el número exacto',
    body: 'Me contás qué necesitás por WhatsApp y te respondo en menos de una hora con el precio cerrado. Sin reuniones para “relevar”.',
  },
  {
    num: '02',
    title: 'Ves el boceto antes de pagar',
    body: 'En 24 a 48 horas tenés un boceto de tu página. Si no te convence, no seguimos y no pagaste nada.',
  },
  {
    num: '03',
    title: 'Online en 15 días',
    body: 'Fecha pactada por escrito antes de arrancar. Se paga en 3 cuotas sin interés y quedan 3 meses de soporte incluidos.',
  },
]

/**
 * Precio en prosa: "$300.000". `formatARS` mete un espacio duro después del
 * signo ("$ 300.000") que en medio de una oración se lee como un error.
 * Los montos salen igual de `lib/types/services.ts`, así que no pueden
 * desincronizarse del pricing.
 */
export { arsInline }

const P_LANDING = arsInline(PRICE_TIERS[0].price)
const P_INTERACTIVA = arsInline(PRICE_TIERS[1].price)
const P_TIENDA = arsInline(PRICE_TIERS[2].price)

export const FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: '¿Cuánto cuesta una página web en Argentina?',
    a: `Entre ${P_LANDING} y ${P_TIENDA} pesos, según lo que la página tenga que hacer. Una Landing Page cuesta ${P_LANDING}, una Web Interactiva con reservas o cotizador ${P_INTERACTIVA} y una Tienda Online con catálogo y pagos ${P_TIENDA}. Son precios cerrados: el número que ves es el que pagás.`,
  },
  {
    q: '¿Cuánto sale una página web simple?',
    a: `Una página simple —tus servicios, tu presentación y un botón de WhatsApp que funciona— sale ${P_LANDING} pesos, con diseño a medida, SEO técnico, hosting y 3 meses de mantenimiento incluidos.`,
  },
  {
    q: '¿Cuánto cuesta una tienda online?',
    a: `Una tienda online propia cuesta ${P_TIENDA} pesos e incluye catálogo con filtros, carrito, checkout con MercadoPago o Stripe, panel de gestión de pedidos y stock, y cuentas de cliente con historial de compras. Es tuya: no pagás comisión por venta a ninguna plataforma.`,
  },
  {
    q: '¿Qué incluye el precio?',
    a: 'En los tres planes: diseño 100% a medida sin plantillas, SEO técnico, hosting y 3 meses de mantenimiento. Después cada plan suma lo suyo — formularios y WhatsApp en Landing Page, reservas y cobros en Web Interactiva, catálogo y checkout en Tienda Online. No hay costos escondidos: lo que no esté en el presupuesto no se factura después.',
  },
  {
    q: '¿Cuánto tarda una página web?',
    a: '15 días desde que arrancamos, con la fecha pactada por escrito antes de empezar. Si no llego en ese plazo, devuelvo el depósito. El boceto lo ves mucho antes: en 24 a 48 horas.',
  },
  {
    q: '¿Se puede pagar en cuotas?',
    a: 'Sí, en 3 cuotas sin interés. Y primero ves el boceto: recién cuando te gusta lo que ves, se paga la primera.',
  },
  {
    q: '¿El precio puede cambiar durante el proyecto?',
    a: 'No. El presupuesto se cierra por escrito con el alcance definido antes de arrancar. Si más adelante querés sumar algo que no estaba, lo cotizamos aparte y decidís vos.',
  },
  {
    q: '¿Tenés un tarifario de diseño web?',
    a: `Los tres números de esta página son el tarifario completo: ${P_LANDING}, ${P_INTERACTIVA} y ${P_TIENDA}. No hay una lista de precios distinta según el cliente ni un “a cotizar” que aparece al final de la charla.`,
  },
  {
    q: '¿Hay costos mensuales después?',
    a: 'El hosting y el mantenimiento van incluidos los primeros 3 meses. Lo que siga después se acuerda por escrito antes de arrancar, así sabés desde el día uno con qué números contar.',
  },
  {
    q: '¿Por qué una agencia cobra más por lo mismo?',
    a: 'Porque en una agencia el precio paga vendedores, gerentes de cuenta y estructura. Acá hablás directo con quien programa tu página: cada mensaje me llega a mí y el presupuesto no tiene que sostener a nadie más.',
  },
]
