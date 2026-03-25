'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionReveal } from '@/components/ui/section-reveal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GridBackground } from '@/components/ui/grid-background'
import { CalendarIcon, SendIcon, StarIcon, CheckIcon, WhatsAppIcon } from '@/components/ui/icons'
import { BOOKING_HOURS, BLOCKED_WEEKDAYS, WHATSAPP_NUMBER } from '@/lib/constants'
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

export function ContactoContent() {
  return (
    <>
      {/* Header */}
      <section className="relative pt-20 pb-8 overflow-hidden">
        <GridBackground />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <SectionReveal>
            <Badge variant="primary" className="mb-4">Contacto</Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4">
              Hablemos de tu proyecto
            </h1>
            <p className="mx-auto max-w-xl text-on-surface-variant">
              Agendá una reunión gratuita o mandame un mensaje directo.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Booking + Form */}
      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <BookingCalendar />
          <ContactForm />
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-surface-lowest/50">
        <div className="mx-auto max-w-4xl px-6">
          <SectionReveal>
            <div className="text-center mb-12">
              <Badge variant="primary" className="mb-4">Opiniones</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface mb-3">
                Lo que dicen mis clientes
              </h2>
              <div className="flex items-center justify-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon key={s} className="h-5 w-5 text-amber-400" filled={s <= Math.round(Number(AVG_RATING))} />
                  ))}
                </div>
                <span className="text-lg font-bold text-on-surface">{AVG_RATING}</span>
                <span className="text-sm text-on-surface-variant">({REVIEWS.length} opiniones)</span>
              </div>
            </div>
          </SectionReveal>

          <div className="space-y-4">
            {REVIEWS.map((r, i) => (
              <SectionReveal key={r.id} delay={i * 0.06}>
                <div className="rounded-xl border border-surface-high bg-surface-low/50 p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-12 text-primary text-sm font-bold">
                        {r.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{r.name}</p>
                        <p className="text-xs text-on-surface-variant">{new Date(r.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'short' })}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <StarIcon key={s} className="h-3.5 w-3.5 text-amber-400" filled={s <= r.rating} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{r.text}</p>
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'email'>('whatsapp')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [success, setSuccess] = useState(false)

  // Generate next 14 days excluding blocked weekdays
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

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime || !contact) return
    setSuccess(true)
  }

  if (success) {
    return (
      <SectionReveal>
        <div className="rounded-2xl border border-primary/30 bg-primary-8 p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground"
          >
            <CheckIcon className="h-8 w-8" />
          </motion.div>
          <h3 className="text-xl font-bold text-on-surface mb-2">¡Reunión Agendada!</h3>
          <p className="text-sm text-on-surface-variant">
            Te contactaré brevemente para confirmar los detalles.
          </p>
        </div>
      </SectionReveal>
    )
  }

  return (
    <SectionReveal>
      <div className="rounded-2xl border border-surface-high bg-surface-low/50 p-6">
        <h3 className="text-lg font-bold text-on-surface mb-1 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          Agenda inteligente
        </h3>
        <p className="text-xs text-on-surface-variant mb-5">Seleccioná fecha y horario</p>

        {/* Date picker */}
        <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-5">
          {dates.map((d) => {
            const isSelected = selectedDate?.toDateString() === d.toDateString()
            return (
              <button
                key={d.toISOString()}
                onClick={() => setSelectedDate(d)}
                className={cn(
                  'flex-shrink-0 flex flex-col items-center rounded-xl px-3 py-2 text-center transition-all border min-w-[52px]',
                  isSelected ? 'border-primary bg-primary-12 text-primary' : 'border-surface-high hover:border-primary/30 text-on-surface-variant'
                )}
                data-hover
              >
                <span className="text-[10px] uppercase font-medium">
                  {d.toLocaleDateString('es-AR', { weekday: 'short' })}
                </span>
                <span className="text-lg font-bold">{d.getDate()}</span>
              </button>
            )
          })}
        </div>

        {/* Time slots */}
        {selectedDate && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            <p className="text-xs text-on-surface-variant mb-2">Horario</p>
            <div className="grid grid-cols-4 gap-2 mb-5">
              {BOOKING_HOURS.map((h) => (
                <button
                  key={h}
                  onClick={() => setSelectedTime(h)}
                  className={cn(
                    'rounded-lg border px-2 py-2 text-xs font-medium transition-all',
                    selectedTime === h ? 'border-primary bg-primary-12 text-primary' : 'border-surface-high text-on-surface-variant hover:border-primary/30'
                  )}
                  data-hover
                >
                  {h}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Contact method */}
        <div className="flex gap-2 mb-4">
          {(['whatsapp', 'email'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setContactMethod(m)}
              className={cn(
                'flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-all capitalize',
                contactMethod === m ? 'border-primary bg-primary-12 text-primary' : 'border-surface-high text-on-surface-variant'
              )}
              data-hover
            >
              {m === 'whatsapp' ? 'WhatsApp' : 'Email'}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre (opcional)"
          className="w-full mb-3 rounded-xl border border-surface-high bg-surface-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-1 focus:ring-primary/50"
        />
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder={contactMethod === 'whatsapp' ? 'Tu número de WhatsApp' : 'Tu email'}
          className="w-full mb-5 rounded-xl border border-surface-high bg-surface-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-1 focus:ring-primary/50"
        />

        <Button
          onClick={handleSubmit}
          disabled={!selectedDate || !selectedTime || !contact}
          variant="primary"
          className="w-full"
        >
          Agendar reunión
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </SectionReveal>
  )
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.message) return
    setSent(true)
  }

  if (sent) {
    return (
      <SectionReveal delay={0.1}>
        <div className="rounded-2xl border border-primary/30 bg-primary-8 p-8 text-center h-full flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground"
          >
            <SendIcon className="h-7 w-7" />
          </motion.div>
          <h3 className="text-xl font-bold text-on-surface mb-2">¡Mensaje enviado!</h3>
          <p className="text-sm text-on-surface-variant">
            Te respondo en menos de 24 horas.
          </p>
        </div>
      </SectionReveal>
    )
  }

  return (
    <SectionReveal delay={0.1}>
      <form onSubmit={handleSubmit} className="rounded-2xl border border-surface-high bg-surface-low/50 p-6 h-full flex flex-col">
        <h3 className="text-lg font-bold text-on-surface mb-1 flex items-center gap-2">
          <SendIcon className="h-5 w-5 text-primary" />
          Mensaje directo
        </h3>
        <p className="text-xs text-on-surface-variant mb-5">O escribime directamente</p>

        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Tu nombre (opcional)"
          className="w-full mb-3 rounded-xl border border-surface-high bg-surface-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-1 focus:ring-primary/50"
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Tu email *"
          type="email"
          required
          className="w-full mb-3 rounded-xl border border-surface-high bg-surface-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-1 focus:ring-primary/50"
        />
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Contame sobre tu proyecto *"
          required
          rows={5}
          className="w-full mb-5 flex-1 rounded-xl border border-surface-high bg-surface-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-1 focus:ring-primary/50 resize-none"
        />

        <div className="flex gap-3">
          <Button type="submit" variant="primary" className="flex-1">
            Enviar mensaje
            <SendIcon className="h-4 w-4" />
          </Button>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
            data-hover
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
        </div>
      </form>
    </SectionReveal>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  )
}
