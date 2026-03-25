/** WhatsApp agenda: AMBA móvil — el usuario completa 8 dígitos tras el 11; se arma +54 9 11 … */

export const BOOKING_WA_LOCAL_DIGITS = 8

export function bookingWhatsappLocalToE164(localDigits: string): string | null {
  const d = localDigits.replace(/\D/g, '')
  if (d.length !== BOOKING_WA_LOCAL_DIGITS) return null
  return `+54911${d}`
}

/**
 * Normaliza lo que llega al API (E.164 nuevo, solo cola, o formatos viejos tipo 11xxxxxxxx).
 */
export function normalizeBookingPhoneToE164(raw: string): string | null {
  let d = raw.replace(/\D/g, '')
  while (d.startsWith('0')) d = d.slice(1)
  if (d.length === 0) return null

  if (d.length === BOOKING_WA_LOCAL_DIGITS) return `+54911${d}`

  if (d.length === 10 && d.startsWith('11')) return `+549${d}`

  if (d.startsWith('54911') && d.length === 13) return `+${d}`

  return null
}
