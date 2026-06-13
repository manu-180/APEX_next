import { cn } from '@/lib/utils/cn'

/**
 * Spinner temático — usa `currentColor`, así hereda el color del contexto
 * (botón, link, overlay). `animate-spin` de Tailwind; en `prefers-reduced-motion`
 * el navegador respeta la preferencia vía la media query global de globals.css.
 */
export function Spinner({
  className,
  label = 'Cargando',
}: {
  className?: string
  label?: string
}) {
  return (
    <svg
      className={cn('animate-spin', className)}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label={label}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        className="opacity-20"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
