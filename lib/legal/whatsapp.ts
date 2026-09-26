import type { TipoSolicitud } from './config'

export interface DatosParaMensaje {
  nombre: string
  canal: 'whatsapp' | 'mail'
  contacto: string
  referencia: string
  detalle: string
}

export function mensajeWhatsApp(tipo: TipoSolicitud, d?: DatosParaMensaje): string {
  const pedido =
    tipo === 'arrepentimiento'
      ? 'Hola, me arrepiento de mi contratación con APEX.'
      : 'Hola, quiero dar de baja un servicio de APEX.'
  if (!d) return pedido
  const lineas = [pedido, `Soy ${d.nombre.trim()}.`]
  if (d.referencia.trim()) lineas.push(`Contraté: ${d.referencia.trim()}.`)
  if (d.detalle.trim()) lineas.push(d.detalle.trim())
  if (d.canal === 'mail' && d.contacto.trim()) lineas.push(`Mi mail: ${d.contacto.trim()}`)
  return lineas.join('\n')
}
