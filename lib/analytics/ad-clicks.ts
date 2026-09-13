'use client'

import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { getStoredAdClickId } from '@/lib/analytics/ad-click-id'

// Sin 0/O/1/I/L: se lee (por una máquina, no por una persona) dentro de un
// mensaje de WhatsApp real, y esos caracteres se confunden entre sí en
// cualquier fuente. 5 de estos 32 símbolos da ~33M combinaciones — de sobra
// para no chocar nunca al volumen de clicks de esta campaña.
const REF_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const REF_CODE_LENGTH = 5

function generateRefCode(): string {
  const bytes = new Uint8Array(REF_CODE_LENGTH)
  crypto.getRandomValues(bytes)
  let code = ''
  for (const byte of bytes) code += REF_CODE_ALPHABET[byte % REF_CODE_ALPHABET.length]
  return code
}

/**
 * Registra el click a WhatsApp en `ad_clicks` cuando el visitante llegó con
 * gclid/gbraid/wbraid guardado (ver ad-click-id.ts). Es el único punto donde
 * ese dato se persiste más allá de la cookie del navegador — sin esto,
 * "APEX - Lead Calificado (offline)" nunca tiene con qué subir un lead.
 *
 * Devuelve el `ref_code` generado (o `null` si no hay click id, es decir
 * tráfico orgánico: no tiene sentido pegarle un código a un mensaje que nunca
 * se va a poder subir a Google Ads). El caller lo agrega al mensaje
 * prellenado — es el único dato que conecta este click anónimo con el
 * mensaje real que el bot de apex_manager recibe después.
 *
 * El insert es fire-and-forget: si la tabla falla o la red no responde, no
 * debe frenar ni afectar la apertura de WhatsApp. Pero el `ref_code` se
 * devuelve igual, generado en el momento — no depende de que el insert
 * termine a tiempo.
 */
export function logAdWhatsAppClick(landingPath: string): string | null {
  if (typeof window === 'undefined') return null
  if (!isSupabaseConfigured()) return null

  const clickId = getStoredAdClickId()
  if (!clickId) return null

  const refCode = generateRefCode()

  try {
    const supabase = getSupabaseBrowserClient()
    void supabase
      .from('ad_clicks')
      .insert({
        click_id_kind: clickId.kind,
        click_id: clickId.id,
        landing_path: landingPath.slice(0, 200),
        ref_code: refCode,
      })
      .then(({ error }) => {
        if (error) console.warn('[apex:ad-clicks] insert falló (no bloqueante):', error.message)
      })
  } catch (error) {
    console.warn('[apex:ad-clicks] excepción al loguear click (no bloqueante):', error)
  }

  return refCode
}
