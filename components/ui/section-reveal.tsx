'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'
import { m, useInView, useReducedMotion, type Variants } from 'framer-motion'
import { DUR_REVEAL, EASE_OUT } from '@/lib/motion'

interface SectionRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right'
  /**
   * Cascada declarativa (spec §9): segundos entre hijos directos — usar
   * STAGGER_TIGHT/BASE/LOOSE de lib/motion. Los hijos deben ser motion.*
   * con variants `hidden`/`visible` (p. ej. REVEAL_ITEM_VARIANTS).
   * Con `stagger`, `delay` actúa como delayChildren del contenedor.
   */
  stagger?: number
}

/**
 * Reveal firma (spec §2) como variants de ítem, para cascadas con `stagger`:
 * <SectionReveal stagger={STAGGER_BASE}>
 *   <m.div variants={REVEAL_ITEM_VARIANTS}>…</m.div>
 * </SectionReveal>
 */
export const REVEAL_ITEM_VARIANTS: Variants = {
  // Solo opacity + transform: ambas compositan en GPU sin re-rasterizar.
  // (El blur(6px) animado anterior forzaba un re-filtrado por frame de cada
  // sección al scrollear — jank garantizado en GPUs integradas.)
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR_REVEAL, ease: EASE_OUT },
  },
}

/**
 * Entrada estándar de secciones y cards (reveal firma, spec §2):
 * opacity + y + blur one-shot, curva firma, once. API retrocompatible.
 */
export function SectionReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  stagger,
}: SectionRevealProps) {
  const ref = useRef(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReducedMotion = useReducedMotion()

  const offset = { up: [0, 28], left: [-28, 0], right: [28, 0] }[direction]

  // Fallback SSR (pre-mount) y rama reduced-motion propia: el nuke CSS global
  // no alcanza a las animaciones inline de Framer (spec §11) — degradamos a
  // estado final sin animación.
  if (!mounted || prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  if (typeof stagger === 'number') {
    return (
      <div ref={ref} className={className}>
        <m.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
          }}
        >
          {children}
        </m.div>
      </div>
    )
  }

  return (
    <div ref={ref} className={className}>
      <m.div
        initial={{ opacity: 0, x: offset[0], y: offset[1] }}
        animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: DUR_REVEAL, delay, ease: EASE_OUT }}
      >
        {children}
      </m.div>
    </div>
  )
}
