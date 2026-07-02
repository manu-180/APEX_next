'use client'

/**
 * useParallaxNumber — parallax editorial de los `.section-number` gigantes.
 *
 * GSAP ScrollTrigger con scrub 0.6: el número se desplaza yPercent -18
 * (transform-only) mientras la sección atraviesa el viewport. Solo lg+
 * (los números viven en `hidden lg:block`) y gated por prefers-reduced-motion
 * vía gsap.matchMedia (spec §11 — regla de 3 capas).
 *
 * SSR-safe: GSAP se importa dinámicamente dentro del useEffect
 * (mismo patrón que hooks/useGsapReveal.ts).
 */

import { useEffect, type RefObject } from 'react'

/** registerPlugin es idempotente, pero evitamos la llamada repetida. */
let gsapReady = false

export function useParallaxNumber(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const el = ref.current
    if (!el) return

    let cleanup: (() => void) | undefined
    let cancelled = false

    void (async () => {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')

      if (cancelled) return

      if (!gsapReady) {
        gsap.registerPlugin(ScrollTrigger)
        gsapReady = true
      }

      const mm = gsap.matchMedia()

      // Solo desktop y solo si el usuario no pidió reduced-motion.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const tween = gsap.to(el, {
          yPercent: -18,
          // `ease: none` es correcto en scrub: el scroll es el driver y
          // cualquier otra curva distorsionaría el mapeo (no es un loop).
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('section') ?? el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        })

        return () => {
          tween.scrollTrigger?.kill()
          tween.kill()
        }
      })

      cleanup = () => mm.revert()
    })()

    return () => {
      cancelled = true
      cleanup?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
