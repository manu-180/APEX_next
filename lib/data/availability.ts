/**
 * Disponibilidad real — slots aceptados por mes.
 *
 * Cambialo a mano cuando se llene la agenda; aparece en el hero como
 * mecanismo de scarcity verdadero ("Tomo X proyectos en junio").
 *
 * Si `slotsLeft <= 0`, el componente muestra "Lista de espera" en vez del
 * count. Si `month` no coincide con el mes actual, se cae a un texto
 * genérico de "Disponible para proyectos" para no quedar desactualizado.
 */
export interface AvailabilitySlot {
  /** Número del mes (1-12) al que aplica. */
  month: number
  /** Año al que aplica. */
  year: number
  /** Cantidad de proyectos que tomás este mes. */
  slotsLeft: number
}

/**
 * Slot actual. Cuando arranca un mes nuevo, actualizá month/year/slotsLeft.
 *
 * Idea: mantener bajo (1-3) para credibilidad. Si "tomás 8 proyectos" parece
 * agencia genérica. Si "tomás 1" es freelance premium con cola.
 */
export const CURRENT_AVAILABILITY: AvailabilitySlot = {
  month: 6, // junio
  year: 2026,
  slotsLeft: 2,
}

const MONTH_NAMES_ES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
] as const

/** Devuelve el texto que debe mostrar el badge de hero según la disponibilidad. */
export function getAvailabilityText(now: Date = new Date()): {
  text: string
  variant: 'available' | 'scarce' | 'waitlist' | 'generic'
} {
  const slot = CURRENT_AVAILABILITY
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()
  const monthName = MONTH_NAMES_ES[slot.month - 1] ?? 'este mes'

  // Si el slot quedó desactualizado, fallback genérico
  if (slot.year !== currentYear || slot.month < currentMonth) {
    return { text: 'Disponible para proyectos', variant: 'generic' }
  }

  if (slot.slotsLeft <= 0) {
    return { text: 'Lista de espera abierta', variant: 'waitlist' }
  }

  if (slot.slotsLeft === 1) {
    return { text: `Último slot de ${monthName}`, variant: 'scarce' }
  }

  return {
    text: `Tomo ${slot.slotsLeft} proyectos en ${monthName}`,
    variant: 'available',
  }
}
