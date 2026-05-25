'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

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

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIdx === i
        return (
          <div
            key={item.q}
            className="rounded-xl overflow-hidden transition-colors duration-300"
            style={{
              border: `1px solid ${isOpen ? 'rgba(var(--color-primary-rgb), 0.35)' : 'var(--glass-border)'}`,
              backgroundColor: 'var(--color-surface-high)',
              boxShadow: isOpen
                ? '0 8px 32px -12px rgba(var(--color-primary-rgb), 0.18)'
                : 'none',
            }}
          >
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 cursor-pointer"
            >
              <span className="text-sm font-semibold text-[var(--color-on-surface)]">
                {item.q}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.4, ease: PREMIUM_EASE }}
                className="flex-shrink-0 inline-flex text-[var(--color-primary)] select-none"
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

            <motion.div
              initial={false}
              animate={{ height: isOpen ? 'auto' : 0 }}
              transition={{ duration: 0.45, ease: PREMIUM_EASE }}
              style={{ overflow: 'hidden' }}
            >
              <motion.p
                initial={false}
                animate={{
                  opacity: isOpen ? 1 : 0,
                  y: isOpen ? 0 : -6,
                }}
                transition={{
                  duration: 0.35,
                  ease: PREMIUM_EASE,
                  delay: isOpen ? 0.1 : 0,
                }}
                className="px-5 pb-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed"
              >
                {item.a}
              </motion.p>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
