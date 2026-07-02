'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/utils/cn'
import { CheckIcon, XIcon } from '@/components/ui/icons'

type ToastVariant = 'default' | 'success' | 'error' | 'info'

export interface ToastOptions {
  title: string
  description?: string
  variant?: ToastVariant
  /** ms antes de auto-cerrar. `0` = persistente (cierre manual). Default 4000. */
  duration?: number
}

interface ToastItem {
  id: number
  title: string
  description?: string
  variant: ToastVariant
  duration: number
}

interface ToastContextValue {
  toast: (opts: ToastOptions) => number
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

/** Hook de feedback efímero. Accesible (aria-live), no roba foco, auto-dismiss. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return ctx
}

let counter = 0 // fuente de id monotónica (sin Date.now/random)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id))
    const tm = timers.current.get(id)
    if (tm) {
      clearTimeout(tm)
      timers.current.delete(id)
    }
  }, [])

  const toast = useCallback(
    (opts: ToastOptions) => {
      const id = ++counter
      const item: ToastItem = {
        id,
        title: opts.title,
        description: opts.description,
        variant: opts.variant ?? 'default',
        duration: opts.duration ?? 4000,
      }
      setToasts((list) => [...list, item].slice(-4)) // máx 4 visibles
      if (item.duration > 0) {
        timers.current.set(id, setTimeout(() => dismiss(id), item.duration))
      }
      return id
    },
    [dismiss]
  )

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

function Toaster({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[]
  onDismiss: (id: number) => void
}) {
  const reduce = useReducedMotion()
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 flex flex-col items-center gap-2 px-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:items-end sm:px-6"
      style={{ zIndex: 'var(--z-toast)' }}
      role="region"
      aria-label="Notificaciones"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout={!reduce}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.97 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 8, scale: 0.97, transition: { duration: 0.18 } }
            }
            transition={{ duration: 0.28, ease: EASE_OUT }}
            className="pointer-events-auto w-full max-w-sm"
          >
            <ToastCard toast={t} onDismiss={() => onDismiss(t.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const accent =
    toast.variant === 'success'
      ? 'var(--color-online)'
      : toast.variant === 'error'
        ? 'var(--color-offline)'
        : 'var(--color-primary)'

  return (
    <div
      role="status"
      className="glass flex items-start gap-3 rounded-xl border border-[var(--color-outline)] p-3.5 shadow-glow-sm"
      style={{ borderLeftWidth: 3, borderLeftColor: accent }}
    >
      {(toast.variant === 'success' || toast.variant === 'error') && (
        <span
          className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full"
          style={{ background: `color-mix(in srgb, ${accent} 18%, transparent)`, color: accent }}
          aria-hidden="true"
        >
          {toast.variant === 'success' ? (
            <CheckIcon className="size-3" />
          ) : (
            <XIcon className="size-3" />
          )}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-snug text-[var(--color-on-surface)]">
          {toast.title}
        </p>
        {toast.description && (
          <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-on-surface-variant)]">
            {toast.description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Cerrar notificación"
        className={cn(
          'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md text-[var(--color-on-surface-variant)]',
          'transition-colors hover:bg-[var(--color-surface-high)] hover:text-[var(--color-on-surface)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]'
        )}
      >
        <XIcon className="size-3.5" />
      </button>
    </div>
  )
}
