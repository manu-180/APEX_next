import { NextResponse } from 'next/server'

/**
 * Sumidero de reportes de Content-Security-Policy-Report-Only.
 *
 * Sin un `report-uri` el modo Report-Only no informa nada fuera de la consola
 * del visitante. Acá los recibimos y los dejamos en los logs de Vercel con un
 * prefijo fijo (`[csp]`) para poder filtrarlos y decidir, con datos reales,
 * cuándo pasar la política a enforcing.
 *
 * Pasa por el middleware de /api (rate limit por IP), así que un flood no
 * inunda los logs.
 */

const MAX_BODY_BYTES = 8 * 1024

export async function POST(req: Request) {
  const raw = await req.text().catch(() => '')
  if (!raw || raw.length > MAX_BODY_BYTES) {
    return new NextResponse(null, { status: 204 })
  }

  let report: Record<string, unknown> | null = null
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    // Formato clásico: { "csp-report": {...} }. Reporting API: [{ body: {...} }].
    report =
      (parsed['csp-report'] as Record<string, unknown> | undefined) ??
      ((Array.isArray(parsed) ? parsed[0]?.body : null) as Record<string, unknown> | null) ??
      parsed
  } catch {
    return new NextResponse(null, { status: 204 })
  }

  const pick = (k: string) => {
    const v = report?.[k]
    return typeof v === 'string' ? v.slice(0, 300) : undefined
  }

  console.warn('[csp]', {
    directive: pick('violated-directive') ?? pick('effective-directive') ?? pick('effectiveDirective'),
    blocked: pick('blocked-uri') ?? pick('blockedURL'),
    document: pick('document-uri') ?? pick('documentURL'),
    source: pick('source-file') ?? pick('sourceFile'),
    line: report?.['line-number'] ?? report?.lineNumber,
  })

  return new NextResponse(null, { status: 204 })
}
