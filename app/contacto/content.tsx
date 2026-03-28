'use client'

import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { SectionReveal } from '@/components/ui/section-reveal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GridBackground } from '@/components/ui/grid-background'
import { SonarWavesBg } from '@/components/ui/sonar-waves-bg'
import {
  CalendarIcon,
  SendIcon,
  StarIcon,
  CheckIcon,
  WhatsAppIcon,
  ArrowRightIcon,
} from '@/components/ui/icons'
import { BOOKING_SLOT_HOURS, BLOCKED_WEEKDAYS, formatBookingHour } from '@/lib/constants'
import { useBooking } from '@/hooks/useBooking'
import { useGsapReveal } from '@/hooks/useGsapReveal'
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { whatsappUrl, WA_MSG_NAV } from '@/lib/whatsapp'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { bookingWhatsappLocalToE164, BOOKING_WA_LOCAL_DIGITS } from '@/lib/booking-phone'
import { cn } from '@/lib/utils/cn'

// Mock reviews data (in production, comes from Supabase)
const REVIEWS = [
  { id: 1, name: 'Sebastián M.', rating: 5, text: 'Excelente profesional. Entregó mi app antes de tiempo y con calidad impecable.', date: '2025-11-12' },
  { id: 2, name: 'Laura P.', rating: 5, text: 'La landing que me hizo duplicó mis consultas en el primer mes. Recomendado 100%.', date: '2025-10-28' },
  { id: 3, name: 'Martín G.', rating: 5, text: 'Gran capacidad técnica y excelente comunicación. Mi app funciona perfecto en ambas tiendas.', date: '2025-09-15' },
  { id: 4, name: 'Carolina D.', rating: 4, text: 'Muy satisfecha con el resultado. Atención personalizada y cumplimiento de plazos.', date: '2025-08-22' },
  { id: 5, name: 'Nicolás R.', rating: 5, text: 'BotLode es un producto increíble. Manuel entiende el problema antes de programar.', date: '2025-07-10' },
]

const AVG_RATING = (REVIEWS.reduce((a, r) => a + r.rating, 0) / REVIEWS.length).toFixed(1)

/* ────────────────────────────────────────────────────────────────────────
   Shared input class — used for all fields in both forms
   ──────────────────────────────────────────────────────────────────────── */
const inputBase =
  'w-full rounded-xl border bg-[var(--color-surface-lowest)] px-4 py-2.5 text-sm text-[var(--color-on-surface)] placeholder:text-[color-mix(in_srgb,var(--color-on-surface-variant)_50%,transparent)] outline-none transition-all duration-200'

const inputIdle = 'border-[var(--color-surface-high)]'
const inputFocus = 'focus:border-[rgba(var(--color-primary-rgb),0.5)] focus:shadow-[0_0_15px_-3px_rgba(var(--color-primary-rgb),0.2)] focus:ring-0'

const inputClassName = cn(inputBase, inputIdle, inputFocus)

/* ────────────────────────────────────────────────────────────────────────
   FormField — adds motion micro-interaction on focus for each input
   ──────────────────────────────────────────────────────────────────────── */
function FormField({ children, className }: { children: React.ReactNode; className?: string }) {
  const [focused, setFocused] = useState(false)

  return (
    <motion.div
      className={cn('relative', className)}
      animate={focused ? { y: -1 } : { y: 0 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
    >
      {children}
    </motion.div>
  )
}

export function ContactoContent() {
  const headerRef = useRef<HTMLElement>(null)
  const bgCursorRef = useRef({ x: -1, y: -1, active: false })
  const { scrollYProgress } = useScroll({ target: headerRef, offset: ['start start', 'end start'] })
  const headerOpacity = useTransform(scrollYProgress, [0.4, 1], [1, 0])
  const headerMask = useTransform(scrollYProgress, [0.2, 0.8],
    ['linear-gradient(to bottom, black 80%, transparent 100%)',
     'linear-gradient(to bottom, black 0%, transparent 60%)']
  )

  return (
    <>
      {/* ── Header ────────────────────────────────────────────────────── */}
      <motion.section
        ref={headerRef}
        className="relative pt-20 pb-10 overflow-hidden"
        style={{
          opacity: headerOpacity,
          maskImage: headerMask,
          WebkitMaskImage: headerMask,
        }}
        data-hover
        data-inspector-title="Hero que respira con el scroll"
        data-inspector-desc="Esta cabecera se desvanece al bajar y la máscara suaviza el corte con el contenido. El fondo de ondas tipo sónar sigue el cursor: anillos que se expanden como un radar, coherente con la idea de 'contacto y alcance'."
        data-inspector-cat="Performance"
        onMouseMove={(e) => {
          const rect = headerRef.current?.getBoundingClientRect()
          if (rect) bgCursorRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true }
        }}
        onMouseLeave={() => { bgCursorRef.current = { x: -1, y: -1, active: false } }}
      >
        <GridBackground />
        <SonarWavesBg cursorRef={bgCursorRef} />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <SectionReveal>
            <div className="max-w-2xl">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge variant="primary">Contacto</Badge>
                <Badge variant="outline">Respuesta &lt; 2 hs</Badge>
              </div>
              <h1 className="font-heading text-balance leading-tight mb-4">
                <span className="block text-3xl sm:text-4xl md:text-5xl font-extralight text-[var(--color-on-surface-variant)]">
                  Hablemos
                </span>
                <span className="block text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-on-surface)]">
                  de tu proyecto.
                </span>
              </h1>
              <p className="text-pretty text-[var(--color-on-surface-variant)] max-w-md">
                Agendá una reunión gratuita o mandame un mensaje. Sin formularios kilométricos.
              </p>
            </div>
          </SectionReveal>
        </div>
      </motion.section>

      {/* ── Booking + Form ──────────────────────────────────────────────── */}
      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <BookingCalendar />
          <ContactForm />
        </div>
      </section>

      {/* ── Reviews — editorial layout ──────────────────────────────────── */}
      <ReviewsSection />
    </>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   ReviewsSection — editorial style with GSAP ScrollTrigger stagger
   ──────────────────────────────────────────────────────────────────────── */
function ReviewsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // GSAP stagger on the review items
  useGsapReveal(listRef, {
    selector: '[data-review-item]',
    y: 32,
    stagger: 0.12,
    start: 'top 80%',
  })

  return (
    <section
      ref={sectionRef}
      className="py-24"
      style={{ backgroundColor: 'var(--color-surface-base)' }}
    >
      <div className="mx-auto max-w-4xl px-6">
        {/* Section header — asymmetric */}
        <SectionReveal>
          <div className="max-w-xl mb-14">
            <Badge variant="primary" className="mb-4">Opiniones</Badge>
            <h2 className="font-heading text-balance leading-tight mb-3">
              <span className="text-2xl sm:text-3xl font-extralight text-[var(--color-on-surface-variant)]">Lo que dicen </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[var(--color-on-surface)]">mis clientes</span>
            </h2>
            {/* Rating summary inline */}
            <div className="flex items-center gap-2">
              <div className="flex" aria-label={`${AVG_RATING} de 5 estrellas`}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon
                    key={s}
                    className="size-4 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.4)]"
                    filled={s <= Math.round(Number(AVG_RATING))}
                  />
                ))}
              </div>
              <span className="text-base font-bold tabular-nums text-[var(--color-on-surface)]">{AVG_RATING}</span>
              <span className="text-sm text-[var(--color-on-surface-variant)]">({REVIEWS.length} opiniones)</span>
            </div>
          </div>
        </SectionReveal>

        {/* Review list — editorial / quote style */}
        <div
          ref={listRef}
          className="space-y-0 divide-y"
          style={{ borderColor: 'var(--glass-border)' }}
          data-hover
          data-inspector-title="Reviews editoriales con GSAP"
          data-inspector-desc="Cada reseña entra escalonada (stagger 120ms) con ScrollTrigger de GSAP. La animación respeta prefers-reduced-motion."
          data-inspector-cat="Animación · GSAP"
        >
          {REVIEWS.map((r) => (
            <article
              key={r.id}
              data-review-item
              className="py-8 first:pt-0 last:pb-0 grid grid-cols-[3px_1fr] gap-5"
            >
              {/* Accent bar */}
              <div
                className="rounded-full self-stretch"
                style={{ background: 'var(--color-primary)' }}
                aria-hidden
              />

              <div>
                {/* Quote text */}
                <p className="text-pretty text-base text-[var(--color-on-surface)] leading-relaxed mb-4">
                  <span
                    className="font-heading text-3xl font-extrabold leading-none mr-1 align-text-bottom"
                    style={{ color: 'var(--color-primary)' }}
                    aria-hidden
                  >
                    &ldquo;
                  </span>
                  {r.text}
                </p>

                {/* Author row */}
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className="size-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      backgroundColor: 'rgba(var(--color-primary-rgb), 0.12)',
                      color: 'var(--color-primary)',
                    }}
                    aria-hidden
                  >
                    {r.name[0]}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-[var(--color-on-surface)]">{r.name}</span>
                    <span className="text-[var(--color-on-surface-variant)] opacity-40" aria-hidden>·</span>

                    {/* Stars */}
                    <div className="flex" aria-label={`${r.rating} de 5 estrellas`}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <StarIcon
                          key={s}
                          className="size-3 text-amber-400"
                          filled={s <= r.rating}
                        />
                      ))}
                    </div>

                    <span className="text-[var(--color-on-surface-variant)] opacity-40" aria-hidden>·</span>
                    <time
                      dateTime={r.date}
                      className="text-xs text-[var(--color-on-surface-variant)] opacity-60 tabular-nums"
                    >
                      {new Date(r.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'short' })}
                    </time>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   BookingCalendar — all Supabase logic preserved, motion micro-interactions added
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

  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'email'>('whatsapp')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  /** Solo los 8 dígitos después del 11; +54 9 se arma al enviar. */
  const [waLocalDigits, setWaLocalDigits] = useState('')

  const dates = useMemo(() => {
    const days: Date[] = []
    const today = new Date()
    for (let i = 0; i < 21 && days.length < 14; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      if (!BLOCKED_WEEKDAYS.includes(d.getDay())) days.push(d)
    }
    return days
  }, [])

  const handleSubmit = async () => {
    if (!selectedDate || selectedHour === null) return
    if (contactMethod === 'email' && !contact.trim()) return
    if (contactMethod === 'whatsapp' && waLocalDigits.replace(/\D/g, '').length !== BOOKING_WA_LOCAL_DIGITS)
      return
    setSubmitError(null)
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
      <SectionReveal>
        <div
          className="rounded-2xl glass-card glow-border-active p-8 text-center"
          data-hover
          data-inspector-title="Confirmación de agenda"
          data-inspector-desc="Reserva guardada en Supabase; notificación por email (Resend) o plantilla WhatsApp (Twilio) según el canal."
          data-inspector-cat="UX · Motion"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
          >
            <CheckIcon className="size-8" />
          </motion.div>
          <h3 className="text-xl font-bold text-[var(--color-on-surface)] mb-2">¡Reunión agendada!</h3>
          <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
            Te contactaré brevemente para confirmar los detalles.
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              reset()
              setName('')
              setContact('')
              setWaLocalDigits('')
            }}
            type="button"
          >
            Agendar otra
          </Button>
        </div>
      </SectionReveal>
    )
  }

  return (
    <SectionReveal>
      <div
        className="rounded-2xl glass-card glow-border p-6"
        data-hover
        data-inspector-title="Panel de agenda"
        data-inspector-desc="Días y horarios sincronizados con Supabase; tiempo real y restricción única evitan doble reserva."
        data-inspector-cat="UX · Motion"
      >
        <h3 className="text-lg font-bold text-[var(--color-on-surface)] mb-1 flex items-center gap-2">
          <CalendarIcon className="size-5 text-[var(--color-primary)]" />
          Agenda inteligente
        </h3>
        <p className="text-xs text-[var(--color-on-surface-variant)] mb-5">Seleccioná fecha y horario</p>

        {!supabaseReady && (
          <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            Falta configurar <code className="rounded bg-black/20 px-1">NEXT_PUBLIC_SUPABASE_URL</code> y{' '}
            <code className="rounded bg-black/20 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> para reservas en vivo.
          </div>
        )}

        {/* Date picker */}
        <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-5">
          {dates.map((d) => {
            const isSelected = selectedDate.toDateString() === d.toDateString()
            return (
              <motion.button
                key={d.toISOString()}
                type="button"
                whileTap={{ scale: 0.93 }}
                onClick={() => setSelectedDate(d)}
                className={cn(
                  'flex-shrink-0 flex flex-col items-center rounded-xl px-3 py-2 text-center transition-all border min-w-[52px]',
                  isSelected
                    ? 'border-[rgba(var(--color-primary-rgb),0.5)] bg-[rgba(var(--color-primary-rgb),0.12)] text-[var(--color-primary)] shadow-glow-sm'
                    : 'border-[var(--color-surface-high)] hover:border-[rgba(var(--color-primary-rgb),0.3)] text-[var(--color-on-surface-variant)]'
                )}
                data-hover
                data-inspector-title={d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' })}
                data-inspector-desc="Día disponible; domingos excluidos por constantes."
                data-inspector-cat="UX · Motion"
              >
                <span className="text-[10px] uppercase font-medium">
                  {d.toLocaleDateString('es-AR', { weekday: 'short' })}
                </span>
                <span className="text-lg font-bold tabular-nums">{d.getDate()}</span>
              </motion.button>
            )
          })}
        </div>

        {slotsError && (
          <div className="mb-4 flex items-center justify-between gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            <span>{slotsError}</span>
            <button type="button" className="shrink-0 underline" onClick={reloadSlots}>
              Reintentar
            </button>
          </div>
        )}

        {isSunday ? (
          <div className="mb-5 rounded-xl border border-[var(--color-surface-high)] bg-[var(--color-surface-lowest)]/50 py-8 text-center text-sm text-[var(--color-on-surface-variant)]">
            Domingos cerrados por descanso.
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-[var(--color-on-surface-variant)]">Horario</p>
              <div className="flex items-center gap-3 text-[10px] text-[var(--color-on-surface-variant)]">
                <span className="inline-flex items-center gap-1">
                  <span className="size-2 rounded-sm bg-[var(--color-surface-high)]" /> Ocupado
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="size-2 rounded-sm bg-[rgba(var(--color-primary-rgb),0.4)]" /> Libre
                </span>
              </div>
            </div>
            {loadingSlots ? (
              <div className="mb-5 grid grid-cols-4 gap-2">
                {BOOKING_SLOT_HOURS.map((h) => (
                  <div key={h} className="h-10 animate-pulse rounded-lg bg-[var(--color-surface-high)]/40" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 mb-5">
                {BOOKING_SLOT_HOURS.map((h) => {
                  const ok = isHourSelectable(h)
                  const sel = selectedHour === h
                  return (
                    <motion.button
                      key={h}
                      type="button"
                      disabled={!ok}
                      onClick={() => ok && setSelectedHour(h)}
                      whileHover={ok && !sel ? { scale: 1.04 } : {}}
                      whileTap={ok ? { scale: 0.95 } : {}}
                      transition={{ duration: 0.12 }}
                      className={cn(
                        'rounded-lg border px-2 py-2 text-xs font-medium transition-colors',
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

        {/* Contact method toggle */}
        <div className="flex gap-2 mb-4">
          {(['whatsapp', 'email'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setContactMethod(m)
                setSubmitError(null)
              }}
              className={cn(
                'flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-all capitalize',
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

        {/* Name field */}
        <FormField className="mb-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre (opcional)"
            className={inputClassName}
            autoComplete="name"
          />
        </FormField>

        {/* Contact field */}
        <AnimatePresence mode="wait">
          {contactMethod === 'whatsapp' ? (
            <motion.div
              key="wa"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="mb-3"
            >
              <FormField>
                <div
                  className={cn(
                    inputBase,
                    'flex items-stretch gap-0 overflow-hidden px-0 py-0',
                    'border-[var(--color-surface-high)]',
                    'focus-within:border-[rgba(var(--color-primary-rgb),0.5)] focus-within:shadow-[0_0_15px_-3px_rgba(var(--color-primary-rgb),0.2)]'
                  )}
                >
                  <span
                    className="flex shrink-0 items-center pl-4 pr-1 text-sm font-semibold tabular-nums text-[var(--color-primary)]"
                    aria-hidden
                  >
                    11
                  </span>
                  <input
                    value={waLocalDigits}
                    onChange={(e) => {
                      const x = e.target.value.replace(/\D/g, '').slice(0, BOOKING_WA_LOCAL_DIGITS)
                      setWaLocalDigits(x)
                    }}
                    placeholder="34272488"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    className="min-w-0 flex-1 border-0 bg-transparent py-2.5 pr-4 text-sm text-[var(--color-on-surface)] outline-none placeholder:text-[color-mix(in_srgb,var(--color-on-surface-variant)_50%,transparent)]"
                    aria-label="Número de celular sin código de área (8 dígitos)"
                  />
                </div>
              </FormField>
              <p className="mt-1.5 text-[11px] text-[var(--color-on-surface-variant)]">
                Completá los {BOOKING_WA_LOCAL_DIGITS} dígitos de tu celular; se arma +54 9 11… automáticamente.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="email"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="mb-3"
            >
              <FormField>
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Tu email"
                  type="email"
                  className={inputClassName}
                  autoComplete="email"
                />
              </FormField>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit error */}
        <AnimatePresence>
          {submitError && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="mb-3 text-xs font-medium text-red-400"
            >
              {submitError}
            </motion.p>
          )}
        </AnimatePresence>

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          variant="primary"
          className="w-full"
          type="button"
          data-hover
          data-inspector-title="Confirmar reunión"
          data-inspector-cat="UX · Formulario"
        >
          {submitting ? 'Reservando…' : 'Agendar reunión'}
          <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    </SectionReveal>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   ContactForm — all logic preserved, field micro-interactions added
   ──────────────────────────────────────────────────────────────────────── */
function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    const name = form.name.trim()
    const email = form.email.trim()
    const message = form.message.trim()
    if (name.length < 2) {
      setFormError('El nombre debe tener al menos 2 caracteres.')
      return
    }
    if (!email || !message) return
    if (message.length < 10) {
      setFormError('El mensaje debe tener al menos 10 caracteres.')
      return
    }
    if (!isSupabaseConfigured()) {
      setFormError('Falta configurar Supabase (variables NEXT_PUBLIC_SUPABASE_*).')
      return
    }
    setSending(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: { name, email, message },
      })
      if (error) throw error
      setSent(true)
    } catch {
      setFormError('No pudimos enviar el mensaje. Intentá de nuevo.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <SectionReveal delay={0.1}>
        <div
          className="rounded-2xl glass-card glow-border-active p-8 text-center h-full flex flex-col items-center justify-center"
          data-hover
          data-inspector-title="Mensaje enviado"
          data-inspector-desc="Edge Function send-contact-email (Resend): copia al visitante y notificación al administrador."
          data-inspector-cat="UX · Formulario"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
          >
            <SendIcon className="size-7" />
          </motion.div>
          <h3 className="text-xl font-bold text-[var(--color-on-surface)] mb-2">¡Mensaje enviado!</h3>
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            Te respondo en menos de 24 horas.
          </p>
        </div>
      </SectionReveal>
    )
  }

  return (
    <SectionReveal delay={0.1}>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl glass-card glow-border p-6 h-full flex flex-col"
        data-hover
        data-inspector-title="Formulario de mensaje directo"
        data-inspector-desc="Nombre, email y mensaje; envío por submit nativo interceptado en React. El botón de WhatsApp al lado abre conversación externa sin abandonar el layout."
        data-inspector-cat="UX · Formulario"
      >
        <h3 className="text-lg font-bold text-[var(--color-on-surface)] mb-1 flex items-center gap-2">
          <SendIcon className="size-5 text-[var(--color-primary)]" />
          Mensaje directo
        </h3>
        <p className="text-xs text-[var(--color-on-surface-variant)] mb-5">O escribime directamente</p>

        <FormField className="mb-3">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Tu nombre *"
            required
            minLength={2}
            className={inputClassName}
            autoComplete="name"
            data-hover
            data-inspector-title="Nombre"
            data-inspector-desc="Requerido por la función de envío (mín. 2 caracteres). El campo se eleva sutilmente al recibir foco — Framer Motion y: -1."
            data-inspector-cat="UX · Formulario"
          />
        </FormField>

        <FormField className="mb-3">
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Tu email *"
            type="email"
            required
            className={inputClassName}
            autoComplete="email"
            data-hover
            data-inspector-title="Email *"
            data-inspector-desc="Campo requerido con tipo email nativo: el navegador valida formato básico antes de disparar el submit."
            data-inspector-cat="UX · Formulario"
          />
        </FormField>

        <FormField className="mb-3 flex-1">
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Contame sobre tu proyecto *"
            required
            minLength={10}
            rows={5}
            className={cn(inputClassName, 'h-full resize-none')}
            data-hover
            data-inspector-title="Mensaje *"
            data-inspector-desc="Mínimo 10 caracteres para coincidir con la Edge Function."
            data-inspector-cat="UX · Formulario"
          />
        </FormField>

        {/* Form error — animated */}
        <AnimatePresence>
          {formError && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="mb-3 text-xs font-medium text-red-400"
            >
              {formError}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            className={cn(
              'flex-1',
              'h-12 px-7 text-sm rounded-xl',
              'transition-all duration-200 ease-out',
            )}
            disabled={sending}
            data-hover
            data-inspector-title="Enviar mensaje"
            data-inspector-desc="Invoca send-contact-email en Supabase."
            data-inspector-cat="UX · Formulario"
          >
            {sending ? 'Enviando…' : 'Enviar mensaje'}
            <SendIcon className="size-4" />
          </Button>

          <WhatsAppOutboundLink
            waHref={whatsappUrl(WA_MSG_NAV)}
            className={cn(
              'btn-tech flex size-12 shrink-0 items-center justify-center',
              'border border-[#25D366] bg-[rgba(37,211,102,0.10)] text-[#25D366]',
              'transition-all duration-200 ease-out',
              'hover:bg-[rgba(37,211,102,0.16)] hover:shadow-[0_0_18px_-6px_rgba(37,211,102,0.35),0_0_28px_-10px_rgba(37,211,102,0.15)]',
              'active:scale-[0.97]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
            )}
            data-hover
            data-inspector-title="Abrir WhatsApp"
            data-inspector-desc="Abre wa.me en nueva pestaña y muestra la página de confirmación en esta ventana."
            data-inspector-cat="Seguridad"
            aria-label="Abrir WhatsApp"
          >
            <WhatsAppIcon className="size-5" />
          </WhatsAppOutboundLink>
        </div>
      </form>
    </SectionReveal>
  )
}
