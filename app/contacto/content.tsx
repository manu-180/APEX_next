'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import type { CSSProperties } from 'react'
import { SectionReveal } from '@/components/ui/section-reveal'
import { Button } from '@/components/ui/button'
import { GridBackground } from '@/components/ui/grid-background'
import { SonarWavesBg } from '@/components/ui/sonar-waves-bg'
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckIcon,
  StarIcon,
  WhatsAppIcon,
} from '@/components/ui/icons'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import {
  BOOKING_SLOT_HOURS,
  BLOCKED_WEEKDAYS,
  formatBookingHour,
  WHATSAPP_PHONE_DISPLAY,
} from '@/lib/constants'
import { useBooking } from '@/hooks/useBooking'
import { useGsapReveal } from '@/hooks/useGsapReveal'
import { bookingWhatsappLocalToE164, BOOKING_WA_LOCAL_DIGITS } from '@/lib/booking-phone'
import { whatsappUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils/cn'

import { REVIEWS, AVG_RATING, type Review } from '@/lib/data/reviews'

/* ────────────────────────────────────────────────────────────────────────
   Copy / data local de la página
   ──────────────────────────────────────────────────────────────────────── */

/** Mensaje prellenado contextual de /contacto (decisión: arrancar ahora). */
const WA_MSG_CONTACT_NOW =
  'Hola Manuel, tengo un proyecto y quiero arrancar. ¿Lo charlamos?'

/** Las replies viven en la DB (tabla reviews); el dataset estático aún no las
 *  trae. El render ya las soporta: si el día de mañana llegan, se anidan. */
type ReviewReply = { name: string; text: string; date?: string; isAdmin?: boolean }
type ReviewWithReplies = Review & { replies?: ReviewReply[] }
const REVIEW_ITEMS: ReviewWithReplies[] = REVIEWS

/* ────────────────────────────────────────────────────────────────────────
   Clases compartidas
   ──────────────────────────────────────────────────────────────────────── */

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]'

const inputBase =
  'w-full rounded-xl border bg-[var(--color-surface-lowest)] px-4 py-2.5 text-base md:text-sm text-[var(--color-on-surface)] placeholder:text-[color-mix(in_srgb,var(--color-on-surface-variant)_50%,transparent)] outline-none transition-all duration-200'

/* Light: campos blancos nítidos — borde tinta visible y foco con anillo del tema.
   Dark conserva el borde surface-high y el glow original. */
const inputIdle = 'border-[rgba(11,15,26,0.16)] dark:border-[var(--color-surface-high)]'
const inputFocus =
  'focus:border-[rgba(var(--color-primary-rgb),0.5)] focus:shadow-[0_0_0_3px_rgba(var(--color-primary-rgb),0.15)] dark:focus:shadow-[0_0_15px_-3px_rgba(var(--color-primary-rgb),0.2)] focus:ring-0'

const inputClassName = cn(inputBase, inputIdle, inputFocus)

const microLabel =
  'mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-on-surface-variant)]'

/* ────────────────────────────────────────────────────────────────────────
   FormField — micro-interacción de foco (respeta reduced motion)
   ──────────────────────────────────────────────────────────────────────── */
function FormField({ children, className }: { children: React.ReactNode; className?: string }) {
  const [focused, setFocused] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={cn('relative', className)}
      animate={!prefersReducedMotion && focused ? { y: -1 } : { y: 0 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
    >
      {children}
    </motion.div>
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
      <motion.section
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
              <h1 className="heading-display text-balance text-4xl sm:text-5xl md:text-6xl mb-5">
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
      </motion.section>

      {/* ── Decisión binaria: WhatsApp ahora · o · agendar ────────────── */}
      <section className="pb-20 md:pb-28" aria-label="Elegí cómo contactarme">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1.4fr_auto_1fr] lg:gap-8">
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
      <article
        className="bento-surface relative flex h-full flex-col p-7 sm:p-9"
        data-hover
        data-inspector-title="La vía rápida"
        data-inspector-desc="CTA primario de la página: abre WhatsApp con mensaje prellenado y deja esta pestaña en /gracias. El tracking de conversión vive centralizado en openWhatsAppWithThankYouPage."
        data-inspector-cat="UX · Conversión"
      >
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
              'transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]',
              // Light: apoyo navy + verde profundo (patrón .btn-wa); dark conserva el glow original
              'shadow-[0_2px_5px_rgba(24,32,60,0.08),0_14px_30px_-12px_rgba(18,140,126,0.45)] dark:shadow-[0_14px_34px_-12px_rgba(37,211,102,0.5)]',
              focusRing,
            )}
            style={{
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            }}
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
      </article>
    </SectionReveal>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Opción B — Agendar reunión (booking existente, lógica intacta)
   ──────────────────────────────────────────────────────────────────────── */
function BookingCalendar() {
  const {
    supabaseReady,
    selectedDate,
    setSelectedDate,
    selectedHour,
    setSelectedHour,
    loadingSlots,
    slotsError,
    reloadSlots,
    isHourSelectable,
    submitting,
    success,
    submitError,
    setSubmitError,
    confirmBooking,
    reset,
  } = useBooking()

  const prefersReducedMotion = useReducedMotion()
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'email'>('whatsapp')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  /** Solo los 8 dígitos después del 11; +54 9 se arma al enviar. */
  const [waLocalDigits, setWaLocalDigits] = useState('')
  /** Snapshot para la pantalla de éxito (el hook limpia selectedHour al refrescar slots). */
  const [lastBooking, setLastBooking] = useState<{
    date: Date
    hour: number
    method: 'whatsapp' | 'email'
  } | null>(null)

  /** Días disponibles. Se computan recién al montar porque "hoy" depende del
   *  reloj/huso de quien renderiza: el server (UTC) puede estar en otro día que
   *  el visitante y la grilla del SSR no coincidiría con la del cliente
   *  (error de hidratación). Hasta montar, SSR muestra un skeleton estable. */
  const [dates, setDates] = useState<Date[]>([])

  useEffect(() => {
    const days: Date[] = []
    const today = new Date()
    for (let i = 0; i < 21 && days.length < 14; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      if (!BLOCKED_WEEKDAYS.includes(d.getDay())) days.push(d)
    }
    setDates(days)
  }, [])

  /** false en SSR y en el primer render del cliente; true tras montar. Gatea
   *  todo lo que depende de la hora actual o de APIs solo-cliente (Supabase),
   *  para que el HTML del server sea determinístico. */
  const hydrated = dates.length > 0

  const handleSubmit = async () => {
    if (!selectedDate || selectedHour === null) return
    if (contactMethod === 'email' && !contact.trim()) return
    if (contactMethod === 'whatsapp' && waLocalDigits.replace(/\D/g, '').length !== BOOKING_WA_LOCAL_DIGITS)
      return
    setSubmitError(null)
    setLastBooking({ date: selectedDate, hour: selectedHour, method: contactMethod })
    const contactInfo =
      contactMethod === 'whatsapp'
        ? bookingWhatsappLocalToE164(waLocalDigits)!
        : contact.trim()
    await confirmBooking({
      contactInfo,
      contactType: contactMethod,
      name: name.trim() || undefined,
    })
  }

  const isSunday = selectedDate.getDay() === 0
  const waDigitsOk = waLocalDigits.replace(/\D/g, '').length === BOOKING_WA_LOCAL_DIGITS
  const canSubmit =
    supabaseReady &&
    !isSunday &&
    selectedHour !== null &&
    !submitting &&
    (contactMethod === 'email' ? contact.trim().length > 0 : waDigitsOk)

  if (success) {
    return (
      <SectionReveal className="h-full">
        <div
          className="bento-surface flex h-full flex-col items-center justify-center p-8 text-center sm:p-10"
          data-hover
          data-inspector-title="Confirmación de agenda"
          data-inspector-desc="Reserva guardada en Supabase; la notificación sale por email (Resend) o WhatsApp (Evolution API) según el canal elegido."
          data-inspector-cat="UX · Motion"
        >
          <motion.div
            initial={prefersReducedMotion ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="mb-5 flex size-16 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-glow-sm"
          >
            <CheckIcon className="size-8" />
          </motion.div>

          <h3 className="heading-display text-2xl mb-2">
            <strong className="text-[var(--color-on-surface)]">¡Listo, quedó agendado!</strong>
          </h3>

          {lastBooking && (
            <p className="mb-1 text-sm font-semibold capitalize text-[var(--color-primary)]">
              {lastBooking.date.toLocaleDateString('es-AR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
              {' · '}
              <span className="tabular-nums">{formatBookingHour(lastBooking.hour)} hs</span>
            </p>
          )}

          <p className="mb-7 text-sm text-[var(--color-on-surface-variant)]">
            {lastBooking?.method === 'email'
              ? 'Te llega la confirmación por email.'
              : 'Te llega la confirmación por WhatsApp.'}
          </p>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              reset()
              setName('')
              setContact('')
              setWaLocalDigits('')
              setLastBooking(null)
            }}
            type="button"
          >
            Reservar otro turno
          </Button>
        </div>
      </SectionReveal>
    )
  }

  return (
    <SectionReveal className="h-full" delay={0.08}>
      <article
        className="bento-surface relative flex h-full flex-col p-6 sm:p-7"
        data-hover
        data-inspector-title="Panel de agenda"
        data-inspector-desc="Días y horarios sincronizados con Supabase; tiempo real y restricción única evitan la doble reserva. Domingos bloqueados por constantes."
        data-inspector-cat="UX · Motion"
      >
        {/* Stroke 0.14 solo en dark; en light hereda el 0.34 global (visible sobre porcelana) */}
        <span
          aria-hidden="true"
          className="section-number absolute right-5 top-4 dark:[--sn-stroke-alpha:0.14]"
          style={{ fontSize: '3.25rem' } as CSSProperties}
        >
          02
        </span>

        <p className="editorial-label mb-5">Si preferís agendar</p>

        <h2 className="heading-display text-2xl sm:text-3xl mb-1 flex items-center gap-2.5">
          <CalendarIcon className="size-6 shrink-0 text-[var(--color-primary)]" />
          <span>
            <span className="text-[var(--color-on-surface-variant)]">Reunión de 15 min, </span>
            <strong className="text-[var(--color-on-surface)]">gratis.</strong>
          </span>
        </h2>
        <p className="mb-6 text-xs text-[var(--color-on-surface-variant)]">
          Lunes a sábado, de 9 a 19. Sin compromiso.
        </p>

        {/* supabaseReady es siempre false en SSR (el cliente browser lanza sin
            window) y true al hidratar: sin el gate `hydrated`, este banner
            aparecía en el HTML del server y no en el cliente → mismatch. */}
        {hydrated && !supabaseReady && (
          <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-200">
            Falta configurar <code className="rounded bg-[rgba(11,15,26,0.08)] px-1 dark:bg-black/20">NEXT_PUBLIC_SUPABASE_URL</code> y{' '}
            <code className="rounded bg-[rgba(11,15,26,0.08)] px-1 dark:bg-black/20">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> para reservas en vivo.
          </div>
        )}

        {/* Selector de día */}
        <div
          role="group"
          aria-label="Elegí un día"
          className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-3"
        >
          {!hydrated &&
            /* Placeholder SSR: clona la caja del botón real (mismas clases de
               tipografía con texto invisible) para que no haya layout shift. */
            Array.from({ length: 14 }, (_, i) => (
              <div
                key={i}
                aria-hidden="true"
                className="flex min-w-[52px] flex-shrink-0 animate-pulse flex-col items-center rounded-xl border border-transparent bg-[var(--color-surface-high)]/40 px-3 py-2 text-center"
              >
                <span className="invisible text-[10px] font-medium uppercase">lun</span>
                <span className="invisible text-lg font-bold tabular-nums">00</span>
              </div>
            ))}
          {dates.map((d) => {
            const isSelected = selectedDate.toDateString() === d.toDateString()
            const longLabel = d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
            return (
              <motion.button
                key={d.toISOString()}
                type="button"
                whileTap={prefersReducedMotion ? undefined : { scale: 0.93 }}
                onClick={() => setSelectedDate(d)}
                aria-pressed={isSelected}
                aria-label={longLabel}
                className={cn(
                  'flex min-w-[52px] flex-shrink-0 flex-col items-center rounded-xl border px-3 py-2 text-center transition-all',
                  focusRing,
                  isSelected
                    ? 'border-[rgba(var(--color-primary-rgb),0.5)] bg-[rgba(var(--color-primary-rgb),0.12)] text-[var(--color-primary)] shadow-glow-sm'
                    : 'border-[var(--color-surface-high)] text-[var(--color-on-surface-variant)] hover:border-[rgba(var(--color-primary-rgb),0.3)]'
                )}
                data-hover
                data-inspector-title={longLabel}
                data-inspector-desc="Día disponible; domingos excluidos por constantes."
                data-inspector-cat="UX · Motion"
              >
                <span className="text-[10px] font-medium uppercase">
                  {d.toLocaleDateString('es-AR', { weekday: 'short' })}
                </span>
                <span className="text-lg font-bold tabular-nums">{d.getDate()}</span>
              </motion.button>
            )
          })}
        </div>

        {slotsError && (
          <div className="mb-4 flex items-center justify-between gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-200">
            <span>{slotsError}</span>
            <button type="button" className={cn('shrink-0 underline', focusRing)} onClick={reloadSlots}>
              Reintentar
            </button>
          </div>
        )}

        {/* `isSunday` e `isHourSelectable` derivan del reloj (selectedDate nace
            de new Date() y los horarios de hoy se filtran por la hora actual):
            en SSR se muestra siempre el skeleton para no divergir del cliente. */}
        {hydrated && isSunday ? (
          <div className="mb-5 rounded-xl border border-[var(--color-surface-high)] bg-[var(--color-surface-lowest)]/50 py-8 text-center text-sm text-[var(--color-on-surface-variant)]">
            Los domingos descanso. Elegí otro día.
          </div>
        ) : (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className={cn(microLabel, 'mb-0')}>Horario</p>
              <div className="flex items-center gap-3 text-[10px] text-[var(--color-on-surface-variant)]">
                <span className="inline-flex items-center gap-1">
                  <span className="size-2 rounded-sm bg-[var(--color-surface-high)]" /> Ocupado
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="size-2 rounded-sm bg-[rgba(var(--color-primary-rgb),0.4)]" /> Libre
                </span>
              </div>
            </div>
            {!hydrated || loadingSlots ? (
              <div className="mb-5 grid grid-cols-4 gap-2">
                {BOOKING_SLOT_HOURS.map((h) => (
                  <div key={h} className="h-10 animate-pulse rounded-lg bg-[var(--color-surface-high)]/40" />
                ))}
              </div>
            ) : (
              <div role="group" aria-label="Horarios disponibles" className="mb-5 grid grid-cols-4 gap-2">
                {BOOKING_SLOT_HOURS.map((h) => {
                  const ok = isHourSelectable(h)
                  const sel = selectedHour === h
                  return (
                    <motion.button
                      key={h}
                      type="button"
                      disabled={!ok}
                      onClick={() => ok && setSelectedHour(h)}
                      whileHover={!prefersReducedMotion && ok && !sel ? { scale: 1.04 } : undefined}
                      whileTap={!prefersReducedMotion && ok ? { scale: 0.95 } : undefined}
                      transition={{ duration: 0.12 }}
                      aria-pressed={sel}
                      aria-label={`${formatBookingHour(h)}${ok ? '' : ' — no disponible'}`}
                      className={cn(
                        'rounded-lg border px-2 py-2 text-xs font-medium transition-colors',
                        focusRing,
                        !ok && 'cursor-not-allowed opacity-40 line-through',
                        ok && !sel && 'border-[var(--color-surface-high)] text-[var(--color-on-surface-variant)] hover:border-[rgba(var(--color-primary-rgb),0.3)]',
                        sel && 'border-[rgba(var(--color-primary-rgb),0.5)] bg-[rgba(var(--color-primary-rgb),0.12)] text-[var(--color-primary)] shadow-glow-sm'
                      )}
                      data-hover
                      data-inspector-title={`${formatBookingHour(h)}${ok ? '' : ' (no disponible)'}`}
                      data-inspector-cat="UX · Motion"
                    >
                      {formatBookingHour(h)}
                    </motion.button>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Canal de confirmación */}
        <p className={microLabel} id="booking-channel-label">
          ¿Por dónde te confirmo?
        </p>
        <div role="group" aria-labelledby="booking-channel-label" className="mb-4 flex gap-2">
          {(['whatsapp', 'email'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setContactMethod(m)
                setSubmitError(null)
              }}
              aria-pressed={contactMethod === m}
              className={cn(
                'flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-all',
                focusRing,
                contactMethod === m
                  ? 'border-[rgba(var(--color-primary-rgb),0.5)] bg-[rgba(var(--color-primary-rgb),0.12)] text-[var(--color-primary)]'
                  : 'border-[var(--color-surface-high)] text-[var(--color-on-surface-variant)]'
              )}
              data-hover
              data-inspector-title={m === 'whatsapp' ? 'Canal: WhatsApp' : 'Canal: Email'}
              data-inspector-cat="UX · Motion"
            >
              {m === 'whatsapp' ? 'WhatsApp' : 'Email'}
            </button>
          ))}
        </div>

        {/* Nombre (opcional) */}
        <FormField className="mb-3">
          <label htmlFor="booking-name" className={microLabel}>
            Tu nombre <span className="opacity-60">(opcional)</span>
          </label>
          <input
            id="booking-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="¿Cómo te llamo?"
            className={inputClassName}
            autoComplete="name"
          />
        </FormField>

        {/* Contacto según canal */}
        <AnimatePresence mode="wait" initial={false}>
          {contactMethod === 'whatsapp' ? (
            <motion.div
              key="wa"
              initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="mb-3"
            >
              <FormField>
                <label htmlFor="booking-wa" className={microLabel}>
                  Tu WhatsApp
                </label>
                <div
                  className={cn(
                    inputBase,
                    'flex items-stretch gap-0 overflow-hidden px-0 py-0',
                    inputIdle,
                    'focus-within:border-[rgba(var(--color-primary-rgb),0.5)] focus-within:shadow-[0_0_0_3px_rgba(var(--color-primary-rgb),0.15)] dark:focus-within:shadow-[0_0_15px_-3px_rgba(var(--color-primary-rgb),0.2)]'
                  )}
                >
                  <span
                    className="flex shrink-0 items-center pl-4 pr-1 text-sm font-semibold tabular-nums text-[var(--color-primary)]"
                    aria-hidden
                  >
                    11
                  </span>
                  <input
                    id="booking-wa"
                    value={waLocalDigits}
                    onChange={(e) => {
                      const x = e.target.value.replace(/\D/g, '').slice(0, BOOKING_WA_LOCAL_DIGITS)
                      setWaLocalDigits(x)
                    }}
                    placeholder="24842720"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    className="min-w-0 flex-1 border-0 bg-transparent py-2.5 pr-4 text-base text-[var(--color-on-surface)] outline-none placeholder:text-[color-mix(in_srgb,var(--color-on-surface-variant)_50%,transparent)] md:text-sm"
                    aria-describedby="booking-wa-help"
                  />
                </div>
              </FormField>
              <p id="booking-wa-help" className="mt-1.5 text-[11px] text-[var(--color-on-surface-variant)]">
                Solo los {BOOKING_WA_LOCAL_DIGITS} dígitos después del 11. Te confirmo al toque.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="email"
              initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="mb-3"
            >
              <FormField>
                <label htmlFor="booking-email" className={microLabel}>
                  Tu email
                </label>
                <input
                  id="booking-email"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="nombre@correo.com"
                  type="email"
                  className={inputClassName}
                  autoComplete="email"
                />
              </FormField>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error de envío */}
        <AnimatePresence>
          {submitError && (
            <motion.p
              role="alert"
              initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="mb-3 text-xs font-medium text-red-500 dark:text-red-400"
            >
              {submitError}
            </motion.p>
          )}
        </AnimatePresence>

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          variant="primary"
          className="mt-auto w-full"
          type="button"
          data-hover
          data-inspector-title="Confirmar reunión"
          data-inspector-cat="UX · Formulario"
        >
          {submitting ? 'Reservando…' : 'Confirmar turno gratis'}
          <ArrowRightIcon className="size-4" />
        </Button>
      </article>
    </SectionReveal>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Opiniones — social proof con jerarquía de estrellas en Amber
   ──────────────────────────────────────────────────────────────────────── */
function ReviewsSection() {
  const listRef = useRef<HTMLDivElement>(null)
  const hasReviews = REVIEW_ITEMS.length > 0
  const filledStars = Math.round(Number(AVG_RATING))

  // Stagger GSAP sobre cada reseña (el hook respeta prefers-reduced-motion)
  useGsapReveal(listRef, {
    selector: '[data-review-item]',
    y: 32,
    stagger: 0.12,
    start: 'top 80%',
  })

  return (
    <section className="py-20 md:py-28" style={{ backgroundColor: 'var(--color-surface-base)' }}>
      <div className="mx-auto max-w-5xl px-6">
        {/* Header asimétrico: título a la izquierda, rating gigante a la derecha */}
        <SectionReveal>
          <div className="mb-14 grid grid-cols-1 items-end gap-8 md:grid-cols-[1.2fr_auto]">
            <div className="max-w-xl">
              <p className="editorial-label mb-5">Opiniones</p>
              <h2 className="heading-display text-balance text-3xl sm:text-4xl">
                <span className="text-[var(--color-on-surface-variant)]">No lo digo yo. </span>
                <strong className="text-[var(--color-on-surface)]">Lo dicen ellos.</strong>
              </h2>
            </div>

            {hasReviews && (
              <div className="flex items-end gap-4 md:justify-end">
                <span
                  aria-hidden="true"
                  className="section-number leading-none"
                  style={{ '--sn-stroke-alpha': '0.5', fontSize: 'clamp(3.5rem, 7vw, 5.5rem)' } as CSSProperties}
                >
                  {AVG_RATING}
                </span>
                <div className="pb-1.5">
                  <div
                    className="flex"
                    role="img"
                    aria-label={`Promedio ${AVG_RATING} de 5 estrellas, ${REVIEW_ITEMS.length} opiniones`}
                  >
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarIcon
                        key={s}
                        className="size-5 text-amber-400 dark:drop-shadow-[0_0_5px_rgba(251,191,36,0.45)]"
                        filled={s <= filledStars}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-[var(--color-on-surface-variant)]">
                    {REVIEW_ITEMS.length} opiniones reales
                  </p>
                </div>
              </div>
            )}
          </div>
        </SectionReveal>

        {!hasReviews ? (
          /* Estado vacío honesto */
          <SectionReveal>
            <div className="bento-surface p-10 text-center sm:p-14">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[rgba(251,191,36,0.12)]">
                <StarIcon className="size-6 text-amber-400" filled={false} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-[var(--color-on-surface)]">
                Todavía no hay opiniones publicadas.
              </h3>
              <p className="mx-auto mb-6 max-w-md text-sm text-[var(--color-on-surface-variant)]">
                Las primeras reseñas están en camino. Mientras tanto, contame tu
                proyecto y comprobalo de primera mano.
              </p>
              <WhatsAppOutboundLink
                waHref={whatsappUrl(WA_MSG_CONTACT_NOW)}
                className={cn(
                  'inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline',
                  focusRing,
                )}
              >
                <WhatsAppIcon className="size-4" />
                Escribime y sé el primero
              </WhatsAppOutboundLink>
            </div>
          </SectionReveal>
        ) : (
          /* Lista editorial con stagger GSAP */
          <div
            ref={listRef}
            className="space-y-0 divide-y"
            style={{ borderColor: 'var(--glass-border)' }}
            data-hover
            data-inspector-title="Reviews editoriales con GSAP"
            data-inspector-desc="Cada reseña entra escalonada (stagger 120ms) con ScrollTrigger de GSAP. La animación respeta prefers-reduced-motion."
            data-inspector-cat="Animación · GSAP"
          >
            {REVIEW_ITEMS.map((r) => (
              <article
                key={r.id}
                data-review-item
                className="grid grid-cols-[3px_1fr] gap-5 py-8 first:pt-0 last:pb-0"
              >
                {/* Barra de acento del tema */}
                <div
                  className="self-stretch rounded-full"
                  style={{ background: 'var(--color-primary)' }}
                  aria-hidden
                />

                <div>
                  {/* Texto de la reseña */}
                  <p className="mb-4 text-pretty text-base leading-relaxed text-[var(--color-on-surface)]">
                    <span
                      className="mr-1 align-text-bottom font-heading text-3xl font-extrabold leading-none"
                      style={{ color: 'var(--color-primary)' }}
                      aria-hidden
                    >
                      &ldquo;
                    </span>
                    {r.text}
                  </p>

                  {/* Autor */}
                  <div className="flex items-start gap-3">
                    <div
                      className="flex size-11 flex-shrink-0 items-center justify-center rounded-full text-base font-extrabold ring-2 ring-offset-2 ring-offset-[var(--color-surface-base)]"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.18), rgba(var(--color-primary-rgb), 0.06))',
                        color: 'var(--color-primary)',
                        // @ts-expect-error CSS var en propiedad nativa
                        '--tw-ring-color': 'rgba(var(--color-primary-rgb), 0.35)',
                      }}
                      aria-hidden
                    >
                      {r.name[0]}
                    </div>

                    <div className="flex min-w-0 flex-col gap-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-[var(--color-on-surface)]">{r.name}</span>
                        <span className="text-[var(--color-on-surface-variant)] opacity-40" aria-hidden>·</span>

                        <div
                          className="flex"
                          role="img"
                          aria-label={`${r.rating} de 5 estrellas`}
                        >
                          {[1, 2, 3, 4, 5].map((s) => (
                            <StarIcon key={s} className="size-3 text-amber-400" filled={s <= r.rating} />
                          ))}
                        </div>

                        <span className="text-[var(--color-on-surface-variant)] opacity-40" aria-hidden>·</span>
                        <time
                          dateTime={r.date}
                          className="text-xs tabular-nums text-[var(--color-on-surface-variant)] opacity-60"
                        >
                          {new Date(r.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'short' })}
                        </time>
                      </div>

                      {r.role && (
                        <span className="text-xs text-[var(--color-on-surface-variant)] opacity-75">
                          {r.role}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Replies anidadas (cuando el dataset las traiga) */}
                  {r.replies && r.replies.length > 0 && (
                    <div
                      className="mt-5 space-y-4 border-l-2 pl-5"
                      style={{ borderColor: 'rgba(var(--color-primary-rgb), 0.25)' }}
                    >
                      {r.replies.map((reply, i) => (
                        <div key={i} className="text-sm">
                          <p className="mb-1 flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-[var(--color-on-surface)]">{reply.name}</span>
                            {reply.isAdmin && (
                              <span className="rounded-md bg-[rgba(var(--color-primary-rgb),0.12)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                                Respuesta
                              </span>
                            )}
                            {reply.date && (
                              <time
                                dateTime={reply.date}
                                className="text-xs tabular-nums text-[var(--color-on-surface-variant)] opacity-60"
                              >
                                {new Date(reply.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'short' })}
                              </time>
                            )}
                          </p>
                          <p className="text-pretty leading-relaxed text-[var(--color-on-surface-variant)]">
                            {reply.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
