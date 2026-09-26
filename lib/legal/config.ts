// Apagado hasta confirmar que la RPC `consumidor_solicitud_crear` existe en
// producción (select en pg_proc). Mientras tanto las páginas ofrecen WhatsApp.
export const SOLICITUD_EN_LINEA = false

export type TipoSolicitud = 'arrepentimiento' | 'baja'
