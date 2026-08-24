'use client'

/**
 * useGsapReveal — scroll-reveal one-shot. (El nombre quedó por compatibilidad
 * con sus consumidores; GSAP ya no existe en el sitio.)
 *
 * Implementación vanilla: IntersectionObserver dispara una transición CSS
 * opacity+transform con stagger opcional. Misma firma y mismo feel que la
 * versión GSAP (power3.out ≈ cubic-bezier(0.22, 1, 0.36, 1), 0.7 s, y 40px).
 *
 * Accesibilidad: con prefers-reduced-motion no se registra nada — el
 * contenido queda visible en su estado final.
 */

import { useEffect, type RefObject } from 'react'

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const DURATION_S = 0.7

export interface GsapRevealOptions {
  /** CSS selector for children to stagger. If omitted, the container itself animates. */
  selector?: string
  /** Vertical offset to animate from (px). Default: 40 */
  y?: number
  /** Horizontal offset to animate from (px). Default: 0 */
  x?: number
  /** Stagger between children (s). Default: 0 */
  stagger?: number
  /** Extra delay before the animation starts (s). Default: 0 */
  delay?: number
  /** Punto de disparo estilo ScrollTrigger ('top 85%'). Default: 'top 85%' */
  start?: string
}

/** 'top 85%' → el reveal dispara cuando el top del bloque cruza el 85% del viewport. */
function startToRootMargin(start: string | undefined): string {
  const match = /top\s+(\d+)%/.exec(start ?? '')
  const pct = match ? Number(match[1]) : 85
  return `0px 0px -${Math.min(40, Math.max(0, 100 - pct))}% 0px`
}

export function useGsapReveal(
  ref: RefObject<HTMLElement | null>,
  options: GsapRevealOptions = {}
) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = ref.current
    if (!el) return

    const targets: HTMLElement[] = options.selector
      ? Array.from(el.querySelectorAll<HTMLElement>(options.selector))
      : [el]
    if (targets.length === 0) return

    const y = options.y ?? 40
    const x = options.x ?? 0
    const stagger = options.stagger ?? 0
    const delay = options.delay ?? 0

    for (const t of targets) {
      t.style.opacity = '0'
      t.style.transform = `translate(${x}px, ${y}px)`
    }

    let timeoutId = 0

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        targets.forEach((t, i) => {
          const d = delay + i * stagger
          t.style.transition = `opacity ${DURATION_S}s ${EASE} ${d}s, transform ${DURATION_S}s ${EASE} ${d}s`
          t.style.opacity = '1'
          t.style.transform = 'translate(0px, 0px)'
        })
        // Limpieza de estilos inline al terminar la cascada completa.
        const totalMs = (delay + stagger * (targets.length - 1) + DURATION_S) * 1000
        timeoutId = window.setTimeout(() => {
          for (const t of targets) {
            t.style.transition = ''
            t.style.opacity = ''
            t.style.transform = ''
          }
        }, totalMs + 60)
      },
      { rootMargin: startToRootMargin(options.start) },
    )

    io.observe(el)

    return () => {
      io.disconnect()
      if (timeoutId) window.clearTimeout(timeoutId)
      for (const t of targets) {
        t.style.transition = ''
        t.style.opacity = ''
        t.style.transform = ''
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
