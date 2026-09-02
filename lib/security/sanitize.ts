/**
 * Saneo de texto que llega de un input público y viaja a otro sistema
 * (mensaje de WhatsApp, inbox, log). Objetivo: que un valor hostil no pueda
 * inyectar saltos de línea, caracteres de control, ni reventar longitudes.
 */

/**
 * Colapsa a UNA sola línea y recorta a `maxLen` caracteres.
 * - Elimina caracteres de control C0/C1 (incluye \n, \r, \t, \0, escapes ANSI).
 * - Colapsa espacios múltiples en uno.
 * - Trim de bordes.
 *
 * Devuelve '' si tras sanear no queda nada útil (el caller decide el fallback).
 */
export function sanitizeSingleLine(raw: unknown, maxLen: number): string {
  if (typeof raw !== 'string') return ''
  const noControl = raw
    // Rango de control C0 (0x00-0x1F) y C1 (0x7F-0x9F), incluye \n \r \t.
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (noControl.length <= maxLen) return noControl
  return noControl.slice(0, maxLen).trim()
}
