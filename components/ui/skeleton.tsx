import { cn } from '@/lib/utils/cn'
import type { HTMLAttributes } from 'react'

/**
 * Placeholder de carga con barrido (`.skeleton` en globals.css).
 * Reserva el espacio para evitar layout shift (CLS) y da percepción de velocidad.
 * Decorativo: `aria-hidden`. En `prefers-reduced-motion` el barrido se desactiva.
 */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn('skeleton rounded-lg', className)}
      {...props}
    />
  )
}
