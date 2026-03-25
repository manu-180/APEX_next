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
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { whatsappUrl, WA_MSG_NAV } from '@/lib/whatsapp'
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

const inputClassName =
  'w-full rounded-xl border border-[var(--color-surface-high)] bg-[var(--color-surface-lowest)] px-4 py-2.5 text-sm text-[var(--color-on-surface)] placeholder:text-[color-mix(in_srgb,var(--color-on-surface-variant)_50%,transparent)] outline-none focus:ring-1 focus:ring-[rgba(var(--color-primary-rgb),0.5)] focus:shadow-[0_0_15px_-3px_rgba(var(--color-primary-rgb),0.2)]'

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
      {/* Header */}
      <motion.section
        ref={headerRef}
        className="relative pt-20 pb-8 overflow-hidden"
        style={{
          opacity: headerOpacity,
          maskImage: headerMask,
          WebkitMaskImage: headerMask,
        }}
        data-hover
        data-inspector-title="Hero que respira con el scroll"
        data-inspector-desc="Esta cabecera se desvanece al bajar y la máscara suaviza el corte con el contenido. El fondo de ondas tipo sónar sigue el cursor: anillos que se expanden como un radar, coherente con la idea de ‘contacto y alcance’."
        data-inspector-cat="Performance"
        onMouseMove={(e) => {
          const rect = headerRef.current?.getBoundingClientRect()
          if (rect) bgCursorRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true }
        }}
        onMouseLeave={() => { bgCursorRef.current = { x: -1, y: -1, active: false } }}
      >
        <GridBackground />
        <SonarWavesBg cursorRef={bgCursorRef} />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <SectionReveal>
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
              <Badge variant="primary">Contacto</Badge>
              <Badge variant="outline">Diseño premium</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--color-on-surface)] mb-4">
              Hablemos de tu proyecto
            </h1>
            <p className="mx-auto max-w-xl text-[var(--color-on-surface-variant)]">
              Agendá una reunión gratuita o mandame un mensaje directo.
            </p>
          </SectionReveal>
        </div>
      </motion.section>

      {/* Booking + Form */}
      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <BookingCalendar />
          <ContactForm />
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-[var(--color-surface-base)]">
        <div className="mx-auto max-w-4xl px-6">
          <SectionReveal>
            <div
              className="text-center mb-12"
              data-hover
              data-inspector-title="Resumen de opiniones"
              data-inspector-desc="Promedio y estrellas calculados a partir de las reseñas de ejemplo: el número y las estrellas llenas se redondean para lectura rápida. Abajo, cada tarjeta es una opinión con avatar inicial y fecha localizada."
              data-inspector-cat="UX · Motion"
            >
              <Badge variant="primary" className="mb-4">Opiniones</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-on-surface)] mb-3">
                Lo que dicen mis clientes
              </h2>
              <div className="flex items-center justify-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon
                      key={s}
                      className="h-5 w-5 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.4)]"
                      filled={s <= Math.round(Number(AVG_RATING))}
                    />
                  ))}
                </div>
                <span className="text-lg font-bold text-[var(--color-on-surface)]">{AVG_RATING}</span>
                <span className="text-sm text-[var(--color-on-surface-variant)]">({REVIEWS.length} opiniones)</span>
              </div>
            </div>
          </SectionReveal>

          <div className="space-y-4">
            {REVIEWS.map((r, i) => (
              <SectionReveal key={r.id} delay={i * 0.06}>
                <div
                  className="rounded-xl glass-card p-5"
                  data-hover
                  data-inspector-title={`Reseña: ${r.name}`}
                  data-inspector-desc="Tarjeta de testimonio con iniciales en círculo, fecha en español argentino y estrellas por opinión. En producción estos datos podrían venir de una base; aquí muestran el layout listo para datos reales."
                  data-inspector-cat="UX · Motion"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(var(--color-primary-rgb),0.12)] text-[var(--color-primary)] text-sm font-bold">
                        {r.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-on-surface)]">{r.name}</p>
                        <p className="text-xs text-[var(--color-on-surface-variant)]">{new Date(r.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'short' })}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <StarIcon
                          key={s}
                          className="h-3.5 w-3.5 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.4)]"
                          filled={s <= r.rating}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{r.text}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

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
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
          >
            <CheckIcon className="h-8 w-8" />
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
          <CalendarIcon className="h-5 w-5 text-[var(--color-primary)]" />
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
              <button
                key={d.toISOString()}
                type="button"
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
                <span className="text-lg font-bold">{d.getDate()}</span>
              </button>
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
                  <span className="h-2 w-2 rounded-sm bg-[var(--color-surface-high)]" /> Ocupado
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-[rgba(var(--color-primary-rgb),0.4)]" /> Libre
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
                    <button
                      key={h}
                      type="button"
                      disabled={!ok}
                      onClick={() => ok && setSelectedHour(h)}
                      className={cn(
                        'rounded-lg border px-2 py-2 text-xs font-medium transition-all',
                        !ok && 'cursor-not-allowed opacity-40 line-through',
                        ok && !sel && 'border-[var(--color-surface-high)] text-[var(--color-on-surface-variant)] hover:border-[rgba(var(--color-primary-rgb),0.3)]',
                        sel && 'border-[rgba(var(--color-primary-rgb),0.5)] bg-[rgba(var(--color-primary-rgb),0.12)] text-[var(--color-primary)] shadow-glow-sm'
                      )}
                      data-hover
                      data-inspector-title={`${formatBookingHour(h)}${ok ? '' : ' (no disponible)'}`}
                      data-inspector-cat="UX · Motion"
                    >
                      {formatBookingHour(h)}
                    </button>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}

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

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre (opcional)"
          className={cn(inputClassName, 'mb-3')}
          autoComplete="name"
        />
        {contactMethod === 'whatsapp' ? (
          <div className="mb-3">
            <div
              className={cn(
                inputClassName,
                'flex items-stretch gap-0 overflow-hidden px-0 py-0 focus-within:ring-1 focus-within:ring-[rgba(var(--color-primary-rgb),0.5)] focus-within:shadow-[0_0_15px_-3px_rgba(var(--color-primary-rgb),0.2)]'
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
            <p className="mt-1.5 text-[11px] text-[var(--color-on-surface-variant)]">
              Completá los {BOOKING_WA_LOCAL_DIGITS} dígitos de tu celular; se arma +54 9 11… automáticamente.
            </p>
          </div>
        ) : (
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Tu email"
            type="email"
            className={cn(inputClassName, 'mb-3')}
            autoComplete="email"
          />
        )}

        {submitError && (
          <p className="mb-3 text-xs font-medium text-red-400" role="alert">
            {submitError}
          </p>
        )}

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
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </SectionReveal>
  )
}

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
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
          >
            <SendIcon className="h-7 w-7" />
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
        data-inspector-desc="Nombre opcional, email y mensaje obligatorios; envío por submit nativo interceptado en React. El botón de WhatsApp al lado abre conversación externa sin abandonar el layout del formulario."
        data-inspector-cat="UX · Formulario"
      >
        <h3 className="text-lg font-bold text-[var(--color-on-surface)] mb-1 flex items-center gap-2">
          <SendIcon className="h-5 w-5 text-[var(--color-primary)]" />
          Mensaje directo
        </h3>
        <p className="text-xs text-[var(--color-on-surface-variant)] mb-5">O escribime directamente</p>

        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Tu nombre *"
          required
          minLength={2}
          className={cn(inputClassName, 'mb-3')}
          data-hover
          data-inspector-title="Nombre"
          data-inspector-desc="Requerido por la función de envío (mín. 2 caracteres), igual que en APEX Flutter."
          data-inspector-cat="UX · Formulario"
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Tu email *"
          type="email"
          required
          className={cn(inputClassName, 'mb-3')}
          data-hover
          data-inspector-title="Email *"
          data-inspector-desc="Campo requerido con tipo email nativo: el navegador valida formato básico antes de disparar el submit."
          data-inspector-cat="UX · Formulario"
        />
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Contame sobre tu proyecto *"
          required
          minLength={10}
          rows={5}
          className={cn(inputClassName, 'mb-3 flex-1 resize-none')}
          data-hover
          data-inspector-title="Mensaje *"
          data-inspector-desc="Mínimo 10 caracteres para coincidir con la Edge Function."
          data-inspector-cat="UX · Formulario"
        />

        {formError && (
          <p className="mb-3 text-xs font-medium text-red-400" role="alert">
            {formError}
          </p>
        )}

        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={sending}
            data-hover
            data-inspector-title="Enviar mensaje"
            data-inspector-desc="Invoca send-contact-email en Supabase."
            data-inspector-cat="UX · Formulario"
          >
            {sending ? 'Enviando…' : 'Enviar mensaje'}
            <SendIcon className="h-4 w-4" />
          </Button>
          <a
            href={whatsappUrl(WA_MSG_NAV)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 hover:shadow-[0_0_15px_rgba(37,211,102,0.3)] transition-colors"
            data-hover
            data-inspector-title="Abrir WhatsApp"
            data-inspector-desc="Enlace directo a wa.me con tu número configurado: nueva pestaña y rel noopener para que WhatsApp no acceda a window.opener. Atajo verde al lado del envío por formulario."
            data-inspector-cat="Seguridad"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
        </div>
      </form>
    </SectionReveal>
  )
}
