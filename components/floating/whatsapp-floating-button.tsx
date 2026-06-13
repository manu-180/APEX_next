'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { whatsappUrl, WA_MSG_NAV } from '@/lib/whatsapp'
import { openWhatsAppWithThankYouPage } from '@/lib/whatsapp-navigate'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils/cn'

/**
 * Botón flotante de WhatsApp — estilo premium/tech alineado con el branding
 * APEX: glass dark, accent del color primary del tema, icono WhatsApp
 * encapsulado en mini-avatar verde (mantiene reconocimiento sin gritar),
 * status dot "online", label en tipografía heading.
 *
 * Oculto en /contacto y /gracias (canal ya disponible / ya convirtió).
 * Trackea conversión Google Ads + Meta Lead al click.
 */
export function WhatsAppFloatingButton() {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState(false)

  const isExpanded = !scrolled || hovered

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    let raf = 0
    const handler = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 320))
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => {
      window.removeEventListener('scroll', handler)
      cancelAnimationFrame(raf)
    }
  }, [])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      openWhatsAppWithThankYouPage(whatsappUrl(WA_MSG_NAV), router)
    },
    [router],
  )

  const hide = pathname === ROUTES.contact || pathname === ROUTES.gracias

  if (!mounted || hide) return null

  return (
    <div
      className={cn(
        'fixed z-[60] pointer-events-none overflow-visible',
        'right-[max(1.5rem,calc(env(safe-area-inset-right)+0.5rem))]',
        'bottom-[max(1.5rem,calc(env(safe-area-inset-bottom)+1rem))]',
      )}
    >
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Abrir WhatsApp con Manuel"
        className={cn(
          'wa-float-pill pointer-events-auto group relative inline-flex items-center',
          'rounded-full',
          'min-h-[3.5rem]',
          'transition-all duration-300 ease-out',
          'hover:scale-[1.02] active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
          isExpanded ? 'p-2 sm:pl-2 sm:pr-5 sm:py-2 sm:gap-3' : 'p-2 gap-0 overflow-hidden',
        )}
      >
        {/* Glow pulse sutil — usa color del tema, no verde clásico */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full opacity-60 pointer-events-none motion-safe:animate-[apex-wa-glow_3.6s_ease-in-out_infinite]"
          style={{
            background:
              'radial-gradient(circle at 30% 50%, rgba(var(--color-primary-rgb), 0.18) 0%, transparent 70%)',
          }}
        />

        {/* Top accent line — detalle editorial */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 h-px rounded-full opacity-70"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.55), transparent)',
          }}
        />

        {/* Mini avatar circular verde con icono WhatsApp + status dot online */}
        <span
          aria-hidden
          className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-full"
          style={{
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            boxShadow:
              '0 4px 14px -4px rgba(37, 211, 102, 0.55), 0 0 0 1px rgba(255,255,255,0.08) inset',
          }}
        >
          <svg
            viewBox="0 0 32 32"
            className="relative size-5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]"
            fill="currentColor"
          >
            <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977.917 2.78.93 1.6 2.323 3.156 3.97 4.156.747.456 2.5 1.39 3.504 1.39 1.21 0 1.99-.93 1.99-1.748 0-.157-.043-.286-.073-.443-.115-.5-1.04-.7-1.7-.9z" />
            <path d="M16 0C7.156 0 0 7.155 0 16c0 2.985.83 5.79 2.265 8.193L.024 31.999l8.193-2.265A15.93 15.93 0 0 0 16 32c8.844 0 16-7.156 16-16S24.844 0 16 0zm0 29.234a13.36 13.36 0 0 1-6.93-1.93l-.5-.297-5.07 1.404 1.404-5.07-.298-.5A13.193 13.193 0 0 1 2.766 16C2.766 8.69 8.69 2.766 16 2.766S29.234 8.69 29.234 16 23.31 29.234 16 29.234z" />
          </svg>

          {/* Status dot — online indicator */}
          <span
            aria-hidden
            className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full motion-safe:animate-[apex-wa-pulse_2.4s_ease-in-out_infinite]"
            style={{
              background: '#22c55e',
              boxShadow:
                '0 0 0 2px var(--wa-pill-ring), 0 0 10px rgba(34,197,94,0.65)',
            }}
          />
        </span>

        {/* Label "Hablemos" — tipografía heading premium */}
        <span
          className={cn(
            'relative flex flex-col items-start overflow-hidden transition-[max-width,opacity] duration-300 ease-out',
            'hidden sm:flex',
            isExpanded ? 'max-w-[12rem] opacity-100' : 'max-w-0 opacity-0',
          )}
        >
          <span
            className="font-heading text-[10px] uppercase tracking-[0.18em] leading-none mb-0.5"
            style={{ color: 'var(--wa-pill-label)' }}
          >
            En línea
          </span>
          <span className="font-heading text-base font-extrabold leading-tight tracking-tight whitespace-nowrap text-current">
            Hablemos
          </span>
        </span>

        {/* Arrow accent — color del tema */}
        <span
          aria-hidden
          className={cn(
            'relative ml-1 hidden sm:inline-flex transition-transform duration-300 ease-out group-hover:translate-x-0.5',
            isExpanded ? 'opacity-100' : 'max-w-0 opacity-0 ml-0',
          )}
          style={{ color: 'var(--color-primary)' }}
        >
          <svg
            viewBox="0 0 16 16"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </span>
      </button>

      <style jsx>{`
        @keyframes apex-wa-glow {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(1);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.04);
          }
        }
        @keyframes apex-wa-pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.75;
            transform: scale(1.18);
          }
        }
      `}</style>
    </div>
  )
}
