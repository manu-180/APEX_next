'use client'

import type { CSSProperties } from 'react'
import { SectionReveal } from '@/components/ui/section-reveal'
import { WhatsAppIcon } from '@/components/ui/icons'
import { whatsappUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils/cn'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'

/**
 * Verde oficial WhatsApp — única excepción de hex permitida por DESIGN_BRIEF §2
 * (solo en CTAs de WhatsApp). Todo lo demás usa vars del tema.
 */
const WA_GRADIENT = 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)'
const WA_SHADOW = '0 14px 36px -12px rgba(37, 211, 102, 0.55)'

/** De-riskers canónicos (AUDIT_ADDENDUM): respuesta <1 h, boceto 24-48 h, 3 cuotas. */
const FINAL_DERISKERS = [
  'Te respondo en menos de 1 hora',
  'Boceto gratis en 24-48 h',
  '3 cuotas sin interés',
] as const

export function ServiciosFinalCta() {
  return (
    <section className="my-16 mx-auto max-w-4xl px-6">
      <SectionReveal>
        <div
          className="relative overflow-hidden rounded-2xl glass-card px-8 py-14 text-center sm:py-16"
          data-hover
          data-inspector-title="CTA final — una sola acción"
          data-inspector-desc="Cierre de página estilo /gracias: una única acción dominante (WhatsApp en verde sólido) con los de-riskers reales debajo. Sin segundas opciones que diluyan la decisión."
          data-inspector-cat="UX · Conversión"
        >
          {/* Watermark de sección */}
          <span
            aria-hidden="true"
            className="section-number absolute -top-3 right-4"
            style={{ fontSize: 'clamp(4.5rem, 9vw, 7rem)', '--sn-stroke-alpha': '0.1' } as CSSProperties}
          >
            07
          </span>

          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 -left-16 size-48 rounded-full blur-3xl opacity-30"
            style={{ background: 'rgba(var(--color-primary-rgb), 0.4)' }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -right-16 size-48 rounded-full blur-3xl opacity-20"
            style={{ background: 'rgba(var(--color-primary-rgb), 0.3)' }}
          />
          <div
            aria-hidden
            className="absolute top-0 inset-x-0 h-[2px]"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.8) 50%, transparent)',
            }}
          />

          <div className="relative z-10">
            <div className="mb-6 flex justify-center">
              <p className="editorial-label editorial-label--primary">Último paso</p>
            </div>

            <h3 className="heading-display mx-auto mb-4 max-w-lg text-balance text-3xl sm:text-4xl">
              <span className="block text-[var(--color-on-surface-variant)]">Ya viste precios y proceso.</span>
              <strong className="block text-[var(--color-on-surface)]">Falta tu proyecto.</strong>
            </h3>
            <p className="mx-auto mb-9 max-w-sm text-sm leading-relaxed text-[var(--color-on-surface-variant)] opacity-80">
              Me escribís, charlamos 15 minutos gratis sobre tu negocio y en 24-48 h
              tenés un boceto de tu página. Sin compromiso.
            </p>

            {/* Una sola acción dominante — verde sólido WhatsApp */}
            <WhatsAppOutboundLink
              waHref={whatsappUrl('Hola Manuel, quiero arrancar mi proyecto. ¿Coordinamos 15 min?')}
              className={cn(
                'btn-tech inline-flex h-14 items-center justify-center gap-3 rounded-xl px-9 text-base font-semibold text-white select-none',
                'transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.97]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
              )}
              style={{ background: WA_GRADIENT, boxShadow: WA_SHADOW }}
            >
              <WhatsAppIcon className="size-5" />
              Hablemos por WhatsApp
            </WhatsAppOutboundLink>

            {/* De-riskers canónicos */}
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[var(--color-on-surface-variant)]">
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
