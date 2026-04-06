'use client'

import Link from 'next/link'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { useTheme } from 'next-themes'
import { SectionReveal } from '@/components/ui/section-reveal'
import { ArrowRightIcon, WhatsAppIcon } from '@/components/ui/icons'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils/cn'
import { WA_MSG_GENERIC, whatsappUrl } from '@/lib/whatsapp'

export function HomeFinalCtaSection() {
  const prefersReducedMotion = useReducedMotion()
  const { resolvedTheme } = useTheme()
  const isLight = resolvedTheme === 'light'
  const ctaTiltSpring = { stiffness: 88, damping: 19, mass: 0.82 }
  const tiltXTarget = useMotionValue(0)
  const tiltYTarget = useMotionValue(0)
  const glareXTarget = useMotionValue(50)
  const tiltX = useSpring(tiltXTarget, ctaTiltSpring)
  const tiltY = useSpring(tiltYTarget, ctaTiltSpring)
  const glareX = useSpring(glareXTarget, ctaTiltSpring)

  const cardShadow = useTransform([tiltX, tiltY], ([rx, ry]) => {
    const x = rx as number
    const y = ry as number
    return isLight
      ? `0 ${12 + Math.abs(x) * 2}px ${36 + Math.abs(y) * 4}px rgba(15, 23, 42, 0.08), ${y * 1.5}px ${-x * 1.5}px 28px rgba(var(--color-primary-rgb), 0.12)`
      : `0 ${14 + Math.abs(x) * 3}px ${42 + Math.abs(y) * 5}px rgba(0, 0, 0, 0.55), ${y * 2}px ${-x * 2}px 38px rgba(var(--color-primary-rgb), 0.16)`
  })

  const glareGradient = useTransform(glareX, (gx) =>
    isLight
      ? `linear-gradient(118deg, rgba(0,0,0,0) 34%, rgba(0,0,0,0.05) ${gx}%, rgba(0,0,0,0.025) ${Math.min(gx + 11, 100)}%, rgba(0,0,0,0) ${Math.min(gx + 24, 100)}%)`
      : `linear-gradient(118deg, rgba(255,255,255,0) 34%, rgba(255,255,255,0.16) ${gx}%, rgba(255,255,255,0.06) ${Math.min(gx + 11, 100)}%, rgba(255,255,255,0) ${Math.min(gx + 24, 100)}%)`,
  )

  const cardShadowStatic = isLight
    ? '0 12px 36px rgba(15, 23, 42, 0.08), 0 0 28px rgba(var(--color-primary-rgb), 0.12)'
    : '0 14px 42px rgba(0, 0, 0, 0.55), 0 0 38px rgba(var(--color-primary-rgb), 0.16)'

  return (
    <section className="relative pb-24 md:pb-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionReveal>
          <div style={{ perspective: 1000 }}>
            <motion.div
              className="relative overflow-hidden rounded-3xl border p-7 sm:p-10"
              style={{
                borderColor: 'var(--glass-border)',
                background:
                  'linear-gradient(155deg, color-mix(in srgb, var(--color-surface-high) 92%, var(--color-primary) 8%) 0%, var(--color-surface-base) 100%)',
                ...(prefersReducedMotion
                  ? {
                      transform: 'none',
                      boxShadow: cardShadowStatic,
                    }
                  : {
                      rotateX: tiltX,
                      rotateY: tiltY,
                      translateZ: 0,
                      boxShadow: cardShadow,
                      transformStyle: 'preserve-3d',
                    }),
              }}
              onMouseMove={(e) => {
                if (prefersReducedMotion) return
                const rect = e.currentTarget.getBoundingClientRect()
                const relX = ((e.clientX - rect.left) / rect.width) * 2 - 1
                const relY = ((e.clientY - rect.top) / rect.height) * 2 - 1
                const maxTilt = 6
                tiltXTarget.set(relY * -maxTilt)
                tiltYTarget.set(relX * maxTilt)
                glareXTarget.set(((e.clientX - rect.left) / rect.width) * 100)
              }}
              onMouseLeave={() => {
                tiltXTarget.set(0)
                tiltYTarget.set(0)
                glareXTarget.set(50)
              }}
            >
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
                style={{
                  background: prefersReducedMotion
                    ? isLight
                      ? 'linear-gradient(118deg, rgba(0,0,0,0) 34%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.025) 61%, rgba(0,0,0,0) 74%)'
                      : 'linear-gradient(118deg, rgba(255,255,255,0) 34%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.06) 61%, rgba(255,255,255,0) 74%)'
                    : glareGradient,
                  opacity: prefersReducedMotion ? (isLight ? 0.45 : 0.35) : isLight ? 0.55 : 0.7,
                  transition: 'opacity 260ms ease',
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full opacity-45 blur-3xl"
                style={{ background: 'rgba(var(--color-primary-rgb), 0.2)' }}
              />

              <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                <div>
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                    Siguiente paso
                  </p>
                  <h2 className="font-heading text-balance text-3xl font-light leading-tight text-[var(--color-on-surface-variant)] sm:text-4xl md:text-5xl">
                    Si queres crecer online,
                    <span className="block font-extrabold text-[var(--color-on-surface)]">arranquemos esta semana.</span>
                  </h2>
                  <p className="mt-4 max-w-2xl text-pretty text-[var(--color-on-surface-variant)]">
                    Definimos alcance, fecha de entrega y precio cerrado desde el inicio. Sin vueltas, sin humo y con una
                    propuesta clara para tu negocio.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
                  <Link
                    href={ROUTES.contact}
                    className={cn(
                      'inline-flex items-center justify-center gap-2 font-semibold select-none',
                      'transition-all duration-200 ease-out',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                      'btn-tech btn-primary-tech active:scale-[0.97]',
                      'h-12 px-7 text-sm rounded-xl',
                    )}
                  >
                    Agendar una llamada
                    <ArrowRightIcon className="size-4" />
                  </Link>
                  <WhatsAppOutboundLink
                    waHref={whatsappUrl(WA_MSG_GENERIC)}
                    className={cn(
                      'inline-flex items-center justify-center gap-2 font-semibold select-none',
                      'transition-all duration-200 ease-out',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                      'btn-tech btn-outline-tech text-[var(--color-primary)] active:scale-[0.97]',
                      'h-12 px-7 text-sm rounded-xl',
                    )}
                  >
                    <WhatsAppIcon className="size-4" />
                    Escribirme por WhatsApp
                  </WhatsAppOutboundLink>
                </div>
              </div>
            </motion.div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
