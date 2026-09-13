'use client'

const COOKIE_NAME = 'apex_gclid'
const COOKIE_DAYS = 90

function setCookie(name: string, value: string, days: number): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${days * 86400}; path=/; SameSite=Lax`
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export type AdClickId = { kind: 'gclid' | 'gbraid' | 'wbraid'; id: string; capturedAt: string }

/**
 * Captura gclid/gbraid/wbraid de la URL y lo persiste 90 días — mismo
 * lookback que la conversion action CONTACT. Sin esto no hay forma de subir
 * después un lead calificado como offline conversion: la API de Google Ads
 * la pide como campo obligatorio (gclid + fecha del click), y el clic a
 * WhatsApp no pasa por ningún formulario que lo capture de otro modo.
 *
 * No pisa un valor ya guardado: si el visitante vuelve sin gclid en la URL
 * (ida y vuelta a WhatsApp, por ejemplo) el clic original sigue siendo la
 * atribución válida.
 */
export function captureAdClickId(): void {
  if (typeof window === 'undefined') return
  if (getCookie(COOKIE_NAME)) return

  const params = new URLSearchParams(window.location.search)
  const gclid = params.get('gclid')
  const gbraid = params.get('gbraid')
  const wbraid = params.get('wbraid')
  const id = gclid ?? gbraid ?? wbraid
  if (!id) return

  const kind: AdClickId['kind'] = gclid ? 'gclid' : gbraid ? 'gbraid' : 'wbraid'
  const payload: AdClickId = { kind, id, capturedAt: new Date().toISOString() }
  setCookie(COOKIE_NAME, JSON.stringify(payload), COOKIE_DAYS)
}

export function getStoredAdClickId(): AdClickId | null {
  if (typeof window === 'undefined') return null
  const raw = getCookie(COOKIE_NAME)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as AdClickId
    if (!parsed.id || !parsed.kind) return null
    return parsed
  } catch {
    return null
  }
}
