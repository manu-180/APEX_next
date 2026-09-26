// Formulario contra la RPC consumidor_solicitud_crear (verificada en producción
// el 2026-09-26). Si la RPC se da de baja, poner en false: las páginas vuelven a
// ofrecer WhatsApp y nadie ve un formulario que no guarda.
export const SOLICITUD_EN_LINEA = true

export type TipoSolicitud = 'arrepentimiento' | 'baja'
