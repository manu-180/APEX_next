'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/lib/constants'
import { MenuIcon, XIcon, SunIcon, MoonIcon, KeyboardIcon } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'

const NAV_LINKS = [
  { href: ROUTES.home, label: 'Inicio' },
  { href: ROUTES.servicios, label: 'Servicios' },
  { href: ROUTES.about, label: 'Sobre Mí' },
  { href: ROUTES.contact, label: 'Contacto' },
]

interface NavbarProps {
  onToggleDarkMode: () => void
  onShowShortcuts: () => void
  onlineCount?: number
}

export function Navbar({ onToggleDarkMode, onShowShortcuts, onlineCount }: NavbarProps) {
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-surface-high/50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 backdrop-blur-xl bg-surface-base/80">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 font-bold text-lg tracking-tight text-on-surface" data-hover>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-extrabold">
            A
          </span>
          <span className="hidden sm:block">APEX</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                data-hover
                className={cn(
                  'relative px-4 py-2 text-sm font-medium transition-colors rounded-lg',
                  active ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                )}
              >
                {link.label}
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-x-2 -bottom-[17px] h-[2px] bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Online indicator */}
          {typeof onlineCount === 'number' && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-high/50 text-xs text-on-surface-variant">
              <span className="h-2 w-2 rounded-full bg-online animate-pulse" />
              {onlineCount} online
            </div>
          )}

          {/* Dark mode */}
          <button
            onClick={onToggleDarkMode}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-high transition-colors"
            aria-label="Toggle tema"
            data-hover
          >
            {resolvedTheme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </button>

          {/* Shortcuts */}
          <button
            onClick={onShowShortcuts}
            className="hidden md:flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-high transition-colors"
            aria-label="Atajos de teclado"
            data-hover
          >
            <KeyboardIcon className="h-4 w-4" />
          </button>

          {/* CTA */}
          <Link href={ROUTES.contact} className="hidden md:block">
            <Button size="sm" variant="primary">Hablemos</Button>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-high transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-surface-high bg-surface-base/95 backdrop-blur-xl"
          >
            <div className="flex flex-col px-6 py-4 gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                    pathname === link.href ? 'text-primary bg-primary-8' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-high'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 pt-2 border-t border-surface-high">
                <Link href={ROUTES.contact} onClick={() => setMobileOpen(false)}>
                  <Button size="md" variant="primary" className="w-full">Hablemos</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
