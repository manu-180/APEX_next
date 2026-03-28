'use client'

/**
 * useGsapReveal — GSAP ScrollTrigger scroll-reveal hook.
 *
 * Global consistency contract:
 *   ease     → 'power3.out'          (same as Framer Motion [0.22, 1, 0.36, 1] feel)
 *   duration → 0.7s
 *   y offset → 40px (default)
 *   start    → 'top 85%'
 *
 * Accessibility: fully respects prefers-reduced-motion — no animation is
 * registered when the user has requested reduced motion.
 *
 * SSR-safe: all GSAP code lives inside useEffect (client-only), ScrollTrigger
 * is dynamically imported to avoid any Next.js SSR issue.
 */

import { useEffect, type RefObject } from 'react'

/** Module-level flag — registerPlugin is idempotent but we avoid the call overhead. */
let gsapReady = false

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
  /** ScrollTrigger start value. Default: 'top 85%' */
  start?: string
}

export function useGsapReveal(
  ref: RefObject<HTMLElement | null>,
  options: GsapRevealOptions = {}
) {
  useEffect(() => {
    // SSR guard
    if (typeof window === 'undefined') return

    // Accessibility — skip all animations when reduced-motion is requested
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = ref.current
    if (!el) return

    // Keep a reference to the GSAP context for cleanup
    // eslint-disable-next-line prefer-const
    let cleanup: (() => void) | undefined

    void (async () => {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')

      if (!gsapReady) {
        gsap.registerPlugin(ScrollTrigger)
        gsapReady = true
      }

      const targets: Element[] = options.selector
        ? Array.from(el.querySelectorAll<Element>(options.selector))
        : [el]

      if (targets.length === 0) return

      const ctx = gsap.context(() => {
        gsap.fromTo(
          targets,
          { opacity: 0, y: options.y ?? 40, x: options.x ?? 0 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.7,
            ease: 'power3.out',
            delay: options.delay ?? 0,
            stagger: options.stagger ?? 0,
            scrollTrigger: {
              trigger: el,
              start: options.start ?? 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      })

      cleanup = () => ctx.revert()
    })()

    return () => cleanup?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run once on mount — GSAP owns the animation lifecycle
}
