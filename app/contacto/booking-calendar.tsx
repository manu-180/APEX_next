'use client'

import { useEffect, useRef, useState } from 'react'
import {
  m,
  AnimatePresence,
  useAnimationControls,
  useReducedMotion,
} from 'framer-motion'
import type { CSSProperties } from 'react'
import { SectionReveal } from '@/components/ui/section-reveal'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ArrowRightIcon, CalendarIcon, CheckIcon } from '@/components/ui/icons'
import { useToast } from '@/components/ui/toast'
import { BOOKING_SLOT_HOURS, BLOCKED_WEEKDAYS, formatBookingHour } from '@/lib/constants'
import { useBooking } from '@/hooks/useBooking'
import { DELAY_AFTER_PANEL, DUR_REVEAL, EASE_OUT, SPRING_FOCUS } from '@/lib/motion'
import { bookingWhatsappLocalToE164, BOOKING_WA_LOCAL_DIGITS } from '@/lib/booking-phone'
import { cn } from '@/lib/utils/cn'
import { focusRing } from './shared'

/* ────────────────────────────────────────────────────────────────────────
   Sistema de agenda (booking) — chunk dinámico de /contacto.
   Aísla @supabase/supabase-js (vía useBooking → lib/supabase/client) del
   chunk inicial de la ruta: este módulo solo se descarga cuando next/dynamic
   lo pide desde content.tsx, nunca en el bundle de First Load JS.
   ──────────────────────────────────────────────────────────────────────── */

const inputBase =
  'w-full min-h-[44px] rounded-xl border bg-[var(--color-surface-lowest)] px-4 py-2.5 text-base md:text-sm text-[var(--color-on-surface)] placeholder:text-[color-mix(in_srgb,var(--color-on-surface-variant)_50%,transparent)] outline-none transition-[border-color,box-shadow,transform,background-color] duration-200'

/* Light: campos blancos nítidos — borde tinta visible y foco con anillo del tema.
   Dark conserva el borde surface-high y el glow original. */
const inputIdle = 'border-[rgba(11,15,26,0.16)] dark:border-[var(--color-surface-high)]'
const inputFocus =
  'focus:border-[rgba(var(--color-primary-rgb),0.5)] focus:shadow-[0_0_0_3px_rgba(var(--color-primary-rgb),0.15)] dark:focus:shadow-[0_0_15px_-3px_rgba(var(--color-primary-rgb),0.2)] focus:ring-0'

const inputClassName = cn(inputBase, inputIdle, inputFocus)

const microLabel =
  'mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-on-surface-variant)] transition-colors duration-150'

/* ────────────────────────────────────────────────────────────────────────
   FormField — micro-interacción de foco (respeta reduced motion)
   Foco: micro-lift con SPRING_FOCUS + el label se enciende en primary
   (vía focus-within, el microLabel ya trae transition-colors).
   ──────────────────────────────────────────────────────────────────────── */
function FormField({ children, className }: { children: React.ReactNode; className?: string }) {
  const [focused, setFocused] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  return (
    <m.div
      className={cn('relative [&:focus-within_label]:text-[var(--color-primary)]', className)}
      animate={!prefersReducedMotion && focused ? { y: -2, scale: 1.005 } : { y: 0, scale: 1 }}
      transition={{ type: 'spring', ...SPRING_FOCUS }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
    >
      {children}
    </m.div>
  )
}

/** Flecha circular de reintento (local: no existe en el set global de íconos). */
function RetryIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Opción B — Agendar reunión (booking existente, lógica intacta)
   ──────────────────────────────────────────────────────────────────────── */

/** Validación de formato para feedback visual del email — NO gatea el envío
 *  (las guardas de handleSubmit quedan intactas). */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Micro-shake del campo incompleto (transform-only, one-shot). */
const SHAKE_KEYFRAMES = {
  x: [0, -6, 6, -4, 4, 0],
  transition: { duration: 0.4 },
}

export function BookingCalendar() {
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
    onBookedHoursChanged,
  } = useBooking()

  const prefersReducedMotion = useReducedMotion()
  const { toast } = useToast()
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'email'>('whatsapp')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  /** Solo los 8 dígitos después del 11; +54 9 se arma al enviar. */
  const [waLocalDigits, setWaLocalDigits] = useState('')
  /** Campo trampa (honeypot). Un humano nunca lo ve ni lo tabula; un bot que
   *  autocompleta todo lo llena y /api/booking/whatsapp descarta el envío
   *  devolviendo un 200 falso, sin avisarle al bot que lo detectamos. */
  const [company, setCompany] = useState('')
  /** Snapshot para la pantalla de éxito (el hook limpia selectedHour al refrescar slots). */
  const [lastBooking, setLastBooking] = useState<{
    date: Date
    hour: number
    method: 'whatsapp' | 'email'
  } | null>(null)

  /* ── Feedback inline de validación — SOLO feedback encima del flujo:
        handleSubmit, confirmBooking y sus guardas quedan intactos. ── */
  const [emailTouched, setEmailTouched] = useState(false)
  /** Igual que emailTouched: la validación del WhatsApp aparece recién cuando
   *  el usuario terminó de escribir, nunca mientras tipea (form-CRO: validar
   *  en blur, no en cada tecla). */
  const [waTouched, setWaTouched] = useState(false)
  const contactShake = useAnimationControls()
  const hoursShake = useAnimationControls()

  /** Días disponibles. Se computan recién al montar porque "hoy" depende del
   *  reloj/huso de quien renderiza: el server (UTC) puede estar en otro día que
   *  el visitante y la grilla del SSR no coincidiría con la del cliente
   *  (error de hidratación). Hasta montar, SSR muestra un skeleton estable. */
  const [dates, setDates] = useState<Date[]>([])

  useEffect(() => {
    const days: Date[] = []
    const today = new Date()
    for (let i = 0; i < 10 && days.length < 7; i++) {
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

  /* ── Feedback efímero (toasts) — se dispara en las TRANSICIONES de estado del
        hook, no en cada render. La confirmación inline (pantalla de éxito) y el
        error inline se conservan; el toast es feedback adicional, no roba foco. */
  const successNotified = useRef(false)
  useEffect(() => {
    if (success && !successNotified.current) {
      successNotified.current = true
      const when = lastBooking
        ? `${lastBooking.date.toLocaleDateString('es-AR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })} · ${formatBookingHour(lastBooking.hour)} hs`
        : undefined
      const channel = lastBooking?.method === 'email' ? 'por email' : 'por WhatsApp'
      toast({
        variant: 'success',
        title: '¡Reserva confirmada!',
        description: when
          ? `${when}. Te llega la confirmación ${channel}.`
          : `Te llega la confirmación ${channel}.`,
      })
    }
    if (!success) successNotified.current = false
  }, [success, lastBooking, toast])

  const prevSubmitError = useRef<string | null>(null)
  useEffect(() => {
    if (submitError && submitError !== prevSubmitError.current) {
      const slotTaken = /ocupad/i.test(submitError)
      toast({
        variant: 'error',
        title: slotTaken ? 'Ese horario se ocupó' : 'No pudimos confirmar',
        description: slotTaken
          ? 'Elegí otro horario libre y volvé a confirmar.'
          : 'Revisá tu conexión e intentá de nuevo. Si sigue, escribime por WhatsApp.',
      })
    }
    prevSubmitError.current = submitError
  }, [submitError, toast])

  /* ── Realtime: si la disponibilidad cambia mientras el usuario elige, avisamos
        con un toast sutil en vez de mutar la grilla en silencio (el hook ya
        debouncea las ráfagas de eventos). */
  useEffect(() => {
    onBookedHoursChanged((change) => {
      if (change.selectedHourTaken) {
        toast({
          variant: 'info',
          title: 'Ese horario se acaba de ocupar',
          description: 'Elegí otro de los que quedan libres.',
        })
      } else {
        toast({
          variant: 'info',
          title: 'Se actualizó la disponibilidad',
          description: 'Alguien reservó un horario recién.',
        })
      }
    })
    return () => onBookedHoursChanged(null)
  }, [onBookedHoursChanged, toast])

  const handleSubmit = async () => {
    if (submitting) return // anti doble-submit (defensa extra al disabled del Button)
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
      honeypot: company,
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

  /** Cuántos dígitos faltan; 0 cuando está completo. Solo feedback. */
  const waMissing = BOOKING_WA_LOCAL_DIGITS - waLocalDigits.replace(/\D/g, '').length
  const waInvalid = contactMethod === 'whatsapp' && waTouched && !waDigitsOk

  /** Solo feedback visual: no bloquea el envío (guardas intactas). */
  const emailInvalid =
    contactMethod === 'email' &&
    emailTouched &&
    contact.trim().length > 0 &&
    !EMAIL_RE.test(contact.trim())

  /** Micro-shake one-shot del elemento incompleto (gated reduced-motion). */
  const startShake = (controls: ReturnType<typeof useAnimationControls>) => {
    if (prefersReducedMotion) return
    void controls.start(SHAKE_KEYFRAMES)
  }

  /** El Button deshabilitado lleva `disabled:pointer-events-none`: el click cae
   *  en el wrapper y disparamos acá el feedback del faltante, sin tocar guardas. */
  const onBlockedSubmitAttempt = () => {
    if (canSubmit || submitting) return
    if (hydrated && !isSunday && selectedHour === null) {
      startShake(hoursShake)
      return
    }
    if (contactMethod === 'whatsapp' && !waDigitsOk) {
      setWaTouched(true)
      startShake(contactShake)
      document.getElementById('booking-wa')?.focus()
      return
    }
    if (contactMethod === 'email' && contact.trim().length === 0) {
      setEmailTouched(true)
      startShake(contactShake)
      document.getElementById('booking-email')?.focus()
    }
  }

  if (success) {
    return (
      <SectionReveal className="h-full">
        <div
          className="bento-surface bento-surface--framed noise-overlay relative flex h-full flex-col"
          data-hover
          data-inspector-title="Confirmación de agenda"
          data-inspector-desc="Reserva guardada en Supabase; la notificación sale por email (Resend) o WhatsApp (Evolution API) según el canal elegido."
          data-inspector-cat="UX · Motion"
        >
        <div className="relative z-10 flex h-full flex-1 flex-col items-center justify-center p-8 text-center sm:p-10">
          {/* Check + anillos sonar one-shot (retoman el motivo del header).
              Transform/opacity only, sin loops, gated reduced-motion. */}
          <div className="relative mb-5">
            {!prefersReducedMotion && (
              <>
                <m.span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border-2 border-[var(--color-primary)]"
                  initial={{ scale: 1, opacity: 0.55 }}
                  animate={{ scale: 2.1, opacity: 0 }}
                  transition={{ duration: DUR_REVEAL, delay: DELAY_AFTER_PANEL + 0.12, ease: EASE_OUT }}
                />
                <m.span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border border-[var(--color-primary)]"
                  initial={{ scale: 1, opacity: 0.4 }}
                  animate={{ scale: 2.9, opacity: 0 }}
                  transition={{ duration: DUR_REVEAL, delay: DELAY_AFTER_PANEL + 0.28, ease: EASE_OUT }}
                />
              </>
            )}
            <m.div
              initial={prefersReducedMotion ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="relative flex size-16 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-glow-sm"
            >
              <CheckIcon className="size-8" />
            </m.div>
          </div>

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
              setEmailTouched(false)
              setWaTouched(false)
              setCompany('')
            }}
            type="button"
          >
            Reservar otro turno
          </Button>
        </div>
        </div>
      </SectionReveal>
    )
  }

  return (
    <SectionReveal className="h-full" delay={0.08}>
      {/* Panel de decisión E3: double-bezel (--framed) + grain (.noise-overlay).
          Padding en el wrapper interior (el shell reserva el bezel-pad). */}
      <article
        className="bento-surface bento-surface--framed noise-overlay relative flex h-full flex-col"
        data-hover
        data-inspector-title="Panel de agenda"
        data-inspector-desc="Días y horarios sincronizados con Supabase; tiempo real y restricción única evitan la doble reserva. Domingos bloqueados por constantes."
        data-inspector-cat="UX · Motion"
      >
      <div className="relative z-10 flex h-full flex-1 flex-col p-6 sm:p-7">
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
        {/* La zona horaria va explícita en el panel (patrón de Shade y Wellfound
            en Mobbin): sin ella, cualquiera que no esté en Argentina reserva a
            ciegas y el turno se cae. */}
        <p className="mb-6 text-xs text-[var(--color-on-surface-variant)]">
          Lunes a sábado, de 9 a 19{' '}
          <span className="opacity-70">(hora de Argentina, GMT-3)</span>. Sin compromiso.
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
            Array.from({ length: 7 }, (_, i) => (
              <div
                key={i}
                aria-hidden="true"
                className="flex min-w-[52px] flex-shrink-0 animate-pulse flex-col items-center rounded-xl border border-transparent bg-[var(--color-surface-high)]/40 px-3 py-2 text-center"
              >
                <span className="invisible text-xs font-medium uppercase">lun</span>
                <span className="invisible text-lg font-bold tabular-nums">00</span>
              </div>
            ))}
          {dates.map((d) => {
            const isSelected = selectedDate.toDateString() === d.toDateString()
            const longLabel = d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
            return (
              <m.button
                key={d.toISOString()}
                type="button"
                whileTap={prefersReducedMotion ? undefined : { scale: 0.93 }}
                onClick={() => setSelectedDate(d)}
                aria-pressed={isSelected}
                aria-label={longLabel}
                className={cn(
                  'flex min-h-[44px] min-w-[52px] flex-shrink-0 flex-col items-center justify-center rounded-xl border px-3 py-2 text-center',
                  'transition-[transform,background-color,border-color,box-shadow,color] duration-200 ease-out',
                  'active:scale-[0.95]',
                  focusRing,
                  isSelected
                    ? 'border-[rgba(var(--color-primary-rgb),0.5)] bg-[rgba(var(--color-primary-rgb),0.12)] text-[var(--color-primary)] shadow-glow-sm'
                    : 'border-[var(--color-surface-high)] text-[var(--color-on-surface-variant)] hover:-translate-y-0.5 hover:border-[rgba(var(--color-primary-rgb),0.3)] hover:text-[var(--color-on-surface)]'
                )}
                data-hover
                data-inspector-title={longLabel}
                data-inspector-desc="Día disponible; domingos excluidos por constantes. Hover eleva la pastilla; al elegir queda con halo del tema."
                data-inspector-cat="UX · Motion"
              >
                <span className="text-xs font-medium uppercase">
                  {d.toLocaleDateString('es-AR', { weekday: 'short' })}
                </span>
                <span className="text-lg font-bold tabular-nums">{d.getDate()}</span>
              </m.button>
            )
          })}
        </div>

        {slotsError && (
          <m.div
            role="alert"
            initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-200"
          >
            <span className="min-w-0">{slotsError}</span>
            <button
              type="button"
              onClick={reloadSlots}
              disabled={loadingSlots}
              aria-busy={loadingSlots || undefined}
              className={cn(
                'group inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-red-500/40 px-2.5 py-1 font-semibold',
                'transition-[background-color,border-color,transform,opacity] duration-150 hover:bg-red-500/15 active:scale-[0.96]',
                'disabled:cursor-wait disabled:opacity-60',
                focusRing
              )}
            >
              {loadingSlots ? (
                <Spinner className="size-3.5" />
              ) : (
                <RetryIcon className="size-3.5 transition-transform duration-300 group-hover:rotate-180" />
              )}
              {loadingSlots ? 'Cargando…' : 'Reintentar'}
            </button>
          </m.div>
        )}

        {/* `isSunday` e `isHourSelectable` derivan del reloj (selectedDate nace
            de new Date() y los horarios de hoy se filtran por la hora actual):
            en SSR se muestra siempre el skeleton para no divergir del cliente. */}
        {hydrated && isSunday ? (
          <div className="mb-5 rounded-xl border border-[var(--color-surface-high)] bg-[var(--color-surface-lowest)]/50 py-8 text-center text-sm text-[var(--color-on-surface-variant)]">
            Los domingos descanso. Elegí otro día.
          </div>
        ) : (
          // Solo opacity: animar height fuerza layout en cada frame (spec §1)
          <m.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className={cn(microLabel, 'mb-0')}>Horario</p>
              {/* Las dos muestras eran casi el mismo gris: la leyenda no
                  explicaba nada. Ahora "Libre" repite el relleno del slot
                  disponible y "Ocupado" repite su borde apagado + tachado, así
                  el mapeo con la grilla es literal (y no depende solo del color). */}
              <div className="flex items-center gap-3 text-xs text-[var(--color-on-surface-variant)]">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="size-2.5 rounded-sm border border-[rgba(var(--color-primary-rgb),0.5)] bg-[rgba(var(--color-primary-rgb),0.25)]"
                  />
                  Libre
                </span>
                <span className="inline-flex items-center gap-1.5 opacity-60">
                  <span
                    aria-hidden="true"
                    className="size-2.5 rounded-sm border border-[var(--color-surface-high)] bg-transparent"
                  />
                  <span className="line-through">Ocupado</span>
                </span>
              </div>
            </div>
            {!hydrated || loadingSlots ? (
              <div className="mb-5 grid grid-cols-4 gap-2" aria-hidden="true">
                {BOOKING_SLOT_HOURS.map((h) => (
                  <div key={h} className="h-11 animate-pulse rounded-lg bg-[var(--color-surface-high)]/40" />
                ))}
              </div>
            ) : (
              <m.div
                role="group"
                aria-label="Horarios disponibles"
                animate={hoursShake}
                className="mb-5 grid grid-cols-4 gap-2"
              >
                {BOOKING_SLOT_HOURS.map((h) => {
                  const ok = isHourSelectable(h)
                  const sel = selectedHour === h
                  return (
                    <m.button
                      key={h}
                      type="button"
                      disabled={!ok}
                      onClick={() => ok && setSelectedHour(h)}
                      whileHover={!prefersReducedMotion && ok && !sel ? { scale: 1.04 } : undefined}
                      whileTap={!prefersReducedMotion && ok ? { scale: 0.94 } : undefined}
                      transition={{ duration: 0.12 }}
                      aria-pressed={sel}
                      aria-label={`${formatBookingHour(h)}${ok ? '' : ' — no disponible'}`}
                      className={cn(
                        'flex min-h-[44px] items-center justify-center rounded-lg border px-2 text-xs font-medium',
                        'transition-[transform,background-color,border-color,box-shadow,color] duration-150 ease-out',
                        focusRing,
                        !ok && 'cursor-not-allowed border-[var(--color-surface-high)] text-[var(--color-on-surface-variant)] opacity-40 line-through',
                        ok && !sel &&
                          'border-[var(--color-surface-high)] text-[var(--color-on-surface-variant)] hover:border-[rgba(var(--color-primary-rgb),0.4)] hover:text-[var(--color-on-surface)] active:scale-[0.94]',
                        sel &&
                          'border-[rgba(var(--color-primary-rgb),0.5)] bg-[rgba(var(--color-primary-rgb),0.12)] font-semibold text-[var(--color-primary)] shadow-glow-sm'
                      )}
                      data-hover
                      data-inspector-title={`${formatBookingHour(h)}${ok ? '' : ' (no disponible)'}`}
                      data-inspector-desc={ok ? 'Horario libre. Se marca con halo del tema al elegirlo.' : 'Horario ocupado o pasado: deshabilitado y tachado.'}
                      data-inspector-cat="UX · Motion"
                    >
                      {formatBookingHour(h)}
                    </m.button>
                  )
                })}
              </m.div>
            )}
          </m.div>
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
                // Cambiar de canal no debe arrastrar el error del canal anterior.
                setWaTouched(false)
                setEmailTouched(false)
              }}
              aria-pressed={contactMethod === m}
              className={cn(
                'flex min-h-[44px] flex-1 items-center justify-center rounded-lg border px-3 text-xs font-semibold',
                'transition-[transform,background-color,border-color,color] duration-150 ease-out active:scale-[0.97]',
                focusRing,
                contactMethod === m
                  ? 'border-[rgba(var(--color-primary-rgb),0.5)] bg-[rgba(var(--color-primary-rgb),0.12)] text-[var(--color-primary)]'
                  : 'border-[var(--color-surface-high)] text-[var(--color-on-surface-variant)] hover:border-[rgba(var(--color-primary-rgb),0.3)] hover:text-[var(--color-on-surface)]'
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
            <m.div
              key="wa"
              initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="mb-3"
            >
              {/* Wrapper del micro-shake (feedback al intentar confirmar incompleto) */}
              <m.div animate={contactShake}>
              <FormField>
                <label
                  htmlFor="booking-wa"
                  className={cn(microLabel, 'flex items-baseline justify-between gap-3')}
                >
                  Tu WhatsApp
                  {/* Contador vivo de dígitos: se enciende en primary al completar */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'font-mono text-[10px] tabular-nums transition-colors duration-150',
                      waDigitsOk ? 'text-[var(--color-primary)]' : 'opacity-60'
                    )}
                  >
                    {waLocalDigits.length}/{BOOKING_WA_LOCAL_DIGITS}
                  </span>
                </label>
                <div
                  className={cn(
                    inputBase,
                    'flex items-stretch gap-0 overflow-hidden px-0 py-0',
                    inputIdle,
                    'focus-within:border-[rgba(var(--color-primary-rgb),0.5)] focus-within:shadow-[0_0_0_3px_rgba(var(--color-primary-rgb),0.15)] dark:focus-within:shadow-[0_0_15px_-3px_rgba(var(--color-primary-rgb),0.2)]',
                    waInvalid &&
                      'border-red-500/60 shadow-[0_0_0_3px_rgba(239,68,68,0.12)] focus-within:border-red-500/60 focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
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
                    // El placeholder anterior (24842720) era, dígito por dígito,
                    // el número que el bot de salida tiene en su blocklist.
                    // Un ejemplo neutro evita que alguien lo copie tal cual.
                    placeholder="55551234"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    onBlur={() => setWaTouched(true)}
                    className="min-h-[44px] min-w-0 flex-1 border-0 bg-transparent py-2.5 pr-4 text-base text-[var(--color-on-surface)] outline-none placeholder:text-[color-mix(in_srgb,var(--color-on-surface-variant)_50%,transparent)] md:text-sm"
                    aria-invalid={waInvalid || undefined}
                    aria-describedby={waInvalid ? 'booking-wa-error' : 'booking-wa-help'}
                  />
                </div>
              </FormField>
              {/* Un solo mensaje a la vez: la ayuda mientras va bien; cuando el
                  campo quedó corto, el error dice exactamente qué falta. */}
              {waInvalid ? (
                <p
                  id="booking-wa-error"
                  role="alert"
                  className="mt-1.5 text-[11px] font-medium text-red-500 dark:text-red-400"
                >
                  {waMissing === BOOKING_WA_LOCAL_DIGITS
                    ? `Necesito tu celular: los ${BOOKING_WA_LOCAL_DIGITS} dígitos que van después del 11.`
                    : `Te falta${waMissing === 1 ? '' : 'n'} ${waMissing} dígito${waMissing === 1 ? '' : 's'}.`}
                </p>
              ) : (
                <p id="booking-wa-help" className="mt-1.5 text-[11px] text-[var(--color-on-surface-variant)]">
                  Solo los {BOOKING_WA_LOCAL_DIGITS} dígitos después del 11. Te confirmo al toque.
                </p>
              )}
              </m.div>
            </m.div>
          ) : (
            <m.div
              key="email"
              initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="mb-3"
            >
              {/* Wrapper del micro-shake (feedback al intentar confirmar incompleto) */}
              <m.div animate={contactShake}>
              <FormField>
                <label htmlFor="booking-email" className={microLabel}>
                  Tu email
                </label>
                <input
                  id="booking-email"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  placeholder="nombre@correo.com"
                  type="email"
                  aria-invalid={emailInvalid || undefined}
                  aria-describedby={emailInvalid ? 'booking-email-error' : undefined}
                  className={cn(
                    inputClassName,
                    emailInvalid &&
                      'border-red-500/60 shadow-[0_0_0_3px_rgba(239,68,68,0.12)] focus:border-red-500/60 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
                  )}
                  autoComplete="email"
                />
              </FormField>
              {emailInvalid && (
                <p
                  id="booking-email-error"
                  role="alert"
                  className="mt-1.5 text-[11px] font-medium text-red-500 dark:text-red-400"
                >
                  Ese email no parece válido. Revisalo antes de confirmar.
                </p>
              )}
              </m.div>
            </m.div>
          )}
        </AnimatePresence>

        {/* Error de envío */}
        <AnimatePresence>
          {submitError && (
            <m.p
              role="alert"
              initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="mb-3 text-xs font-medium text-red-500 dark:text-red-400"
            >
              {submitError}
            </m.p>
          )}
        </AnimatePresence>

        {/* Honeypot. Se saca del viewport en vez de usar display:none o
            type="hidden" (los bots saltean ambos), y queda fuera del alcance
            del teclado y del lector de pantalla con tabIndex -1 + aria-hidden. */}
        <input
          type="text"
          name="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        {/* El Button deshabilitado tiene disabled:pointer-events-none: el click
            cae en este wrapper y dispara el shake del campo incompleto.
            Feedback puro — no altera handleSubmit ni sus guardas. */}
        <div className="mt-auto" onClick={onBlockedSubmitAttempt}>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            isLoading={submitting}
            loadingText="Reservando…"
            variant="primary"
            className="group w-full"
            type="button"
            aria-label="Confirmar turno gratis"
            data-hover
            data-inspector-title="Confirmar reunión"
            data-inspector-desc="Mientras se guarda la reserva muestra spinner, se bloquea (aria-busy) y evita el doble envío. El resultado se confirma con un toast y la pantalla de éxito."
            data-inspector-cat="UX · Formulario"
          >
            Confirmar turno gratis
            <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Button>

          {/* Última objeción antes del tap: qué pasa después y qué NO pasa con
              el dato que acaban de dejar. Va pegada al botón, no en una FAQ. */}
          <p className="mt-3 text-center text-[11px] leading-relaxed text-[var(--color-on-surface-variant)]">
            Te llega la confirmación al instante. Sin compromiso y sin dar tu
            dato a nadie más.
          </p>
        </div>
      </div>
      </article>
    </SectionReveal>
  )
}
