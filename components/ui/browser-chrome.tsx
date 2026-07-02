import { Lock, LockOpen } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

/**
 * Barra de navegador (browser chrome) — fuente ÚNICA del patrón.
 * Unifica las tres implementaciones locales que divergían
 * (trusted-clients, servicios-showcase, muestrario/preview-card):
 * 3 puntos de ventana + pill de URL con candado que se "abre" en hover.
 *
 * Casos cubiertos:
 * - showDots (default): layout de navegador clásico, pill flexible.
 * - showDots={false}: pill centrada (patrón del featured client de la home).
 * - isHovered: cross-fade Lock → LockOpen (pasar el hover del card contenedor).
 */
interface BrowserChromeProps {
  domain: string
  /** Muestra los 3 puntos de ventana (default: true). */
  showDots?: boolean
  /** Hover del card contenedor: el candado se abre (Lock → LockOpen). */
  isHovered?: boolean
  className?: string
}

export function BrowserChrome({
  domain,
  showDots = true,
  isHovered = false,
  className,
}: BrowserChromeProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 border-b px-3 py-2',
        !showDots && 'justify-center',
        className,
      )}
      style={{
        borderColor: 'rgba(var(--color-primary-rgb),0.12)',
        background: 'rgba(var(--color-primary-rgb),0.04)',
      }}
    >
      {showDots && (
        <span aria-hidden className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-2.5 rounded-full"
              style={{ background: 'rgba(var(--color-on-surface-variant-rgb),0.35)' }}
            />
          ))}
        </span>
      )}

      <span
        className={cn(
          'flex min-w-0 items-center gap-1.5 truncate rounded-md px-2.5 py-1 text-[11px] font-medium text-[var(--color-on-surface-variant)]',
          showDots ? 'ml-1 flex-1' : 'max-w-[85%] justify-center',
        )}
        style={{ background: 'rgba(var(--color-primary-rgb),0.07)' }}
      >
        {/* Candado HTTPS (verde de seguridad, patrón heredado del featured client) */}
        <span className="relative size-3 shrink-0" aria-hidden="true">
          <Lock
            className={cn(
              'absolute inset-0 size-3 text-emerald-500/70 transition-opacity duration-300',
              isHovered ? 'opacity-0' : 'opacity-100',
            )}
            strokeWidth={2.5}
          />
          <LockOpen
            className={cn(
              'absolute inset-0 size-3 text-emerald-500 transition-opacity duration-300',
              isHovered ? 'opacity-100' : 'opacity-0',
            )}
            strokeWidth={2.5}
          />
        </span>
        <span className="truncate tracking-wide">{domain}</span>
      </span>
    </div>
  )
}
