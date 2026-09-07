'use client'

import { useEffect, useRef, type CSSProperties } from 'react'

/**
 * Parallax de marca (spec §1/§11): el watermark APEX se desplaza -30→30px y su
 * stroke se intensifica 0.05→0.10 scrubbed al scroll. Vanilla (scroll pasivo +
 * rAF): solo corre con el footer en viewport, lg+ y sin reduced-motion.
 *
 * Vive aparte del footer a proposito: es lo UNICO del footer que necesita
 * cliente. Con esto el resto del footer es server component y deja de
 * hidratarse (y de viajar como JS) en todas las rutas.
 */
export function FooterWatermark() {
  const watermarkRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = watermarkRef.current
    if (!el) return

    const mql = window.matchMedia(
      '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
    )
    const footerEl = (el.closest('footer') as HTMLElement) ?? el

    let rafId = 0
    let listening = false

    const update = () => {
      rafId = 0
      const rect = footerEl.getBoundingClientRect()
      const vh = window.innerHeight
      const p = Math.min(1, Math.max(0, (vh - rect.top) / Math.max(1, rect.height)))
      el.style.transform = `translate3d(0, ${(-30 + 60 * p).toFixed(1)}px, 0)`
      el.style.setProperty('--sn-stroke-alpha', (0.05 + 0.05 * p).toFixed(3))
    }

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update)
    }

    const stop = () => {
      if (!listening) return
      listening = false
      window.removeEventListener('scroll', onScroll)
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = 0
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && mql.matches) {
          if (!listening) {
            listening = true
            window.addEventListener('scroll', onScroll, { passive: true })
            update()
          }
        } else {
          stop()
        }
      },
      { rootMargin: '80px' },
    )

    const applyGate = () => {
      if (mql.matches) {
        io.observe(footerEl)
      } else {
        io.disconnect()
        stop()
        el.style.transform = ''
        el.style.removeProperty('--sn-stroke-alpha')
      }
    }

    applyGate()
    mql.addEventListener('change', applyGate)

    return () => {
      mql.removeEventListener('change', applyGate)
      io.disconnect()
      stop()
    }
  }, [])

  return (
    <div
      ref={watermarkRef}
      aria-hidden="true"
      className="section-number absolute -bottom-8 right-0 z-0 hidden select-none lg:block"
      style={
        {
          '--sn-stroke-alpha': '0.07',
          fontSize: 'clamp(9rem, 16vw, 14rem)',
        } as CSSProperties
      }
    >
      APEX
    </div>
  )
}
