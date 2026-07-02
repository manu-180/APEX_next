'use client'

import { Fragment, useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/utils/cn'

interface FaqItem {
  q: string
  a: string
}

/** Sub-header editorial que agrupa las preguntas a partir de `startIndex`. */
interface FaqGroup {
  label: string
  startIndex: number
}

interface FaqAccordionProps {
  items: ReadonlyArray<FaqItem>
  /**
   * Agrupación editorial opcional. Los grupos son bloques CONTIGUOS sobre el
   * orden original de `items` (el orden canónico alimenta el JSON-LD FAQPage
   * y NO se altera acá).
   */
  groups?: ReadonlyArray<FaqGroup>
}

/**
 * FAQ editorial (spec v2): lista única con hairlines (`divide-y` de
 * --glass-border), índice font-mono por pregunta y border-l-2 primary en la
 * fila abierta. La respuesta entra con opacity+y+blur mientras el alto anima.
 */
export function FaqAccordion({ items, groups }: FaqAccordionProps) {
  const [openIdx, setOpenIdx] = useState<number>(0)
  const prefersReducedMotion = useReducedMotion()
  const baseId = useId()

  return (
    <div className="divide-y divide-[color:var(--glass-border)] border-b border-[color:var(--glass-border)]">
      {items.map((item, i) => {
        const isOpen = openIdx === i
        const panelId = `${baseId}-faq-panel-${i}`
        const buttonId = `${baseId}-faq-button-${i}`
        const groupLabel = groups?.find((g) => g.startIndex === i)?.label

        const answerClassName =
          'pb-5 pl-14 pr-5 text-sm text-[var(--color-on-surface-variant)] leading-relaxed'

        return (
          <Fragment key={item.q}>
            {groupLabel && (
              <p className="editorial-label editorial-label--primary pb-3 pt-8 first:pt-0">
                {groupLabel}
              </p>
            )}
            <div
              className={cn(
                'border-l-2 transition-[border-color,background-color] duration-300',
                isOpen
                  ? 'border-l-[var(--color-primary)] bg-[rgba(var(--color-primary-rgb),0.03)]'
                  : 'border-l-transparent',
              )}
            >
              <h3 className="m-0">
                <button
                  type="button"
                  id={buttonId}
                  onClick={() => setOpenIdx(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="group flex w-full items-baseline justify-between gap-4 px-4 py-5 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)] focus-visible:rounded-lg"
                >
                  <span className="flex min-w-0 items-baseline gap-3">
                    {/* Numeración editorial — identidad del sitio (spec §10) */}
                    <span
                      aria-hidden
                      className="w-7 shrink-0 font-mono text-xs font-bold tabular-nums"
                      style={{ color: 'rgba(var(--color-primary-rgb), 0.6)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={cn(
                        'text-base font-semibold transition-colors duration-200',
                        isOpen
                          ? 'text-[var(--color-on-surface)]'
                          : 'text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)]',
                      )}
                    >
                      {item.q}
                    </span>
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { duration: 0.3, ease: EASE_OUT }
                    }
                    className="inline-flex flex-shrink-0 select-none self-center text-[var(--color-primary)] opacity-70 transition-opacity duration-200 group-hover:opacity-100"
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
                    className={answerClassName}
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
                        height: { duration: 0.34, ease: EASE_OUT },
                        opacity: { duration: 0.22, ease: EASE_OUT },
                      }}
                      style={{ overflow: 'hidden' }}
                    >
                      {/* Blur solo en la entrada one-shot (spec §1) */}
                      <motion.p
                        initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          filter: 'blur(0px)',
                          transitionEnd: { filter: 'none' },
                        }}
                        transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.08 }}
                        className={answerClassName}
                      >
                        {item.a}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}
