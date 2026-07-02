'use client'

import type { CSSProperties, MouseEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { SectionReveal } from '@/components/ui/section-reveal'
import { WhatsAppIcon } from '@/components/ui/icons'
import { whatsappUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils/cn'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { WA_GRADIENT, WA_SHADOW_CLASS_LG } from '@/lib/constants/whatsapp-ui'
import { SPRING_SNAP } from '@/lib/motion'

/** De-riskers canónicos (AUDIT_ADDENDUM): respuesta <1 h, boceto 24-48 h, 3 cuotas. */
const FINAL_DERISKERS = [
  'Te respondo en menos de 1 hora',
  'Boceto gratis en 24-48 h',
  '3 cuotas sin interés',
] as const

/** Pull máximo del magnetic hover (spec §8.6: ±3-4px, único de la página). */
const MAGNETIC_PULL = 4

/**
 * CTA de dinero con magnetic hover (spec §8.6): el botón se acerca ±4px al
 * cursor con spring. Solo mouse (los eventos no disparan en touch) y gated
 * por reduced-motion. Tracking de conversión intacto (WhatsAppOutboundLink).
 */
function MagneticWhatsAppCta() {
  const prefersReducedMotion = useReducedMotion()
  const pullX = useMotionValue(0)
  const pullY = useMotionValue(0)
  const springX = useSpring(pullX, SPRING_SNAP)
  const springY = useSpring(pullY, SPRING_SNAP)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    pullX.set(Math.max(-MAGNETIC_PULL, Math.min(MAGNETIC_PULL, relX * MAGNETIC_PULL)))
    pullY.set(Math.max(-MAGNETIC_PULL, Math.min(MAGNETIC_PULL, relY * MAGNETIC_PULL)))
  }

  const resetPull = () => {
    pullX.set(0)
    pullY.set(0)
  }

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetPull}
      className="inline-block"
    >
      <WhatsAppOutboundLink
        waHref={whatsappUrl('Hola Manuel, quiero arrancar mi proyecto. ¿Coordinamos 15 min?')}
        className={cn(
          'group btn-tech inline-flex h-14 items-center justify-center gap-3 rounded-xl px-9 text-base font-semibold text-white select-none',
          'transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.97]',
          'motion-reduce:transform-none motion-reduce:transition-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
          WA_SHADOW_CLASS_LG,
        )}
        style={{ background: WA_GRADIENT }}
      >
        <WhatsAppIcon className="size-5 transition-transform duration-200 group-hover:scale-110 motion-reduce:transform-none" />
        Hablemos por WhatsApp
      </WhatsAppOutboundLink>
    </motion.div>
  )
}

export function ServiciosFinalCta() {
  return (
    <section className="my-16 mx-auto max-w-4xl px-6">
      <SectionReveal>
        {/* Superficie E3: double-bezel + noise (spec §3/§6) en lugar de blobs blur */}
        <div
          className="bento-surface bento-surface--framed noise-overlay overflow-hidden"
          data-hover
          data-inspector-title="CTA final — una sola acción"
          data-inspector-desc="Cierre de página estilo /gracias: una única acción dominante (WhatsApp en verde sólido) con los de-riskers reales debajo. Sin segundas opciones que diluyan la decisión."
          data-inspector-cat="UX · Conversión"
        >
          {/* Watermark de sección */}
          {/* Stroke 0.1 solo en dark; en light hereda el 0.34 global (visible sobre porcelana) */}
          <span
            aria-hidden="true"
            className="section-number absolute -top-3 right-4 dark:[--sn-stroke-alpha:0.1]"
            style={{ fontSize: 'clamp(4.5rem, 9vw, 7rem)' } as CSSProperties}
          >
            08
          </span>

          {/* Hairline decorativa superior (spec §4) */}
          <div
            aria-hidden
            className="absolute top-0 inset-x-0 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.4) 50%, transparent)',
            }}
          />

          {/* Layout asimétrico: texto a la izquierda, acción a la derecha */}
          <div className="relative z-10 grid grid-cols-1 items-center gap-8 px-8 py-12 sm:grid-cols-[1fr_auto] sm:gap-10 sm:py-14">
            <div>
              <p className="editorial-label editorial-label--primary mb-6">Último paso</p>

              <h3 className="heading-display mb-4 max-w-lg text-balance text-3xl sm:text-4xl">
                <span className="block text-[var(--color-on-surface-variant)]">Ya viste precios y proceso.</span>
                <strong className="block text-[var(--color-on-surface)]">Falta tu proyecto.</strong>
              </h3>
              <p className="max-w-sm text-sm leading-relaxed text-[var(--color-on-surface-variant)] opacity-80">
                Me escribís, charlamos 15 minutos gratis sobre tu negocio y en 24-48 h
                tenés un boceto de tu página. Sin compromiso.
              </p>
            </div>

            {/* Una sola acción dominante — verde sólido WhatsApp + magnetic */}
            <div className="flex sm:justify-end">
              <MagneticWhatsAppCta />
            </div>

            {/* De-riskers canónicos */}
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--color-on-surface-variant)] sm:col-span-2">
              {FINAL_DERISKERS.map((claim) => (
                <li key={claim} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="size-1 rounded-full"
                    style={{ background: 'var(--color-primary)' }}
                  />
                  {claim}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionReveal>
    </section>
  )
}
