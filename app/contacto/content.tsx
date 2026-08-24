'use client'

import { useRef } from 'react'
import type { CSSProperties } from 'react'
import dynamic from 'next/dynamic'
import {
  m,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { SectionReveal } from '@/components/ui/section-reveal'
import { Skeleton } from '@/components/ui/skeleton'
import { GridBackground } from '@/components/ui/grid-background'
import { SonarWavesBg } from '@/components/ui/sonar-waves-bg'
import { ArrowRightIcon, CheckIcon, WhatsAppIcon } from '@/components/ui/icons'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { WHATSAPP_PHONE_DISPLAY } from '@/lib/constants'
import { WA_GRADIENT, WA_SHADOW_CLASS_LG } from '@/lib/constants/whatsapp-ui'
import { whatsappUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils/cn'
import { WA_MSG_CONTACT_NOW, focusRing } from './shared'

/* ────────────────────────────────────────────────────────────────────────
   Chunks dinámicos — booking (calendario + Supabase) y reviews (GSAP)
   quedan fuera del First Load JS de /contacto: next/dynamic los separa en
   su propio chunk, descargado recién cuando React los renderiza. SSR sigue
   activo (bueno para SEO: el HTML real llega en la primera respuesta), lo
   que sale del bundle es el JS del CLIENTE — ver prueba de cadena de
   imports en la entrega de esta tarea.
   ──────────────────────────────────────────────────────────────────────── */

const BookingCalendar = dynamic(
  () => import('./booking-calendar').then((m) => m.BookingCalendar),
  { ssr: true, loading: () => <BookingCalendarSkeleton /> },
)

const ReviewsSection = dynamic(
  () => import('./reviews-section').then((m) => m.ReviewsSection),
  { ssr: true, loading: () => <ReviewsSectionSkeleton /> },
)

/** Placeholder del panel de agenda — mismo shell (bento-surface--framed +
 *  padding) que el real para que el swap al hidratar no mueva nada (CLS 0).
 *  Solo se ve en navegaciones client-side hacia /contacto; con carga dura
 *  el SSR ya trae el contenido real (ssr: true en el dynamic() de arriba). */
function BookingCalendarSkeleton() {
  return (
    <div
      className="bento-surface bento-surface--framed noise-overlay relative flex h-full flex-col"
      aria-hidden="true"
    >
      <div className="relative z-10 flex h-full flex-1 flex-col p-6 sm:p-7">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="mt-4 h-8 w-4/5" />
        <Skeleton className="mt-2 h-3 w-1/2" />
        <div className="mt-6 flex gap-2">
          {Array.from({ length: 7 }, (_, i) => (
            <Skeleton key={i} className="h-[52px] w-[52px] shrink-0 rounded-xl" />
          ))}
        </div>
        <div className="mt-5 grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-11 rounded-lg" />
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-11 flex-1 rounded-lg" />
          <Skeleton className="h-11 flex-1 rounded-lg" />
        </div>
        <Skeleton className="mt-4 h-[60px] w-full rounded-xl" />
        <Skeleton className="mt-3 h-[52px] w-full rounded-xl" />
        <Skeleton className="mt-auto h-14 w-full rounded-2xl sm:h-16" />
      </div>
    </div>
  )
}

/** Placeholder de la sección de reviews — mismo contenedor y proporciones
 *  (header + 3 filas) que el render real. */
function ReviewsSectionSkeleton() {
  return (
    <section
      className="py-20 md:py-28"
      style={{ backgroundColor: 'var(--color-surface-base)' }}
      aria-hidden="true"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 grid grid-cols-1 items-end gap-8 md:grid-cols-[1.2fr_auto]">
          <div className="max-w-xl">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="mt-5 h-10 w-full max-w-md" />
          </div>
          <Skeleton className="h-16 w-32 md:justify-self-end" />
        </div>
        <div className="space-y-0 divide-y divide-[color:var(--glass-border)]">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="grid grid-cols-[3px_1fr] gap-5 py-8 first:pt-0 last:pb-0">
              <Skeleton className="self-stretch rounded-full" />
              <div>
                <Skeleton className="h-20 w-full" />
                <div className="mt-4 flex items-center gap-3">
                  <Skeleton className="size-11 shrink-0 rounded-full" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Página
   ──────────────────────────────────────────────────────────────────────── */
export function ContactoContent() {
  const headerRef = useRef<HTMLElement>(null)
  const bgCursorRef = useRef({ x: -1, y: -1, active: false })
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: headerRef, offset: ['start start', 'end start'] })
  const headerOpacity = useTransform(scrollYProgress, [0.4, 1], [1, 0])
  const headerMask = useTransform(scrollYProgress, [0.2, 0.8],
    ['linear-gradient(to bottom, black 80%, transparent 100%)',
     'linear-gradient(to bottom, black 0%, transparent 60%)']
  )

  return (
    <>
      {/* ── Header editorial ──────────────────────────────────────────── */}
      <m.section
        ref={headerRef}
        className="relative overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16"
        style={
          prefersReducedMotion
            ? undefined
            : { opacity: headerOpacity, maskImage: headerMask, WebkitMaskImage: headerMask }
        }
        data-hover
        data-inspector-title="Hero que respira con el scroll"
        data-inspector-desc="La cabecera se desvanece al bajar y la máscara suaviza el corte. El fondo de ondas tipo sónar sigue el cursor: anillos que se expanden como un radar, coherente con la idea de 'contacto y alcance'. Todo se apaga con prefers-reduced-motion."
        data-inspector-cat="Performance"
        onMouseMove={(e) => {
          const rect = headerRef.current?.getBoundingClientRect()
          if (rect) bgCursorRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true }
        }}
        onMouseLeave={() => { bgCursorRef.current = { x: -1, y: -1, active: false } }}
      >
        <GridBackground />
        <SonarWavesBg cursorRef={bgCursorRef} />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <SectionReveal>
            <div className="max-w-2xl">
              <p className="editorial-label editorial-label--primary mb-6">Contacto directo</p>
              <h1 className="heading-display heading-display--tight text-balance text-4xl sm:text-5xl md:text-6xl mb-5">
                <span className="block text-[var(--color-on-surface-variant)]">Tenés el proyecto.</span>
                <strong className="block text-[var(--color-on-surface)]">Elegí cómo arrancamos.</strong>
              </h1>
              <p className="text-pretty text-[var(--color-on-surface-variant)] max-w-lg">
                Dos caminos, cero vueltas: me escribís por WhatsApp ahora, o agendás
                una reunión de 15 minutos. Sin formularios eternos.
              </p>
            </div>
          </SectionReveal>
        </div>
      </m.section>

      {/* ── Decisión binaria: WhatsApp ahora · o · agendar ────────────── */}
      <section className="pb-20 md:pb-28" aria-label="Elegí cómo contactarme">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[2fr_auto_3fr] lg:gap-8">
            <WhatsAppNowPanel />

            {/* Divisor "o" — vertical en desktop */}
            <div aria-hidden="true" className="hidden flex-col items-center gap-3 self-stretch py-8 lg:flex">
              <div className="w-px flex-1 bg-gradient-to-b from-transparent via-[rgba(var(--color-primary-rgb),0.3)] to-transparent" />
              <span className="flex size-10 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--color-surface-low)] font-heading text-sm font-extrabold uppercase text-[var(--color-on-surface-variant)]">
                o
              </span>
              <div className="w-px flex-1 bg-gradient-to-b from-transparent via-[rgba(var(--color-primary-rgb),0.3)] to-transparent" />
            </div>

            {/* Divisor "o" — horizontal en mobile */}
            <div aria-hidden="true" className="flex items-center gap-4 lg:hidden">
              <div className="divider-theme flex-1" />
              <span className="flex size-9 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--color-surface-low)] font-heading text-xs font-extrabold uppercase text-[var(--color-on-surface-variant)]">
                o
              </span>
              <div className="divider-theme flex-1" />
            </div>

            <BookingCalendar />
          </div>
        </div>
      </section>

      {/* ── Opiniones (social proof) ──────────────────────────────────── */}
      <ReviewsSection />
    </>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Opción A — WhatsApp ahora (CTA primario de la página)
   ──────────────────────────────────────────────────────────────────────── */
const WA_PANEL_CLAIMS = [
  'Te respondo en menos de 1 hora',
  'Propuesta con alcance, fecha y precio cerrado',
  'Sin compromiso',
] as const

function WhatsAppNowPanel() {
  return (
    <SectionReveal className="h-full">
      {/* Panel de decisión E3: double-bezel (--framed) + grain (.noise-overlay).
          El padding vive en el wrapper interior porque el shell reserva el
          bezel-pad; el z-10 deja el contenido sobre el grain. */}
      <article
        className="bento-surface bento-surface--framed noise-overlay relative flex h-full flex-col"
        data-hover
        data-inspector-title="La vía rápida"
        data-inspector-desc="CTA primario de la página: abre WhatsApp con mensaje prellenado y deja esta pestaña en /gracias. El tracking de conversión vive centralizado en openWhatsAppWithThankYouPage."
        data-inspector-cat="UX · Conversión"
      >
      <div className="relative z-10 flex h-full flex-1 flex-col p-7 sm:p-9">
        {/* Stroke 0.14 solo en dark; en light hereda el 0.34 global (visible sobre porcelana) */}
        <span
          aria-hidden="true"
          className="section-number absolute right-5 top-4 dark:[--sn-stroke-alpha:0.14]"
          style={{ fontSize: '3.25rem' } as CSSProperties}
        >
          01
        </span>

        <p className="editorial-label editorial-label--primary mb-5">La vía rápida</p>

        <h2 className="heading-display text-2xl sm:text-3xl mb-3">
          <span className="text-[var(--color-on-surface-variant)]">WhatsApp, </span>
          <strong className="text-[var(--color-on-surface)]">ahora.</strong>
        </h2>

        <p className="mb-6 max-w-md text-pretty text-sm text-[var(--color-on-surface-variant)]">
          Me contás tu idea con tus palabras, sin campos obligatorios. Yo te
          respondo con los próximos pasos concretos.
        </p>

        <ul className="mb-8 space-y-2.5">
          {WA_PANEL_CLAIMS.map((claim) => (
            <li key={claim} className="flex items-start gap-2.5 text-sm text-[var(--color-on-surface)]">
              <CheckIcon className="mt-0.5 size-4 shrink-0 text-[var(--color-primary)]" />
              {claim}
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <WhatsAppOutboundLink
            waHref={whatsappUrl(WA_MSG_CONTACT_NOW)}
            className={cn(
              'group inline-flex w-full select-none items-center justify-center gap-3',
              'h-14 rounded-2xl px-6 text-base font-bold text-white sm:h-16 sm:text-lg',
              'transition-[transform,box-shadow] duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] motion-reduce:hover:scale-100',
              // Verde sagrado + sombra estándar desde la fuente única (lib/constants/whatsapp-ui)
              WA_SHADOW_CLASS_LG,
              focusRing,
            )}
            style={{ background: WA_GRADIENT }}
            data-hover
            data-inspector-title="Escribirme por WhatsApp"
            data-inspector-desc="Mensaje prellenado contextual de /contacto. Abre wa.me en pestaña nueva y esta queda en /gracias."
            data-inspector-cat="UX · Conversión"
          >
            <WhatsAppIcon className="size-5 sm:size-6" />
            Escribirme por WhatsApp
            <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </WhatsAppOutboundLink>

          <p className="mt-3 text-center text-xs text-[var(--color-on-surface-variant)]">
            <span className="tabular-nums">{WHATSAPP_PHONE_DISPLAY}</span>
            <span aria-hidden="true" className="mx-2 opacity-40">·</span>
            Atiendo yo, no un call center.
          </p>
        </div>
      </div>
      </article>
    </SectionReveal>
  )
}
