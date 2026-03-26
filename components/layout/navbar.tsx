'use client'

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/lib/constants'
import { whatsappUrl, WA_MSG_NAV } from '@/lib/whatsapp'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { MenuIcon, XIcon, SunIcon, MoonIcon, KeyboardIcon, InspectorIcon } from '@/components/ui/icons'
import { ApexLogoMark } from '@/components/ui/apex-logo-mark'
const WHATSAPP_NAV_HREF = whatsappUrl(WA_MSG_NAV)

const NAV_LINKS = [
  { href: ROUTES.home, label: 'Inicio', external: false },
  { href: ROUTES.servicios, label: 'Servicios', external: false },
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
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6"
        style={{
          backgroundColor: 'var(--nav-bg)',
          backdropFilter: 'blur(24px) saturate(150%)',
          WebkitBackdropFilter: 'blur(24px) saturate(150%)',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 font-bold text-lg tracking-tight text-[var(--color-on-surface)]"
          data-hover
          data-inspector-title="Logo con Glow Dinámico"
          data-inspector-desc="El logotipo circular y el texto 'APEX' con glow usan el tema activo: el anillo sutil alrededor del logo toma el color primario vía CSS Custom Properties."
          data-inspector-cat="Tema Dinámico"
        >
          <ApexLogoMark priority />
          <span className="hidden sm:block glow-text">APEX</span>
        </Link>

        {/* Desktop links — subrayado único: solo anima X/ancho (evita salto vertical tras scroll con layoutId) */}
        <div ref={navLinksRef} className="relative hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = !link.external && pathname === link.href
            const navClass = cn(
              'relative z-[1] px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg',
              active
                ? 'text-[var(--color-primary)] glow-text'
                : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]',
            )
            if (link.external) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-hover
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
                data-hover
                data-inspector-title="Nav Link con Underline Spring"
                data-inspector-desc="El subrayado que se mueve entre links usa layoutId de Framer Motion — es un único elemento DOM que 'salta' de posición a posición con física de resorte. Esto da la ilusión de que se desliza, pero técnicamente es una sola barra que anima su posición X y su ancho."
                data-inspector-cat="Motion · Spring"
                className={navClass}
              >
                {link.label}
              </Link>
            )
          })}
          {underline !== null && underline.width > 0 && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-0 z-0 h-[2px] rounded-full"
              style={{
                top: underline.top,
                backgroundColor: 'var(--color-primary)',
                boxShadow: '0 0 12px rgba(var(--color-primary-rgb), 0.6)',
              }}
              initial={false}
              animate={{ left: underline.left, width: underline.width }}
              transition={{ type: 'spring', stiffness: 480, damping: 38 }}
            />
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {typeof onlineCount === 'number' && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-surface-high)]/50 text-xs text-[var(--color-on-surface-variant)]">
              <span className="h-2 w-2 rounded-full bg-[var(--color-online)] animate-pulse" />
              {onlineCount} online
            </div>
          )}

          <button
            onClick={(e) => onToggleDarkMode(e)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-high)] transition-all duration-200"
            aria-label="Toggle tema"
            data-hover
            data-inspector-title="Toggle Claro/Oscuro con Ola"
            data-inspector-desc="Al hacer click aquí, una ola circular nace exactamente desde la posición de tu click y se expande por toda la pantalla usando clip-path animado en CSS. El punto de origen se pasa como variable CSS desde JavaScript — el navegador hace el resto en la GPU sin bloquear el hilo principal."
            data-inspector-cat="CSS · Ambiance"
          >
            {!mounted ? (
              <span className="block h-4 w-4" aria-hidden />
            ) : resolvedTheme === 'dark' ? (
              <SunIcon className="h-4 w-4" />
            ) : (
              <MoonIcon className="h-4 w-4" />
            )}
          </button>

          {onToggleInspector && (
            <button
              type="button"
              onClick={onToggleInspector}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200',
                inspectorActive
                  ? 'text-[var(--color-primary)] bg-[rgba(var(--color-primary-rgb),0.12)] ring-1 ring-[rgba(var(--color-primary-rgb),0.35)]'
                  : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-high)]'
              )}
              aria-label={inspectorActive ? 'Desactivar modo inspector' : 'Activar modo inspector'}
              aria-pressed={inspectorActive}
              title={inspectorActive ? 'Cerrar inspector (Ctrl+I)' : 'Modo inspector (Ctrl+I)'}
            >
              <InspectorIcon className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={onShowShortcuts}
            className="hidden md:flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-high)] transition-all duration-200"
            aria-label="Atajos de teclado"
            data-hover
            data-inspector-title="Centro de Atajos de Teclado"
            data-inspector-desc="Esta web tiene un sistema completo de atajos: Ctrl+I activa este inspector, Ctrl+Y alterna claro/oscuro, Ctrl+Shift+H abre WhatsApp, Ctrl+R resetea el tema, Ctrl+K o Ctrl+? abren el panel de atajos. Todo sin mouse, accesible para usuarios que navegan exclusivamente con teclado."
            data-inspector-cat="UX · Accesibilidad"
          >
            <KeyboardIcon className="h-4 w-4" />
          </button>

          <WhatsAppOutboundLink
            waHref={WHATSAPP_NAV_HREF}
            className={cn(
              'hidden md:inline-flex items-center justify-center gap-2 font-semibold',
              'transition-all duration-300 ease-out',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
              'btn-tech btn-outline-tech text-[var(--color-primary)] active:scale-[0.97]',
              'h-9 px-4 text-sm rounded-xl'
            )}
            data-hover
            data-inspector-title="CTA Principal con Conversión Directa"
            data-inspector-desc="Abre WhatsApp con un mensaje corto que indica que te escriben desde tu sitio (texto centralizado en lib/whatsapp.ts)."
            data-inspector-cat="UX · Motion"
          >
            Hablemos
          </WhatsAppOutboundLink>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-high)] transition-all duration-200"
            aria-label="Menu"
          >
            {mobileOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Gradient bottom border */}
      <div
        className="h-px"
        style={{
          background: 'linear-gradient(to right, transparent 5%, rgba(var(--color-primary-rgb), 0.2) 30%, rgba(6, 182, 212, 0.15) 50%, rgba(var(--color-primary-rgb), 0.2) 70%, transparent 95%)',
        }}
      />

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden"
            style={{
              backgroundColor: 'var(--nav-bg-mobile)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            <div className="flex flex-col px-6 py-4 gap-1">
              {NAV_LINKS.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-high)]"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                      pathname === link.href
                        ? 'text-[var(--color-primary)] bg-[rgba(var(--color-primary-rgb),0.08)]'
                        : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-high)]',
                    )}
                  >
                    {link.label}
                  </Link>
                ),
              )}
              <div className="mt-2 pt-2 border-t border-[var(--color-surface-high)]">
                <WhatsAppOutboundLink
                  waHref={WHATSAPP_NAV_HREF}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'inline-flex w-full items-center justify-center gap-2 font-semibold',
                    'transition-all duration-300 ease-out',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                    'btn-tech btn-primary-tech active:scale-[0.97]',
                    'h-11 px-6 text-sm rounded-xl'
                  )}
                  data-hover
                >
                  Hablemos
                </WhatsAppOutboundLink>
              </div>
            </div>
            {/* Gradient bottom for mobile */}
            <div
              className="h-px"
              style={{
                background: 'linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.15), transparent)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
