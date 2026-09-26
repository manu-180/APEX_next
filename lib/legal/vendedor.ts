/**
 * Titular que publican los términos (sección 1). El resto de la identificación
 * fiscal no se escribe en el código: sale del entorno, y si falta un solo dato
 * la línea no se muestra.
 */
const TITULAR = 'Manuel Navarro Risaro'

export interface DatosFiscales {
  titular: string
  cuit: string
  condicionIva: string
  domicilio: string
  mail: string
}

function limpio(valor: string | undefined): string | null {
  const v = valor?.trim()
  return v ? v : null
}

export function mailDeContacto(): string | null {
  return limpio(process.env.NEXT_PUBLIC_APEX_MAIL)
}

export function datosFiscales(): DatosFiscales | null {
  const cuit = limpio(process.env.NEXT_PUBLIC_APEX_CUIT)
  const condicionIva = limpio(process.env.NEXT_PUBLIC_APEX_CONDICION_IVA)
  const domicilio = limpio(process.env.NEXT_PUBLIC_APEX_DOMICILIO)
  const mail = mailDeContacto()
  if (!cuit || !condicionIva || !domicilio || !mail) return null
  return { titular: TITULAR, cuit, condicionIva, domicilio, mail }
}
