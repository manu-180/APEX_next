'use client'

import { ArrowRightIcon } from '@/components/ui/icons'
import { SectionReveal } from '@/components/ui/section-reveal'
import { whatsappUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils/cn'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'

export function ServiciosFinalCta() {
  return (
    <section className="my-16 mx-auto max-w-4xl px-6">
      <SectionReveal>
        <div
          className="relative rounded-2xl overflow-hidden glass-card text-center py-14 px-8"
          data-hover
          data-inspector-title="CTA final — ¿Todavía tenés dudas?"
          data-inspector-desc="Cierre de página: captura la intención residual con un contacto directo sin fricción."
          data-inspector-cat="UX · Conversión"
        >
          <div
            className="pointer-events-none absolute -top-16 -left-16 size-48 rounded-full blur-3xl opacity-30"
            style={{ background: 'rgba(var(--color-primary-rgb), 0.4)' }}
          />
          <div
            className="pointer-events-none absolute -bottom-16 -right-16 size-48 rounded-full blur-3xl opacity-20"
            style={{ background: 'rgba(var(--color-primary-rgb), 0.3)' }}
          />
          <div
            className="absolute top-0 inset-x-0 h-[2px]"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.8) 50%, transparent)',
            }}
          />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-5">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: 'var(--color-primary)' }}
              />
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[var(--color-primary)]">
                Contacto directo
              </span>
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: 'var(--color-primary)', animationDelay: '0.5s' }}
              />
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-on-surface)] mb-3 tracking-tight">
              ¿Todavía tenés dudas?
            </h3>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-8 max-w-sm mx-auto leading-relaxed opacity-80">
              No hay compromiso. En 15 minutos te cuento exactamente qué conviene para tu caso y cuánto cuesta.
            </p>

            <WhatsAppOutboundLink
              waHref={whatsappUrl('Hola, quiero hablar sobre mi proyecto')}
              className={cn(
                'inline-flex items-center justify-center gap-2 font-semibold select-none mb-5',
                'transition-all duration-200 ease-out',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                'btn-tech btn-primary-tech active:scale-[0.97]',
                'h-12 px-7 text-sm rounded-xl',
              )}
            >
              Hablemos por WhatsApp
              <span className="opacity-70 font-normal">(15 min gratis)</span>
              <ArrowRightIcon className="size-4" />
            </WhatsAppOutboundLink>

            <div className="flex items-center justify-center gap-2">
              <div
                className="h-px w-12 opacity-30"
                style={{ background: 'var(--color-on-surface-variant)' }}
              />
              <p className="text-[11px] text-[var(--color-on-surface-variant)] opacity-50 tracking-wide">
                Respondemos en menos de 2 hs · Lunes a viernes 9-19 hs
              </p>
              <div
                className="h-px w-12 opacity-30"
                style={{ background: 'var(--color-on-surface-variant)' }}
              />
            </div>
          </div>
        </div>
      </SectionReveal>
    </section>
  )
}
