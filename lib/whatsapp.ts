import { WHATSAPP_NUMBER } from '@/lib/constants'

/** Quita pictogramas emoji y secuencias típicas (ZWJ, tonos de piel) para mensajes solo texto. */
function stripEmojis(text: string): string {
  return text
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[\u{1F3FB}-\u{1F3FF}]/gu, '')
    .replace(/\uFE0F/g, '')
    .replace(/\u200D/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/ +/g, ' ')
}

/** URL de WhatsApp con texto prellenado (UTF-8). Siempre sin emojis. */
export function whatsappUrl(message: string): string {
  const clean = stripEmojis(message).trim()
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(clean)}`
}

/**
 * CTAs generales (navbar, hero, contacto, pie, atajos). Breve, sin emoji.
 * Los mensajes contextualizados van en waMsgPlan / waMsgEstimator.
 */
export const WA_MSG_GENERIC = `Hola, quiero potenciarme con tecnología. ¿Charlamos?`

/** Navbar “Hablemos”, hero, contacto, atajo Ctrl+Shift+H */
export const WA_MSG_NAV = WA_MSG_GENERIC

/** Página Sobre mí — CTA final */
export const WA_MSG_ABOUT = `Hola, quiero potenciarme con tecnología. ¿Agendamos una reunión?`

/** Pie — link “WhatsApp” */
export const WA_MSG_FOOTER_LINK = WA_MSG_GENERIC

export function waMsgPlan(planName: string): string {
  return `Hola, consulto por el plan «${planName}» desde tu web. ¿Me orientás con los próximos pasos?`
}

/** Estimador: lista de módulos incluidos + total */
export function waMsgEstimator(params: {
  kind: 'web' | 'mobile'
  moduleLabels: string[]
  totalFormatted: string
}): string {
  const tipo = params.kind === 'web' ? 'Sitio web' : 'App móvil'
  const list =
    params.moduleLabels.length > 0
      ? params.moduleLabels.map((l) => `• ${l}`).join('\n')
      : '• (solo base)'
  return `Hola, usé el estimador de tu web (${tipo}).\n${list}\nTotal referencia: ${params.totalFormatted}\n¿Lo revisamos juntos?`
}
