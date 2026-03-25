'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'

interface TooltipInfo {
  title: string
  desc: string
  cat: string
  x: number
  y: number
  bottom: number
  viewportHeight: number
}

const CAT_COLORS: Record<string, string> = {
  'Física · 3D':        'rgba(34, 211, 238, 1)',
  '3D · Glow':          'rgba(34, 211, 238, 1)',
  'Animación':          'rgba(167, 139, 250, 1)',
  'UX · Motion':        'rgba(52, 211, 153, 1)',
  'Tema Dinámico':      'rgba(251, 191, 36, 1)',
  'CSS · Ambiance':     'rgba(56, 189, 248, 1)',
  'UX · Accesibilidad': 'rgba(74, 222, 128, 1)',
  'UX · Formulario':    'rgba(45, 212, 191, 1)',
  'Seguridad':          'rgba(251, 113, 133, 1)',
  'Performance':        'rgba(129, 140, 248, 1)',
  'Motion · Spring':    'rgba(232, 121, 249, 1)',
}

const DEFAULT_COLOR = 'rgba(56, 189, 248, 1)'

function getCatColor(cat: string): string {
  return CAT_COLORS[cat] ?? DEFAULT_COLOR
}

function alpha(color: string, opacity: number): string {
  return color.replace(/[\d.]+\)$/, `${opacity})`)
}

function stableTooltipKey(title: string, desc: string, cat: string): string {
  return `${title}::${cat}::${desc.slice(0, 160)}`
}

export function InspectorOverlay({ onDisable }: { onDisable: () => void }) {
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null)
  const [activeTitle, setActiveTitle] = useState<string>('')
  const rafRef = useRef(0)
  /** Mismo nodo `[data-hover]` bajo el cursor: no recalcular posición ni re-montar el cartel. */
  const lockedHoverElRef = useRef<HTMLElement | null>(null)

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target || target === document.documentElement || target === document.body) {
      lockedHoverElRef.current = null
      setTooltip(null)
      return
    }

    const hoverEl = target.closest('[data-hover]') as HTMLElement | null
    if (!hoverEl) {
      lockedHoverElRef.current = null
      setTooltip(null)
      setActiveTitle('')
      return
    }

    const title = hoverEl.getAttribute('data-inspector-title') ?? ''
    const desc = hoverEl.getAttribute('data-inspector-desc') ?? ''
    const cat = hoverEl.getAttribute('data-inspector-cat') ?? ''

    if (!title && !desc) {
      lockedHoverElRef.current = null
      setTooltip(null)
      setActiveTitle('')
      return
    }

    // Seguimos dentro del mismo bloque inspectable: una sola tarjeta quieta (sin re-animar).
    if (lockedHoverElRef.current === hoverEl) {
      return
    }

    lockedHoverElRef.current = hoverEl

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      // El puntero pudo salir mientras esperábamos el frame.
      if (lockedHoverElRef.current !== hoverEl) return

      const rect = hoverEl.getBoundingClientRect()
      setActiveTitle(title)
      setTooltip({
        title,
        desc,
        cat,
        x: rect.left + rect.width / 2,
        y: rect.top,
        bottom: rect.bottom,
        viewportHeight: window.innerHeight,
      })
    })
  }, [])

  const handleMouseOut = useCallback((e: MouseEvent) => {
    const related = e.relatedTarget as Node | null
    const locked = lockedHoverElRef.current
    if (!locked) return
    if (related && locked.contains(related)) return

    lockedHoverElRef.current = null
    setTooltip(null)
    setActiveTitle('')
  }, [])

  useEffect(() => {
    document.addEventListener('mouseover', handleMouseOver, true)
    document.addEventListener('mouseout', handleMouseOut, true)
    return () => {
      document.removeEventListener('mouseover', handleMouseOver, true)
      document.removeEventListener('mouseout', handleMouseOut, true)
      cancelAnimationFrame(rafRef.current)
    }
  }, [handleMouseOver, handleMouseOut])

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div
        className="fixed top-16 left-0 right-0 z-[45] overflow-hidden border-b backdrop-blur-xl transition-[background-color,border-color] duration-300"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--nav-bg) 94%, transparent)',
          borderColor: 'rgba(var(--color-primary-rgb), 0.22)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        {/* Scanning sweep — usa el primario del tema (Flutter, Next, etc.) */}
        <motion.div
          className="pointer-events-none absolute inset-y-0 w-32"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb),0.05), rgba(var(--color-primary-rgb),0.14), rgba(var(--color-primary-rgb),0.05), transparent)',
          }}
          animate={{ x: ['-8rem', '110vw'] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
        />

        <div className="relative flex h-9 items-center justify-between px-4">
          {/* Left */}
          <div className="flex items-center gap-3">
            {/* Ripple dot */}
            <div className="relative flex h-3 w-3 items-center justify-center">
              <span
                className="absolute h-full w-full animate-ping rounded-full opacity-40"
                style={{ backgroundColor: 'var(--color-primary)' }}
              />
              <span
                className="relative h-2 w-2 rounded-full shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.55)]"
                style={{ backgroundColor: 'var(--color-primary)' }}
              />
            </div>

            <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-primary">
              APEX INSPECTOR
            </span>

            <div
              className="h-3.5 w-px shrink-0"
              style={{ backgroundColor: 'rgba(var(--color-primary-rgb), 0.25)' }}
            />

            {/* Live component label */}
            <AnimatePresence mode="wait">
              {activeTitle ? (
                <motion.span
                  key={activeTitle}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 5 }}
                  transition={{ duration: 0.14 }}
                  className="max-w-[min(52vw,28rem)] truncate text-[10px] font-mono text-on-surface"
                >
                  {activeTitle}
                </motion.span>
              ) : (
                <motion.span
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[10px] font-mono text-[var(--color-hint)]"
                >
                  Pasa el mouse sobre cualquier elemento
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Right: close */}
          <button
            type="button"
            onClick={onDisable}
            className="group flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-primary/80 transition-colors duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.1)] hover:text-primary"
            style={{
              borderColor: 'rgba(var(--color-primary-rgb), 0.28)',
            }}
          >
            <span>Cerrar</span>
            <kbd
              className="rounded border px-1 py-0.5 text-[8px] text-primary/60 transition-colors group-hover:text-primary/80"
              style={{
                backgroundColor: 'rgba(var(--color-primary-rgb), 0.08)',
                borderColor: 'rgba(var(--color-primary-rgb), 0.2)',
              }}
            >
              Ctrl+I
            </kbd>
          </button>
        </div>
      </div>

      {/* ── Floating tooltip ─────────────────────────────────────────── */}
      <AnimatePresence>
        {tooltip && (
          <TooltipCard key={stableTooltipKey(tooltip.title, tooltip.desc, tooltip.cat)} tooltip={tooltip} />
        )}
      </AnimatePresence>
    </>
  )
}

function TooltipCard({ tooltip }: { tooltip: TooltipInfo }) {
  const { resolvedTheme } = useTheme()
  const color = getCatColor(tooltip.cat)
  const showAbove = tooltip.bottom > tooltip.viewportHeight * 0.6
  const topPos = showAbove ? tooltip.y - 12 : tooltip.bottom + 10
  const isLight = resolvedTheme === 'light'
  const baseShadow = isLight
    ? '0 16px 40px -8px rgba(15,23,42,0.1), inset 0 1px 0 rgba(255,255,255,0.65)'
    : '0 16px 40px -8px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)'
  const categoryShadow = `0 0 0 1px ${alpha(color, isLight ? 0.14 : 0.1)}, 0 0 28px -8px ${alpha(color, isLight ? 0.2 : 0.22)}`

  return (
    <motion.div
      className="fixed z-[200] pointer-events-none"
      style={{
        left: tooltip.x,
        top: topPos,
        transform: showAbove ? 'translate(-50%, -100%)' : 'translateX(-50%)',
        width: 'min(340px, calc(100vw - 32px))',
      }}
      initial={{ opacity: 0, y: showAbove ? -10 : 10, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: showAbove ? -6 : 6, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
    >
      {/* Card — tokens de superficie / vidrio del sitio */}
      <div
        className="overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[color-mix(in_srgb,var(--color-surface-lowest)_94%,transparent)] backdrop-blur-xl transition-[background-color,box-shadow,border-color] duration-300 dark:bg-[color-mix(in_srgb,var(--color-surface-lowest)_88%,transparent)]"
        style={{
          borderLeft: `3px solid ${color}`,
          boxShadow: `${baseShadow}, ${categoryShadow}`,
        }}
      >
        {/* Category row */}
        <div className="flex items-center gap-2 border-b border-[var(--glass-border)] px-3.5 pb-2 pt-3">
          <span
            className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 6px ${alpha(color, 0.7)}` }}
          />
          {tooltip.cat && (
            <span
              className="rounded-full px-2 py-0.5 text-[9px] font-mono tracking-[0.12em] uppercase"
              style={{
                color,
                backgroundColor: alpha(color, 0.1),
                border: `1px solid ${alpha(color, 0.22)}`,
              }}
            >
              {tooltip.cat}
            </span>
          )}
          {/* Decorative line */}
          <div
            className="ml-auto h-px flex-1"
            style={{
              background: `linear-gradient(to right, ${alpha(color, 0.3)}, transparent)`,
            }}
          />
        </div>

        {/* Body */}
        <div className="px-3.5 py-3">
          {tooltip.title && (
            <p className="mb-1.5 text-[13px] font-semibold leading-snug text-on-surface">
              {tooltip.title}
            </p>
          )}
          {tooltip.desc && (
            <p className="text-[11px] leading-relaxed text-on-surface-variant">
              {tooltip.desc}
            </p>
          )}
        </div>

        {/* Bottom accent line */}
        <div
          className="h-px"
          style={{
            background: `linear-gradient(to right, ${alpha(color, 0.4)}, ${alpha(color, 0.1)}, transparent)`,
          }}
        />
      </div>
    </motion.div>
  )
}
