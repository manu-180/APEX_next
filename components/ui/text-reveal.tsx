import { cn } from '@/lib/utils/cn'

interface TextRevealProps {
  text: string
  className?: string
  /** Sin uso: se mantiene la API para no romper consumidores. */
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

/**
 * Server component — emite HTML estático listo para pintar.
 *
 * Decisión deliberada: NO hay animación de entrada con opacity:0.
 * El navegador necesita que el heading sea visible en el primer paint para
 * contarlo como LCP. Una entrada animada (incluso con CSS) retrasa el LCP
 * porque la métrica busca el momento en que el elemento más grande es
 * visualmente estable.
 *
 * Si querés animar el heading, hacelo con transform/clip-path sin tocar
 * opacity inicial.
 */
export function TextReveal({ text, className, as: Tag = 'span' }: TextRevealProps) {
  return <Tag className={cn('inline-block', className)}>{text}</Tag>
}
