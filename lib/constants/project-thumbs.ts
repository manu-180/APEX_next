import type { ThemeId } from '@/lib/types/theme'

/**
 * Miniaturas por proyecto (`public/projects/…`).
 * Si falta entrada, las cards usan el icono SVG del proyecto (p. ej. Contact Engine).
 */
export const PROJECT_THUMB_SRC: Partial<Record<ThemeId, string>> = {
  botlode: '/projects/botlode.png',
  assistify: '/projects/assistify.png',
}
