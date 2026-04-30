import { NextResponse } from 'next/server'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { normalizeBookingPhoneToE164 } from '@/lib/booking-phone'

/** Plantillas por defecto (Twilio Content SID) — se pueden sobreescribir con env. */
const DEFAULT_TEMPLATE_CLIENT = 'HXdf3be6b2533d658ad6cfbb2c2e42fc29'
const DEFAULT_TEMPLATE_ADMIN = 'HX9b3ff8e1cc483e1680cfbed7d52af258'

function normalizeWhatsAppTo(toRaw: string): string {
  const s = toRaw.replace(/\s/g, '')
  if (s.startsWith('whatsapp:')) return s
  const digits = s.startsWith('+') ? s.slice(1) : s
  return `whatsapp:+${digits}`
}

async function sendTwilioTemplate(params: {
  accountSid: string
  authHeader: string
  from: string
  toWhatsapp: string
  contentSid: string
  variables: Record<string, string>
}): Promise<Response> {
  const body = new URLSearchParams({
    From: params.from,
    To: params.toWhatsapp,
    ContentSid: params.contentSid,
    ContentVariables: JSON.stringify(params.variables),
  })
  return fetch(`https://api.twilio.com/2010-04-01/Accounts/${params.accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: params.authHeader,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })
}

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

  const accountSid = process.env.TWILIO_ACCOUNT_SID ?? process.env.ACCOUNT_SID
  const apiKeySid = process.env.TWILIO_API_KEY_SID ?? process.env.API_KEY_SID
  const apiKeySecret = process.env.TWILIO_API_KEY_SECRET ?? process.env.API_KEY_SECRET
  const from = process.env.TWILIO_WHATSAPP_FROM ?? 'whatsapp:+5491134272488'

  const templateClientSid =
    process.env.TWILIO_WHATSAPP_TEMPLATE_CLIENT_SID ??
    process.env.TWILIO_WHATSAPP_TEMPLATE_SID ??
    process.env.WHATSAPP_TEMPLATE_SID ??
    DEFAULT_TEMPLATE_CLIENT

  const templateAdminSid =
    process.env.TWILIO_WHATSAPP_TEMPLATE_ADMIN_SID ?? DEFAULT_TEMPLATE_ADMIN

  /** Número E.164 o con dígitos; default: tu WhatsApp público del sitio. */
  const adminPhoneRaw =
    process.env.TWILIO_WHATSAPP_ADMIN_TO?.trim() ||
    process.env.TWILIO_OWNER_NOTIFY_PHONE?.trim() ||
    `+${WHATSAPP_NUMBER}`

  if (!accountSid || !apiKeySid || !apiKeySecret) {
    const missing: string[] = []
    if (!accountSid) missing.push('TWILIO_ACCOUNT_SID (o ACCOUNT_SID)')
    if (!apiKeySid) missing.push('TWILIO_API_KEY_SID (o API_KEY_SID)')
    if (!apiKeySecret) missing.push('TWILIO_API_KEY_SECRET (o API_KEY_SECRET)')
    return NextResponse.json(
      {
        error: 'WhatsApp no configurado: agregá las variables de Twilio en .env.local y reiniciá npm run dev.',
        missing,
      },
      { status: 503 }
    )
  }

  const authHeader = `Basic ${Buffer.from(`${apiKeySid}:${apiKeySecret}`).toString('base64')}`

  const dateStr = new Intl.DateTimeFormat('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(dateIso))
  const timeStr = `${hour}:00 hs`
  const clientTo = normalizeWhatsAppTo(phoneE164)

  /** Misma estructura que en Flutter: {{1}} fecha, {{2}} hora. */
  const varsClient: Record<string, string> = {
    '1': dateStr,
    '2': timeStr,
  }

  /**
   * Plantilla admin (HX9b3…): si en Twilio definiste solo {{1}} y {{2}}, basta.
   * Si agregás {{3}} nombre y {{4}} teléfono, poné TWILIO_ADMIN_TEMPLATE_EXTENDED=1 en .env.local
   */
  const adminExtended = process.env.TWILIO_ADMIN_TEMPLATE_EXTENDED === '1'
  const varsAdmin: Record<string, string> = adminExtended
    ? { '1': dateStr, '2': timeStr, '3': clientName, '4': phoneE164 }
    : varsClient

  const resClient = await sendTwilioTemplate({
    accountSid,
    authHeader,
    from,
    toWhatsapp: clientTo,
    contentSid: templateClientSid,
    variables: varsClient,
  })

  if (!resClient.ok) {
    const text = await resClient.text()
    console.error('[Twilio cliente]', resClient.status, text)
    return NextResponse.json({ error: 'No se pudo enviar el WhatsApp al cliente' }, { status: 502 })
  }

  const adminTo = normalizeWhatsAppTo(adminPhoneRaw)
  const resAdmin = await sendTwilioTemplate({
    accountSid,
    authHeader,
    from,
    toWhatsapp: adminTo,
    contentSid: templateAdminSid,
    variables: varsAdmin,
  })

  if (!resAdmin.ok) {
    const text = await resAdmin.text()
    console.error('[Twilio admin]', resAdmin.status, text)
    return NextResponse.json(
      {
        ok: true,
        warning: 'Cliente notificado; falló el aviso al administrador. Revisá plantilla admin (variables {{1}}–{{4}}) y TWILIO_WHATSAPP_ADMIN_TO.',
        detail: text.slice(0, 200),
      },
      { status: 200 }
    )
  }

  return NextResponse.json({ ok: true, client: true, admin: true })
}
