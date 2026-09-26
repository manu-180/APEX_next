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

// Las reglas espejan las de consumidor_solicitud_crear (y de
// app_private.consumidor_contacto_norm): si la base cambia, cambiar acá.
export const LIMITES = { nombre: 80, contacto: 120, referencia: 64, detalle: 1000 } as const

const INVISIBLES = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u00AD\u200B-\u200F\u2028\u2029\u202A-\u202E\u2060-\u2064\u2066-\u2069\uFEFF]/g
const NOMBRE = /^\p{L}(?:[\p{L} .'’-]*[\p{L}.])?$/u
const MAIL = /^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i
const TELEFONO = /^\+?[0-9][0-9 ().-]{6,24}$/
const ETIQUETA = /<[\p{L}/!?]/u

function linea(valor: string): string {
  return valor.replace(INVISIBLES, '').replace(/\s+/g, ' ').trim()
}

function texto(valor: string): string {
  return valor.replace(INVISIBLES, '').replace(/[ \t]+/g, ' ').trim()
}

function telefono(valor: string): string {
  const limpio = linea(valor)
  return (limpio.startsWith('+') ? '+' : '') + limpio.replace(/\D/g, '')
}

export const MENSAJES: Record<Campo, string> = {
  nombre: 'Revisá tu nombre: usá solo letras, sin números ni símbolos.',
  contacto: 'Revisá el dato: un WhatsApp con código de área o un mail como nombre@gmail.com.',
  referencia: 'Revisá este dato: usá solo letras y números.',
  detalle: 'Escribilo sin los signos < y >.',
}

export function validarSolicitud(d: DatosSolicitud): Errores {
  const errores: Errores = {}
  const nombre = linea(d.nombre)
  if (nombre.replace(/[^\p{L}]/gu, '').length < 2) errores.nombre = 'Escribí tu nombre para saber a quién le respondemos.'
  else if (nombre.length > LIMITES.nombre) errores.nombre = `Usá hasta ${LIMITES.nombre} caracteres.`
  else if (!NOMBRE.test(nombre)) errores.nombre = MENSAJES.nombre

  const contacto = linea(d.contacto)
  if (d.canal === 'whatsapp') {
    const numero = telefono(contacto)
    const digitos = numero.replace(/\D/g, '').length
    if (!contacto) errores.contacto = 'Escribí tu número de WhatsApp.'
    else if (/[^\d\s()+.-]/.test(contacto) || digitos < 8 || digitos > 15 || !TELEFONO.test(numero)) {
      errores.contacto = 'Revisá el número: va con código de área, por ejemplo 11 2345 6789.'
    }
  } else if (!contacto) {
    errores.contacto = 'Escribí tu mail.'
  } else if (!MAIL.test(contacto) || contacto.length > LIMITES.contacto) {
    errores.contacto = 'Revisá el mail: tiene que ser como nombre@gmail.com.'
  }

  if (linea(d.referencia).length > LIMITES.referencia) {
    errores.referencia = `Usá hasta ${LIMITES.referencia} caracteres.`
  }
  const detalle = texto(d.detalle)
  if (detalle.length > LIMITES.detalle) errores.detalle = `Usá hasta ${LIMITES.detalle} caracteres.`
  else if (ETIQUETA.test(detalle)) errores.detalle = MENSAJES.detalle
  return errores
}

// La base solo acepta letras, números y # . _ : / - en la referencia: en vez
// de rechazar "Mantenimiento (Esencial)", se limpia lo que sobra.
function referenciaLimpia(valor: string): string {
  return linea(valor)
    .replace(/[^\p{L}\p{N} #._:/-]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, LIMITES.referencia)
    .trim()
}

export type ResultadoSolicitud =
  | { ok: true; codigo: string }
  | { ok: false; motivo: 'red' | 'no_disponible' | 'demasiados' }
  | { ok: false; motivo: 'campo'; campo: Campo }

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
        p_nombre: linea(d.nombre),
        p_contacto: d.canal === 'mail' ? linea(d.contacto).toLowerCase() : telefono(d.contacto),
        p_detalle: texto(d.detalle) || null,
        p_referencia: referenciaLimpia(d.referencia) || null,
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
    const { code, hint } = (cuerpo ?? {}) as { code?: unknown; hint?: unknown }
    console.error('[apex:consumidor] la RPC devolvió error', { status: res.status, cuerpo })
    if (res.status === 429 || code === 'PT429') return { ok: false, motivo: 'demasiados' }
    if (code === '22023' && typeof hint === 'string' && hint in MENSAJES) {
      return { ok: false, motivo: 'campo', campo: hint as Campo }
    }
    if (res.status >= 500 || res.status === 0) return { ok: false, motivo: 'red' }
    return { ok: false, motivo: 'no_disponible' }
  }

  const codigo = typeof cuerpo === 'string' ? cuerpo.trim() : ''
  if (!codigo) {
    console.error('[apex:consumidor] la RPC respondió sin código', { cuerpo })
    return { ok: false, motivo: 'no_disponible' }
  }
  return { ok: true, codigo }
}
