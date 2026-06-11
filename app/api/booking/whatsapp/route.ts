import { NextResponse } from 'next/server'
import { normalizeBookingPhoneToE164 } from '@/lib/booking-phone'

/**
 * Proxy fino hacia apex-leads (/api/booking/register), que es el único dueño
 * de Evolution API: envía la confirmación al cliente, avisa al admin y
 * registra el lead + la conversación en el inbox de WhatsApp.
 *
 * Acá no viven credenciales de Evolution — solo la URL del bridge y el secret.
 */

const DEFAULT_LEADS_URL = 'https://leads.theapexweb.com'
const BRIDGE_TIMEOUT_MS = 25_000

export async function POST(req: Request) {
  let body: { phone?: string; dateIso?: string; hour?: number; clientName?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const phone = typeof body.phone === 'string' ? body.phone : ''
  const dateIso = typeof body.dateIso === 'string' ? body.dateIso : ''
  const hour = typeof body.hour === 'number' ? body.hour : NaN
  const clientName =
    typeof body.clientName === 'string' && body.clientName.trim().length > 0
      ? body.clientName.trim()
      : 'Cliente'

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
