'use client'

import { useRouter } from 'next/navigation'
import type { Variants } from 'framer-motion'
import { motion, useReducedMotion } from 'framer-motion'
import { CheckIcon, WhatsAppIcon } from '@/components/ui/icons'
import { whatsappUrl } from '@/lib/whatsapp'
import { openWhatsAppWithThankYouPage } from '@/lib/whatsapp-navigate'
import { WA_GRADIENT, WA_SHADOW_CLASS } from '@/lib/constants/whatsapp-ui'
import { EASE_OUT } from '@/lib/motion'

/* Stagger reveal del listado de features fiscales (contrato §2). */
const BENEFITS_CONTAINER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.12 } },
}
const BENEFITS_ITEM: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT } },
}

const AFIP_BENEFITS = [
  'Factura A, B y C según tipo de cliente',
  'CAE automático al confirmar venta',
  'Notas de crédito y débito',
  'Comprobantes en PDF con tu marca',
  'Compatible con MercadoPago + AFIP',
  'Reportes para tu contador',
]

/**
 * Sección addon "+ Integración Fiscal AFIP/ARCA".
 *
 * Why: nicho sub-atendido en Argentina. Las agencias grandes no lo ofrecen
 * como estándar, los freelancers no se animan. Diferenciación + ticket promedio
 * +35% para proyectos que lo necesitan (contadores, abogados, e-commerce,
 * servicios profesionales).
 *
 * Ticket addon: ARS 200k-400k según volumen y complejidad.
 */
export function AfipAddonSection() {
  const prefersReducedMotion = useReducedMotion()
  const router = useRouter()

  const handleCtaClick = () => {
    openWhatsAppWithThankYouPage(
      whatsappUrl(
        'Hola Manuel, vi el addon de integración fiscal AFIP/ARCA y quiero saber si aplica a mi caso.',
      ),
      router,
    )
  }

  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, ease: EASE_OUT }}
          className="group/afip relative overflow-hidden rounded-2xl border transition-[border-color,box-shadow] duration-300 hover:border-[rgba(var(--color-primary-rgb),0.38)] hover:shadow-[0_0_36px_-12px_rgba(var(--color-primary-rgb),0.30)]"
          style={{
            background:
              'linear-gradient(165deg, color-mix(in srgb, var(--color-surface-high) 90%, var(--color-primary) 10%) 0%, var(--color-surface-base) 100%)',
            borderColor: 'rgba(var(--color-primary-rgb), 0.18)',
          }}
        >
          {/* Decorative element — AFIP iconography hint */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full blur-3xl opacity-50 transition-opacity duration-300 group-hover/afip:opacity-75"
            style={{ background: 'rgba(var(--color-primary-rgb), 0.22)' }}
          />

          <div className="relative grid gap-8 p-8 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="editorial-label editorial-label--primary">Addon · Solo Argentina</p>
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold tabular-nums text-[var(--color-primary)]"
                  style={{
                    background: 'rgba(var(--color-primary-rgb), 0.1)',
                    border: '1px solid rgba(var(--color-primary-rgb), 0.3)',
                  }}
                >
                  +$200K-$400K ARS según complejidad
                </span>
              </div>

              <h2 className="heading-display text-balance text-2xl sm:text-3xl md:text-4xl mb-3">
                <span className="text-[var(--color-on-surface-variant)]">Integración fiscal</span>{' '}
                <strong className="text-[var(--color-on-surface)]">AFIP / ARCA</strong>
              </h2>

              <p className="text-pretty text-[var(--color-on-surface-variant)] leading-relaxed mb-5">
                Facturación electrónica automática desde tu propio sitio o app, sin pegar manual
                cada operación. Para contadores, abogados, e-commerce, agendas profesionales y
                cualquier servicio que necesite emitir factura A o B sin volverse loco.
              </p>

              <motion.ul
                className="grid gap-2.5 sm:grid-cols-2 mb-7"
                variants={prefersReducedMotion ? undefined : BENEFITS_CONTAINER}
                initial={prefersReducedMotion ? false : 'hidden'}
                whileInView={prefersReducedMotion ? undefined : 'show'}
                viewport={{ once: true, amount: 0.3 }}
              >
                {AFIP_BENEFITS.map((b) => (
                  <motion.li
                    key={b}
                    variants={prefersReducedMotion ? undefined : BENEFITS_ITEM}
                    className="group/row flex items-start gap-2.5 text-sm"
                  >
                    <span
                      className="inline-flex size-4 shrink-0 items-center justify-center rounded-full mt-0.5 transition-transform duration-200 group-hover/row:scale-110"
                      style={{
                        backgroundColor: 'rgba(var(--color-primary-rgb), 0.16)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      <CheckIcon className="size-2.5" />
                    </span>
                    <span className="text-[var(--color-on-surface)]">{b}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <button
                type="button"
                onClick={handleCtaClick}
                className={`group/cta btn-tech inline-flex items-center gap-2.5 rounded-xl px-6 py-3 text-sm font-semibold text-white select-none transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.97] motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)] ${WA_SHADOW_CLASS}`}
                style={{ background: WA_GRADIENT }}
              >
                <WhatsAppIcon className="size-4 transition-transform duration-200 group-hover/cta:scale-110" />
                Ver si aplica a mi caso
              </button>
            </div>

            <div className="hidden md:block">
              <div
                className="relative aspect-[3/4] w-40 rounded-2xl p-4 flex flex-col gap-2 transition-transform duration-300 ease-out group-hover/afip:-translate-y-1 motion-reduce:transform-none"
                style={{
                  background: 'rgba(var(--color-primary-rgb), 0.08)',
                  border: '1px solid rgba(var(--color-primary-rgb), 0.2)',
                }}
              >
                <div className="text-[8px] font-mono uppercase tracking-widest opacity-50 text-[var(--color-on-surface-variant)]">
                  Factura A · 0001-00012345
                </div>
                <div
                  className="h-px"
                  style={{ background: 'rgba(var(--color-primary-rgb), 0.18)' }}
                />
                <div className="space-y-1 text-[8px] font-mono opacity-60 text-[var(--color-on-surface-variant)]">
                  <div className="flex justify-between">
                    <span>Servicio web</span>
                    <span>$300.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA 21%</span>
                    <span>$63.000</span>
                  </div>
                </div>
                <div
                  className="h-px"
                  style={{ background: 'rgba(var(--color-primary-rgb), 0.18)' }}
                />
                <div className="flex justify-between text-[10px] font-bold text-[var(--color-on-surface)]">
                  <span>TOTAL</span>
                  <span className="tabular-nums">$363.000</span>
                </div>
                <div className="mt-auto">
                  <div
                    className="rounded px-2 py-1 text-[7px] font-mono text-center"
                    style={{
                      background: 'rgba(var(--color-primary-rgb), 0.12)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    CAE 72938472310
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
