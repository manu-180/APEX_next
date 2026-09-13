'use client'

import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { getStoredAdClickId } from '@/lib/analytics/ad-click-id'

/**
 * Registra el click a WhatsApp en `ad_clicks` cuando el visitante llegó con
 * gclid/gbraid/wbraid guardado (ver ad-click-id.ts). Es el único punto donde
 * ese dato se persiste más allá de la cookie del navegador — sin esto,
 * "APEX - Lead Calificado (offline)" nunca tiene con qué subir un lead.
 *
 * Fire-and-forget a propósito: si la tabla todavía no existe (falta aplicar
 * la migración) o la red falla, no debe frenar ni afectar la apertura de
 * WhatsApp. Es telemetría, no una dependencia del flujo principal.
 */
export function logAdWhatsAppClick(landingPath: string): void {
  if (typeof window === 'undefined') return
  if (!isSupabaseConfigured()) return

  const clickId = getStoredAdClickId()
  if (!clickId) return

  try {
    const supabase = getSupabaseBrowserClient()
    void supabase
      .from('ad_clicks')
      .insert({
        click_id_kind: clickId.kind,
        click_id: clickId.id,
        landing_path: landingPath.slice(0, 200),
      })
      .then(({ error }) => {
        if (error) console.warn('[apex:ad-clicks] insert falló (no bloqueante):', error.message)
      })
  } catch (error) {
    console.warn('[apex:ad-clicks] excepción al loguear click (no bloqueante):', error)
  }
}
