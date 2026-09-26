import { cabecerasSupabase, configSupabase } from './supabase-rest'
import type { TipoSolicitud } from './config'

export type Canal = 'whatsapp' | 'mail'

export interface DatosSolicitud {
  nombre: string
  canal: Canal
  contacto: string
  referencia: string
  detalle: string
}

export type Campo = 'nombre' | 'contacto' | 'referencia' | 'detalle'
export type Errores = Partial<Record<Campo, string>>

export const LIMITES = { nombre: 80, contacto: 120, referencia: 120, detalle: 1000 } as const

const MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validarSolicitud(d: DatosSolicitud): Errores {
  const errores: Errores = {}
  const nombre = d.nombre.trim()
  if (nombre.length < 2) errores.nombre = 'Escribí tu nombre para saber a quién le respondemos.'
  else if (nombre.length > LIMITES.nombre) errores.nombre = `Usá hasta ${LIMITES.nombre} caracteres.`

  const contacto = d.contacto.trim()
  if (d.canal === 'whatsapp') {
    const digitos = contacto.replace(/\D/g, '')
    if (!digitos) errores.contacto = 'Escribí tu número de WhatsApp.'
    else if (digitos.length < 8 || digitos.length > 15 || /[^\d\s()+.-]/.test(contacto)) {
      errores.contacto = 'Revisá el número: va con código de área, por ejemplo 11 2345 6789.'
    }
  } else if (!contacto) {
    errores.contacto = 'Escribí tu mail.'
  } else if (!MAIL.test(contacto) || contacto.length > LIMITES.contacto) {
    errores.contacto = 'Revisá el mail: tiene que ser como nombre@gmail.com.'
  }

  if (d.referencia.trim().length > LIMITES.referencia) {
    errores.referencia = `Usá hasta ${LIMITES.referencia} caracteres.`
  }
  if (d.detalle.trim().length > LIMITES.detalle) {
    errores.detalle = `Usá hasta ${LIMITES.detalle} caracteres.`
  }
  return errores
}

function contactoNormalizado(d: DatosSolicitud): string {
  const valor = d.contacto.trim()
  return d.canal === 'mail' ? valor.toLowerCase() : valor.replace(/\s+/g, ' ')
}

export type ResultadoSolicitud =
  | { ok: true; codigo: string }
  | { ok: false; motivo: 'red' | 'no_disponible' | 'rechazada' }

const ESPERA_MAXIMA_MS = 20_000

async function leerJson(res: Response): Promise<unknown> {
  try {
    return await res.json()
  } catch (err) {
    console.error('[apex:consumidor] la respuesta no es JSON', { status: res.status, err })
    return null
  }
}

export async function enviarSolicitud(tipo: TipoSolicitud, d: DatosSolicitud): Promise<ResultadoSolicitud> {
  const config = configSupabase()
  if (!config) {
    console.error('[apex:consumidor] faltan las variables públicas de Supabase')
    return { ok: false, motivo: 'no_disponible' }
  }

  const corte = new AbortController()
  const reloj = window.setTimeout(() => corte.abort(), ESPERA_MAXIMA_MS)
  let res: Response
  try {
    res = await fetch(`${config.url}/rest/v1/rpc/consumidor_solicitud_crear`, {
      method: 'POST',
      headers: { ...cabecerasSupabase(config.key), 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        p_tipo: tipo,
        p_nombre: d.nombre.trim(),
        p_contacto: contactoNormalizado(d),
        p_detalle: d.detalle.trim() || null,
        p_referencia: d.referencia.trim() || null,
      }),
      signal: corte.signal,
    })
  } catch (err) {
    console.error('[apex:consumidor] no se pudo llamar a la RPC', err)
    return { ok: false, motivo: 'red' }
  } finally {
    window.clearTimeout(reloj)
  }

  const cuerpo = await leerJson(res)
  if (!res.ok) {
    const code = (cuerpo as { code?: unknown } | null)?.code
    console.error('[apex:consumidor] la RPC devolvió error', { status: res.status, cuerpo })
    if (res.status === 404 || code === 'PGRST202') return { ok: false, motivo: 'no_disponible' }
    if (res.status >= 500) return { ok: false, motivo: 'red' }
    return { ok: false, motivo: 'rechazada' }
  }

  const codigo = typeof cuerpo === 'string' ? cuerpo.trim() : ''
  if (!codigo) {
    console.error('[apex:consumidor] la RPC respondió sin código', { cuerpo })
    return { ok: false, motivo: 'no_disponible' }
  }
  return { ok: true, codigo }
}
