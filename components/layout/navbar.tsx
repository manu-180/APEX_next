'use client'

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useTheme } from '@/components/providers/theme-mode-provider'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/lib/constants'
import { whatsappUrl, WA_MSG_NAV } from '@/lib/whatsapp'
import { SPRING_SNAP } from '@/lib/motion'
import { SunIcon, MoonIcon, KeyboardIcon, InspectorIcon, GalleryIcon, ArrowRightIcon } from '@/components/ui/icons'
import { ApexLogoMark } from '@/components/ui/apex-logo-mark'
import { MobileDrawer } from '@/components/layout/mobile-drawer'
const WHATSAPP_NAV_HREF = whatsappUrl(WA_MSG_NAV)

// Estilo base compartido de los controles-icono del navbar: superficie táctil,
// press feedback (active:scale) y focus-visible siempre visible. El tamaño
// (size-9 / size-11) lo decide cada botón según dónde se muestra (≥44px en mobile).
const ICON_BTN = cn(
  'flex items-center justify-center rounded-lg outline-none',
  'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-high)]',
  'transition-[color,background-color,transform] duration-200 ease-out active:scale-[0.92]',
  'focus-visible:ring-2 focus-visible:ring-[rgba(var(--color-primary-rgb),0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
)

const NAV_LINKS = [
  { href: ROUTES.home, label: 'Inicio', external: false },
  { href: ROUTES.servicios, label: 'Servicios', external: false },
  { href: ROUTES.tecnologias, label: 'Tecnologías', external: false },
  { href: ROUTES.about, label: 'Sobre Mí', external: false },
  { href: ROUTES.contact, label: 'Contacto', external: false },
] as const

interface NavbarProps {
  onToggleDarkMode: (e?: React.MouseEvent) => void
  onShowShortcuts: () => void
  inspectorActive?: boolean
  onToggleInspector?: () => void
  onlineCount?: number
}

type UnderlineMetrics = { left: number; width: number; top: number }

export function Navbar({
  onToggleDarkMode,
  onShowShortcuts,
  inspectorActive = false,
  onToggleInspector,
  onlineCount,
}: NavbarProps) {
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const shouldReduceMotion = useReducedMotion()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Magnetic hover del CTA Muestrario (spec §8.6): pull sutil ±3px vía
  // useMotionValue + useSpring — cero re-renders, desktop only (pointerType
  // mouse) y gated por reduced-motion. Único magnetic del chrome.
  const magnetX = useMotionValue(0)
  const magnetY = useMotionValue(0)
  const magnetSpringX = useSpring(magnetX, SPRING_SNAP)
  const magnetSpringY = useSpring(magnetY, SPRING_SNAP)

  const handleCtaMagnet = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (shouldReduceMotion || e.pointerType !== 'mouse') return
      const rect = e.currentTarget.getBoundingClientRect()
      const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
      const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
      magnetX.set(Math.max(-3, Math.min(3, relX * 3)))
      magnetY.set(Math.max(-3, Math.min(3, relY * 3)))
    },
    [shouldReduceMotion, magnetX, magnetY],
  )

  const resetCtaMagnet = useCallback(() => {
    magnetX.set(0)
    magnetY.set(0)
  }, [magnetX, magnetY])

  const navLinksRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<Partial<Record<string, HTMLElement>>>({})
  const [underline, setUnderline] = useState<UnderlineMetrics | null>(null)
  // Link bajo el cursor: la barra se desliza hacia él (hover) y vuelve al
  // activo al salir. Microinteracción causa→efecto, animada vía CSS
  // (.apex-nav-underline) — respeta reduced-motion sin lógica extra.
  const [hoveredHref, setHoveredHref] = useState<string | null>(null)

  const updateUnderline = useCallback(() => {
    const container = navLinksRef.current
    if (!container) return
    const targetHref =
      hoveredHref ?? NAV_LINKS.find((l) => !l.external && l.href === pathname)?.href
    if (!targetHref) {
      setUnderline(null)
      return
    }
    const link = linkRefs.current[targetHref]
    if (!link) {
      setUnderline(null)
      return
    }
    const cr = container.getBoundingClientRect()
    const lr = link.getBoundingClientRect()
    const insetX = 8
    setUnderline({
      left: lr.left - cr.left + insetX,
      width: Math.max(0, lr.width - insetX * 2),
      top: lr.bottom - cr.top + 2,
    })
  }, [pathname, hoveredHref])

  useLayoutEffect(() => {
    updateUnderline()
  }, [updateUnderline])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Glass reactivo al scroll: una vez desplazado, el nav gana sombra/elevación.
  // rAF-throttled + passive para no bloquear el hilo de scroll.
  useEffect(() => {
    if (typeof window === 'undefined') return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 8))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    const el = navLinksRef.current
    if (!el) return
    const ro = new ResizeObserver(() => updateUnderline())
    ro.observe(el)
    window.addEventListener('resize', updateUnderline)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', updateUnderline)
    }
  }, [updateUnderline])

  useEffect(() => {
    if (typeof document === 'undefined' || !document.fonts?.ready) return
    void document.fonts.ready.then(() => updateUnderline())
  }, [updateUnderline])

  return (
    <nav
      className="fixed top-0 left-0 right-0"
      style={{ zIndex: 'var(--z-sticky)' } as React.CSSProperties}
    >
      {/* Wrapper del morph (spec §4/§5): al scrollear gana padding y la barra
          edge-to-edge se convierte en cápsula glass flotante. El px usa
          max(gutter, (100vw − 72rem)/2) para que el pill quede centrado a
          max-w-6xl sin transicionar max-width (no interpolable desde none). */}
      <div
        className={cn(
          'w-full transition-[padding] duration-500 ease-out',
          scrolled &&
            'px-[max(0.75rem,calc((100vw-72rem)/2))] pt-[calc(0.5rem+env(safe-area-inset-top,0px))] sm:px-[max(1.5rem,calc((100vw-72rem)/2))] sm:pt-[calc(0.75rem+env(safe-area-inset-top,0px))]',
        )}
      >
        <div
          className={cn(
            'relative w-full transition-[border-radius,box-shadow,border-color,background-color,padding] duration-500 ease-out',
            scrolled ? 'rounded-2xl' : 'pt-[env(safe-area-inset-top,0px)]',
          )}
          style={{
            backgroundColor: 'var(--nav-bg)',
            backdropFilter: 'blur(16px) saturate(140%)',
            WebkitBackdropFilter: 'blur(16px) saturate(140%)',
            // Siempre 1px de borde (sin salto de layout); solo cambia el color.
            border: scrolled
              ? '1px solid rgba(var(--color-primary-rgb), 0.18)'
              : '1px solid transparent',
            borderBottom: scrolled
              ? '1px solid rgba(var(--color-primary-rgb), 0.18)'
              : '1px solid var(--glass-border)',
            // Cápsula: hairline interior superior (glass v2) + drop tintada
            // con --shadow-tint-rgb + halo primario sutil (spec §4/§5).
            boxShadow: scrolled
              ? 'inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 28px -16px rgba(var(--shadow-tint-rgb), 0.5), 0 4px 20px -8px rgba(var(--color-primary-rgb), 0.12)'
              : 'inset 0 0 0 0 rgba(255,255,255,0), 0 0 0 0 rgba(var(--shadow-tint-rgb), 0), 0 0 0 0 rgba(var(--color-primary-rgb), 0)',
          }}
        >
        {/* Grain del glass (spec §6) — bajo el contenido, hereda el radio del pill */}
        <span aria-hidden className="noise-overlay pointer-events-none absolute inset-0 -z-10 rounded-[inherit]" />
        <div className="mx-auto flex h-14 w-full min-w-0 max-w-6xl flex-row items-center justify-between gap-2 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:pl-[max(1.5rem,env(safe-area-inset-left,0px))] sm:pr-[max(1.5rem,env(safe-area-inset-right,0px))] md:h-16">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3 group"
          prefetch={false}
        >
          <ApexLogoMark priority />
          <span className="hidden sm:block font-heading text-lg font-extrabold text-[var(--color-on-surface)] transition-colors duration-200 group-hover:text-[var(--color-primary)]">
            APEX
          </span>
        </Link>

        <div
          ref={navLinksRef}
          className="relative hidden md:flex items-center gap-1"
          onMouseLeave={() => setHoveredHref(null)}
        >
          {NAV_LINKS.map((link) => {
            const active = !link.external && pathname === link.href
            const navClass = cn(
              'relative px-4 py-2 text-sm font-medium rounded-lg outline-none',
              'transition-[color,background-color,transform] duration-200 ease-out active:scale-[0.97]',
              'focus-visible:ring-2 focus-visible:ring-[rgba(var(--color-primary-rgb),0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
              active
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[rgba(var(--color-primary-rgb),0.06)]',
            )
            if (link.external) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={navClass}
                  onMouseEnter={() => setHoveredHref(link.href)}
                  onFocus={() => setHoveredHref(link.href)}
                  onBlur={() => setHoveredHref(null)}
                >
                  {link.label}
                </a>
              )
            }
            return (
              <Link
                key={link.href}
                ref={(el) => {
                  if (el) linkRefs.current[link.href] = el
                  else delete linkRefs.current[link.href]
                }}
                href={link.href}
                prefetch={false}
                className={navClass}
                aria-current={active ? 'page' : undefined}
                onMouseEnter={() => setHoveredHref(link.href)}
                onFocus={() => setHoveredHref(link.href)}
                onBlur={() => setHoveredHref(null)}
              >
                {link.label}
              </Link>
            )
          })}
          {underline !== null && underline.width > 0 && (
            <span
              aria-hidden
              className="pointer-events-none absolute left-0 h-[2px] rounded-full apex-nav-underline"
              style={{
                top: underline.top,
                left: underline.left,
                width: underline.width,
                backgroundColor: 'var(--color-primary)',
                // Activo: barra plena. Preview por hover de un link no activo:
                // levemente atenuada para señalar "destino" sin confundir con el estado.
                opacity: hoveredHref && hoveredHref !== pathname ? 0.6 : 1,
                boxShadow: '0 0 12px rgba(var(--color-primary-rgb), 0.6)',
                transition:
                  'left 0.32s cubic-bezier(0.22,1,0.36,1), width 0.32s cubic-bezier(0.22,1,0.36,1), opacity 0.2s ease-out',
              }}
            />
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-2 md:w-auto md:flex-none md:justify-start">
          {typeof onlineCount === 'number' && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-8 text-xs text-[var(--color-on-surface-variant)] tabular-nums">
              <span className="size-2 rounded-full bg-[var(--color-online)] animate-pulse" />
              {onlineCount} online
            </div>
          )}

          <button
            onClick={(e) => onToggleDarkMode(e)}
            className={cn(ICON_BTN, 'size-11 md:size-9')}
            aria-label="Toggle tema claro/oscuro"
          >
            {!mounted ? (
              <span className="block size-4" aria-hidden />
            ) : resolvedTheme === 'dark' ? (
              <SunIcon className="size-4" />
            ) : (
              <MoonIcon className="size-4" />
            )}
          </button>

          {onToggleInspector && (
            <button
              type="button"
              onClick={onToggleInspector}
              className={cn(
                ICON_BTN,
                'size-11 md:size-9',
                inspectorActive &&
                  'text-[var(--color-primary)] bg-[rgba(var(--color-primary-rgb),0.12)] ring-1 ring-[rgba(var(--color-primary-rgb),0.35)] hover:text-[var(--color-primary)] hover:bg-[rgba(var(--color-primary-rgb),0.12)]'
              )}
              aria-label={inspectorActive ? 'Desactivar modo inspector' : 'Activar modo inspector'}
              aria-pressed={inspectorActive}
              title={inspectorActive ? 'Cerrar inspector (Ctrl+I)' : 'Modo inspector (Ctrl+I)'}
            >
              <InspectorIcon className="size-4" />
            </button>
          )}

          <button
            onClick={onShowShortcuts}
            className={cn(ICON_BTN, 'hidden md:flex size-9')}
            aria-label="Atajos de teclado"
          >
            <KeyboardIcon className="size-4" />
          </button>

          {/* Wrapper magnético: mueve el CTA completo sin pisar los transforms
              propios del Link (active:scale). El Link conserva hover/focus. */}
          <motion.span
            className="hidden md:inline-flex"
            style={{ x: magnetSpringX, y: magnetSpringY }}
            onPointerMove={handleCtaMagnet}
            onPointerLeave={resetCtaMagnet}
          >
          <Link
            href={ROUTES.muestrario}
            prefetch={false}
            aria-label="Ver muestrario de proyectos"
            className={cn(
              'group/cta relative inline-flex items-center justify-center gap-2 overflow-hidden',
              'h-9 pl-3.5 pr-3 rounded-xl font-heading text-sm font-semibold tracking-tight',
              'text-[var(--color-on-primary)]',
              'transition-[transform,box-shadow] duration-300 ease-out active:scale-[0.97]',
              'shadow-[0_2px_10px_-2px_rgba(var(--color-primary-rgb),0.5),inset_0_1px_0_rgba(255,255,255,0.22)]',
              'hover:shadow-[0_8px_24px_-6px_rgba(var(--color-primary-rgb),0.7),inset_0_1px_0_rgba(255,255,255,0.28)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(var(--color-primary-rgb),0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
            )}
            style={{
              backgroundImage:
                'linear-gradient(135deg, var(--color-primary) 0%, rgba(var(--color-primary-rgb),0.84) 55%, rgba(var(--color-primary-rgb),0.92) 100%)',
            }}
          >
            {/* Sheen: barrido de luz que cruza al hover — señal premium, oculto en reduced-motion */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-3/4 w-2/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover/cta:translate-x-[280%] motion-reduce:hidden"
            />
            <GalleryIcon className="relative size-4 transition-transform duration-300 ease-out group-hover/cta:-rotate-6 group-hover/cta:scale-110" />
            <span className="relative">Muestrario</span>
            <ArrowRightIcon
              aria-hidden
              className="relative size-3.5 opacity-70 transition-[transform,opacity] duration-300 ease-out group-hover/cta:translate-x-0.5 group-hover/cta:opacity-100"
            />
          </Link>
          </motion.span>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(ICON_BTN, 'flex md:hidden size-11')}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
            aria-haspopup="dialog"
          >
            {/* Hamburger morph: 2 líneas que colapsan al centro y rotan ±45°
                (transform-only, spring 380/26). Reduced-motion → cross corto. */}
            <span aria-hidden className="relative block size-5">
              <motion.span
                className="absolute left-0 top-1/2 -mt-px block h-0.5 w-5 rounded-full bg-current"
                initial={false}
                animate={mobileOpen ? { y: 0, rotate: 45 } : { y: -3.5, rotate: 0 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0.12 }
                    : { type: 'spring' as const, stiffness: 380, damping: 26 }
                }
              />
              <motion.span
                className="absolute left-0 top-1/2 -mt-px block h-0.5 w-5 rounded-full bg-current"
                initial={false}
                animate={mobileOpen ? { y: 0, rotate: -45 } : { y: 3.5, rotate: 0 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0.12 }
                    : { type: 'spring' as const, stiffness: 380, damping: 26 }
                }
              />
            </span>
          </button>
        </div>
        </div>
        </div>
      </div>

      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={NAV_LINKS}
        currentPath={pathname}
        whatsappHref={WHATSAPP_NAV_HREF}
        onToggleTheme={onToggleDarkMode}
        onShowShortcuts={onShowShortcuts}
        resolvedTheme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        onlineCount={onlineCount}
      />
    </nav>
  )
}
