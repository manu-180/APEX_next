'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRightIcon, CheckIcon, StarIcon, WhatsAppIcon } from '@/components/ui/icons'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'

type PlanType = 'essential' | 'popular' | 'recommended'

export interface ServiceDrawerContentProps {
  planName: string
  planType: PlanType
  price: string
  originalPrice?: string
  discount?: string
  idealFor: string
  benefits: Array<{ number: string; title: string; description: string }>
  features: string[]
  closingQuote: string
  whatsappLink: string
}

const PLAN_TYPE_LABEL: Record<PlanType, string> = {
  essential: 'Esencial',
  popular: 'Más elegido',
  recommended: 'Recomendado',
}

const PLAN_ACCENT_STYLE: Record<
  PlanType,
  {
    chipClassName: string
    glowClassName: string
    numberClassName: string
    ctaClassName: string
  }
> = {
  essential: {
    chipClassName:
      'text-[var(--color-primary)] bg-[rgba(var(--color-primary-rgb),0.12)] border-[rgba(var(--color-primary-rgb),0.28)]',
    glowClassName: 'from-[rgba(var(--color-primary-rgb),0.24)] via-[rgba(var(--color-primary-rgb),0.08)] to-transparent',
    numberClassName: 'text-[var(--color-primary)]',
    ctaClassName:
      'text-[var(--color-surface-base)] bg-[var(--color-primary)] hover:shadow-[0_0_0_1px_rgba(var(--color-primary-rgb),0.45),0_14px_40px_-14px_rgba(var(--color-primary-rgb),0.78)]',
  },
  popular: {
    chipClassName:
      'text-amber-200 bg-[rgba(245,158,11,0.14)] border-[rgba(245,158,11,0.34)]',
    glowClassName: 'from-[rgba(245,158,11,0.35)] via-[rgba(245,158,11,0.1)] to-transparent',
    numberClassName: 'text-amber-300',
    ctaClassName:
      'text-[#1a1305] bg-gradient-to-r from-amber-300 via-amber-400 to-orange-300 hover:shadow-[0_0_0_1px_rgba(245,158,11,0.45),0_14px_42px_-14px_rgba(245,158,11,0.75)]',
  },
  recommended: {
    chipClassName:
      'text-emerald-200 bg-[rgba(16,185,129,0.16)] border-[rgba(16,185,129,0.34)]',
    glowClassName: 'from-[rgba(16,185,129,0.36)] via-[rgba(16,185,129,0.12)] to-transparent',
    numberClassName: 'text-emerald-300',
    ctaClassName:
      'text-[#062118] bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 hover:shadow-[0_0_0_1px_rgba(16,185,129,0.45),0_14px_42px_-14px_rgba(16,185,129,0.75)]',
  },
}

const benefitsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

const benefitItemVariants = {
  hidden: {
    opacity: 0,
    y: 14,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.34,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

export function ServiceDrawerContent({
  planName,
  planType,
  price,
  originalPrice,
  discount,
  idealFor,
  benefits,
  features,
  closingQuote,
  whatsappLink,
}: ServiceDrawerContentProps) {
  const shouldReduceMotion = useReducedMotion()
  const accentStyle = PLAN_ACCENT_STYLE[planType]

  return (
    <div className="relative">
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b ${accentStyle.glowClassName} opacity-70`} />

      <div className="relative space-y-6 pb-4 md:space-y-7">
        <header className="space-y-3">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${accentStyle.chipClassName}`}
          >
            {PLAN_TYPE_LABEL[planType]}
          </span>

          <div className="space-y-1">
            <h3 className="text-[clamp(1.55rem,5.2vw,2.15rem)] font-black leading-[1.05] text-[var(--color-on-surface)]">
              {planName}
            </h3>
            <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
              <span className="text-[clamp(1.38rem,4.9vw,2rem)] font-black text-[var(--color-on-surface)]">
                {price}
              </span>
              {originalPrice ? (
                <span className="text-sm text-[var(--color-on-surface-variant)] line-through decoration-[1.6px]">
                  {originalPrice}
                </span>
              ) : null}
              {discount ? (
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs font-semibold text-[var(--color-on-surface)]">
                  {discount}
                </span>
              ) : null}
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(var(--color-primary-rgb),0.42)] to-transparent" />
        </header>

        <section
          className="rounded-2xl border px-4 py-3.5"
          style={{
            borderColor: 'rgba(var(--color-primary-rgb), 0.18)',
            background:
              'linear-gradient(145deg, rgba(var(--color-primary-rgb), 0.11), rgba(var(--color-primary-rgb), 0.04) 58%, rgba(255,255,255,0.01))',
          }}
        >
          <p className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--color-on-surface-variant)]">
            ¿Para quién es ideal?
          </p>
          <div className="flex items-start gap-2.5">
            <StarIcon className="mt-0.5 size-4 flex-shrink-0 text-[var(--color-primary)]" />
            <p className="text-sm leading-relaxed text-[var(--color-on-surface-variant)]">{idealFor}</p>
          </div>
        </section>

        <section className="space-y-2">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--color-on-surface-variant)]">
            Lo que ganás
          </p>

          <motion.ul
            initial="hidden"
            animate="visible"
            variants={shouldReduceMotion ? undefined : benefitsContainerVariants}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.01)]"
          >
            {benefits.map((benefit, index) => (
              <motion.li
                key={`${benefit.number}-${benefit.title}`}
                variants={shouldReduceMotion ? undefined : benefitItemVariants}
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : undefined}
                animate={shouldReduceMotion ? { opacity: 1, y: 0 } : undefined}
                className="grid grid-cols-[auto_1fr] gap-x-3 px-4 py-4 md:gap-x-4"
              >
                <span className={`text-[1.55rem] font-black leading-none tabular-nums ${accentStyle.numberClassName}`}>
                  {benefit.number}
                </span>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[var(--color-on-surface)] md:text-[15px]">{benefit.title}</h4>
                  <p className="text-[13px] leading-relaxed text-[var(--color-on-surface-variant)] md:text-sm">
                    {benefit.description}
                  </p>
                </div>
                {index < benefits.length - 1 && (
                  <div className="col-span-2 mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                )}
              </motion.li>
            ))}
          </motion.ul>
        </section>

        <section className="space-y-2.5">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--color-on-surface-variant)]">
            Incluye todo esto
          </p>
          <ul className="space-y-2">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2.5 rounded-xl border border-white/8 bg-[rgba(255,255,255,0.02)] px-3 py-2.5"
              >
                <CheckIcon className="mt-0.5 size-4 flex-shrink-0 text-[var(--color-primary)]" />
                <span className="text-sm leading-relaxed text-[var(--color-on-surface-variant)]">{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        <blockquote className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.02)] px-4 py-3.5">
          <p className="text-[13px] italic leading-relaxed text-[var(--color-on-surface-variant)] md:text-sm">
            "{closingQuote}"
          </p>
        </blockquote>
      </div>

      <div
        className="sticky bottom-0 z-20 -mx-5 mt-6 border-t border-white/10 px-5 pb-1 pt-3 backdrop-blur-xl md:-mx-6 md:px-6"
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-surface-lowest) 88%, transparent)' }}
      >
        <WhatsAppOutboundLink
          waHref={whatsappLink}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-base font-extrabold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)] ${accentStyle.ctaClassName} ${shouldReduceMotion ? '' : 'hover:scale-[1.015] active:scale-[0.985]'}`}
        >
          <WhatsAppIcon className="size-[18px]" />
          Empezar proyecto
          <ArrowRightIcon className="size-[17px]" />
        </WhatsAppOutboundLink>
      </div>
    </div>
  )
}
