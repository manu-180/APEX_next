'use client'

import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

interface FaqItem {
  q: string
  a: string
}

interface FaqAccordionProps {
  items: ReadonlyArray<FaqItem>
}

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIdx, setOpenIdx] = useState<number>(0)
  const prefersReducedMotion = useReducedMotion()
  const baseId = useId()

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIdx === i
        const panelId = `${baseId}-faq-panel-${i}`
        const buttonId = `${baseId}-faq-button-${i}`
        return (
          <div
            key={item.q}
            className="rounded-xl overflow-hidden transition-[border-color,box-shadow] duration-300"
            style={{
              border: `1px solid ${isOpen ? 'rgba(var(--color-primary-rgb), 0.35)' : 'var(--glass-border)'}`,
              backgroundColor: 'var(--color-surface-high)',
              boxShadow: isOpen
                ? '0 8px 32px -12px rgba(var(--color-primary-rgb), 0.18)'
                : 'none',
            }}
          >
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                onClick={() => setOpenIdx(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="group w-full flex items-center justify-between px-5 py-4 text-left gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-high)] focus-visible:rounded-xl"
              >
                <span
                  className={
                    'text-sm font-semibold transition-colors duration-200 ' +
                    (isOpen
                      ? 'text-[var(--color-on-surface)]'
                      : 'text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)]')
                  }
                >
                  {item.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.3, ease: PREMIUM_EASE }
                  }
                  className="flex-shrink-0 inline-flex text-[var(--color-primary)] select-none transition-opacity duration-200 opacity-70 group-hover:opacity-100"
                  aria-hidden
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.25}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </motion.span>
              </button>
            </h3>

            {prefersReducedMotion ? (
              isOpen ? (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="px-5 pb-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed"
                >
                  {item.a}
                </div>
              ) : null
            ) : (
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.34, ease: PREMIUM_EASE },
                      opacity: { duration: 0.22, ease: PREMIUM_EASE },
                    }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="px-5 pb-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        )
      })}
    </div>
  )
}
