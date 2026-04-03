'use client'

import { AnimatePresence, motion, useDragControls, useReducedMotion } from 'framer-motion'
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { XIcon } from '@/components/ui/icons'

const FOCUSABLE_SELECTOR =
  'a[href], area[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export interface ServiceDrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  accentColor?: string
  dialogId?: string
}

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute('disabled') && element.tabIndex !== -1,
  )
}

export function ServiceDrawer({
  isOpen,
  onClose,
  title,
  children,
  accentColor,
  dialogId,
}: ServiceDrawerProps) {
  const shouldReduceMotion = useReducedMotion()
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)
  const previousBodyOverflowRef = useRef<string>('')
  const [isDesktop, setIsDesktop] = useState(false)
  const dragControls = useDragControls()
  const [maxDragDown, setMaxDragDown] = useState(960)

  const primaryColor = accentColor ?? 'var(--color-primary)'
  const enableMobileSwipeClose = !isDesktop && !shouldReduceMotion

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const syncViewportMode = () => setIsDesktop(mediaQuery.matches)

    syncViewportMode()
    mediaQuery.addEventListener('change', syncViewportMode)

    return () => {
      mediaQuery.removeEventListener('change', syncViewportMode)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const syncMaxDrag = () => setMaxDragDown(Math.max(window.innerHeight, 640))
    syncMaxDrag()
    window.addEventListener('resize', syncMaxDrag)
    return () => window.removeEventListener('resize', syncMaxDrag)
  }, [])

  const handleMobileChromePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!enableMobileSwipeClose) return
      const target = event.target as HTMLElement
      if (target.closest('button, a[href]')) return
      dragControls.start(event)
    },
    [dragControls, enableMobileSwipeClose],
  )

  const handleMobileDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { y: number }; velocity: { y: number } }) => {
      if (!enableMobileSwipeClose) return
      const dismissY = 112
      const dismissVy = 420
      if (info.offset.y > dismissY || info.velocity.y > dismissVy) {
        onClose()
      }
    },
    [enableMobileSwipeClose, onClose],
  )

  useEffect(() => {
    if (!isOpen) return

    previousActiveElementRef.current = document.activeElement as HTMLElement | null
    previousBodyOverflowRef.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus()
    }, 0)

    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = previousBodyOverflowRef.current
      previousActiveElementRef.current?.focus()
    }
  }, [isOpen])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return

      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const container = dialogRef.current
      if (!container) return

      const focusableElements = getFocusableElements(container)

      if (focusableElements.length === 0) {
        event.preventDefault()
        return
      }

      const firstFocusable = focusableElements[0]
      const lastFocusable = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement as HTMLElement | null

      if (event.shiftKey) {
        if (activeElement === firstFocusable || !container.contains(activeElement)) {
          event.preventDefault()
          lastFocusable.focus()
        }
        return
      }

      if (activeElement === lastFocusable) {
        event.preventDefault()
        firstFocusable.focus()
      }
    },
    [isOpen, onClose],
  )

  useEffect(() => {
    if (!isOpen) return

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown, isOpen])

  const overlayTransition = useMemo(
    () => (shouldReduceMotion ? { duration: 0.12 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }),
    [shouldReduceMotion],
  )

  const panelTransition = useMemo(
    () =>
      shouldReduceMotion
        ? { duration: 0.12 }
        : { type: 'spring' as const, damping: 32, stiffness: 310, mass: 0.86 },
    [shouldReduceMotion],
  )

  const panelSurfaceStyle = useMemo(
    () => ({
      backgroundColor: 'var(--color-surface-lowest)',
      borderColor: `color-mix(in srgb, ${primaryColor} 24%, transparent)`,
      boxShadow: `0 22px 80px -28px rgba(0,0,0,0.75), 0 0 0 1px color-mix(in srgb, ${primaryColor} 10%, transparent), 0 0 34px -18px color-mix(in srgb, ${primaryColor} 35%, transparent)`,
    }),
    [primaryColor],
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={overlayTransition}
            onClick={onClose}
            className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
          />

          <div className="pointer-events-none absolute inset-0 flex items-end justify-end md:items-stretch">
            <motion.div
              ref={dialogRef}
              id={dialogId}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              initial={isDesktop ? { x: '100%' } : { y: '100%' }}
              animate={{ x: 0, y: 0 }}
              exit={isDesktop ? { x: '100%' } : { y: '100%' }}
              transition={panelTransition}
              drag={enableMobileSwipeClose ? 'y' : false}
              dragListener={false}
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: maxDragDown }}
              dragElastic={{ top: 0, bottom: 0.2 }}
              dragSnapToOrigin
              onDragEnd={handleMobileDragEnd}
              className="pointer-events-auto relative flex w-full flex-col overflow-hidden border md:h-full md:max-w-[480px] md:rounded-none max-md:max-h-[85vh] max-md:rounded-t-3xl"
              style={panelSurfaceStyle}
            >
              <div
                className="pointer-events-none absolute left-0 right-0 top-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${primaryColor} 64%, transparent), transparent)`,
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 22%), radial-gradient(ellipse 90% 60% at 100% 0%, rgba(var(--color-primary-rgb), 0.12) 0%, transparent 60%)',
                }}
              />

              {enableMobileSwipeClose ? (
                <div
                  className="relative shrink-0 touch-none select-none"
                  onPointerDown={handleMobileChromePointerDown}
                >
                  <div className="flex justify-center pb-2 pt-3">
                    <div
                      className="h-1.5 w-12 rounded-full"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${primaryColor} 24%, var(--color-on-surface-variant))`,
                      }}
                    />
                  </div>
                  <div className="relative flex items-start justify-between gap-4 border-b border-white/5 px-5 pb-4 pt-4">
                    <h2 id={titleId} className="pr-2 text-lg font-bold leading-tight text-[var(--color-on-surface)]">
                      {title}
                    </h2>
                    <motion.button
                      ref={closeButtonRef}
                      type="button"
                      aria-label="Cerrar panel"
                      onClick={onClose}
                      whileHover={shouldReduceMotion ? undefined : { rotate: 90, scale: 1.06 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                      className="inline-flex h-9 w-9 shrink-0 touch-manipulation items-center justify-center rounded-xl border transition-colors"
                      style={{
                        color: 'var(--color-on-surface-variant)',
                        backgroundColor: `color-mix(in srgb, ${primaryColor} 8%, transparent)`,
                        borderColor: `color-mix(in srgb, ${primaryColor} 24%, transparent)`,
                      }}
                    >
                      <XIcon className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              ) : (
                <>
                  {!isDesktop && (
                    <div className="flex justify-center pb-2 pt-3">
                      <div
                        className="h-1.5 w-12 rounded-full"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${primaryColor} 24%, var(--color-on-surface-variant))`,
                        }}
                      />
                    </div>
                  )}

                  <div className="relative flex items-start justify-between gap-4 border-b border-white/5 px-5 pb-4 pt-4 md:px-6 md:pt-6">
                    <h2 id={titleId} className="pr-2 text-lg font-bold leading-tight text-[var(--color-on-surface)]">
                      {title}
                    </h2>
                    <motion.button
                      ref={closeButtonRef}
                      type="button"
                      aria-label="Cerrar panel"
                      onClick={onClose}
                      whileHover={shouldReduceMotion ? undefined : { rotate: 90, scale: 1.06 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors"
                      style={{
                        color: 'var(--color-on-surface-variant)',
                        backgroundColor: `color-mix(in srgb, ${primaryColor} 8%, transparent)`,
                        borderColor: `color-mix(in srgb, ${primaryColor} 24%, transparent)`,
                      }}
                    >
                      <XIcon className="h-4 w-4" />
                    </motion.button>
                  </div>
                </>
              )}

              <div className="relative overflow-y-auto px-5 pb-6 pt-4 md:px-6 md:pb-7 md:pt-5">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
