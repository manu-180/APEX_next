'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { BOOKING_SLOT_HOURS } from '@/lib/constants'
import { formatLocalDateYMD, localDayToMiddayIso } from '@/lib/date-local'

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

/**
 * Señal que el hook emite cuando la disponibilidad cambia en vivo (Realtime),
 * para que la UI pueda avisar con un toast en vez de mutar en silencio.
 * - `addedBooked`: horas que pasaron a estar ocupadas desde la última carga.
 * - `selectedHourTaken`: la hora que el usuario tenía elegida quedó ocupada.
 */
export interface BookedHoursChange {
  addedBooked: number[]
  selectedHourTaken: boolean
}

export function useBooking() {
  const supabase = useMemo(() => {
    if (!isSupabaseConfigured()) return null
    try {
      return getSupabaseBrowserClient()
    } catch {
      return null
    }
  }, [])

  const [selectedDate, setSelectedDateState] = useState(() => new Date())
  const [bookedHours, setBookedHours] = useState<Set<number>>(new Set())
  const [selectedHour, setSelectedHour] = useState<number | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slotsError, setSlotsError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  /** Callback opt-in que la UI registra para enterarse de cambios en vivo. */
  const onBookedHoursChangedRef = useRef<((change: BookedHoursChange) => void) | null>(null)
  /** Set vigente, en ref, para diffear sin re-suscribir el canal Realtime. */
  const bookedHoursRef = useRef<Set<number>>(new Set())
  /** Hora elegida, en ref, para saber si una actualización en vivo la "robó". */
  const selectedHourRef = useRef<number | null>(null)
  /** Colapsa ráfagas de eventos Realtime en una sola notificación. */
  const liveNotifyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onBookedHoursChanged = useCallback(
    (cb: ((change: BookedHoursChange) => void) | null) => {
      onBookedHoursChangedRef.current = cb
    },
    []
  )

  const loadBookedHours = useCallback(
    async (date: Date, opts?: { live?: boolean }) => {
      if (!supabase) return
      if (date.getDay() === 0) {
        setBookedHours(new Set())
        bookedHoursRef.current = new Set()
        return
      }
      const dateString = formatLocalDateYMD(date)
      // En refrescos en vivo no mostramos el skeleton: la grilla ya está poblada
      // y un parpadeo de carga sería peor que actualizar en sitio.
      if (!opts?.live) setLoadingSlots(true)
      setSlotsError(null)
      try {
        const { data, error } = await supabase.from('appointments').select('hour_slot').eq('date_slot', dateString)
        if (error) throw error
        const next = new Set((data ?? []).map((r: { hour_slot: number }) => r.hour_slot))

        if (opts?.live && onBookedHoursChangedRef.current) {
          const prev = bookedHoursRef.current
          const addedBooked = [...next].filter((h) => !prev.has(h))
          const sel = selectedHourRef.current
          const selectedHourTaken = sel !== null && !prev.has(sel) && next.has(sel)
          if (addedBooked.length > 0 || selectedHourTaken) {
            // Debounce: ante varias filas en milisegundos, un solo aviso.
            if (liveNotifyTimer.current) clearTimeout(liveNotifyTimer.current)
            const cb = onBookedHoursChangedRef.current
            liveNotifyTimer.current = setTimeout(() => {
              cb({ addedBooked, selectedHourTaken })
            }, 250)
          }
        }

        setBookedHours(next)
        bookedHoursRef.current = next
      } catch {
        setSlotsError('No se pudieron cargar los horarios. Probá de nuevo.')
        setBookedHours(new Set())
        bookedHoursRef.current = new Set()
      } finally {
        if (!opts?.live) setLoadingSlots(false)
      }
    },
    [supabase]
  )

  const setSelectedDate = useCallback((d: Date) => {
    setSelectedDateState(d)
    setSelectedHour(null)
    setSubmitError(null)
  }, [])

  useEffect(() => {
    if (!supabase) return
    if (selectedDate.getDay() === 0) {
      setBookedHours(new Set())
      return
    }
    loadBookedHours(selectedDate)
  }, [supabase, selectedDate, loadBookedHours])

  useEffect(() => {
    if (!supabase) return
    const ch = supabase
      .channel('appointments-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        loadBookedHours(selectedDate, { live: true })
      })
      .subscribe()
    return () => {
      supabase.removeChannel(ch)
    }
  }, [supabase, selectedDate, loadBookedHours])

  // Espejo de la hora elegida para el diff de Realtime (sin re-suscribir canal).
  useEffect(() => {
    selectedHourRef.current = selectedHour
  }, [selectedHour])

  // Limpia el timer de notificación en vivo al desmontar.
  useEffect(() => {
    return () => {
      if (liveNotifyTimer.current) clearTimeout(liveNotifyTimer.current)
    }
  }, [])

  const isHourSelectable = useCallback(
    (h: number) => {
      if (selectedDate.getDay() === 0) return false
      if (bookedHours.has(h)) return false
      const n = new Date()
      if (sameDay(selectedDate, n) && h <= n.getHours()) return false
      return true
    },
    [selectedDate, bookedHours]
  )

  const availableHours = useMemo(
    () => BOOKING_SLOT_HOURS.filter((h) => isHourSelectable(h)),
    [isHourSelectable]
  )

  useEffect(() => {
    if (selectedHour !== null && !isHourSelectable(selectedHour)) {
      setSelectedHour(null)
    }
  }, [selectedHour, isHourSelectable])

  const reset = useCallback(() => {
    setSuccess(false)
    setSelectedHour(null)
    setSubmitError(null)
    const today = new Date()
    setSelectedDateState(today)
    if (supabase) loadBookedHours(today)
  }, [supabase, loadBookedHours])

  const confirmBooking = useCallback(
    async (opts: {
      contactInfo: string
      contactType: 'whatsapp' | 'email'
      name?: string
    }) => {
      if (!supabase || selectedHour === null) return
      setSubmitting(true)
      setSubmitError(null)
      const dateStr = formatLocalDateYMD(selectedDate)
      const row = {
        date_slot: dateStr,
        hour_slot: selectedHour,
        contact_info: opts.contactInfo.trim(),
        contact_type: opts.contactType,
        client_name: opts.name?.trim() || null,
      }
      const { error } = await supabase.from('appointments').insert(row)
      if (error) {
        if (error.code === '23505') {
          await loadBookedHours(selectedDate)
          setSubmitError('Ese horario acaba de ser ocupado. Elegí otro.')
        } else {
          setSubmitError('No se pudo confirmar la reserva. Intentá de nuevo.')
        }
        setSubmitting(false)
        return
      }

      try {
        if (opts.contactType === 'email') {
          const { error: fnErr } = await supabase.functions.invoke('send-booking-email', {
            body: {
              name: opts.name?.trim() || 'Cliente',
              email: opts.contactInfo.trim(),
              dateIso: localDayToMiddayIso(selectedDate),
              hour: selectedHour,
            },
          })
          if (fnErr) console.error('[booking] send-booking-email', fnErr)
        } else {
          const res = await fetch('/api/booking/whatsapp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone: opts.contactInfo.trim(),
              dateIso: localDayToMiddayIso(selectedDate),
              hour: selectedHour,
              clientName: opts.name?.trim() || undefined,
            }),
          })
          if (!res.ok) {
            const j = await res.json().catch(() => ({}))
            console.error('[booking] whatsapp notify', j)
          }
        }
      } catch (e) {
        console.error('[booking] notificación post-reserva', e)
      }

      setSuccess(true)
      setSubmitting(false)
    },
    [supabase, selectedHour, selectedDate, loadBookedHours]
  )

  return {
    supabaseReady: Boolean(supabase),
    selectedDate,
    setSelectedDate,
    selectedHour,
    setSelectedHour,
    loadingSlots,
    slotsError,
    reloadSlots: () => loadBookedHours(selectedDate),
    isHourSelectable,
    availableHours,
    submitting,
    success,
    submitError,
    setSubmitError,
    confirmBooking,
    reset,
    /** Registra (o limpia con `null`) un callback para cambios de disponibilidad en vivo. */
    onBookedHoursChanged,
  }
}
