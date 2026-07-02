'use client'

/**
 * CTA de cierre del muestrario — consume la tarjeta 3D compartida
 * (components/ui/tilt-cta-card) para cerrar con la misma jerarquía física
 * que /tecnologias. Verde WhatsApp desde lib/constants/whatsapp-ui (§12).
 */

import { SectionReveal } from '@/components/ui/section-reveal'
import { TiltCtaCard } from '@/components/ui/tilt-cta-card'
import { cn } from '@/lib/utils/cn'
import { whatsappUrl } from '@/lib/whatsapp'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { WhatsAppIcon } from '@/components/ui/icons'
import { WA_GRADIENT, WA_SHADOW_CLASS } from '@/lib/constants/whatsapp-ui'

export function MuestrarioCta() {
  return (
    <section className="px-6 pb-28 pt-4 sm:pb-36">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <TiltCtaCard
            inspectorTitle="CTA final del muestrario — tarjeta 3D compartida"
            inspectorDesc="La misma pieza física que cierra /tecnologias: inclinación 3D con resortes de Framer Motion, glare que sigue el cursor y profundidad real (preserve-3d: contenido a +28px, halo a −20px). Bajo 'reducir movimiento' queda quieta, con sombra tranquila. El botón verde es el CTA de dinero oficial del sitio."
            inspectorCat="Física · 3D"
          >
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
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
                  WA_SHADOW_CLASS,
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                )}
                style={{ background: WA_GRADIENT }}
              >
                <WhatsAppIcon className="size-4 transition-transform duration-200 group-hover:scale-110 motion-reduce:transform-none" />
                Quiero el mío
              </WhatsAppOutboundLink>
            </div>
          </TiltCtaCard>
        </SectionReveal>
      </div>
    </section>
  )
}
