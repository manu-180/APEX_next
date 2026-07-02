'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { EASE_OUT, DELAY_AFTER_PANEL } from '@/lib/motion'
import {
  XIcon,
  SunIcon,
  MoonIcon,
  KeyboardIcon,
  ExternalLinkIcon,
} from '@/components/ui/icons'
import { ApexLogoMark } from '@/components/ui/apex-logo-mark'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'

type NavLinkItem = {
  href: string
  label: string
  external?: boolean
}

// Controles-icono del drawer: 44px (touch target), press feedback y
// focus-visible. Compartido por cerrar / tema / atajos.
const DRAWER_ICON_BTN = cn(
  'size-11 flex items-center justify-center rounded-lg outline-none',
  'transition-[background-color,transform] duration-200 ease-out active:scale-[0.92]',
  'hover:bg-[var(--color-surface-high)]',
  'focus-visible:ring-2 focus-visible:ring-[rgba(var(--color-primary-rgb),0.55)] focus-visible:ring-inset',
)

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
  links: ReadonlyArray<NavLinkItem>
  currentPath: string
  whatsappHref: string
  onToggleTheme: (e?: React.MouseEvent) => void
  onShowShortcuts: () => void
  resolvedTheme?: 'light' | 'dark'
  onlineCount?: number
}

export function MobileDrawer({
  open,
  onClose,
  links,
  currentPath,
  whatsappHref,
  onToggleTheme,
  onShowShortcuts,
  resolvedTheme,
  onlineCount,
}: MobileDrawerProps): JSX.Element {
  const shouldReduceMotion = useReducedMotion()
  const prevOverflow = useRef<string>('')
  const drawerRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  // Body scroll lock
  useEffect(() => {
    if (open) {
      prevOverflow.current = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = prevOverflow.current
    }
    return () => {
      document.body.style.overflow = prevOverflow.current
    }
  }, [open])

  // ESC to close + focus trap
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key !== 'Tab' || !drawerRef.current) return

      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  // Focus first element on open; restaurar el foco al disparador al cerrar.
  useEffect(() => {
    if (!open) return
    openerRef.current = (document.activeElement as HTMLElement) ?? null
    const node = drawerRef.current
    const first = node?.querySelector<HTMLElement>('a[href], button:not([disabled])')
    first?.focus()
    return () => {
      const opener = openerRef.current
      if (opener && document.contains(opener)) opener.focus()
    }
  }, [open])

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // Descartar con un arrastre deliberado (>40% del ancho) O un flick rápido.
      // Antes exigía ambos a la vez, así que un drag lento no cerraba.
      const dragFarEnough = info.offset.x > 120
      const flicked = info.offset.x > 56 && info.velocity.x > 320
      if (dragFarEnough || flicked) {
        onClose()
      }
    },
    [onClose]
  )

  const drawerMotion = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
    : { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' }, transition: { type: 'spring' as const, stiffness: 320, damping: 36 } }

  const isDark = resolvedTheme === 'dark'

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — scrim tintado (--scrim-bg, spec §5) para legibilidad del
              contenido detrás; el blur añade separación. */}
          <motion.div
            aria-hidden="true"
            className="fixed inset-0"
            style={{
              background: 'var(--scrim-bg)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 79,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: EASE_OUT }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-drawer-title"
            className="fixed top-0 right-0 flex flex-col shadow-[-2px_0_6px_rgba(var(--shadow-tint-rgb),0.05),-16px_0_48px_-12px_rgba(var(--shadow-tint-rgb),0.20)] dark:shadow-[-8px_0_48px_rgba(var(--shadow-tint-rgb),0.5),-12px_0_40px_-16px_rgba(var(--color-primary-rgb),0.15)]"
            style={{
              width: 'min(85vw, 360px)',
              height: '100dvh',
              background: 'var(--color-surface-low)',
              backdropFilter: 'blur(24px)',
              borderLeft: '1px solid var(--glass-border)',
              zIndex: 80,
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            {...drawerMotion}
          >
            {/* Decorativos (spec §4/§6): hairline gradient superior interior +
                grain bajo el contenido. El panel es stacking context (transform),
                así que -z-10 queda sobre el fondo y bajo los hijos estáticos. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(var(--color-primary-rgb),0.4)] to-transparent"
            />
            <span aria-hidden className="noise-overlay pointer-events-none absolute inset-0 -z-10" />

            {/* Header */}
            <div
              className="flex items-center justify-between flex-shrink-0"
              style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}
            >
              <div className="flex items-center gap-2.5">
                <ApexLogoMark />
                <span
                  id="mobile-drawer-title"
                  className="font-heading font-extrabold text-lg tracking-tight"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  APEX
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar menú"
                className={DRAWER_ICON_BTN}
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                <XIcon className="size-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto" style={{ padding: '1rem 1.25rem' }}>
              <ul className="flex flex-col gap-1">
                {links.map((link, index) => {
                  const isActive = currentPath === link.href
                  const linkClass = cn(
                    'flex items-center justify-between w-full min-h-[44px] font-heading font-semibold text-lg rounded-xl outline-none',
                    'transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.98]',
                    'focus-visible:ring-2 focus-visible:ring-[rgba(var(--color-primary-rgb),0.55)] focus-visible:ring-inset',
                    isActive
                      ? 'text-[var(--color-primary)] bg-primary-8'
                      : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-high)] hover:text-[var(--color-on-surface)]'
                  )
                  const linkStyle = { padding: '0.875rem 1rem' }

                  return (
                    <motion.li
                      key={link.href}
                      // Reveal firma (spec §2): blur one-shot en cascada tras el
                      // spring del panel. Reduced → fade simple sin blur ni y.
                      initial={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: 14, filter: 'blur(6px)' }
                      }
                      animate={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { opacity: 1, y: 0, filter: 'blur(0px)' }
                      }
                      transition={
                        shouldReduceMotion
                          ? { duration: 0.15 }
                          : {
                              delay: DELAY_AFTER_PANEL + 0.045 * index,
                              duration: 0.35,
                              ease: EASE_OUT,
                            }
                      }
                    >
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={linkClass}
                          style={linkStyle}
                          onClick={onClose}
                        >
                          <span className="flex items-center gap-2">
                            {isActive && <ActiveDot />}
                            {link.label}
                          </span>
                          <ExternalLinkIcon className="size-4 opacity-60" />
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className={linkClass}
                          style={linkStyle}
                          onClick={onClose}
                        >
                          <span className="flex items-center gap-2">
                            {isActive && <ActiveDot />}
                            {link.label}
                          </span>
                        </Link>
                      )}
                    </motion.li>
                  )
                })}
              </ul>
            </nav>

            {/* Action row */}
            <div
              className="flex items-center gap-2 flex-shrink-0"
              style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--glass-border)' }}
            >
              <button
                onClick={onToggleTheme}
                aria-label="Cambiar tema claro/oscuro"
                className={DRAWER_ICON_BTN}
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                {isDark ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
              </button>
              <div className="w-px h-5 flex-shrink-0" style={{ background: 'var(--glass-border)' }} />
              <button
                onClick={onShowShortcuts}
                aria-label="Ver atajos de teclado"
                className={DRAWER_ICON_BTN}
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                <KeyboardIcon className="size-5" />
              </button>
            </div>

            {/* Footer */}
            <div
              className="flex-shrink-0 flex flex-col gap-3"
              style={{
                padding: '1rem 1.25rem calc(1.5rem + env(safe-area-inset-bottom))',
                borderTop: '1px solid var(--glass-border)',
              }}
            >
              <WhatsAppOutboundLink
                waHref={whatsappHref}
                onClick={() => onClose()}
                className="btn-wa w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm text-center"
              >
                Hablemos
              </WhatsAppOutboundLink>

              {onlineCount !== undefined && (
                <div
                  className="flex items-center justify-center gap-1.5 text-xs font-medium"
                  style={{ color: 'var(--color-on-surface-variant)' }}
                >
                  <span
                    className="size-2 rounded-full animate-pulse flex-shrink-0"
                    style={{ background: 'var(--color-online)' }}
                  />
                  {onlineCount} online
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function ActiveDot() {
  return (
    <motion.span
      layoutId="mobile-drawer-active"
      className="size-1.5 rounded-full flex-shrink-0"
      style={{
        background: 'var(--color-primary)',
        boxShadow: '0 0 6px rgba(var(--color-primary-rgb), 0.6)',
      }}
    />
  )
}
