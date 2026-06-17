/**
 * Laboratorio — demos premium que genera "Libre Albedrío" (la Vidriera) cada
 * semana. Son sitios ficticios de alto diseño, deployados en Vercel, que
 * muestran el rango estético y de motion de APEX sin depender de un cliente.
 *
 * FUENTE DE VERDAD: la tabla `demos` del proyecto Supabase de libre-albedrio
 * (`wsmsspeeeujynqornyrj`). El pipeline (Curador → Horno → Despachador) escribe
 * ahí solo, así que esta lista se RECARGA SOLA: cada demo nuevo que llega a
 * `status='deployado'` aparece en el muestrario en la próxima revalidación (ISR).
 *
 * Lectura: REST con la anon key (RLS permite SELECT anónimo). La key es pública
 * por diseño (protegida por RLS), por eso va como fallback hardcodeado: el
 * muestrario funciona sin configurar envs. Se puede overridear por entorno.
 *
 * Screenshots: la tabla casi nunca trae `screenshot_url` usable (o es una ruta
 * relativa del repo). Por eso el thumbnail se deriva del sitio EN VIVO vía un
 * servicio de captura (microlink), con fallback a un póster de marca generado
 * desde la `paleta` real del demo. Si en el futuro el pipeline sube screenshots
 * hosteadas, tienen prioridad automática (ver `previewSrc`).
 */

import { cleanDomain } from '@/lib/data/showcase'

const LIBRE_ALBEDRIO_SUPABASE_URL =
  process.env.LIBRE_ALBEDRIO_SUPABASE_URL ?? 'https://wsmsspeeeujynqornyrj.supabase.co'

/** anon key (pública, protegida por RLS — segura de commitear). */
const LIBRE_ALBEDRIO_SUPABASE_ANON_KEY =
  process.env.LIBRE_ALBEDRIO_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzbXNzcGVlZXVqeW5xb3JueXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODA4NjAsImV4cCI6MjA5Njc1Njg2MH0.4FEBP2wp66Elrup_XqOmvmv-aNkRhFK1T0XLutuXYmo'

/** Cada cuánto se re-consulta la tabla (segundos). Un demo por semana → 30 min sobra. */
export const LAB_REVALIDATE_SECONDS = 1800

/** Forma cruda de una fila de `demos` (solo lo que pedimos). */
interface DemoRow {
  slug: string
  titulo: string | null
  pitch: string | null
  tipo_producto: string | null
  industria: string | null
  estilo_visual: string | null
  tecnica_movimiento: string | null
  complejidad: string | null
  paleta: string | null
  status: string | null
  screenshot_url: string | null
  url_deploy: string | null
  built_at: string | null
  created_at: string | null
}

/** Demo ya normalizado y listo para la UI. */
export interface LabDemo {
  slug: string
  /** Nombre de marca a mostrar. */
  name: string
  /** Una línea: qué es / la apuesta de diseño. */
  tagline: string
  /** URL en vivo (Vercel). */
  url: string
  /** Dominio limpio para la barra del browser frame. */
  domain: string
  /** Facets (chips + filtro). */
  productType: string | null
  industry: string | null
  style: string | null
  motion: string | null
  complexity: string | null
  /** Hex codes parseados de `paleta` (para el póster fallback). */
  paletteHexes: string[]
  /** Mejor fuente de imagen para el preview (ver `resolvePreviewSrc`). */
  previewSrc: string
  builtAt: string | null
}

/**
 * Overrides locales de screenshot (curados, máxima calidad). Si existe un
 * `/public/projects/muestrario/<slug>.webp`, mapealo acá y tiene prioridad
 * sobre el servicio de captura. Para los demos nuevos que llegan solos, queda
 * vacío y se usa el servicio automáticamente.
 */
const LOCAL_SHOT: Record<string, string> = {
  nebula: '/projects/muestrario/nebula.jpg',
  brasa: '/projects/muestrario/brasa.jpg',
  forge_fitness: '/projects/muestrario/forge_fitness.jpg',
  'e-commerce_mujer': '/projects/muestrario/e-commerce_mujer.jpg',
  developer_web: '/projects/muestrario/developer_web.jpg',
}

/** Captura en vivo del sitio vía microlink (sin API key; cae al póster si falla). */
function screenshotService(url: string): string {
  return `https://api.microlink.io/?url=${encodeURIComponent(
    url,
  )}&screenshot=true&embed=screenshot.url&meta=false`
}

/** Prioridad: screenshot hosteada (http) → override local → servicio en vivo. */
function resolvePreviewSrc(row: Pick<DemoRow, 'slug' | 'screenshot_url' | 'url_deploy'>): string {
  const hosted = row.screenshot_url?.trim()
  if (hosted && /^https?:\/\//i.test(hosted)) return hosted
  if (LOCAL_SHOT[row.slug]) return LOCAL_SHOT[row.slug]
  return screenshotService(row.url_deploy ?? '')
}

/** Extrae hex codes (#RRGGBB) de la descripción de paleta, dedup, máx 4. */
function parsePalette(paleta: string | null): string[] {
  if (!paleta) return []
  const found = paleta.match(/#[0-9a-fA-F]{6}/g) ?? []
  return Array.from(new Set(found.map((h) => h.toUpperCase()))).slice(0, 4)
}

/** Primera oración del pitch, recortada (los pitches a veces traen 2-3 frases). */
function toTagline(pitch: string | null, fallback: string): string {
  if (!pitch) return fallback
  const firstSentence = pitch.split(/(?<=[.!?])\s+/)[0]?.trim() || pitch.trim()
  return firstSentence.length > 140 ? `${firstSentence.slice(0, 137).trimEnd()}…` : firstSentence
}

function toLabDemo(row: DemoRow): LabDemo {
  const url = row.url_deploy?.trim() ?? ''
  const name = row.titulo?.trim() || row.slug
  return {
    slug: row.slug,
    name,
    tagline: toTagline(row.pitch, `${name} — diseño premium por APEX.`),
    url,
    domain: url ? cleanDomain(url) : '',
    productType: row.tipo_producto?.trim() || null,
    industry: row.industria?.trim() || null,
    style: row.estilo_visual?.trim() || null,
    motion: row.tecnica_movimiento?.trim() || null,
    complexity: row.complejidad?.trim() || null,
    paletteHexes: parsePalette(row.paleta),
    previewSrc: resolvePreviewSrc(row),
    builtAt: row.built_at ?? row.created_at ?? null,
  }
}

const SELECT_COLS =
  'slug,titulo,pitch,tipo_producto,industria,estilo_visual,tecnica_movimiento,complejidad,paleta,status,screenshot_url,url_deploy,built_at,created_at'

/**
 * Snapshot de respaldo (los demos vivos al momento de escribir esto). Solo se
 * usa si la consulta a Supabase falla en el PRIMER build. En operación normal
 * la fuente es la tabla en vivo y este array nunca se toca.
 */
const FALLBACK_RAW: DemoRow[] = [
  {
    slug: 'brasa',
    titulo: 'Brasa',
    pitch:
      'Restaurante de fine dining de cocina de fuego de autor: parrilla y brasas elevadas a alta cocina. Editorial, lujo serif, dark cálido.',
    tipo_producto: 'restaurante/gastronomia',
    industria: 'gastronomia',
    estilo_visual: 'minimal editorial + lujo serif (dark cálido)',
    tecnica_movimiento: 'parallax por capas + scroll-telling + smooth scroll',
    complejidad: 'media',
    paleta: '#0E0B09 + #E2502B + #D9A441 + #F4EDE2',
    status: 'deployado',
    screenshot_url: null,
    url_deploy: 'https://demo-brasa.vercel.app',
    built_at: '2026-06-16T18:23:53Z',
    created_at: '2026-06-12T00:00:00Z',
  },
  {
    slug: 'nebula',
    titulo: 'Nebula',
    pitch: 'Landing de un SaaS de analytics con IA — estética del futuro.',
    tipo_producto: 'landing-saas',
    industria: 'tech / IA',
    estilo_visual: 'aurora-dark + glassmorphism de acento + bento',
    tecnica_movimiento: 'scroll-reveal + smooth scroll + 3D sutil + kinetic typography',
    complejidad: 'alta',
    paleta: '#0B0B18 + #7C5CFC + #22D3EE + #F4EDE2',
    status: 'deployado',
    screenshot_url: null,
    url_deploy: 'https://nebula-delta-henna.vercel.app',
    built_at: '2026-06-14T06:07:49Z',
    created_at: '2026-06-14T05:23:29Z',
  },
  {
    slug: 'forge_fitness',
    titulo: 'Forge Fitness',
    pitch: 'Landing de gimnasio / fitness con energía y movimiento.',
    tipo_producto: 'landing',
    industria: 'fitness',
    estilo_visual: null,
    tecnica_movimiento: null,
    complejidad: 'media',
    paleta: null,
    status: 'deployado',
    screenshot_url: null,
    url_deploy: 'https://demo-forge-fitness.vercel.app',
    built_at: '2026-06-16T04:46:11Z',
    created_at: '2026-06-14T05:23:29Z',
  },
  {
    slug: 'e-commerce_mujer',
    titulo: 'Atelier',
    pitch: 'Tienda de moda femenina con catálogo editorial.',
    tipo_producto: 'ecommerce',
    industria: 'moda',
    estilo_visual: null,
    tecnica_movimiento: null,
    complejidad: 'media',
    paleta: null,
    status: 'deployado',
    screenshot_url: null,
    url_deploy: 'https://demo-e-commerce-mujer.vercel.app',
    built_at: '2026-06-16T04:43:56Z',
    created_at: '2026-06-14T05:23:29Z',
  },
  {
    slug: 'developer_web',
    titulo: 'Developer',
    pitch: 'Portfolio de desarrollador con 3D y profundidad.',
    tipo_producto: 'portfolio',
    industria: 'tech',
    estilo_visual: null,
    tecnica_movimiento: '3D (three / r3f)',
    complejidad: 'alta',
    paleta: null,
    status: 'deployado',
    screenshot_url: null,
    url_deploy: 'https://demo-developer-web.vercel.app',
    built_at: '2026-06-16T04:32:41Z',
    created_at: '2026-06-14T05:23:29Z',
  },
]

const FALLBACK_DEMOS: LabDemo[] = FALLBACK_RAW.map(toLabDemo)

/**
 * Trae los demos deployados de la Vidriera, ordenados del más nuevo al más
 * viejo. ISR: se cachea `LAB_REVALIDATE_SECONDS`. Ante cualquier error de red
 * cae al snapshot para que el muestrario nunca quede vacío.
 */
export async function getLabDemos(): Promise<LabDemo[]> {
  const endpoint =
    `${LIBRE_ALBEDRIO_SUPABASE_URL}/rest/v1/demos` +
    `?select=${encodeURIComponent(SELECT_COLS)}` +
    `&status=eq.deployado&order=built_at.desc.nullslast`

  try {
    const res = await fetch(endpoint, {
      headers: {
        apikey: LIBRE_ALBEDRIO_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${LIBRE_ALBEDRIO_SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: LAB_REVALIDATE_SECONDS },
    })
    if (!res.ok) throw new Error(`Supabase REST ${res.status}`)
    const rows = (await res.json()) as DemoRow[]
    const demos = rows.map(toLabDemo).filter((d) => d.url)
    return demos.length > 0 ? demos : FALLBACK_DEMOS
  } catch {
    return FALLBACK_DEMOS
  }
}
