import { NextResponse } from 'next/server'
import { normalizeBookingPhoneToE164 } from '@/lib/booking-phone'
import { sanitizeSingleLine } from '@/lib/security/sanitize'
import { rateLimit, clientIpFromHeaders } from '@/lib/security/rate-limit'

/**
 * Proxy fino hacia apex-leads (/api/booking/register), que es el único dueño
 * de Evolution API: envía la confirmación al cliente, avisa al admin y
 * registra el lead + la conversación en el inbox de WhatsApp.
 *
 * Acá no viven credenciales de Evolution — solo la URL del bridge y el secret.
 *
 * Endpoint PÚBLICO y sin auth: cada POST dispara un mensaje de WhatsApp real
 * (costo + molestia). Por eso está blindado en capas: content-type, tope de
 * tamaño de body, honeypot, rate limit por IP y saneo de clientName antes de
 * reenviarlo. El middleware ya aplica método/origen/rate-limit general; esto
 * es la segunda barrera, específica de este endpoint caro.
 */

const DEFAULT_LEADS_URL = 'https://leads.theapexweb.com'
const BRIDGE_TIMEOUT_MS = 25_000

// Cuerpo esperado: 4 campos cortos. 2 KB es holgado y frena payloads absurdos.
const MAX_BODY_BYTES = 2048
// clientName viaja a un mensaje de WhatsApp: una sola línea, 60 chars.
const MAX_CLIENT_NAME = 60
// Tope específico del endpoint caro: 5 reservas cada 10 min por IP.
const RL_LIMIT = 5
const RL_WINDOW_MS = 600_000

// El bridge puede tardar hasta 25s; sin esto Vercel cortaría la función antes
// (default 15s en Pro) y la confirmación de WhatsApp fallaría silenciosamente.
export const maxDuration = 30

export async function POST(req: Request) {
  // 1) Rate limit por IP (defensa específica de este endpoint costoso).
  const ip = clientIpFromHeaders(req.headers)
  const rl = rateLimit(`booking-wa:${ip}`, RL_LIMIT, RL_WINDOW_MS)
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Recibimos varias reservas seguidas desde tu conexión. Esperá unos minutos y probá otra vez.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec), 'Cache-Control': 'no-store' } }
    )
  }

  // 2) Content-Type: sólo JSON. Un form-encoded o multipart acá es sospechoso.
  const contentType = req.headers.get('content-type') || ''
  if (!contentType.toLowerCase().includes('application/json')) {
    return NextResponse.json({ error: 'Formato no soportado.' }, { status: 415 })
  }

  // 3) Tope de tamaño: leemos texto crudo y cortamos antes de parsear.
  const raw = await req.text()
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Solicitud demasiado grande.' }, { status: 413 })
  }

  let body: {
    phone?: string
    dateIso?: string
    hour?: number
    clientName?: string
    company?: string // honeypot: la UI real lo deja vacío.
  }
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }
  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  // 4) Honeypot: campo `company` que la UI NO completa. Si viene con algo, es
  //    un bot. Devolvemos éxito falso (200) SIN tocar el bridge — el bot no
  //    aprende nada y no gastamos un mensaje de WhatsApp.
  if (typeof body.company === 'string' && body.company.trim().length > 0) {
    console.warn('[booking] honeypot activado — petición descartada en silencio')
    return NextResponse.json({ ok: true, client: false, admin: false })
  }

  const phone = typeof body.phone === 'string' ? body.phone : ''
  const dateIso = typeof body.dateIso === 'string' ? body.dateIso : ''
  const hour = typeof body.hour === 'number' ? body.hour : NaN
  // clientName saneado: una línea, sin control chars, máx 60. Fallback 'Cliente'.
  const clientName = sanitizeSingleLine(body.clientName, MAX_CLIENT_NAME) || 'Cliente'

  if (!phone.trim() || !dateIso || Number.isNaN(hour) || hour < 0 || hour > 23) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const phoneE164 = normalizeBookingPhoneToE164(phone)
  if (!phoneE164) {
    return NextResponse.json(
      {
        error:
          'Número de WhatsApp inválido. Ingresá los 8 dígitos de tu celular (código de área 11 ya incluido en el formulario).',
      },
      { status: 400 }
    )
  }

  const leadsUrl = (process.env.APEX_LEADS_URL ?? DEFAULT_LEADS_URL).replace(/\/$/, '')
  const secret = process.env.APEX_LEADS_BOOKING_SECRET

  if (!secret) {
    console.error('[booking] APEX_LEADS_BOOKING_SECRET no configurada')
    return NextResponse.json(
      {
        error: 'Notificación WhatsApp no configurada.',
        missing: ['APEX_LEADS_BOOKING_SECRET'],
      },
      { status: 503 }
    )
  }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), BRIDGE_TIMEOUT_MS)
    const res = await fetch(`${leadsUrl}/api/booking/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({
        phone: phoneE164,
        clientName,
        dateIso,
        hour,
        source: 'apex-web-booking',
      }),
      signal: controller.signal,
      cache: 'no-store',
    })
    clearTimeout(timer)

    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>

    if (!res.ok) {
      console.error('[booking] bridge apex-leads falló', res.status, json)
      return NextResponse.json(
        { error: 'No se pudo enviar la confirmación por WhatsApp.' },
        { status: 502 }
      )
    }

    return NextResponse.json({
      ok: true,
      client: json.sent_client === true,
      admin: json.sent_admin === true,
    })
  } catch (err) {
    console.error('[booking] bridge apex-leads error de red:', (err as Error).message)
    return NextResponse.json(
      { error: 'No se pudo contactar el servicio de WhatsApp.' },
      { status: 502 }
    )
  }
}
