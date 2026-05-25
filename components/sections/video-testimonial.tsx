'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

/**
 * Video testimonial section — sin grabar a Manuel.
 *
 * Cómo usar:
 * 1. Manuel tiene un video horizontal grabado por un cliente / del producto en
 *    funcionamiento. Lo sube a /public/videos/testimonial-main.mp4
 *    (recomendado: también /public/videos/testimonial-main.webm).
 * 2. Configurar TESTIMONIAL_VIDEO_SRC abajo (o setear el env var).
 * 3. Si NO existe video, el componente cae a un "audio quote" editorial
 *    (no se rompe el layout — degrada elegante).
 *
 * Mobile: el video se muestra en 16:9 con letterbox (object-fit: contain)
 * para no recortar. Si querés full-bleed mobile, cambiar a `object-cover`
 * pero perdés contexto del video horizontal.
 *
 * Performance: video carga con preload="none" + IntersectionObserver para no
 * afectar LCP. Poster image es esencial — sin poster, el video toma espacio
 * en blanco mientras carga.
 */

/** Path al video principal. Cambiar a undefined si no hay video disponible. */
const TESTIMONIAL_VIDEO_SRC: string | undefined =
  process.env.NEXT_PUBLIC_TESTIMONIAL_VIDEO_SRC || '/videos/testimonial-main.mp4'

/** Poster image — frame grabado del video. */
const TESTIMONIAL_POSTER_SRC = '/videos/testimonial-poster.jpg'

const QUOTE_FALLBACK = {
  text: 'Manuel entiende el problema antes de programar. No es un freelancer, es un partner técnico.',
  author: 'Nicolás R.',
  role: 'CEO · BotLode',
}

export function VideoTestimonialSection() {
  const prefersReducedMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [inView, setInView] = useState(false)
  const [videoAvailable, setVideoAvailable] = useState<boolean | null>(null)

  // IntersectionObserver: cargar video sólo cuando entra al viewport
  useEffect(() => {
    if (!TESTIMONIAL_VIDEO_SRC) {
      setVideoAvailable(false)
      return
    }

    const node = videoRef.current
    if (!node) return

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { rootMargin: '200px' },
    )

    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  // Check si el archivo existe — fallback automático si no
  useEffect(() => {
    if (!TESTIMONIAL_VIDEO_SRC) return
    fetch(TESTIMONIAL_VIDEO_SRC, { method: 'HEAD' })
      .then((r) => setVideoAvailable(r.ok))
      .catch(() => setVideoAvailable(false))
  }, [])

  // Mientras no sabemos si existe → mostrar fallback (mejor UX que flash)
  const showVideo = videoAvailable === true

  return (
    <section className="relative py-20 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
          className="mb-10 max-w-2xl"
        >
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="primary">Testimonio</Badge>
            <Badge variant="outline">Producto real</Badge>
          </div>
          <h2 className="font-heading text-balance text-3xl sm:text-4xl md:text-5xl leading-tight">
            <span className="font-extralight text-[var(--color-on-surface-variant)]">Lo que</span>{' '}
            <span className="font-extrabold text-[var(--color-on-surface)]">construimos juntos</span>
          </h2>
          <p className="mt-4 text-pretty text-[var(--color-on-surface-variant)]">
            Un cliente mostrando el producto real funcionando, no una grabación de stock.
          </p>
        </motion.div>

        {/* Container con relación 16:9 — letterbox elegante en mobile */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative mx-auto max-w-4xl"
        >
          {/* Frame con border + accent del tema */}
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              border: '1px solid rgba(var(--color-primary-rgb), 0.2)',
              boxShadow:
                '0 24px 60px -16px rgba(var(--color-primary-rgb), 0.18), 0 0 0 1px rgba(255,255,255,0.04) inset',
            }}
          >
            {/* Mobile: letterbox 16:9 con bg dark para no recortar; Desktop: igual */}
            <div className="aspect-video bg-black flex items-center justify-center">
              {showVideo ? (
                <video
                  ref={videoRef}
                  controls
                  preload="none"
                  poster={TESTIMONIAL_POSTER_SRC}
                  className="h-full w-full object-contain"
                  playsInline
                  // Sólo carga el src cuando entra al viewport
                  src={inView ? TESTIMONIAL_VIDEO_SRC : undefined}
                >
                  Tu navegador no soporta video HTML5.
                </video>
              ) : (
                /* Fallback editorial elegante cuando no hay video todavía */
                <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                  <span
                    className="font-heading text-6xl sm:text-7xl font-extrabold leading-none mb-4 opacity-30"
                    style={{ color: 'var(--color-primary)' }}
                    aria-hidden
                  >
                    &ldquo;
                  </span>
                  <p className="text-pretty text-lg sm:text-xl leading-relaxed max-w-2xl font-light text-[var(--color-on-surface)] mb-6">
                    {QUOTE_FALLBACK.text}
                  </p>
                  <div>
                    <div className="text-sm font-bold text-[var(--color-on-surface)]">
                      {QUOTE_FALLBACK.author}
                    </div>
                    <div className="text-xs text-[var(--color-on-surface-variant)] opacity-75">
                      {QUOTE_FALLBACK.role}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Frame decoration corners */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-3 top-3 size-4 border-l border-t opacity-60"
              style={{ borderColor: 'var(--color-primary)' }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute right-3 top-3 size-4 border-r border-t opacity-60"
              style={{ borderColor: 'var(--color-primary)' }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-3 left-3 size-4 border-b border-l opacity-60"
              style={{ borderColor: 'var(--color-primary)' }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-3 right-3 size-4 border-b border-r opacity-60"
              style={{ borderColor: 'var(--color-primary)' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
