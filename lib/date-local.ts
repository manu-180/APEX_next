/** Fecha local YYYY-MM-DD (misma idea que Flutter `toIso8601String().split('T')[0]` en fecha local). */
export function formatLocalDateYMD(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** ISO estable al mediodía local para emails / Twilio (evita corrimientos UTC al parsear). */
export function localDayToMiddayIso(d: Date): string {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0).toISOString()
}
