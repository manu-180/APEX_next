'use client'

/**
 * useParallaxNumber — parallax editorial de los `.section-number` gigantes.
 *
 * Implementación vanilla (antes GSAP ScrollTrigger, ~70 kB que se cargaban
 * en la home solo para esto): scroll pasivo + rAF, transform-only.
 * El número se desplaza yPercent 0→-18 mientras su sección atraviesa el
 * viewport. Solo lg+ (los números viven en `hidden lg:block`) y gated por
 * prefers-reduced-motion.
 */

import { useEffect, type RefObject } from 'react'

export function useParallaxNumber(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const el = ref.current
    if (!el) return

    const mql = window.matchMedia(
      '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
    )

    let rafId = 0
    let listening = false
    const section: HTMLElement = (el.closest('section') as HTMLElement) ?? el

    const update = () => {
      rafId = 0
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      // Progreso 0→1 de la sección atravesando el viewport (top bottom → bottom top)
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)))
      el.style.transform = `translate3d(0, ${(-18 * p).toFixed(2)}%, 0)`
    }

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update)
    }

    const startListening = () => {
      if (listening) return
      listening = true
      window.addEventListener('scroll', onScroll, { passive: true })
      update()
    }

    const stopListening = () => {
      if (!listening) return
      listening = false
      window.removeEventListener('scroll', onScroll)
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = 0
      }
    }

    // Solo escucha scroll mientras la sección está cerca del viewport.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && mql.matches) startListening()
        else stopListening()
      },
      { rootMargin: '80px' },
    )

    const applyGate = () => {
      if (mql.matches) {
        io.observe(section)
      } else {
        io.disconnect()
        stopListening()
        el.style.transform = ''
      }
    }

    applyGate()
    mql.addEventListener('change', applyGate)

    return () => {
      mql.removeEventListener('change', applyGate)
      io.disconnect()
      stopListening()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
