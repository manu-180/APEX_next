/**
 * Reviews / testimonios — single source of truth.
 *
 * Usados en:
 * - /contacto (sección Opiniones, render visual)
 * - JSON-LD Review individual + AggregateRating (SEO + rich snippets ★)
 *
 * Nota: `role` es el contexto profesional/empresa del cliente cuando se conoce.
 * `project` linkea el caso de estudio cuando existe en /proyectos.
 */
export interface Review {
  id: number
  name: string
  role?: string
  rating: number
  text: string
  /** ISO date YYYY-MM-DD */
  date: string
  /** Optional theme/project association — drives accent color in editorial layout */
  project?: 'botlode' | 'assistify' | 'contact-engine' | 'luma-invita' | 'mnltecno' | 'tallerceramica' | 'tallermarcelo'
}

export const REVIEWS: Review[] = [
  {
    id: 1,
    name: 'Sebastián M.',
    role: 'Founder · App móvil',
    rating: 5,
    text: 'Excelente profesional. Entregó mi app antes de tiempo y con calidad impecable. El soporte post-entrega cumplió todo lo prometido.',
    date: '2025-11-12',
    project: 'assistify',
  },
  {
    id: 2,
    name: 'Laura P.',
    role: 'Emprendedora · Servicios',
    rating: 5,
    text: 'La landing que me hizo duplicó mis consultas en el primer mes. Diseño que vende, no que decora. Recomendado 100%.',
    date: '2025-10-28',
    project: 'mnltecno',
  },
  {
    id: 3,
    name: 'Martín G.',
    role: 'Cliente · iOS + Android',
    rating: 5,
    text: 'Gran capacidad técnica y excelente comunicación. Mi app funciona perfecto en ambas tiendas y la pasamos a producción sin un solo bug crítico.',
    date: '2025-09-15',
    project: 'assistify',
  },
  {
    id: 4,
    name: 'Carolina D.',
    role: 'PyME · Web institucional',
    rating: 4,
    text: 'Muy satisfecha con el resultado. Atención personalizada y cumplimiento de plazos. La única razón de 4 es que pedí un cambio extra fuera del scope original.',
    date: '2025-08-22',
    project: 'tallerceramica',
  },
  {
    id: 5,
    name: 'Nicolás R.',
    role: 'CEO · BotLode',
    rating: 5,
    text: 'BotLode es un producto increíble. Manuel entiende el problema antes de programar. No es un freelancer, es un partner técnico.',
    date: '2025-07-10',
    project: 'botlode',
  },
]

export const AVG_RATING = (
  REVIEWS.reduce((acc, r) => acc + r.rating, 0) / REVIEWS.length
).toFixed(1)

export const REVIEW_COUNT = REVIEWS.length
