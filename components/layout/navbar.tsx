'use client'

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/components/providers/theme-mode-provider'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/lib/constants'
import { whatsappUrl, WA_MSG_NAV } from '@/lib/whatsapp'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { MenuIcon, XIcon, SunIcon, MoonIcon, KeyboardIcon, InspectorIcon } from '@/components/ui/icons'
import { ApexLogoMark } from '@/components/ui/apex-logo-mark'
import { MobileDrawer } from '@/components/layout/mobile-drawer'
const WHATSAPP_NAV_HREF = whatsappUrl(WA_MSG_NAV)

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
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const navLinksRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<Partial<Record<string, HTMLElement>>>({})
  const [underline, setUnderline] = useState<UnderlineMetrics | null>(null)

  const updateUnderline = useCallback(() => {
    const container = navLinksRef.current
    if (!container) return
    const active = NAV_LINKS.find((l) => !l.external && l.href === pathname)
    if (!active) {
      setUnderline(null)
      return
    }
    const link = linkRefs.current[active.href]
    if (!link) return
    const cr = container.getBoundingClientRect()
    const lr = link.getBoundingClientRect()
    const insetX = 8
    setUnderline({
      left: lr.left - cr.left + insetX,
      width: Math.max(0, lr.width - insetX * 2),
      top: lr.bottom - cr.top + 2,
    })
  }, [pathname])

  useLayoutEffect(() => {
    updateUnderline()
  }, [updateUnderline])

  useEffect(() => {
    setMounted(true)
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
      <div
        className="w-full pt-[env(safe-area-inset-top,0px)]"
        style={{
          backgroundColor: 'var(--color-surface-low)',
          borderBottom: '1px solid var(--glass-border)',
        }}
      >
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

        <div ref={navLinksRef} className="relative hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = !link.external && pathname === link.href
            const navClass = cn(
              'relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg',
              active
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]',
            )
            if (link.external) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={navClass}
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
                boxShadow: '0 0 12px rgba(var(--color-primary-rgb), 0.6)',
              }}
            />
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-2 md:w-auto md:flex-none md:justify-start">
          {typeof onlineCount === 'number' && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-surface-high)]/50 text-xs text-[var(--color-on-surface-variant)] tabular-nums">
              <span className="size-2 rounded-full bg-[var(--color-online)] animate-pulse" />
              {onlineCount} online
            </div>
          )}

          <button
            onClick={(e) => onToggleDarkMode(e)}
            className="flex size-9 items-center justify-center rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-high)] transition-colors duration-200"
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
                'flex size-9 items-center justify-center rounded-lg transition-colors duration-200',
                inspectorActive
                  ? 'text-[var(--color-primary)] bg-[rgba(var(--color-primary-rgb),0.12)] ring-1 ring-[rgba(var(--color-primary-rgb),0.35)]'
                  : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-high)]'
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
            className="hidden md:flex size-9 items-center justify-center rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-high)] transition-colors duration-200"
            aria-label="Atajos de teclado"
          >
            <KeyboardIcon className="size-4" />
          </button>

          <WhatsAppOutboundLink
            waHref={WHATSAPP_NAV_HREF}
            className={cn(
              'hidden md:inline-flex items-center justify-center gap-2 font-semibold',
              'transition-all duration-200 ease-out',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
              'btn-tech btn-outline-tech text-[var(--color-primary)] active:scale-[0.97]',
              'h-9 px-4 text-sm rounded-xl'
            )}
          >
            Hablemos
          </WhatsAppOutboundLink>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex md:hidden size-9 items-center justify-center rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-high)] transition-colors duration-200"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
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
