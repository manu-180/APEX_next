import { cabecerasSupabase, configSupabase } from './supabase-rest'

export interface VersionTerminos {
  etiqueta: string
  publicadaEn: string
  markdown: string
}

type Fila = Record<string, unknown>

// `terminos_versiones` la crea el panel (apex_manager) en paralelo a este
// cambio y su esquema no estaba confirmado: se acepta el markdown bajo
// cualquiera de estos nombres. Confirmado el esquema, dejar solo el real.
const COLUMNAS_MARKDOWN = ['contenido_md', 'markdown', 'contenido', 'texto_md', 'texto', 'cuerpo_md', 'cuerpo'] as const

function etiquetaDe(valor: unknown): string | null {
  if (typeof valor === 'number' && Number.isFinite(valor)) return `v${valor}`
  if (typeof valor !== 'string') return null
  const v = valor.trim()
  if (!v) return null
  return /^\d/.test(v) ? `v${v}` : v
}

function aVersion(fila: Fila): VersionTerminos | null {
  const etiqueta = etiquetaDe(fila.version)
  const publicadaEn = typeof fila.publicada_en === 'string' ? fila.publicada_en : null
  const columna = COLUMNAS_MARKDOWN.find((c) => typeof fila[c] === 'string' && (fila[c] as string).trim())
  if (!etiqueta || !publicadaEn || !columna) return null
  return { etiqueta, publicadaEn, markdown: fila[columna] as string }
}

// En el build no hay página vieja que conservar: si Supabase no responde, se
// publica la versión sin términos y el deploy no se cae. En una revalidación
// (runtime) se tira el error a propósito: Next sigue sirviendo la última
// versión buena en vez de reemplazarla por la de "todavía no hay términos".
function fallar(motivo: string, detalle?: unknown): VersionTerminos[] {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.error(`[apex:terminos] ${motivo}. El build sigue sin términos publicados.`, detalle ?? '')
    return []
  }
  throw new Error(`[apex:terminos] ${motivo}`)
}

export async function terminosPublicados(): Promise<VersionTerminos[]> {
  const config = configSupabase()
  if (!config) return fallar('faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY')

  const endpoint = `${config.url}/rest/v1/terminos_versiones?select=*&publicada_en=not.is.null&order=publicada_en.desc`

  let res: Response
  try {
    res = await fetch(endpoint, {
      headers: cabecerasSupabase(config.key),
      next: { revalidate: 600, tags: ['terminos'] },
    })
  } catch (err) {
    return fallar('no se pudo conectar con Supabase', err)
  }

  if (res.status === 404) {
    console.warn('[apex:terminos] la tabla terminos_versiones todavía no existe; se muestra la página sin términos')
    return []
  }
  if (!res.ok) return fallar(`Supabase respondió ${res.status}`, await res.text().catch(() => ''))

  const filas: unknown = await res.json()
  if (!Array.isArray(filas)) return fallar('la respuesta de terminos_versiones no es una lista')

  const versiones = (filas as Fila[]).map(aVersion).filter((v): v is VersionTerminos => v !== null)
  if (versiones.length < filas.length) {
    console.error('[apex:terminos] hay versiones publicadas que no se pudieron leer', {
      filas: filas.length,
      leidas: versiones.length,
      columnas: Object.keys((filas[0] as Fila) ?? {}),
    })
  }
  return versiones
}

export function fechaLegible(iso: string): string {
  const fecha = new Date(iso)
  if (Number.isNaN(fecha.getTime())) return iso
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(fecha)
}

export interface DocumentoTerminos {
  resumen: string | null
  cuerpo: string
}

// Nunca se publica lo que va después de "## Interno": ahí viven los
// marcadores a completar y las decisiones sin confirmar del borrador.
export function prepararMarkdown(markdown: string): DocumentoTerminos {
  let md = markdown.replace(/\r\n/g, '\n')
  const interno = md.search(/^##\s+Interno\b/m)
  if (interno !== -1) md = md.slice(0, interno)
  md = md.replace(/\n-{3,}\s*$/, '').trim()
  md = md.replace(/^#\s+.+\n+/, '')
  md = md.replace(/^\*\*Versión[^\n]*\*\*\s*\n+/, '')

  const corte = md.search(/^-{3,}\s*$/m)
  if (corte > 0 && md.trimStart().startsWith('## ')) {
    const resumen = md.slice(0, corte).trim()
    const cuerpo = md.slice(corte).replace(/^-{3,}\s*\n/, '').trim()
    if (resumen && cuerpo) return { resumen, cuerpo }
  }
  return { resumen: null, cuerpo: md.trim() }
}
