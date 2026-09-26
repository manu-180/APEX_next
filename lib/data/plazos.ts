// Módulo aparte y sin dependencias a propósito: lo importan el hero y otras
// secciones de cliente, y traer services.ts entero sumaba sus datos al JS
// inicial de la home.

/** Plazo estimado en días hábiles, desde que tenemos lo que aporta el cliente (términos, sección 7). */
export const PLAZO_DIAS_HABILES: Readonly<Record<string, number>> = {
  web_basic: 5,
  web_interactive: 10,
  web_premium: 15,
}

export function plazoPlan(id: string): number {
  const dias = PLAZO_DIAS_HABILES[id]
  if (dias == null) throw new Error(`Plan web sin plazo: ${id}`)
  return dias
}

const DIAS = Object.values(PLAZO_DIAS_HABILES)
export const PLAZO_MIN_DIAS = Math.min(...DIAS)
export const PLAZO_MAX_DIAS = Math.max(...DIAS)
