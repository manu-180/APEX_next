import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * POST /api/lead-magnet
 *
 * Body: { email: string; name?: string; projectType?: string; source?: string }
 *
 * 1) Persiste el lead en `lead_magnet_subscribers` (Supabase)
 * 2) Dispara la edge function `send-lead-magnet` con el link al PDF y arranca
 *    la secuencia de nurture (si Resend está configurado en Supabase)
 * 3) Si algo falla, devuelve OK igualmente con `downloadUrl` para que el
 *    visitante NO se quede sin la guía — la falla de persistencia no debe
 *    bloquear la entrega del valor prometido.
 *
 * Setup pendiente (manual):
 * - Crear tabla `lead_magnet_subscribers` en Supabase (ver migración en
 *   supabase/migrations/lead_magnet_subscribers.sql).
 * - Crear edge function `send-lead-magnet` en Supabase que use Resend para
 *   mandar email con el PDF + agendar emails subsecuentes (ver contenido en
 *   content/email-sequence/lead-magnet/).
 * - Subir el PDF a /public/lead-magnets/guia-precios-2026.pdf.
 */

const PDF_PATH = '/lead-magnets/guia-precios-2026.pdf'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

interface LeadMagnetBody {
  email?: string
  name?: string
  projectType?: string
  source?: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: Request) {
  let body: LeadMagnetBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = (body.email ?? '').trim().toLowerCase()
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  const name = (body.name ?? '').trim().slice(0, 120) || null
  const projectType = (body.projectType ?? '').trim().slice(0, 80) || null
  const source = (body.source ?? '').trim().slice(0, 80) || 'website'

  // Persistencia + email — best effort, no bloquea el download
  let persisted = false
  let emailQueued = false
  let warning: string | null = null

  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

      // Upsert por email — evita duplicados si vuelven al form
      const { error: insertError } = await supabase
        .from('lead_magnet_subscribers')
        .upsert(
          {
            email,
            name,
            project_type: projectType,
            source,
          },
          { onConflict: 'email' },
        )

      if (insertError) {
        warning = `persist_error: ${insertError.message}`
      } else {
        persisted = true
      }

      // Llamar a edge function de envío (no bloqueante)
      try {
        const { error: fnError } = await supabase.functions.invoke('send-lead-magnet', {
          body: { email, name, projectType, pdfPath: PDF_PATH },
        })
        if (!fnError) emailQueued = true
      } catch (e) {
        warning = warning ? `${warning} | invoke_failed` : 'invoke_failed'
      }
    } catch (e) {
      warning = e instanceof Error ? e.message : 'unknown_supabase_error'
    }
  } else {
    warning = 'supabase_not_configured'
  }

  // El visitor SIEMPRE recibe el PDF — la persistencia es secundaria
  return NextResponse.json({
    ok: true,
    downloadUrl: PDF_PATH,
    persisted,
    emailQueued,
    warning,
  })
}
