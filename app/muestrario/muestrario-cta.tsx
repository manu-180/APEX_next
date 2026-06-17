'use client'

/** CTA de cierre del muestrario — mismo patrón visual que el resto del sitio. */

import { SectionReveal } from '@/components/ui/section-reveal'
import { cn } from '@/lib/utils/cn'
import { whatsappUrl } from '@/lib/whatsapp'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { WhatsAppIcon } from '@/components/ui/icons'

const WA_GRADIENT = 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)'

export function MuestrarioCta() {
  return (
    <section className="px-6 pb-28 pt-4 sm:pb-36">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <div className="relative overflow-hidden rounded-3xl bento-surface">
            <div
              aria-hidden
              className="h-[2px] w-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb),0.7) 50%, transparent)' }}
            />
            <div className="flex flex-col items-start justify-between gap-6 p-7 sm:flex-row sm:items-center sm:p-10">
              <div>
                <h2 className="heading-display text-2xl sm:text-3xl">
                  <span className="text-[var(--color-on-surface-variant)]">¿El próximo de la lista</span>{' '}
                  <strong className="text-[var(--color-on-surface)]">es tu proyecto?</strong>
                </h2>
                <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                  Contame qué tenés en mente y te muestro, sin compromiso, cómo se vería tu sitio
                  con este nivel de diseño. Respondo yo, rápido.
                </p>
              </div>
              <WhatsAppOutboundLink
                waHref={whatsappUrl(
                  'Hola, vi el muestrario y quiero algo con ese nivel de diseño para mi proyecto. ¿Lo charlamos?',
                )}
                className={cn(
                  'group btn-tech inline-flex h-12 shrink-0 select-none items-center justify-center gap-2.5 px-6 text-sm font-semibold text-white',
                  'transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.97]',
                  'motion-reduce:transform-none motion-reduce:transition-none',
                  'shadow-[0_2px_5px_rgba(24,32,60,0.08),0_10px_26px_-10px_rgba(18,140,126,0.42)] dark:shadow-[0_10px_28px_-10px_rgba(37,211,102,0.45)]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                )}
                style={{ background: WA_GRADIENT }}
              >
                <WhatsAppIcon className="size-4 transition-transform duration-200 group-hover:scale-110 motion-reduce:transform-none" />
                Quiero el mío
              </WhatsAppOutboundLink>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
